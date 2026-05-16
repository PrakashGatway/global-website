"use client"
import { useFieldArray, useFormContext } from "react-hook-form";
import Tooltip from "../tooltip";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ModernSelect } from "@/components/ui/select";
import axiosInstance from "@/app/axiosInstance";
import { Upload, FileText, X, RefreshCw, CheckCircle, Eye, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// Reusable error message component
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

// Reusable label component
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

// Base input styles
const baseInputStyles = `
  w-full px-3.5 py-2.5 text-sm rounded-lg border border-border 
  bg-background text-foreground placeholder:text-muted-foreground/70
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary 
  disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted/40
  transition-all duration-200 ease-in-out
  aria-invalid:border-destructive aria-invalid:focus:ring-destructive/30
`;

// Animation variants
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const childVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.1 } }
};

// Document Preview Modal Component
const DocumentPreview = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Document Preview</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        {isImage ? (
          <img src={url} alt="Preview" className="max-w-full h-auto" />
        ) : (
          <iframe src={url} className="w-full h-[500px]" title="Document Preview" />
        )}
      </div>
    </div>
  );
};

interface FormRendererProps {
  schema: any;
  sectionKey?: string;
  countries?: any[];
}

export default function FormRenderer({ schema, sectionKey = "", countries = [] }: FormRendererProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize file URLs from existing data
  useEffect(() => {
    if (sectionKey) {
      const existingDocs = watch(sectionKey);
      if (existingDocs && typeof existingDocs === 'object') {
        setFileUrls(existingDocs);
      }
    }
  }, [sectionKey, watch]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, field: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate file type based on field accept attribute
    const acceptTypes = field.accept?.split(',') || ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (acceptTypes.length > 0 && !acceptTypes.includes(fileExtension)) {
      toast.error(`Invalid file type. Accepted types: ${acceptTypes.join(', ')}`);
      return;
    }

    // Set uploading state to show loading indicator
    setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload response:", response.data); // Debug log

      if (response.data.success) {

        const fileUrl = response.data.docUrl;
        setFileUrls(prev => ({ ...prev, [fieldName]: fileUrl }));
        setValue(`${sectionKey}.${fieldName}`, fileUrl);
        toast.success(`${field.label} uploaded successfully!`);
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || `Failed to upload ${field.label}. Please try again.`);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
      // Clear the input value to allow re-uploading same file
      e.target.value = '';
    }
  };

  // Handle file removal
  const handleRemoveFile = (fieldName: string, field: any) => {
    setFileUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[fieldName];
      return newUrls;
    });
    setValue(`${sectionKey}.${fieldName}`, '');
    toast.success(`${field.label} removed successfully`);
  };

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
          const currentValue = watch(fullName);

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
                  <div className={cn(
                    "border-2 border-dashed rounded-lg p-4 transition-all",
                    fieldError ? "border-destructive" : "border-border hover:border-primary/50",
                    uploadingFiles[field.name] && "opacity-60"
                  )}>
                    <input
                      id={fullName}
                      type="file"
                      accept={ ".pdf,.jpg,.jpeg,.png"}
                      onChange={(e) => handleFileUpload(e, field.name, field)}
                      disabled={uploadingFiles[field.name] || isDisabled}
                      className="hidden"
                    />
                    
                    <label
                      htmlFor={fullName}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 cursor-pointer",
                        (uploadingFiles[field.name] || isDisabled) && "cursor-not-allowed"
                      )}
                    >
                      {uploadingFiles[field.name] ? (
                        <>
                          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                      ) : fileUrls[field.name] || currentValue ? (
                        <>
                          <CheckCircle className="w-8 h-8 text-green-500" />
                          <p className="text-sm text-green-600">File uploaded successfully</p>
                          <div className="flex gap-3 mt-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewUrl(fileUrls[field.name] || currentValue);
                              }}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(field.name, field);
                              }}
                              className="text-xs text-destructive hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <p className="text-sm text-center">
                            <span className="text-primary">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground text-center">
                            {field.accept?.replace(/\./g, '').toUpperCase() || 'PDF, JPG, PNG'} (Max 5MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  
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
                    {...register(fullName, {
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
                        {...register(fullName)}
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
                    {watch(fullName) && field.children && (
                      <motion.div
                        className="mt-4 pl-4 border-l-2 border-primary/30 space-y-4"
                        variants={childVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      >
                        <FormRenderer
                          schema={{ fields: field.children }}
                          sectionKey={fullName}
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
                      const subFullName = `${fullName}.${subField.name}`;
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
                  {...register(fullName, {
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
                    value={watch(fullName)}
                    onChange={(value) => setValue(fullName, value)}
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
                      {...register(fullName, {
                        required: isRequired ? `${field.label} is required` : false,
                      })}
                      disabled={isDisabled}
                      aria-invalid={!!fieldError}
                      className={cn(
                        baseInputStyles,
                        "appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTUgN2w1IDVsNS01IiAvPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]"
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
                  {...register(fullName, {
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

                  {field.options?.map((option: any, idx: number) => {
                    const optionId = `${fullName}-${option.value}`;
                    const fieldValue = watch(fullName);
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
                            {...register(fullName, {
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
                          setValue(fullName, [NONE_VALUE]);
                          return;
                        }

                        let updated = selectedValues.filter(v => v !== NONE_VALUE);

                        if (updated.includes(option.value)) {
                          updated = updated.filter(v => v !== option.value);
                        } else {
                          updated.push(option.value);
                        }

                        setValue(fullName, updated);
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
              {field.helperText && !fieldError && (
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
      {previewUrl && (
        <DocumentPreview url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </>
  );
}

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