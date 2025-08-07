# 🗂️ Vaultiva – Secure File Sharing Frontend

> ⚠️ This project is a personal open-source showcase. Vaultiva is not a commercial SaaS, but a demonstration of secure file-sharing app development best practices.

A modern, secure file-sharing frontend with watermarking, access control, and activity tracking — built for privacy-focused document workflows.

> ⚙️ Built with Angular 19, NG Zorro (Ant Design), and Tailwind CSS.

---

## 🔗 Related Repository

This is the **frontend** of a full-stack secure file-sharing project.

👉 Backend Repo: [vaultiva-backend](https://github.com/setyaraka/vaultiva-backend)

---

## 🚀 Live Demo

🌐 [https://vaultiva.cloud](https://vaultiva.cloud)

🔐 Try uploading a file with password protection and see the watermark preview feature in action.

---

## 🧰 Tech Stack

| Layer         | Tech                     |
|---------------|--------------------------|
| Framework     | Angular v19              |
| UI Components | NG Zorro (Ant Design)    |
| Styling       | Tailwind CSS             |
| Animation     | Lottie (ngx-lottie + lottie-web) |
| Testing       | Jasmine + Karma          |
| API           | RESTful (NestJS backend) |

---

## 🔐 Key Features

- ✅ User Authentication (JWT)
- 📁 File Upload with Preview
- 🔒 Password-Protected File Sharing
- ⏰ Expiration Handling
- 🖋️ Watermark Preview (PDF & Images)
- 📥 Download & View Tracking
- 📊 Dashboard with Stats & Activity Log

---

## 🛠️ Getting Started

### 1. Install dependencies and start dev server

```bash
npm install
ng serve
```

### 2. Configure environment

Edit src/environments/environment.ts:
```
export const environment = {
  production: false,
  apiUrl: 'https://your-backend-url.com',
};
```
---

## 📌 About the Project

Vaultiva is a secure file-sharing MVP designed to simulate enterprise-grade document workflows with a focus on privacy, auditability, and access control.
It includes:
- 🖋️ Watermarking for PDF & image previews
- 🔐 Password and expiry-based access control
- 🧾 Audit logging for user traceability
- 📊 Stats dashboard for monitoring views and downloads
- ⚙️ Flexible file visibility (public / protected / private)

---

## 🎯 Why This Project Matters

Vaultiva is built as a practical exploration of document-sharing systems in real-world contexts. It demonstrates:

- ⚙️ Component-based Angular architecture
- 🔐 Secure file workflows (password, watermark, expiry)
- 📊 Real-time stats & activity tracking integration
- 🧠 A clean and scalable frontend codebase for modern Angular projects

---

## 🗺️ Roadmap
Vaultiva is built with a long-term plan to gradually enhance document protection, user experience, and enterprise readiness.

### 🥇 Stage 1 – Lockdown Basics (MVP)
- [x] Responsive mobile design overhaul
- [x] Convert file list from table to card layout (desktop + mobile)
- [ ] Proxy all file access via backend (token-based)
- [ ] Hard watermark rendering via backend (pdf-lib + Sharp)
- [ ] Watermark preview per recipient
- [ ] Replace <iframe> viewer with PDF.js
- [ ] Token-based session tracking
- [ ] Log PDF open event and last page viewed
- [ ] Basic JS protections (blur on tab out, disable right-click)
- [ ] Strengthened watermark rendering (positioning, rotating, opacity, content)

### 🥈 Stage 2 – UX & Try Vaultiva
- [ ] “Try Vaultiva Now” share demo
- [ ] “View as recipient” simulation
- [ ] Group file list by protection level
- [ ] Enhanced empty states and guidance messages

### 🥉 Stage 3 – Abuse Prevention & Performance
- [ ] Brute-force password protection
- [ ] IP-based upload/share limiting
- [ ] Compress dashboard thumbnails
- [ ] Optimize PDF and asset delivery via CDN

### 🧠 Stage 4 – AI & Smart Recovery
- [ ] Vaultiva Assistant (AI guide/helper)
- [ ] “Forgot password?” → reset suggestion or revoke flow

### 💎 Stage 5 – Enterprise-Grade Protections
- [ ] Server-side image rendering + watermark stamping (Sharp)
- [ ] Invisible metadata injection (user ID, timestamp, access info)
- [ ] Multi-device session logging
- [ ] PDF interaction heatmap & analytics

## 🙋 Feedback

Have thoughts or found a bug?  
Feel free to open an issue for any suggestions or questions.
