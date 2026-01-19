# Image Integration Guide - Backend to Frontend

Yeh guide aapko batayega ki kaise backend se images ko slug ki madad se frontend mein integrate karein.

## Overview

Ab aap backend se images upload kar sakte hain aur frontend mein dynamically use kar sakte hain. Har image ko ek unique slug aur image type se identify kiya jata hai.

## Backend Setup

### 1. PageInformation Model

Model mein yeh naye fields add kiye gaye hain:
- `universityCapBg` - University cap background image
- `universityCapBgPublicId` - Cloudinary public ID
- `universitySliderBg` - University slider background image
- `universitySliderBgPublicId` - Cloudinary public ID
- `immigrationServicesBg` - Immigration services section background
- `immigrationServicesBgPublicId` - Cloudinary public ID

### 2. API Endpoints

#### Get Image by Slug and Type
```
GET /api/page-information/images/:slug/:imageType
```

**Parameters:**
- `slug`: Page slug (e.g., 'home', 'about')
- `imageType`: Image type - `heroImage`, `universityCapBg`, `universitySliderBg`, `immigrationServicesBg`, `roadmapImage`, `mobileRoadmapImage`

**Example:**
```bash
GET http://localhost:5000/api/page-information/images/home/universitySliderBg
```

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "cway-admin/image",
    "imageType": "universitySliderBg",
    "slug": "home"
  }
}
```

#### Get Full Page Information
```
GET /api/page-information/public/:slug
```

### 3. How to Upload Images via Admin Panel

1. Admin panel mein jao: `Admin Panel/frontend`
2. Page Information section mein jao
3. Ek page create/update karo (e.g., slug: 'home')
4. Image upload karo Cloudinary se
5. Image URL automatically save ho jayega

Ya phir directly API se:

```javascript
// Upload image first
POST /api/upload/image
// Get image URL from response

// Then update page information
PUT /api/page-information/:id
{
  "universitySliderBg": "https://res.cloudinary.com/.../image.jpg",
  "universitySliderBgPublicId": "cway-admin/image"
}
```

## Frontend Setup

### 1. Environment Variable

`.env.local` file mein add karo:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Production mein:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### 2. Using Images in Components

#### Method 1: Using Hook (Recommended)

```tsx
'use client'

import { usePageImage } from '@/lib/hooks/usePageImages'

export default function MyComponent() {
  // Single image fetch
  const heroImage = usePageImage('home', 'heroImage', '/images/hero.jpg')
  
  return (
    <div style={{ backgroundImage: `url(${heroImage})` }}>
      {/* Content */}
    </div>
  )
}
```

#### Method 2: Multiple Images

```tsx
'use client'

import { usePageImages } from '@/lib/hooks/usePageImages'

export default function MyComponent() {
  const { images } = usePageImages(
    'home',
    ['heroImage', 'universitySliderBg', 'immigrationServicesBg'],
    {
      heroImage: '/images/hero.jpg', // Fallback
      universitySliderBg: '/shapes/unibg.png',
      immigrationServicesBg: '/shapes/bg01.jpg'
    }
  )
  
  return (
    <>
      <div style={{ backgroundImage: `url(${images.heroImage})` }}>
        Hero Section
      </div>
      <div style={{ backgroundImage: `url(${images.universitySliderBg})` }}>
        University Slider
      </div>
    </>
  )
}
```

#### Method 3: Direct API Call

```tsx
'use client'

import { useEffect, useState } from 'react'
import { getImageBySlug } from '@/lib/api/pageInformation'

export default function MyComponent() {
  const [imageUrl, setImageUrl] = useState('/images/fallback.jpg')
  
  useEffect(() => {
    async function fetchImage() {
      const url = await getImageBySlug('home', 'heroImage')
      if (url) {
        setImageUrl(url)
      }
    }
    fetchImage()
  }, [])
  
  return <div style={{ backgroundImage: `url(${imageUrl})` }} />
}
```

## Image Types Available

1. **heroImage** - Homepage hero section background
2. **universityCapBg** - University cap/logo background
3. **universitySliderBg** - University slider card background
4. **immigrationServicesBg** - "Your Trusted Partner" section background
5. **roadmapImage** - Roadmap/timeline image
6. **mobileRoadmapImage** - Mobile version of roadmap

## Current Implementation

### Updated Components:

1. **Home Page** (`app/page.tsx`)
   - Hero section background: `heroImage`
   - Immigration services section: `immigrationServicesBg`

2. **University Slider** (`components/PageComponent/Unversity.tsx`)
   - Slider card background: `universitySliderBg`

## Example: Adding New Image Type

### Backend:

1. Model mein field add karo:
```javascript
// models/PageInformation.js
newSectionBg: {
  type: String,
  default: '',
},
newSectionBgPublicId: {
  type: String,
  default: '',
},
```

2. Controller mein add karo:
```javascript
// controllers/pageInformationController.js
// Already handled automatically in update function
```

3. Valid image types mein add karo:
```javascript
// controllers/pageInformationController.js
const validImageTypes = [
  'heroImage', 
  'universityCapBg', 
  'universitySliderBg', 
  'immigrationServicesBg', 
  'roadmapImage', 
  'mobileRoadmapImage',
  'newSectionBg' // Add here
]
```

### Frontend:

1. Type definition update:
```typescript
// lib/api/pageInformation.ts
export type ImageType = 
  | 'heroImage' 
  | 'universityCapBg' 
  | 'universitySliderBg' 
  | 'immigrationServicesBg' 
  | 'roadmapImage' 
  | 'mobileRoadmapImage'
  | 'newSectionBg' // Add here
```

2. Component mein use karo:
```tsx
const newBg = usePageImage('home', 'newSectionBg', '/fallback.jpg')
```

## Testing

1. Backend start karo:
```bash
cd "Admin Panel/backend"
npm start
```

2. Frontend start karo:
```bash
cd "Gway frontend"
npm run dev
```

3. Admin panel se image upload karo
4. Frontend mein check karo ki image load ho rahi hai

## Troubleshooting

### Image load nahi ho rahi:
1. Check karo ki `.env.local` mein `NEXT_PUBLIC_API_URL` sahi hai
2. Check karo ki backend running hai
3. Check karo ki slug aur imageType sahi hain
4. Browser console mein error check karo
5. Network tab mein API call check karo

### CORS Error:
Backend `server.js` mein CORS already enabled hai. Agar issue ho to:
```javascript
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000']
}))
```

## Notes

- Images automatically fallback to default local images agar API se fetch nahi ho paaye
- Images are cached by Next.js for performance
- Use `cache: 'no-store'` for always fresh data (already implemented)
- All image URLs should be absolute URLs (Cloudinary provides these)
