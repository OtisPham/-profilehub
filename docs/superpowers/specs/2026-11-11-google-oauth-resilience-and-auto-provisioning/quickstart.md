# Quickstart: Kiểm Thử & Nghiệm Thu Luồng Đăng Ký Google OAuth & Auto-Provisioning

> **Feature Directory:** `docs/superpowers/specs/2026-11-11-google-oauth-resilience-and-auto-provisioning/`

---

## 1. Kịch bản Kiểm thử Tự động (Unit Tests)

Chạy bộ kiểm thử đơn vị tự động cho dịch vụ `oauthProvisioningService.test.ts`:

```bash
npm test -- src/services/oauthProvisioningService.test.ts
```

### Các ca kiểm thử bắt buộc:
- **TC-OAUTH-01:** Phân tích chính xác mã lỗi `access_denied`, `redirect_uri_mismatch` từ query params và hash params.
- **TC-OAUTH-02:** Trích xuất đúng `full_name` từ `name`, `full_name` hoặc email fallback khi user_metadata thiếu trường.
- **TC-OAUTH-03:** Khởi tạo bản ghi `users` và `student_profiles` với tính lũy thừa (Idempotent upsert), không đè mất dữ liệu đã có.
- **TC-OAUTH-04:** Chuyển hướng chính xác theo vai trò: `student` vào `/dashboard`, `recruiter` vào `/recruiter/dashboard`.

---

## 2. Kịch bản Kiểm thử Trải Nghiệm Thực Tế (E2E / Manual Verification)

1. **Kiểm thử Bắt Lỗi URL Callback:**
   - Truy cập thẳng vào URL: `http://localhost:5173/auth/callback?error=access_denied&error_description=User+cancelled+or+app+in+testing+mode`
   - **Kỳ vọng:** Màn hình hiển thị Card Chẩn đoán lỗi màu đỏ thân thiện, giải thích nguyên nhân rõ ràng và có 2 nút *"Về trang đăng nhập"* và *"Bật chế độ trải nghiệm Demo"*.

2. **Kiểm thử Luồng OAuth Thành Công:**
   - Tại trang `/register`, chọn vai trò *"Sinh Viên"*, bấm nút *"Google"*.
   - Sau khi Google xác thực, trang chuyển qua `/auth/callback`, hiển thị thông báo *"Đang đồng bộ hồ sơ Google..."*, sau đó tự động vào thẳng `/dashboard`.
   - Kiểm tra tên hiển thị góc trên và Dashboard đã nhận đúng tên từ Google Account.
