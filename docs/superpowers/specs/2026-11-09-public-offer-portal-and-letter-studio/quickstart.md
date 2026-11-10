# Hướng Dẫn Nghiệm Thu Nhanh (Quickstart & Verification Guide)

> **Feature:** `SPEC-20261109-PUBLIC-OFFER-PORTAL`  
> **Tài liệu:** `quickstart.md`

---

## 🚀 Kịch Bản Kiểm Thử & Nghiệm Thu Toàn Trình (End-to-End Walkthrough)

### Kịch Bản 1: Nhà Tuyển Dụng Soạn & Phát Hành Thư Mời
1. Đăng nhập với vai trò Nhà tuyển dụng và mở trang `http://localhost:5173/recruiter/pipeline`.
2. Trên thẻ của một ứng viên đang ở cột *Phỏng Vấn (Interviewing)* hoặc *Duyệt Tuyển (Accepted)*, bấm nút `[ ✉️ Soạn Thư Mời Offer ]`.
3. Modal **Offer Letter Studio** mở ra:
   - Các trường thông tin tên ứng viên, vị trí, công ty và mức lương đã được tự động điền sẵn.
   - Nhập ngày bắt đầu làm việc (VD: `2026-12-01`), hạn phản hồi (VD: `2026-11-20`).
   - Tích chọn các phúc lợi: *💻 MacBook Pro M3*, *🏥 Bảo hiểm sức khỏe VIP*, *🏖️ 15 ngày phép*.
   - Bấm nút `[ 🚀 Phát Hành Thư Mời & Tạo Link Công Khai ]`.
4. Hệ thống hiển thị hộp thoại thông báo phát hành thành công kèm đường link công khai dạng:
   `http://localhost:5173/offer/off_sec_xxxxxxxxxxxx` và nút `[ 📋 Sao Chép Link ]`.

---

### Kịch Bản 2: Ứng Viên Truy Cập Công Khai & Ký Nhận Việc (Moments of Delight)
1. Mở cửa sổ trình duyệt **Ẩn danh (Incognito)** để mô phỏng người ngoài hoàn toàn chưa đăng nhập.
2. Dán đường link `http://localhost:5173/offer/off_sec_xxxxxxxxxxxx` vào thanh địa chỉ.
3. **Kỳ vọng hiển thị:**
   - Trang web tải ngay lập tức mà **KHÔNG** bị chuyển hướng về `/login`.
   - Banner công ty kèm Tích xanh ĐKKD, dòng chào đón cá nhân hóa trang trọng.
   - Bảng phân tích lương chính thức và lương thử việc rõ ràng.
   - Lưới thẻ phúc lợi và đồng hồ đếm ngược thời gian chấp nhận thư mời.
4. Cuộn xuống phần Chữ Ký Số:
   - Nhập họ tên vào ô chữ ký điện tử: *"Nguyễn Văn An"*.
   - Bấm nút `[ 🎉 Xác Nhận Nhận Việc ]`.
5. **Kỳ vọng phản hồi:**
   - Hiệu ứng pháo hoa Confetti rực rỡ xuất hiện trên màn hình.
   - Trạng thái trang đổi sang thiệp chúc mừng chính thức: *"Chúc mừng bạn đã chính thức trở thành thành viên của [Tên Công Ty]!"*.
   - Có nút in/lưu thư mời PDF trang trọng.

---

### Kịch Bản 3: Đồng Bộ Tự Động Về Pipeline Của Doanh Nghiệp
1. Quay lại tab Nhà tuyển dụng trên trang `CandidatePipeline.tsx`.
2. Thẻ của ứng viên *"Nguyễn Văn An"* đã tự động chuyển sang cột **"Đã Tuyển (Hired)"** với dấu tích xanh hoàn thành!
