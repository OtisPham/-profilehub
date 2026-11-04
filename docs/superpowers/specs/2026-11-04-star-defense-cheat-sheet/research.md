# Nghiên Cứu Kỹ Thuật (Phase 0: Technical Research & Architectural Decisions)
**Tính năng:** STAR Defense Cheat-Sheet & Metric Justification (Phao Cứu Sinh Giải Trình Số Liệu Phỏng Vấn)  
**Mã tính năng:** `FEAT-20261104-STAR-DEFENSE`  
**Ngày thực hiện:** 04/11/2026  

---

## 1. Bối Cảnh & Vấn Đề Cốt Lõi (Core Problem)
- **Góc khuất tâm lý ứng viên (GK-01):** Sinh viên và Junior Developer thường dùng AI (hoặc các mẫu template) để viết các câu đạn STAR ấn tượng như *"Tối ưu hóa query database giảm 45% latency"* hoặc *"Tăng 30% tốc độ render với memoization"*.
- **Cơn ác mộng phỏng vấn:** Khi đối mặt với Tech Lead / Senior Engineer, họ thường xuyên bị vặn hỏi trực diện vào từng con số:
  - *"Con số 45% này em đo bằng công cụ gì? Trước tối ưu là bao nhiêu ms, sau tối ưu là bao nhiêu ms?"*
  - *"Tại sao lại dùng Redis thay vì Local Memory Cache? Đã tính đến rủi ro Cache Stampede chưa?"*
  - *"Đồ án trường học lấy đâu ra 10.000 người dùng thực tế mà em bảo chịu tải cao?"*
- Nếu không chuẩn bị trước, ứng viên sẽ ấp úng, lộ rõ việc "chém gió / fake số liệu" hoặc mắc hội chứng kẻ giả mạo (Imposter Syndrome).
- **Mục tiêu giải pháp:** Cung cấp cho ứng viên một "phao cứu sinh" (Cheat-Sheet) chi tiết đến từng dòng mô tả trong CV, cung cấp sẵn:
  1. Nguồn gốc & công cụ đo đạc số liệu (Metric Basis & Measurement Tools: Lighthouse, Chrome DevTools Network Tab, Apache Bench `ab`, PostgreSQL `EXPLAIN ANALYZE`).
  2. Top 3 câu hỏi bẫy xoáy kỹ thuật thường gặp nhất ứng với công nghệ và chỉ số đó.
  3. Kịch bản trả lời 30 giây gãy gọn, trung thực nhưng toát lên tư duy kỹ thuật chuẩn mực của một lập trình viên có trách nhiệm.
  4. Cảnh báo các từ khóa "đao to búa lớn" (Buzzwords: Microservices, 99.99% Uptime, High Concurrency...) kèm gợi ý thay thế an toàn.

---

## 2. Quyết Định Kiến Trúc (Architectural Decisions)

### Quyết định 1: Cơ Chế Phân Tích Kép (Hybrid Rule Engine + AI Fallback)
- **Quyết định:** Xây dựng `starDefenseService.ts` với kiến trúc Rule-based Matrix tích hợp sẵn từ điển tri thức kỹ thuật phong phú (React, TypeScript, Node.js, Express, PostgreSQL, MySQL, Redis, Tailwind CSS, Docker, Vite, RESTful API, Next.js...).
- **Lý do:**
  - Hoạt động 100% tức thì (< 50ms), không phụ thuộc vào kết nối mạng hay API key bên thứ ba.
  - Zero-Cost (không tốn token OpenRouter hay Gemini API).
  - Có hook mở rộng gọi AI prompt nếu người dùng cấu hình API key cá nhân và muốn phân tích câu mô tả độc lạ.
- **Phương án thay thế đã cân nhắc:**
  - *Chỉ dùng AI LLM qua API:* Bị phụ thuộc mạng, có độ trễ 2-5s, dễ gặp sự cố hết hạn token của người dùng. $\to$ **Loại bỏ**.

### Quyết định 2: Điểm Chạm Giao Diện (UI Touchpoints)
- **Điểm chạm 1: Ngay trên CV Canvas (`InteractiveCVCanvas.tsx`):**
  - Cạnh mỗi gạch đầu dòng dự án hoặc kinh nghiệm có icon `[🛡️ Phao]` tinh tế. Click vào hiển thị ngay `StarDefenseModal` phân tích riêng dòng đó.
- **Điểm chạm 2: Tích hợp vào `ProjectDefenseModal.tsx`:**
  - Thêm tab thứ 5: **"🛡️ Phao Giải Trình STAR"** cho phép duyệt qua tất cả các bullet points của toàn bộ đồ án đang chọn mà không cần mở từng popover.
- **Điểm chạm 3: Flashcard Rehearsal Mode (Chế độ Ôn Luyện Nhanh):**
  - Chế độ lật thẻ 2 mặt (Mặt trước: Câu hỏi vặn của Tech Lead - Mặt sau: Kịch bản trả lời 30s + Công cụ đo) để ứng viên cầm điện thoại ôn nhanh trước khi bước vào phòng phỏng vấn 15 phút.

### Quyết định 3: Khả Năng Lưu Trữ & Tùy Biến (Custom Defense Notes)
- **Quyết định:** Cho phép ứng viên sửa đổi hoặc bổ sung ghi chú giải trình riêng của mình cho từng bullet point. Dữ liệu được lưu trong `localStorage` với key `profilehub_star_defense_${userId}`.
- **Hỗ trợ Export:** 1-Click sao chép toàn bộ Cheat-Sheet dạng Markdown hoặc xuất tệp TXT/Print để mang vào phòng phỏng vấn.
