# Hướng Dẫn Kiểm Thử Nhanh (Quickstart Scenarios)

> **Feature Directory:** `docs/superpowers/specs/2026-11-09-candidate-dossier-and-executive-pdf-export/`  
> **Status:** SPECIFIED  

---

## Kịch Bản Kiểm Thử 1: Xuất Báo Cáo Phỏng Vấn (Executive Dossier PDF)
1. Đăng nhập với vai trò Nhà tuyển dụng.
2. Điều hướng đến trang [`/recruiter/pipeline`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/recruiter/CandidatePipeline.tsx).
3. Tìm một ứng viên đã có bảng chấm điểm Scorecard hoặc bài test Take-Home.
4. Bấm nút `[ 📑 Báo Cáo PDF ]` trên thẻ ứng viên.
5. Modal Báo Cáo Đánh Giá A4 mở ra với đầy đủ:
   - Điểm đồng thuận Consensus Score (ví dụ: `88/100`).
   - Radar/Bảng điểm chi tiết 5 tiêu chí vàng.
   - Nhận xét và khuyến nghị tuyển dụng (`Strong Hire` / `Hire`).
   - Thông tin bài test GitHub PR và các đồ án verified.
6. Bấm `[ 🖨️ In / Tải PDF Báo Cáo ]`: Hộp thoại in của trình duyệt mở ra, toàn bộ giao diện điều hướng web được ẩn tự động, chỉ còn văn bản A4 sắc nét.

---

## Kịch Bản Kiểm Thử 2: Xuất Báo Cáo Ở Chế Độ Sàng Lọc Ẩn Danh (Blind Screening)
1. Trên thanh công cụ Pipeline, bật công tắc `[ 🕶️ Chế Độ Ẩn Danh: ĐANG BẬT ]`.
2. Mở `[ 📑 Báo Cáo PDF ]` của ứng viên.
3. Tiêu đề tài liệu hiển thị `BÁO CÁO ĐÁNH GIÁ ẨN DANH (BLIND HIRING DOSSIER)`.
4. Tên ứng viên được mã hóa thành `Ứng viên #DEV-XXXX`, tên trường đại học và email được ẩn bảo mật.
5. Bấm in hoặc tải PDF: File PDF xuất ra hoàn toàn không chứa định kiến cá nhân.

---

## Kịch Bản Kiểm Thử 3: Áp Dụng Mẫu JD Nhanh Trong Job Studio
1. Vào trang [`/recruiter/jobs`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/recruiter/JobManagement.tsx).
2. Bấm `[ + Đăng Tin Tuyển Dụng ]`.
3. Bấm vào dropdown/nút "⚡ Chọn Mẫu JD Nhanh" (ví dụ: *Frontend React & TypeScript Fresher*).
4. Các ô: Chức danh, Phòng ban, Cấp bậc, Mức lương 8-12M VND, Kỹ năng yêu cầu (`ReactJS`, `TypeScript`, `Tailwind CSS`) và Mô tả công việc tự động điền đầy đủ.
