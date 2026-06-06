"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileCheck,
    FileText,
    CheckCircle,
    Upload,
    Trash2,
    Eye,
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

const OOSHAS_DOCUMENTS = [
    { key: 'application_form', name: 'Application Form', description: 'Signed application form prepared by OOSHAS' },
    { key: 'counseling_report', name: 'Counseling Report', description: 'Detailed counseling summary' },
    { key: 'university_shortlist', name: 'University Shortlist', description: 'Finalized university list' },
    { key: 'offer_letters', name: 'Offer Letters', description: 'Received offer letters from universities' },
    { key: 'visa_guidance', name: 'Visa Guidance Document', description: 'Visa application support documents' },
];

interface DocumentSectionProps {
    title: string;
    icon: React.ReactNode;
    documents: Array<{
        key: string;
        name: string;
        institution?: string;
        description?: string;
        data?: DocumentData;
        isMandatory: boolean;
    }>;
    onUpload: (docKey: string, docName: string) => void;
    onView: (docUrl: string) => void;
    onDelete: (docKey: string, docName: string) => void;
    isExpanded: boolean;
    onToggle: () => void;
    uploadingDoc: string | null;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
    title,
    icon,
    documents,
    onUpload,
    onView,
    onDelete,
    isExpanded,
    onToggle,
    uploadingDoc,
}) => {
    const completedCount = documents.filter(d => d.data?.url).length;

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
                                                <div className="flex items-center gap-2 mb-2">
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

                                                <div className="space-y-1">
                                                    {doc.description && (
                                                        <p className="text-xs text-gray-500">{doc.description}</p>
                                                    )}
                                                    {doc.institution && (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-gray-500">Required for:</span>
                                                            <span className="font-medium text-gray-700">{doc.institution}</span>
                                                        </div>
                                                    )}
                                                    {doc.data?.uploadedAt && (
                                                        <div className="flex items-center gap-2 text-xs">
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
                                                    {doc.data?.url && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg max-w-full">
                                                                <File className="w-4 h-4 text-[#F26D44] shrink-0" />
                                                                <span className="text-xs text-gray-700 truncate max-w-[150px] sm:max-w-[200px]">
                                                                    {doc.data.originalName || doc.data.fileName || `${doc.key}.pdf`}
                                                                </span>
                                                                <button
                                                                    onClick={() => onDelete(doc.key, doc.name)}
                                                                    className="ml-1 text-red-400 hover:text-red-600 transition-colors shrink-0"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                                                {doc.data?.url && (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${doc.data.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        doc.data.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {(doc.data.status || 'pending').charAt(0).toUpperCase() + (doc.data.status || 'pending').slice(1)}
                                                    </span>
                                                )}

                                                {isUploading ? (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                                                        <Loader2 className="w-4 h-4 animate-spin text-[#F26D44]" />
                                                        <span className="text-xs font-medium text-gray-600">Uploading...</span>
                                                    </div>
                                                ) : !doc.data?.url ? (
                                                    <button
                                                        onClick={() => onUpload(doc.key, doc.name)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#F26D44] text-[#F26D44] rounded-lg hover:bg-orange-50 transition-colors font-medium text-xs sm:text-sm"
                                                    >
                                                        <Upload className="w-4 h-4" />
                                                        Upload
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onView(doc.data.url)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-[#F26D44] text-white rounded-lg hover:bg-[#E55A33] transition-colors font-medium text-xs sm:text-sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
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
        </div>
    );
};

// ─── Main Documents Component ─────────────────────
const Documents: React.FC<DocumentsProps> = ({ profile, studentId, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'your-documents' | 'ooshas-documents'>('your-documents');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'not-uploaded'>('all');
    const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        mandatory: true,
        'non-mandatory': false,
        ooshas: true,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentUploadKey, setCurrentUploadKey] = useState<string | null>(null);
    const [currentUploadName, setCurrentUploadName] = useState<string | null>(null);

    // Map profile documents to our structure
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

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleUpload = (docKey: string, docName: string) => {
        setCurrentUploadKey(docKey);
        setCurrentUploadName(docName);
        fileInputRef.current?.click();
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

    const handleView = (docUrl: string) => {
        window.open(docUrl, '_blank');
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

    const filteredMandatory = filterDocs(yourMandatoryDocs);
    const filteredNonMandatory = filterDocs(yourNonMandatoryDocs);

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
                    />
                </>
            )}

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