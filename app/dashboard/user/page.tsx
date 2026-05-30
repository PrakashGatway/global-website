// "use client";

// import axiosInstance from "@/app/axiosInstance";
// import { useGlobal } from "@/src/statecontext";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Plus, ChevronDown, ChevronUp, User, Phone, Mail, Calendar, MapPin, Globe, CreditCard, BookOpen, GraduationCap, FileText, Clock, Shield, Users, Wallet, Flag, Heart, Briefcase, Home, Lock, Key, Award, Star, CheckCircle, XCircle, Eye, Download, Upload, FileCheck, FileX } from "lucide-react";
// import { useRouter } from "next/navigation";

// import { toast } from "react-hot-toast";

// /* ─── Types ──────────────────────────────────────────────────────────── */
// interface EducationHistory {
//   address?: string;
//   city?: string;
//   country?: string;
//   degreeName?: string;
//   educationLevel?: string;
//   endDate?: string;
//   gradingScheme?: string;
//   institutionName?: string;
//   postalCode?: string;
//   startDate?: string;
//   state?: string;
//   [key: string]: unknown;
// }

// interface EnglishProficiencyScore {
//   englishStatus?: string;
//   englishTest?: string;
//   reading?: string;
//   listening?: string;
//   writing?: string;
//   speaking?: string;
//   overall?: string;
// }

// interface HighestAcademic {
//   countryOfEducation?: string;
//   highestEducationLevel?: string;
//   gradingScheme?: string;
//   graduated?: boolean;
// }

// interface Preferences {
//   preferredCountries?: string[];
//   preferredIntake?: string[];
//   preferredCourse?: string[];
//   budgetRange?: {
//     min?: number;
//     max?: number;
//     currency?: string;
//   };
// }

// interface Document {
//   key: string;
//   url: string;
//   status: 'pending' | 'approved' | 'rejected';
//   uploadedAt?: string;
//   notes?: string;
// }

// interface ProfileData {
//   createdAt?: string;
//   currentAddress?: {
//     addressLine1?: string;
//     addressLine2?: string;
//     city?: string;
//     country?: string;
//     postalCode?: string;
//     state?: string;
//   };
//   documents?: Record<string, Document>;
//   educationHistory?: EducationHistory[];
//   englishProficiencyScore?: EnglishProficiencyScore;
//   highestAcademic?: HighestAcademic;
//   otherDetails?: string;
//   preferences?: Preferences;
//   profileCompletion?: number;
//   updatedAt?: string;
//   user?: string;
//   validVisas?: string[];
//   _id?: string;
// }

// interface ReferralUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   status: string;
//   role: string;
//   referalCode: string;
//   wallet: number;
//   createdAt: string;
//   updatedAt?: string;
//   assignedTo?: string;
//   referalBy?: string;
//   maritalStatus?: string;
//   dateOfBirth?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   gender?: string;
//   firstLanguage?: string;
//   nationality?: string;
//   passportNumber?: string;
//   passportExpiry?: string;
//   hasAcceptedTerms?: boolean;
//   lastLogin?: string;
//   profileImage?: string;
//   profile?: ProfileData;
//   [key: string]: unknown;
// }

// interface Application {
//   id: string;
//   applicationNumber?: string;
//   course?: {
//     name?: string;
//     university?: {
//       name?: string;
//     };
//   };
//   intake?: string;
//   primaryStatus?: string;
//   updatedAt?: string;
//   [key: string]: unknown;
// }

// /* ─── Helpers ────────────────────────────────────────────────────────── */
// function useDebounce<T>(value: T, delay: number): T {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debounced;
// }

// function StatusPill({ status }: { status: string }) {
//   const colors: Record<string, string> = {
//     Active: "bg-emerald-100 text-emerald-700 ring-emerald-200",
//     Inactive: "bg-rose-100 text-rose-700 ring-rose-200",
//     Pending: "bg-amber-100 text-amber-700 ring-amber-200",
//     VIEWED: "bg-blue-100 text-[#fa6a3f] ring-blue-200",
//     NEW: "bg-purple-100 text-purple-700 ring-purple-200",
//     CONTACTED: "bg-indigo-100 text-indigo-700 ring-indigo-200",
//     CONVERTED: "bg-green-100 text-green-700 ring-green-200",
//     submitted: "bg-cyan-100 text-cyan-700 ring-cyan-200",
//     accepted: "bg-green-100 text-green-700 ring-green-200",
//     rejected: "bg-red-100 text-red-700 ring-red-200",
//     approved: "bg-green-100 text-green-700 ring-green-200",
//   };
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${colors[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}>
//       <span className="w-1.5 h-1.5 rounded-full bg-current" />
//       {status}
//     </span>
//   );
// }

// function InfoSection({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
//   const [isExpanded, setIsExpanded] = useState(true);

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//       <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
//       >
//         <div className="flex items-center gap-2">
//           {Icon && <Icon className="w-4 h-4 text-violet-500" />}
//           <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{title}</h3>
//         </div>
//         {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
//       </button>
//       <AnimatePresence>
//         {isExpanded && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="overflow-hidden"
//           >
//             <div className="p-4 space-y-2">
//               {children}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function InfoRow({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: any }) {
//   if (!value || value === "" || value === "undefined" || (Array.isArray(value) && value.length === 0)) return null;
//   return (
//     <div className="flex items-start gap-3 text-sm py-1.5 border-b border-gray-100 last:border-0">
//       {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />}
//       <span className="text-gray-500 min-w-[140px]">{label}:</span>
//       <span className="text-gray-800 flex-1 break-words">{value}</span>
//     </div>
//   );
// }

// // Document Card Component
// function DocumentCard({ document, documentName, onApprove, onReject, onPreview }: {
//   document: Document;
//   documentName: string;
//   onApprove: (docName: string) => void;
//   onReject: (docName: string) => void;
//   onPreview: (url: string) => void;
// }) {
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return 'bg-green-100 text-green-700 border-green-200';
//       case 'rejected':
//         return 'bg-red-100 text-red-700 border-red-200';
//       default:
//         return 'bg-amber-100 text-amber-700 border-amber-200';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return <CheckCircle className="w-4 h-4" />;
//       case 'rejected':
//         return <XCircle className="w-4 h-4" />;
//       default:
//         return <Clock className="w-4 h-4" />;
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-all"
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-2">
//             <FileText className="w-5 h-5 text-violet-500" />
//             <h4 className="font-semibold text-gray-800 capitalize">
//               {documentName.replace(/([A-Z])/g, ' $1').trim()}
//             </h4>
//             <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
//               {getStatusIcon(document.status)}
//               {document.status}
//             </span>
//           </div>

//           <p className="text-xs text-gray-500 mb-2">
//             Uploaded: {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'N/A'}
//           </p>

//           {document.notes && (
//             <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mt-2">
//               Notes: {document.notes}
//             </p>
//           )}
//         </div>

//         <div className="flex items-center gap-2 ml-4">
//           <button
//             onClick={() => onPreview(document.url)}
//             className="p-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
//             title="Preview"
//           >
//             <Eye className="w-4 h-4" />
//           </button>

//           <a
//             href={document.url}
//             download
//             target="_blank"
//             rel="noopener noreferrer"
//             className="p-2 text-gray-600 hover:text-[#f56e45] hover:bg-blue-50 rounded-lg transition-colors"
//             title="Download"
//           >
//             <Download className="w-4 h-4" />
//           </a>

//           {document.status !== 'approved' && (
//             <button
//               onClick={() => onApprove(documentName)}
//               className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//               title="Approve"
//             >
//               <CheckCircle className="w-4 h-4" />
//             </button>
//           )}

//           {document.status !== 'rejected' && (
//             <button
//               onClick={() => onReject(documentName)}
//               className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               title="Reject"
//             >
//               <XCircle className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // Document Preview Modal
// function DocumentPreviewModal({ url, onClose }: { url: string; onClose: () => void }) {
//   const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.startsWith('data:image');
//   const fullUrl = url.startsWith('http') ? url :
//     process.env.NODE_ENV === "development"
//       ? `http://localhost:5000${url}`
//       : url;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.95, opacity: 0 }}
//         className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
//           <h3 className="font-semibold text-base sm:text-lg">Document Preview</h3>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="overflow-auto max-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
//           {isImage ? (
//             <img
//               src={fullUrl}
//               alt="Document preview"
//               className="max-w-full h-auto max-h-[50vh] object-contain rounded-lg"
//             />
//           ) : (
//             <iframe
//               src={fullUrl}
//               className="w-full h-[50vh] min-h-[300px] rounded-lg"
//               title="Document Preview"
//               sandbox="allow-scripts allow-same-origin"
//             />
//           )}
//         </div>

//         <div className="mt-4 flex justify-end gap-2">
//           <a
//             href={fullUrl}
//             download
//             target="_blank"
//             rel="noopener noreferrer"
//             className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
//           >
//             <Download className="w-4 h-4" />
//             Download
//           </a>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// /* ─── Detail Sidebar Component ───────────────────────────────────────── */
// function StudentDetailSidebar({
//   user,
//   onClose,
//   applications,
// }: {
//   user: ReferralUser;
//   onClose: () => void;
//   applications: Application[];
// }) {
  
//   const {allProfile,update,setupdate} = useGlobal()
//   const [profile,setprofile] = useState(user.profile || allProfile?.profile);
//   // Get documents from profile
//   const documents = profile?.documents || {};
//   const [activeTab, setActiveTab] = useState<"info" | "applications" | "documents">("info");
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [updatingDocs, setUpdatingDocs] = useState<Record<string, boolean>>({});


//   const formatDate = (date: string | undefined) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatCurrency = (amount: number | undefined) => {
//     if (!amount) return "N/A";
//     return `₹${amount.toLocaleString()}`;
//   };


//   const handleDocumentStatus = async (
//   documentName: string,
//   status: boolean
// ) => {
//   setUpdatingDocs((prev) => ({
//     ...prev,
//     [documentName]: true,
//   }));

//   try {
//     // Create updated documents object with the new status for the specific document
//     const updatedDocuments = {
//       ...documents,
//       [documentName]: {
//         ...documents[documentName],
//         status: status ? "true" : "false" // Convert boolean to string "true"/"false"
//       }
//     };

//     // Send the entire updated documents object to the API
//     const response = await axiosInstance.patch(
//       "/auth/edit-doc",
//       {
//         userId: user._id,
//         documents: updatedDocuments
//       }
//     );

//     if (response.data.success) {
     
//       setupdate(!update);
//       console.log(update)
//       toast.success(
//         `${documentName} ${
//           status ? "approved" : "rejected"
//         } successfully`
//       );}

//   } catch (error: any) {
//     console.error(
//       `Error updating :`,
//       error
//     );
//     // toast.error(error.response?.data?.message || "Failed to update document status");
//   } finally {
//     setUpdatingDocs((prev) => ({
//       ...prev,
//       [documentName]: false,
//     }));
//   }
// };

//   const handlePreview = (url: string) => {
//     setPreviewUrl(url);
//   };

  
//   useEffect(() => {
//     setprofile(user.profile || allProfile?.profile)
    
//   },[update,allProfile])
  
//   // Document statistics
//   const totalDocuments = Object.keys(documents).length;
//   const approvedDocs = Object.values(documents).filter(doc => doc.status === 'approved').length;
//   const pendingDocs = Object.values(documents).filter(doc => doc.status === 'pending').length;
//   const rejectedDocs = Object.values(documents).filter(doc => doc.status === 'rejected').length;

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 300 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 300 }}
//       transition={{ duration: 0.3 }}
//       className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
//     >
//       {/* Header */}
//       <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
//               {user.name?.[0]?.toUpperCase() ?? "?"}
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-800 capitalize">{user.name}</h2>
//               <div className="flex items-center gap-2 mt-0.5">
//                 <StatusPill status={user.status} />
//                 <span className="text-xs text-gray-400">{user.role}</span>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Profile Completion Bar */}
//         {profile?.profileCompletion && (
//           <div className="px-4 pb-3">
//             <div className="flex justify-between text-xs text-gray-500 mb-1">
//               <span>Profile Completion</span>
//               <span>{profile.profileCompletion}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-1.5">
//               <div
//                 className="bg-violet-600 h-1.5 rounded-full transition-all duration-500"
//                 style={{ width: `${profile.profileCompletion}%` }}
//               />
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200 px-4">
//           <button
//             onClick={() => setActiveTab("info")}
//             className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === "info"
//               ? "text-violet-600"
//               : "text-gray-500 hover:text-gray-700"
//               }`}
//           >
//             Info
//             {activeTab === "info" && (
//               <motion.div
//                 layoutId="activeTab"
//                 className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"
//               />
//             )}
//           </button>
//           <button
//             onClick={() => setActiveTab("applications")}
//             className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === "applications"
//               ? "text-violet-600"
//               : "text-gray-500 hover:text-gray-700"
//               }`}
//           >
//             Applications ({applications.length})
//             {activeTab === "applications" && (
//               <motion.div
//                 layoutId="activeTab"
//                 className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"
//               />
//             )}
//           </button>
//           <button
//             onClick={() => setActiveTab("documents")}
//             className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === "documents"
//               ? "text-violet-600"
//               : "text-gray-500 hover:text-gray-700"
//               }`}
//           >
//             Documents ({totalDocuments})
//             {activeTab === "documents" && (
//               <motion.div
//                 layoutId="activeTab"
//                 className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"
//               />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6 space-y-4">
//         <AnimatePresence mode="wait">
//           {activeTab === "info" ? (
//             <motion.div
//               key="info"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.2 }}
//               className="space-y-4"
//             >
//               {/* Basic Information */}
//               <InfoSection title="BASIC INFORMATION" icon={User}>
//                 <InfoRow label="Full Name" value={user.name} icon={User} />
//                 <InfoRow label="Email" value={user.email} icon={Mail} />
//                 <InfoRow label="Phone" value={user.phone} icon={Phone} />
//                 <InfoRow label="Gender" value={user.gender} icon={Users} />
//                 <InfoRow label="Marital Status" value={user.maritalStatus} />
//                 <InfoRow label="Date of Birth" value={formatDate(user.dateOfBirth)} icon={Calendar} />
//                 <InfoRow label="First Language" value={user.firstLanguage} />
//                 <InfoRow label="Nationality" value={user.nationality} icon={Flag} />
//               </InfoSection>

//               {/* Address Information */}
//               {(user.city || user.state || user.country || profile?.currentAddress) && (
//                 <InfoSection title="ADDRESS INFORMATION" icon={MapPin}>
//                   <InfoRow label="City" value={user.city} icon={MapPin} />
//                   <InfoRow label="State" value={user.state} />
//                   <InfoRow label="Country" value={user.country} icon={Globe} />
//                   {profile?.currentAddress && (
//                     <>
//                       <InfoRow label="Address Line 1" value={profile.currentAddress.addressLine1} icon={Home} />
//                       <InfoRow label="Address Line 2" value={profile.currentAddress.addressLine2} />
//                       <InfoRow label="Postal Code" value={profile.currentAddress.postalCode} />
//                     </>
//                   )}
//                 </InfoSection>
//               )}

//               {/* Passport Information */}
//               {(user.passportNumber || user.passportExpiry) && (
//                 <InfoSection title="PASSPORT INFORMATION" icon={CreditCard}>
//                   <InfoRow label="Passport Number" value={user.passportNumber} />
//                   <InfoRow label="Passport Expiry" value={formatDate(user.passportExpiry)} icon={Calendar} />
//                   {profile?.validVisas && profile.validVisas.length > 0 && (
//                     <InfoRow label="Valid Visas" value={profile.validVisas.join(", ")} />
//                   )}
//                 </InfoSection>
//               )}

//               {/* Account Information */}
//               <InfoSection title="ACCOUNT INFORMATION" icon={Shield}>
//                 <InfoRow label="Referral Code" value={user.referalCode} icon={Key} />
//                 <InfoRow label="Referral By" value={user.referalBy} icon={Users} />
//                 <InfoRow label="Assigned To" value={user.assignedTo} />
//                 <InfoRow label="Wallet Balance" value={formatCurrency(user.wallet)} icon={Wallet} />
//                 <InfoRow label="Status" value={<StatusPill status={user.status} />} />
//                 <InfoRow label="Member Since" value={formatDate(user.createdAt)} icon={Clock} />
//                 <InfoRow label="Last Login" value={formatDate(user.lastLogin)} icon={Clock} />
//                 <InfoRow label="Terms Accepted" value={user.hasAcceptedTerms ? "Yes" : "No"} />
//               </InfoSection>

//               {/* Education History */}
//               {profile?.educationHistory && profile.educationHistory.length > 0 && (
//                 <InfoSection title="EDUCATION HISTORY" icon={GraduationCap}>
//                   {profile.educationHistory.map((edu, idx) => (
//                     <div key={idx} className="mb-3 last:mb-0 p-3 bg-gray-50 rounded-lg">
//                       <p className="font-semibold text-gray-800">{edu.degreeName || edu.educationLevel}</p>
//                       <p className="text-sm text-gray-600">{edu.institutionName}</p>
//                       <div className="text-xs text-gray-500 mt-1">
//                         {edu.startDate && edu.endDate && `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {edu.city && `${edu.city}, ${edu.state}, ${edu.country}`}
//                       </div>
//                       {edu.gradingScheme && <div className="text-xs text-gray-500">Grading: {edu.gradingScheme}</div>}
//                     </div>
//                   ))}
//                 </InfoSection>
//               )}

//               {/* English Proficiency */}
//               {profile?.englishProficiencyScore && (
//                 <InfoSection title="ENGLISH PROFICIENCY" icon={Award}>
//                   <InfoRow label="English Status" value={profile.englishProficiencyScore.englishStatus} />
//                   <InfoRow label="Test Type" value={profile.englishProficiencyScore.englishTest} />
//                   {profile.englishProficiencyScore.reading && (
//                     <div className="grid grid-cols-2 gap-2 ml-7">
//                       <InfoRow label="Reading" value={profile.englishProficiencyScore.reading} />
//                       <InfoRow label="Listening" value={profile.englishProficiencyScore.listening} />
//                       <InfoRow label="Writing" value={profile.englishProficiencyScore.writing} />
//                       <InfoRow label="Speaking" value={profile.englishProficiencyScore.speaking} />
//                       <InfoRow label="Overall" value={profile.englishProficiencyScore.overall} />
//                     </div>
//                   )}
//                 </InfoSection>
//               )}

//               {/* Highest Academic */}
//               {profile?.highestAcademic && (
//                 <InfoSection title="HIGHEST ACADEMIC QUALIFICATION" icon={Star}>
//                   <InfoRow label="Education Level" value={profile.highestAcademic.highestEducationLevel} />
//                   <InfoRow label="Country of Education" value={profile.highestAcademic.countryOfEducation} icon={Flag} />
//                   <InfoRow label="Grading Scheme" value={profile.highestAcademic.gradingScheme} />
//                   <InfoRow label="Graduated" value={profile.highestAcademic.graduated ? "Yes" : "No"} />
//                 </InfoSection>
//               )}

//               {/* Study Preferences */}
//               {profile?.preferences && (
//                 <InfoSection title="STUDY PREFERENCES" icon={Briefcase}>
//                   {profile.preferences.preferredCountries && profile.preferences.preferredCountries.length > 0 && (
//                     <InfoRow label="Preferred Countries" value={profile.preferences.preferredCountries.join(", ")} icon={Globe} />
//                   )}
//                   {profile.preferences.preferredIntake && profile.preferences.preferredIntake.length > 0 && (
//                     <InfoRow label="Preferred Intake" value={profile.preferences.preferredIntake.join(", ")} icon={Calendar} />
//                   )}
//                   {profile.preferences.preferredCourse && profile.preferences.preferredCourse.length > 0 && (
//                     <InfoRow label="Preferred Course" value={profile.preferences.preferredCourse.join(", ")} icon={BookOpen} />
//                   )}
//                   {profile.preferences.budgetRange && (
//                     <InfoRow
//                       label="Budget Range"
//                       value={`${profile.preferences.budgetRange.currency || "₹"} ${profile.preferences.budgetRange.min?.toLocaleString()} - ${profile.preferences.budgetRange.max?.toLocaleString()}`}
//                       icon={Wallet}
//                     />
//                   )}
//                 </InfoSection>
//               )}
//             </motion.div>
//           ) : activeTab === "applications" ? (
//             <motion.div
//               key="applications"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.2 }}
//               className="space-y-3"
//             >
//               {applications.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="text-gray-400 text-6xl mb-4">📄</div>
//                   <p className="text-gray-500">No applications found</p>
//                   <p className="text-xs text-gray-400 mt-1">Applications will appear here once submitted</p>
//                 </div>
//               ) : (
//                 applications.map((app, index) => (
//                   <motion.div
//                     key={app.id || index}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <h4 className="font-semibold text-gray-800">{app.applicationNumber || "Application"}</h4>
//                           {app.primaryStatus && <StatusPill status={app.primaryStatus} />}
//                         </div>
//                         {app.course?.name && (
//                           <p className="text-sm text-gray-700 font-medium">{app.course.name}</p>
//                         )}
//                         {app.course?.university?.name && (
//                           <p className="text-xs text-gray-500 mt-0.5">{app.course.university.name}</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 text-sm mt-2">
//                       {app.intake && (
//                         <p><span className="text-gray-500">Intake:</span> {app.intake}</p>
//                       )}
//                       {app.updatedAt && (
//                         <p><span className="text-gray-500">Updated:</span> {formatDate(app.updatedAt as string)}</p>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))
//               )}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="documents"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.2 }}
//               className="space-y-4"
//             >
//               {/* Document Statistics */}
//               {totalDocuments > 0 && (
//                 <div className="grid grid-cols-3 gap-3 mb-4">
//                   <div className="bg-blue-50 rounded-xl p-3 text-center">
//                     <FileText className="w-5 h-5 text-[#f56e45] mx-auto mb-1" />
//                     <p className="text-2xl font-bold text-[#f56e45]">{totalDocuments}</p>
//                     <p className="text-xs text-gray-600">Total</p>
//                   </div>
//                   <div className="bg-green-50 rounded-xl p-3 text-center">
//                     <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
//                     <p className="text-2xl font-bold text-green-600">{approvedDocs}</p>
//                     <p className="text-xs text-gray-600">Approved</p>
//                   </div>
//                   <div className="bg-amber-50 rounded-xl p-3 text-center">
//                     <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
//                     <p className="text-2xl font-bold text-amber-600">{pendingDocs}</p>
//                     <p className="text-xs text-gray-600">Pending</p>
//                   </div>
//                 </div>
//               )}

//               {/* Documents List */}
//               {totalDocuments === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="text-gray-400 text-6xl mb-4">📄</div>
//                   <p className="text-gray-500">No documents uploaded</p>
//                   <p className="text-xs text-gray-400 mt-1">Documents will appear here once uploaded by student</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {Object.entries(documents).map(([docName, doc]) => (
//                     <DocumentCard
//                       key={docName}
//                       document={doc as Document}
//                       documentName={docName}
//                       onApprove={() =>
//                         handleDocumentStatus(docName, true)
//                       }
//                       onReject={() =>
//                         handleDocumentStatus(docName, false)
//                       }
//                       onPreview={handlePreview}
//                     />
//                   ))}
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Document Preview Modal */}
//       <AnimatePresence>
//         {previewUrl && (
//           <DocumentPreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// /* ─── Main Page ──────────────────────────────────────────────────────── */
// const Page = () => {
//   const { profile } = useGlobal();

//   /* Search state */
//   const [query, setQuery] = useState("");
//   const debouncedQuery = useDebounce(query, 500);

//   /* Referral list state */
//   const [referralList, setReferralList] = useState<ReferralUser[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<ReferralUser | null>(null);
//   const [applications, setApplications] = useState<Application[]>([]);
//   const router = useRouter();

//   /* Debounced API call */
//   const fetchReferrals = useCallback(async (code: string, id: string) => {
//     if (!code) {
//       setReferralList([]);
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get(`/users/code/${code}/${id}`);
//       const data: ReferralUser[] = response.data.data ?? [];
//       setReferralList(Array.isArray(data) ? data : [data]);
//     } catch (err) {
//       console.error("Error fetching referrals:", err);
//       setReferralList([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch applications
//   const fetchApplications = useCallback(async (userId: string) => {
//     try {
//       const response = await axiosInstance.get(`/applications/?studentid=${userId}`);
//       return response.data.data || [];
//     } catch (err) {
//       console.error("Error fetching applications:", err);
//       return [];
//     }
//   }, []);

//   useEffect(() => {
//     fetchReferrals(debouncedQuery || profile?.referalCode || "", profile?._id || "");
//   }, [debouncedQuery, profile?.referalCode, fetchReferrals]);

//   const handleSelectUser = async (user: ReferralUser) => {
//     setSelectedUser(user);
//     const apps = await fetchApplications(user._id);
//     setApplications(apps);
//   };

//   /* ── Render ── */
//   return (
//     <div className="min-h-screen ">
//       <div className="container mx-auto  space-y-6">
//         {/* Student List Section */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-5 border-b border-gray-100">
//             <div className='flex justify-between items-center flex-wrap gap-3'>
//               <div>
//                 <h2 className="text-xl font-bold text-gray-800">Student List</h2>
//                 <p className="text-sm text-gray-500 mt-1">Manage and view all your referred students</p>
//               </div>
//               <button
//                 className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
//                 onClick={() => { router.push("/dashboard/application_details") }}
//               >
//                 <Plus className="w-4 h-4" />
//                 Add New Student
//               </button>
//             </div>

//             {/* Search input */}
//             <div className="relative mt-4">
//               <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//                 🔍
//               </span>
//               <input
//                 type="text"
//                 value={query}
//                 onChange={e => setQuery(e.target.value)}
//                 placeholder="Search by name, email, or phone..."
//                 className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
//               />
//             </div>
//           </div>

//           {/* Student Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-50">
//                 <tr className="text-sm text-gray-500 border-b border-gray-200">
//                   <th className="py-3 px-5 font-medium">Student</th>
//                   <th className="py-3 px-5 font-medium">Contact</th>
//                   <th className="py-3 px-5 font-medium">Email</th>
//                   <th className="py-3 px-5 font-medium">Referral Code</th>
//                   <th className="py-3 px-5 font-medium">Wallet</th>
//                   <th className="py-3 px-5 font-medium">Status</th>
//                   <th className="py-3 px-5 font-medium">Joined</th>
//                   <th className="py-3 px-5 font-medium">Updated</th>
//                   <th className="py-3 px-5 font-medium text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {loading && referralList.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="p-8 text-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
//                       <p className="mt-3 text-sm text-gray-500">Loading students...</p>
//                     </td>
//                   </tr>
//                 ) : referralList.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="p-8 text-center">
//                       <p className="text-gray-400 text-sm">No students found</p>
//                     </td>
//                   </tr>
//                 ) : (
//                   referralList.map((student) => (
//                     <motion.tr
//                       key={student._id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="hover:bg-gray-50 transition-colors cursor-pointer group"
//                     >
//                       <td className="py-4 px-5">
//                         <div className="flex items-center gap-3">
//                           <div>
//                             <p className="font-semibold text-gray-800 capitalize">{student.name}</p>
//                             <p className="text-xs text-gray-400">{student.gender || "N/A"}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-4 px-5">
//                         <p className="text-sm text-gray-600">{student.phone || "N/A"}</p>
//                       </td>
//                       <td className="py-4 px-5">
//                         <p className="text-sm text-gray-600 truncate max-w-[200px]">{student.email || "N/A"}</p>
//                       </td>
//                       <td className="py-4 px-5">
//                         <code className="text-xs bg-gray-100 px-2 py-1 rounded">{student.referalCode || "N/A"}</code>
//                       </td>
//                       <td className="py-4 px-5">
//                         <span className="text-sm font-medium text-emerald-600">₹{student.wallet?.toLocaleString() || 0}</span>
//                       </td>
//                       <td className="py-4 px-5">
//                         <StatusPill status={student.status} />
//                       </td>
//                       <td className="py-4 px-5">
//                         <p className="text-xs text-gray-500">{new Date(student.createdAt).toLocaleDateString()}</p>
//                       </td>
//                       <td className="py-4 px-5">
//                         <p className="text-xs text-gray-500">{new Date(student.updatedAt).toLocaleDateString()}</p>
//                       </td>
//                       <td className="py-4 px-5 text-right">
//                         <button
//                           onClick={() => handleSelectUser(student)}
//                           className="text-violet-600 text-sm font-medium hover:text-violet-700 transition-colors"
//                         >
//                           View Details →
//                         </button>
//                       </td>
//                     </motion.tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Stats Footer */}
//           {referralList.length > 0 && (
//             <div className="p-4 border-t border-gray-100 bg-gray-50">
//               <p className="text-sm text-gray-500">
//                 Showing <span className="font-semibold text-gray-700">{referralList.length}</span> students
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Detail Sidebar */}
//       <AnimatePresence>
//         {selectedUser && (
//           <StudentDetailSidebar
//             user={selectedUser}
//             onClose={() => setSelectedUser(null)}
//             applications={applications}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Page;

















"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Mail,
  Phone,
  Link2,
  Trash2,
  X,
  ChevronLeft,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import { useGlobal } from "@/src/statecontext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── Import the Student Details Page Component ───────────────────────
import StudentDetailsPage from "@/components/dashboard/selectedUser";

/* ─── Types ────────────────────────────────────────────────────────── */
interface EducationHistory {
  address?: string;
  city?: string;
  country?: string;
  degreeName?: string;
  educationLevel?: string;
  endDate?: string;
  gradingScheme?: string;
  institutionName?: string;
  postalCode?: string;
  startDate?: string;
  state?: string;
  [key: string]: unknown;
}

interface EnglishProficiencyScore {
  englishStatus?: string;
  englishTest?: string;
  reading?: string;
  listening?: string;
  writing?: string;
  speaking?: string;
  overall?: string;
}

interface HighestAcademic {
  countryOfEducation?: string;
  highestEducationLevel?: string;
  gradingScheme?: string;
  graduated?: boolean;
}

interface Preferences {
  preferredCountries?: string[];
  preferredIntake?: string[];
  preferredCourse?: string[];
  budgetRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
}

interface Document {
  key: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt?: string;
  notes?: string;
}

interface ProfileData {
  createdAt?: string;
  currentAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    state?: string;
  };
  documents?: Record<string, Document>;
  educationHistory?: EducationHistory[];
  englishProficiencyScore?: EnglishProficiencyScore;
  highestAcademic?: HighestAcademic;
  otherDetails?: string;
  preferences?: Preferences;
  profileCompletion?: number;
  updatedAt?: string;
  user?: string;
  validVisas?: string[];
  _id?: string;
}

interface ReferralUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  referalCode: string;
  wallet: number;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  referalBy?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  city?: string;
  state?: string;
  country?: string;
  gender?: string;
  firstLanguage?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  hasAcceptedTerms?: boolean;
  lastLogin?: string;
  profileImage?: string;
  profile?: ProfileData;
  [key: string]: unknown;
}

interface Application {
  id: string;
  applicationNumber?: string;
  course?: {
    name?: string;
    university?: {
      name?: string;
    };
  };
  intake?: string;
  primaryStatus?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/* ─── Helpers ──────────────────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/* ─── Main Page ────────────────────────────────────────────────────── */
export default function StudentsPage() {
  const filters = ["Country", "Year", "Status"];
  const { profile } = useGlobal();

  /* Search state */
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  /* Referral list state */
  const [referralList, setReferralList] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(false);

  /* ─── NEW: Detail view state ───────────────────────────────────── */
  const [selectedUser, setSelectedUser] = useState<ReferralUser | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const router = useRouter();

  /* Debounced API call */
  const fetchReferrals = useCallback(async (code: string, id: string) => {
    if (!code) {
      setReferralList([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/users/code/${code}/${id}`);
      const data: ReferralUser[] = response.data.data ?? [];
      setReferralList(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      setReferralList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Fetch applications for a student */
  const fetchApplications = useCallback(async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/applications/?studentid=${userId}`);
      return response.data.data || [];
    } catch (err) {
      console.error("Error fetching applications:", err);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchReferrals(debouncedQuery || profile?.referalCode || "", profile?._id || "");
  }, [debouncedQuery, profile?.referalCode, fetchReferrals]);

  /* ─── NEW: Handle row click → open detail view ─────────────────── */
  const handleSelectUser = async (student: ReferralUser) => {
    setDetailLoading(true);
    setSelectedUser(student);

    // Fetch applications for this student
    const apps = await fetchApplications(student._id);
    setApplications(apps);

    setDetailLoading(false);
  };

  /* ─── NEW: Close detail view ───────────────────────────────────── */
  const handleCloseDetail = () => {
    setSelectedUser(null);
    setApplications([]);
  };

  return (
    <div className="min-h-screen p-4 relative">
      {/* ════════════════════════════════════════════════════════════════
          LIST VIEW (shown when no student is selected)
          ════════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {!selectedUser ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Students
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Manage your Students and their Profiles
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3  text- text-sm font-semibold">
                <button className="h-12 px-5 bg-[#f56e45] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#fa6a3f] transition">
                  Register New Student
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8  text-sm">
              {filters.map((item) => (
                <button
                  key={item}
                  className="bg-white h-12 border border-gray-200 rounded-lg px-4 flex items-center 
                  justify-between text-gray-600 hover:border-gray-300"
                >
                  <span className="truncate">{item}</span>
                  <ChevronDown size={18} />
                </button>
              ))}
              <div className="relative flex-1 max-w-full sm:max-w-md">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-12  pl-12 pr-4 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button className="h-12  px-8 bg-[#f56e45] text-white rounded-lg font-semibold hover:bg-[#fa6a3f]">
                Search
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-4 border-[#f56e45] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 mt-3">Loading students...</p>
              </div>
            )}

            {/* Desktop Table */}
            {!loading && (
              <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px]  text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-4 py-6 text-gray-500 font-semibold">
                          Student Name
                        </th>
                        <th className="text-left px-4 py-6 text-gray-500 font-semibold">
                          Email
                        </th>
                        <th className="text-left px-4 py-6 text-gray-500 font-semibold">
                          Created On
                        </th>
                        <th className="text-left px-4 py-6 text-gray-500 font-semibold">
                          Updated On
                        </th>
                        <th className="text-left px-4 py-6 text-gray-500 font-semibold">
                          Phone Number
                        </th>
                        <th className="text-left px-4 py-6 text-gray-500 font-semibold">
                          Nationality
                        </th>
                        <th className="text-left px-4 py-6 text-gray-500 font-semibold">
                          Status
                        </th>
                        <th className="px-4 py-6"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {referralList.map((student, idx) => (
                        <tr
                          key={idx}
                          onClick={() => handleSelectUser(student)}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-6 font-medium text-gray-800">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f56e45] to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                                {student.name?.[0]?.toUpperCase() ?? "?"}
                              </div>
                              {student.name}
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail size={16} className="text-[#f56e45]" />
                              {student.email}
                            </div>
                          </td>
                          <td className="px-4 py-6 text-gray-600">
                            {student.createdAt?.split("T")[0]}
                          </td>
                          <td className="px-4 py-6 text-gray-600">
                            {student.updatedAt?.split("T")[0]}
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone size={16} className="text-[#f56e45]" />
                              {student.phone}
                            </div>
                          </td>
                          <td className="px-4 py-6 text-gray-600">
                            {student.nationality || "N/A"}
                          </td>
                          <td className="px-4 py-6">
                            <span className="px-4 py-2 rounded-lg bg-blue-50 text-[#fa6a3f] text-sm font-medium">
                              {student.status}
                            </span>
                          </td>
                          <td className="px-4 py-6">
                            <ChevronDown
                              size={18}
                              className="text-gray-400 -rotate-90"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-5 px-6 py-5 border-t">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Show</span>
                    <select className="h-10 px-4 border rounded-lg">
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                    <span className="text-gray-500">Entries</span>
                  </div>
                  <div className="text-gray-500">
                    Showing {referralList.length} students
                  </div>
                </div>
              </div>
            )}

            {/* Mobile & Tablet Cards */}
            {!loading && (
              <div className="lg:hidden space-y-4">
                {referralList.map((student, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectUser(student)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f56e45] to-orange-600 flex items-center justify-center text-white font-bold">
                          {student.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <p className="text-sm text-gray-500">
                            {student.createdAt?.split("T")[0]}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-blue-50 text-[#fa6a3f] text-xs font-medium">
                        {student.status}
                      </span>
                    </div>

                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex items-center gap-2 break-all text-gray-600">
                        <Mail size={16} className="text-[#f56e45]" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} className="text-[#f56e45]" />
                        {student.phone}
                      </div>
                      <div className="text-gray-600">
                        <span className="text-gray-400">Nationality:</span>{" "}
                        {student.nationality || "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* ════════════════════════════════════════════════════════════════
             DETAIL VIEW (shown when a student is selected)
             ════════════════════════════════════════════════════════════════ */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Back Button */}
            <button
              onClick={handleCloseDetail}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Back to Students</span>
            </button>

            {/* Loading State for Detail */}
            {detailLoading ? (
              <div className="bg-white rounded-2xl shadow-sm p-20 text-center">
                <div className="inline-block w-10 h-10 border-4 border-[#f56e45] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 mt-4">Loading student details...</p>
              </div>
            ) : (
              /* Pass data to StudentDetailsPage */
              <StudentDetailsPage
                user={selectedUser}
                applications={applications}
                onClose={handleCloseDetail}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}