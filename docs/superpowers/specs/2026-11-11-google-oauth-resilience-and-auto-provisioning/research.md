# Research: Google OAuth Resilience, Redirect Handling & Auto-Provisioning

> **Feature Directory:** `docs/superpowers/specs/2026-11-11-google-oauth-resilience-and-auto-provisioning/`  
> **Topic:** Giải pháp kỹ thuật xử lý đăng ký Google OAuth, bắt lỗi điều hướng và tự động khởi tạo hồ sơ (Auto-Provisioning)

---

## 1. Quyết định Kỹ Thuật 1: Cơ chế Đón Nhận OAuth (Dedicated Callback Route vs In-situ Route)

### Lựa chọn: Dedicated Callback Route (`/auth/callback`)
- **Nguyên nhân:**
  - Hiện tại, `redirectTo` trỏ thẳng vào `/dashboard` hoặc `/recruiter/dashboard`.
  - Trên các trang này, `ProtectedRoute` kiểm tra `user === null` và chuyển hướng về `/login` trước khi Supabase client kịp parse token hash (`#access_token=...`) từ URL. Điều này tạo ra hiện tượng "Flickering" hoặc đá người dùng quay lại màn hình Login.
  - Sử dụng route chuyên dụng `/auth/callback` cho phép:
    1. Tiếp nhận mọi tham số `#access_token` hoặc `?code=...` hoặc `?error=...`.
    2. Chờ `supabase.auth.onAuthStateChange` hoặc `supabase.auth.getSession()` hoàn tất 100%.
    3. Thực hiện bước **Auto-Provisioning** (tạo hồ sơ nếu là user mới) trước khi cho phép vào Dashboard.
    4. Điều hướng mượt mà đến đúng trang tương ứng với vai trò.

---

## 2. Quyết định Kỹ Thuật 2: Tự Động Cấp Phát Dữ Liệu (Client-Side Provisioning vs Database Trigger)

### Lựa chọn: Client-Side Idempotent Provisioning kết hợp Fallback
- **Lý do chọn Client-Side trong `oauthProvisioningService.ts`:**
  - Không bắt buộc người dùng / developer phải có quyền Admin chạy SQL trigger trên Supabase Dashboard.
  - Tận dụng `user_metadata` do Google trả về (`full_name`, `avatar_url`, `email`) kết hợp `profilehub_demo_role` được lưu trong `localStorage` trước khi bấm nút.
  - Sử dụng lệnh `upsert` với ID của `auth.users` đảm bảo tính lũy thừa (Idempotent): nếu bản ghi đã tồn tại thì không ghi đè mất thông tin sinh viên đã nhập trước đó.

---

## 3. Quyết định Kỹ Thuật 3: Bắt Lỗi Mạng & Trạng Thái Google Testing Mode

### Lựa chọn: URL Hash & Query Param Error Parser
- Google OAuth và Supabase có thể trả về lỗi theo 2 cách:
  1. Exception ngay lúc bấm nút: Bắt bằng `try/catch` tại `signInWithOAuth`.
  2. Lỗi sau khi điều hướng: URL chứa `?error=access_denied&error_description=...` hoặc `#error=...`.
- Xây dựng helper hàm `parseOAuthErrorFromUrl(search: string, hash: string)`:
  - Nếu phát hiện `access_denied`: Báo rõ lỗi ứng dụng đang ở Testing Mode và cần thêm email vào Test Users.
  - Nếu phát hiện `redirect_uri_mismatch`: Hướng dẫn cấu hình lại Redirect URI trên Google Console.
  - Cung cấp nút chuyển đổi sang chế độ Demo để người dùng không bị tắc nghẽn công việc.
