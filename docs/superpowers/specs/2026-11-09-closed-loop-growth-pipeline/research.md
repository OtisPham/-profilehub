# Nghiên Cứu Kỹ Thuật: Hệ Thống Bánh Đà Tăng Trưởng Khép Kín (Closed-Loop Growth Pipeline)
> **Mã đặc tả:** `SPEC-20261109-GROWTH-PIPELINE`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [ProfileHub_Discovery_Requirements.md](file:///C:/Users/ADMIN/Desktop/STUDY/ProfileHub_Discovery_Requirements.md), [luong_chinh_he_thong.md](file:///C:/Users/ADMIN/Desktop/STUDY/docs/luong_chinh_he_thong.md)

---

## 1. Bối Cảnh & Vấn Đề Cốt Lõi

Khi vận hành một nền tảng tuyển dụng công nghệ dành cho sinh viên IT và doanh nghiệp:
1. **Phía Ứng viên (Sinh viên / Junior):**
   - Vấn đề lớn nhất là **"Khoảng trống tín nhiệm" (Trust Deficit)**. CV của sinh viên thường bị đánh đồng là thiếu kinh nghiệm, sao chép mẫu từ mạng hoặc nhồi nhét từ khóa.
   - Khi nộp hồ sơ, ứng viên thường bị rơi vào "hố đen tuyển dụng" (ghosting) — nộp xong không biết tình trạng hồ sơ, không biết mình thiếu kỹ năng gì, và không được chuẩn bị khi phỏng vấn.
2. **Phía Nhà tuyển dụng (Tech Recruiter / Hiring Manager):**
   - Vấn đề lớn nhất là **"Nhiễu thông tin" (Signal-to-Noise Ratio)**. Đọc hàng trăm CV nhưng không biết ai code được thật; tỷ lệ ứng viên không làm được bài test hoặc no-show khi phỏng vấn cao.
   - Đăng tin tuyển dụng trên các kênh trôi nổi khó tiếp cận được đúng sinh viên có tech stack phù hợp.

---

## 2. Các Quyết Định Kiến Trúc & Đánh Giá Lựa Chọn (Decisions & Trade-offs)

### Quyết định 1: Kiến trúc Hồ Sơ Dựa Trên Bằng Chứng (Evidence-Based Portfolio Architecture)
- **Lựa chọn:** Bắt buộc và ưu tiên hiển thị liên kết sản phẩm thực tế: `github_url`, `demo_url`, `figma_url`, và con dấu xác thực của giảng viên (`Verified Badge` kèm `verification_code` và SHA-256 Hash).
- **Lý do:** Giúp nhà tuyển dụng thẩm định năng lực code của ứng viên chỉ trong 10 giây xem demo hoặc repository, giải quyết triệt để vấn đề CV ảo.
- **Phương án thay thế đã loại bỏ:** Thu thập bài test trắc nghiệm lý thuyết trực tuyến (gây mệt mỏi, sinh viên dễ tra cứu đáp án AI, không phản ánh năng lực làm dự án thực tế).

### Quyết định 2: Tự Động Đo Ni Đóng Giày CV Theo JD (Tailored CV Generation)
- **Lựa chọn:** Sinh bản CV phái sinh gắn liền với từng JD cụ thể (`GenerateCvFromJdModal.tsx`), giữ nguyên Master Profile làm nguồn dữ liệu chuẩn. Tự động bóc tách kỹ năng cốt lõi của JD, xếp hạng đồ án có độ tương đồng công nghệ cao nhất lên đầu, tạo bullet chuẩn STAR có chỉ số định lượng.
- **Lý do:** Tăng tỷ lệ vượt qua vòng lọc ATS từ < 10% lên > 65% mà không làm sai lệch sự thật.
- **Phương án thay thế đã loại bỏ:** Cho phép AI tự bịa thêm kinh nghiệm để khớp JD (vi phạm nghiêm trọng nguyên tắc trung thực của ProfileHub).

### Quyết định 3: Kênh Thông Báo Trình Duyệt Real-time Đa Tab (BroadcastChannel & Notification API)
- **Lựa chọn:** Kết hợp `BroadcastChannel('profilehub_pipeline_broadcast')` với `window.localStorage` event fallback và Web Notification API native của trình duyệt.
- **Lý do:** Đảm bảo khi Nhà tuyển dụng xếp lịch phỏng vấn ở tab này, tab của Ứng viên lập tức nhận thông báo đẩy trên hệ điều hành ngay cả khi đang minimize cửa sổ trình duyệt, xóa bỏ hoàn toàn tình trạng trễ hẹn phỏng vấn.
- **Phương án thay thế đã loại bỏ:** Phụ thuộc vào email bên thứ ba (SendGrid/Resend) trong môi trường thử nghiệm cục bộ, vừa chậm vừa dễ rơi vào hòm thư rác (Spam).

### Quyết định 4: Đồng Bộ Hóa Lời Mời Phỏng Vấn Với Phòng Luyện Phỏng Vấn (Interview War Room)
- **Lựa chọn:** Khi một lượt phỏng vấn được xác lập trong `CandidatePipeline.tsx`, hệ thống tự động đồng bộ sang `selfInterviewService` của sinh viên, tải trước bộ câu hỏi phỏng vấn thực chiến xoay quanh Tech Stack và Đồ án của JD đó.
- **Lý do:** Giúp ứng viên chuyển từ thế bị động sang chủ động luyện tập chiến thuật kiến trúc và xử lý khủng hoảng live crash trước giờ phỏng vấn.
