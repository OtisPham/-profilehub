# Quickstart & Verification Guide: Public Verification Gateway

Tài liệu hướng dẫn kiểm chứng nhanh quy trình hoạt động của Cổng tra cứu bảo chứng đồ án.

## 1. Điều kiện tiên quyết (Prerequisites)
- Node.js v18+ & npm
- Dự án `profilehub` đã cài đặt đầy đủ dependencies

## 2. Các bước chạy kiểm chứng tự động (Automated Verification)

```bash
# 1. Kiểm tra tính toàn vẹn của kiểu dữ liệu TypeScript
npm run build

# 2. Chạy bộ kiểm thử tự động cho Cổng bảo chứng
npx vitest run src/services/verificationService.test.ts

# 3. Chạy toàn bộ 34 test suite đảm bảo không hồi quy
npm run test
```

## 3. Kịch bản kiểm thử hành vi thực tế (Manual E2E Walkthrough)

### Kịch bản 1: Tra cứu đồ án bảo chứng hợp lệ
1. Chạy môi trường phát triển: `npm run dev`.
2. Mở trình duyệt ở chế độ Ẩn danh (Incognito Mode - Không đăng nhập).
3. Truy cập đường dẫn: `http://localhost:5173/verify/PH-VER-A8B9C2` (hoặc mã mẫu).
4. **Kỳ vọng:**
   - Trang hiển thị Giấy chứng nhận bảo chứng đồ án số ProfileHub.
   - Thấy tên sinh viên, tên trường đại học, học vị giảng viên bảo chứng.
   - Thấy mã băm SHA-256 dài 64 ký tự và nút sao chép.
   - **Xác nhận bảo mật:** Kiểm tra mã nguồn HTML/DOM tuyệt đối không xuất hiện điểm GPA, SĐT, hay Email cá nhân của sinh viên.

### Kịch bản 2: Tra cứu mã không tồn tại (Edge Case)
1. Truy cập đường dẫn: `http://localhost:5173/verify/PH-VER-INVALID999`.
2. **Kỳ vọng:**
   - Trang hiển thị thông báo trạng thái: *"Mã bảo chứng không tồn tại hoặc chưa được kích hoạt"*.
   - Có nút bấm *"Về trang chủ ProfileHub"* quay lại `/`.
   - Không bị màn hình trắng (White Screen of Death) hoặc lỗi console.

### Kịch bản 3: Quét mã QR từ kho đồ án sinh viên
1. Đăng nhập tài khoản Sinh viên $\to$ vào trang **Kho Đồ Án** (`/my-projects`).
2. Tìm đồ án đã có huy hiệu **Verified 🛡️** $\to$ bấm biểu tượng **Mã QR**.
3. **Kỳ vọng:**
   - URL hiển thị trong modal và trong ảnh mã QR có định dạng `.../verify/<mã_xác_thực>`.
   - Bấm nút **"Tải Mã QR (.png)"** xuất file ảnh sắc nét thành công.
