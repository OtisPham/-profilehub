-- =============================================================================
-- PROFILEHUB · Migration: RBAC, RLS & Candidate Privacy Controls
-- Date: 2026-11-05
-- Goals:
--   1. Thêm cột is_open_to_work & blocked_companies vào bảng student_profiles
--   2. Củng cố chính sách Row Level Security (RLS) cho candidate_pipeline & student_profiles
--   3. Đảm bảo dữ liệu tuyển dụng và thông tin ứng viên được bảo mật theo nguyên tắc RBAC
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. BẢNG STUDENT_PROFILES: CẬP NHẬT TRƯỜNG BẢO MẬT QUYỀN RIÊNG TƯ
-- -----------------------------------------------------------------------------
alter table if exists public.student_profiles
  add column if not exists is_open_to_work boolean not null default true,
  add column if not exists blocked_companies text[] not null default '{}';

-- Chỉ mục hỗ trợ truy vấn lọc ứng viên theo trạng thái sẵn sàng nhận việc
create index if not exists idx_student_profiles_open_to_work 
  on public.student_profiles (is_open_to_work);

-- Kích hoạt RLS cho student_profiles
alter table if exists public.student_profiles enable row level security;

-- Policies cho student_profiles
drop policy if exists "Profiles are viewable by everyone or when open to work" on public.student_profiles;
create policy "Profiles are viewable by everyone or when open to work"
  on public.student_profiles for select
  using (
    auth.uid() = id 
    or is_open_to_work = true 
    or auth.role() = 'authenticated'
  );

drop policy if exists "Users can update own student profile" on public.student_profiles;
create policy "Users can update own student profile"
  on public.student_profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own student profile" on public.student_profiles;
create policy "Users can insert own student profile"
  on public.student_profiles for insert
  with check (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 2. BẢNG CANDIDATE_PIPELINE: SIẾT CHẶT QUYỀN TRUY CẬP THEO VAI TRÒ
-- -----------------------------------------------------------------------------
alter table if exists public.candidate_pipeline enable row level security;

-- Recruiter chỉ xem đơn trong pipeline của mình; Ứng viên chỉ xem đơn của chính mình
drop policy if exists "Strict pipeline view permissions" on public.candidate_pipeline;
create policy "Strict pipeline view permissions"
  on public.candidate_pipeline for select
  using (
    auth.uid()::text = recruiter_id 
    or auth.uid()::text = student_id
  );

-- Chỉ Recruiter phụ trách hoặc Ứng viên nộp đơn mới được phép ghi vào pipeline
drop policy if exists "Strict pipeline insert permissions" on public.candidate_pipeline;
create policy "Strict pipeline insert permissions"
  on public.candidate_pipeline for insert
  with check (
    auth.uid()::text = recruiter_id 
    or auth.uid()::text = student_id
  );

-- Cập nhật stage phỏng vấn: Recruiter hoặc Ứng viên (xác nhận lịch phỏng vấn)
drop policy if exists "Strict pipeline update permissions" on public.candidate_pipeline;
create policy "Strict pipeline update permissions"
  on public.candidate_pipeline for update
  using (
    auth.uid()::text = recruiter_id 
    or auth.uid()::text = student_id
  );

-- Xóa ứng viên khỏi pipeline: Chỉ Recruiter sở hữu pipeline đó
drop policy if exists "Strict pipeline delete permissions" on public.candidate_pipeline;
create policy "Strict pipeline delete permissions"
  on public.candidate_pipeline for delete
  using (auth.uid()::text = recruiter_id);

-- -----------------------------------------------------------------------------
-- 3. BẢNG JOBS: BẢO VỆ TIN TUYỂN DỤNG CỦA DOANH NGHIỆP
-- -----------------------------------------------------------------------------
alter table if exists public.jobs enable row level security;

-- Mọi người dùng đều có thể đọc tin tuyển dụng đang hoạt động
drop policy if exists "Active jobs viewable by all" on public.jobs;
create policy "Active jobs viewable by all"
  on public.jobs for select
  using (status = 'active' or auth.uid()::text = recruiter_id);

-- Recruiter chỉ được sửa tin tuyển dụng của chính mình
drop policy if exists "Recruiters update own jobs only" on public.jobs;
create policy "Recruiters update own jobs only"
  on public.jobs for update
  using (auth.uid()::text = recruiter_id);

-- Recruiter chỉ được xóa tin tuyển dụng của chính mình
drop policy if exists "Recruiters delete own jobs only" on public.jobs;
create policy "Recruiters delete own jobs only"
  on public.jobs for delete
  using (auth.uid()::text = recruiter_id);
