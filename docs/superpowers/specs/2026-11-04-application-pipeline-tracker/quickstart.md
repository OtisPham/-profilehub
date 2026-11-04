# Quickstart & Verification Guide: Application Pipeline Tracker

Tài liệu hướng dẫn kiểm chứng nhanh tính năng Bảng Kanban Theo Dõi Tiến Trình Ứng Tuyển.

## 1. Kiểm thử tự động (Automated Verification)

```bash
# 1. Kiểm tra tính toàn vẹn kiểu dữ liệu
npm run build

# 2. Chạy test suite chuyên biệt cho Application Tracker
npx vitest run src/services/applicationTrackerService.test.ts

# 3. Chạy toàn bộ 34 test suites của dự án
npm run test
```

## 2. Kịch bản kiểm chứng trực quan (Manual UI Walkthrough)

### Kịch bản 1: Mở bảng Kanban và thêm đơn nộp mới
1. Đăng nhập tài khoản Sinh viên $\to$ Truy cập trang **Việc làm** (`/student/jobs`).
2. Bấm vào tab: **"📋 Tiến Trình Ứng Tuyển (Kanban)"**.
3. Bấm nút: **`[ + Thêm Đơn Ứng Tuyển Mới ]`**.
4. Nhập:
   - Tên công ty: `VNG Corporation`
   - Vị trí: `Frontend React Fresher`
   - Nguồn nộp: `TopCV`
   - Chọn bản CV: `CV_Frontend_React_2026`
   - Mức lương: `12 - 15 triệu`
5. Bấm **"Lưu Đơn"**.
6. **Kỳ vọng:** Thẻ công ty VNG xuất hiện ngay lập tức tại cột `[Đã nộp]` với huy hiệu TopCV màu xanh.

### Kịch bản 2: 1-Click mở lại đúng bản CV đã gửi
1. Tại thẻ VNG trên Kanban, bấm nút **`[ 📄 Xem CV Đã Nộp ]`**.
2. **Kỳ vọng:** Modal `CvQuickViewModal` mở ra, hiển thị chính xác bản CV `CV_Frontend_React_2026` để ứng viên ôn lại câu từ trước khi trao đổi với HR.

### Kịch bản 3: Kéo/chuyển trạng thái sang Phỏng Vấn & kích hoạt AI Coach
1. Chuyển thẻ VNG từ cột `[Đã nộp]` sang `[Phỏng Vấn]`.
2. Bấm nút **`[ 🎙️ Luyện Phỏng Vấn AI ]`** ngay trên thẻ.
3. **Kỳ vọng:** Modal `AiMockInterviewModal` tự động mở ra, điền sẵn tiêu đề vị trí và tên công ty VNG để ứng viên bắt đầu phòng phỏng vấn giả lập ngay.
