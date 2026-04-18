import { useEffect, useState } from "react";

const DynamicFormFields = ({ fieldsData, onChange }) => {
    const [fields, setFields] = useState([]);
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    // ✅ Parse JSON safely
useEffect(() => {
  try {
    const parsed =
      typeof fieldsData === "string"
        ? JSON.parse(fieldsData)
        : fieldsData || [];

    setFields(parsed);

    // 🔥 initialize all values as empty
    const initialValues = {};
    parsed.forEach((f) => {
      initialValues[f.label] = "";
    });

    setValues(initialValues);

    if (onChange) {
      onChange(initialValues, validateAll);
    }

  } catch (err) {
    console.error("Invalid JSON", err);
    setFields([]);
  }
}, [fieldsData]);

    // ✅ Handle change
  const handleChange = (label, value) => {
  setValues((prev) => {
    const updated = { ...prev, [label]: value };

    if (onChange) {
      onChange(updated, validateAll); // 🔥 ALWAYS send validator
    }

    return updated;
  });
};

    // ✅ Validation logic
    const validateField = (field, value) => {
        if (field.required && (!value || value.trim() === "")) {
            return `${field.label} is required`;
        }

        if (!value) return "";

        if (field.validation) {
            const rules = field.validation.split(",");

            for (let rule of rules) {
                const [key, val] = rule.split(":");

                if (key === "min" && value.length < Number(val)) {
                    return `${field.label} min ${val} chars`;
                }

                if (key === "max" && value.length > Number(val)) {
                    return `${field.label} max ${val} chars`;
                }

                if (key === "email") {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        return "Invalid email";
                    }
                }

                if (key === "phone") {
                    const phoneRegex = /^[0-9]{10}$/;
                    if (!phoneRegex.test(value)) {
                        return "Invalid phone";
                    }
                }
            }
        }

        return "";
    };

    // ✅ Validate all
    const validateAll = () => {
        let newErrors = {};

        fields.forEach((field) => {
            const value = values[field.label] ?? "";
            const error = validateField(field, value);

            if (error) newErrors[field.label] = error;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // expose validation if needed
    useEffect(() => {
        if (onChange) {
            onChange(values, validateAll);
        }
    }, []);

    // ✅ Render input based on type
    const renderInput = (field) => {
        const commonProps = {
            value: values[field.label] || "",
            onChange: (e) => handleChange(field.label, e.target.value),
            className:
                "w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary",
            placeholder: `Enter ${field.label}`,
        };

        switch (field.type) {
            case "textarea":
                return <textarea {...commonProps} rows={4} />;

            case "number":
                return <input type="number" {...commonProps} />;

            case "email":
                return <input type="email" {...commonProps} />;

            case "date":
                return <input type="date" {...commonProps} />;

            case "password":
                return <input type="password" {...commonProps} />;

            default:
                return <input type="text" {...commonProps} />;
        }
    };

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <div key={index}>
                    <label className="block text-sm font-medium mb-1">
                        {field.label}
                        {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>

                    {renderInput(field)}

                    {errors[field.label] && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors[field.label]}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DynamicFormFields;