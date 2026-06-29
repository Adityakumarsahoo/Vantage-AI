<div align="center">

<img src="./frontend/public/vantage_ai_banner.png" alt="Vantage AI Header Banner" width="100%" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-bottom: 25px;" />

# ⚡ Vantage AI — Website Auditor

[![Platform](https://img.shields.io/badge/Vantage--AI-Website--Auditor-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](#)
[![Version](https://img.shields.io/badge/Version-2.1-9b59b6?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](#)

<p align="center">
  <b>Enterprise-grade website crawling, technical page vitals assessment, secure header audits, and real-time AI code refactoring recommendations.</b>
</p>

---

[🚀 Quick Start](#-getting-started) • [🌟 Core Features](#-core-features) • [🛠️ Technical Stack](#%EF%B8%8F-technical-stack) • [📁 Directory Architecture](#-project-architecture) • [👨‍💻 Contact Creator](#-created--authored-by)

</div>

---

## 🌟 Core Features

<table width="100%">
  <tr>
    <td width="50%">
      <h3>⚡ Real-Time Crawling & Audits</h3>
      <p>Instantly crawl target URLs to extract DOM headers, check page indexing rules, and validate responsive element constraints.</p>
    </td>
    <td width="50%">
      <h3>📊 Multi-Viewport Performance Vitals</h3>
      <p>Review metrics like First Contentful Paint (FCP) and Largest Contentful Paint (LCP) simulated across Desktop, Tablet, and Mobile devices.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔒 Security Telemetry Assessment</h3>
      <p>Analyze secure communication layers (SSL/TLS checks) and HTTP response security parameters (HSTS, CSP, X-Frame-Options).</p>
    </td>
    <td width="50%">
      <h3>🧠 AI Line-by-Line Refactoring</h3>
      <p>Get immediate, drop-in React/HTML replacements powered by recommendations logic to patch code vulnerabilities.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>💾 Chronological Scan Databases</h3>
      <p>Track audit history and score metrics chronologically using a local storage system to review improvements over time.</p>
    </td>
    <td width="50%">
      <h3>📤 Document Generation & Export</h3>
      <p>Generate clean, formatted PDF reports, raw JSON audits, or CSV index lists with a single click.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Technical Stack

<div align="center">

| Core Area | Technologies Used |
| :--- | :--- |
| **Frontend UI** | ![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![Lucide React](https://img.shields.io/badge/Lucide_Icons-6366f1?style=flat-square) |
| **Data Visuals** | ![Recharts](https://img.shields.io/badge/Recharts-3498db?style=flat-square) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-F22F46?style=flat-square&logo=framer&logoColor=white) |
| **Backend API** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![TSX Runner](https://img.shields.io/badge/TSX_Runner-e74c3c?style=flat-square) |
| **AI Processing** | ![Google Gemini](https://img.shields.io/badge/Google_Gemini_API-8E44AD?style=flat-square&logo=google-gemini&logoColor=white) |
| **Document Export** | ![PDFKit](https://img.shields.io/badge/PDFKit-e67e22?style=flat-square) |

</div>

---

## 📁 Project Architecture

```
ai-website-analyzer/ (project-root)
├── frontend/
│   ├── public/             # Static assets & avatar resources
│   ├── src/                # Frontend React application source code
│   │   ├── components/     # UI dashboards & panels
│   │   ├── App.tsx         # App wrapper and layouts
│   │   ├── index.css       # Styling configuration
│   │   └── types.ts        # Common React interface definitions
│   ├── package.json        # Frontend dependencies and dev scripts
│   ├── tsconfig.json       # Frontend TS configuration
│   └── vite.config.ts      # Vite dev settings & endpoint proxying
├── backend/
│   ├── controllers/        # Route logic functions
│   ├── middleware/         # Express middlewares (e.g. logger)
│   ├── models/             # Database access layers (Local DB JSON helper)
│   ├── routes/             # Express routing mapping
│   ├── utils/              # Heavy audit logic & report doc exports
│   ├── types.ts            # Node.js backend typescript interfaces
│   ├── db_data.json        # Active database JSON storage file
│   ├── package.json        # Backend server package configuration
│   ├── tsconfig.json       # Backend Node TS compiler settings
│   └── server.ts           # Express listener and CORS bootstrap configuration
├── README.md               # Monorepo setup documentation
└── .gitignore              # Main ignore patterns
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** v18+ installed on your local environment.
- Active **Google Gemini API Key** for optimization recommendation diagnostics.

---

### ⚙️ Installation & Launch

To run the applications in parallel, you must start the backend and frontend separately.

#### 1. Launch Backend Server
1. **Navigate to the Backend directory:**
   ```bash
   cd backend
   ```
2. **Install Backend dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file inside the `backend/` directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. **Start Backend Developer Environment:**
   ```bash
   npm run dev
   ```
   *The Express server will start running on [http://localhost:3000](http://localhost:3000).*

---

#### 2. Launch Frontend UI
1. **Navigate to the Frontend directory (in a new shell):**
   ```bash
   cd frontend
   ```
2. **Install Frontend dependencies:**
   ```bash
   npm install
   ```
3. **Start Frontend Developer Environment:**
   ```bash
   npm run dev
   ```
   *The React development server will start, typically on [http://localhost:5173](http://localhost:5173).*
   *API calls to `/api` are automatically proxied to the backend server.*

---

## 👨‍💻 Created & Authored By

<div align="center">
<table border="0">
  <tr>
    <td align="center" width="220">
      <img src="./frontend/public/input_file_1.png" alt="Aditya Kumar Sahoo" width="130" style="border-radius: 50%; border: 3px solid #6366f1; box-shadow: 0 4px 15px rgba(99,102,241,0.3);" />
      <br />
      <b>Aditya Kumar Sahoo</b>
      <br />
      <sub>Platform Owner & Lead Architect</sub>
    </td>
    <td valign="middle" style="padding-left: 20px;">
      <p>🚀 <b>Core Competence</b>: High-performance React viewports, TypeScript architectures, responsive web telemetry, and LLM-powered recommendations nodes.</p>
      <p>📍 <b>Based In</b>: Bhubaneswar, Odisha, India</p>
      <p>
        <a href="https://github.com/Adityakumarsahoo"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" /></a>
        <a href="mailto:toadityakumarsahoo@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white" /></a>
        <a href="https://aditya-spark.vercel.app"><img src="https://img.shields.io/badge/Portfolio-6366f1?style=flat-square&logo=vercel&logoColor=white" /></a>
      </p>
    </td>
  </tr>
</table>
</div>

---

## 📄 License
Calculated audit scores emulate PageSpeed Insights and W3C auditing parameters. Built open-source for personal developer utility audits.
