-- =============================================================================
-- PROFILEHUB · Career Discovery Chat MVP
-- Tables: career_profiles, career_discovery_sessions, career_evidence
--
-- Nguyên tắc bảo mật:
--   * RLS bật trên mọi bảng; user chỉ được SELECT dữ liệu của chính mình.
--   * Mọi thao tác ghi đi qua Edge Function / Server (service_role) để employability_score,
--     career_dna, evidence... KHÔNG thể bị client tự sửa.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Helper: auto updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 1. career_profiles  (1 user = 1 profile, "live profile")
-- -----------------------------------------------------------------------------
create table if not exists public.career_profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references auth.users (id) on delete cascade,

  headline            text,
  career_summary      text,
  strengths           jsonb not null default '[]'::jsonb,
  career_dna          jsonb not null default '{}'::jsonb,
  employability_score smallint not null default 0
                      check (employability_score between 0 and 100),
  score_breakdown     jsonb not null default '[]'::jsonb,

  profile_data        jsonb not null default '{}'::jsonb,
  coverage            jsonb not null default '{}'::jsonb,

  last_session_id     uuid,
  summary_generated_at timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint career_profiles_strengths_is_array check (jsonb_typeof(strengths) = 'array'),
  constraint career_profiles_dna_is_object      check (jsonb_typeof(career_dna) = 'object')
);

create trigger trg_career_profiles_updated_at
  before update on public.career_profiles
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 2. career_discovery_sessions
-- -----------------------------------------------------------------------------
create table if not exists public.career_discovery_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,

  status           text not null default 'active'
                   check (status in ('active', 'completed', 'abandoned')),
  locale           text not null default 'vi' check (locale in ('vi', 'en')),

  messages         jsonb not null default '[]'::jsonb,
  extracted_data   jsonb not null default '{}'::jsonb,

  current_category text not null default 'career_context'
                   check (current_category in (
                     'career_context', 'achievement_discovery', 'impact_discovery',
                     'evidence_discovery', 'problem_solving', 'leadership',
                     'learning_ability', 'career_goal'
                   )),
  turn_count       integer not null default 0 check (turn_count >= 0),

  version          integer not null default 0,

  started_at       timestamptz not null default now(),
  last_message_at  timestamptz not null default now(),
  completed_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint sessions_messages_is_array check (jsonb_typeof(messages) = 'array'),
  constraint sessions_messages_max_len  check (jsonb_array_length(messages) <= 200)
);

create unique index if not exists uq_discovery_one_active_session_per_user
  on public.career_discovery_sessions (user_id)
  where status = 'active';

create index if not exists idx_discovery_sessions_user_created
  on public.career_discovery_sessions (user_id, created_at desc);

create trigger trg_discovery_sessions_updated_at
  before update on public.career_discovery_sessions
  for each row execute function public.set_updated_at();

alter table public.career_profiles
  drop constraint if exists career_profiles_last_session_fk;
alter table public.career_profiles
  add constraint career_profiles_last_session_fk
  foreign key (last_session_id) references public.career_discovery_sessions (id)
  on delete set null;

-- -----------------------------------------------------------------------------
-- 3. career_evidence
-- -----------------------------------------------------------------------------
create table if not exists public.career_evidence (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  session_id         uuid references public.career_discovery_sessions (id) on delete set null,

  type               text not null check (type in (
                       'metric_report', 'artifact', 'link', 'testimonial',
                       'certificate', 'award', 'publication', 'other'
                     )),
  title              text not null check (char_length(title) between 1 and 300),
  source             text not null default 'chat_claim'
                     check (source in ('chat_claim', 'url', 'file', 'integration')),

  verification_level text not null default 'self_claim'
                     check (verification_level in ('self_claim', 'has_artifact', 'third_party')),
  url                text check (url is null or url ~* '^https?://'),
  achievement_id     text,
  metadata           jsonb not null default '{}'::jsonb,

  dedupe_key         text not null,
  created_at         timestamptz not null default now(),

  constraint uq_career_evidence_dedupe unique (user_id, dedupe_key)
);

create index if not exists idx_career_evidence_user
  on public.career_evidence (user_id, created_at desc);

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.career_profiles            enable row level security;
alter table public.career_discovery_sessions  enable row level security;
alter table public.career_evidence            enable row level security;

drop policy if exists "career_profiles_select_own" on public.career_profiles;
create policy "career_profiles_select_own"
  on public.career_profiles for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "discovery_sessions_select_own" on public.career_discovery_sessions;
create policy "discovery_sessions_select_own"
  on public.career_discovery_sessions for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "career_evidence_select_own" on public.career_evidence;
create policy "career_evidence_select_own"
  on public.career_evidence for select
  to authenticated
  using (user_id = (select auth.uid()));

revoke insert, update, delete on public.career_profiles           from anon, authenticated;
revoke insert, update, delete on public.career_discovery_sessions from anon, authenticated;
revoke insert, update, delete on public.career_evidence           from anon, authenticated;
revoke all on public.career_profiles, public.career_discovery_sessions, public.career_evidence from anon;
