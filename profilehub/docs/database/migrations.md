# Database Migrations – ProfileHub

## Nguyên tắc

1. Không xóa dữ liệu production.
2. Ưu tiên `ALTER TABLE`, không `DROP TABLE` trên bảng có dữ liệu.
3. Mọi migration phải rollback được.
4. UUID làm khóa chính (`gen_random_uuid()`).
5. Dùng `JSONB` cho AI output.

## Sprint 1 – `20260929000000_sprint1_career_core`

| File | Vai trò |
|---|---|
| `supabase/migrations/20260929000000_sprint1_career_core.sql` | Migration (up) |
| `supabase/rollbacks/20260929000000_sprint1_career_core.down.sql` | Rollback (down) |

**Điều kiện tiên quyết:** `public.users(id uuid)` đã tồn tại và `users.id = auth.uid()`.
Migration sẽ báo lỗi rõ ràng nếu thiếu bảng `users`.

### Schema

```
users 1──1 career_profiles 1──* career_discovery_sessions
                 │                     │
                 ├──* career_evidence ◄┤ (session_id, nullable)
                 │        ▲
                 ├──* leadership_signals (evidence_id, session_id nullable)
                 └──* career_dna_assessments (session_id nullable, versioned)
```

| Bảng | Mục đích | JSONB |
|---|---|---|
| `career_profiles` | Hồ sơ nghề nghiệp 1–1 với user; chứa Employability / Trust / Hiring Potential score | `ai_output` |
| `career_discovery_sessions` | Phiên Career Discovery Engine | `qa_history`, `ai_output` |
| `career_evidence` | Bằng chứng: `achievement`, `leadership`, `impact`, `growth` + trạng thái xác minh | `metrics`, `ai_output` |
| `leadership_signals` | Tín hiệu lãnh đạo, có `strength_score` 0–100 | `ai_output` |
| `career_dna_assessments` | Career DNA có version; chỉ 1 bản `is_current` mỗi profile | `career_dna`, `strengths`, `scores`, `ai_output` |

Ghi chú thiết kế:
- Cột `current_role` bị trùng từ khóa SQL nên đặt là `current_role_title` / `target_role_title`.
- Mọi bảng con có cả `user_id` và `career_profile_id`. `user_id` giúp RLS rẻ và đơn giản.

### RLS

Cả 5 bảng bật RLS; `anon` bị thu hồi quyền; `authenticated` chỉ thao tác trên dòng của chính mình.

| Bảng | SELECT / DELETE | INSERT / UPDATE |
|---|---|---|
| `career_profiles` | `auth.uid() = user_id` | `auth.uid() = user_id` |
| 4 bảng còn lại | `auth.uid() = user_id` | `auth.uid() = user_id` **và** `owns_career_profile(career_profile_id)` |

Điều kiện thứ hai chặn trường hợp user gắn dữ liệu của mình vào `career_profile_id` của người khác.
`service_role` (backend/AI worker) bypass RLS theo mặc định của Supabase.

> **Recruiter View (Module 3):** chưa có policy đọc chéo user. Khi làm tính năng này cần thêm policy riêng
> (vd. chỉ cho đọc profile được user công khai), không nới lỏng policy hiện tại.

### Mapping `users → career_profiles`

- **User mới:** trigger `trg_users_create_career_profile` tự tạo `career_profiles` rỗng.
- **User hiện có:** backfill idempotent (`ON CONFLICT DO NOTHING`) ngay trong migration.
- Các cột cùng tên được copy nếu `users` có: `headline`, `industry`.
  Muốn map thêm (vd. `job_title → current_role_title`) hãy sửa danh sách trong khối backfill.

## Chạy migration

```bash
# Local
supabase start
supabase db reset            # áp dụng toàn bộ migrations lên DB local

# Remote (Supabase project)
supabase link --project-ref <PROJECT_REF>
supabase db push --dry-run   # xem trước
supabase db push
```

Hoặc dán nội dung file `.sql` vào **Supabase Dashboard → SQL Editor** và chạy (file đã bọc trong transaction).
Migration idempotent nên chạy lại không gây lỗi.

## Rollback

```bash
psql "$DATABASE_URL" -f supabase/rollbacks/20260929000000_sprint1_career_core.down.sql
```

Rollback **từ chối chạy** nếu `career_evidence`, `career_discovery_sessions`, `leadership_signals`
hoặc `career_dna_assessments` đã có dữ liệu, để không vi phạm nguyên tắc 1. `career_profiles` không nằm trong guard
vì được backfill tự động từ `users`. Với production đã có dữ liệu, hãy export/backup rồi xử lý thủ công.

## Kiểm tra sau khi chạy

```sql
-- 1) Bảng đã tạo và RLS đã bật (5 dòng, rowsecurity = true)
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname='public' AND tablename IN
 ('career_profiles','career_discovery_sessions','career_evidence','leadership_signals','career_dna_assessments');

-- 2) Số policy mỗi bảng (kỳ vọng 4)
SELECT tablename, count(*) FROM pg_policies WHERE schemaname='public'
  AND tablename IN ('career_profiles','career_discovery_sessions','career_evidence','leadership_signals','career_dna_assessments')
GROUP BY 1;

-- 3) Backfill: không còn user thiếu profile (kỳ vọng 0)
SELECT count(*) FROM public.users u
LEFT JOIN public.career_profiles p ON p.user_id = u.id WHERE p.id IS NULL;
```

Kiểm thử RLS (thay UUID thật của 2 user A, B; chạy trong SQL Editor):

```sql
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"<USER_A_ID>"}', true);

SELECT count(*) FROM career_profiles;                         -- kỳ vọng: 1 (chỉ của A)
INSERT INTO career_evidence (user_id, career_profile_id, evidence_type, title)
SELECT '<USER_A_ID>', id, 'achievement', 'RLS test' FROM career_profiles;   -- OK

-- Phải LỖI "new row violates row-level security policy":
INSERT INTO career_evidence (user_id, career_profile_id, evidence_type, title)
VALUES ('<USER_A_ID>', '<PROFILE_ID_OF_USER_B>', 'impact', 'cross-user attempt');
ROLLBACK;
```

## Quy ước cho migration tiếp theo

- Tên file: `YYYYMMDDHHMMSS_<mo_ta>.sql`, kèm file `.down.sql` trong `supabase/rollbacks/`.
- Thêm cột: `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...` (nullable hoặc có default).
- Bảng mới: `CREATE TABLE IF NOT EXISTS`, PK UUID, bật RLS ngay trong cùng migration.
- Đổi kiểu/xóa cột: làm theo 2 bước (thêm mới + copy dữ liệu → sau khi ổn định mới gỡ cột cũ ở migration khác).

## Backlog Sprint 1 (chưa nằm trong migration này)

`skills`, `projects`, `project_skills`, `certificates`, `achievements`, `mock_interviews`,
`generated_cvs`, `portfolio_match_histories`, `candidate_pipeline_items` – theo `migrations.md` gốc,
sẽ làm ở migration riêng. Khi `achievements` có, có thể thêm `achievement_id` vào `career_evidence` bằng `ALTER TABLE`.