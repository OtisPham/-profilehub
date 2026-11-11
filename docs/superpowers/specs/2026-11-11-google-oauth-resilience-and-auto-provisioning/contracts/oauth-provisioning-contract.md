# Contract: OAuth Provisioning & Diagnostic Service API

> **Feature Directory:** `docs/superpowers/specs/2026-11-11-google-oauth-resilience-and-auto-provisioning/`

---

## 1. Dịch Vụ Cấp Phát Hồ Sơ: `oauthProvisioningService.ts`

### Interface & Signature:

```typescript
export interface ProvisioningResult {
  success: boolean;
  isNewUser: boolean;
  role: 'student' | 'recruiter';
  destinationUrl: string;
  error?: string;
}

/**
 * Phân tích URL Callback xem có chứa tham số lỗi do Google / Supabase trả về không
 */
export function parseOAuthErrorFromUrl(searchParams: string, hashParams: string): OAuthDiagnosticInfo;

/**
 * Tự động kiểm tra và khởi tạo bản ghi trong users và student_profiles cho tài khoản OAuth
 */
export function provisionOAuthUserProfile(
  user: User, 
  preferredRole?: 'student' | 'recruiter'
): Promise<ProvisioningResult>;
```

---

## 2. Tuyến Đường Nhận Callback: `/auth/callback`

- **Endpoint Client Route:** `GET /auth/callback`
- **Các kịch bản xử lý:**
  1. *Thành công:* Nhận session ➔ Gọi `provisionOAuthUserProfile` ➔ Chuyển hướng sang `/dashboard` hoặc `/recruiter/dashboard`.
  2. *Lỗi Provider:* Phát hiện `error` trên URL ➔ Dừng loading, hiển thị Card Chẩn Đoán Lỗi với mã màu trực quan + 2 nút:
     - Nút 1: *"Đăng nhập bằng Email/Mật khẩu"*
     - Nút 2: *"Trải nghiệm ngay với Tài khoản Demo"*
