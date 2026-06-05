"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  X,
  ChevronLeft,
  PhoneCallIcon,
  Edit,
  ChevronRight,
  Eye,
  RefreshCw,
  FileText
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import { useGlobal } from "@/src/statecontext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import NewApplicationModal from "@/components/dashboard/application/add_application";

// ─── Types ──────────────────────────────────────────────────────────

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

interface ApiResponse {
  success: boolean;
  data: Application[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  results: number;
}

interface Country {
  code: string;
  name: string;
}

/* ─── Debounce Hook ────────────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/* ─── Status Config ────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "bg-orange-100", text: "text-orange-700" },
  Started: { bg: "bg-blue-100", text: "text-blue-700" },
  ReviewbyOoshas: { bg: "bg-purple-100", text: "text-purple-700" },
  SubmitToSchool: { bg: "bg-indigo-100", text: "text-indigo-700" },
  AwaitingSchoolResponse: { bg: "bg-cyan-100", text: "text-cyan-700" },
  AdmissionProcessing: { bg: "bg-violet-100", text: "text-[#fa6a1f]" },
  Refused: { bg: "bg-red-100", text: "text-red-700" },
  Withdrawn: { bg: "bg-gray-100", text: "text-gray-700" },
  PreArrival: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Arrived: { bg: "bg-green-100", text: "text-green-700" },
  Completed: { bg: "bg-teal-100", text: "text-teal-700" },
};

const PAYMENT_CONFIG: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "bg-orange-100", text: "text-orange-700" },
  Completed: { bg: "bg-green-100", text: "text-green-700" },
  Failed: { bg: "bg-red-100", text: "text-red-700" },
};

export default function Page() {
  const router = useRouter();
  const { profile } = useGlobal();

  const [view, setView] = useState<"list" | "add">("list");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);

  // Data
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [primaryStatus, setPrimaryStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [intake, setIntake] = useState("");
  const [country, setCountry] = useState("");
  const [course, setCourse] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(new Date());

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Dropdown options
  const [countries, setCountries] = useState<Country[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [intakes] = useState<string[]>([
    "Spring 2026",
    "Fall 2026",
    "Spring 2027",
    "Fall 2027",
    "Spring 2028",
  ]);

  // Fetch countries
  const fetchCountries = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/countries?limit=250");
      setCountries(res.data.data || []);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/courses?limit=500");
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    // if (profile?.role !== "admin") return;
    try {
      const res = await axiosInstance.get("/users?role=user&status=Active&limit=500");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  }, [profile]);

  // Fetch applications with filters
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
      };

      if (debouncedSearchQuery && debouncedSearchQuery.length >= 3) {
        params.search = debouncedSearchQuery;
      }
      if (primaryStatus) params.primaryStatus = primaryStatus;
      if (paymentStatus) params.paymentStatus = paymentStatus;
      if (intake) params.intake = intake;
      if (country) params.country = country;
      if (course) params.course = course;
      if (studentFilter) params.student = studentFilter;

      if (dateFrom) {
        params.startDate = dateFrom.toISOString().split("T")[0];
      }
      if (dateTo) {
        params.endDate = dateTo.toISOString().split("T")[0];
      }

      console.log("Fetching applications with params:", params);

      const response = await axiosInstance.get<ApiResponse>(
        "/applications/getApplicationsByCounsellor",
        { params }
      );

      setApplications(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error("Failed to fetch applications");
      setApplications([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    limit,
    debouncedSearchQuery,
    primaryStatus,
    paymentStatus,
    intake,
    country,
    course,
    studentFilter,
    dateFrom,
    dateTo,
  ]);

  // Initial load
  useEffect(() => {
    fetchCountries();
    fetchCourses();
    fetchStudents();
  }, [fetchCountries, fetchCourses, fetchStudents]);

  // Fetch applications on filter change
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Format date
  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      : "—";

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setPrimaryStatus("");
    setPaymentStatus("");
    setIntake("");
    setCountry("");
    setCourse("");
    setStudentFilter("");
    setDateFrom(null);
    setDateTo(new Date());
    setPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="min-h-screen p-3 relative">
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-700">
                Application Management
              </h1>
              <p className="text-gray-500 text-[13px]">
                Manage and track all your applications
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setView("add")}
                className="h-10 px-4 bg-[#F26D44] text-white rounded-lg font-medium hover:bg-[#F26D44]/70 transition flex items-center gap-2"
              >
                New Application
                <Plus size={18} />
              </button>
            </div>
          </div>

          <NewApplicationModal isOpen={view === "add"} onClose={() => setView("list")} onSuccess={fetchApplications} />

          <div className="bg-gray-50 border-[#F26D44]/40 p-4 border-2 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Student Filter (Admin only) */}
              {/* {profile?.role === "admin" && ( */}
              <Autocomplete
                options={students}
                getOptionLabel={(option) => option?.name || ""}
                value={students.find((s) => s._id === studentFilter) || null}
                onChange={(event, newValue) => {
                  setStudentFilter(newValue?._id || "");
                  setPage(1);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Student"
                    size="small"
                  />
                )}
              />
              {/* )} */}

              {/* Date Range */}
              <DatePicker
                value={dateFrom}
                onChange={(newValue) => {
                  setDateFrom(newValue);
                  setPage(1);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    placeholder: "From",
                    sx: {
                      minWidth: 140,
                    },
                  },
                }}
              />

              <div className="flex items-center gap-2">
                <span className="flex items-center">to</span>
                <DatePicker
                  value={dateTo}
                  onChange={(newValue) => {
                    setDateTo(newValue);
                    setPage(1);
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "To",
                      sx: {
                        minWidth: 140,
                      },
                    },
                  }}
                />
              </div>

              {/* Country */}
              <Autocomplete
                options={countries}
                getOptionLabel={(option) => option?.name || ""}
                value={countries.find((c) => c.code === country) || null}
                onChange={(event, newValue) => {
                  setCountry(newValue?.code || "");
                  setPage(1);
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Country" size="small" />
                )}
              />

              {/* Course */}
              <Autocomplete
                options={courses}
                getOptionLabel={(option) => option?.name || ""}
                value={courses.find((c) => c._id === course) || null}
                onChange={(event, newValue) => {
                  setCourse(newValue?._id || "");
                  setPage(1);
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Course" size="small" />
                )}
              />

              {/* Intake */}
              <FormControl size="small">
                <Select
                  value={intake}
                  onChange={(e) => {
                    setIntake(e.target.value);
                    setPage(1);
                  }}
                  displayEmpty
                  placeholder="Intake"
                >
                  <MenuItem value="" disabled>
                    Intake
                  </MenuItem>
                  {intakes.map((intakeOption) => (
                    <MenuItem key={intakeOption} value={intakeOption}>
                      {intakeOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Primary Status */}
              <FormControl size="small">
                <Select
                  value={primaryStatus}
                  onChange={(e) => {
                    setPrimaryStatus(e.target.value);
                    setPage(1);
                  }}
                  displayEmpty
                  placeholder="Primary Status"
                >
                  <MenuItem value="" disabled>
                    Primary Status
                  </MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Started">Started</MenuItem>
                  <MenuItem value="ReviewbyOoshas">Review by Ooshas</MenuItem>
                  <MenuItem value="SubmitToSchool">Submit to School</MenuItem>
                  <MenuItem value="AwaitingSchoolResponse">
                    Awaiting School Response
                  </MenuItem>
                  <MenuItem value="AdmissionProcessing">
                    Admission Processing
                  </MenuItem>
                  <MenuItem value="Refused">Refused</MenuItem>
                  <MenuItem value="Withdrawn">Withdrawn</MenuItem>
                  <MenuItem value="PreArrival">Pre-Arrival</MenuItem>
                  <MenuItem value="Arrived">Arrived</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>

              {/* Payment Status */}
              <FormControl size="small">
                <Select
                  value={paymentStatus}
                  onChange={(e) => {
                    setPaymentStatus(e.target.value);
                    setPage(1);
                  }}
                  displayEmpty
                  placeholder="Payment Status"
                >
                  <MenuItem value="" disabled>
                    Payment Status
                  </MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Search Bar */}
            <div className="mt-4 flex gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by application number (min 3 characters)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F26D44]/70"
                />
                {searchQuery.length > 0 && searchQuery.length < 3 && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[13px] text-gray-400">
                    {3 - searchQuery.length} more
                  </span>
                )}
              </div>
              <button
                onClick={fetchApplications}
                className="px-4 py-3 bg-[#F26D44] text-white rounded-lg font-medium hover:bg-[#F26D44]/70 transition"
              >
                Search
              </button>
              <button
                onClick={handleResetFilters}
                className="px-2 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-30">
              <div className="w-8 h-8 border-4 border-[#F26D44] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Table */}
          {!loading && (
            <div className="bg-gray-50 border-[#F26D44]/40 border-2 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F26D44] !text-white border-b border-gray-200">
                    <tr>
                      <th className="text-left px-2 py-3 text-[13px] font-semibold">
                        Student Name
                      </th>
                      <th className="text-left px-2 py-3 text-[13px] font-semibold">
                        Application No.
                      </th>
                      <th className="text-left px-2 py-3 text-[13px] font-semibold">
                        University
                      </th>
                      <th className="text-left px-2 py-3 text-[13px] font-semibold">
                        Course
                      </th>
                      <th className="text-left px-2 py-3 text-[13px] font-semibold">
                        Intake
                      </th>
                      <th className="text-left px-2 py-3 text-[13px] font-semibold">
                        Payment Status
                      </th>
                      <th className="text-left px-2 py-3 text-[13px] font-semibold">
                        Primary Status
                      </th>
                      <th className="text-left px-2 py-3 text-[13px] font-semibold">
                        Created At
                      </th>
                      <th className="text-left px-2 py-3 text-[13px] font-semibold">
                        Updated At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y !text-[13px] divide-gray-100">
                    {applications.map((app) => (
                      <tr
                        key={app._id}
                        onClick={() =>
                          router.push(
                            `/dashboard/application_details/${app._id}`
                          )
                        }
                        className="hover:bg-gray-50 border-b-2 border-white text-medium capitalize cursor-pointer transition-colors"
                      >
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-3">

                            <div>
                              <span className="text-[13px] font-semibold text-gray-900 block">
                                {app.student?.name || "N/A"}
                              </span>
                              {/* <span className="text-[13px] font-medium text-gray-500 block">
                                {app.student?.email || ""}
                              </span> */}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-[13px] font-medium text-gray-900">
                            {app.applicationNumber || "—"}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-[13px] font-medium text-gray-600">
                            {app.courseDetails?.university?.name.split("–")[0] || "—"}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <div>
                            <span className="text-[13px] font-medium text-gray-900 block">
                              {app.courseDetails?.name || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-[13px] text-gray-600">
                            {app.intake || "—"}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-[13px] font-medium border shadow ${PAYMENT_CONFIG[app.paymentStatus]?.bg ||
                              "bg-gray-100"
                              } ${PAYMENT_CONFIG[app.paymentStatus]?.text ||
                              "text-gray-700"
                              }`}
                          >
                            {app.paymentStatus}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-[13px] font-medium border shadow ${STATUS_CONFIG[app.primaryStatus]?.bg ||
                              "bg-gray-100"
                              } ${STATUS_CONFIG[app.primaryStatus]?.text ||
                              "text-gray-700"
                              }`}
                          >
                            {app.primaryStatus}
                          </span>
                        </td>

                        <td className="px-2 py-3 text-[13px] font-medium text-gray-600">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-2 py-3 text-[13px] font-medium text-gray-600">
                          {formatDate(app.updatedAt)}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col bg-[#F26D44]/20 font-medium text-black sm:flex-row items-center justify-between gap-4 px-2 py-3 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-gray-600">Show</span>
                  <select
                    value={limit}
                    onChange={(e) =>
                      handleLimitChange(Number(e.target.value))
                    }
                    className="border border-gray-200 rounded px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-[13px] text-gray-600">Entries</span>
                </div>

                <div className="text-[13px] text-gray-600">
                  Showing {applications.length > 0 ? (page - 1) * limit + 1 : 0}{" "}
                  - {Math.min(page * limit, total)} of {total}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-[13px] text-gray-600 px-2">
                    Page {page} of {totalPages || 1}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} className="transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && applications.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-3 bg-[#F26D44] text-white rounded-lg hover:bg-[#F26D44]/70 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </LocalizationProvider>
  );
}