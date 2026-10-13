# 01 — Supabase Database Migration & TypeScript Interfaces for Mock Interviews

**What to build:** Create the `mock_interviews` table structure/migration SQL in Supabase and define TypeScript interfaces (`MockInterviewSession`, `MockInterviewMessage`, `BlindSpotReport`, `BlindSpotItem`) in `portfolio-web/src/types/mockInterview.ts`.

**Blocked by:** None — can start immediately.

**Status:** completed

- [x] Create SQL migration for `mock_interviews` table with columns: `id`, `student_id`, `topic`, `level`, `jd_content`, `status`, `overall_score`, `messages` (jsonb), `report` (jsonb), `created_at`, `updated_at`.
- [x] Define TypeScript interfaces and type guards in `portfolio-web/src/types/mockInterview.ts`.
- [x] Implement Supabase repository functions (`createSession`, `updateSessionMessages`, `completeSessionWithReport`, `fetchStudentSessions`, `fetchSessionById`).
