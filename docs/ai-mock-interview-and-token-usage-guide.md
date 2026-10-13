# Hướng Dẫn Kỹ Thuật & Quản Lý Token AI Mock Interview (ProfileHub)

> **Tài liệu lưu trữ:** Dành cho Sinh viên, Giảng viên & Đội ngũ Phát triển  
> **Tính năng:** AI Phỏng Vấn Kỹ Thuật Giả Lập & Phân Tích Điểm Mù Kiến Thức  
> **Ngày cập nhật:** 24/09/2026  

---

## 📌 1. Tổng Quan Tính Năng (Feature Overview)

Tính năng **AI Phỏng Vấn Kỹ Thuật Giả Lập & Phân Tích Điểm Mù Kiến Thức (AI Mock Interview & Knowledge Blind Spot Engine)** giải quyết bài toán giúp sinh viên CNTT rèn luyện khả năng trả lời phỏng vấn trực tiếp với AI, phát hiện sớm các lỗ hổng kiến thức thực hành và tự động sinh ra đồ án khắc phục.

### Các luồng hoạt động chính:
1. **Cấu hình Phỏng vấn (`MockInterviewSetupModal`)**:
   - Tự động gợi ý danh mục Tech Stack dựa trên Hồ sơ / Đồ án sinh viên đã đăng tải.
   - Tùy chỉnh Cấp độ (`Intern`, `Fresher`, `Junior`) hoặc Dán nội dung Job Description (JD) bất kỳ từ nhà tuyển dụng.
2. **Hội thoại Phỏng vấn Thích ứng (`MockInterviewChatView`)**:
   - Real-time Interactive Chat: AI hỏi từng câu -> Sinh viên gõ câu trả lời (có thể đính kèm Code Snippet).
   - AI phân tích câu trả lời trước đó để thích ứng đưa ra câu hỏi tiếp theo (Adaptive Interviewing).
   - Thanh tiến trình 5 câu hỏi (`Câu X/5`) kèm nút **"Kết thúc & Phân tích ngay"** cho phép tạo báo cáo sớm.
3. **Báo cáo Phân tích Điểm mù Kiến thức (`BlindSpotReportModal`)**:
   - **Thang điểm 100**: Đánh giá tổng quan năng lực phỏng vấn.
   - **Ma trận Điểm mù**: Danh sách lỗ hổng kiến thức kèm mức độ nghiêm trọng (`High` / `Medium` / `Low`) và hướng khắc phục.
   - **1-Click Tải File Spec (`README-spec.md`)**: Tải về tệp đặc tả đồ án thực hành giúp khắc phục đúng điểm mù (kết nối trực tiếp với luồng `AI Project Recommendation`).
4. **Lịch sử Phỏng vấn & Replay (`StudentMockInterviewsPage`)**:
   - Quản lý danh sách các bài phỏng vấn đã tạo tại giao diện `/mock-interview`.
   - Cho phép chọn bất kỳ bài phỏng vấn nào trong quá khứ để tua lại (Replay) toàn bộ đối thoại chat và xem lại báo cáo điểm mù.

---

## 🏗️ 2. Kiến Trúc Dữ Liệu & Database (Supabase)

### Cấu trúc bảng `mock_interviews` (Single Table JSON Payload):
Tệp migration SQL khởi tạo: [`Database-Mock-Interviews.sql`](file:///C:/Users/ADMIN/Desktop/STUDY/PROFILEHUB/Database-Mock-Interviews.sql)

| Tên Cột | Kiểu Dữ Liệu | Mô Tả |
| :--- | :--- | :--- |
| `id` | `UUID` | Khóa chính (Primary Key), tự động tạo bằng `gen_random_uuid()` |
| `student_id` | `UUID` | Khóa ngoại liên kết tới `auth.users(id)` |
| `topic` | `TEXT` | Chủ đề phỏng vấn (VD: *ReactJS & Frontend Architecture*) |
| `level` | `TEXT` | Cấp độ phỏng vấn (Mặc định: *Intern / Fresher*) |
| `jd_content` | `TEXT` | Nội dung Job Description dán kèm (Nếu có) |
| `status` | `TEXT` | Trạng thái: `'in_progress'` hoặc `'completed'` |
| `overall_score` | `INT` | Điểm số đánh giá tổng quan (Thang điểm 0 - 100) |
| `messages` | `JSONB` | Mảng lưu trữ toàn bộ lịch sử tin nhắn chat |
| `report` | `JSONB` | Khối JSON lưu trữ kết quả Báo cáo Phân tích Điểm mù |
| `created_at` | `TIMESTAMPTZ` | Thời gian tạo phiên phỏng vấn |
| `updated_at` | `TIMESTAMPTZ` | Thời gian cập nhật tin nhắn / báo cáo gần nhất |

### Bảo mật Row Level Security (RLS):
Dữ liệu lịch sử phỏng vấn và điểm mù là **bảo mật riêng tư cá nhân (Student-Only)**. Chỉ tài khoản sinh viên sở hữu (`auth.uid() = student_id`) mới có quyền `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

---

## ⚡ 3. Hướng Dẫn Sử Dụng Token & Hạn Ngạch Gemini API (Token & Quota Guide)

### Hạn Ngạch Gói Miễn Phí (Google AI Studio Free Tier Limits):
Mô hình AI được tích hợp là **Gemini 1.5 Flash (`gemini-1.5-flash`)** với các mức hạn ngạch công khai từ Google:

* **15 RPM (Requests Per Minute)**: Tối đa 15 lượt gọi API trong vòng 1 phút.
* **1.500 RPD (Requests Per Day)**: Tối đa 1.500 lượt gọi API trong vòng 1 ngày (24 giờ).
* **1.000.000 TPM (Tokens Per Minute)**: Tối đa 1 triệu tokens truy cập trong 1 phút.

### Uớc Tính Tiêu Tốn Token Cho Một Phiên Phỏng Vấn:

| Tác Vụ | Số Lượng Lượt Gọi API | Số Token Ước Tính |
| :--- | :---: | :---: |
| **01 Lượt Chat** (AI hỏi + Sinh viên gõ trả lời) | 1 request | ~300 – 800 tokens |
| **Trọn bộ Chat 5 câu hỏi** | 5 requests | ~2.500 – 4.000 tokens |
| **Tạo Báo cáo Phân tích Điểm mù (JSON)** | 1 request | ~1.000 – 2.000 tokens |
| **TỔNG CỘNG 01 PHIÊN PHỎNG VẤN HOÀN CHỈNH** | **6 requests** | **~3.500 – 6.000 tokens** |

👉 Với 1.500 requests/ngày của gói Free Tier, bạn có thể thực hiện tối đa tới **250 phiên phỏng vấn đầy đủ mỗi ngày** hoàn toàn miễn phí.

---

## ⚠️ 4. Các Tình Huống Giới Hạn Token & Cách Xử Lý Lỗi

### 1. Lỗi quá 15 câu hỏi / phút (`429 Rate Limit / Too Many Requests`)
* **Nguyên nhân:** Gửi câu hỏi quá nhanh liên tục vượt quá 15 lượt trong 1 phút.
* **Cách khắc phục:** Hệ thống hiển thị thông báo lỗi. Bạn chỉ cần giữ nguyên màn hình và **chờ 60 giây (1 phút)** là có thể tiếp tục phỏng vấn bình thường.

### 2. Lỗi hết hạn ngạch ngày (`1.500 RPD Limit Exceeded`)
* **Nguyên nhân:** Đã dùng hết 1.500 lượt gọi API trong ngày.
* **Cách khắc phục:** 
  - Đợi sang ngày hôm sau (Hạn ngạch tự động reset sau 24h).
  - Hoặc tạo API Key mới từ tài khoản Google khác tại [Google AI Studio](https://aistudio.google.com/) và cập nhật vào file `.env`.

### 3. Lỗi chưa cấu hình API Key (`Thiếu VITE_GEMINI_API_KEY`)
* **Nguyên nhân:** Chưa khai báo biến `VITE_GEMINI_API_KEY` trong file `.env` ở thư mục gốc `portfolio-web/`.
* **Cách khắc phục:**
  1. Mở file `portfolio-web/.env`.
  2. Bổ sung dòng cấu hình:
     ```env
     VITE_GEMINI_API_KEY=AIzaSy... (API Key của bạn)
     ```
  3. Khởi động lại Server Vite (`npm run dev`).

---

## 🔗 Tài liệu tham khảo liên quan trong Project:
* [CONTEXT.md](file:///C:/Users/ADMIN/Desktop/STUDY/PROFILEHUB/CONTEXT.md#L59-L80) — Thuật ngữ miền & Đặc tả tính năng cốt lõi ProfileHub.
* [SPEC.md](file:///C:/Users/ADMIN/Desktop/STUDY/PROFILEHUB/.scratch/ai-mock-interview/SPEC.md) — Bản mô tả yêu cầu kỹ thuật đầy đủ (PRD).
* [Database-Mock-Interviews.sql](file:///C:/Users/ADMIN/Desktop/STUDY/PROFILEHUB/Database-Mock-Interviews.sql) — Tệp SQL khởi tạo bảng Supabase.
