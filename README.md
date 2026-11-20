# AI Resume Roaster & ATS Checker

An AI-powered resume analyzer, ATS scorer, and version-controlled bullet rewriter built with the MERN stack and Google Gemini AI. Users can upload PDF resumes via drag-and-drop, extract structured resume sections, receive ATS readiness scores with actionable feedback, apply AI-generated bullet rewrites to create new versions, inspect side-by-side diffs, export polished PDFs, and track progress through interactive analytics dashboards.

---

## Tech Stack

### Backend
- **Runtime & Framework:** Node.js (>=20, ES Modules), Express 5
- **Database:** MongoDB & Mongoose
- **AI Integration:** Google GenAI SDK (`@google/genai`) with structured JSON schemas (`gemini-3.5-flash-lite`)
- **Authentication & Security:** JWT (`jsonwebtoken`), HTTP-only cookies (`cookie-parser`), `bcrypt`, `express-rate-limit`, `cors`
- **File Parsing & Utilities:** `multer` (in-memory PDF uploads up to 5 MB), `pdf-parse`, `zod` validation, `diff` (word/line version diffs)

### Frontend (`airesumetracker`)
- **Core & Build Tool:** React 19, Vite 8, React Router v7
- **Styling & Animation:** Tailwind CSS v4 (`@tailwindcss/vite`), `tw-animate-css`, `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`
- **Data Fetching & HTTP:** TanStack React Query v5 (`@tanstack/react-query`), `axios` (with credentials for HTTP-only JWT cookies)
- **Charts, Uploads & PDF Export:** `recharts` (ATS score trends & analytics), `react-dropzone` (PDF drag-and-drop upload), `@react-pdf/renderer` (client-side resume PDF generation)

---

## Project Structure

```text
ai-resume-checker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection with DNS config
│   │   │   └── env.js                # Environment variables & validation
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT cookie authentication guard
│   │   │   ├── errorHandler.js       # Global & 404 error handlers
│   │   │   ├── rateLimit.js          # Auth & AI analysis rate limiters
│   │   │   ├── upload.js             # Multer PDF upload validation
│   │   │   └── validate.js           # Zod request validator (Express 5 safe)
│   │   ├── models/
│   │   │   ├── Analysis.js           # ATS scores, issues, strengths, rewrites
│   │   │   ├── Resume.js             # Resume metadata & version tracking
│   │   │   ├── ResumeVersion.js      # Raw text & structured resume sections
│   │   │   └── User.js               # User credentials & profile
│   │   ├── routes/
│   │   │   ├── auth.js               # Register, login, logout, profile, password
│   │   │   ├── dashboard.js          # KPIs, score series, version stack, feed
│   │   │   ├── health.js             # Server health check
│   │   │   ├── history.js            # Chronological user activity log
│   │   │   ├── insights.js           # Cross-resume score trends & keyword stats
│   │   │   ├── resumes.js            # Upload, parse, analyze, rewrite, diff
│   │   │   └── versions.js           # All resume versions & source breakdown
│   │   ├── services/
│   │   │   ├── diffService.js        # Word & line diff generator
│   │   │   ├── geminiService.js      # ATS scoring & bullet rewrite engine
│   │   │   ├── pdfService.js         # PDF text extraction
│   │   │   └── structuredParser.js   # AI resume-to-JSON parser
│   │   ├── utils/
│   │   │   ├── ApiError.js           # Custom operational error class
│   │   │   ├── asyncHandler.js       # Async route wrapper
│   │   │   └── jwt.js                # Token signing & cookie configuration
│   │   └── server.js                 # Express app entry point
│   └── package.json
└── frontend/
    └── AIResumeChecker/
        ├── public/
        ├── src/
        ├── eslint.config.js
        ├── index.html
        ├── jsconfig.json
        ├── package.json
        └── vite.config.js
```

---

## Getting Started

### Prerequisites
- **Node.js**
- **MongoDB Atlas** cluster (or local MongoDB instance)
- **Google Gemini API Key** from [Google AI Studio](https://google.com)

---

### 1. Backend Setup

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file inside `backend/` with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   COOKIE_NAME=arr_token
   CLIENT_ORIGIN=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-3.5-flash-lite
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API will run at `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal, navigate to the frontend directory, and install dependencies:
   ```bash
   cd frontend/AIResumeChecker
   npm install
   ```

2. Create a `.env` file inside `frontend/AIResumeChecker/` (if configuring the API URL via environment variables):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

---

## Available Scripts

### Backend (`backend/`)
- `npm run dev` — Start the Express server with `nodemon` hot-reloading
- `npm start` — Run the production server (`node src/server.js`)
- `npm run seed` — Populate the database with sample data (`node scripts/seed.js`)

### Frontend (`frontend/AIResumeChecker/`)
- `npm run dev` — Start the Vite development server
- `npm run build` — Build the production frontend bundle
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint across the frontend codebase

---

## API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check server status |
| `POST` | `/api/auth/register` | Create a new user account & set session cookie |
| `POST` | `/api/auth/login` | Log in & set HTTP-only JWT cookie |
| `POST` | `/api/auth/logout` | Clear authentication cookie |
| `GET` | `/api/auth/me` | Get current authenticated user |
| `PATCH` | `/api/auth/profile` | Update user name |
| `PATCH` | `/api/auth/password` | Change account password |
| `POST` | `/api/resumes` | Upload a PDF resume (`form-data` field: `file`) & parse sections |
| `GET` | `/api/resumes` | List all resumes for the logged-in user |
| `GET` | `/api/resumes/:id` | Get resume details and version list |
| `GET` | `/api/resumes/:id/versions/:versionId` | Fetch a specific resume version |
| `DELETE` | `/api/resumes/:id` | Delete a resume and all its versions |
| `POST` | `/api/resumes/:id/analyze` | Run AI ATS scoring & generate bullet rewrites |
| `GET` | `/api/resumes/:id/analyses` | List all analyses for a resume |
| `GET` | `/api/resumes/:id/versions/:versionId/analysis` | Get the latest analysis for a specific version |
| `POST` | `/api/resumes/:id/rewrite` | Apply selected rewrites to create a new version (`V2`, `V3`, etc.) |
| `GET` | `/api/resumes/:id/diff` | Compare text differences (`?from=<id>&to=<id>&mode=words\|lines`) |
| `GET` | `/api/dashboard` | Fetch dashboard KPIs, score progression, and recent activity |
| `GET` | `/api/insights` | Fetch aggregate ATS trends, top issues, and keyword analytics |
| `GET` | `/api/versions` | List all uploaded and rewritten versions across resumes |
| `GET` | `/api/history` | View full chronological event history |
