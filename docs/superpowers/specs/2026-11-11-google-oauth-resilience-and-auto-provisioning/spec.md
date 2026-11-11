# Feature Spec: Cơ Chế Đăng Ký / Đăng Nhập Google & OAuth Bền Vững, Tự Động Khởi Tạo Hồ Sơ & Chẩn Đoán Lỗi Trực Quan (Google & Social OAuth Resilience, Auto-Provisioning & Diagnostic Flow)

> **Mã Tính Năng:** `FR-033` (Tiếp nối `FR-032` trong Enterprise Spec)  
> **Phiên bản:** v1.0  
> **Trạng thái:** Planning & Design (`/speckit-plan`)  
> **Mục tiêu:** Xử lý triệt để các rào cản khi người dùng bấm nút Đăng ký / Đăng nhập bằng Google (hoặc GitHub), tự động cấp phát hồ sơ (Auto-Provisioning) khi tài khoản OAuth đăng nhập lần đầu, và cung cấp bảng chẩn đoán hướng dẫn xử lý lỗi rõ ràng thay vì im lặng hoặc treo giao diện.

---

## 1. Bối Cảnh & Vấn Đề Nghiệp Vụ (Problem Statement)

1. **Rào cản khi bấm Đăng ký bằng Google:**
   - Người dùng bấm nút "Google" trên trang `/register` hoặc `/login`. Nếu Supabase Dashboard chưa whitelist Redirect URL của môi trường hiện tại (`localhost:5173` hoặc domain production) hoặc Google OAuth Console chưa publish, quá trình redirect bị lỗi hoặc quay về trang không tồn tại (`ERR_CONNECTION_REFUSED`).
   - Lỗi hiện tại chỉ bắt được khi hàm `supabase.auth.signInWithOAuth` ném exception, nhưng không bắt được lỗi sau khi Google redirect ngược về trình duyệt (URL chứa `#error=...` hoặc `?error_description=...`).

2. **Thiếu cơ chế Tự Động Khởi Tạo Hồ Sơ (Zero Data Provisioning):**
   - Đăng ký bằng email/mật khẩu truyền thống có bước tạo row trong `public.users` và `public.student_profiles`.
   - Đăng ký bằng Google OAuth redirect thẳng vào `/dashboard`. Tài khoản mới trong `auth.users` hoàn toàn KHÔNG có bản ghi trong `public.users` và `public.student_profiles`, khiến Dashboard và Profile bị trống dữ liệu, không có vai trò chính xác hoặc rơi vào vòng lặp điều hướng.

3. **Chưa có trang tiếp nhận OAuth Callback chuyên dụng (`/auth/callback`):**
   - Supabase trả về token hash `#access_token=...` trên thanh URL. Việc redirect thẳng vào các Protected Route như `/dashboard` dễ dẫn đến race condition giữa việc parse token và kiểm tra `user === null` trong `ProtectedRoute`, gây đá ngược người dùng về `/login`.

---

## 2. Yêu Cầu Chức Năng (Functional Requirements)

- **FR-033.1: Trang Tiếp Nhận Callback Tập Trung (`/auth/callback`):**
  - Đón nhận redirect từ Google/GitHub OAuth, lắng nghe phiên `supabase.auth.getSession()` an toàn.
  - Hiển thị màn hình chờ (Spinner) thân thiện: *"Đang đồng bộ hồ sơ Google với ProfileHub..."*.
  - Bắt các tham số lỗi trả về từ OAuth Provider trên URL (`error`, `error_code`, `error_description`) và hiển thị thông báo lỗi tường minh, kèm nút *"Thử lại bằng Email"* hoặc *"Mở tài liệu hướng dẫn"*.

- **FR-033.2: Dịch Vụ Cấp Phát Hồ Sơ Tự Động (`oauthProvisioningService.ts`):**
  - Kiểm tra xem tài khoản OAuth vừa đăng nhập đã có bản ghi trong `public.users` chưa.
  - Nếu chưa có (người dùng mới lần đầu):
    - Tự động lấy `full_name` từ `user.user_metadata.full_name` (hoặc `name`, hoặc tiền tố email).
    - Tự động lấy `avatar_url` từ `user.user_metadata.avatar_url` (hoặc `picture`).
    - Gán vai trò theo lựa chọn trước khi bấm OAuth (được lưu tạm trong `localStorage.profilehub_demo_role`), mặc định là `'student'`.
    - Tự động chèn bản ghi vào `public.users`.
    - Nếu vai trò là `'student'`, tự động chèn bản ghi khởi tạo vào `public.student_profiles` với `full_name`, `avatar_url`, `is_open_to_work = true`.
  - Nếu đã có bản ghi: Đồng bộ cập nhật `avatar_url` mới nhất nếu profile hiện tại chưa có ảnh.

- **FR-033.3: Chẩn Đoán Lỗi Cấu Hình OAuth Dự Phòng (Localhost & Production Diagnostic Modal):**
  - Khi phát hiện lỗi phổ biến như:
    - `redirect_uri_mismatch`: Hướng dẫn cấu hình Authorized redirect URIs trên Google Cloud.
    - `access_denied / testing mode`: Nhắc nhở thêm email vào Test Users hoặc Publish App.
    - `provider is not enabled`: Hướng dẫn bật Google Provider trên Supabase.
  - Cung cấp nút chuyển nhanh sang chế độ **"Đăng Nhập Thử Nghiệm 1-Click (Demo Mode)"** để người dùng / giám khảo có thể trải nghiệm ngay hệ thống mà không bị chặn lại bởi lỗi OAuth mạng ngoài.

---

## 3. Tiêu Chí Nghiệm Thu (Success Criteria)

- **SC-01:** Bấm Đăng ký Google ➔ Nếu OAuth thành công, tự động có bản ghi trong `public.users` và `public.student_profiles`, người dùng vào thẳng Dashboard với tên và avatar Google hiển thị chuẩn xác.
- **SC-02:** Nếu Google trả về lỗi trên URL callback, ứng dụng không bị trắng trang mà hiển thị hộp thoại chẩn đoán lỗi kèm giải pháp khắc phục.
- **SC-03:** Có 100% kiểm thử tự động (Unit Test) cho dịch vụ `oauthProvisioningService.ts` xử lý đủ mọi trường hợp (user mới, user cũ, thiếu avatar, fallback tên).
- **SC-04:** Chạy `npx tsc --noEmit` đạt 0 lỗi biên dịch; chạy `npm test` pass 100%.
