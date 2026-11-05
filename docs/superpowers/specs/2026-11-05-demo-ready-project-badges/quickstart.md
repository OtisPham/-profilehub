# Hướng Dẫn Nghiệm Thu Nhanh: Smart Project Badges (Quickstart)
> **Mã tài liệu:** `QUICKSTART-20261105-DEMO-READY-BADGES`  
> **Tính năng:** Smart Project Badges: "Demo Ready" vs "Verified Codebase"  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Môi Trường & Điều Kiện Tiên Quyết
* Node.js $\ge 18.0.0$, npm $\ge 9.0.0$.
* Nhánh hiện tại: `profilehub_v1`.

---

## 2. Kịch Bản Nghiệm Thu 1: Kiểm Thử Đơn Vị Tự Động (Unit Testing)

Chạy lệnh kiểm thử tự động:
```powershell
npx vitest run src/services/projectBadgeService.test.ts
```

### Các tiêu chuẩn kiểm thử bắt buộc (Pass 100%):
1. **Xác định đúng biến thể huy hiệu (`getProjectBadgeVariant`):**
   - Đồ án có `demo_url: 'https://demo.app'` và `is_verified: true` $\to$ Trả về `'full'`.
   - Đồ án có `demo_url: 'https://demo.app'` và `is_verified: false` $\to$ Trả về `'demo-ready'`.
   - Đồ án không có `demo_url` nhưng `is_verified: true` $\to$ Trả về `'verified'`.
   - Đồ án không có cả 2 $\to$ Trả về `'none'`.
2. **Thống kê chính xác số lượng đồ án của ứng viên (`countCandidateProjectBadges`):**
   - Đếm đúng số lượng đồ án `demoReadyCount`, `verifiedCount`, `fullCount`.

---

## 3. Kịch Bản Nghiệm Thu 2: Giao Diện Quản Lý Đồ Án Sinh Viên (`MyProjects.tsx`)

1. Đăng nhập tài khoản Sinh viên và truy cập trang `/projects`.
2. Quan sát thẻ đồ án:
   - Các đồ án có link Demo chạy thật hiển thị huy hiệu nổi bật **`🚀 Demo Ready`** (hoặc **`✨ Demo Ready & Verified`**).
   - Rê chuột vào huy hiệu: Hiển thị tooltip rõ ràng.
   - Nhấp chuột trực tiếp vào huy hiệu: Tự động mở tab mới tới đúng đường link Live Demo.

---

## 4. Kịch Bản Nghiệm Thu 3: Giao Diện Tìm Kiếm Ứng Viên (`CandidateSearch.tsx`)

1. Đăng nhập tài khoản Nhà tuyển dụng và truy cập trang `/recruiter/search`.
2. Quan sát thẻ ứng viên:
   - Hiển thị rõ số lượng đồ án: `🚀 X Demo Ready • 🛡️ Y Verified`.
3. Bấm nút bộ lọc nhanh:
   - Lọc theo **`[ 🚀 Chỉ xem ứng viên có đồ án Demo Ready ]`** $\to$ Chỉ hiển thị những ứng viên có sản phẩm chạy thật để nhà tuyển dụng vào bấm trải nghiệm ngay.

---

## 5. Lệnh Kiểm Tra Cổng Chất Lượng (Quality Gates)

```powershell
# 1. Chạy toàn bộ test suites
npm test -- --run

# 2. Kiểm tra TypeScript Strict
npx tsc --noEmit

# 3. Đóng gói Production
npm run build
```
* Tiêu chuẩn nghiệm thu: **100% Tests Pass**, **0 Lỗi TypeScript**, **Build Success**.
