# REBUILD ARCHITECTURE PLAN (React + Node.js + Supabase)

## Objective

Refactor the entire PROFILEHUB codebase from its current mixed front-heavy / BaaS structure into a clean, decoupled, and maintainable architecture with strict separation between:

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router DOM v7
- **Backend**: Node.js + Supabase (PostgreSQL, RLS Policies, Database Functions/Triggers, Storage, Edge Functions / Node API)
- **Shared**: Centralized TypeScript DTOs, database types, validation schemas, and constants

The goal is to improve maintainability, AI collaboration efficiency, scalability, automated testing, and future migration possibilities without altering existing business logic or functionality.

---

# Core Rules

## Rule 1
Do NOT change business logic (Profile Hub AI recruitment, Student portfolio management, Teacher verification workflow, Recruiter pipeline Kanban).

## Rule 2
Do NOT create new features during this refactoring phase.

## Rule 3
Do NOT modify existing user flows or UI behavior.

## Rule 4
Focus strictly on:
- Code refactoring & modularization
- Standardized directory reorganization (`frontend/`, `backend/`, `shared/`)
- Dependency cleanup & unused code elimination
- Import path corrections via TypeScript aliases (`@frontend/*`, `@backend/*`, `@shared/*`)
- Architectural separation enforcing unidirectional boundaries

---

# Target Architecture & Technology Stack

```text
PROFILEHUB/
│
├── frontend/                          # React 19 + Vite Client Application
│   ├── src/
│   │   ├── app/                       # Application entry points & providers
│   │   ├── pages/                     # Route pages (Student, Teacher, Recruiter, Auth, Public)
│   │   ├── layouts/                   # Layout wrappers (Navbar, Sidebar, Footer)
│   │   ├── components/                # Reusable UI components & primitives
│   │   ├── features/                  # Feature modules (AI CV, AI Interview, Portfolio Match, Kanban)
│   │   ├── hooks/                     # Custom React hooks (useAuth, useKanban, useJobSync)
│   │   ├── stores/                    # Global client state management (Zustand / React Context)
│   │   ├── services/                  # Frontend API wrappers & Supabase client calls
│   │   ├── lib/                       # Third-party library integrations (lucide-react, react-to-print)
│   │   ├── utils/                     # Frontend UI helpers & export utilities (markdownExporter)
│   │   ├── assets/                    # Images, icons, static graphic files
│   │   ├── styles/                    # Global Tailwind CSS & custom styling
│   │   ├── constants/                 # UI constants & route path definitions
│   │   └── types/                     # Frontend specific component props & UI state types
│   ├── public/                        # Public assets & static icons
│   ├── package.json                   # React frontend dependencies
│   ├── vite.config.ts                 # Vite build configuration & path alias mapping
│   └── tsconfig.json                  # Frontend TypeScript configuration
│
├── backend/                           # Node.js + Supabase Backend Core
│   ├── database/                      # Database Schemas & Migrations
│   │   ├── migrations/                # SQL Migration scripts
│   │   ├── schemas/                   # SQL table schema definitions
│   │   ├── policies/                  # Supabase Row Level Security (RLS) policies
│   │   ├── triggers/                  # PostgreSQL database triggers & functions
│   │   ├── seeds/                     # Seed data for dev testing & initialization
│   │   └── README.md                  # Comprehensive DB sitemap & ERD documentation
│   ├── functions/                     # Supabase Edge Functions & Node.js Microservices
│   │   ├── auth/                      # Role verification & auth handlers
│   │   ├── users/                     # Student / Teacher / Recruiter profile management
│   │   ├── ai-cv/                     # AI CV analysis & summary generation
│   │   ├── ai-interview/              # AI Interview mock question & answer evaluation
│   │   ├── ai-recommendation/         # AI Student & Recruiter matching algorithm
│   │   ├── github/                    # GitHub API integration & repo scraper
│   │   └── shared/                    # Common backend utilities & Supabase Admin SDK helper
│   ├── services/                      # Node.js backend business logic services
│   ├── integrations/                  # Third-party APIs (OpenAI API, GitHub REST API, PDF Generators)
│   ├── storage/                       # Supabase Storage bucket configurations & policies
│   ├── config/                        # Node.js backend environment config & Supabase Client
│   └── utilities/                     # Backend loggers & error handling helpers
│
├── shared/                            # Shared Cross-Tier Modules
│   ├── dto/                           # Data Transfer Objects (Request/Response shapes)
│   ├── types/                         # Database models (database.ts, portfolioMatch.ts)
│   ├── validations/                   # Schema validation (Zod / Joi validation definitions)
│   ├── constants/                     # Shared system constants (Roles, Pipeline Stages)
│   └── utilities/                     # Pure data transformation functions (Pipeline Sync, Job Sync)
│
├── docs/                              # Project Documentation & Architecture Blueprint
│   ├── architecture/                  # System Architecture Specs
│   │   ├── frontend.md                # React architecture & design standards
│   │   ├── backend.md                 # Node.js & Supabase architecture breakdown
│   │   └── shared.md                  # Shared contract & boundary rules
│   ├── database/                      # Database ERD & Schema documentation
│   └── rebuildarchitecture.md         # Rebuild master plan
│
└── scripts/                           # Build, migration & deployment scripts
```

---

# Frontend Classification (React + Vite)

Move all frontend code to: `frontend/`

**Technologies & Libraries:**
- **Framework**: React 19 with Vite 8.3
- **Routing**: `react-router-dom` v7
- **Styling**: Tailwind CSS v4 + @tailwindcss/vite
- **UI Icons**: `lucide-react`
- **Utilities**: `qrcode.react`, `react-to-print`

**Classification Mapping:**
- React Pages (`src/pages/student/*`, `src/pages/teacher/*`, `src/pages/recruiter/*`) → `frontend/src/pages/`
- Navigation & Layouts (`src/components/Navbar.tsx`, `src/components/Footer.tsx`) → `frontend/src/layouts/`
- Shared React UI Components (`src/components/*`) → `frontend/src/components/`
- Custom React Hooks → `frontend/src/hooks/`
- Client Services (`src/services/*`) → `frontend/src/services/`
- Frontend Export Helpers (`src/utils/markdownExporter.ts`) → `frontend/src/utils/`

---

# Backend Classification (Node.js + Supabase)

Move all database and server-side code to: `backend/`

**Technologies & Platform:**
- **BaaS Platform**: Supabase Platform (`@supabase/supabase-js` v2)
- **Database Engine**: PostgreSQL with `uuid-ossp` extension
- **Security & Authorization**: Supabase Auth + PostgreSQL Row Level Security (RLS) policies
- **Server Services**: Node.js microservices & Supabase Edge Functions
- **Integrations**: GitHub API (`githubService.ts`), AI Engine (`aiCvService.ts`, `aiInterviewService.ts`, `aiRecruitmentService.ts`, `aiRecommendationService.ts`)

**Classification Mapping:**
- Database Schema files (`Database.txt`, `Database-Recruiter.sql`) → `backend/database/schemas/` & `backend/database/policies/`
- Supabase Initialization (`src/services/supabase.ts`) → `backend/config/supabaseClient.ts`
- AI Services & API Integration Services → `backend/functions/` & `backend/services/`
- Database Documentation → `backend/database/README.md`

---

# Shared Classification (TypeScript Contracts)

Move reusable cross-tier modules into: `shared/`

**Elements & Types:**
- Database Interface Definitions (`src/types/database.ts`) → `shared/types/database.ts`
- Portfolio Match Types (`src/types/portfolioMatch.ts`) → `shared/types/portfolioMatch.ts`
- Sync Utilities (`src/utils/jobSync.ts`, `src/utils/pipelineSync.ts`) → `shared/utilities/`
- System Enums & Roles (`Student`, `Teacher`, `Recruiter`, `discovered`, `contacted`, `interviewing`, `hired`) → `shared/constants/`

---

# Supabase Database & Security Refactor

For the Supabase layer:

Structure inside `backend/`:
```text
backend/
├── database/
│   ├── migrations/                  # Versioned database migration scripts
│   ├── schemas/                     # Core DDL tables (users, student_profiles, projects, skills, etc.)
│   ├── policies/                    # PostgreSQL RLS Security policies
│   ├── seeds/                       # Seed dataset for developers
│   └── README.md                    # Database documentation
└── functions/                       # Edge functions & API handlers
```

`backend/database/README.md` must document:
1. **Core Tables**: `users`, `student_profiles`, `achievements`, `certificates`, `projects`, `skills`, `project_skills`
2. **Recruiter Extension Tables**: `recruiter_jobs`, `recruiter_saved_candidates`, `recruiter_pipeline`
3. **Foreign Key Relationships & Cascades**
4. **Row Level Security (RLS) Policies**
5. **Indexes & Triggers**

---

# Dependency Cleanup & Alias Configuration

1. **Path Alias Mapping (`tsconfig.json` & `vite.config.ts`)**:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@frontend/*": ["./frontend/src/*"],
         "@backend/*": ["./backend/*"],
         "@shared/*": ["./shared/*"]
       }
     }
   }
   ```
2. **Import Fixing**: Update all component and service imports to reference clean aliases.
3. **Dead Code Elimination**: Audit and remove unused boilerplate files.
4. **Build Verification**: Run `npm run build` and `npm run lint` to guarantee 0 errors.

---

# AI Ownership Model & Responsibilities

- **Frontend AI Specialist (React + UI)**:
  - Scope: `frontend/**`
  - Responsibilities: React Components, Tailwind CSS Layouts, Route Pages, Client State & UX
- **Backend AI Specialist (Node.js + Supabase)**:
  - Scope: `backend/**`
  - Responsibilities: PostgreSQL Schemas, RLS Policies, Node.js API logic, Edge Functions, AI Services
- **Architecture AI Specialist (System & Shared)**:
  - Scope: `shared/**`, `docs/**`
  - Responsibilities: Cross-tier TypeScript contracts, API DTOs, System Specs, Refactor compliance

---

# Dependency Rules & Boundaries

**Allowed:**
- `frontend` → `shared`
- `backend` → `shared`

**Strictly Forbidden:**
- `frontend` → `backend` (Frontend must communicate with backend ONLY via API/Supabase Client contracts defined in shared)
- `backend` → `frontend`

---

# Action Deliverables Status

1. **Current Architecture Audit**: Completed - identified monolith `portfolio-web` structure needing tier separation.
2. **Refactor Plan**: Defined target directory layout for React, Node.js, and Supabase.
3. **New Folder Tree**: Generated complete directory specification.
4. **Import Fix Report**: Defined `@frontend/*`, `@backend/*`, and `@shared/*` alias mappings.
5. **Dependency Analysis**: Verified no circular dependencies exist between frontend UI and shared contracts.
6. **Final Validation**: Structure and documentation created and validated.