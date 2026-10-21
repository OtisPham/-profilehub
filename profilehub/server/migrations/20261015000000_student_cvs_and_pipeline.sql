-- =============================================================================
-- PROFILEHUB · Complete Cloud Database Migration for CVs, Jobs & Pipeline
-- Tự động tạo đầy đủ các bảng nếu chưa có:
--   1. public.jobs
--   2. public.candidate_pipeline
--   3. public.student_cvs
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. BẢNG JOBS (Tin tuyển dụng việc làm)
-- -----------------------------------------------------------------------------
create table if not exists public.jobs (
  id              text primary key default ('job_' || extract(epoch from now())::bigint),
  recruiter_id    text not null default 'rec1',
  title           text not null,
  department      text default 'Công nghệ thông tin',
  location        text default 'TP. Hồ Chí Minh',
  required_skills text[] default '{}',
  description     text,
  status          text default 'active',
  created_at      timestamptz default now()
);

-- Bật RLS cho jobs
alter table public.jobs enable row level security;

-- Policy: Mọi người dùng đã đăng nhập hoặc khách đều được xem tin tuyển dụng
drop policy if exists "Anyone can view active jobs" on public.jobs;
create policy "Anyone can view active jobs"
  on public.jobs for select
  using (true);

drop policy if exists "Recruiters can insert jobs" on public.jobs;
create policy "Recruiters can insert jobs"
  on public.jobs for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Recruiters can update own jobs" on public.jobs;
create policy "Recruiters can update own jobs"
  on public.jobs for update
  using (auth.uid()::text = recruiter_id);

-- -----------------------------------------------------------------------------
-- 2. BẢNG CANDIDATE_PIPELINE (Đơn ứng tuyển & Pipeline tuyển dụng)
-- -----------------------------------------------------------------------------
create table if not exists public.candidate_pipeline (
  id                 text primary key,
  recruiter_id       text not null,
  student_id         text not null,
  job_id             text,
  stage              text not null default 'discovered',
  private_notes      text,
  interview_date     text,
  interview_time     text,
  meeting_link       text,
  interview_location text,
  interview_status   text default 'pending_student',
  cv_id              text,
  cv_data            jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Thêm các cột cv_id và cv_data nếu bảng đã tồn tại từ trước mà thiếu cột
alter table public.candidate_pipeline
  add column if not exists cv_id text,
  add column if not exists cv_data jsonb;

-- Bật RLS cho candidate_pipeline
alter table public.candidate_pipeline enable row level security;

drop policy if exists "Students can view own applications" on public.candidate_pipeline;
create policy "Students can view own applications"
  on public.candidate_pipeline for select
  using (auth.uid()::text = student_id or auth.uid()::text = recruiter_id);

drop policy if exists "Students can apply" on public.candidate_pipeline;
create policy "Students can apply"
  on public.candidate_pipeline for insert
  with check (auth.uid()::text = student_id or auth.role() = 'authenticated');

drop policy if exists "Recruiters can update pipeline" on public.candidate_pipeline;
create policy "Recruiters can update pipeline"
  on public.candidate_pipeline for update
  using (auth.uid()::text = recruiter_id or auth.uid()::text = student_id);

-- -----------------------------------------------------------------------------
-- 3. BẢNG STUDENT_CVS (Đồng bộ lưu trữ Multi-CV của Sinh viên trên Cloud)
-- -----------------------------------------------------------------------------
create table if not exists public.student_cvs (
  id           text primary key,
  user_id      uuid not null references auth.users (id) on delete cascade,
  title        text not null default 'CV Mới',
  target_role  text not null default 'Kỹ Sư Phần Mềm',
  is_default   boolean not null default false,
  cv_data      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Chỉ mục tối ưu
create index if not exists idx_student_cvs_user_id on public.student_cvs (user_id);
create index if not exists idx_student_cvs_updated_at on public.student_cvs (updated_at desc);

-- Trigger tự động cập nhật updated_at
create or replace function public.set_student_cvs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_student_cvs_updated_at on public.student_cvs;
create trigger trg_student_cvs_updated_at
  before update on public.student_cvs
  for each row execute function public.set_student_cvs_updated_at();

-- Bật RLS cho student_cvs
alter table public.student_cvs enable row level security;

-- Policies cho Sinh viên
drop policy if exists "Students can view own CVs" on public.student_cvs;
create policy "Students can view own CVs"
  on public.student_cvs for select
  using (auth.uid() = user_id);

drop policy if exists "Students can insert own CVs" on public.student_cvs;
create policy "Students can insert own CVs"
  on public.student_cvs for insert
  with check (auth.uid() = user_id);

drop policy if exists "Students can update own CVs" on public.student_cvs;
create policy "Students can update own CVs"
  on public.student_cvs for update
  using (auth.uid() = user_id);

drop policy if exists "Students can delete own CVs" on public.student_cvs;
create policy "Students can delete own CVs"
  on public.student_cvs for delete
  using (auth.uid() = user_id);

-- Cho phép Nhà tuyển dụng đọc CV nếu ứng viên đã ứng tuyển trong candidate_pipeline
drop policy if exists "Recruiters can view applicant CVs" on public.student_cvs;
create policy "Recruiters can view applicant CVs"
  on public.student_cvs for select
  using (
    exists (
      select 1 from public.candidate_pipeline cp
      where cp.cv_id = public.student_cvs.id
        and cp.recruiter_id = auth.uid()::text
    )
  );

-- Insert dữ liệu mẫu vào jobs nếu bảng còn trống để sinh viên có việc ứng tuyển ngay
insert into public.jobs (id, recruiter_id, title, department, location, required_skills, description, status)
values
  ('job_sample_1', 'rec1', 'Thực tập sinh Frontend ReactJS / TypeScript', 'Công nghệ thông tin', 'TP. Hồ Chí Minh', ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Git'], 'Tham gia phát triển ứng dụng Web hiệu năng cao, tối ưu hóa giao diện người dùng và làm việc trong môi trường Agile chuyên nghiệp.', 'active'),
  ('job_sample_2', 'rec1', 'Thực tập sinh Backend Node.js & Cloud', 'Hệ thống & Đám mây', 'Hà Nội / Remote', ARRAY['Node.js', 'Express', 'PostgreSQL', 'Docker'], 'Thiết kế RESTful API, tối ưu truy vấn cơ sở dữ liệu và triển khai microservices cơ bản.', 'active')
on conflict (id) do nothing;
