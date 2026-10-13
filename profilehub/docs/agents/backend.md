# Backend Architecture Specification (Node.js + Supabase)

## 1. Stack & Technologies

- **Backend Platform**: Supabase BaaS + Node.js Microservices / Edge Functions
- **Database Engine**: PostgreSQL 15+ (with `uuid-ossp` extension)
- **Authentication**: Supabase Auth (JWT, Role-Based Access Control)
- **Security**: PostgreSQL Row Level Security (RLS) policies
- **Database SDK**: `@supabase/supabase-js` v2
- **Integrations**: GitHub REST API, OpenAI / Gemini AI API for CV & Interview processing

---

## 2. Directory Structure (`backend/`)

```text
backend/
├── database/
│   ├── schemas/                  # PostgreSQL DDL table creation scripts
│   │   ├── 01_users.sql
│   │   ├── 02_student_profiles.sql
│   │   ├── 03_projects_and_skills.sql
│   │   └── 04_recruiter_tables.sql
│   ├── policies/                 # Row Level Security (RLS) policies
│   ├── migrations/               # Versioned migration files
│   ├── seeds/                    # Seed data for local & dev testing
│   └── README.md                 # Complete Database & Schema Documentation
├── functions/                    # Node.js Edge Functions / API handlers
│   ├── ai-cv/                    # AI CV generation & parsing logic
│   ├── ai-interview/             # AI Interview mock question evaluator
│   ├── ai-recommendation/        # Candidate-to-Job match engine
│   ├── github/                   # GitHub user repo verification integration
│   └── shared/                   # Common backend helpers & Supabase Service Role client
├── services/                     # Node.js domain business logic handlers
├── config/                       # Supabase client config & environment variables
└── utilities/                    # Logger, Error handlers, Data sanitizers
```

---

## 3. Database Schema Overview

### Core Tables
1. `public.users`: Core identity table with role constraints (`student`, `teacher`, `recruiter`).
2. `public.student_profiles`: Extended profile metadata for students (major, GPA, skills array).
3. `public.projects`: Student portfolio projects with tags, github links, verification status, and instructor info.
4. `public.skills`: Centralized master skills catalog.
5. `public.project_skills`: Junction table binding projects to skills.
6. `public.achievements`: Academic & competition awards.
7. `public.certificates`: Verified certificates & credentials.

### Recruiter Extension Tables
8. `public.recruiter_jobs`: Job vacancy listings posted by recruiters.
9. `public.recruiter_saved_candidates`: Bookmarked candidate profiles grouped into custom folders.
10. `public.recruiter_pipeline`: Recruitment Kanban pipeline tracking candidates across stages (`discovered`, `contacted`, `interviewing`, `hired`).

---

## 4. Row Level Security (RLS) & Policies

All tables in the `public` schema have RLS enabled:
- **Student Data**: Users can read public profiles; update permissions are restricted to the owner (`auth.uid() = user_id`).
- **Verification Workflow**: Teachers can read and update verification flags (`is_verified`) on student projects and achievements.
- **Recruiter Pipeline**: Recruiters have isolation over their job posts, candidate bookmarks, and pipeline stages.

---

## 5. Architectural Rules for Backend

1. **Strict Boundary**: Backend modules must only consume `@shared` contracts and models. Backend code MUST NEVER import React components or UI libraries.
2. **Security First**: Database operations must enforce RLS or run through verified Node.js/Edge Function endpoints with service role authentication checks.
3. **Idempotency**: All DB migrations and schema DDLs must include `IF NOT EXISTS` guards.
