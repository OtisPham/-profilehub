# Supabase Database Documentation & Schema Reference

## Database Overview

- **Engine**: PostgreSQL (Supabase BaaS)
- **Extensions Used**: `uuid-ossp` (for `uuid_generate_v4()`)
- **Primary Schema**: `public`

---

## Tables & Schemas

### 1. `public.users`
Primary account directory table linked with Supabase Auth (`auth.users`).
- `id` (UUID, Primary Key)
- `email` (TEXT, Unique, NOT NULL)
- `full_name` (TEXT, NOT NULL)
- `avatar_url` (TEXT)
- `role` (TEXT, Default: `'student'`, CHECK: `role IN ('student', 'recruiter', 'teacher')`)
- `bio` (TEXT)
- `created_at` (TIMESTAMPTZ, Default: `now()`)

---

### 2. `public.student_profiles`
Detailed profile attributes for student role users.
- `id` (UUID, Primary Key, Foreign Key -> `auth.users(id)` ON DELETE CASCADE)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `major` (TEXT)
- `university` (TEXT)
- `gpa` (TEXT)
- `skills` (TEXT[], Default: `'{}'`)
- `updated_at` (TIMESTAMPTZ, Default: `now()`)

---

### 3. `public.projects`
Student portfolio project entries.
- `id` (UUID, Primary Key, Default: `uuid_generate_v4()`)
- `student_id` (UUID, Foreign Key -> `public.users(id)` ON DELETE CASCADE)
- `title` (TEXT, NOT NULL)
- `description` (TEXT)
- `thumbnail_url` (TEXT)
- `demo_url` (TEXT)
- `github_url` (TEXT)
- `project_type` (TEXT)
- `score` (TEXT)
- `is_verified` (BOOLEAN, Default: `false`)
- `role` (TEXT)
- `team_size` (TEXT)
- `instructor` (TEXT)
- `tags` (TEXT[], Default: `'{}'`)
- `image_url` (TEXT)
- `created_at` (TIMESTAMPTZ, Default: `now()`)

---

### 4. `public.skills` & `public.project_skills`
Skills master directory and project-skill association.
- `skills`: `id` (UUID, PK), `name` (TEXT, Unique), `category` (TEXT), `created_at` (TIMESTAMPTZ)
- `project_skills`: Composite PK (`project_id`, `skill_id`) referencing `public.projects(id)` and `public.skills(id)`

---

### 5. `public.achievements` & `public.certificates`
Student honors, awards, and certificates.
- `achievements`: `id` (PK), `user_id` (FK -> `auth.users`), `title`, `category`, `level`, `date_awarded`, `description`, `is_featured`, `verified`, `image_url`, `created_at`
- `certificates`: `id` (PK), `user_id` (FK -> `auth.users`), `title`, `issuer`, `category`, `date_awarded`, `rank`, `description`, `is_featured`, `image_url`, `created_at`

---

### 6. `public.recruiter_jobs`
Job openings created by recruiters.
- `id` (UUID, Primary Key, Default: `uuid_generate_v4()`)
- `recruiter_id` (UUID, Foreign Key -> `public.users(id)` ON DELETE CASCADE)
- `title` (TEXT, NOT NULL)
- `department` (TEXT)
- `location` (TEXT)
- `required_skills` (TEXT[], Default: `'{}'`)
- `description` (TEXT)
- `status` (TEXT, Default: `'active'`)
- `created_at` (TIMESTAMPTZ, Default: `now()`)

---

### 7. `public.recruiter_saved_candidates`
Recruiter candidate bookmarks organized into folder categories.
- `id` (UUID, Primary Key, Default: `uuid_generate_v4()`)
- `recruiter_id` (UUID, Foreign Key -> `public.users(id)` ON DELETE CASCADE)
- `student_id` (UUID, Foreign Key -> `public.users(id)` ON DELETE CASCADE)
- `folder_name` (TEXT, Default: `'Ứng viên tiềm năng'`)
- `created_at` (TIMESTAMPTZ, Default: `now()`)

---

### 8. `public.recruiter_pipeline`
Recruitment Kanban pipeline entries tracking candidate stages.
- `id` (UUID, Primary Key, Default: `uuid_generate_v4()`)
- `recruiter_id` (UUID, Foreign Key -> `public.users(id)` ON DELETE CASCADE)
- `student_id` (UUID, Foreign Key -> `public.users(id)` ON DELETE CASCADE)
- `job_id` (UUID, Foreign Key -> `public.recruiter_jobs(id)` ON DELETE SET NULL)
- `stage` (TEXT, Default: `'discovered'`)
- `private_notes` (TEXT)
- `created_at` (TIMESTAMPTZ, Default: `now()`)
- `updated_at` (TIMESTAMPTZ, Default: `now()`)

---

## Row Level Security (RLS) Policies

RLS is enabled on all tables:
```sql
ALTER TABLE public.recruiter_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_saved_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_pipeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to recruiter_jobs" ON public.recruiter_jobs FOR ALL USING (true);
CREATE POLICY "Allow full access to recruiter_saved_candidates" ON public.recruiter_saved_candidates FOR ALL USING (true);
CREATE POLICY "Allow full access to recruiter_pipeline" ON public.recruiter_pipeline FOR ALL USING (true);
```
*(Note: Production policies should restrict writes to `auth.uid() = recruiter_id`)*.
## Extended Tables (PRD v2.0 Alignment)

### career_profiles
Lưu Career DNA, strengths, weaknesses, career summary, employability score, trust score.

### career_discovery_sessions
Lưu transcript các phiên AI Career Discovery.

### career_dna_assessments
Đánh giá Career DNA (Builder, Leader, Operator, Strategist, Analyst, Creator).

### career_evidence
Bằng chứng năng lực (achievement, leadership, impact, growth).

### leadership_signals
Tín hiệu lãnh đạo (mentoring, team leading, training).

### mock_interviews
Phiên phỏng vấn giả lập, transcript, scoring, feedback.

### portfolio_match_histories
Lịch sử tính toán Match Score giữa hồ sơ và JD.

### raw_answers
Lưu câu trả lời thô từ user trong Discovery/Interview.

### experiences
Kinh nghiệm làm việc, vị trí, thời gian, mô tả.

### generated_cvs
Các CV được AI sinh ra (ATS, Recruiter, Manager, Executive).

---

## RLS Policies Reminder
- Bổ sung RLS cho các bảng mới, đảm bảo `auth.uid()` khớp với `user_id` hoặc `recruiter_id`.
- Kiểm tra lại các bảng đang **UNRESTRICTED** và siết policy trước khi production.


<!-- Nối đoạn này vào README.md của repo -->

## Database & Migrations (Supabase)

Migration nằm trong `supabase/migrations/`, rollback trong `supabase/rollbacks/`.
Chi tiết schema, RLS và kịch bản kiểm thử: [`docs/database/migrations.md`](docs/database/migrations.md).

```bash
supabase start && supabase db reset        # chạy toàn bộ migration trên DB local
supabase link --project-ref <PROJECT_REF>
supabase db push --dry-run && supabase db push   # đẩy lên Supabase
```

Rollback Sprint 1 (bị chặn nếu bảng đã có dữ liệu):

```bash
psql "$DATABASE_URL" -f supabase/rollbacks/20260929000000_sprint1_career_core.down.sql
```

Nguyên tắc: không xóa dữ liệu production · ưu tiên `ALTER TABLE` · migration phải rollback được · UUID PK · JSONB cho AI output.