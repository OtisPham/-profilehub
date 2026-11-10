# Hướng Dẫn Nghiệm Thu Nhanh (Quickstart & Verification Guide)

> **Feature:** `SPEC-20261109-SOCIAL-CAREER-FEED`  
> **Tài liệu:** `quickstart.md`

---

## 🚀 Kịch Bản Kiểm Thử & Trải Nghiệm Mạng Xã Hội (End-to-End Walkthrough)

### Kịch Bản 1: Khách Mở Trang Chủ & Khám Phá Dòng Tin 3 Cột
1. Mở trình duyệt và truy cập `http://localhost:5173/`.
2. **Kỳ vọng giao diện:**
   - Trang chủ hiển thị giao diện 3 cột chuẩn LinkedIn / Product Hunt:
     - Cột trái: Mini Profile và danh mục bộ lọc nhanh.
     - Cột giữa: Hộp soạn bài nhanh và dòng tin bài viết phong phú.
     - Cột phải: Widget Việc làm hot và Đồ án được bảo chứng cao điểm.
   - Thấy ngay các bài viết đa dạng: Tuyển dụng có mức lương cụ thể, đồ án sinh viên có link GitHub/Demo, bài vinh danh chúc mừng nhận việc.

---

### Kịch Bản 2: Lọc Bài Viết & Tương Tác Thả Tim / Bình Luận
1. Tại thanh tab ở cột giữa hoặc menu cột trái, bấm chọn tab `[ 💼 Việc Làm IT ]`.
   - **Kỳ vọng:** Dòng tin chỉ lọc các bài tuyển dụng có dải lương và Tích Xanh doanh nghiệp.
2. Bấm chọn tab `[ 🚀 Đồ Án Bảo Chứng ]`.
   - **Kỳ vọng:** Dòng tin chỉ lọc các bài khoe đồ án có link Live Demo và GitHub code.
3. Bấm vào nút `[ ❤️ Thích ]` trên một bài viết bất kỳ:
   - **Kỳ vọng:** Số lượt thích tăng lên 1, biểu tượng đổi sang màu đỏ rực rỡ.
4. Mở khung bình luận, gõ: *"Đồ án này giao diện đẹp quá, bạn dùng thư viện 3D nào thế?"* và bấm gửi:
   - **Kỳ vọng:** Bình luận xuất hiện ngay lập tức dưới bài viết.

---

### Kịch Bản 3: Ứng Tuyển Nhanh 1-Click Từ Bài Đăng Việc Làm
1. Trên một bài đăng tuyển dụng (VD: *Tuyển Dụng Frontend ReactJS Fresher*):
2. Bấm nút **`[ 🚀 Ứng Tuyển Nhanh 1-Click ]`**:
3. **Kỳ vọng:**
   - Hệ thống hiển thị thông báo: *"🎉 Ứng tuyển thành công! Hồ sơ và đồ án bảo chứng của bạn đã được chuyển đến bộ phận tuyển dụng"*.
   - Dữ liệu ứng tuyển tự động được đồng bộ vào Pipeline của Nhà tuyển dụng.
