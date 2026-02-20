import Tooltip from "../tooltip";
import { UseFormRegister, FieldErrors, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils"; // Assumes you have a classnames utility
import { motion, AnimatePresence } from "framer-motion";

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


// Reusable label component with required indicator
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

// Base input styles for consistency
const baseInputStyles = `
  w-full px-3.5 py-2.5 text-sm rounded-lg border border-border 
  bg-background text-foreground placeholder:text-muted-foreground/70
  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary 
  disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted/40
  transition-all duration-200 ease-in-out
  aria-invalid:border-destructive aria-invalid:focus:ring-destructive/30
`;

// Animation variants for form fields
const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const childVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.1 } }
};

export default function FormRenderer({
  schema,
  formData,
  setFormData,
  sectionKey = "",
}: {
  schema: any;
  formData: any;
  setFormData: (data: any) => void;
  errors: FieldErrors<any>;
  register?: UseFormRegister<any>;
  sectionKey?: string;
}) {

  const { register, setValue, watch, formState: { errors } } = useFormContext();


  const handleChange = (name: string, value: any) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (register && sectionKey) {
      const event = { target: { name: `${sectionKey}.${name}`, value, type: 'change' } };
      // @ts-ignore - safely access internal handler
      register(`${sectionKey}.${name}`)(event);
    }
  };

  const values = watch();
  console.log(values);

  return (
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
        const fullName = sectionKey ? `${sectionKey}.${field.name}` : field.name;
        const fieldError = errors?.[field.name]?.message as string | undefined;
        const isRequired = field.required;
        const isDisabled = field.disabled;
        const isFullWidth = field.col === 2 || field.type === "radio" || field.type === "checkbox";

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

            {/* ================= TEXT INPUT ================= */}
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
                    required: isRequired && `${field.label} is required`,
                  })}
                  disabled={isDisabled}
                  placeholder={field.placeholder || `Enter ${field?.label?.toLowerCase()}`}
                  className={baseInputStyles}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  whileFocus={{ scale: 1.01, borderColor: "rgb(59, 130, 246)" }}
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

            {field.type === "switch" && (
              <>
                {/* SWITCH */}
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

                {/* 👇 CHILDREN RENDER */}
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
                        formData={{}}
                        setFormData={() => { }}
                        sectionKey={fullName}   // ⭐ THIS IS THE FIX
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}


            {/* ================= SCORE GROUP ================= */}
{field.type === "scoreGroup" && (
  <motion.div 
    className=" rounded-lg p-1 space-y-1"
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
                required:
                  subField.required &&
                  `${subField.label} is required`
              })}
              className={baseInputStyles}
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  </motion.div>
)}

            {/* ================= TEXTAREA ================= */}
            {field.type === "textarea" && (
              <motion.textarea
                id={fullName}
                rows={field.rows || 4}
                {...(register ? register(fullName, { required: isRequired && `${field.label} is required` }) : {})}
                value={formData[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={isDisabled}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                aria-invalid={!!fieldError}
                className={cn(
                  baseInputStyles,
                  "resize-y min-h-[100px] leading-relaxed",
                  fieldError && "border-destructive focus:ring-destructive/30"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileFocus={{ scale: 1.005 }}
              />
            )}

            {/* ================= SELECT ================= */}
            {field.type === "select" && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.select
                  id={fullName}
                  {...(register ? register(fullName, { required: isRequired && `${field.label} is required` }) : {})}
                  value={formData[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={isDisabled}
                  aria-invalid={!!fieldError}
                  className={cn(
                    baseInputStyles,
                    "appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTUgN2w1IDVsNS01Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]",
                    fieldError && "border-destructive focus:ring-destructive/30"
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
            )}



            {/* ================= DATE ================= */}
            {field.type === "date" && (
              <motion.input
                id={fullName}
                type="date"
                {...(register ? register(fullName, { required: isRequired && `${field.label} is required` }) : {})}
                value={formData[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={isDisabled}
                aria-invalid={!!fieldError}
                className={cn(
                  baseInputStyles,
                  "[&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
                  fieldError && "border-destructive focus:ring-destructive/30"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileFocus={{ scale: 1.01 }}
              />
            )}

            {/* ================= RADIO GROUP ================= */}
            {field.type === "radio" && (
              <motion.fieldset 
                className="space-y-2.5 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <legend className="sr-only">{field.label}</legend>
                {field.options?.map((option: any, idx: number) => {
                  const isSelected = formData?.[field.name] === option.value;
                  const optionId = `${fullName}-${option.value}`;

                  return (
                    <motion.div 
                      key={option.value} 
                      className="relative"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                    >
                      <motion.label
                        htmlFor={optionId}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:border-primary/50 hover:bg-muted/30",
                          isDisabled && "opacity-60 cursor-not-allowed hover:border-border hover:bg-transparent"
                        )}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <input
                          id={optionId}
                          type="radio"
                          name={fullName}
                          value={option.value}
                          checked={isSelected}
                          {...(register ? register(fullName, { required: isRequired && `${field.label} is required` }) : {})}
                          onChange={() => handleChange(field.name, option.value)}
                          disabled={isDisabled}
                          className="mt-1 w-4 h-4 text-primary border-border focus:ring-primary/30 disabled:opacity-60"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-foreground">{option.label}</span>
                          {option.description && (
                            <motion.p 
                              className="text-xs text-muted-foreground mt-0.5"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              {option.description}
                            </motion.p>
                          )}
                        </div>
                        {option.tooltip && (
                          <div className="flex-shrink-0">
                            <Tooltip text={option.tooltip} side="top" />
                          </div>
                        )}
                      </motion.label>

                      {/* Conditional children rendering */}
                      <AnimatePresence>
                        {isSelected && option.children && (
                          <motion.div 
                            className="ml-7 mt-3 pl-4 border-l-2 border-primary/30"
                            variants={childVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                          >
                            <FormRenderer
                              schema={{ fields: option.children }}
                              formData={formData}
                              setFormData={setFormData}
                              errors={errors}
                              register={register}
                              sectionKey={sectionKey}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Conditional score group */}
                      <AnimatePresence>
                        {isSelected && option.scoreGroup && (
                          <motion.div 
                            className="ml-7 mt-4 p-4 rounded-lg bg-muted/40 border-border"
                            variants={childVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                          >
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <motion.svg 
                                className="w-4 h-4 text-primary" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                animate={{ rotate: [0, 10, 0] }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </motion.svg>
                              {option.scoreGroup.title}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {option.scoreGroup.fields.map((subField: any) => {
                                const subFullName = sectionKey ? `${sectionKey}.${subField.name}` : subField.name;
                                const subError = errors?.[subField.name]?.message as string | undefined;

                                return (
                                  <motion.div 
                                    key={subField.name} 
                                    className="space-y-1.5"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <FieldLabel
                                      label={subField.label}
                                      required={subField.required}
                                      htmlFor={subFullName}
                                    />
                                    <motion.input
                                      id={subFullName}
                                      type={subField.type || "text"}
                                      {...(register ? register(subFullName, { required: subField.required && `${subField.label} is required` }) : {})}
                                      value={formData[subField.name] ?? ""}
                                      onChange={(e) => handleChange(subField.name, e.target.value)}
                                      aria-invalid={!!subError}
                                      className={cn(
                                        baseInputStyles,
                                        subError && "border-destructive focus:ring-destructive/30"
                                      )}
                                      whileFocus={{ scale: 1.01 }}
                                    />
                                    <FieldError message={subError} />
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.fieldset>
            )}

            {/* ================= CHECKBOX GROUP ================= */}
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
                      transition: {
                        staggerChildren: 0.02
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {field.options?.map((option: any) => {
                    const selectedValues = formData[field.name] || [];
                    const isChecked = selectedValues.includes(option.value);
                    const checkboxId = `${fullName}-${option.value}`;

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
                          isChecked
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:border-primary/50 hover:bg-muted/30",
                          isDisabled && "opacity-60 cursor-not-allowed hover:border-border hover:bg-transparent"
                        )}
                      >
                        <input
                          id={checkboxId}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            let updated = [...selectedValues];

                            if (option.value === "none") {
                              updated = ["none"];
                            } else {
                              updated = updated.filter((v: string) => v !== "none");
                              if (updated.includes(option.value)) {
                                updated = updated.filter((v: string) => v !== option.value);
                              } else {
                                updated.push(option.value);
                              }
                            }

                            setFormData((prev: any) => ({ ...prev, [field.name]: updated }));

                            if (setValue && sectionKey) {
                              setValue(`${sectionKey}.${field.name}`, updated, {
                                shouldValidate: true,
                                shouldDirty: true
                              });
                            }
                          }}
                          disabled={isDisabled}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary/30 disabled:opacity-60"
                        />
                        <span className="text-sm text-foreground">{option.label}</span>
                        {option.tooltip && <Tooltip text={option.tooltip} side="top" />}
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
  );
}