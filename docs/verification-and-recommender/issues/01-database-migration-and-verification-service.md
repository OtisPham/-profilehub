# 01 — Database Migration & Public Verification Backend Service

**What to build:** Update database schema and implement backend service logic so that when a lecturer approves a project, a unique `verification_code` and cryptographic `verification_hash` are generated and stored, allowing public verification records to be queried by verification code.

**Blocked by:** None — can start immediately.

**Status:** completed

- [x] Schema updated in database/Supabase: `verification_code`, `verification_hash`, `verified_at` columns added to `projects`.
- [x] Lecturer verification workflow automatically populates `verification_code` (e.g. `PH-VER-XXXXXX`), `verification_hash`, and timestamp `verified_at` when `status` transitions to `verified`.
- [x] Service function `getPublicVerificationRecord(verificationCode)` returns student name, faculty, verifying lecturer details, project title/abstract, tech stack, verification timestamp, hash, and document preview URL.
- [x] Service function returns null/error state for non-existent or unverified project codes.
