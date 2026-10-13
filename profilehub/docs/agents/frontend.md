# Frontend Architecture Specification (React 19 + TypeScript + Vite)

## 1. Stack & Technologies

- **UI Library / Framework**: React 19 (`react`, `react-dom`)
- **Build Tool & Bundler**: Vite 8.3 (`@vitejs/plugin-react`)
- **Routing**: React Router DOM 7 (`react-router-dom`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `tailwindcss`)
- **Iconography**: Lucide React (`lucide-react`)
- **Utilities**: `qrcode.react`, `react-to-print`
- **Type Checking**: TypeScript 6.0 (`@types/react`, `@types/react-dom`, `@types/node`)

---

## 2. Directory Structure (`frontend/`)

```text
frontend/
├── src/
│   ├── app/                      # Main App wrapper & Providers (AuthProvider, Router)
│   ├── pages/                    # Route Page components
│   │   ├── student/              # Student dashboard, CV builder, AI interview, achievements, jobs
│   │   ├── teacher/              # Teacher verification inbox & student review
│   │   └── recruiter/            # Recruiter dashboard, candidate Kanban pipeline, job posts
│   ├── layouts/                  # App shell, Navigation bar, Sidebar, Footer wrappers
│   ├── components/               # Reusable atomic UI components (Modal, Button, Card, Badge)
│   ├── features/                 # Modular domain features
│   ├── hooks/                    # Custom React Hooks
│   ├── stores/                   # State management
│   ├── services/                 # Supabase client wrapper & frontend API services
│   ├── utils/                    # UI export helpers (Markdown, PDF, formatting)
│   ├── assets/                   # Images, SVGs, static files
│   └── styles/                   # Tailwind imports & CSS variables
├── public/                       # Public static assets
├── index.html                    # Single Page Application HTML template
├── vite.config.ts                # Vite config & `@frontend/*`, `@shared/*` aliases
└── package.json                  # Frontend dependencies
```

---

## 3. Core Modules & Responsibilities

### Pages & Role-based Routing
- **Student Module** (`pages/student/`):
  - `Dashboard.tsx`: Main student dashboard overview.
  - `MyProfile.tsx` & `CVBuilder.tsx`: Student bio, skills, and interactive CV builder.
  - `AIInterviewPrep.tsx`: AI-driven mock interview simulation interface.
  - `MyProjects.tsx` & `MyAchievements.tsx`: Project showcase and certificate management.
  - `StudentJobs.tsx` & `PortfolioMatchPage.tsx`: Job browsing and AI portfolio matching score.
- **Teacher Module** (`pages/teacher/`):
  - `TeacherProfile.tsx`: Teacher bio and credentials.
  - `VerificationInbox.tsx`: Review and verify student projects and achievements.
- **Recruiter Module** (`pages/recruiter/`):
  - `RecruiterDashboard.tsx`: Job management & applicant pipeline (Kanban view).
  - `RecruiterProfile.tsx`: Company & recruiter settings.
  - `SavedCandidates.tsx`: Candidate bookmarking & folder management.

### Services Layer (`services/`)
- Encapsulates network calls to backend services and Supabase client SDK:
  - `aiCvService.ts`: Invokes AI CV parsing & generation services.
  - `aiInterviewService.ts`: Handles interview prompt exchanges.
  - `aiRecruitmentService.ts`: Evaluates student fit for job descriptions.
  - `portfolioMatchService.ts`: Calculates match vector between student skills and job requirements.
  - `verificationService.ts`: Submits verification requests to teachers.

---

## 4. Architectural Rules for Frontend

1. **No Direct Backend Database Mutations**: Frontend components MUST call services or Supabase client helpers, never raw unvalidated SQL.
2. **Type Safety**: All components must use shared contracts from `@shared/types/database`.
3. **Alias Usage**: Use `@frontend/components/...` and `@shared/types/...` imports instead of deep relative paths (`../../..`).
