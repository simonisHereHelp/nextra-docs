
# 📸 DocuCam — Web App (PWA) Architecture & Workflow Plan

> **Purpose:**  
> DocuCam is a browser-based Progressive Web App (PWA) for capturing, annotating, and uploading document photos to Google Drive.  
> It connects directly with the **Nextra Life Log site**: [https://nextra-pi-sand.vercel.app](https://nextra-pi-sand.vercel.app),  
> serving as its capture and metadata companion.

---

## 🧭 1. Overview

DocuCam runs fully in the browser — installable as a PWA on iPhone, Android, or desktop.  
No Apple Developer fees, no App Store submission, and no recurring rebuilds.

**Workflow:**  
1. Capture photo using device camera  
2. Add metadata (Title, Topic, Time, Location)  
3. Upload image + metadata to Google Drive `/DocuCam/` folder  

**Core Functions:**  
- Camera access via HTML5 input capture  
- Metadata fields linked to Nextra topics  
- Automatic timestamp and GPS tagging  
- Upload to Google Drive using OAuth  
- Offline-friendly, installable via PWA manifest  

---

## ⚙️ 2. Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | React + Next.js (or Nextra extension) |
| PWA Engine | `next-pwa` (service worker + manifest) |
| Camera | HTML5 `<input type="file" accept="image/*" capture="environment">` |
| Storage | Google Drive REST API v3 |
| Auth | Google OAuth 2.0 (client-side) |
| Hosting | Vercel (free tier) |

---

## 🧩 3. Folder Structure

```
/docucam/
 ├── public/
 │    ├── manifest.json
 │    └── icons/
 ├── pages/
 │    ├── index.tsx              # Capture + Upload UI
 │    └── api/driveAuth.ts       # Optional proxy for token refresh
 ├── components/
 │    ├── CameraInput.tsx
 │    ├── MetaForm.tsx
 │    ├── DriveUploader.tsx
 │    └── Toast.tsx
 ├── hooks/
 │    └── useDrive.ts
 ├── styles/
 │    └── globals.css
 └── README_DocuCam.md
```

---

## 📷 4. Example Metadata (`.meta.json`)

```json
{
  "title": "兆豐與銀行",
  "topic": "帳戶餘額",
  "capturedAt": "2025-10-21T10:42:00Z",
  "geo": {
    "latitude": 25.0831,
    "longitude": 121.5245,
    "accuracy_m": 8
  },
  "driveFolder": "DocuCam",
  "imageName": "IMG_20251021_104200.jpg",
  "AI_annotated": ""
}
```

---

## ☁️ 5. Google Drive Integration

- OAuth 2.0 client-side auth (`drive.file` scope)  
- Auto-creates `/DocuCam` folder if missing  
- Uploads:
  - `IMG_YYYYMMDD_hhmmss.jpg`
  - `IMG_YYYYMMDD_hhmmss.meta.json`

Example Drive API endpoints:  
```
POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart
GET  https://www.googleapis.com/drive/v3/files?q=name='DocuCam'
```

---

## 🔐 6. Authentication

- Uses Google OAuth popup (implicit or PKCE flow).  
- Token stored in localStorage, refreshed by gapi SDK.  
- Revoke via [Google Account → Security → Third-party access](https://myaccount.google.com/permissions).

---

## 🧱 7. Development Plan

| Phase | Goal | Deliverable |
|-------|------|--------------|
| **P1 – Setup** | Initialize Next.js PWA scaffold | Base project structure |
| **P2 – Camera Capture** | Implement photo input & preview | `CameraInput.tsx` |
| **P3 – Metadata Form** | Title, Topic, Time, Geo | `MetaForm.tsx` |
| **P4 – OAuth + Upload** | Connect to Google Drive | `DriveUploader.tsx` |
| **P5 – PWA Polish** | Manifest, icons, offline support | Installable PWA |
| **P6 – AI Annotation** | Integrate AI metadata tagging | Placeholder field ready |

---

## 🧭 8. Deployment

**Environment Variables (Vercel):**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_API_KEY=
NEXT_PUBLIC_TOPICS_URL=https://nextra-pi-sand.vercel.app/topics.json
```

**Build & Deploy Commands:**
```bash
npm install
npm run build
vercel --prod
```

On iPhone → open Safari → Share → **Add to Home Screen** to install.

---

## ✅ 9. Summary

DocuCam (PWA) is the browser-native companion to your Nextra Life Log site,  
linking field document capture to structured personal data management —  
without App Store constraints, developer fees, or rebuild cycles.

---

**Author:** Simon Chen  
**Project Link:** [https://nextra-pi-sand.vercel.app](https://nextra-pi-sand.vercel.app)  
**© 2025 isHere.help — All rights reserved.**
