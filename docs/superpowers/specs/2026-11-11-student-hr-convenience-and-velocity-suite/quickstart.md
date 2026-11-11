# Hướng Dẫn Kiểm Thử Nhanh: Bộ Tiện Ích Siêu Tốc Độ Tuyển Dụng
> **Mã đặc tả:** `SPEC-20261111-VELOCITY-SUITE`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [`data-model.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-11-student-hr-convenience-and-velocity-suite/data-model.md), [`contracts/velocity-suite-api.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-11-student-hr-convenience-and-velocity-suite/contracts/velocity-suite-api.md)

---

## 🚀 Kịch Bản Kiểm Thử Xác Thực Nhanh (End-to-End Validation)

### Kịch Bản 1: Duyệt Ứng Viên Bằng Phím Tắt Trên Speed Screener (HR)
1. Truy cập trang `/recruiter/pipeline`.
2. Tại thanh công cụ trên cùng, nhấn nút `[ ⚡ Speed Screener (Phím tắt) ]` hoặc nhấn phím `Space`.
3. **Thao tác:**
   - Nhấn phím `J` và `K` để lướt qua lại giữa các ứng viên. Màn hình bên phải phải cập nhật tức thì CV và link Demo mà không giật màn hình.
   - Nhấn phím `A`: Ứng viên lập tức được chuyển vào cột `Phỏng Vấn` với thông báo xác nhận.
   - Nhấn phím `R`: Ứng viên chuyển vào cột `Từ Chối` kèm thông báo lý do.
   - Nhấn `Esc` để đóng chế độ Speed Screener.
4. **Tiêu chuẩn đạt:** Phản hồi chuyển đổi dưới $50ms$, phím tắt không bị xung đột với các ô nhập văn bản.

---

### Kịch Bản 2: Đồng Bộ Lịch Phỏng Vấn Vào Google Calendar & Apple Calendar (Sinh viên)
1. Tại Dashboard sinh viên hoặc trong Sổ tay phỏng vấn cá nhân, tìm một sự kiện phỏng vấn sắp tới.
2. **Thao tác:**
   - Nhấp vào nút `[ 📅 Thêm vào Google Calendar ]`.
   - Một tab mới mở ra trên `calendar.google.com` với đầy đủ: Tiêu đề công ty, giờ bắt đầu/kết thúc, link phòng họp Google Meet và ghi chú chuẩn bị.
   - Nhấp nút `[ Tải file .ics ]`: Tệp `.ics` được tải xuống máy, nhấp mở tạo sự kiện chuẩn xác trên Apple Calendar/Outlook.
3. **Tiêu chuẩn đạt:** Đúng định dạng RFC 5545, đúng múi giờ GMT+7, không bị lỗi mã hóa tiếng Việt.

---

### Kịch Bản 3: Chọn Khung Giờ Phỏng Vấn Tự Động Hai Chiều (Smart Slot Picker)
1. **Phía HR:** Kéo một ứng viên vào cột `Phỏng Vấn`. Tại modal, chọn 3 khung giờ rảnh và bấm `[ Mở Khung Giờ & Gửi Ứng Viên ]`.
2. **Phía Sinh viên:** Mở Dashboard thấy thông báo mời chọn lịch phỏng vấn.
3. **Thao tác:** Chọn 1 khung giờ rảnh và bấm `[ Xác Nhận Khung Giờ Này ]`.
4. **Kết quả mong đợi:**
   - Thẻ của ứng viên trên Kanban tự động cập nhật trạng thái `Đã Chốt Lịch: [Khung Giờ Đã Chọn]`.
   - Cung cấp nút `[ Thêm vào Google Calendar ]` cho cả hai bên ngay lập tức.
5. **Tiêu chuẩn đạt:** Ngăn chặn xung đột giờ, không cần gửi email qua lại.

---

### Kịch Bản 4: Gửi Email Hàng Loạt Với Thẻ Biến Động (HR)
1. Tại Pipeline Kanban, tích chọn 3 ứng viên ở cột `Từ Chối` (hoặc bấm `Chọn tất cả trong cột`).
2. Nhấn nút `[ ✉️ Gửi Email Hàng Loạt ]`.
3. Chọn mẫu: *"Thư Cảm Ơn & Lưu Trữ Hồ Sơ"*.
4. **Kết quả mong đợi:**
   - Nội dung email hiển thị xem trước đã được thay thế biến động chính xác: Tên ứng viên, Vị trí ứng tuyển, Tên công ty.
   - Cung cấp nút `[ Mở Ứng Dụng Email (mailto) ]` và `[ Sao Chép Tất Cả Vào Clipboard ]`.
5. **Tiêu chuẩn đạt:** Merge tags thay thế 100% chính xác, không để sót biến `{...}` thô.

---

### Kịch Bản 5: Mở Thẻ Tác Chiến 60s Trước Giờ Phỏng Vấn (Sinh viên)
1. Truy cập trang cá nhân hoặc Dashboard trên điện thoại di động (hoặc kích thước màn hình responsive $\le 480px$).
2. Chạm vào nút `[ ⚡ Thẻ Tác Chiến 60s ]`.
3. **Kết quả mong đợi:**
   - Modal/Flashcard mở ra với 4 khối thông tin cô đọng: 3 câu Elevator Pitch, 3 chỉ số kỹ thuật đinh của đồ án (Lighthouse, RPS, Coverage), 1 câu chuyện STAR xử lý bug khó và 3 câu hỏi hỏi ngược lại nhà tuyển dụng.
   - Bật chế độ Airplane Mode (ngắt mạng) và thử mở lại thẻ: Dữ liệu vẫn hiển thị nguyên vẹn từ LocalStorage.
4. **Tiêu chuẩn đạt:** Mở tức thì dưới $100ms$, hoạt động hoàn hảo khi ngoại tuyến.

---

### Kịch Bản 6: Chạy Bộ Kiểm Thử Đơn Vị Tự Động (Vitest)
```bash
npm run test
```
**Tiêu chí đạt:** Toàn bộ test suite pass 100%, không phát sinh lỗi TypeScript (`tsc --noEmit`).
