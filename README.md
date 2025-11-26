# 🎯 Smart Goal Breaker

A **Next.js (App Router)** frontend application that transforms complex goals into clear, actionable sub-tasks using an LLM-powered backend service. The app communicates securely with the backend through a Next.js API proxy route.

---

## 🚀 Key Technologies

- **Frontend:** Next.js, TypeScript, React Hooks  
- **Styling:** Tailwind CSS  
- **Backend:** FastApi
- **DataBase:** NeonDB(Postgres hosted instance)

---

## 🛠️ Setup & Run

### 1. Prerequisites

- Node.js and npm or yarn installed  
- External goal breakdown backend running and accessible

---

### 2. Installation

```bash
npm install
# or
yarn install
```

```bash
# .env.local
# BACKEND_API_URL=http://localhost:8000
BACKEND_API_URL=

NEON_URL= 
GEMINI_API_KEY=
```


Run the project
```bash
npm run dev
# or
yarn dev
```