'use client';

import { useState } from 'react';

export function JsonEditor({ value, onChange }) {
  const [error, setError] = useState(null);
  const [localValue, setLocalValue] = useState(JSON.stringify(value, null, 2));

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    try {
      const parsed = JSON.parse(newValue);
      setError(null);
      onChange(parsed);
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold">JSON Editor</h3>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
      <textarea
        value={localValue}
        onChange={handleChange}
        className="flex-1 w-full p-4 font-mono text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        spellCheck={false}
      />
    </div>
  );
}

function renderField(field, index, formData, setFormData) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const commonClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";
  
  switch (field.type) {
    case 'text':
    case 'number':
    case 'date':
      return (
        <div key={index} className={`mb-4 ${field.col === 2 ? 'col-span-2' : ''}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={commonClasses}
            required={field.required}
          />
          {field.validation && (
            <p className="mt-1 text-xs text-gray-500">{field.validation.message}</p>
          )}
        </div>
      );

    case 'select':
      return (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={commonClasses}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                {typeof opt === 'string' ? opt : opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'radio':
      return (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-2">
            {field.options?.map((opt, optIndex) => (
              <div key={optIndex} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  id={`${field.name}-${opt.value}`}
                  value={opt.value}
                  checked={formData[field.name] === opt.value}
                  onChange={(e) => handleRadioChange(field.name, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={`${field.name}-${opt.value}`} className="ml-2 block text-sm text-gray-700">
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
          </label>
          <div className="space-y-2">
            {field.options?.map((opt, optIndex) => (
              <div key={optIndex} className="flex items-center">
                <input
                  type="checkbox"
                  name={field.name}
                  id={`${field.name}-${opt.value}`}
                  value={opt.value}
                  checked={formData[field.name]?.includes(opt.value)}
                  onChange={(e) => {
                    const values = formData[field.name] || [];
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        [field.name]: [...values, opt.value]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        [field.name]: values.filter(v => v !== opt.value)
                      }));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`${field.name}-${opt.value}`} className="ml-2 block text-sm text-gray-700">
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'textarea':
      return (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            rows={4}
            placeholder={field.placeholder}
            className={commonClasses}
          />
        </div>
      );

    case 'switch':
      return (
        <div key={index} className="mb-4 p-4 border rounded-lg">
          <div className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              id={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  [field.name]: e.target.checked
                }));
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={field.name} className="ml-2 block text-sm font-medium text-gray-700">
              {field.label}
            </label>
          </div>
          
          {formData[field.name] && field.children && (
            <div className="mt-4 pl-6 border-l-2 border-gray-200">
              {field.children.map((child, childIndex) => (
                <div key={childIndex}>
                  {child.type === 'scoreGroup' ? (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{child.label}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {child.fields.map((scoreField, sfIndex) => (
                          <div key={sfIndex}>
                            <label className="block text-xs text-gray-500 mb-1">
                              {scoreField.label}
                            </label>
                            <input
                              type={scoreField.type}
                              name={`${child.name}.${scoreField.name}`}
                              value={formData[`${child.name}.${scoreField.name}`] || ''}
                              onChange={handleChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : child.type === 'date' ? (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {child.label}
                      </label>
                      <input
                        type="date"
                        name={child.name}
                        value={formData[child.name] || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

function renderSection(section, sectionKey, formData, setFormData) {
  if (section.type === 'multi' && section.sections) {
    return (
      <div key={sectionKey} className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{section.title}</h2>
        <div className="space-y-6">
          {Object.entries(section.sections).map(([subKey, subSection]) => (
            <div key={subKey} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">{subSection.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                {subSection.fields?.map((field, index) => renderField(field, index, formData, setFormData))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div key={sectionKey} className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{section.title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {section.fields?.map((field, index) => renderField(field, index, formData, setFormData))}
      </div>
    </div>
  );
}

export function FormPreview({ schema }) {
  const [formData, setFormData] = useState({});

  return (
    <div className="h-full overflow-y-auto p-4">
      <h3 className="text-lg font-semibold mb-4">Form Preview</h3>
      <form className="space-y-6">
        {Object.entries(schema).map(([key, section]) => renderSection(section, key, formData, setFormData))}
      </form>
    </div>
  );
}