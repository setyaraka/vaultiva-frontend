# 🗂️ Vaultiva – Frontend

Secure file-sharing frontend with features like watermarking, access control, and activity tracking. Designed for privacy-focused document workflows.
Built using Angular v19, NG Zorro, and Tailwind CSS.

---

## 🔗 Related Repository

This is the frontend part of a fullstack secure file-sharing project.  
👉 Backend repo: [vaultiva-backend](https://github.com/setyaraka/vaultiva-backend)

---

## 🚀 Live Demo

🌐 https://vaultiva.cloud.

🔐 Try uploading a file with password protection or watermark preview.

---

## 🧰 Tech Stack

- **Framework**: Angular v19
- **UI**: NG Zorro (Ant Design)
- **Styling**: Tailwind CSS  
- **Testing**: Jasmine + Karma
- **API Integration**: RESTful with NestJS backend

---

## 🔐 Key Features

- User Authentication (JWT)
- File Upload with Preview
- Password-Protected File Sharing
- Expired File Handling
- Watermark Preview (PDF & Image)
- Download & View Statistics
- Dashboard: File list, stats, activity log

---

## 🛠️ Setup

```bash
npm install
ng serve
```

Configure environment.ts to point to your backend API:
```
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://your-backend-url.com',
};
```

## 📌 About the Project

Vaultiva is a secure file-sharing MVP built to address the real-world needs of protecting sensitive documents.

It focuses on simulating enterprise-grade document workflows, including:

- 🖋️ Watermarking for PDF and image previews  
- 🔐 Password and expiration-based access control  
- 🧾 Audit logging and user traceability  
- 📊 Stats dashboard for views and downloads  
- ⚙️ Flexible file visibility settings (public, protected, private)

The project emphasizes both **user-friendly file sharing** and **backend traceability**, making it suitable for professional environments where document access needs to be controlled and monitored.

## 🎯 Why This Project Matters

Vaultiva was built as a practical exploration of how document-sharing systems work in real business contexts. It demonstrates:

- ⚙️ Component-based Angular architecture
- 🔐 Real-world security flows (password, watermark, expiry)
- 📊 Integration of stats and activity monitoring
