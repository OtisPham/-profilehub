# Hướng Dẫn Nghiệm Thu Nhanh: Multi-Theme PDF Styler (Quickstart & Acceptance Scenarios)

> **Mã tài liệu:** `QUICKSTART-20261105-MULTI-THEME-PDF-STYLER`  
> **Tính năng:** Multi-Theme PDF Styler, Live A4 Print Sheet Preview & Professional Resume Export Studio  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Kịch Bản Nghiệm Thu Tự Động (Automated Test Scenarios)

Chạy bộ kiểm thử đơn vị:
```bash
npx vitest run src/services/pdfStylerService.test.ts
```

### Các kịch bản kiểm thử bắt buộc (100% Pass):
1. **Lấy cấu hình mặc định an toàn:** Khi `localStorage` chưa có dữ liệu, trả về `templateId: 'classic'`, `primaryColor: '#1e3a8a'`, `density: 'normal'`.
2. **Lưu và phục hồi cấu hình:** Ghi tùy chọn vào `localStorage` và đọc lại chuẩn xác.
3. **Tính toán ngân sách trang (Single Page):** Chiều cao nội dung $\le 1122\text{px}$ trả về `isSinglePage: true` và `badgeColor: 'emerald'`.
4. **Cảnh báo chớm tràn trang (Warning Overfill):** Chiều cao $1123\text{px} - 1290\text{px}$ trả về `isWarning: true` kèm thông báo gợi ý chuyển sang chế độ Compact.
5. **Định dạng lớp CSS theo mật độ:** Mật độ `compact` trả về cỡ chữ và khoảng cách dòng thu hẹp chính xác.
6. **Công tắc ẩn avatar:** Chuyển đổi trạng thái `hideAvatar` cập nhật biến cấu hình chính xác.
7. **Công tắc mã QR:** Chuyển đổi trạng thái `showQrCode` hoạt động đúng.

---

## 2. Kịch Bản Nghiệm Thu Trải Nghiệm Người Dùng (Manual Acceptance Journey)

### Bước 1: Mở Trạm Xuất Bản In Ấn
- Truy cập vào trang tạo CV: `http://localhost:5173/cv-builder`.
- Nhấp vào nút **`[ Xuất PDF ]`** màu xanh dương trên thanh Header.
- **Kỳ vọng:** Modal `PdfExportStylerModal` mở ra mượt mà, hiển thị 2 cột: Cột trái là bảng điều khiển phong cách và cột phải là tờ giấy in A4 xem trước 1:1.

### Bước 2: Thử Nghiệm Đổi Mẫu Template & Màu Sắc
- Nhấp chọn mẫu **"Minimalist Harvard"** $\to$ Tờ A4 đổi sang phong cách 1 cột chữ Serif Ivy League ngay lập tức.
- Nhấp chọn mẫu **"Tech Developer Terminal"** $\to$ Tờ A4 đổi sang phong cách IT Bento Cards.
- Nhấp chọn chip màu **Xanh Emerald** $\to$ Màu tiêu đề và viền trên tờ A4 chuyển sang xanh lục bảo.

### Bước 3: Thử Nghiệm Bộ Công Tắc In Ấn Chuyên Nghiệp
- Bật công tắc **"In Mã QR Bằng Chứng Số"** $\to$ Mã QR xuất hiện ở góc trên CV.
- Bật công tắc **"Ẩn Ảnh Thẻ Đại Diện"** $\to$ Ảnh đại diện biến mất, căn lề tự động co giãn đẹp mắt.
- Chuyển mật độ sang **"Gọn gàng (Compact)"** $\to$ Các khoảng cách dòng co lại, thanh Page Budget báo xanh lá cây.

### Bước 4: Kích Hoạt In File PDF
- Bấm **`[ 🖨️ In / Tải PDF Chuẩn Kích Thước A4 ]`**.
- Hộp thoại in của trình duyệt mở ra sạch sẽ (chỉ hiển thị nội dung trang A4, không dính modal hay thanh công cụ).
- Lưu file PDF và kiểm tra: File PDF có thể bôi đen chữ, dung lượng nhẹ dưới 500KB.
