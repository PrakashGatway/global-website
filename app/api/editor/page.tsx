'use client';

import { useState, useEffect } from 'react';
import {FormPreview, JsonEditor} from '@/components/JsonEditor';

export default function Home() {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchSchema();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await fetch('/api/schema');
      const data = await response.json();
      setSchema(data);
    } catch (error) {
      console.error('Failed to load schema:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    
    try {
      const response = await fetch('/api/schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schema),
      });
      
      if (response.ok) {
        setSaveMessage('Schema saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save schema');
      }
    } catch (error) {
      setSaveMessage('Error saving schema');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left side - Editor */}
      <div className="w-1/2 h-full border-r border-gray-200 p-4 flex flex-col">
        <JsonEditor value={schema} onChange={setSchema} />
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      {/* Right side - Preview */}
      <div className="w-1/2 h-full bg-gray-50 overflow-hidden">
        <FormPreview schema={schema} />
      </div>
    </div>
  );
}