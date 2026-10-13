-- =============================================================================
-- ProfileHub - Sprint 1: Career core tables
-- Migration : 20260929000000_sprint1_career_core
-- Tables    : career_profiles, career_discovery_sessions, career_evidence,
--             leadership_signals, career_dna_assessments
-- Nguyên tắc: không DROP dữ liệu prod | idempotent | UUID PK | JSONB cho AI output
-- Rollback  : supabase/rollbacks/20260929000000_sprint1_career_core.down.sql
-- Giả định  : public.users(id uuid) đã tồn tại và users.id = auth.uid()
-- =============================================================================

BEGIN;

-- 0. Pre-check ---------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.users') IS NULL THEN
    RAISE EXCEPTION 'public.users chưa tồn tại - hãy chạy migration của bảng users trước';
  END IF;
END $$;

-- 1. Shared helper: updated_at ----------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

-- 2. career_profiles ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_profiles (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid NOT NULL UNIQUE
                           REFERENCES public.users(id) ON DELETE CASCADE,
  headline               text,
  industry               text,
  career_level           text
                           CHECK (career_level IN ('student','fresher','junior','middle','senior','manager','leader')),
  years_of_experience    numeric(4,1) CHECK (years_of_experience >= 0),
  current_role_title     text,
  target_role_title      text,
  summary                text,
  career_narrative       text,
  -- Output của Career Intelligence Engine (PRD mục 5)
  employability_score    numeric(5,2) CHECK (employability_score    BETWEEN 0 AND 100),
  trust_score            numeric(5,2) CHECK (trust_score            BETWEEN 0 AND 100),
  hiring_potential_score numeric(5,2) CHECK (hiring_potential_score BETWEEN 0 AND 100),
  ai_output              jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- 3. career_discovery_sessions ----------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_discovery_sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  career_profile_id uuid NOT NULL REFERENCES public.career_profiles(id) ON DELETE CASCADE,
  industry          text,
  career_level      text,
  status            text NOT NULL DEFAULT 'in_progress'
                      CHECK (status IN ('in_progress','completed','abandoned')),
  qa_history        jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{question, answer, asked_at}]
  ai_output         jsonb NOT NULL DEFAULT '{}'::jsonb,
  started_at        timestamptz NOT NULL DEFAULT now(),
  completed_at      timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- 4. career_evidence ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_evidence (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  career_profile_id   uuid NOT NULL REFERENCES public.career_profiles(id) ON DELETE CASCADE,
  session_id          uuid REFERENCES public.career_discovery_sessions(id) ON DELETE SET NULL,
  evidence_type       text NOT NULL
                        CHECK (evidence_type IN ('achievement','leadership','impact','growth')),
  title               text NOT NULL,
  description         text,
  metrics             jsonb NOT NULL DEFAULT '{}'::jsonb,  -- vd {"metric":"ROAS","from":2.1,"to":4.5}
  source_url          text,
  verification_status text NOT NULL DEFAULT 'unverified'
                        CHECK (verification_status IN ('unverified','pending','verified','rejected')),
  verified_at         timestamptz,
  occurred_at         date,
  ai_output           jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- 5. leadership_signals ------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leadership_signals (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  career_profile_id uuid NOT NULL REFERENCES public.career_profiles(id) ON DELETE CASCADE,
  session_id        uuid REFERENCES public.career_discovery_sessions(id) ON DELETE SET NULL,
  evidence_id       uuid REFERENCES public.career_evidence(id) ON DELETE SET NULL,
  signal_type       text NOT NULL,   -- vd: team_management, mentoring, decision_making
  description       text,
  strength_score    numeric(5,2) CHECK (strength_score BETWEEN 0 AND 100),
  ai_output         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- 6. career_dna_assessments --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_dna_assessments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  career_profile_id uuid NOT NULL REFERENCES public.career_profiles(id) ON DELETE CASCADE,
  session_id        uuid REFERENCES public.career_discovery_sessions(id) ON DELETE SET NULL,
  version           integer NOT NULL DEFAULT 1 CHECK (version > 0),
  is_current        boolean NOT NULL DEFAULT true,
  career_dna        jsonb NOT NULL DEFAULT '{}'::jsonb,
  strengths         jsonb NOT NULL DEFAULT '[]'::jsonb,
  career_narrative  text,
  scores            jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_output         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (career_profile_id, version)
);

-- Mỗi profile chỉ có tối đa 1 assessment "current"
CREATE UNIQUE INDEX IF NOT EXISTS uq_career_dna_current_per_profile
  ON public.career_dna_assessments (career_profile_id) WHERE is_current;

-- 7. Indexes -----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_cds_user            ON public.career_discovery_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_cds_profile         ON public.career_discovery_sessions (career_profile_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user       ON public.career_evidence (user_id);
CREATE INDEX IF NOT EXISTS idx_evidence_profile    ON public.career_evidence (career_profile_id, evidence_type);
CREATE INDEX IF NOT EXISTS idx_evidence_session    ON public.career_evidence (session_id);
CREATE INDEX IF NOT EXISTS idx_signals_user        ON public.leadership_signals (user_id);
CREATE INDEX IF NOT EXISTS idx_signals_profile     ON public.leadership_signals (career_profile_id);
CREATE INDEX IF NOT EXISTS idx_signals_evidence    ON public.leadership_signals (evidence_id);
CREATE INDEX IF NOT EXISTS idx_dna_user            ON public.career_dna_assessments (user_id);

-- 8. updated_at triggers -----------------------------------------------------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['career_profiles','career_discovery_sessions','career_evidence',
                           'leadership_signals','career_dna_assessments']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON public.%1$I', t);
    EXECUTE format('CREATE TRIGGER trg_%1$s_updated_at BEFORE UPDATE ON public.%1$I
                    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

-- 9. RLS ---------------------------------------------------------------------
-- Helper: career_profile_id phải thuộc về user hiện tại (chặn gắn dữ liệu vào profile người khác)
CREATE OR REPLACE FUNCTION public.owns_career_profile(p_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.career_profiles p
    WHERE p.id = p_profile_id AND p.user_id = auth.uid()
  );
$$;
REVOKE ALL ON FUNCTION public.owns_career_profile(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.owns_career_profile(uuid) TO authenticated;

ALTER TABLE public.career_profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_discovery_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_evidence            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_signals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_dna_assessments     ENABLE ROW LEVEL SECURITY;

-- career_profiles
DROP POLICY IF EXISTS career_profiles_select_own ON public.career_profiles;
DROP POLICY IF EXISTS career_profiles_insert_own ON public.career_profiles;
DROP POLICY IF EXISTS career_profiles_update_own ON public.career_profiles;
DROP POLICY IF EXISTS career_profiles_delete_own ON public.career_profiles;
CREATE POLICY career_profiles_select_own ON public.career_profiles
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY career_profiles_insert_own ON public.career_profiles
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY career_profiles_update_own ON public.career_profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY career_profiles_delete_own ON public.career_profiles
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- 4 bảng con: cùng một mẫu policy
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['career_discovery_sessions','career_evidence',
                           'leadership_signals','career_dna_assessments']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %1$s_select_own ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS %1$s_insert_own ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS %1$s_update_own ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS %1$s_delete_own ON public.%1$I', t);

    EXECUTE format('CREATE POLICY %1$s_select_own ON public.%1$I
      FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id)', t);
    EXECUTE format('CREATE POLICY %1$s_insert_own ON public.%1$I
      FOR INSERT TO authenticated
      WITH CHECK ((SELECT auth.uid()) = user_id AND public.owns_career_profile(career_profile_id))', t);
    EXECUTE format('CREATE POLICY %1$s_update_own ON public.%1$I
      FOR UPDATE TO authenticated
      USING ((SELECT auth.uid()) = user_id)
      WITH CHECK ((SELECT auth.uid()) = user_id AND public.owns_career_profile(career_profile_id))', t);
    EXECUTE format('CREATE POLICY %1$s_delete_own ON public.%1$I
      FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id)', t);
  END LOOP;
END $$;

-- Quyền bảng: anon không được đụng vào; authenticated bị RLS giới hạn
REVOKE ALL ON public.career_profiles, public.career_discovery_sessions, public.career_evidence,
              public.leadership_signals, public.career_dna_assessments FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.career_profiles, public.career_discovery_sessions,
      public.career_evidence, public.leadership_signals, public.career_dna_assessments TO authenticated;

-- 10. Mapping users -> career_profiles --------------------------------------
-- 10a. Trigger: user mới => tự tạo career_profile rỗng
CREATE OR REPLACE FUNCTION public.handle_new_user_career_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.career_profiles (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_users_create_career_profile ON public.users;
CREATE TRIGGER trg_users_create_career_profile
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_career_profile();

-- 10b. Backfill user hiện có (idempotent). Copy cột cùng tên nếu users có: headline, industry
DO $$
DECLARE
  cols_dst text := 'user_id';
  cols_src text := 'u.id';
  c text;
BEGIN
  FOREACH c IN ARRAY ARRAY['headline','industry']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_schema='public' AND table_name='users' AND column_name=c) THEN
      cols_dst := cols_dst || ', ' || quote_ident(c);
      cols_src := cols_src || ', u.' || quote_ident(c);
    END IF;
  END LOOP;

  EXECUTE format(
    'INSERT INTO public.career_profiles (%s) SELECT %s FROM public.users u
     ON CONFLICT (user_id) DO NOTHING', cols_dst, cols_src);
END $$;

COMMIT;
