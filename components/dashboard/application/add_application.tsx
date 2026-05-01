"use client";

import { serverInstance } from "@/app/axiosInstance";
import Select from "react-select";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";

const STEPS = [
  {
    name: "Basic Information",
    icon: "1",
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Enter Email", type: "text", required: true },
      { name: "phone", label: "Phone Number", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "nationality", label: "Nationality", type: "select", options: [] },
      { name: "gender", label: "Gender", type: "select", options: ["male", "female", "other"] },
      { name: "firstLanguage", label: "First Language", type: "text" },
      { name: "maritalStatus", label: "Marital Status", type: "select", options: ["Single", "Married", "Divorced", "Widowed"] },
      { name: "passportNumber", label: "Passport Number", type: "text" },
      { name: "passportExpiry", label: "Passport Expiry", type: "date" },
    ],
  },
  {
    name: "Address",
    icon: "2",
    fields: [
      { name: "address1", label: "Address Line 1", type: "text", required: true },
      { name: "address2", label: "Address Line 2", type: "text" },
      { name: "city", label: "City", type: "text", required: true },
      { name: "state", label: "State", type: "text", required: true },
      { name: "country", label: "Country", type: "select", required: true, options: [] },
      { name: "postalcode", label: "Postal Code", type: "text", required: true },
    ],
  },
  {
    name: "Application Details",
    icon: "3",
    fields: [
      { name: "destinationCountry", label: "Destination Country", type: "select", options: [], required: true },
      { name: "university", label: "University Name", type: "select", options: [] },
      { name: "destinationcourse", label: "Course Name", type: "select", options: [] },
      { name: "intake", label: "Intake", type: "select", options: [] },
    ],
    repeater: {
      name: "backups",
      label: "Backup Courses",
      fields: [
        { name: "course", label: "Course Name", type: "select", options: [], required: true },
        { name: "intake", label: "Intake", type: "select", options: [], required: true },
        { name: "order", label: "Order", type: "text", required: true }
      ]
    }
  }
];

const MultiSelectInput = ({ field, fieldKey, selected, onAdd, onRemove }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <div
        className="flex flex-wrap gap-1.5 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer min-h-[40px] items-center"
        onClick={() => setOpen((o) => !o)}
      >
        {selected.length === 0 ? (
          <span className="text-xs text-slate-400">Click to select...</span>
        ) : (
          selected.map((tag: string) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {tag}
              <span
                className="cursor-pointer text-sm leading-none text-blue-500 hover:text-blue-700"
                onClick={(e) => { e.stopPropagation(); onRemove(fieldKey, tag); }}
              >
                ×
              </span>
            </span>
          ))
        )}
      </div>
      {open && (
        <div className="border border-slate-200 rounded-lg bg-white max-h-40 overflow-y-auto mt-1 shadow-md z-10">
          {field.options.map((opt: string) => (
            <div
              key={opt}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${selected.includes(opt)
                ? "bg-blue-50 text-blue-600"
                : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              onClick={() => { onAdd(fieldKey, opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const inputBase = "w-full font-[inherit] text-[13px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const inputError = "!border-red-500";

const FieldRenderer = ({
  field,
  fieldKey,
  value,
  multiSelected,
  onChange,
  onMultiAdd,
  onMultiRemove,
  hasError,
}: any) => {
  const req = field.required ? <span className="text-red-500"> *</span> : null;

  if (field.type === "select") {
    const selectOptions = (field.options || []).map((o: any) =>
      typeof o === "object" && o !== null && "label" in o
        ? o
        : { label: String(o), value: String(o) }
    );

    const selectedOption = selectOptions.find(
      (opt: any) => String(opt.value) === String(value)
    ) || null;

    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500" htmlFor={fieldKey}>
          {field.label}{req}
        </label>
        <Select
          options={selectOptions}
          value={selectedOption}
          onChange={(option: any) => onChange(fieldKey, option?.value ?? "")}
          placeholder="Select..."
          isSearchable
          isClearable
          noOptionsMessage={() => "No options available"}
          classNamePrefix="react-select"
        />
        {hasError && <span className="text-[11px] text-red-500">This field is required</span>}
      </div>
    );
  }

  if (field.type === "multiselect") {
    return (
      <MultiSelectInput
        field={field}
        fieldKey={fieldKey}
        selected={multiSelected}
        onAdd={onMultiAdd}
        onRemove={onMultiRemove}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500" htmlFor={fieldKey}>
          {field.label}{req}
        </label>
        <textarea
          id={fieldKey}
          className={`${inputBase} ${hasError ? inputError : ""} resize-y min-h-[80px]`}
          value={value}
          placeholder={field.placeholder ?? ""}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          rows={3}
        />
        {hasError && <span className="text-[11px] text-red-500">This field is required</span>}
      </div>
    );
  }

  if (field.type === "file") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500" htmlFor={fieldKey}>
          {field.label}{req}
        </label>
        <input
          id={fieldKey}
          type="file"
          className={`${inputBase} ${hasError ? inputError : ""}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(fieldKey, file);
          }}
        />
        {value && value instanceof File && (
          <span className="text-[11px] text-green-600">Selected: {value.name}</span>
        )}
        {hasError && <span className="text-[11px] text-red-500">This field is required</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500" htmlFor={fieldKey}>
        {field.label}{req}
      </label>
      <input
        id={fieldKey}
        type={field.type}
        className={`${inputBase} ${hasError ? inputError : ""}`}
        value={value}
        placeholder={field.placeholder ?? ""}
        onChange={(e) => onChange(fieldKey, e.target.value)}
      />
      {hasError && <span className="text-[11px] text-red-500">This field is required</span>}
    </div>
  );
};

const ProfileForm = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [multiState, setMultiState] = useState<Record<string, string[]>>({});
  const [repeaterItems, setRepeaterItems] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  // Dynamic Options
  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [universityOptions, setUniversityOptions] = useState<any[]>([]);
  const [intakeOptions, setIntakeOptions] = useState<any[]>([]);
  const [courseOptions, setCourseOptions] = useState<any[]>([]);
  const [userid, setUserid] = useState<string>("");

  const total = STEPS.length;
  const step = STEPS[current];

  // Handlers
  const handleChange = useCallback((key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: false }));
  }, []);

  const handleMultiAdd = useCallback((key: string, val: string) => {
    setMultiState((prev) => {
      const cur = prev[key] ?? [];
      if (cur.includes(val)) return prev;
      return { ...prev, [key]: [...cur, val] };
    });
    setErrors((prev) => ({ ...prev, [key]: false }));
  }, []);

  const handleMultiRemove = useCallback((key: string, val: string) => {
    setMultiState((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((v) => v !== val),
    }));
  }, []);

  const handleRepChange = useCallback((idx: number, key: string, val: any) => {
    setRepeaterItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });
  }, []);

  const addRepItem = useCallback(() => setRepeaterItems((prev) => [...prev, {}]), []);
  const removeRepItem = useCallback((idx: number) =>
    setRepeaterItems((prev) => prev.filter((_, i) => i !== idx)), []);

  // Validation
  const validate = useCallback(() => {
    const newErrors: Record<string, boolean> = {};
    const checkFields = (fields: any[], prefix = "") => {
      fields.forEach((f) => {
        if (!f.required) return;
        const key = prefix + f.name;
        if (f.type === "multiselect") {
          if (!(multiState[key] ?? []).length) newErrors[key] = true;
        } else {
          if (!(formData[key] ?? "").toString().trim()) newErrors[key] = true;
        }
      });
    };

    if (step.fields) checkFields(step.fields);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, multiState, step.fields]);

  const navigate = useCallback((dir: number) => {
    if (dir === 1 && !validate()) return;
    setCurrent((c) => Math.max(0, Math.min(total - 1, c + dir)));
    setRepeaterItems([]);
    setErrors({});
  }, [validate]);

  const jumpBack = useCallback((idx: number) => {
    if (idx < current) {
      setCurrent(idx);
      setRepeaterItems([]);
      setErrors({});
    }
  }, [current]);

  const submitForms = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token not found. Please login again.");
      return;
    }

    try {
      const payload = {
        ...formData,
        backups: repeaterItems
      };

      const response = await serverInstance.post(`/applications/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitted(true);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert(
        "Error: " +
        (error?.response?.data?.message || "Something went wrong")
      );
    }
  }, [formData, repeaterItems]);

  const renderRepeater = useCallback((rep: any) => (
    <div className="mt-4">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
        {rep.label}
      </p>
      {repeaterItems.map((item, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-700">
              {rep.label.replace(/s$/, "")} {idx + 1}
            </span>
            <button
              type="button"
              className="text-[11px] text-red-500 border border-red-300 bg-transparent px-3 py-1 rounded-full cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => removeRepItem(idx)}
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rep.fields.map((f: any) => {
              let dynamicField = { ...f };
              if (f.name === "course") dynamicField.options = courseOptions;
              if (f.name === "intake") dynamicField.options = intakeOptions;

              return (
                <FieldRenderer
                  key={f.name}
                  field={dynamicField}
                  fieldKey={f.name}
                  value={item[f.name] ?? ""}
                  multiSelected={[]}
                  onChange={(_, val) => handleRepChange(idx, f.name, val)}
                  onMultiAdd={() => { }}
                  onMultiRemove={() => { }}
                  hasError={false}
                />
              );
            })}
          </div>
        </div>
      ))}
      <button
        type="button"
        className="text-xs font-medium text-blue-600 border border-blue-300 bg-blue-50 px-4 py-2 rounded-full cursor-pointer hover:opacity-75 transition-opacity mt-1"
        onClick={addRepItem}
      >
        + Add {rep.label.replace(/s$/, "")}
      </button>
    </div>
  ), [repeaterItems, courseOptions, intakeOptions, handleRepChange, addRepItem, removeRepItem]);

  const renderFields = useCallback((fields: any[], prefix = "") => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map((f) => {
        let dynamicField = { ...f };

        if (f.name === "destinationCountry") {
          dynamicField.options = countryOptions;
        } else if (f.name === "nationality") {
          dynamicField.options = countryOptions;
        } else if (f.name === "country" && f.label === "Country") {
          dynamicField.options = countryOptions;
        } else if (f.name === "university" && f.label === "University Name") {
          dynamicField.options = universityOptions;
        } else if (f.name === "destinationcourse" && f.label === "Course Name") {
          dynamicField.options = courseOptions;
        } else if (f.name === "course" && f.label === "Course Name") {
          dynamicField.options = courseOptions;
        } else if (f.name === "intake" && f.label === "Intake") {
          dynamicField.options = intakeOptions;
        }

        const key = prefix + f.name;

        return (
          <FieldRenderer
            key={key}
            field={dynamicField}
            fieldKey={key}
            value={formData[key] ?? ""}
            multiSelected={multiState[key] ?? []}
            onChange={handleChange}
            onMultiAdd={handleMultiAdd}
            onMultiRemove={handleMultiRemove}
            hasError={!!errors[key]}
          />
        );
      })}
    </div>
  ), [countryOptions, universityOptions, courseOptions, intakeOptions, formData, multiState, errors, handleChange, handleMultiAdd, handleMultiRemove]);

  // Fetch Countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await serverInstance.get(`/countries?limit=300`);
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];

        const mapped = data.map((c: any) => ({
          label: c.name,
          value: c.code || c.name,
        }));
        setCountryOptions(mapped);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch Universities when country changes
  useEffect(() => {
    const fetchUniversities = async () => {
      if (!formData.destinationCountry) {
        setUniversityOptions([]);
        setIntakeOptions([]);
        return;
      }

      try {
        const response = await serverInstance.get(`/universities?country=${formData.destinationCountry}`);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || response.data?.result || [];

        const mappedUniversities = data.map((u: any) => ({
          label: u.name,
          value: u.code || u.name || u.id,
        }));

        const allIntakes = [...new Set(
          data.flatMap((u: any) => (Array.isArray(u.intakes) ? u.intakes : []))
        )].map((i: string) => ({ label: i, value: i }));

        setUniversityOptions(mappedUniversities);
        setIntakeOptions(allIntakes);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setUniversityOptions([]);
        setIntakeOptions([]);
      }
    };

    fetchUniversities();
  }, [formData.destinationCountry]);

  // Fetch Courses when university changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!formData.university) {
        setCourseOptions([]);
        return;
      }

      try {
        const response = await serverInstance.get(`/courses?code=${formData.university}`);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || response.data?.result || [];

        const mappedCourses = data.map((c: any) => ({
          label: c.name,
          value: c._id,
        }));
        console.log("courses", mappedCourses, `/courses?code=${formData.university}`);
        setCourseOptions(mappedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourseOptions([]);
      }
    };

    fetchCourses();
  }, [formData.university]);

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (!formData.destinationCountry) {
      handleChange("university", "");
      handleChange("destinationcourse", "");
      handleChange("intake", "");
    }
  }, [formData.destinationCountry, handleChange]);

  useEffect(() => {
    if (!formData.university) {
      handleChange("destinationcourse", "");
    }
  }, [formData.university, handleChange]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md w-full shadow-sm">
          <div className="text-5xl text-green-500 mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Application Submitted!</h2>
          <p className="text-sm text-slate-500">Your application has been saved successfully.</p>
          <div className="flex items-center justify-center my-2">
            <button className="px-4 py-2 bg-orange-500 text-white rounded" onClick={() => { setSubmitted(false); window.location.reload(); }}>OK</button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((current + 1) / total) * 100;
  const isLast = current === total - 1;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800">
      {/* Progress Bar */}
      <div className="h-1 bg-slate-200 rounded-full mb-6 overflow-hidden w-auto mx-auto">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stepper */}
      <div className="flex items-start overflow-x-auto pb-1 gap-0 mb-6 w-auto mx-auto">
        {STEPS.map((s, i) => {
          const isDone = i < current;
          const isActive = i === current;
          return (
            <div
              key={i}
              className={`flex flex-col items-center flex-1 min-w-[72px] relative ${isDone ? "cursor-pointer" : "cursor-default"}`}
              onClick={() => jumpBack(i)}
            >
              {i < STEPS.length - 1 && (
                <div
                  className={`absolute top-4 left-[60%] w-4/5 h-px z-0 ${isDone ? "bg-green-500" : "bg-slate-200"}`}
                />
              )}

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold border relative z-10 transition-all duration-200 ${isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : isDone
                    ? "bg-green-50 text-green-600 border-green-500"
                    : "bg-white text-slate-400 border-slate-200"
                  }`}
              >
                {isDone ? "✓" : s.icon}
              </div>

              <span
                className={`text-[10px] mt-1.5 text-center max-w-[68px] leading-tight ${isActive ?
                  "text-blue-600 font-semibold" : isDone ? "text-green-600" : "text-slate-400"
                  }`}
              >
                {s.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-4 w-auto mx-auto shadow-sm animate-[fadeUp_0.25s_ease_both]">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">{step.name}</h2>
        <p className="text-xs text-slate-400 mb-5">Fill in the details below — required fields are marked *</p>

        {step.fields && renderFields(step.fields)}
        {step.repeater && renderRepeater(step.repeater)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center w-auto mx-auto">
        <button
          type="button"
          className="text-sm font-medium px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 bg-transparent cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-default"
          onClick={() => navigate(-1)}
          disabled={current === 0}
        >
          Back
        </button>

        <span className="text-xs text-slate-400">Step {current + 1} of {total}</span>

        <button
          type="button"
          className={`text-sm font-medium px-6 py-2.5 rounded-xl text-white border-none cursor-pointer hover:opacity-80 transition-opacity ${isLast ? "bg-green-600" : "bg-blue-600"}`}
          onClick={submitForms}
        >
          {isLast ? "Submit" : "Next"}
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProfileForm;