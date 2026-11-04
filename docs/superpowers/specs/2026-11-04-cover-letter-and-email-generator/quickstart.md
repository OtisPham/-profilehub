# Quickstart & Verification Guide: Cover Letter & Email Generator

Hướng dẫn kiểm thử và xác minh tính năng Bộ Hồ Sơ Ứng Tuyển Toàn Diện (Cover Letter & Outbound Email).

---

## 1. Kiểm Thử Tự Động (Automated Testing)

```bash
# 1. Chạy riêng bộ kiểm thử Cover Letter Service
npx vitest run src/services/coverLetterService.test.ts

# 2. Chạy toàn bộ test suites của ProfileHub
npm run test

# 3. Kiểm tra TypeScript Strict Mode và Bundle
npm run build
```

---

## 2. Kịch Bản Kiểm Thử Giao Diện Thủ Công (Manual E2E Walkthrough)

### Kịch bản 1: Mở và sinh Cover Letter từ Kanban Board
1. Vào trang Tuyển dụng & Nộp đơn: `/student/jobs` $\to$ chuyển sang tab **Tiến trình nộp đơn (Kanban)**.
2. Tại bất kỳ thẻ công ty nào (VD: *FPT Software* hoặc *Shopee*), bấm nút **[✉️ Thư Ứng Tuyển]**.
3. **Kỳ vọng:**
   - Modal `CoverLetterModal` mở lên tức thì với tên công ty và vị trí ứng tuyển được điền tự động.
   - Thư ứng tuyển được sinh ra với 4 đoạn chuẩn mực, có trích dẫn đúng đồ án kỹ thuật của ứng viên.
   - Chuyển đổi giữa 3 Tone: *Chuyên nghiệp*, *Startup*, *Kỹ thuật* cập nhật câu chữ linh hoạt.

### Kịch bản 2: Sao chép Mẫu Email gửi HR
1. Trong modal, chuyển sang tab **"Mẫu Email Gửi HR"**.
2. **Kỳ vọng:**
   - Thấy ô Tiêu đề email (Subject Line) chuẩn: `[Ứng Tuyển] [Vị Trí] - [Tên Sinh Viên] - CV & Portfolio`.
   - Bấm nút **"Sao chép Tiêu Đề"** hoặc **"Sao chép Toàn Bộ Email"** xuất hiện toast báo sao chép thành công.

### Kịch bản 3: Lưu nháp và tải Markdown
1. Chỉnh sửa một vài câu văn trong ô soạn thảo của bức thư.
2. Bấm nút **"Lưu bản nháp"** hoặc **"Tải File Markdown (.md)"**.
3. Đóng modal và mở lại: Các chỉnh sửa cá nhân vẫn được bảo toàn nguyên vẹn từ `localStorage`.
