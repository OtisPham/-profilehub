-- =====================================================================
-- ProfileHub Core System Database Migration
-- Tables: users, student_profiles, projects, certificates,
--         achievements, recruiter_jobs, recruiter_pipeline, interview_feedbacks
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'recruiter')) NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STUDENT PROFILES
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

-- 3. PROJECTS
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

-- 4. CERTIFICATES
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

-- 5. ACHIEVEMENTS
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

-- 6. RECRUITER JOBS
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

-- 7. RECRUITER PIPELINE
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

-- 8. INTERVIEW FEEDBACKS
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

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_feedbacks ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Projects viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Students can insert their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their own unverified projects" ON public.projects FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Teachers can verify projects" ON public.projects FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'teacher')
);

-- Recruiter jobs policies
CREATE POLICY "Jobs viewable by everyone" ON public.recruiter_jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Recruiters manage own jobs" ON public.recruiter_jobs FOR ALL USING (auth.uid() = recruiter_id);

-- Recruiter pipeline policies
CREATE POLICY "Recruiters manage own pipeline" ON public.recruiter_pipeline FOR ALL USING (auth.uid() = recruiter_id);

-- Interview feedbacks policies
CREATE POLICY "Recruiters can insert feedback" ON public.interview_feedbacks FOR INSERT WITH CHECK (auth.uid() = recruiter_id);
CREATE POLICY "Students can view feedback given to them" ON public.interview_feedbacks FOR SELECT USING (auth.uid() = student_id OR auth.uid() = recruiter_id);
