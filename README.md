# Vantage AI Website Auditor

Vantage AI is an enterprise-grade website auditing and optimization platform. It combines raw technical performance crawling (Lighthouse and W3C WCAG emulation) with intelligent, LLM-powered optimization suggestions. Web developers can run real-time semantic diagnostics, review speed benchmarks, inspect secure headers, and get line-by-line code recommendations to fix accessibility and performance bottle-necks.

---

## 🌟 Core Features

- ⚡ **Real-Time Crawling & Audits**: Validates URLs in real-time, parsing HTML structure, document tag ratios, and layout elements.
- 📊 **Performance & Vitals Dashboard**: Compiles Core Web Vitals like First Contentful Paint (FCP) and Largest Contentful Paint (LCP) across desktop, tablet, and mobile viewports.
- 🔒 **Security Assessment Check**: Audits target websites for active SSL/TLS, secure response parameters (HSTS, CSP), and cross-origin security vectors.
- 🧠 **AI-Powered Code Refactoring**: Offers direct, copy-pasteable line-by-line solutions using generative recommendations.
- 💾 **Scan History Database**: A chronological crawler history checklist saved in local storage to audit and compare metrics overtime.
- 📤 **Multi-Format Export Engine**: Exports reports directly to formatted PDF documents, raw JSON, or clean CSV summaries.
- 🌗 **Adaptive Design System**: Built with modern Tailwind CSS v4 featuring responsive grids, glassmorphism, and a high-contrast dark/light mode toggle.

---

## 🛠️ Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts (Radar/Bar charts), Framer Motion.
- **Backend**: Node.js, Express, TSX, SQLite-mock DB layers, PDFKit (PDF export).
- **Core Integrations**: Gemini API (intelligent code correction models).
- **Tooling**: Vite (development server & HMR), ESBuild (server bundler).

---

## 📁 Project Architecture

```
ai-website-analyzer/
├── public/                 # Static assets (including profile avatars)
├── src/                    # Frontend source directory
│   ├── components/         # UI Elements (Dashboards, Issue Reports, History List)
│   │   ├── AdminPanel.tsx  # System health metrics & server logs
│   │   ├── HistoryList.tsx # Crawl database history records
│   │   ├── IssueReport.tsx # AI line-by-line recommendations
│   │   └── ReportDashboard.tsx # Comprehensive analytics & charts
│   ├── App.tsx             # Main client page layout & state orchestrator
│   ├── index.css           # Global stylesheets & custom design keyframes
│   ├── types.ts            # Audit, History, and Profile type declarations
│   └── main.tsx            # React DOM mounting entry point
├── server/                 # Express backend source directory
│   ├── db.ts               # In-memory mock database & log records
│   ├── analyzer.ts         # Audit algorithms (SEO, performance, security metrics)
│   └── generators.ts       # CSV, JSON, and PDF generation engines
├── server.ts               # Node/Express API server controller
├── vite.config.ts          # Vite asset pipeline configuration
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### 1. Installation
Clone the repository and install all node modules:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory and specify your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
Launch the development server running Express and Vite hot reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 Created & Authored By

Vantage AI was designed, architected, and built from scratch by:

### **Aditya Kumar Sahoo**
*Platform Owner & Chief Architect*

- **Location**: Bhubaneswar, Odisha, India
- **Core Focus**: React, TypeScript, and Intelligent Recommendation Architectures
- **GitHub**: [Adityakumarsahoo](https://github.com/Adityakumarsahoo)
- **Portfolio**: [aditya-spark.vercel.app](https://aditya-spark.vercel.app)
- **Contact Email**: [toadityakumarsahoo@gmail.com](mailto:toadityakumarsahoo@gmail.com)

---

## 📄 License
This project is open-source. Calculated audit scores correspond to simulated PageSpeed Insights and W3C auditing algorithms.
