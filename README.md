# Pragya AI (प्रज्ञा AI) — SkillQuest
### *AI-Powered Gamified Capacity Building Platform for Civil Services (MoSPI & Mission Karmayogi)*

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-FF6F00)](https://www.trychroma.com/)

---

## 🏛️ Project Overview

**Pragya AI** is an intelligent, gamified capacity-building and competency assessment ecosystem designed for the **Ministry of Statistics and Programme Implementation (MoSPI)** and aligned with **Mission Karmayogi** (National Programme for Civil Services Capacity Building).

The platform transforms dense official guidelines, survey manuals, and statistical methodologies into engaging, multimodal learning pathways featuring adaptive AI quizzes, spaced repetition retention nuggets, human-in-the-loop trainer workflows, and interactive policy simulations.

---

## 🌟 Key Features

### 1. 📚 5-Mode Multimodal Learning Engine
- **Video Lectures with Synchronized Transcripts**: Clickable timestamp chapters and live speaker transcripts.
- **E-Book Reader**: Interactive font scaling (`A-`, `A`, `A+`), bookmarking, and visual callout standards.
- **PDF & Study Notes Learning Hub**: Dynamic document switching, multi-page PDF viewing with zoom controls, formatted revision notes viewer, and one-click note copying.
- **AI Executive Summarizer**: Automatic extraction of key policy directives, detected competencies, and learner action items from any uploaded document or note using Google Gemini.
- **Educational Games ("Knowledge Run")**: 3-stage interactive quiz run with health/lives, XP points, and instant feedback.
- **Adaptive AI Quizzes**: RAG-grounded assessments generated directly from semantic chunks with detailed pedagogical explanations.

### 2. 📄 PDF & Notes Upload Pipeline
- **Drag-and-Drop Ingestion**: Upload official PDF manuals, circulars, or text documents (`.pdf`, `.docx`, `.txt`, `.md`).
- **Rich Revision Notes Studio**: Custom markdown note creator with automatic word counting and preloaded MoSPI statistical standards templates.
- **ChromaDB Semantic Vector Indexing**: Automatic chunking and embedding of documents into vector collections for instant retrieval.
- **Document Management**: View, filter, select for RAG quiz synthesis, and delete items from the active knowledge base.

### 3. 🖥️ Screen Size Viewport Controller & Device Simulator
- **Live Resolution Screening**: Real-time display of window viewport dimensions (e.g., `1920 × 1080 px • Desktop 2XL`).
- **Responsive Screen Modes**:
  - **Full Width (100% Fluid)**: Unlocks full widescreen displays for high-density data analytics.
  - **Desktop View (1280px / 1440px)**: Standard government portal container.
  - **Laptop View (1024px)**: 13"-14" laptop viewport constraint.
  - **Tablet Simulator (768px)**: Centered iPad/tablet frame with device bezel.
  - **Mobile Simulator (390px)**: Centered iPhone/Android frame with status bar and notch.
- **Fullscreen Mode**: Quick toggle for native browser fullscreen (`F11`).

### 4. 🎮 Gamification & Competency Tracking
- **Karma Points & Badges**: Earn XP and coins for completing learning modules, daily goals, and quizzes.
- **Daily Streak Tracker**: Consecutive day counter with bonus multiplier rewards.
- **National Standings Map**: Interactive state-wise India map visualizing departmental training performance and leaderboard rankings.
- **FRAC Competency Radar**: Live multi-axis radar chart mapping proficiency across MoSPI operational domains.

### 5. 👨‍🏫 Trainer & Admin Portals
- **Human-in-the-Loop (HITL) Review**: Trainers inspect, edit, approve, or reject AI-generated questions before publishing.
- **iGOT Karmayogi API Integration**: Sync course catalogs, user competencies, and completion certificates.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **Data Visualization** | Recharts (Radar, Bar, Line Charts), @svg-maps/india |
| **Backend Framework** | Node.js (v22+), Express 4, TSX |
| **Artificial Intelligence** | Google Gemini API (`@google/genai`), ChromaDB Vector Store |
| **Authentication & Security** | JWT (JSON Web Tokens), Role-Based Access Control (RBAC) |
| **Document Processing** | PDF Text Extractor, jsPDF |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher recommended, tested on Node v22)
- **npm** (v9+) or **bun**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nithish016/pragya-ai-sih.git
   cd pragya-ai-sih
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and configure your API keys:
   ```bash
   cp .env.example .env
   ```
   *(Optional)* Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Project Structure

```plaintext
pragya-ai-sih/
├── index.html                  # HTML entry point
├── package.json                # Project dependencies and npm scripts
├── server.ts                   # Express server & Vite middleware
├── server/
│   ├── db.ts                   # In-memory database & demo seed records
│   ├── gemini.ts               # Google Gemini RAG & AI summarization
│   ├── vector_store.ts         # ChromaDB semantic vector search
│   └── services/
│       ├── auth_service.ts     # JWT authentication & session tokens
│       ├── igot_service.ts     # iGOT Karmayogi REST API sync
│       └── recommendation_engine.ts # Rule-based course recommendations
├── src/
│   ├── App.tsx                 # Main layout & screen view controller wrapper
│   ├── main.tsx                # React DOM entry
│   ├── components/
│   │   ├── DocumentUploadModal.tsx  # Dual-tab PDF & Notes upload studio
│   │   ├── ScreenSizeController.tsx # Viewport screen size switcher & simulator
│   │   ├── Navbar.tsx               # Top government header & accessibility toolbar
│   │   ├── Sidebar.tsx              # Role-aware navigation sidebar
│   │   ├── NationalStandingsMap.tsx # Interactive India map leaderboard
│   │   ├── CompetencyRadarChart.tsx # FRAC competency radar visualizer
│   │   ├── DailyStreakTracker.tsx   # Gamification streak tracker
│   │   └── SearchModal.tsx          # Global semantic search modal
│   └── pages/
│       ├── LandingPage.tsx          # Official portal homepage
│       ├── LearnerDashboard.tsx     # Officer personal learning dashboard
│       ├── TopicLearningPage.tsx    # 5-mode multimodal learning & PDF/notes hub
│       ├── TrainerDashboard.tsx     # Document ingestion & HITL question review
│       ├── AdminDashboard.tsx       # Departmental governance & iGOT sync
│       └── LoginPage.tsx            # Multi-role authentication page
```

---

## 📜 Available Scripts

- `npm run dev`: Starts the full-stack server (Express + Vite HMR) on `http://localhost:3000`.
- `npm run build`: Compiles the React client bundle and bundles the server script into `dist/`.
- `npm run start`: Runs the production server from `dist/server.cjs`.
- `npm run lint`: Runs TypeScript compiler check (`tsc --noEmit`).

---

<div align="center">
  <hr />
  <p><strong>Developed with ❤️ by Gubba Nithish</strong></p>
  <p><em>Pragya AI — Empowering Civil Services with Intelligence and Play.</em></p>
</div>
