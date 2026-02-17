import Tooltip from "../tooltip";
// Import RegisterOptions if you need advanced validation, otherwise just use the function
import { UseFormRegister } from "react-hook-form"; 

export default function FormRenderer({
  schema,
  formData,
  setFormData,
  errors,
  setValue,
  register, // ✅ 1. Accept register from parent
  sectionKey = "", // ✅ 2. Accept the section key (e.g., "profile", "address")
}: {
  schema: any;
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
  register?: UseFormRegister<any>; // Optional if used in nested recursion
  sectionKey?: string;
}) {

  const handleChange = (name: string, value: any) => {
    const updated = { ...formData, [name]: value };
    
    // Update local state for immediate UI feedback
    setFormData(updated);

    // ✅ 3. CRITICAL: If register exists, tell react-hook-form about the change
    if (register && sectionKey) {
      // We manually trigger the onChange event for react-hook-form
      // This ensures watch() and isValid update correctly
      const event = { target: { name: `${sectionKey}.${name}`, value } };
      // @ts-ignore - accessing internal handler safely
      register(`${sectionKey}.${name}`)(event as any); 
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {schema.fields.map((field: any) => {
        const fullName = sectionKey ? `${sectionKey}.${field.name}` : field.name;
        const fieldError = errors?.[field.name]; // Errors usually come flattened or mapped
        const isRequired = field.required;

        return (
          <div
            key={field.name}
            className={field.col === 2 || field.type === "radio" ? "col-span-2" : ""}
          >
            {/* LABEL */}
            <label className="text-sm font-medium mb-1 block">
              {field.label}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </label>

            {/* ================= SELECT ================= */}
            {field.type === "select" && (
              <select
                // ✅ 4. Bind register here
                {...(register ? register(fullName, { required: isRequired }) : {})}
                
                value={formData[field.name] || ""}
                onChange={(e) => {
                  handleChange(field.name, e.target.value);
                  // If using register, the spread above handles the RHF update, 
                  // but we keep handleChange for local state sync
                }}
                disabled={field.disabled}
                className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  fieldError ? "border-destructive" : "border-border"
                }`}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {field.type === "checkbox" && (
  <div className="space-y-2 mt-2">
    {field.options?.map((option: any) => {
      const selectedValues = formData[field.name] || [];
      const isChecked = selectedValues.includes(option.value);

      return (
        <label key={option.value} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isChecked}
            className="w-4 h-4 accent-primary"
            onChange={() => {
              let updated = [...selectedValues];

              // ✅ EXCLUSIVE OPTION LOGIC
              if (option.value === "none") {
                updated = ["none"];
              } else {
                updated = updated.filter(v => v !== "none");

                if (updated.includes(option.value)) {
                  updated = updated.filter(v => v !== option.value);
                } else {
                  updated.push(option.value);
                }
              }

              // update local UI
              setFormData((prev: any) => ({
                ...prev,
                [field.name]: updated,
              }));

              // ✅ update RHF form state
              if (setValue && sectionKey) {
                setValue(`${sectionKey}.${field.name}`, updated);
              }
            }}
          />

          <span>{option.label}</span>
        </label>
      );
    })}
  </div>
)}


{field.type === "textarea" && (
  <textarea
    {...register(fullName)}
    defaultValue={formData[field.name] || ""}
    placeholder={field.placeholder}
    className="w-full px-4 py-2 border rounded-lg"
  />
)}


            {/* ================= DATE ================= */}
            {field.type === "date" && (
              <input
                type="date"
                // ✅ 4. Bind register here
                {...(register ? register(fullName, { required: isRequired }) : {})}
                
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={field.disabled}
                className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  fieldError ? "border-destructive" : "border-border"
                }`}
              />
            )}

            {/* ================= RADIO ================= */}
            {field.type === "radio" && (
              <div className="mt-2 space-y-3">
                {field.options?.map((option: any) => {
                  const isSelected = formData && formData[field?.name] === option?.value;

                  return (
                    <div key={option?.value}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={fullName} // ✅ Use full name for grouping
                          value={option.value}
                          checked={isSelected}
                          // ✅ 4. Bind register here
                          {...(register ? register(fullName, { required: isRequired }) : {})}
                          
                          onChange={() => handleChange(field.name, option.value)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>{option.label}</span>
                        {option.tooltip && <Tooltip text={option.tooltip} />}
                      </label>

                      {isSelected && option.children && (
                        <div className="ml-6 mt-3 border-l pl-4">
                          <FormRenderer
                            schema={{ fields: option.children }}
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                            register={register} // Pass register down recursively
                            sectionKey={sectionKey} // Keep same section key
                          />
                        </div>
                      )}

                      {isSelected && option.scoreGroup && (
                        <div className="ml-6 mt-4 border rounded-lg p-4 bg-muted/30">
                          <h3 className="font-semibold mb-4">{option.scoreGroup.title}</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {option.scoreGroup.fields.map((subField: any) => {
                              const subFullName = sectionKey ? `${sectionKey}.${subField.name}` : subField.name;
                              const subError = errors?.[subField.name];

                              return (
                                <div key={subField.name}>
                                  <label className="text-sm font-medium mb-1 block">
                                    {subField.label}
                                    {subField.required && <span className="text-destructive ml-1">*</span>}
                                  </label>

                                  <input
                                    type={subField.type || "text"}
                                    // ✅ 4. Bind register here
                                    {...(register ? register(subFullName, { required: subField.required }) : {})}
                                    
                                    value={formData[subField.name] || ""}
                                    onChange={(e) => handleChange(subField.name, e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg ${
                                      subError ? "border-destructive" : "border-border"
                                    }`}
                                  />
                                  {subError && <p className="text-red-500 text-xs mt-1">{subError}</p>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ================= DEFAULT INPUT ================= */}
            {!["select", "date", "radio"].includes(field.type) && (
              <input
                type={field.type || "text"}
                // ✅ 4. Bind register here
                {...(register ? register(fullName, { required: isRequired }) : {})}
                
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={field.disabled}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  fieldError ? "border-destructive" : "border-border"
                }`}
              />
            )}

            {/* ERROR */}
            {fieldError && (
              <p className="text-red-500 text-xs mt-1">{fieldError}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}