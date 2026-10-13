# 📋 Product Requirements Document (PRD) — ProfileHub Core System

## 1. Overview
ProfileHub chuẩn hóa dữ liệu học thuật của sinh viên đại học thành hồ sơ năng lực đáng tin cậy phục vụ doanh nghiệp tuyển dụng.
* **Tài liệu luồng vận hành chi tiết toàn hệ thống:** [docs/product/luong_chinh_he_thong.md](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/docs/product/luong_chinh_he_thong.md)

## 2. Core Functional Requirements

### 2.1. Phân hệ Sinh viên (Student Module)
* **Profile Management:** Quản lý thông tin cá nhân, GPA, kỹ năng, trường/khoa, avatar, và mã QR định danh cá nhân.
* **Project Portfolio:** Đăng tải đồ án (Tiêu đề, mô tả, GitHub repository, URL demo, vai trò, môn học, tài liệu PDF đính kèm). Gửi yêu cầu thẩm định tới giảng viên.
* **Certificates & Achievements:** Lưu trữ bằng khen, chứng chỉ chuyên môn, giải thưởng học thuật.
* **CV Builder & Export:** Tự động tạo CV chuẩn từ dữ liệu đồ án verified và xuất file in PDF chuẩn A4.
* **AI Interview Preparation & Level Calibration (v2.0):** Phòng luyện phỏng vấn thực chiến 4 chặng mô phỏng Tech Interview doanh nghiệp (Elevator Pitch, Deep-Dive Đồ Án & Trade-offs, Giả Lập Xử Lý Sự Cố Hệ Thống, Bào Chữa Lỗ Hổng Kỹ Năng so với JD), kèm cơ chế AI hỏi xoáy follow-up, báo cáo đánh giá Radar 5 trục và **Cơ chế Tái Hiệu Chuẩn Cấp Bậc Hậu Phỏng Vấn (Up-Leveling / Down-Leveling / Level Confirmed)** kèm dự báo dải lương thị trường mới. [Xem chi tiết: docs/product/ai_interview_prep_framework.md](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/docs/product/ai_interview_prep_framework.md)

### 2.2. Phân hệ Giảng viên (Teacher Module)
* **Teacher Profile:** Thông tin học hàm, học vị, khoa, trường đại học và danh sách môn học giảng dạy.
* **Verification Inbox:** Tiếp nhận yêu cầu kiểm định đồ án; xem xét mã nguồn, demo, tài liệu; duyệt cấp nhãn **Verified Badge 🛡️** hoặc từ chối kèm phản hồi đóng góp chuyên môn.

### 2.3. Phân hệ Nhà tuyển dụng (Recruiter Module)
* **Company Profile:** Quản lý hồ sơ doanh nghiệp, logo, lĩnh vực hoạt động, quy mô và website.
* **Job Posting Management:** Tạo, chỉnh sửa và quản lý tin tuyển dụng với bộ kỹ năng yêu cầu (skills tags).
* **Evidence-Based Candidate Search:** Bộ lọc tìm kiếm ứng viên theo trường, kỹ năng, chuyên ngành và số lượng đồ án verified.
* **Recruiter Pipeline Kanban:** Quản lý luồng ứng viên qua các giai đoạn (`discovered`, `shortlisted`, `contacted`, `interview`, `hired`).
* **Interview Feedback Loop:** Nhập điểm kỹ thuật, điểm kỹ năng mềm và ghi nhận lỗ hổng kiến thức gửi phản hồi cho sinh viên.

## 3. Non-Functional Requirements
* **Type-Safety & Code Quality:** 100% TypeScript, không lỗi compile.
* **UI/UX Consistency:** Single-Layout với Sidebar thống nhất, hỗ trợ responsive.
* **Performance:** Tải trang dưới 1.5s, hỗ trợ client-side fallback khi offline.
