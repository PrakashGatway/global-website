// app/admin/blogs/page.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Star,
  Ban,
  FileText,
  Calendar,
  Clock,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import BlogFormModal from "./blogForm";

const blogService = {
  getBlogs: (params) =>
    axiosInstance.get("/blogs", { params }).then((res) => res.data),
  deleteBlog: (id) => axiosInstance.delete(`/blogs/${id}`).then((res) => res.data),
  getCategories: () =>
    axiosInstance.get("/blogs/categories").then((res) => res.data.data),
};

const Blogs = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);


   const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

    const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowBlogForm(true);
  };

    const handleFormSuccess = () => {
    setShowBlogForm(false);
    setEditingBlog(null);
    fetchBlogs();
  };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogService.getBlogs({
        search,
        category,
        status,
        type,
        fromDate,
        toDate,
        page,
        limit,
        sort: "-createdAt",
      });
      setBlogs(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [search, category, status, type, fromDate, toDate, page, limit]);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await blogService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async () => {
    try {
      const res = await blogService.deleteBlog(deletingId);
      if (res.success) {
        toast.success("Blog deleted successfully");
        setShowDeleteModal(false);
        fetchBlogs();
      }
    } catch (error) {
      toast.error("Delete failed: " + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "event":
        return <Calendar size={16} />;
      case "webnair":
        return <Clock size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const totalPages = Math.ceil(total / limit);
  const limits = [5, 10, 20, 50];

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setType("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-4 py-4">
      <Toaster />

          <BlogFormModal
        isOpen={showBlogForm}
        onClose={() => {
          setShowBlogForm(false);
          setEditingBlog(null);
        }}
        onSuccess={handleFormSuccess}
        blogData={editingBlog}
      />

      {/* <AnimatePresence>
        {showBlogForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          >
            <BlogForm/>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your blog posts, events, and webinars
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300  hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Filter size={16} />
            Filters
          </button>
          <button
            onClick={fetchBlogs}
            className="p-2 border border-gray-300  hover:bg-gray-50 transition-colors text-gray-700"
          >
            <RefreshCw size={18} />
          </button>
           <button
            onClick={() => {
              setEditingBlog(null);
              setShowBlogForm(true);
            }}
            className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={18} />
            Add Blog
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white  shadow-sm border border-gray-200 p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search title..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Status */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>

              {/* Type */}
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="">All Types</option>
                <option value="blog">Blogs</option>
                <option value="event">Events</option>
                <option value="webnair">Webinars</option>
              </select>

              {/* Date Range */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                <span className="text-gray-400 self-center">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{Math.min((page - 1) * limit + 1, total)}</span> to{" "}
          <span className="font-medium">{Math.min(page * limit, total)}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 border border-gray-300  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {limits.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white  shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin -full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title & Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-500">No blogs found. Create your first blog!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  blogs?.map((blog) => (
                    <motion.tr
                      key={blog._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {blog.coverImage ? (
                              <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="h-10 w-10  object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10  bg-gray-200 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {blog.shortDescription || "No description"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 -full text-xs font-medium bg-blue-100 text-blue-800">
                          {getTypeIcon(blog.blogType)}
                          <span className="ml-1">
                            {blog.blogType?.charAt(0).toUpperCase() + blog.blogType?.slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 -full text-xs font-medium ${getStatusColor(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {blog.isFeatured ? (
                          <Star className="text-yellow-500" size={20} />
                        ) : (
                          <Ban className="text-gray-300" size={20} />
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/blogs/${blog._id}`)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50  transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(blog._id);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50  transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-300  text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else {
                if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1.5 border  text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "border-orange-600 bg-orange-50 text-orange-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-300  text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white  shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 -full">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Blog</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete this blog post? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300  text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white  text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default Blogs;