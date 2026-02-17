export default function FormRenderer({
  schema,
  formData,
  setFormData,
  errors
}: any) {

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {schema.fields.map((field: any) => {
        const fieldError = errors?.[field.name];
        const isRequired = field.required;

        return (
          <div
            key={field.name}
            className={field.col === 2 || field.type === "radio"
              ? "col-span-2"
              : ""}
          >
            {/* LABEL */}
            <label className="text-sm font-medium mb-1 block">
              {field.label}
              {isRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>

            {/* ================= SELECT ================= */}
            {field.type === "select" && (
              <select
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
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

            {/* ================= DATE ================= */}
            {field.type === "date" && (
              <input
                type="date"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={field.disabled}
                className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  fieldError ? "border-destructive" : "border-border"
                }`}
              />
            )}

            {/* ================= RADIO (⭐ NEW) ================= */}
            {field.type === "radio" && (
              <div className="flex gap-6 mt-2">
                {field.options?.map((option: string) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option}
                      checked={formData[field.name] === option}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                      className="w-4 h-4 accent-primary"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* ================= DEFAULT INPUT ================= */}
            {!["select", "date", "radio"].includes(field.type) && (
              <input
                type={field.type || "text"}
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
