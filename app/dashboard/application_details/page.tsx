"use client";

import axiosInstance from "@/app/axiosInstance";
import { useGlobal } from "@/src/statecontext";
import {
  Info,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Filter,
  FileText,
  X,
  MoreHorizontal,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Add_application from "@/components/dashboard/application/add_application";

// ── Types ─────────────────────────────────────────────────────────────────────

type ApplicationStatus =
  | "Pending"
  | "Started"
  | "ReviewbyOoshas"
  | "SubmitToSchool"
  | "AwaitingSchoolResponse"
  | "AdmissionProcessing"
  | "Refused"
  | "Withdrawn"
  | "PreArrival"
  | "Arrived"
  | "Completed";

type PaymentStatus = "Pending" | "Completed" | "Failed";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface University {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
  university?: University;
}

interface Application {
  _id: string;
  applicationNumber: string;
  student: Student;
  country?: string;
  course?: Course;
  intake?: string;
  paymentStatus: PaymentStatus;
  primaryStatus: ApplicationStatus;
  isWithdrawn: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── UI Components ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: any }> = {
  Pending: { bg: "bg-orange-50", text: "text-orange-700", icon: Clock },
  Started: { bg: "bg-blue-50", text: "text-blue-700", icon: Activity },
  ReviewbyOoshas: { bg: "bg-purple-50", text: "text-purple-700", icon: Users },
  SubmitToSchool: { bg: "bg-indigo-50", text: "text-indigo-700", icon: Send },
  AwaitingSchoolResponse: { bg: "bg-cyan-50", text: "text-cyan-700", icon: Clock },
  AdmissionProcessing: { bg: "bg-violet-50", text: "text-violet-700", icon: Activity },
  Refused: { bg: "bg-red-50", text: "text-red-700", icon: AlertCircle },
  Withdrawn: { bg: "bg-gray-50", text: "text-gray-600", icon: X },
  PreArrival: { bg: "bg-emerald-50", text: "text-emerald-700", icon: TrendingUp },
  Arrived: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle },
  Completed: { bg: "bg-teal-50", text: "text-teal-700", icon: CheckCircle },
};

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { bg: "bg-slate-50", text: "text-slate-600", icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { bg: string; text: string }> = {
    Pending: { bg: "bg-orange-50", text: "text-orange-700" },
    Completed: { bg: "bg-emerald-50", text: "text-emerald-700" },
    Failed: { bg: "bg-red-50", text: "text-red-700" },
  };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${map[status].bg} ${map[status].text}`}>{status}</span>;
}

function ProgressBar({ sent, total }: { sent: number; total: number }) {
  const percentage = total > 0 ? (sent / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-violet-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 font-medium">
        {sent} / {total}
      </span>
    </div>
  );
}

function StatsDisplay({ sent, failed, delivered }: { sent: number; failed: number; delivered: number }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-emerald-600">Sent: {sent}</span>
      <span className="text-red-600">Failed: {failed}</span>
      <span className="text-blue-600">Delivered: {delivered}</span>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
      <p className="text-xs text-slate-400">
        Page <span className="font-semibold text-slate-600">{currentPage}</span> of{" "}
        <span className="font-semibold text-slate-600">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`e${idx}`} className="px-2 text-slate-400 text-sm">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition ${
                currentPage === page
                  ? "bg-violet-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const LIMIT = 10;
const STATUS_OPTIONS: ApplicationStatus[] = [
  "Pending", "Started", "ReviewbyOoshas", "SubmitToSchool", "AwaitingSchoolResponse",
  "AdmissionProcessing", "Refused", "Withdrawn", "PreArrival", "Arrived", "Completed",
];

export default function Page() {
  const router = useRouter();
  const { profile } = useGlobal();

  const [view, setView] = useState<"list" | "add">("list");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
 const [startDateFilter, setStartDateFilter] = useState("");
const [endDateFilter, setEndDateFilter] = useState("");

const fetchApplications = useCallback(
  async (page = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.set("page", page.toString());
      params.set("limit", LIMIT.toString());

      if (debouncedQuery) {
        params.set("search", debouncedQuery);
      }

      if (statusFilter) {
        params.set("primaryStatus", statusFilter);
      }

      // Start Date Filter
      if (startDateFilter) {
        params.set("startDate", startDateFilter);
      }

      // End Date Filter
      if (endDateFilter) {
        params.set("endDate", endDateFilter);
      }

      const res = await axiosInstance.get(
        `/applications/getApplicationsByCounsellor?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const d = res.data;

      setApplications(d.data || []);
      setTotal(d.total || 0);
      setTotalPages(
        d.pages || Math.ceil((d.total || 0) / LIMIT) || 1
      );

    } catch (err) {
      console.error(err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  },
  [
    debouncedQuery,
    statusFilter,
    startDateFilter,
    endDateFilter,
  ]
);
  useEffect(() => { setCurrentPage(1); }, [debouncedQuery, statusFilter]);
  useEffect(() => { fetchApplications(currentPage); }, [currentPage, fetchApplications]);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const activeFilters = [statusFilter].filter(Boolean).length;

  if (view === "add") {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <button
          onClick={() => setView("list")}
          className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"
        >
          <ChevronLeft size={16} /> Back to Applications
        </button>
        <Add_application />
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full mx-auto px-6 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Application Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage and track all your application
            </p>
          </div>
          <button
            onClick={() => setView("add")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition "
          >
            <Plus size={16} /> New Applicaion
          </button>
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200  p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                showFilters || activeFilters > 0
                  ? "border-violet-300 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={15} />
              Filters
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
            <button
              onClick={() => fetchApplications(currentPage)}
              className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {showFilters && (
  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-3 items-center">
    
    {/* Status Filter */}
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-slate-500">
        Status
      </label>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="text-sm rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
      >
        <option value="">All Statuses</option>

        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>

    {/* Start Date */}
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-slate-500">
        Start Date
      </label>

      <input
        type="date"
        value={startDateFilter}
        onChange={(e) => setStartDateFilter(e.target.value)}
        className="text-sm rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
      />
    </div>

    {/* End Date */}
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-slate-500">
        End Date
      </label>

      <input
        type="date"
        value={endDateFilter}
        onChange={(e) => setEndDateFilter(e.target.value)}
        className="text-sm rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
      />
    </div>

    {/* Clear Filters */}
    {activeFilters > 0 && (
      <button
        onClick={() => {
          setStatusFilter("");
          setQuery("");
          setStartDateFilter("");
          setEndDateFilter("");
        }}
        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1"
      >
        <X size={12} /> Clear all
      </button>
    )}
  </div>
)}
        </div>

        {/* Table - Matching the reference design */}
        <div className="bg-white rounded-xl border border-slate-200  overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw size={24} className="animate-spin text-violet-500" />
                <p className="text-sm text-slate-400">Loading campaigns…</p>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FileText size={22} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600">No campaigns found</p>
              <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Country</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Intake</th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Apllication No.</th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Status</th>
                          <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Status</th>
                          <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                          <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created At</th>
                          <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Updated At</th>
                  
                     
                      <th className="px-5 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {applications.map((app: any, idx: number) => {
                      // Mock data for the table columns matching the reference
                      console.log(app)
                      const campaignName = app?.student?.name || "Unnamed Campaign";
                      const messageType = app?.country || "Unknown Country";
                      const status = app?.intake;
                      const schedule = app?.applicationNumber;
                      const paymentStatus = app?.paymentStatus;
                      const phone = app?.student?.phone || "—";
                      const createdAt = formatDate(app?.createdAt);
                      const primaryStatus = app?.primaryStatus || "—";
                      const updatedAt = formatDate(app?.updatedAt);
                    
                      
                      const statusColors: Record<string, string> = {
                        "Sent": "text-emerald-600 bg-emerald-50",
                        "Partial": "text-orange-600 bg-orange-50",
                        "Pending": "text-amber-600 bg-amber-50",
                        "Started": "text-blue-600 bg-blue-50",
                      };
                      
                      return (
                        <tr key={app._id} className="hover:bg-slate-50/60 transition-colors group">
                          <td className="px-5 py-4">
                            <span className="font-medium text-slate-800 text-sm">
                              {campaignName.length > 30 ? campaignName.substring(0, 30) + "..." : campaignName}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-slate-600 text-xs">{messageType}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center  py-1 rounded-md text-xs font-medium ${statusColors[status] || " text-gray-600"}`}>
                              {status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-slate-600 text-xs">{schedule}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-slate-600 text-xs">{paymentStatus}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-slate-600 text-xs">{primaryStatus}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-slate-600 text-xs">{phone}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-slate-600 text-xs">{createdAt}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-slate-600 text-xs">{updatedAt}</span>
                          </td>
                        
                         
                          <td className="px-5 py-4 text-center">
                             <button
                            onClick={() => router.push(`/dashboard/application_details/${app._id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-semibold transition"
                          >
                            <Eye size={13} /> View
                          </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}