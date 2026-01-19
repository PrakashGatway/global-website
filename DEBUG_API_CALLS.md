# Debug API Calls - Network Tab Check

## 🔍 Network Tab mein API Calls Kaise Check Karein

### Step 1: Network Tab Filter

1. **Chrome DevTools** kholo (F12)
2. **Network** tab select karo
3. **Filter** mein type karo: `page-information`
   - Ya phir **Filter** dropdown se **XHR** ya **Fetch** select karo

### Step 2: Expected API Calls

Aapko yeh API calls dikhni chahiye:

```
GET http://localhost:5000/api/page-information/images/home/heroImage
GET http://localhost:5000/api/page-information/images/home/immigrationServicesBg
GET http://localhost:5000/api/page-information/images/home/universitySliderBg
```

### Step 3: Check API Response

Har API call par click karo aur check karo:

1. **Headers** tab:
   - Request URL sahi hai?
   - Status code kya hai? (200 = success, 404 = not found)

2. **Response** tab:
   - Success response:
   ```json
   {
     "success": true,
     "data": {
       "imageUrl": "https://res.cloudinary.com/.../image.jpg",
       "publicId": "...",
       "imageType": "heroImage",
       "slug": "home"
     }
   }
   ```
   - Error response (404):
   ```json
   {
     "success": false,
     "message": "Page not found or not published"
   }
   ```

### Step 4: Console Check

**Console** tab mein check karo:

- ✅ **No errors** = Sab theek hai
- ❌ **CORS error** = Backend CORS setup check karo
- ❌ **404 error** = Page Information create karo
- ❌ **Network error** = Backend running hai ya nahi check karo

---

## 🐛 Common Issues aur Solutions

### Issue 1: API Calls Dikhai Nahi De Rahi

**Possible Reasons:**
1. Components render nahi ho rahe
2. Hooks call nahi ho rahe
3. Page refresh karna padega

**Solution:**
```bash
# Frontend restart karo
cd "Gway frontend"
npm run dev
```

Browser mein **Hard Refresh** karo: `Ctrl + Shift + R`

### Issue 2: 404 Error - Page Not Found

**Error:**
```
GET /api/page-information/images/home/heroImage 404
```

**Solution:**
1. Admin panel mein jao
2. **Page Information** create karo:
   - Slug: `home`
   - Status: `Published`
3. Images upload karo
4. Frontend refresh karo

### Issue 3: CORS Error

**Error:**
```
Access to fetch at 'http://localhost:5000/...' from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solution:**
Backend `server.js` mein check karo:
```javascript
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000']
}))
```

### Issue 4: Network Error / Failed to Fetch

**Error:**
```
Failed to fetch
NetworkError when attempting to fetch resource
```

**Solution:**
1. Backend running hai? Check: `http://localhost:5000/api/health`
2. `.env.local` file sahi hai?
3. `NEXT_PUBLIC_API_URL` sahi set hai?

---

## ✅ Quick Test Commands

### Test Backend
```bash
# Terminal mein
curl http://localhost:5000/api/health
```

### Test Image API
```bash
# Browser mein directly open karo
http://localhost:5000/api/page-information/images/home/heroImage
```

### Test Frontend Environment
Browser console mein:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should show: http://localhost:5000/api
```

---

## 📊 Network Tab Checklist

- [ ] Network tab open hai
- [ ] Filter set hai (`page-information` ya `XHR`)
- [ ] Page refresh kiya
- [ ] API calls dikh rahi hain
- [ ] Status code 200 hai (ya 404 agar image nahi hai)
- [ ] Response mein `imageUrl` hai
- [ ] Console mein koi errors nahi hain

---

## 🎯 Expected Behavior

### Agar Image Backend Mein Hai:

1. **Network Tab:**
   - ✅ API call successful (200)
   - ✅ Response mein `imageUrl` hai
   - ✅ Image load ho rahi hai

2. **Browser:**
   - ✅ Dynamic image display ho rahi hai
   - ✅ Fallback image nahi dikh rahi

### Agar Image Backend Mein Nahi Hai:

1. **Network Tab:**
   - ⚠️ API call 404 return karega
   - ⚠️ Fallback image use hogi

2. **Browser:**
   - ⚠️ Default local image dikhegi
   - ⚠️ Console mein error nahi hoga (by design)

---

## 🔧 Debug Steps

1. **Network tab** kholo
2. **Filter** set karo: `page-information`
3. **Page refresh** karo (Ctrl + Shift + R)
4. **API calls** check karo
5. **Response** check karo
6. **Console** check karo
7. **Backend** verify karo

---

## 💡 Tips

- **Hard Refresh** zaroori hai environment variables load karne ke liye
- **Network tab** clear karo before testing
- **Preserve log** enable karo (agar chahiye)
- **Disable cache** enable karo (DevTools settings)

---

Agar abhi bhi API calls nahi dikh rahi, to batao - main aur help karunga! 🚀
