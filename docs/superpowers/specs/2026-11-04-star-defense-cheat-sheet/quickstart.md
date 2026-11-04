# Quickstart & Verification Guide: STAR Defense Cheat-Sheet

Tài liệu hướng dẫn kiểm chứng tính năng Phao Cứu Sinh Giải Trình Số Liệu Phỏng Vấn & Bảo Vệ Câu Chữ STAR.

---

## 1. Kiểm Thử Tự Động (Automated Verification)

```bash
# 1. Kiểm tra tính toàn vẹn kiểu dữ liệu TypeScript (Strict Mode)
npm run build

# 2. Chạy test suite chuyên biệt cho STAR Defense Service
npx vitest run src/services/starDefenseService.test.ts

# 3. Chạy toàn bộ test suites của dự án (Đảm bảo 0 regressions)
npm run test
```

---

## 2. Kịch Bản Kiểm Chứng Trực Quan (Manual UI Walkthrough)

### Kịch bản 1: Mở Phao Cứu Sinh từ gạch đầu dòng dự án trên CV
1. Đăng nhập tài khoản Sinh viên $\to$ Mở trình chỉnh sửa CV (`InteractiveCVCanvas.tsx`).
2. Di chuột vào một gạch đầu dòng dự án có chứa số liệu (VD: *"Tối ưu hóa thời gian tải trang giảm 35% bằng lazy loading"*).
3. Nhấp vào icon chiếc khiên bảo vệ `[🛡️ Phao giải trình]`.
4. **Kỳ vọng:** Modal `StarDefenseModal` mở ra, hiển thị ngay:
   - **Cơ sở số liệu:** Công cụ đo Chrome DevTools / Lighthouse, giải thích Before (2.5s) và After (1.6s).
   - **Top câu hỏi bẫy:** *"Làm sao em biết là do lazy loading chứ không phải do mạng nhanh hơn?"*, *"Lazy loading có ảnh hưởng tới SEO hoặc Cumulative Layout Shift (CLS) không?"*.
   - **Kịch bản trả lời 30s:** Đoạn văn mẫu chuẩn chỉnh kỹ thuật để ứng viên tự tin nói lưu loát.

### Kịch bản 2: Bật Chế độ Ôn Luyện Nhanh (Flashcard Rehearsal Mode)
1. Trong `StarDefenseModal` hoặc tab Phao cứu sinh của `ProjectDefenseModal`, chọn chế độ **"Lật Thẻ Ôn Luyện (Flashcards)"**.
2. Thẻ hiển thị câu hỏi bẫy của Tech Lead.
3. Ứng viên tự nhẩm câu trả lời trong đầu $\to$ Bấm **"Lật Thẻ"** để xem kịch bản trả lời 30s và đối chiếu.
4. **Kỳ vọng:** Giúp ứng viên rèn luyện phản xạ không bị khớp khi phỏng vấn trực tiếp.

### Kịch bản 3: Tự thêm ghi chú giải trình cá nhân & Xuất bản Markdown
1. Tại mục "Ghi chú cá nhân của bạn", nhập thêm chi tiết thực tế: *"Đồ án này mình đo trên máy Macbook chip M1 qua mạng Wifi gia đình 50Mbps"*.
2. Bấm **"Lưu ghi chú"**.
3. Bấm nút **"Xuất Markdown / Copy Phao"**.
4. **Kỳ vọng:** Lưu thành công vào localStorage; Clipboard nhận toàn bộ nội dung Markdown có cấu trúc để paste vào Notion/điện thoại mang theo.
