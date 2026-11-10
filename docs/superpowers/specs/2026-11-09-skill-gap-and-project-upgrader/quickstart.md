# Hướng Dẫn Kiểm Thử Nhanh: Chẩn Đoán Skill-Gap & Kiểm Định Codebase
> **Mã đặc tả:** `SPEC-20261109-SKILL-GAP-UPGRADER`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [`data-model.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-09-skill-gap-and-project-upgrader/data-model.md), [`contracts/skill-gap-upgrader-api.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-09-skill-gap-and-project-upgrader/contracts/skill-gap-upgrader-api.md)

---

## 🚀 Kịch Bản Kiểm Thử Nhanh (End-to-End Validation Scenarios)

### Kịch Bản 1: Chẩn Đoán Khoảng Cách Kỹ Năng Từ Trang Tin Tuyển Dụng
1. Khởi chạy ứng dụng: `npm run dev` và đăng nhập tài khoản sinh viên (hoặc tài khoản demo).
2. Điều hướng tới trang Việc Làm Sinh Viên: `http://localhost:5173/student/jobs`.
3. Tìm kiếm công việc bất kỳ (ví dụ: *"Senior Frontend Engineer"* hoặc *"NodeJS Backend Developer"*).
4. **Hành động:** Bấm vào nút `[ ⚡ Chẩn Đoán Skill-Gap ]` màu hổ phách/tím cạnh nút nộp đơn.
5. **Kết quả mong đợi:**
   - Modal `SkillGapDiagnosticModal` hiển thị mượt mà.
   - Thanh tiến trình hiển thị điểm sẵn sàng tuyển dụng (ví dụ: `65%`).
   - Cột trái hiển thị các kỹ năng đã đạt: React, TypeScript, Git.
   - Cột phải hiển thị các kỹ năng còn thiếu: Docker, Redis, Vitest (có gắn nhãn `Critical` hoặc `Recommended`).
   - Phía dưới hiển thị các thẻ công thức nâng cấp đồ án (Mini-action Recipes).

---

### Kịch Bản 2: Hoàn Thành Mini-Action Recipe & Tự Động Nâng Hạng Điểm Sẵn Sàng
1. Trong modal chẩn đoán, mở chi tiết Recipe: *"Tích hợp Redis Caching cho API"*.
2. Xem hướng dẫn 3 bước và đoạn mã mẫu thực chiến.
3. Bấm vào nút `[ ✅ Đánh dấu đã áp dụng vào Đồ án ]`.
4. **Kết quả mong đợi:**
   - Recipe chuyển trạng thái sang `completed` với dấu tích xanh.
   - Điểm `readinessScore` ngay lập tức tăng lên (ví dụ: từ `65%` lên `80%`).
   - Thông tin được lưu vào `localStorage`, tải lại trang không bị mất trạng thái.

---

### Kịch Bản 3: Kiểm Định Sức Khỏe Mã Nguồn Từ Trang Đồ Án Cá Nhân
1. Điều hướng tới trang Quản lý Đồ án: `http://localhost:5173/my-projects`.
2. Trên thẻ của một đồ án đã có link GitHub (ví dụ: *"Hệ thống sàn TMĐT microservices"*):
3. **Hành động:** Bấm vào nút `[ 🔍 Kiểm Định Codebase ]`.
4. **Kết quả mong đợi:**
   - Modal `CodeHealthDiagnosticModal` mở ra với hiệu ứng phân tích trực quan.
   - Hiển thị điểm số Codebase (ví dụ: `85/100`) và Huy hiệu phân bậc `A+ Production-Ready`.
   - Bảng Checklist 5 tiêu chí:
     - [X] Có tài liệu `README.md`
     - [X] Có file `.gitignore`
     - [X] Không lộ file `.env` chứa mật khẩu
     - [X] Có bộ kiểm thử Unit Tests
     - [X] Có cấu hình CI/CD GitHub Actions
   - Nút sao chép Markdown Badge dẫn link bảo chứng hoạt động tức thì.

---

### Kịch Bản 4: Bộ Kiểm Thử Tự Động (Automated Vitest Suite)
Chạy lệnh kiểm thử độc lập từ terminal:
```bash
npx vitest run src/services/skillGapService.test.ts src/services/codeHealthService.test.ts
```
**Tiêu chí đạt:** 100% test cases pass, thời gian thực thi < 2 giây, không có cảnh báo unhandled exceptions.
