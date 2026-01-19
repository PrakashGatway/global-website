'use client'

import { useState } from 'react'
import { usePage } from '@/lib/hooks/usePage'
import { usePageImages } from '@/lib/hooks/usePageImages'

export default function TestAPIPage() {
  const [testSlug, setTestSlug] = useState('home')
  
  // Universal hook - kisi bhi slug ke liye kaam karega
  const { pageData, isLoading, error } = usePage(testSlug)
  const { images, isLoading: imagesLoading } = usePageImages(
    testSlug, 
    ['heroImage', 'universitySliderBg', 'immigrationServicesBg'],
    {
      heroImage: '/images/hero.jpg',
      universitySliderBg: '/images/slider-bg.jpg',
      immigrationServicesBg: '/images/immigration-bg.jpg'
    }
  )

  const pages = [
    { value: 'home', label: 'Home' },
    { value: 'about', label: 'About' },
    { value: 'contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🧪 Universal API Test</h1>
        <p className="text-gray-600 mb-6">
          Test karo ki ek hi API sabhi pages ke liye kaam kar rahi hai
        </p>
        
        {/* Slug Selector */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <label className="block text-sm font-medium mb-2">
            Test Page Slug (Bas slug change karo - same API!):
          </label>
          <select 
            value={testSlug} 
            onChange={(e) => setTestSlug(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {pages.map((page) => (
              <option key={page.value} value={page.value}>
                {page.label} (slug: {page.value})
              </option>
            ))}
          </select>
          
          <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
            <p className="font-semibold">📍 API URL Being Used:</p>
            <code className="text-blue-700">
              /api/page-information/public/{testSlug}
            </code>
            <p className="mt-2 text-gray-600">
              ✅ Notice: Same API endpoint, bas slug change ho raha hai!
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">API Response:</h2>
          
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 font-semibold">❌ Error:</p>
              <p className="text-red-600">{error.message}</p>
            </div>
          )}
          
          {pageData && !isLoading && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Slug:</p>
                  <p className="font-semibold">{pageData.slug}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status:</p>
                  <p className="font-semibold">
                    <span className={`px-2 py-1 rounded text-xs ${
                      pageData.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pageData.status}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Title:</p>
                  <p className="font-semibold text-lg">{pageData.title}</p>
                </div>
                {pageData.subTitle && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Subtitle:</p>
                    <p className="text-gray-700">{pageData.subTitle}</p>
                  </div>
                )}
              </div>

              {/* Images */}
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold mb-2">Images:</h3>
                {imagesLoading ? (
                  <p className="text-sm text-gray-500">Loading images...</p>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Hero Image:</p>
                      <p className="text-sm font-mono break-all">
                        {images.heroImage || '❌ Not found (using fallback)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">University Slider BG:</p>
                      <p className="text-sm font-mono break-all">
                        {images.universitySliderBg || '❌ Not found (using fallback)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Immigration Services BG:</p>
                      <p className="text-sm font-mono break-all">
                        {images.immigrationServicesBg || '❌ Not found (using fallback)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Data */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-800">
                  📋 Full API Response (Click to expand)
                </summary>
                <pre className="mt-2 p-4 bg-gray-50 rounded overflow-auto text-xs max-h-96">
                  {JSON.stringify(pageData, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {!pageData && !isLoading && !error && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                ⚠️ No data found. Make sure:
              </p>
              <ul className="mt-2 text-yellow-700 text-sm list-disc list-inside">
                <li>Page exists in database with slug: <strong>{testSlug}</strong></li>
                <li>Page status is <strong>Published</strong></li>
                <li>Backend is running on port 5000</li>
              </ul>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ How to Verify:</h3>
          <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
            <li>Dropdown se different slugs select karo (home, about, contact)</li>
            <li>Notice karo ki API URL mein bas slug change ho raha hai</li>
            <li>Response format same hai, bas data different hai</li>
            <li>Network tab mein check karo - sabhi calls same endpoint use kar rahe hain</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
