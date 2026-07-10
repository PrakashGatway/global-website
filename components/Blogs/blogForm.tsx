// app/admin/blogs/BlogFormModal.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Save,
  Calendar,
  Clock,
  FileText,
  Star,
} from "lucide-react";
import axiosInstance from "@/app/axiosInstance";
import dynamic from "next/dynamic";
import BlogDetailsPage from "../blogDetails";

// Dynamic import for CKEditor to avoid SSR issues
const CKEditorComponent = dynamic(
  () => import("./ckEditor"),
  { ssr: false }
);

// Multi-select component
const CustomMultiSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) =>
    option.name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (optionId) => {
    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  return (
    <div className="relative">
      <div
        className="border border-gray-300 p-2.5 cursor-pointer flex flex-wrap gap-2 bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        ) : (
          value.map((id) => {
            const option = options.find((opt) => opt._id === id);
            return (
              <span
                key={id}
                className="bg-orange-100 text-orange-800 px-2 py-1 text-xs flex items-center gap-1"
              >
                {option?.name}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(id);
                  }}
                  className="hover:text-orange-600"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-auto">
          <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-1.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="p-2">
            {filteredOptions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-2">
                No options found
              </p>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option._id}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleOption(option._id)}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option._id)}
                    onChange={() => { }}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                  />
                  <span className="text-base">{option.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Blog Service
const blogService = {
  getBlog: (id) => axiosInstance.get(`/blogs/${id}`).then((res) => res.data.data),
  createBlog: (data) => axiosInstance.post("/blogs", data).then((res) => res.data),
  updateBlog: (id, data) =>
    axiosInstance.put(`/blogs/${id}`, data).then((res) => res.data),
  getCategories: () =>
    axiosInstance.get("/blogs/categories").then((res) => res.data.data),
};

const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axiosInstance.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

const BlogFormModal = ({ isOpen, onClose, onSuccess, blogData }) => {
  const isEditing = !!blogData?._id;
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setpreview] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      content: "",
      category: [],
      status: "Draft",
      isFeatured: false,
      blogType: "blog",
      country: "",
      author: "",
      coverImage: "",
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      },
      extraMetadata: {
        ctaTitle: "",
        ctaDescription: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        location: "",
        eventType: "physical",
      },
      faq: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "faq",
  });

  // Watch for blogType changes
  const blogType = watch("blogType");
  const title = watch("title");

  // Fetch countries
  const fetchCountries = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/countries?limit=100");
      setCountries(res.data.data);
      setValue("country", blogData.country.name || "", { shouldValidate: true });
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const cats = await blogService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);



  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchCountries();

      if (isEditing && blogData) {
        // Set form values for editing
        reset({
          title: blogData.title || "",
          slug: blogData.slug || "",
          shortDescription: blogData.shortDescription || "",
          content: blogData.description || "",
          category: blogData?.category?.map((item) => item._id) || [],
          status: blogData.status || "Draft",
          isFeatured: blogData.isFeatured || false,
          coverImage: blogData.coverImage || "",
          blogType: blogData.blogType || "blog",
          author: blogData.author || "",
          country: blogData.country.name || "",
          seo: {
            metaTitle: blogData.seo?.metaTitle || "",
            metaDescription: blogData.seo?.metaDescription || "",
            keywords: blogData.seo?.keywords || "",
          },
          extraMetadata: {
            ctaTitle: blogData.extraMetadata?.ctaTitle || "",
            ctaDescription: blogData.extraMetadata?.ctaDescription || "",
            eventDate: blogData.extraMetadata?.eventDate || "",
            startTime: blogData.extraMetadata?.startTime || "",
            endTime: blogData.extraMetadata?.endTime || "",
            location: blogData.extraMetadata?.location || "",
            eventType: blogData.extraMetadata?.eventType || "physical",
          },
          faq: blogData.faq || [],
        });
      } else {
        reset({
          title: "",
          slug: "",
          shortDescription: "",
          content: "",
          category: [],
          status: "Draft",
          isFeatured: false,
          blogType: "blog",
          country: "",
          author: "",
          coverImage: "",
          seo: {
            metaTitle: "",
            metaDescription: "",
            keywords: "",
          },
          extraMetadata: {
            ctaTitle: "",
            ctaDescription: "",
            eventDate: "",
            startTime: "",
            endTime: "",
            location: "",
            eventType: "physical",
          },
          faq: [],
        });
      }
      setImagePreview("");
    }
  }, [isOpen, blogData, isEditing, reset, fetchCategories, fetchCountries]);

  // Auto-generate slug
  useEffect(() => {
    if (!isEditing && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-");
      setValue("slug", slug);
    }
  }, [title, isEditing, setValue]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const response = await uploadService.uploadImage(file);
      if (response.success) {
        setValue("coverImage", response.data.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
      console.log(error)
      setImagePreview("");
    } finally {
      setUploadingImage(false);
    }
  };
  const previewData = watch();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        description: data.content,
        faq: JSON.stringify(data.faq),
      };

      let res;
      if (isEditing) {
        res = await blogService.updateBlog(blogData._id, payload);
        toast.success("Blog updated successfully!");
      } else {
        res = await blogService.createBlog(payload);
        toast.success("Blog created successfully!");
      }

      if (res.success) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-1 bg-black/60 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          className="bg-white w-full max-h-[99vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-2 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-orange-600">
                {isEditing ? "Edit Blog" : "Create New Blog"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleSubmit(onSubmit)} id="blogForm">
              <div
                className={`grid grid-cols-1 gap-6 ${preview ? "lg:grid-cols-2" : "lg:grid-cols-3"
                  }`}
              >
                <div className={`${preview ? "lg:col-span-1" : "lg:col-span-2"} space-y-6`}>
                  <div className="relative bg-gray-100 border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Basic Information
                    </h3>
                    <button type="button" onClick={() => setpreview(!preview)} className="absolute top-2 right-2 border border-gray-300 hover:bg-gray-100 text-sm hover:text-black bg-orange-500 text-white py-1.5 px-4 rounded ">
                      Preview
                    </button>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          {...register("title", { required: "Title is required" })}
                          className="w-full px-3 py-2 border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter blog title"
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.title.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Slug *
                        </label>
                        <input
                          type="text"
                          {...register("slug", { required: "Slug is required" })}
                          className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="URL-friendly version of title"
                        />
                        {errors.slug && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.slug.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Short Description
                        </label>
                        <textarea
                          {...register("shortDescription")}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Brief summary of the blog"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content *
                        </label>
                        <Controller
                          control={control}
                          name="content"
                          rules={{ required: "Content is required" }}
                          render={({ field }) => (
                            <CKEditorComponent
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        {errors.content && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.content.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div className="bg-gray-100 border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      SEO Settings
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Title *
                        </label>
                        <input
                          type="text"
                          {...register("seo.metaTitle", {
                            required: "Meta title is required",
                          })}
                          className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter meta title"
                        />
                        {errors.seo?.metaTitle && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.seo.metaTitle.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Description *
                        </label>
                        <textarea
                          {...register("seo.metaDescription", {
                            required: "Meta description is required",
                          })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter meta description"
                        />
                        {errors.seo?.metaDescription && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.seo.metaDescription.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta Keywords *
                        </label>
                        <textarea
                          {...register("seo.keywords", {
                            required: "Meta keywords are required",
                          })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter meta keywords (comma separated)"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Meta keywords should be separated by commas
                        </p>
                        {errors.seo?.keywords && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.seo.keywords.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-gray-100 border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Call to Action
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CTA Title
                        </label>
                        <input
                          type="text"
                          {...register("extraMetadata.ctaTitle")}
                          className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter CTA title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CTA Description
                        </label>
                        <textarea
                          {...register("extraMetadata.ctaDescription")}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter CTA description"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="bg-gray-100 border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>
                      <button
                        type="button"
                        onClick={() => append({ question: "", answer: "" })}
                        className="px-4 py-2 bg-orange-600 text-white bg-orange-600 hover:bg-orange-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add FAQ
                      </button>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="border border-gray-200 p-4 bg-white"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-semibold text-gray-900">
                              FAQ {index + 1}
                            </h6>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question *
                              </label>
                              <Controller
                                control={control}
                                name={`faq.${index}.question`}
                                render={({ field }) => (
                                  <CKEditorComponent
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Answer *
                              </label>
                              <Controller
                                control={control}
                                name={`faq.${index}.answer`}
                                render={({ field }) => (
                                  <CKEditorComponent
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative lg:col-span-1 space-y-6">
                  {preview &&
                    <div className="bg-white absolute inset-0 z-1 outline-4 outline-orange-100 max-h-[calc(100vh-160px)] overflow-y-scroll border border-gray-200 p-6 pt-4 sticky top-0">
                      <button
                        onClick={() => setpreview(!preview)}
                        type="button"
                        className="p-2 absolute top-1 left-1 text-gray-400 border hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X size={24} />
                      </button>
                      <BlogDetailsPage
                        latestBlogs={null}
                        isPreview={true}
                        blog={{ ...previewData, description: previewData?.content }}
                        blogCategory={null}
                        allBlogs={null}
                        uniblog={null}
                        imageData={null}
                        videoData={null}
                      />
                    </div>}
                  <div className=" bg-gray-100 absolute inset-0 outline-4 outline-orange-100 max-h-[calc(100vh-160px)] overflow-y-scroll border border-gray-200 p-6 pt-4 sticky top-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Settings
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cover Image *
                        </label>
                        <div className="mt-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={uploadingImage}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-200"
                          />
                          {uploadingImage && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                              <span className="text-sm text-gray-500">
                                Uploading image...
                              </span>
                            </div>
                          )}
                          {imagePreview && (
                            <div className="mt-3">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-w-[200px] max-h-[200px] object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                          {watch("coverImage") && !imagePreview && (
                            <div className="mt-3">
                              <img
                                src={watch("coverImage")}
                                alt="Current"
                                className="max-w-[200px] max-h-[200px] object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <Controller
                          control={control}
                          name="category"
                          rules={{ required: "Category is required" }}
                          render={({ field }) => (
                            <CustomMultiSelect
                              options={categories}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Search and select categories..."
                            />
                          )}
                        />
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.category.message}
                          </p>
                        )}
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <select
                          {...register("country", { required: "Country is required" })}
                          className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.country.message}
                          </p>
                        )}
                      </div>

                      {/* Author */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Author Name
                        </label>
                        <input
                          type="text"
                          {...register("author")}
                          className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter author name"
                        />
                      </div>

                      {/* Status */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            {...register("status")}
                            className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                          </select>
                        </div>

                        {/* Blog Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            {...register("blogType")}
                            className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="blog">Blog</option>
                            <option value="event">Event</option>
                            <option value="webnair">Webnair</option>
                          </select>
                        </div>
                      </div>

                      {/* Event/Webnair Fields */}
                      {(blogType === "event" || blogType === "webnair") && (
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Event Date *
                            </label>
                            <input
                              type="date"
                              {...register("extraMetadata.eventDate", {
                                required: "Event date is required",
                              })}
                              className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            {errors.extraMetadata?.eventDate && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.extraMetadata.eventDate.message}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time *
                              </label>
                              <input
                                type="time"
                                {...register("extraMetadata.startTime", {
                                  required: "Start time is required",
                                })}
                                className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                              {errors.extraMetadata?.startTime && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.extraMetadata.startTime.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time *
                              </label>
                              <input
                                type="time"
                                {...register("extraMetadata.endTime", {
                                  required: "End time is required",
                                })}
                                className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                              {errors.extraMetadata?.endTime && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.extraMetadata.endTime.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location *
                            </label>
                            <input
                              type="text"
                              {...register("extraMetadata.location", {
                                required: "Location is required",
                              })}
                              className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Enter location"
                            />
                            {errors.extraMetadata?.location && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.extraMetadata.location.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Event Type *
                            </label>
                            <select
                              {...register("extraMetadata.eventType", {
                                required: "Event type is required",
                              })}
                              className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="physical">Physical</option>
                              <option value="virtual">Virtual</option>
                              <option value="live">Live</option>
                            </select>
                            {errors.extraMetadata?.eventType && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.extraMetadata.eventType.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Featured */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          {...register("isFeatured")}
                          className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Featured Post
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Featured posts appear prominently on your site
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="blogForm"
              disabled={submitting}
              className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEditing ? "Update Blog" : "Create Blog"}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogFormModal;