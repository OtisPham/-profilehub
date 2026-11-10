# Hướng Dẫn Kiểm Thử Nhanh: Cổng Lan Tỏa Hồ Sơ & Mời Phỏng Vấn Trực Tiếp
> **Mã đặc tả:** `SPEC-20261109-VIRAL-GATEWAY`  

---

## 1. Kịch Bản Kiểm Thử Nhà Tuyển Dụng Mời Phỏng Vấn Từ Link Tra Cứu

1. Truy cập trang tra cứu đồ án công khai: `/verify/PH-VER-2026-001` (hoặc mã đồ án bất kỳ trong hệ thống).
2. Kiểm tra giao diện hiển thị 2 nút hành động mới:
   - `[ 🏢 Mời Phỏng Vấn Trực Tiếp ]`
   - `[ 🔗 Lan Tỏa & Khoe Đồ Án ]`
3. Bấm vào nút `[ 🏢 Mời Phỏng Vấn Trực Tiếp ]`:
   - Modal mở ra, nhập tên công ty: `VNG Corporation`, vị trí: `Frontend React Fresher`, ngày hẹn: `2026-11-25`, giờ: `10:00 AM`, link Meet: `https://meet.google.com/abc-xyz`.
   - Bấm **Gửi Lời Mời**.
4. Mở tab tài khoản Sinh viên:
   - Chuông thông báo trên Header lập tức có chấm đỏ và hiển thị lời mời phỏng vấn mới từ VNG Corporation.
   - Trình duyệt phát thông báo đẩy (Web Notification).

---

## 2. Kịch Bản Sinh Viên Khoe Đồ Án Lên Mạng Xã Hội

1. Trên trang `/verify/:code`, bấm `[ 🔗 Lan Tỏa & Khoe Đồ Án ]`.
2. Kiểm tra tab **GitHub Badge**:
   - Bấm **Sao chép mã Markdown**: Đoạn mã copy có định dạng `[![ProfileHub Verified]...]`.
3. Kiểm tra nút **Chia sẻ lên LinkedIn**:
   - Bấm nút: Mở cửa sổ chia sẻ của LinkedIn với URL chứng chỉ và thông điệp tự hào về đồ án đã được bảo chứng.
