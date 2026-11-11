# Data Model: OAuth Provisioning & Profile Entities

> **Feature Directory:** `docs/superpowers/specs/2026-11-11-google-oauth-resilience-and-auto-provisioning/`

---

## 1. OAuth User Metadata Structure

Cấu trúc metadata trả về từ Google / GitHub OAuth qua Supabase `auth.users`:

```typescript
export interface OAuthRawMetadata {
  full_name?: string;
  name?: string;
  avatar_url?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  provider_id?: string;
}
```

---

## 2. Auto-Provisioning Mapping Rules

Khi một user đăng nhập qua OAuth lần đầu tiên:

| Thực Thể Đích | Trường | Giá Trị Nạp | Quy Tắc Fallback |
| :--- | :--- | :--- | :--- |
| `public.users` | `id` | `auth.users.id` | Khóa chính bắt buộc |
| `public.users` | `email` | `auth.users.email` | Bắt buộc |
| `public.users` | `full_name` | `metadata.full_name` \|\| `metadata.name` | Tách phần trước `@` của email nếu rỗng |
| `public.users` | `avatar_url` | `metadata.avatar_url` \|\| `metadata.picture` | `undefined` nếu không có |
| `public.users` | `role` | `localStorage.profilehub_demo_role` | Mặc định `'student'` nếu không chọn |
| `public.student_profiles` | `id` | `auth.users.id` | Chỉ tạo nếu `role === 'student'` |
| `public.student_profiles` | `full_name` | Đồng bộ từ `public.users.full_name` | |
| `public.student_profiles` | `avatar_url` | Đồng bộ từ `public.users.avatar_url` | |
| `public.student_profiles` | `is_open_to_work`| `true` | Mặc định bật nhận việc |

---

## 3. Chẩn Đoán Lỗi OAuth Model

```typescript
export interface OAuthDiagnosticInfo {
  isError: boolean;
  errorCode?: string;
  errorDescription?: string;
  solutionHint?: string;
  canFallbackToDemo: boolean;
}
```
