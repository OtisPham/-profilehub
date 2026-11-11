# Implementation Plan: Google OAuth Resilience, Auto-Provisioning & Diagnostic Flow

> **Branch:** `profilehub_v1`  
> **Feature Directory:** `docs/superpowers/specs/2026-11-11-google-oauth-resilience-and-auto-provisioning/`  
> **Status:** Draft / Planned

---

## 1. Technical Context

- **Framework:** React 18, Vite, TypeScript, React Router DOM v6, Tailwind CSS.
- **Backend / BaaS:** Supabase Cloud (`@supabase/supabase-js` v2).
- **Core Entities:** `auth.users`, `public.users`, `public.student_profiles`.
- **Existing Files to Touch:**
  - `src/App.tsx`: Thêm tuyến đường `/auth/callback`.
  - `src/pages/auth/Register.tsx`: Cập nhật `redirectTo` trỏ về `/auth/callback`.
  - `src/pages/auth/Login.tsx`: Cập nhật `redirectTo` trỏ về `/auth/callback`.
  - `src/context/AuthProvider.tsx`: Tích hợp bước auto-provisioning sau khi nhận session.
- **New Files to Create:**
  - `src/services/oauthProvisioningService.ts`: Core service xử lý bóc tách thông tin, upsert users & student_profiles, parse error.
  - `src/services/oauthProvisioningService.test.ts`: Bộ kiểm thử đơn vị tự động.
  - `src/pages/auth/AuthCallback.tsx`: Trang đón nhận callback với UI chẩn đoán lỗi và spinner đồng bộ.

---

## 2. Implementation Phases

### Phase 1: Core Service & Unit Tests (TDD)
- Viết `oauthProvisioningService.test.ts` (RED phase).
- Xây dựng `oauthProvisioningService.ts` (GREEN phase):
  - `parseOAuthErrorFromUrl(search, hash)`
  - `provisionOAuthUserProfile(user, preferredRole)`
- Chạy Vitest xác nhận 100% tests pass.

### Phase 2: Callback Page & Route Setup
- Xây dựng component `src/pages/auth/AuthCallback.tsx`:
  - Spinner đồng bộ tài khoản thân thiện.
  - Card chẩn đoán lỗi trực quan kèm gợi ý sửa lỗi (Google Testing Mode / Redirect URI).
  - Nút chuyển nhanh sang Demo Mode 1-click.
- Khai báo tuyến đường `<Route path="/auth/callback" element={<AuthCallback />} />` trong `src/App.tsx`.

### Phase 3: Update Register & Login Redirects
- Cập nhật `redirectTo` trong `Register.tsx` và `Login.tsx` thành `${window.location.origin}/auth/callback`.
- Đồng bộ vai trò qua `localStorage.profilehub_demo_role`.

### Phase 4: Quality Gates & Verification
- Chạy `npx tsc --noEmit` đạt 0 lỗi biên dịch.
- Chạy `npm test` toàn bộ 60+ test suites đạt 100% pass.
