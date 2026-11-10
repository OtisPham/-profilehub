# Hướng Dẫn Kiểm Thử Nhanh: Thử Thách Kỹ Thuật & Bảng Chấm Điểm Phỏng Vấn
> **Mã đặc tả:** `SPEC-20261109-CHALLENGE-SCORECARD`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [`data-model.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-09-take-home-challenge-and-collaborative-scorecard/data-model.md), [`contracts/challenge-scorecard-api.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-09-take-home-challenge-and-collaborative-scorecard/contracts/challenge-scorecard-api.md)

---

## 🚀 Kịch Bản Kiểm Thử Nhanh (End-to-End Validation Scenarios)

### Kịch Bản 1: Giao Thử Thách Kỹ Thuật (Take-Home Challenge) Từ Pipeline
1. Đăng nhập tài khoản Nhà tuyển dụng (hoặc truy cập `/recruiter/pipeline`).
2. Tại cột **Sàng lọc (Screening)**, chọn một ứng viên bất kỳ:
3. **Hành động:** Bấm vào nút `[ 📝 Giao Thử Thách Kỹ Thuật ]`.
4. **Kết quả mong đợi:**
   - Modal `IssueChallengeModal` hiển thị mượt mà.
   - Chọn mẫu đề bài: *"Bổ sung API Phân quyền RBAC trên repo đồ án"*, thời hạn 48 giờ.
   - Bấm `[ Gửi Thử Thách Đến Ứng Viên ]`.
   - Thẻ ứng viên trên Kanban xuất hiện huy hiệu `⏱️ Thử thách 48h (Đang làm)` kèm đồng hồ đếm ngược.

---

### Kịch Bản 2: Sinh Viên Nộp Bài Giải Kèm Link GitHub Pull Request
1. Tại tab của Sinh viên (hoặc mở modal nộp bài `SubmitChallengeModal`):
2. **Hành động:** Nhập link GitHub PR (ví dụ: `https://github.com/student/repo/pull/12`) và ghi chú giải pháp.
3. Bấm `[ Nộp Bài Giải & Báo Cáo NTD ]`.
4. **Kết quả mong đợi:**
   - Trạng thái thử thách chuyển sang `submitted` (`✅ Đã nộp bài giải`).
   - Tab của Nhà tuyển dụng nhận thông báo đẩy thời gian thực kèm nút xem Diff code trên GitHub.

---

### Kịch Bản 3: Chấm Điểm Phỏng Vấn Với Bảng Chuẩn Hóa (Interview Scorecard)
1. Tại cột **Phỏng vấn (Interview)** trên `/recruiter/pipeline`:
2. **Hành động:** Bấm vào nút `[ 📊 Chấm Điểm Scorecard ]`.
3. **Kết quả mong đợi:**
   - Modal `InterviewScorecardModal` mở ra với 5 tiêu chuẩn vàng (Kiến trúc, Giải thích code, Gỡ lỗi, Giao tiếp, Văn hóa).
   - Chấm điểm từng tiêu chí (ví dụ: 5/5, 4/5, 5/5, 4/5, 5/5 -> Điểm bình quân 92/100).
   - Chọn đề xuất tuyển dụng: `🌟 Tuyển Ngay (Strong Hire)`.
   - Bấm `[ Lưu Phiếu Chấm Điểm ]`.
   - Trên thẻ ứng viên lập tức hiển thị huy hiệu `🌟 Scorecard: 92/100 (Strong Hire)`.

---

### Kịch Bản 4: Bật/Tắt Chế Độ Sàng Lọc Ẩn Danh (Blind Screening Mode)
1. Trên thanh công cụ của `/recruiter/pipeline` hoặc `/recruiter/candidates`:
2. **Hành động:** Gạt công tắc `[ 🕶️ Chế Độ Ẩn Danh (Blind Screening) ]`.
3. **Kết quả mong đợi:**
   - Tên toàn bộ ứng viên chuyển thành dạng mã hóa `Ứng viên #DEV-XXXX`.
   - Ảnh đại diện bị ẩn thành avatar trung tính; tên trường đại học bị làm mờ.
   - Các thông số kỹ thuật (Đồ án bảo chứng, Tech Stack, Điểm Codebase A+, Điểm Scorecard) vẫn hiển thị sắc nét.
   - Khi gạt tắt công tắc, danh tính thật lập tức hiển thị trở lại.

---

### Kịch Bản 5: Kiểm Thử Đơn Vị Tự Động (Vitest)
Chạy lệnh kiểm thử độc lập:
```bash
npx vitest run src/services/challengeScorecardService.test.ts
```
**Tiêu chí đạt:** 100% test cases pass, thời gian thực thi < 2 giây.
