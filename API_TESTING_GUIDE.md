# API Testing Guide - Ek API Se Sab Pages Test Karo

Yeh guide aapko batayega ki kaise test karein ki ek hi API sabhi pages (home, about, contact) ke liye kaam kar rahi hai.

## 🧪 Testing Methods

### Method 1: Browser Console Test (Sabse Aasan)

#### Step 1: Browser Console Kholo
1. Frontend app kholo: `http://localhost:3001`
2. **F12** ya **Right Click → Inspect** karo
3. **Console** tab select karo

#### Step 2: API Test Functions Copy Karo

Console mein yeh code paste karo:

```javascript
// API Base URL
const API_BASE_URL = 'http://localhost:5000/api'

// Test function - Kisi bhi page ka data fetch karega
async function testPageAPI(slug) {
  console.log(`\n🧪 Testing API for page: ${slug}`)
  console.log(`📍 URL: ${API_BASE_URL}/page-information/public/${slug}`)
  
  try {
    const response = await fetch(`${API_BASE_URL}/page-information/public/${slug}`)
    const data = await response.json()
    
    if (data.success) {
      console.log(`✅ SUCCESS! Page data received:`)
      console.log(`   Title: ${data.data.title}`)
      console.log(`   Slug: ${data.data.slug}`)
      console.log(`   Status: ${data.data.status}`)
      console.log(`   Full Data:`, data.data)
    } else {
      console.log(`❌ FAILED:`, data.message)
    }
  } catch (error) {
    console.log(`❌ ERROR:`, error.message)
  }
}

// Test function - Image fetch karega
async function testImageAPI(slug, imageType) {
  console.log(`\n🖼️ Testing Image API for: ${slug}/${imageType}`)
  console.log(`📍 URL: ${API_BASE_URL}/page-information/images/${slug}/${imageType}`)
  
  try {
    const response = await fetch(`${API_BASE_URL}/page-information/images/${slug}/${imageType}`)
    const data = await response.json()
    
    if (data.success && data.data?.imageUrl) {
      console.log(`✅ SUCCESS! Image URL:`, data.data.imageUrl)
    } else {
      console.log(`⚠️ Image not found (using fallback)`)
    }
  } catch (error) {
    console.log(`❌ ERROR:`, error.message)
  }
}
```

#### Step 3: Test Karo Different Pages

Console mein yeh commands run karo:

```javascript
// Home page test
testPageAPI('home')

// About page test
testPageAPI('about')

// Contact page test
testPageAPI('contact')

// Image tests
testImageAPI('home', 'heroImage')
testImageAPI('about', 'heroImage')
testImageAPI('home', 'universitySliderBg')
```

**Expected Output:**
```
🧪 Testing API for page: home
📍 URL: http://localhost:5000/api/page-information/public/home
✅ SUCCESS! Page data received:
   Title: Home Page
   Slug: home
   Status: Published
```

---

### Method 2: Network Tab Check (Visual Verification)

#### Step 1: Network Tab Kholo
1. Browser DevTools mein **Network** tab select karo
2. **Filter** mein type karo: `page-information`
3. Page refresh karo ya navigate karo

#### Step 2: Check API Calls

Aapko yeh API calls dikhni chahiye:

```
GET /api/page-information/public/home
GET /api/page-information/public/about
GET /api/page-information/images/home/heroImage
GET /api/page-information/images/about/heroImage
```

**Important Points:**
- ✅ Sabhi calls same base URL use kar rahe hain: `/api/page-information/`
- ✅ Bas slug change ho raha hai: `home`, `about`, `contact`
- ✅ Ek hi API pattern: `/public/{slug}` aur `/images/{slug}/{imageType}`

#### Step 3: Response Check Karo

Har API call par click karo aur **Response** tab check karo:

**Home Page Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "slug": "home",
    "title": "Home Page",
    ...
  }
}
```

**About Page Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "slug": "about",
    "title": "About Us",
    ...
  }
}
```

**Notice:** Same structure, bas data different!

---

### Method 3: Component Test (React Hook Test)

#### Test Component Banao

```tsx
// app/test-api/page.tsx
'use client'

import { useState } from 'react'
import { usePage } from '@/lib/hooks/usePage'
import { usePageImages } from '@/lib/hooks/usePageImages'

export default function TestAPIPage() {
  const [testSlug, setTestSlug] = useState('home')
  
  // Universal hook - kisi bhi slug ke liye kaam karega
  const { pageData, isLoading, error } = usePage(testSlug)
  const { images } = usePageImages(testSlug, ['heroImage'], {
    heroImage: '/fallback.jpg'
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      {/* Slug selector */}
      <div className="mb-4">
        <label className="mr-2">Test Page Slug:</label>
        <select 
          value={testSlug} 
          onChange={(e) => setTestSlug(e.target.value)}
          className="border p-2"
        >
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="contact">Contact</option>
        </select>
      </div>

      {/* Results */}
      <div className="border p-4 rounded">
        <h2 className="font-bold mb-2">API Response:</h2>
        
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        
        {pageData && (
          <div>
            <p><strong>Slug:</strong> {pageData.slug}</p>
            <p><strong>Title:</strong> {pageData.title}</p>
            <p><strong>Status:</strong> {pageData.status}</p>
            <p><strong>Hero Image:</strong> {images.heroImage || 'Not found'}</p>
            
            <details className="mt-4">
              <summary className="cursor-pointer">Full Data (Click to expand)</summary>
              <pre className="mt-2 p-2 bg-gray-100 overflow-auto">
                {JSON.stringify(pageData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* API URL Display */}
      <div className="mt-4 p-4 bg-blue-50 rounded">
        <p><strong>API URL Used:</strong></p>
        <code className="text-sm">
          /api/page-information/public/{testSlug}
        </code>
        <p className="mt-2 text-sm text-gray-600">
          ✅ Notice: Same API, different slug!
        </p>
      </div>
    </div>
  )
}
```

**Test Karo:**
1. Browser mein jao: `http://localhost:3001/test-api`
2. Dropdown se different slugs select karo
3. Notice karo ki same API call ho rahi hai, bas slug change ho raha hai

---

### Method 4: Postman/Thunder Client Test

#### Test Requests

**1. Home Page:**
```
GET http://localhost:5000/api/page-information/public/home
```

**2. About Page:**
```
GET http://localhost:5000/api/page-information/public/about
```

**3. Contact Page:**
```
GET http://localhost:5000/api/page-information/public/contact
```

**4. Home Page Image:**
```
GET http://localhost:5000/api/page-information/images/home/heroImage
```

**5. About Page Image:**
```
GET http://localhost:5000/api/page-information/images/about/heroImage
```

**Expected Response (All Pages):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "slug": "home",  // or "about", "contact", etc.
    "title": "...",
    "pageType": "home_page",
    ...
  }
}
```

**Notice:** 
- ✅ Same endpoint structure
- ✅ Same response format
- ✅ Bas slug different hai

---

### Method 5: Quick Test Script

Terminal mein yeh script run karo:

```bash
# Test script - sabhi pages ko ek saath test karega

echo "🧪 Testing Universal API..."

# Home page
echo "\n1. Testing Home Page:"
curl http://localhost:5000/api/page-information/public/home | jq '.data.slug, .data.title'

# About page
echo "\n2. Testing About Page:"
curl http://localhost:5000/api/page-information/public/about | jq '.data.slug, .data.title'

# Contact page
echo "\n3. Testing Contact Page:"
curl http://localhost:5000/api/page-information/public/contact | jq '.data.slug, .data.title'

echo "\n✅ All tests completed!"
echo "Notice: Same API endpoint, different slugs!"
```

---

## ✅ Verification Checklist

Test karte waqt yeh points check karo:

- [ ] **Same Base URL:** Sabhi calls `/api/page-information/` use kar rahe hain
- [ ] **Same Pattern:** `/public/{slug}` aur `/images/{slug}/{imageType}`
- [ ] **Different Slugs:** `home`, `about`, `contact` - bas slug change ho raha hai
- [ ] **Same Response Format:** Sabhi pages ka response same structure hai
- [ ] **No Separate APIs:** Koi alag endpoint nahi hai har page ke liye

---

## 🐛 Common Issues

### Issue 1: 404 Error
**Problem:** `Page not found`

**Solution:**
1. Admin Panel mein jao
2. Page create karo with correct slug
3. Status `Published` set karo

### Issue 2: CORS Error
**Problem:** `CORS policy blocked`

**Solution:**
- Backend `server.js` mein CORS enable hai ya nahi check karo
- Frontend URL backend CORS mein allowed hai ya nahi

### Issue 3: Network Error
**Problem:** `Failed to fetch`

**Solution:**
- Backend running hai ya nahi check karo: `http://localhost:5000/api/health`
- `.env.local` mein `NEXT_PUBLIC_API_URL` set hai ya nahi

---

## 📊 Expected Results

Agar sab kuch theek hai, to aapko dikhna chahiye:

1. ✅ **Same API Pattern:** 
   - `/api/page-information/public/{slug}`
   - `/api/page-information/images/{slug}/{imageType}`

2. ✅ **Different Slugs Work:**
   - `home` ✅
   - `about` ✅
   - `contact` ✅
   - Koi bhi future slug ✅

3. ✅ **Same Response Structure:**
   - Sabhi pages ka response same format mein hai
   - Bas data different hai

4. ✅ **No Code Changes Needed:**
   - Naye page add karne ke liye bas slug change karo
   - Koi naya API function nahi banana padega

---

## 🎯 Summary

**Test Karne Ka Best Way:**

1. **Browser Console** - Quick test ke liye
2. **Network Tab** - Visual verification ke liye
3. **Component Test** - Real usage test ke liye

**Key Point:** 
Ek hi API (`/api/page-information/public/{slug}`) sabhi pages ke liye kaam kar rahi hai. Bas slug change karo!

---

**Happy Testing! 🚀**
