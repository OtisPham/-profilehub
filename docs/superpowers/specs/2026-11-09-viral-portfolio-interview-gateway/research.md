# Nghiên Cứu Kỹ Thuật: Cổng Lan Tỏa Hồ Sơ & Mời Phỏng Vấn Trực Tiếp (Viral Portfolio & Direct Interview Gateway)
> **Mã đặc tả:** `SPEC-20261109-VIRAL-GATEWAY`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu liên quan:** [`PublicVerificationView.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/public/PublicVerificationView.tsx), [`pipelineSync.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/utils/pipelineSync.ts)

---

## 1. Bối Cảnh & Cơ Hội Tăng Trưởng (Growth Opportunity)

Hiện tại, trang tra cứu đồ án công khai [`PublicVerificationView.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/public/PublicVerificationView.tsx) được kích hoạt khi:
- Nhà tuyển dụng quét mã QR in trên bản in CV PDF của sinh viên.
- Sinh viên gắn link `/verify/:code` vào bài viết trên LinkedIn, bio GitHub hoặc portfolio cá nhân.

Tuy nhiên, trang này hiện chỉ hiển thị thông tin thụ động (Read-only view). Khi một Nhà tuyển dụng, Tech Lead hoặc Headhunter ấn tượng với đồ án của sinh viên, họ **không có cách nào để liên hệ hoặc mời phỏng vấn ngay tại chỗ** ngoài việc phải tìm email hoặc nhắn tin qua kênh bên ngoài.

**Mục tiêu tăng trưởng:** Biến trang chứng chỉ công khai thành **Kênh Tuyển Dụng Trực Tiếp (Inbound Talent Gateway)**.

---

## 2. Các Quyết Định Kiến Trúc (Architectural Decisions)

### Quyết định 1: Nút Kêu Gọi Hành Động Mời Phỏng Vấn Nổi Bật (Direct Interview CTA)
- **Lựa chọn:** Bổ sung nút bấm `"🏢 Tôi là Nhà tuyển dụng - Mời phỏng vấn ngay"` đặt cạnh các liên kết GitHub/Demo.
- **Lý do:** Kích hoạt tâm lý chuyển đổi ngay tại thời điểm nhà tuyển dụng vừa xem xong mã nguồn và live demo ấn tượng.

### Quyết định 2: Hỗ trợ Cả Recruiter Đã Đăng Nhập & Khách Vãng Lai (Hybrid Inbound Flow)
- **Nếu Recruiter đã đăng nhập:** Hệ thống hiển thị dropdown chọn tin tuyển dụng đang mở (`JobPost`), chọn ngày giờ, link Meet và tự động đưa ứng viên vào `CandidatePipeline.tsx`.
- **Nếu Recruiter chưa đăng nhập / Khách ngoài:** Cung cấp modal rút gọn (Nhập Tên công ty, Email làm việc, Vị trí tuyển dụng, Lời nhắn & Đề xuất ngày giờ). Hệ thống tự tạo tài khoản tạm hoặc lưu ứng viên vào pipeline và bắn thông báo đẩy tức thì cho sinh viên.

### Quyết định 3: Huy Hiệu Markdown & Nút Chia Sẻ 1-Click (Viral Distribution)
- **Lựa chọn:** Sinh đoạn mã Markdown Badge để sinh viên dán vào `README.md` trên GitHub:
  `[![ProfileHub Verified](https://img.shields.io/badge/ProfileHub-Verified_Project-emerald)](http://localhost:5173/verify/PH-VER-XXXXXX)`
  kèm nút `"Chia sẻ lên LinkedIn"` tự động điền sẵn nội dung khoe đồ án và link xác thực.
- **Lý do:** Tận dụng hiệu ứng mạng lưới (Network Effect) để sinh viên tự lan tỏa thương hiệu ProfileHub ra cộng đồng lập trình viên.
