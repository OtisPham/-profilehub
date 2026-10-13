# 🗄️ Database Schema Specification — ProfileHub Core System

## 1. Overview
Hệ thống sử dụng cơ sở dữ liệu quan hệ PostgreSQL (Supabase) với 8 bảng core.

## 2. Core Tables Specification

### 2.1 `users`
Bảng định danh người dùng trong hệ sinh thái ProfileHub.
```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'recruiter')) NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.2 `student_profiles`
Hồ sơ học thuật chi tiết của sinh viên.
```sql
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  major TEXT,
  university TEXT,
  gpa TEXT,
  skills TEXT[] DEFAULT '{}'::TEXT[],
  username TEXT UNIQUE,
  qr_code_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.3 `projects`
Đồ án / Dự án môn học của sinh viên.
```sql
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  project_type TEXT,
  score TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  teacher_feedback TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  role TEXT,
  team_size TEXT,
  instructor TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.4 `certificates` & `achievements`
Chứng chỉ và giải thưởng của người dùng.
```sql
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  category TEXT,
  date_awarded TEXT,
  rank TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT,
  date_awarded TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.5 `recruiter_jobs`
Tin tuyển dụng của doanh nghiệp.
```sql
CREATE TABLE IF NOT EXISTS public.recruiter_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  required_skills TEXT[] DEFAULT '{}'::TEXT[],
  description TEXT,
  status TEXT CHECK (status IN ('active', 'closed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.6 `recruiter_pipeline`
Quản lý luồng tuyển dụng ứng viên (Kanban).
```sql
CREATE TABLE IF NOT EXISTS public.recruiter_pipeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.recruiter_jobs(id) ON DELETE SET NULL,
  stage TEXT CHECK (stage IN ('discovered', 'shortlisted', 'contacted', 'interview', 'hired')) DEFAULT 'discovered',
  private_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.7 `interview_feedbacks`
Phản hồi phỏng vấn thực tế từ nhà tuyển dụng.
```sql
CREATE TABLE IF NOT EXISTS public.interview_feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recruiter_name TEXT,
  company_name TEXT,
  student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.recruiter_jobs(id) ON DELETE SET NULL,
  technical_score INT CHECK (technical_score BETWEEN 1 AND 10),
  soft_skills_score INT CHECK (soft_skills_score BETWEEN 1 AND 10),
  recruiter_comment TEXT NOT NULL,
  blind_spots TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
