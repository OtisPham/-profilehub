# Research & Architecture Decisions: Cover Letter & Professional Email Generator

> **Feature:** Cover Letter & Professional Email Generator (1-Click Tailored Application Kit)  
> **Status:** APPROVED  
> **Author:** Product Owner Alex & Tech Lead David  
> **Date:** 2026-11-04  

---

## 1. Technical Context & Deduplication Guard

### Đối chiếu mã nguồn hiện có:
- `applicationTrackerService.ts`: Quản lý danh sách các công ty ứng viên nộp đơn (`CandidateApplicationItem`), lưu trữ `company_name`, `role_title`, `job_url`, `linked_cv_id`. *Chưa có chức năng tự động soạn thảo Cover Letter hay Email gửi HR.*
- `applicationPitchService.ts`: Tập trung sinh kịch bản giới thiệu bản thân miệng (Elevator Pitch) cho phỏng vấn. *Không có cấu trúc văn bản thư tín trang trọng theo chuẩn HR quốc tế.*
- `cvService.ts`: Lưu trữ toàn bộ dữ liệu dự án, kỹ năng, số liệu STAR của ứng viên.

### Quyết định kiến trúc:
- Xây dựng dịch vụ `coverLetterService.ts` hoạt động như một Single-Player Utility độc lập.
- Tiếp nhận đầu vào từ `CandidateApplicationItem` và `StudentProfile` / `CVData`, tự động trích xuất các dự án phù hợp nhất với vị trí ứng tuyển để dệt vào bức thư ứng tuyển có cấu trúc chuẩn 4 phần (The 4-Paragraph Formula).
- Hỗ trợ lưu trữ bản nháp Cover Letter vào `localStorage` theo từng `applicationId` (`profilehub_cover_letter_${applicationId}`).

---

## 2. Best Practices in Modern Cover Letter & HR Email Design

### Cấu trúc 4 đoạn chuẩn mực (The 4-Paragraph Rule):
1. **The Hook (Mở đầu & Mục tiêu):** Nêu rõ vị trí ứng tuyển, nguồn biết tin, và tuyên ngôn giá trị cốt lõi (1 câu ngắn gọn về thế mạnh kỹ thuật).
2. **The Hero Project & Metric (Bằng chứng đồ án có số liệu):** Trích dẫn 1–2 đồ án tiêu biểu trong CV, làm nổi bật công nghệ và số liệu tối ưu cụ thể (VD: giảm 35% latency, xử lý 10,000 req/s) thay vì nói chung chung.
3. **The Company Alignment (Độ tương thích với doanh nghiệp):** Giải thích lý do chọn công ty này và cách công nghệ của mình giải quyết bài toán của họ.
4. **The Professional CTA (Kêu gọi hành động & Lời cảm ơn):** Lịch sự đề xuất một buổi trao đổi ngắn 15–20 phút và dẫn link minh chứng đồ án `/verify/:code`.

### 3 Phong cách viết (Tone Presets):
1. **Professional / Corporate:** Giọng văn trang trọng, chuẩn mực, phù hợp tập đoàn lớn, ngân hàng, bảo hiểm (FPT, Viettel, Vietcombank...).
2. **Startup / Product-Driven:** Giọng văn năng động, nhấn mạnh tinh thần làm chủ (ownership), khả năng học nhanh và tình yêu sản phẩm (Shopee, VNG, MoMo, startup...).
3. **Technical Direct:** Nhắm trực tiếp vào Tech Lead / Engineering Manager, đi thẳng vào tech stack, trade-offs kiến trúc và giải pháp tối ưu.

---

## 3. Email Template Specs (Chuẩn Outbound Email cho HR)

- **Subject Line Formula:** `[Ứng Tuyển] [Vị Trí] - [Họ Tên] - [Trường / Chuyên Ngành]`
- **Body Length:** Dưới 150 từ, dễ đọc lướt trên điện thoại trong 15 giây.
- **Attachment Reminder:** Tự động đính kèm nhắc nhở kiểm tra file CV PDF và đường dẫn Cổng bảo chứng trực tiếp.
