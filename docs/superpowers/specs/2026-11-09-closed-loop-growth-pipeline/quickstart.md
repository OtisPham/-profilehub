# Hướng Dẫn Kiểm Thử & Nghiệm Thu Nhanh (Quickstart Validation Guide)
> **Mã đặc tả:** `SPEC-20261109-GROWTH-PIPELINE`  
> **Mục tiêu:** Cung cấp kịch bản kiểm thử luồng nghiệp vụ khép kín giữa Ứng viên và Nhà tuyển dụng.

---

## 1. Môi Trường & Lệnh Kiểm Tra Sẵn Sàng (Prerequisites)

```bash
# Di chuyển vào thư mục dự án
cd C:/Users/ADMIN/Desktop/STUDY/profilehub

# Chạy kiểm tra tĩnh toàn bộ mã nguồn
npx tsc --noEmit

# Chạy toàn bộ test suites tự động
npx vitest run
```

---

## 2. Kịch Bản Kiểm Thử Thực Chiến Đầu-Cuối (End-to-End Walkthrough)

### Kịch bản 1: Nhà tuyển dụng tạo tin đăng chuẩn và tìm kiếm ứng viên
1. Đăng nhập với vai trò **Nhà Tuyển Dụng** (`recruiter`).
2. Truy cập `/recruiter/jobs` (`JobManagement.tsx`):
   - Đăng tin tuyển dụng mới với dải lương (`10 - 18 Triệu VNĐ`), hình thức (`Hybrid`), cấp bậc (`Fresher`), kỹ năng (`React, TypeScript, Tailwind`).
   - Kiểm tra thẻ bài đăng hiển thị chip số lượng ứng viên tiềm năng: `[ 👥 X ứng viên phù hợp (Độ tương thích JD ≥ 50%) ]`.
3. Bấm vào chip để chuyển hướng sang `/recruiter/search` (`CandidateSearch.tsx`):
   - Xác nhận danh sách ứng viên hiển thị huy hiệu chuẩn hóa: `🎯 Độ tương thích JD: {score}%`.
   - Bấm vào ứng viên để kiểm tra liên kết GitHub, Demo URL và Huy hiệu bảo chứng.

---

### Kịch bản 2: Nhà tuyển dụng xếp lịch phỏng vấn và phát thông báo
1. Từ danh sách ứng viên, bấm **Lưu vào Pipeline** (chuyển sang stage `interview`).
2. Trên bảng `/recruiter/pipeline` (`CandidatePipeline.tsx`):
   - Bấm nút **Đặt Lịch Phỏng Vấn** trên thẻ ứng viên.
   - Nhập ngày: `2026-11-20`, giờ: `14:30`, link Meet: `https://meet.google.com/abc-defg-hij`.
   - Bấm **Lưu Lịch Hẹn**.
3. **Kết quả mong đợi:**
   - Thẻ ứng viên chuyển sang trạng thái `Chờ ứng viên phản hồi`.
   - Hệ thống phát thông báo đẩy trình duyệt: `"ProfileHub - Lời mời phỏng vấn mới!"` đến ứng viên.

---

### Kịch bản 3: Ứng viên nhận thông báo và chuẩn bị trong War Room
1. Chuyển sang trình duyệt/tab đang đăng nhập tài khoản **Sinh Viên** (`student`).
2. Quan sát trên thanh điều hướng (`HeaderBar.tsx`):
   - Chuông thông báo có chấm đỏ nhấp nháy.
   - Bấm mở chuông: Thấy lịch hẹn phỏng vấn vị trí với ngày giờ và link Meet.
3. Bấm nút **"Xác Nhận Tham Gia"**:
   - Trạng thái chuyển thành `Đã xác nhận`.
   - Phía tab Nhà tuyển dụng lập tức nhận thông báo đẩy: `"ProfileHub - Ứng viên đã xác nhận!"`.
4. Truy cập `/student/dashboard` (`Dashboard.tsx`):
   - Lịch hẹn mới tự động xuất hiện tại khu vực **Phỏng Vấn & War Room**.
   - Bấm vào buổi phỏng vấn: Hệ thống tải sẵn bộ câu hỏi xoáy kiến trúc và xử lý khủng hoảng hệ thống sát với JD của công ty.
