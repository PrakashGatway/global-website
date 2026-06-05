"use client"
import { useFieldArray, useFormContext } from "react-hook-form";
import Tooltip from "../tooltip";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, use } from "react";
import { ModernSelect } from "@/components/ui/select";
import axiosInstance from "@/app/axiosInstance";
import { Upload, FileText, X, RefreshCw, CheckCircle, Eye, Trash2, FileIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useGlobal } from "@/src/statecontext";

// --- Helper Functions ---

const getFileName = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:')) return 'Uploaded Image';
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart.split('?')[0] || 'Document';
};

const getFileTypeIcon = (url: string) => {
  const isImg = url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.startsWith('data:image');
  const imageUrl = url.startsWith('http') ? url :
    process.env.NODE_ENV === "development"
      ? `http://localhost:5000${url}`
      : url;

  if (isImg) {
    return (
      <div className="w-full h-full relative">
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = "https://static.thenounproject.com/png/3191078-200.png";
          }}
        />
      </div>
    );
  }

  if (/\.(pdf)$/i.test(url)) return <FileText className="w-8 h-8 text-red-500" />;
  if (/\.(doc|docx)$/i.test(url)) return <FileIcon className="w-8 h-8 text-blue-500" />;
  return <FileIcon className="w-8 h-8 text-gray-500" />;
};

// --- Components ---

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      role="alert"
      aria-live="polite"
      className="flex items-center gap-1 text-xs text-destructive mt-1.5"
    >
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </motion.p>
  ) : null;

const FieldLabel = ({
  label,
  required,
  tooltip,
  htmlFor
}: {
  label: string;
  required?: boolean;
  tooltip?: string;
  htmlFor?: string;
}) => (
  <motion.label
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    htmlFor={htmlFor}
    className="flex items-center gap-1.5 text-sm font-medium text-foreground/90 mb-1.5 group"
  >
    {label}
    {required && (
      <span
        className="text-destructive font-semibold"
        aria-label="required field"
        title="Required field"
      >
        *
      </span>
    )}
    {tooltip && <Tooltip text={tooltip} side="top" />}
  </motion.label>
);

const DocumentPreview = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.startsWith('data:image');
  const imageUrl = url.startsWith('http') ? url :
    process.env.NODE_ENV === "development"
      ? `http://localhost:5000${url}`
      : url;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="font-semibold text-base sm:text-lg">Document Preview</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-md">{getFileName(url)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-auto max-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
          {isImage ? (
            <img
              src={imageUrl}
              alt="Document preview"
              className="max-w-full h-auto max-h-[50vh] object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "https://static.thenounproject.com/png/3191078-200.png";
              }}
            />
          ) : (
            <iframe
              src={imageUrl}
              className="w-full h-[50vh] min-h-[300px] rounded-lg"
              title="Document Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Download
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// File Upload Counter Component
const FileUploadCounter = ({ uploadedFiles, totalFields }: { uploadedFiles: number; totalFields: number }) => {
  if (totalFields === 0) return null;
  

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">File Upload Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">{uploadedFiles}</span>
          <span className="text-sm text-muted-foreground">/ {totalFields}</span>
        </div>
      </div>
      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(uploadedFiles / totalFields) * 100}%` }}
          className="h-full bg-primary rounded-full"
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

interface FormRendererProps {
  schema: any;
  sectionKey?: string;
  countries?: any[];
}

export default function FormRenderer({ schema, sectionKey = "", countries = [] }: FormRendererProps) {
  const { register, watch, setValue, getValues, formState: { errors } } = useFormContext();
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { allProfile } = useGlobal()

  

  // Helper function to check if a file exists in form data (persisted after refresh)
  const hasFileInFormData = (fieldName: string): boolean => {
    const formPath = sectionKey ? `${sectionKey}.${fieldName}` : fieldName;
    const value = getValues(formPath);
    return !!(value && typeof value === 'string' && value.trim() !== '' && !value.includes('nofile'));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, field: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file already exists in form data (from API or previous upload)
    if (hasFileInFormData(fieldName)) {
      toast.error("File already exists. Please remove the existing file first if you want to change it.");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const acceptTypes = field.accept?.split(',') || ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (acceptTypes.length > 0 && !acceptTypes.includes(fileExtension)) {
      toast.error(`Invalid file type. Accepted: ${acceptTypes.join(', ')}`);
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const extraData = {
        fieldName,
        status: "uploaded",
        imageUrl: URL.createObjectURL(file),
      };

      formData.append("data", JSON.stringify(extraData));

      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      if (response.data?.success && response.data?.docUrl) {
        let fileUrl = response.data.docUrl;

        if (fileUrl.includes("nofile") || fileUrl === "/uploads/docs/nofile" || (!fileUrl.startsWith('/uploads/') && !fileUrl.startsWith('http'))) {
          throw new Error("Server returned an invalid file URL. Please try again or contact support.");
        }

        const formPath = sectionKey
          ? `${sectionKey}.${fieldName}`
          : fieldName;

        setValue(formPath, fileUrl, { shouldValidate: true, shouldDirty: true });

        toast.success(`${field.label} uploaded successfully!`);
      } else {
        throw new Error(response.data?.message || "Upload failed - no valid URL returned");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      const errorMsg = error.message || error.response?.data?.message || `Failed to upload ${field.label}.`;
      toast.error(errorMsg);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
      if (e.target) e.target.value = '';
    }
  };





  const handleRemoveFile = (fieldName: string, field: any) => {
    const formPath = sectionKey
      ? `${sectionKey}.${fieldName}`
      : fieldName;

    setValue(formPath, '', { shouldValidate: true, shouldDirty: true });
    toast.success(`${field.label} removed`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, fieldName: string, field: any) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if file already exists in form data
    if (hasFileInFormData(fieldName)) {
      toast.error("File already exists. Please remove the existing file first if you want to change it.");
      return;
    }

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const fakeEvent = {
        target: {
          files: files,
          value: ''
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      handleFileUpload(fakeEvent, fieldName, field);
    }
  };

  // Collect all file fields to show upload progress
  const getAllFileFields = (schema: any): string[] => {
    if (!schema?.fields) return [];

    const fileFields: string[] = [];
    const collectFileFields = (fields: any[]) => {
      fields.forEach((field: any) => {
        if (field.type === "file") {
          fileFields.push(field.name);
        }
        // Handle nested fields in radio children, etc.
        if (field.type === "radio" && field.options) {
          field.options.forEach((option: any) => {
            if (option.children) {
              collectFileFields(option.children);
            }
          });
        }
        if (field.type === "switch" && field.children) {
          collectFileFields(field.children);
        }
      });
    };

    collectFileFields(schema.fields);
    return fileFields;
  };

  const fileFields = getAllFileFields(schema);
  // Count uploaded files by checking actual form data
// Method 1: Simple and accurate for your data structure
const uploadedFiles = () => {
  const docs = allProfile?.profile?.documents;
  if (!docs) return 0;
  
  let count = 0;
  
  // Count academic documents (tenthMarksheet and twelfthMarksheet)
  if (docs.academic) {
    if (docs.academic.tenthMarksheet);
    if (docs.academic.twelfthMarksheet);
  }
  

  
  // Count other documents
  if (docs.other) {
    if (docs.other.cv) count++;
    if (docs.other.experience) count++;
    if (docs.other.photograph) count++;
    if (docs.other.ieltsScorecard) count++;
    if (docs.other.lor) count++;
  }
  
  return count;
};

// Usage
const uploadedFilesCount = uploadedFiles(); // This will return 3 (tenthMarksheet, twelfthMarksheet, cv)



  if (schema?.type === "multi" && schema.sections) {
    return (
      <div className="space-y-10">
        {Object.entries(schema.sections).map(
          ([sectionName, section]: any) => (
            <div key={sectionName}>
              {section.title && (
                <h3 className="text-lg font-semibold mb-4">
                  {section.title}
                </h3>
              )}

              {section.type === "repeatable" ? (
                <RepeatableSection
                  section={section}
                  countries={countries}
                  sectionKey={
                    sectionKey
                      ? `${sectionKey}.${sectionName}`
                      : sectionName
                  }
                />
              ) : (
                <FormRenderer
                  schema={section}
                  sectionKey={
                    sectionKey
                      ? `${sectionKey}.${sectionName}`
                      : sectionName
                  }
                  countries={countries}
                />
              )}
            </div>
          )
        )}
      </div>
    )
  }

  if (!schema || !schema.fields) return null;

  return (
    <>
      {/* File Upload Counter */}
      {fileFields.length > 0 && (
        <FileUploadCounter uploadedFiles={uploadedFilesCount} totalFields={fileFields.length} />
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-1 gap-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
        {schema.fields.map((field: any, index: number) => {
          const fullName = sectionKey ? `${field.name}` : field.name;
          const fieldError = errors?.[fullName]?.message as string | undefined;
          const isRequired = field.required;
          const isDisabled = field.disabled;
          const isFullWidth = field.col === 2 || field.type === "radio" || field.type === "checkbox";

          const formPath = sectionKey ? `${sectionKey}.${field.name}` : field.name;
          const apiDocument =
            allProfile?.profile?.documents?.[field.name];

          const currentValue =
            apiDocument?.url ||
            watch(formPath);

          const hasFile =
            apiDocument?.status === "true" ||
            hasFileInFormData(field.name);

          return (
            <motion.div
              key={field.name}
              variants={fieldVariants}
              custom={index}
              className={cn(
                "space-y-1.5",
                isFullWidth && "md:col-span-2"
              )}
            >
              {/* LABEL */}
              <FieldLabel
                label={field.label}
                required={isRequired}
                tooltip={field.tooltip}
                htmlFor={fullName}
              />

              {/* FILE UPLOAD */}
              {field.type === "file" && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, field.name, field)}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-4 transition-all relative group",
                      fieldError ? "border-destructive bg-destructive/5" : "border-border hover:border-primary/50 hover:bg-muted/30",
                      (uploadingFiles[field.name] || hasFile) && "opacity-60 pointer-events-none"
                    )}
                  >
                    <input
                      id={fullName}
                      type="file"
                      ref={fileInputRef}
                      accept={field.accept || ".pdf,.jpg,.jpeg,.png"}
                      onChange={(e) => handleFileUpload(e, field.name, field)}
                      disabled={uploadingFiles[field.name] || isDisabled || hasFile}
                      className="hidden"
                    />

                    <label
                      htmlFor={fullName}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 cursor-pointer min-h-[120px]",
                        (uploadingFiles[field.name] || isDisabled || hasFile) && "cursor-not-allowed"
                      )}
                    >
                      {/* State: Uploading */}
                      {uploadingFiles[field.name] ? (
                        <>
                          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                      ) :
                        // State: File Exists (check persisted form data)
                        (hasFile && currentValue) ? (
                          <div className="w-full flex items-center gap-3 sm:gap-4 p-2">
                            {/* Thumbnail / Icon */}
                            <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white border border-border flex items-center justify-center overflow-hidden shadow-sm">
                              {getFileTypeIcon(currentValue)}
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-sm font-medium text-foreground truncate">
                                {getFileName(currentValue)}
                              </p>
                              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <CheckCircle className="w-3 h-3" />
                                Uploaded - Cannot reupload
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5">
                              <motion.button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  if (currentValue && !currentValue.includes("nofile") && currentValue !== "/uploads/docs/nofile") {
                                    setPreviewUrl(currentValue);
                                  } else {
                                    toast.error("No valid file to preview.");
                                  }
                                }}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Preview document"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                              </motion.button>
                              <motion.button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleRemoveFile(field.name, field);
                                }}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Remove file"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </motion.button>
                            </div>
                          </div>
                        ) :
                          // State: Empty - Upload Prompt
                          (
                            <>
                              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Upload className="w-7 h-7 text-primary" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm sm:text-base font-medium text-foreground">
                                  <span className="text-primary">Click to upload</span> or drag & drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {(field.accept || "PDF, JPG, PNG").replace(/\./g, '').toUpperCase()} • Max 5MB
                                </p>
                              </div>
                            </>
                          )}
                    </label>

                    {/* Disabled overlay text when file exists */}
                    {hasFile && currentValue && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                        <p className="text-white text-sm font-medium">File Uploaded - Cannot Reupload</p>
                      </div>
                    )}
                  </div>

                  {field.helperText && !fieldError && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {field.helperText}
                    </p>
                  )}

                  <FieldError message={fieldError} />
                </motion.div>
              )}

              {/* TEXT INPUT */}
              {(field.type === "text" || field.type === "email" || field.type === "number" || field.type === "tel" || field.type === "url" || !field.type) && (
                <motion.div
                  className="relative"
                  whileTap={{ scale: 0.995 }}
                  transition={{ duration: 0.1 }}
                >
                  <motion.input
                    id={fullName}
                    type={field.type || "text"}
                    {...register(formPath, {
                      required: isRequired ? `${field.label} is required` : false,
                    })}
                    disabled={isDisabled}
                    placeholder={field.placeholder || `Enter ${field.label?.toLowerCase()}`}
                    className={baseInputStyles}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    whileFocus={{ scale: 1.01 }}
                    aria-invalid={!!fieldError}
                  />
                  {field.prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                      {field.prefix}
                    </span>
                  )}
                  {field.suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                      {field.suffix}
                    </span>
                  )}
                </motion.div>
              )}

              {/* SWITCH */}
              {field.type === "switch" && (
                <>
                  <motion.div
                    className="flex items-center justify-between border rounded-lg px-4 py-3"
                    whileHover={{ scale: 1.01, borderColor: "rgba(59, 130, 246, 0.5)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {field.label}
                    </span>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register(formPath)}
                        className="sr-only peer"
                      />
                      <motion.div
                        className="
                          w-11 h-6 bg-gray-300 rounded-full
                          peer-checked:bg-blue-600
                          transition-colors duration-200
                          after:content-['']
                          after:absolute after:top-[2px] after:left-[2px]
                          after:bg-white after:border after:rounded-full
                          after:h-5 after:w-5 after:transition-all
                          peer-checked:after:translate-x-full
                        "
                        whileTap={{ scale: 0.95 }}
                      />
                    </label>
                  </motion.div>

                  {/* Children Render */}
                  <AnimatePresence>
                    {watch(formPath) && field.children && (
                      <motion.div
                        className="mt-4 pl-4 border-l-2 border-primary/30 space-y-4"
                        variants={childVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      >
                        <FormRenderer
                          schema={{ fields: field.children }}
                          sectionKey={formPath}
                          countries={countries}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* SCORE GROUP */}
              {field.type === "scoreGroup" && (
                <motion.div
                  className="rounded-lg p-1 space-y-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <motion.div
                    className="grid grid-cols-2 gap-2"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.03
                        }
                      }
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {field.fields?.map((subField: any) => {
                      const subFullName = `${formPath}.${subField.name}`;
                      const subError = errors?.[subFullName]?.message as string | undefined;

                      return (
                        <motion.div
                          key={subField.name}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                          }}
                        >
                          <FieldLabel
                            label={subField.label}
                            required={subField.required}
                            htmlFor={subFullName}
                          />
                          <motion.input
                            id={subFullName}
                            type={subField.type || "text"}
                            {...register(subFullName, {
                              required: subField.required ? `${subField.label} is required` : false
                            })}
                            className={baseInputStyles}
                            whileFocus={{ scale: 1.01 }}
                            transition={{ duration: 0.1 }}
                            aria-invalid={!!subError}
                          />
                          <FieldError message={subError} />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}

              {/* TEXTAREA */}
              {field.type === "textarea" && (
                <motion.textarea
                  id={fullName}
                  rows={field.rows || 4}
                  {...register(formPath, {
                    required: isRequired ? `${field.label} is required` : false,
                  })}
                  disabled={isDisabled}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  aria-invalid={!!fieldError}
                  className={cn(
                    baseInputStyles,
                    "resize-y min-h-[100px] leading-relaxed"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileFocus={{ scale: 1.005 }}
                />
              )}

              {/* SELECT */}
              {field.type === "select" && (
                field.optionsSource === "countries" ? (
                  <ModernSelect
                    options={countries}
                    value={watch(formPath)}
                    onChange={(value) => setValue(formPath, value)}
                    placeholder={`Select ${field.label}`}
                    className="py-0"
                  />
                ) : (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.select
                      id={fullName}
                      {...register(formPath, {
                        required: isRequired ? `${field.label} is required` : false,
                      })}
                      disabled={isDisabled}
                      aria-invalid={!!fieldError}
                      className={cn(
                        baseInputStyles,
                        "appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bGxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTUgN2w1IDVsNS01IiAvPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]"
                      )}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <option value="" disabled>Select {field.label}</option>
                      {field.options?.map((option: any) => (
                        <option key={option.value ?? option} value={option.value ?? option}>
                          {option.label ?? option}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>
                )
              )}

              {/* DATE */}
              {field.type === "date" && (
                <motion.input
                  id={fullName}
                  type="date"
                  {...register(formPath, {
                    required: isRequired ? `${field.label} is required` : false,
                  })}
                  disabled={isDisabled}
                  aria-invalid={!!fieldError}
                  className={cn(
                    baseInputStyles,
                    "[&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileFocus={{ scale: 1.01 }}
                />
              )}

              {/* RADIO GROUP */}
              {field.type === "radio" && (
                <motion.fieldset className="space-y-2.5 mt-1">
                  <legend className="sr-only">{field.label}</legend>

                  {field.options?.map((option: any) => {
                    const optionId = `${fullName}-${option.value}`;
                    const fieldValue = watch(formPath);
                    const isSelected = fieldValue === option.value;

                    return (
                      <motion.div key={option.value} className="relative">
                        <motion.label
                          htmlFor={optionId}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                              : "border-border hover:border-primary/50 hover:bg-muted/30",
                            isDisabled && "opacity-60 cursor-not-allowed"
                          )}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <input
                            id={optionId}
                            type="radio"
                            value={option.value}
                            {...register(formPath, {
                              required: isRequired ? `${field.label} is required` : false,
                            })}
                            disabled={isDisabled}
                            className="w-4 h-4 text-primary border-border focus:ring-primary/30 disabled:opacity-60 flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 block">
                              {option.label}
                            </span>
                            {option.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                {option.description}
                              </p>
                            )}
                          </div>

                          {option.tooltip && (
                            <div className="flex-shrink-0">
                              <Tooltip text={option.tooltip} side="top" />
                            </div>
                          )}
                        </motion.label>

                        <AnimatePresence mode="wait">
                          {isSelected && (
                            <motion.div
                              className="ml-7 mt-3 pl-4 border-l-2 border-primary/30 space-y-4"
                              variants={childVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                            >
                              {option.children && (
                                <FormRenderer
                                  schema={{ fields: option.children }}
                                  sectionKey={sectionKey}
                                  countries={countries}
                                />
                              )}

                              {option.scoreGroup && option.scoreGroup.fields && (
                                <div className="space-y-3 pt-2">
                                  {option.scoreGroup.title && (
                                    <h4 className="text-sm font-semibold text-foreground/80">
                                      {option.scoreGroup.title}
                                    </h4>
                                  )}
                                  {option.scoreGroup.fields.map((scoreField: any) => {
                                    const scoreFieldName = `${sectionKey}.${scoreField.name}`;
                                    const scoreError = errors?.[scoreFieldName]?.message as string | undefined;

                                    return (
                                      <div key={scoreField.name} className="space-y-1">
                                        <FieldLabel
                                          label={scoreField.label}
                                          required={scoreField.required}
                                          htmlFor={scoreFieldName}
                                        />
                                        <input
                                          id={scoreFieldName}
                                          type={scoreField.type || "text"}
                                          {...register(scoreFieldName, {
                                            required: scoreField.required ? `${scoreField.label} is required` : false
                                          })}
                                          className={baseInputStyles}
                                          aria-invalid={!!scoreError}
                                        />
                                        <FieldError message={scoreError} />
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.fieldset>
              )}

              {/* CHECKBOX GROUP */}
              {field.type === "checkbox" && (
                <motion.fieldset
                  className="space-y-2 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <legend className="sr-only">{field.label}</legend>

                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.02 }
                      }
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {field.options?.map((option: any) => {
                      const checkboxId = `${fullName}-${option.value}`;
                      const selectedValues: string[] = currentValue || [];

                      const handleChange = () => {
                        const NONE_VALUE = "none";

                        if (option.value === NONE_VALUE) {
                          setValue(formPath, [NONE_VALUE]);
                          return;
                        }

                        let updated = selectedValues.filter(v => v !== NONE_VALUE);

                        if (updated.includes(option.value)) {
                          updated = updated.filter(v => v !== option.value);
                        } else {
                          updated.push(option.value);
                        }

                        setValue(formPath, updated);
                      };

                      return (
                        <motion.label
                          key={option.value}
                          htmlFor={checkboxId}
                          variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            visible: { opacity: 1, scale: 1 }
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-200 select-none",
                            selectedValues.includes(option.value)
                              ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                              : "border-border hover:border-primary/50 hover:bg-muted/30",
                            isDisabled && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          <input
                            id={checkboxId}
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            onChange={handleChange}
                            disabled={isDisabled}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary/30"
                          />

                          <span className="text-sm text-foreground">
                            {option.label}
                          </span>

                          {option.tooltip && (
                            <Tooltip text={option.tooltip} side="top" />
                          )}
                        </motion.label>
                      );
                    })}
                  </motion.div>
                </motion.fieldset>
              )}

              {/* ERROR MESSAGE */}
              <AnimatePresence>
                {fieldError && <FieldError message={fieldError} />}
              </AnimatePresence>

              {/* HELPER TEXT */}
              {field.helperText && !fieldError && field.type !== "file" && (
                <motion.p
                  className="text-xs text-muted-foreground mt-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {field.helperText}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <DocumentPreview url={previewUrl} onClose={() => setPreviewUrl(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// Animation variants
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const childVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.1 } }
};

// Base input styles
const baseInputStyles = `
  w-full px-3.5 py-2.5 text-sm rounded-lg border border-border 
  bg-background text-foreground placeholder:text-muted-foreground/70
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary 
  disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted/40
  transition-all duration-200 ease-in-out
  aria-invalid:border-destructive aria-invalid:focus:ring-destructive/30
`;

function RepeatableSection({ section, sectionKey, countries }: any) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: sectionKey
  });

  const MAX_ITEMS = 3;

  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <div key={item.id} className="border rounded-xl p-5 relative">
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          )}

          <FormRenderer
            schema={{ fields: section.fields }}
            sectionKey={`${sectionKey}.${index}`}
            countries={countries}
          />
        </div>
      ))}

      {fields.length < MAX_ITEMS && (
        <button
          type="button"
          onClick={() => append({})}
          className="px-4 py-2 rounded-lg border border-dashed border-primary text-primary hover:bg-primary/5 transition-colors"
        >
          + Add School
        </button>
      )}
    </div>
  );
}