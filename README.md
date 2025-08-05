# 🗂️ Vaultiva – Secure File Sharing Frontend

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

## 🙋 Feedback

Have thoughts or found a bug?  
Feel free to open an issue for any suggestions or questions.
