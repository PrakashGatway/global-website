# Universal Page API - Ek API Se Sab Pages Handle Karo

Yeh guide aapko batayega ki kaise ek hi API se sabhi pages (home, about, contact, aur future pages) ko handle karein.

## 🎯 Concept

**Ek API, Sab Pages Ke Liye!**

- ❌ **Nahi:** Har page ke liye alag API function
- ✅ **Haan:** Ek universal API jo slug se kaam karta hai

## 📁 File Structure

```
lib/
├── api/
│   └── pageInformation.ts    # Universal API functions
├── hooks/
│   ├── usePage.ts            # Generic page data hook
│   └── usePageImages.ts      # Generic images hook
└── schemas/
    └── pageInformation.ts    # Zod schemas
```

## 🚀 Usage Examples

### Example 1: Home Page

```tsx
// app/page.tsx (Home Page)
'use client'

import { usePage } from '@/lib/hooks/usePage'
import { usePageImages } from '@/lib/hooks/usePageImages'

export default function HomePage() {
  // Complete page data
  const { pageData, isLoading } = usePage('home')
  
  // Or just images
  const { images } = usePageImages('home', ['heroImage', 'universitySliderBg'], {
    heroImage: '/images/hero.jpg',
    universitySliderBg: '/images/slider-bg.jpg'
  })

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{pageData?.title}</h1>
      <img src={images.heroImage} alt="Hero" />
    </div>
  )
}
```

### Example 2: About Page

```tsx
// app/about/page.tsx
'use client'

import { usePage } from '@/lib/hooks/usePage'
import { usePageImages } from '@/lib/hooks/usePageImages'

export default function AboutPage() {
  // Same API, different slug!
  const { pageData, isLoading } = usePage('about')
  const { images } = usePageImages('about', ['heroImage'], {
    heroImage: '/images/about-hero.jpg'
  })

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{pageData?.title}</h1>
      <p>{pageData?.subTitle}</p>
      <img src={images.heroImage} alt="About Hero" />
    </div>
  )
}
```

### Example 3: Contact Page

```tsx
// app/contact/page.tsx
'use client'

import { usePage } from '@/lib/hooks/usePage'

export default function ContactPage() {
  // Same hook, just change the slug!
  const { pageData, isLoading } = usePage('contact')

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{pageData?.title}</h1>
      <p>{pageData?.subTitle}</p>
      {/* Contact form, etc. */}
    </div>
  )
}
```

### Example 4: Future Pages (Services, Blog, etc.)

```tsx
// app/services/page.tsx
'use client'

import { usePage } from '@/lib/hooks/usePage'

export default function ServicesPage() {
  // Koi bhi slug use karo - automatically kaam karega!
  const { pageData, isLoading } = usePage('services')

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{pageData?.title}</h1>
      {/* Services content */}
    </div>
  )
}
```

## 🔧 API Functions

### 1. Get Page Data

```ts
import { getPageInformationBySlug } from '@/lib/api/pageInformation'

// Any page slug works!
const homePage = await getPageInformationBySlug('home')
const aboutPage = await getPageInformationBySlug('about')
const contactPage = await getPageInformationBySlug('contact')
const servicesPage = await getPageInformationBySlug('services')
```

### 2. Get Single Image

```ts
import { getImageBySlug } from '@/lib/api/pageInformation'

// Any page + any image type
const heroImage = await getImageBySlug('home', 'heroImage')
const aboutHero = await getImageBySlug('about', 'heroImage')
const sliderBg = await getImageBySlug('home', 'universitySliderBg')
```

### 3. Get Multiple Images

```ts
import { getImagesBySlug } from '@/lib/api/pageInformation'

// Fetch multiple images at once
const images = await getImagesBySlug('home', [
  'heroImage',
  'universitySliderBg',
  'immigrationServicesBg'
])
```

## 🎣 React Hooks

### usePage Hook

```tsx
import { usePage } from '@/lib/hooks/usePage'

function MyComponent() {
  const { pageData, isLoading, error } = usePage('home')
  
  // pageData contains all page information
  // Works for any slug: 'home', 'about', 'contact', etc.
}
```

### usePageImages Hook

```tsx
import { usePageImages } from '@/lib/hooks/usePageImages'

function MyComponent() {
  const { images, isLoading } = usePageImages(
    'home',  // Any slug
    ['heroImage', 'universitySliderBg'],
    {
      heroImage: '/fallback.jpg'  // Optional fallbacks
    }
  )
}
```

### usePageImage Hook (Single Image)

```tsx
import { usePageImage } from '@/lib/hooks/usePageImages'

function MyComponent() {
  const heroImage = usePageImage('home', 'heroImage', '/fallback.jpg')
}
```

## 🔄 Automatic Slug Detection

```tsx
'use client'

import { usePathname } from 'next/navigation'
import { usePage, getSlugFromPath } from '@/lib/hooks/usePage'

export default function DynamicPage() {
  const pathname = usePathname()
  const slug = getSlugFromPath(pathname) // Auto-detect slug from route
  
  const { pageData } = usePage(slug)
  
  return <div>{pageData?.title}</div>
}
```

## 📝 Backend Setup

Admin Panel mein page create karte waqt slug set karo:

1. **Home Page:**
   - Slug: `home`
   - Page Type: `home_page`

2. **About Page:**
   - Slug: `about`
   - Page Type: `about_page`

3. **Contact Page:**
   - Slug: `contact`
   - Page Type: `contact_page`

4. **Future Pages:**
   - Slug: kuch bhi (e.g., `services`, `blog`, `faq`)
   - Page Type: `other` ya appropriate type

## ✅ Benefits

1. **Ek API, Sab Pages:** Alag-alag functions ki zarurat nahi
2. **Scalable:** Naye pages add karne ke liye koi code change nahi
3. **Type Safe:** Zod schemas se full type safety
4. **Consistent:** Sab pages same pattern follow karte hain
5. **Easy to Use:** Simple hooks aur functions

## 🎯 Summary

- ✅ Ek universal API jo slug se kaam karta hai
- ✅ `usePage('slug')` hook se kisi bhi page ka data fetch karo
- ✅ `usePageImages('slug', [...])` se images fetch karo
- ✅ Future pages ke liye koi code change nahi - bas slug change karo!

---

**Happy Coding! 🚀**
