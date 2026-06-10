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
  Calendar,
  Filter,
  Archive,
  PhoneCallIcon,
  Edit,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import { useGlobal } from "@/src/statecontext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import RegisterStudentModal from "@/components/couseller/NewUser";

/* ─── Types ────────────────────────────────────────────────────────── */
interface UserProfile {
  _id?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
  profileCompletion?: number;
  [key: string]: unknown;
}

interface Assignee {
  _id: string;
  name: string;
  email: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Suspended";
  role: string;
  referalCode: string;
  wallet: number;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  assignto?: string | Assignee;
  nationality?: string;
  intake?: string;
  dateOfBirth?: string;
  profile?: UserProfile;
  assignee?: Assignee;
  referby?: { name?: string };
}

interface ApiResponse {
  success: boolean;
  data: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
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

export default function StudentsPage() {
  const { profile } = useGlobal();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Student | null>(null);
const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [intake, setIntake] = useState("");
  const [year, setYear] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>();
  const [dateTo, setDateTo] = useState<Date | null>(new Date());

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
  const [counsellors, setCounsellors] = useState<Assignee[]>([]);
  const [intakes, setIntakes] = useState<string[]>(["Spring 2026", "Fall 2026", "Spring 2027", "Fall 2027", "Spring 2028"]);
  const [years, setYears] = useState<string[]>(["2026", "2027", "2028", "2029", "2030"]);

  const fetchCountries = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/countries?limit=250");
      setCountries(res.data.data || []);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  }, []);

  const fetchCounsellors = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/users?role=counsellor&limit=100");
      setCounsellors(res.data.data || []);
    } catch (err) {
      console.error("Error fetching counsellors:", err);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
        sort: "-createdAt",
      };

      if (debouncedSearchQuery && debouncedSearchQuery.length >= 3) {
        params.search = debouncedSearchQuery;
      }
      if (status) params.status = status;
      if (assignedTo) params.assignto = assignedTo;

      if (country) params.nationality = country;

      if (intake) params.intake = intake;

      if (year) {
        params.year = year;
      }

      if (dateFrom) {
        params.dateFrom = dateFrom.toISOString().split('T')[0];
      }
      if (dateTo) {
        params.dateTo = dateTo.toISOString().split('T')[0];
      }

      const response = await axiosInstance.get<ApiResponse>("/users", { params });

      let data = response.data.data || [];
      if (year && !response.data.data.some(s => s.createdAt && new Date(s.createdAt).getFullYear().toString() === year)) {
        data = data.filter(student =>
          student.createdAt && new Date(student.createdAt).getFullYear().toString() === year
        );
      }

      if (dateFrom || dateTo) {
        data = data.filter(student => {
          const createdAt = new Date(student.createdAt);
          if (dateFrom && createdAt < dateFrom) return false;
          if (dateTo && createdAt > dateTo) return false;
          return true;
        });
      }

      setStudents(data);
      setTotal(response.data.pagination?.total || data.length);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to fetch students");
      setStudents([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearchQuery, status, assignedTo, country, intake, year, dateFrom, dateTo]);

  useEffect(() => {
    fetchCountries();
    profile && profile.role === "admin" && fetchCounsellors();
  }, [fetchCountries, fetchCounsellors]);

  // Fetch students whenever filters or pagination changes
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /* Handle Student Selection */
  const handleSelectUser = async (student: Student) => {
    setDetailLoading(true);
    setSelectedUser(student);
    setDetailLoading(false);
  };

  /* Close Detail View */
  const handleCloseDetail = () => {
    setSelectedUser(null);
  };

  /* Reset Filters */
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatus("");
    setCountry("");
    setIntake("");
    setYear("");
    setAssignedTo("");
    setDateFrom(new Date("2026-01-01"));
    setDateTo(new Date("2027-06-03"));
    setPage(1);
  };

  /* Pagination Handlers */
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
        <AnimatePresence mode="wait">
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
                  <h1 className="text-xl font-bold text-gray-700">Students</h1>
                  <p className="text-gray-500 text-sm">
                    Manage your Students and their Profiles
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="h-10 px-2 bg-[#F26D44] text-white rounded-lg font-medium hover:bg-[#F26D44]/70 transition flex items-center gap-2"
                  >
                    Register New Student
                    <Plus size={18} />
                  </button>

                  <RegisterStudentModal
                    isOpen={isRegisterModalOpen}
                    onClose={() => setIsRegisterModalOpen(false)}
                    onSuccess={() => {
                      fetchStudents(); // Refresh the student list
                    }}
                  />
                </div>
              </div>

              {/* Filters Row */}
              <div className="bg-gray-50 border-[#F26D44]/40 p-4 border-2 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Assigned To */}
                  {profile && profile.role == "admin" && <Autocomplete
                    options={counsellors}
                    getOptionLabel={(option) => option?.name || ""}
                    value={counsellors.find(c => c._id === assignedTo) || null}
                    onChange={(event, newValue) => {
                      setAssignedTo(newValue?._id || "");
                      setPage(1);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Assigned To"
                        size="small"
                      />
                    )}
                  />}

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
                    value={countries.find(c => c.code === country) || null}
                    onChange={(event, newValue) => {
                      setCountry(newValue?.code || "");
                      setPage(1);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Country"
                        size="small"
                      />
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

                  {/* Year */}
                  <FormControl size="small">
                    <Select
                      value={year}
                      onChange={(e) => {
                        setYear(e.target.value);
                        setPage(1);
                      }}
                      displayEmpty
                      placeholder="Year"
                    >
                      <MenuItem value="" disabled>
                        Year
                      </MenuItem>
                      {years.map((yearOption) => (
                        <MenuItem key={yearOption} value={yearOption}>
                          {yearOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Status */}
                  {/* <FormControl size="small">
                    <Select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                      }}
                      displayEmpty
                      placeholder="Status"
                    >
                      <MenuItem value="" disabled>
                        Status
                      </MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Suspended">Suspended</MenuItem>
                    </Select>
                  </FormControl> */}
                </div>

                {/* Search Bar */}
                <div className="mt-4 flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by keyword (min 3 characters)"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F26D44]/70"
                    />
                    {searchQuery.length > 0 && searchQuery.length < 3 && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                        {3 - searchQuery.length} more
                      </span>
                    )}
                  </div>
                  <button
                    onClick={fetchStudents}
                    className="px-4 py-2 bg-[#F26D44] text-white rounded-lg font-medium hover:bg-[#F26D44]/70 transition"
                  >
                    Search
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="px-2 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Table */}
              {!loading && (
                <div className="bg-gray-50 border-[#F26D44]/40 border-2 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F26D44] !text-white border-b border-gray-200">
                        <tr>
                          <th className="text-left px-2 py-4 text-sm font-semibold">
                            Refered By
                          </th>
                          <th className="text-left px-2 py-4 text-sm font-semibold ">
                            Name
                          </th>
                          <th className="text-left px-2 py-4 text-sm font-semibold ">
                            Contact
                          </th>
                          {profile && profile.role == "admin" && (
                            <th className="text-left px-2 py-4 text-sm font-semibold ">
                              Assigned To
                            </th>
                          )}
                          <th className="text-left px-2 py-4 text-sm font-semibold ">
                            Profile Status
                          </th>
                          <th className="text-left px-2 py-4 text-sm font-semibold ">
                            Status
                          </th>
                          <th className="text-left px-2 py-4 text-sm font-semibold ">
                            Joined On
                          </th>
                          <th className="text-left px-2 py-4 text-sm font-semibold ">
                            Last Login
                          </th>
                          <th className="px-2 py-4 text-sm font-semibold ">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y !text-sm divide-gray-100">
                        {students.map((student) => (
                          <tr
                            key={student._id}
                            onClick={() => router.push(`/dashboard/user/${student._id}`)}
                            className="hover:bg-gray-50 border-b-2 border-white text-medium capitalize cursor-pointer transition-colors"
                          >
                            <td className="px-2 py-4 font-medium capitalize text-sm text-gray-900">
                              {student.referby?.name || "Organic"}
                            </td>
                            <td className="px-2 py-4">
                              <div className="flex items-center gap-3">

                                <span className="text-sm font-semibold text-gray-900">
                                  {student.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-2">
                              <div className="flex items-center lowercase gap-2 text-sm text-gray-600">
                                <Mail size={16} className="text-[#F26D44]" />
                                {student.email}
                              </div>
                              <div className="flex items-center lowercase gap-2 text-sm text-gray-600">
                                <PhoneCallIcon size={16} className="text-[#F26D44]" />
                                {student.phone}
                              </div>
                            </td>
                            {profile && profile.role == "admin" && <td className="px-2 py-4">
                              <select
                                value={student.assignto || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  e.stopPropagation();
                                }}
                                className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Unassigned</option>
                                {counsellors.map((counsellor) => (
                                  <option key={counsellor._id} value={counsellor._id}>
                                    {counsellor.name}
                                  </option>
                                ))}
                              </select>
                            </td>}
                            <td className="px-2 py-2">
                              <div className="flex items-center gap-2">
                                <div className="flex h-6 w-20 border shadow text-sm items-center overflow-hidden">
                                  <span
                                    className="h-full bg-[#F26D44]"
                                    style={{
                                      width: `${student.profile?.profileCompletion || 0}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm">
                                  {student.profile?.profileCompletion || 0}%
                                </span>
                              </div>
                            </td>
                            <td className="px-2 py-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border shadow ${student.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : student.status === "Inactive"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-red-100 text-red-700"
                                }`}>
                                {student.status === "Active" ? "Active" : "Inactive"}
                              </span>
                            </td>

                            <td className="px-2 py-2 text-sm font-medium text-gray-600">
                              {new Date(student.createdAt).toLocaleString()}
                            </td>
                            <td className="px-2 py-2 text-sm font-medium text-gray-600">
                              {student.lastLogin ? new Date(student.lastLogin).toLocaleString() : "N/A"}
                            </td>
                            <td className="px-2 py-4">
                              <div className="flex items-center gap-2">
                                <button

                                  className="p-1 text-red-600 rounded"
                                >
                                  <Edit size={18} />
                                </button>
                                {/* <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 size={18} />
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col bg-[#F26D44]/20 font-medium text-black sm:flex-row items-center justify-between gap-4 px-2 py-3 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Show</span>
                      <select
                        value={limit}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                        className="border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span className="text-sm text-gray-600">Entries</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      Showing {students.length > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, total)} of {total}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="p-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-sm text-gray-600 px-2">
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
              {!loading && students.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </motion.div>

        </AnimatePresence>
      </div>
    </LocalizationProvider>
  );
}