-- Migration: Chuẩn hóa bài đăng tuyển dụng Smart Job Studio & Bắt cặp ứng viên 2 chiều
-- Ngày tạo: 05/11/2026
-- Dự án: ProfileHub (Branch: profilehub_v1)

-- 1. Bổ sung các cột chuẩn hóa vào bảng recruiter_jobs
ALTER TABLE recruiter_jobs 
  ADD COLUMN IF NOT EXISTS workplace_type VARCHAR(20) DEFAULT 'on-site',
  ADD COLUMN IF NOT EXISTS experience_level VARCHAR(20) DEFAULT 'fresher',
  ADD COLUMN IF NOT EXISTS salary_min BIGINT,
  ADD COLUMN IF NOT EXISTS salary_max BIGINT,
  ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'VND',
  ADD COLUMN IF NOT EXISTS is_negotiable BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deadline_date DATE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Đánh chỉ mục Index tối ưu hóa truy vấn lọc dải lương, hình thức & cấp bậc
CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_salary 
  ON recruiter_jobs (salary_min, salary_max);

CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_experience 
  ON recruiter_jobs (experience_level);

CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_workplace 
  ON recruiter_jobs (workplace_type);

CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_status_deadline 
  ON recruiter_jobs (status, deadline_date);

-- 3. Đảm bảo ràng buộc toàn vẹn dữ liệu dải lương
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_job_salary_validity'
  ) THEN
    ALTER TABLE recruiter_jobs
      ADD CONSTRAINT chk_job_salary_validity
      CHECK (
        is_negotiable = TRUE OR 
        salary_min IS NULL OR 
        salary_max IS NULL OR 
        salary_max >= salary_min
      );
  END IF;
END $$;
