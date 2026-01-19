# Step-by-Step Setup Guide - Image Integration

Yeh guide aapko exact steps batayega ki kaise backend se frontend mein images integrate karein.

## Prerequisites

1. Node.js installed (v16+)
2. MongoDB running
3. Cloudinary account setup (images upload ke liye)

---

## Step 1: Backend Setup

### 1.1 Backend Dependencies Check

```bash
cd "Admin Panel/backend"
npm install
```

### 1.2 Environment Variables Setup

`.env` file create/update karo (ya `env.example` se copy karo):

```env
MONGODB_URI=mongodb://localhost:27017/cway-admin
PORT=5000
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=development
```

### 1.3 Backend Start Karo

```bash
cd "Admin Panel/backend"
npm start
# Ya development mode mein:
npm run dev
```

Backend `http://localhost:5000` par chalega.

### 1.4 Verify Backend

Browser ya Postman mein check karo:
```
GET http://localhost:5000/api/health
```

Response: `{ "status": "OK", "message": "Server is running" }`

---

## Step 2: Frontend Setup

### 2.1 Frontend Dependencies Check

```bash
cd "Gway frontend"
npm install
```

### 2.2 Environment Variable Create Karo

`.env.local` file create karo (root directory mein):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Important:** `.env.local` file create karna zaroori hai, warna images fetch nahi hongi!

### 2.3 Frontend Start Karo

```bash
cd "Gway frontend"
npm run dev
```

Frontend `http://localhost:3001` par chalega.

---

## Step 3: Admin Panel se Image Upload

### 3.1 Admin Panel Start Karo

```bash
cd "Admin Panel/frontend"
npm start
```

Admin panel `http://localhost:5173` (ya kisi aur port) par chalega.

### 3.2 Login Karo

1. Browser mein admin panel kholo
2. Login credentials se login karo
3. Agar user nahi hai to seed script chalao:

```bash
cd "Admin Panel/backend"
npm run seed
```

### 3.3 Page Information Create/Update Karo

1. Admin panel mein **"Page Information"** section mein jao
2. **"Create New"** ya existing page **"Edit"** karo
3. **Slug** set karo: `home` (homepage ke liye)
4. **Status** set karo: `Published` (important!)

### 3.4 Image Upload Karo

**Option A: Direct Cloudinary URL Add Karna**

1. Pehle image upload karo Cloudinary dashboard se ya upload API se
2. Page Information form mein directly URL paste karo:
   - `heroImage`: Hero section background image URL
   - `universitySliderBg`: University slider background URL
   - `immigrationServicesBg`: Immigration services section background URL

**Option B: Upload API Use Karna (Recommended)**

#### Step 3.4.1: Image Upload API Call

Postman ya curl se:

```bash
# Image upload karo
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

Response mein milega:
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "cway-admin/image"
  }
}
```

#### Step 3.4.2: Page Information Update Karo

Ab page information update karo with image URLs:

```bash
# Page ID pehle get karo
GET http://localhost:5000/api/page-information

# Phir update karo
PUT http://localhost:5000/api/page-information/PAGE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "home",
    "status": "Published",
    "heroImage": "https://res.cloudinary.com/.../hero.jpg",
    "heroImagePublicId": "cway-admin/hero",
    "universitySliderBg": "https://res.cloudinary.com/.../slider-bg.jpg",
    "universitySliderBgPublicId": "cway-admin/slider-bg",
    "immigrationServicesBg": "https://res.cloudinary.com/.../immigration-bg.jpg",
    "immigrationServicesBgPublicId": "cway-admin/immigration-bg"
  }'
```

---

## Step 4: Frontend mein Verify Karo

### 4.1 Browser mein Check Karo

1. Frontend kholo: `http://localhost:3001`
2. Homepage par jao
3. Browser DevTools kholo (F12)
4. **Network** tab mein check karo:
   - API calls: `/api/page-information/images/home/...`
   - Images load ho rahi hain ya nahi

### 4.2 Console Check Karo

Browser console mein errors check karo. Agar kuch error ho to:

- **CORS Error**: Backend `server.js` mein CORS check karo
- **404 Error**: Slug aur imageType sahi hain ya nahi check karo
- **Network Error**: Backend running hai ya nahi check karo

### 4.3 Visual Check

1. Hero section background image change hui hai ya nahi
2. University slider cards ka background change hua hai ya nahi
3. Immigration services section background change hui hai ya nahi

---

## Step 5: Testing Checklist

### ✅ Backend Tests

- [ ] Backend server running hai
- [ ] MongoDB connected hai
- [ ] Health check API working hai
- [ ] Upload API working hai
- [ ] Page Information API working hai

### ✅ Frontend Tests

- [ ] `.env.local` file exists hai
- [ ] `NEXT_PUBLIC_API_URL` set hai
- [ ] Frontend server running hai
- [ ] No console errors
- [ ] Images load ho rahi hain

### ✅ Integration Tests

- [ ] API call successful ho rahi hai
- [ ] Images backend se fetch ho rahi hain
- [ ] Fallback images work kar rahi hain (agar API fail ho)
- [ ] Multiple images ek saath load ho rahi hain

---

## Common Issues aur Solutions

### Issue 1: Images Load Nahi Ho Rahi

**Symptoms:**
- Frontend par default images dikh rahi hain
- Network tab mein API call fail ho rahi hai

**Solutions:**
1. Check `.env.local` file exists hai
2. Check `NEXT_PUBLIC_API_URL` sahi hai
3. Check backend running hai
4. Check slug `home` hai aur status `Published` hai
5. Browser console mein error check karo

### Issue 2: CORS Error

**Error:**
```
Access to fetch at 'http://localhost:5000/...' from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solution:**
Backend `server.js` mein CORS update karo:

```javascript
const cors = require('cors')

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}))
```

### Issue 3: 404 Not Found

**Error:**
```
GET /api/page-information/images/home/heroImage 404
```

**Solutions:**
1. Check slug sahi hai (`home`)
2. Check page status `Published` hai
3. Check image type sahi hai (`heroImage`, `universitySliderBg`, etc.)
4. Check page information database mein exists karta hai

### Issue 4: Image URL Invalid

**Error:**
- Image display nahi ho rahi
- Broken image icon

**Solutions:**
1. Check Cloudinary URL valid hai
2. Check image public accessible hai
3. Check URL format sahi hai (https://)
4. Browser mein directly URL open karke check karo

---

## Quick Test Commands

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Page Information
```bash
curl http://localhost:5000/api/page-information/public/home
```

### Get Specific Image
```bash
curl http://localhost:5000/api/page-information/images/home/heroImage
```

### Frontend Check
```bash
# Browser mein open karo
http://localhost:3001
```

---

## Next Steps

1. ✅ Backend setup complete
2. ✅ Frontend setup complete
3. ✅ Images upload karo
4. ✅ Frontend verify karo
5. 🔄 Production deploy karo (agar ready ho)

### Production Setup

Production mein:

1. **Backend:**
   - Environment variables update karo
   - MongoDB production URL use karo
   - Cloudinary production credentials use karo

2. **Frontend:**
   - `.env.production` file create karo:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   ```
   - Build karo: `npm run build`
   - Deploy karo

---

## Summary

1. **Backend start** → `cd "Admin Panel/backend" && npm start`
2. **Frontend `.env.local` create** → `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
3. **Frontend start** → `cd "Gway frontend" && npm run dev`
4. **Admin panel se images upload** → Page Information section
5. **Frontend verify** → Browser mein check karo

Agar koi issue ho to troubleshooting section dekho ya console errors check karo!
