-- ==============================================================================
-- Migration: 20261105100000_enterprise_tax_verification.sql
-- Mục đích: Bổ sung xác thực Mã Số Thuế (MST) doanh nghiệp & Tích Xanh Uy Tín (Verified Enterprise)
-- Chuẩn áp dụng: Thông tư 105/2020/TT-BTC & Phòng chống mạo danh nhân sự
-- ==============================================================================

-- 1. Thêm các cột xác thực pháp nhân cho bảng recruiter_profiles
ALTER TABLE IF EXISTS recruiter_profiles
  ADD COLUMN IF NOT EXISTS tax_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS is_tax_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS tax_legal_name TEXT,
  ADD COLUMN IF NOT EXISTS tax_registered_address TEXT,
  ADD COLUMN IF NOT EXISTS tax_verification_status VARCHAR(30) DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS tax_verification_tier VARCHAR(20) DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS tax_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS work_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS is_work_email_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS tax_lookup_payload JSONB;

-- 2. Chỉ mục tối ưu tra cứu và bảo vệ chống trùng lặp MST được xác thực
CREATE INDEX IF NOT EXISTS idx_recruiter_tax_code ON recruiter_profiles(tax_code);
CREATE INDEX IF NOT EXISTS idx_recruiter_is_tax_verified ON recruiter_profiles(is_tax_verified);
CREATE INDEX IF NOT EXISTS idx_recruiter_tax_verification_tier ON recruiter_profiles(tax_verification_tier);

-- 3. Bổ sung trường kế thừa Tích Xanh cho bảng jobs
ALTER TABLE IF EXISTS jobs
  ADD COLUMN IF NOT EXISTS is_tax_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS tax_verification_tier VARCHAR(20) DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS tax_code VARCHAR(20);

-- 4. Chính sách bảo mật Row Level Security (RLS)
-- Chỉ chính chủ tài khoản Recruiter mới có quyền cập nhật thông tin MST của mình
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recruiter_profiles' 
      AND policyname = 'Recruiters can update own tax verification'
  ) THEN
    CREATE POLICY "Recruiters can update own tax verification" 
    ON recruiter_profiles 
    FOR UPDATE 
    TO authenticated 
    USING (id = auth.uid()) 
    WITH CHECK (id = auth.uid());
  END IF;
END $$;
