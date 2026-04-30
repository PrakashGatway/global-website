// "use client";

// import axiosInstance from "@/app/axiosInstance";
// import { useGlobal } from "@/src/statecontext";
// import { Info, Plus, Search, ChevronLeft, ChevronRight, Edit } from "lucide-react";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import Add_application from "@/components/dashboard/application/add_application";
// import { useRouter } from 'next/navigation';

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
//   applications: { applicationNumber: string }[];
//   [key: string]: unknown;
// }

// function useDebounce<T>(value: T, delay: number): T {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debounced;
// }

// function Badge({
//   label,
//   value,
//   accent = false,
// }: {
//   label: string;
//   value: React.ReactNode;
//   accent?: boolean;
// }) {
//   return (
//     <div
//       className={`flex flex-col gap-0.5 p-3 rounded-xl border ${accent ? "border-violet-200 bg-violet-50" : "border-slate-100 bg-slate-50"}`}
//     >
//       <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
//         {label}
//       </span>
//       <span className={`text-sm font-semibold ${accent ? "text-violet-700" : "text-slate-700"}`}>
//         {value}
//       </span>
//     </div>
//   );
// }

// function StatusPill({ status }: { status: string }) {
//   const colors: Record<string, string> = {
//     Active: "bg-emerald-100 text-emerald-700 ring-emerald-200",
//     Inactive: "bg-rose-100 text-rose-700 ring-rose-200",
//     Pending: "bg-amber-100 text-amber-700 ring-amber-200",
//   };
//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${colors[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}
//     >
//       <span className="w-1.5 h-1.5 rounded-full bg-current" />
//       {status}
//     </span>
//   );
// }

// function DetailModal({ user, onClose }: { user: ReferralUser; onClose: () => void }) {
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 animate-modalIn"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
//         >
//           ✕
//         </button>
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//             {user.name?.[0]?.toUpperCase() ?? "?"}
//           </div>
//           <div>
//             <p className="text-lg font-bold text-slate-800 capitalize">{user.name}</p>
//             <p className="text-sm text-slate-400">{user.email}</p>
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <Badge label="Phone" value={user.phone} />
//           <Badge label="Status" value={<StatusPill status={user.status} />} />
//           <Badge label="Role" value={user.role} />
//           <Badge label="Referral Code" value={user.referalCode} accent />
//           <Badge label="Wallet" value={`₹${user.wallet}`} accent />
//           <Badge label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
//         </div>
//         {Object.keys(user).filter(
//           (k) => !["_id","name","email","phone","status","role","referalCode","wallet","createdAt"].includes(k)
//         ).length > 0 && (
//           <details className="mt-4 group">
//             <summary className="cursor-pointer text-xs font-semibold text-slate-400 hover:text-slate-600 select-none">
//               More details
//             </summary>
//             <div className="mt-3 grid grid-cols-2 gap-2">
//               {Object.entries(user)
//                 .filter(([k]) => !["_id","name","email","phone","status","role","referalCode","wallet","createdAt"].includes(k))
//                 .map(([k, v]) => (
//                   <Badge key={k} label={k} value={String(v ?? "—")} />
//                 ))}
//             </div>
//           </details>
//         )}
//       </div>
//       <style>{`
//         @keyframes modalIn {
//           from { opacity: 0; transform: translateY(16px) scale(0.97); }
//           to   { opacity: 1; transform: translateY(0)    scale(1);    }
//         }
//         .animate-modalIn { animation: modalIn .2s ease both; }
//       `}</style>
//     </div>
//   );
// }

// // ── Pagination Component ────────────────────────────────────────────────────
// function Pagination({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }) {
//   if (totalPages <= 1) return null;

//   // Build page number array with ellipsis logic
//   const getPageNumbers = () => {
//     const pages: (number | "...")[] = [];
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1);
//       if (currentPage > 3) pages.push("...");
//       const start = Math.max(2, currentPage - 1);
//       const end = Math.min(totalPages - 1, currentPage + 1);
//       for (let i = start; i <= end; i++) pages.push(i);
//       if (currentPage < totalPages - 2) pages.push("...");
//       pages.push(totalPages);
//     }
//     return pages;
//   };

//   return (
//     <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 mt-2">
//       <p className="text-xs text-slate-400">
//         Page <span className="font-semibold text-slate-600">{currentPage}</span> of{" "}
//         <span className="font-semibold text-slate-600">{totalPages}</span>
//       </p>

//       <div className="flex items-center gap-1">
//         {/* Prev */}
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
//         >
//           <ChevronLeft size={16} />
//         </button>

//         {/* Page numbers */}
//         {getPageNumbers().map((page, idx) =>
//           page === "..." ? (
//             <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm select-none">
//               …
//             </span>
//           ) : (
//             <button
//               key={page}
//               onClick={() => onPageChange(page as number)}
//               className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition ${
//                 currentPage === page
//                   ? "bg-violet-600 text-white border border-violet-600"
//                   : "border border-slate-200 text-slate-600 hover:bg-slate-100"
//               }`}
//             >
//               {page}
//             </button>
//           )
//         )}

//         {/* Next */}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
//         >
//           <ChevronRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── Page ────────────────────────────────────────────────────────────────────
// const LIMIT = 10;

// const Page = () => {
//   const router = useRouter();
//   const { profile } = useGlobal();

//   const [query, setQuery] = useState("");
//   const debouncedQuery = useDebounce(query, 500);

//   const [referralList, setReferralList] = useState<ReferralUser[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<ReferralUser | null>(null);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchReferrals = useCallback(async (code: string, page = 1) => {
//     if (!code) {
//       setReferralList([]);
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get(
//         `/applications/getDataByAssignTo`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           }
//         }
//         // `/users/code/${code}?page=${page}&limit=${LIMIT}&search=${debouncedQuery}`
//       );
//       const data: ReferralUser[] = response.data.data ?? [];
//       // Adjust based on your API's response shape ↓
//       const total: number = response.data.totalPages ?? Math.ceil((response.data.total ?? data.length) / LIMIT);
//       setReferralList(Array.isArray(data) ? data : [data]);
//       setTotalPages(total || 1);
//     } catch (err) {
//       console.error("Error fetching referrals:", err);
//       setReferralList([]);
//       setTotalPages(1);
//     } finally {
//       setLoading(false);
//     }
//   }, [debouncedQuery]);

//   // Reset to page 1 when search query changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [debouncedQuery]);

//   // Fetch whenever page or profile changes
//   useEffect(() => {
//     fetchReferrals(profile?._id || "", currentPage);
//   }, [currentPage, debouncedQuery, profile?.referalCode, fetchReferrals]);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     // Scroll list back to top
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const [show, setshow] = useState(false);

//   return (
//     <div className="min-h-screen">
//       <div className="mx-auto space-y-6">
//         {!show ? (
//           <div className="fade-up-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
//             {/* <div className="flex items-center justify-between mb-10">
//               <button
//                 onClick={() => setshow(true)}
//                 className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-sm"
//               >
//                 <Plus size={18} />
//                 Create Application
//               </button>
//             </div> */}
//               <div className="flex items-center justify-between py-5 border-b border-slate-100">
//               <h1 className="text-xl font-bold text-slate-800">Application Management</h1>
//               <div className="flex gap-2">
              
//                 <button
//                   onClick={() => setshow(true)}
//                   className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-sm"
//                 >
//                   <Plus size={18} />
//                   Create Application
//                 </button>
//               </div>
//             </div>

//             {/* Search */}
//             <div className="relative mb-4">
//               <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
//                 <Search />
//               </span>
//               <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search ..."
//                 className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
//               />
//               {loading && (
//                 <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-violet-500 animate-pulse">
//                   Loading…
//                 </span>
//               )}
//             </div>

//             <h2 className="heading text-base font-bold text-slate-800 mb-4">
//               Application List
//             </h2>

//             {referralList.length === 0 && !loading ? (
//               <div className="text-center py-10 text-slate-400 text-sm">
//                 No referral users found.
//               </div>
//             ) : (
//               <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
//                 <div className="divide-y divide-slate-100">
//                   {referralList.map((ru) => (
//                     <div
//                       key={ru._id}
//                       className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-slate-50 transition-all duration-200"
//                     >
//                       <div className="flex items-center gap-3 flex-1 min-w-0">
//                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-sm">
//                           {ru.name?.[0]?.toUpperCase() ?? "?"}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm font-semibold text-slate-800 capitalize truncate">
//                             {ru.name}
//                           </p>
//                           <p className="text-xs text-slate-500 truncate">{ru.email}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-3 shrink-0">
//                         <button
//                           onClick={() => setSelectedUser(ru)}
//                           className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
//                         >
//                           <Info size={18} className="text-slate-500" />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             router.push(
//                               `/dashboard/application_details/${ru?.applications[0]?.applicationNumber}`
//                             );
//                           }}
//                           className="px-3 py-2 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
//                         >
//                           <Edit />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* ── Pagination ── */}
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   onPageChange={handlePageChange}
//                 />
//               </div>
//             )}
//           </div>
//         ) : (
//           <Add_application />
//         )}
//       </div>

//       {selectedUser && (
//         <DetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
//       )}
//     </div>
//   );
// };

// export default Page;







"use client";

import axiosInstance from "@/app/axiosInstance";
import { useGlobal } from "@/src/statecontext";
import { Info, Plus, Search, ChevronLeft, ChevronRight, Edit, X, ArrowLeft, Upload, CheckCircle } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Add_application from "@/components/dashboard/application/add_application";
import { useRouter } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────────────────

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
  applications: { applicationNumber: string; _id?: string }[];
  [key: string]: unknown;
}

interface RejectionReason {
  course: string;
  reason: string;
  order: number;
  status: string;
}

interface Backup {
  course: string;
  intake: string;
  order: number;
}

interface EditFormData {
  country: string;
  course: string;
  intake: string;
  primaryStatus: string;
  isWithdrawn: boolean;
  userNotes: string;
  adminNotes: string;
  rejectionReason: RejectionReason[];
  backups: Backup[];
  // Files
  passport: File | null;
  academic: File | null;
  cv: File | null;
  experience: File | null;
  photo: File | null;
}

const INITIAL_FORM: EditFormData = {
  country: "",
  course: "",
  intake: "",
  primaryStatus: "Started",
  isWithdrawn: false,
  userNotes: "",
  adminNotes: "",
  rejectionReason: [],
  backups: [],
  passport: null,
  academic: null,
  cv: null,
  experience: null,
  photo: null,
};

const PRIMARY_STATUSES = ["Started", "In Progress", "Submitted", "Approved", "Rejected", "Withdrawn"];
const INTAKE_OPTIONS = ["September 2026", "January 2027", "May 2027", "September 2027"];
const REJECTION_STATUSES = ["Pending", "Resolved", "Dismissed"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Small UI Components ──────────────────────────────────────────────────────

function Badge({ label, value, accent = false }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 p-3 rounded-xl border ${accent ? "border-violet-200 bg-violet-50" : "border-slate-100 bg-slate-50"}`}>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
      <span className={`text-sm font-semibold ${accent ? "text-violet-700" : "text-slate-700"}`}>{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    Inactive: "bg-rose-100 text-rose-700 ring-rose-200",
    Pending: "bg-amber-100 text-amber-700 ring-amber-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${colors[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function DetailModal({ user, onClose }: { user: ReferralUser; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 animate-modalIn" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">✕</button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 capitalize">{user.name}</p>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Badge label="Phone" value={user.phone} />
          <Badge label="Status" value={<StatusPill status={user.status} />} />
          <Badge label="Role" value={user.role} />
          <Badge label="Referral Code" value={user.referalCode} accent />
          <Badge label="Wallet" value={`₹${user.wallet}`} accent />
          <Badge label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
        </div>
        {Object.keys(user).filter((k) => !["_id","name","email","phone","status","role","referalCode","wallet","createdAt"].includes(k)).length > 0 && (
          <details className="mt-4 group">
            <summary className="cursor-pointer text-xs font-semibold text-slate-400 hover:text-slate-600 select-none">More details</summary>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {Object.entries(user).filter(([k]) => !["_id","name","email","phone","status","role","referalCode","wallet","createdAt"].includes(k)).map(([k, v]) => (
                <Badge key={k} label={k} value={String(v ?? "—")} />
              ))}
            </div>
          </details>
        )}
      </div>
      <style>{`
        @keyframes modalIn { from { opacity:0; transform:translateY(16px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .animate-modalIn { animation: modalIn .2s ease both; }
      `}</style>
    </div>
  );
}

// ── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 mt-2">
      <p className="text-xs text-slate-400">Page <span className="font-semibold text-slate-600">{currentPage}</span> of <span className="font-semibold text-slate-600">{totalPages}</span></p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"><ChevronLeft size={16} /></button>
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm select-none">…</span>
          ) : (
            <button key={page} onClick={() => onPageChange(page as number)} className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition ${currentPage === page ? "bg-violet-600 text-white border border-violet-600" : "border border-slate-200 text-slate-600 hover:bg-slate-100"}`}>{page}</button>
          )
        )}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

// ── File Upload Field ────────────────────────────────────────────────────────

function FileUploadField({
  label,
  fieldKey,
  file,
  onChange,
  accept = "image/*,.pdf",
}: {
  label: string;
  fieldKey: keyof EditFormData;
  file: File | null;
  onChange: (key: keyof EditFormData, file: File | null) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${file ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/50"}`}
      >
        <div className={`p-1.5 rounded-lg ${file ? "bg-violet-100" : "bg-slate-100"}`}>
          {file ? <CheckCircle size={16} className="text-violet-600" /> : <Upload size={16} className="text-slate-400" />}
        </div>
        <div className="flex-1 min-w-0">
          {file ? (
            <p className="text-xs font-semibold text-violet-700 truncate">{file.name}</p>
          ) : (
            <p className="text-xs text-slate-400">Click to upload {label}</p>
          )}
        </div>
        {file && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(fieldKey, null); }}
            className="p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition"
          >
            <X size={14} />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(fieldKey, e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}

// ── Edit Application Form ────────────────────────────────────────────────────

function EditApplicationForm({
  user,
  onBack,
}: {
  user: ReferralUser;
  onBack: () => void;
}) {
  const [form, setForm] = useState<EditFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive the application ID from the user's first application
  const applicationId = user.applications?.[0]?._id ?? user.applications?.[0]?.applicationNumber ?? "";

  const set = <K extends keyof EditFormData>(key: K, value: EditFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setFile = (key: keyof EditFormData, file: File | null) =>
    setForm((prev) => ({ ...prev, [key]: file }));

  // Rejection Reason helpers
  const addRejection = () =>
    setForm((prev) => ({
      ...prev,
      rejectionReason: [
        ...prev.rejectionReason,
        { course: form.course, reason: "", order: prev.rejectionReason.length + 1, status: "Pending" },
      ],
    }));

  const updateRejection = (index: number, field: keyof RejectionReason, value: string | number) =>
    setForm((prev) => {
      const updated = [...prev.rejectionReason];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, rejectionReason: updated };
    });

  const removeRejection = (index: number) => setForm((prev) => ({ ...prev, rejectionReason: prev.rejectionReason.filter((_, i) => i !== index) }));

  // Backup helpers
  const addBackup = () =>
    setForm((prev) => ({
      ...prev,
      backups: [
        ...prev.backups,
        { course: form.course, intake: "", order: prev.backups.length + 1 },
      ],
    }));

  const updateBackup = (index: number, field: keyof Backup, value: string | number) =>
    setForm((prev) => {
      const updated = [...prev.backups];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, backups: updated };
    });

  const removeBackup = (index: number) => setForm((prev) => ({ ...prev, backups: prev.backups.filter((_, i) => i !== index) }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("country", form.country);
      formData.append("course", form.course);
      formData.append("intake", form.intake);
      formData.append("primaryStatus", form.primaryStatus);
      formData.append("isWithdrawn", String(form.isWithdrawn));
      formData.append("userNotes", form.userNotes);
      formData.append("adminNotes", form.adminNotes);
      if (form.rejectionReason.length > 0) {
        formData.append("rejectionReason", form.rejectionReason as any);
      }
      if (form.backups.length > 0) {
        formData.append("backups", form.backups as any);
      }
      if (form.passport) formData.append("passport", form.passport);
      if (form.academic) formData.append("academic", form.academic);
      if (form.cv) formData.append("cv", form.cv);
      if (form.experience) formData.append("experience", form.experience);
      if (form.photo) formData.append("photo", form.photo);

      await axiosInstance.put(
        `/applications/updateApplication/${applicationId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
      setTimeout(() => { setSuccess(false); onBack(); }, 1800);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition placeholder-slate-300";
  const labelCls = "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide";
  const sectionCls = "bg-white rounded-2xl border border-slate-100 shadow-sm p-5";

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-base font-bold text-slate-800 capitalize">{user.name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-medium">Application ID: <span className="text-slate-600 font-semibold">{applicationId}</span></span>
      </div>

      {/* Success / Error */}
      {success && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
          <CheckCircle size={18} /> Application updated successfully!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          <X size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* Section 1 — Basic Info */}
      <div className={sectionCls}>
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">1</span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Country</label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. UK, USA, Canada"
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Course ID</label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. 680f1a2b3c4d5e6f7a8b9c0d"
              value={form.course}
              onChange={(e) => set("course", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Intake</label>
            <select
              className={inputCls}
              value={form.intake}
              onChange={(e) => set("intake", e.target.value)}
            >
              <option value="">Select intake</option>
              {INTAKE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Primary Status</label>
            <select
              className={inputCls}
              value={form.primaryStatus}
              onChange={(e) => set("primaryStatus", e.target.value)}
            >
              {PRIMARY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* <div className="sm:col-span-2">
            <label className={labelCls}>Is Withdrawn?</label>
            <div className="flex items-center gap-4">
              {[false, true].map((val) => (
                <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => set("isWithdrawn", val)}
                    className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition
                      ${form.isWithdrawn === val ? "border-violet-600 bg-violet-600" : "border-slate-300"}`}
                  >
                    {form.isWithdrawn === val && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{val ? "Yes" : "No"}</span>
                </label>
              ))}
            </div>
          </div> */}

        </div>
      </div>

      {/* Section 2 — Notes */}
      {/* <div className={sectionCls}>
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">2</span>
          Notes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>User Notes</label>
            <textarea
              className={`${inputCls} h-28 resize-none`}
              placeholder="Notes visible to the student…"
              value={form.userNotes}
              onChange={(e) => set("userNotes", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Admin Notes</label>
            <textarea
              className={`${inputCls} h-28 resize-none`}
              placeholder="Internal admin notes…"
              value={form.adminNotes}
              onChange={(e) => set("adminNotes", e.target.value)}
            />
          </div>
        </div>
      </div> */}

      {/* Section 3 — Rejection Reasons */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">3</span>
            Rejection Reasons
          </h3>
          <button
            type="button"
            onClick={addRejection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-xs font-semibold hover:bg-violet-100 transition border border-violet-200"
          >
            <Plus size={14} /> Add Reason
          </button>
        </div>

        {form.rejectionReason.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No rejection reasons added. Click "Add Reason" to add one.</p>
        ) : (
          <div className="space-y-3">
            {form.rejectionReason.map((rr, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 relative">
                <button
                  type="button"
                  onClick={() => removeRejection(idx)}
                  className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition"
                >
                  <X size={14} />
                </button>
                <div>
                  <label className={labelCls}>Course ID</label>
                  <input type="text" className={inputCls} placeholder="Course ID" value={rr.course} onChange={(e) => updateRejection(idx, "course", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Reason</label>
                  <input type="text" className={inputCls} placeholder="e.g. Insufficient documents" value={rr.reason} onChange={(e) => updateRejection(idx, "reason", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Order</label>
                    <input type="number" min={1} className={inputCls} value={rr.order} onChange={(e) => updateRejection(idx, "order", Number(e.target.value))} />
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select className={inputCls} value={rr.status} onChange={(e) => updateRejection(idx, "status", e.target.value)}>
                      {REJECTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4 — Backup Courses */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">4</span>
            Backup Courses
          </h3>
          <button
            type="button"
            onClick={addBackup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-xs font-semibold hover:bg-violet-100 transition border border-violet-200"
          >
            <Plus size={14} /> Add Backup
          </button>
        </div>

        {form.backups.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No backup courses added. Click "Add Backup" to add one.</p>
        ) : (
          <div className="space-y-3">
            {form.backups.map((bk, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 relative">
                <button
                  type="button"
                  onClick={() => removeBackup(idx)}
                  className="absolute top-2.5 right-2.5 p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition"
                >
                  <X size={14} />
                </button>
                <div>
                  <label className={labelCls}>Course ID</label>
                  <input type="text" className={inputCls} placeholder="Course ID" value={bk.course} onChange={(e) => updateBackup(idx, "course", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Intake</label>
                  <select className={inputCls} value={bk.intake} onChange={(e) => updateBackup(idx, "intake", e.target.value)}>
                    <option value="">Select intake</option>
                    {INTAKE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Order</label>
                  <input type="number" min={1} className={inputCls} value={bk.order} onChange={(e) => updateBackup(idx, "order", Number(e.target.value))} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 5 — Document Uploads */}
      <div className={sectionCls}>
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">5</span>
          Document Uploads
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUploadField label="Passport" fieldKey="passport" file={form.passport} onChange={setFile} accept="image/*,.pdf" />
          <FileUploadField label="Academic Documents" fieldKey="academic" file={form.academic} onChange={setFile} accept="image/*,.pdf" />
          <FileUploadField label="CV / Resume" fieldKey="cv" file={form.cv} onChange={setFile} accept="image/*,.pdf,.doc,.docx" />
          <FileUploadField label="Experience Letter" fieldKey="experience" file={form.experience} onChange={setFile} accept="image/*,.pdf" />
          <FileUploadField label="Photo" fieldKey="photo" file={form.photo} onChange={setFile} accept="image/*" />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold
           hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-[1] py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400
           text-white text-sm font-semibold transition shadow-sm flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Updating…
            </>
          ) : "Update Application"}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeIn { animation: fadeIn .25s ease both; }
      `}</style>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const LIMIT = 10;

const Page = () => {
  const router = useRouter();
  const { profile } = useGlobal();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const [referralList, setReferralList] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ReferralUser | null>(null);

  // View state: "list" | "add" | "edit"
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingUser, setEditingUser] = useState<ReferralUser | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReferrals = useCallback(async (code: string, page = 1) => {
    if (!code) { setReferralList([]); return; }
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/applications/getDataByAssignTo`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data: ReferralUser[] = response.data.data ?? [];
      const total: number = response.data.totalPages ?? Math.ceil((response.data.total ?? data.length) / LIMIT);
      setReferralList(Array.isArray(data) ? data : [data]);
      setTotalPages(total || 1);
    } catch (err) {
      console.error("Error fetching referrals:", err);
      setReferralList([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => { setCurrentPage(1); }, [debouncedQuery]);

  useEffect(() => {
    fetchReferrals(profile?._id || "", currentPage);
  }, [currentPage, debouncedQuery, profile?.referalCode, fetchReferrals]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (user: ReferralUser) => {
    setEditingUser(user);
    setView("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (view === "add") {
    return (
      <div className="min-h-screen">
        <div className="mx-auto space-y-6">
          <Add_application />
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition"
          >
            <ArrowLeft size={16} /> Back to list
          </button>
        </div>
      </div>
    );
  }

  if (view === "edit" && editingUser) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto">
          <EditApplicationForm user={editingUser} onBack={() => { setView("list"); setEditingUser(null); }} />
        </div>
      </div>
    );
  }

  // Default: list view
  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-6">
        <div className="fade-up-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between py-5 border-b border-slate-100">
            <h1 className="text-xl font-bold text-slate-800">Application Management</h1>
            <button
              onClick={() => setView("add")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus size={18} />
              Create Application
            </button>
          </div>

          {/* Search */}
          <div className="relative my-4">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search …"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
            />
            {loading && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-violet-500 animate-pulse">Loading…</span>
            )}
          </div>

          <h2 className="text-base font-bold text-slate-800 mb-4">Application List</h2>

          {referralList.length === 0 && !loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">No referral users found.</div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="divide-y divide-slate-100">
                {referralList.map((ru) => (
                  <div
                    key={ru._id}
                    className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-slate-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-sm">
                        {ru.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 capitalize truncate">{ru.name}</p>
                        <p className="text-xs text-slate-500 truncate">{ru.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => setSelectedUser(ru)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
                      >
                        <Info size={18} className="text-slate-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(ru)}
                        className="px-3 py-2 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <DetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default Page;


