# Hướng Dẫn Nghiệm Thu Nhanh: Smart CV Parser & Profile Auto-Populate (Quickstart)
> **Mã tài liệu:** `QUICKSTART-20261105-SMART-CV-PARSER-PROFILE-AUTO-POPULATE`  
> **Tính năng:** Smart CV Parser, Structured Evidence Extraction & Master Profile Auto-Population  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Môi Trường & Điều Kiện Tiên Quyết
* Node.js $\ge 18.0.0$, npm $\ge 9.0.0$.
* Nhánh Git: `profilehub_v1`.

---

## 2. Kịch Bản Nghiệm Thu 1: Kiểm Thử Đơn Vị Tự Động (Unit Testing)

Chạy lệnh kiểm thử tự động:
```powershell
npx vitest run src/services/cvParserService.test.ts
```

### Các tiêu chuẩn kiểm thử bắt buộc (Pass 100%):
1. **Bóc tách thông tin cá nhân & liên hệ:**
   - Nhận diện đúng họ tên tiếng Việt có dấu và không dấu (ví dụ: `Nguyễn Văn A`, `Trần Thị Bích`).
   - Nhận diện chính xác Email và Số điện thoại hợp lệ.
2. **Bóc tách học vấn & GPA:**
   - Nhận diện các trường đại học lớn (Đại học Bách Khoa, KHTN, CNTT, FPT...).
   - Nhận diện điểm GPA theo thang 4.0 (`3.6/4.0`) và thang 10 (`8.5/10`).
3. **Bóc tách kỹ năng chuẩn hóa:**
   - Trích xuất đúng các kỹ năng lập trình và công nghệ IT (`React`, `Node.js`, `TypeScript`, `Docker`, `SQL`...).
4. **Bóc tách đồ án thực tế:**
   - Tách đúng tên dự án, vai trò, mô tả và bóc tách được link GitHub (`github.com/...`) cùng link Demo (`vercel.app`, `netlify.app`).
5. **Hợp nhất dữ liệu (Merge & Overwrite):**
   - Chế độ `merge` không xóa đè thông tin cũ, chỉ điền vào các trường trống.
   - Chế độ `overwrite` cập nhật mới toàn bộ.

---

## 3. Kịch Bản Nghiệm Thu 2: Trải Nghiệm Giao Diện Người Dùng (`MyProfile.tsx`)

1. Đăng nhập tài khoản Sinh viên (`test@student.com`) và truy cập trang Hồ sơ cá nhân `/my-profile`.
2. Quan sát thấy nút bấm nổi bật màu tím gradient: **`[ 📄 Tải CV Lên Tự Động Điền Hồ Sơ ]`**.
3. Nhấp vào nút:
   - Mở modal **`ImportCvToProfileModal`**.
   - Chọn tab **"Dán nội dung văn bản CV (Raw Paste)"** và dán đoạn văn bản mẫu có chứa: Họ tên, Trường, Ngành, GPA, Kỹ năng, Đồ án kèm link GitHub/Demo.
   - Bấm **`[ ⚡ Bắt Đầu Quét CV ]`**.
4. Màn hình Review:
   - Các trường Họ tên, Trường Bách Khoa, GPA, Kỹ năng được điền tự động vào bảng đối soát.
   - Nhìn thấy danh sách các đồ án được bóc tách rõ ràng.
   - Bấm **`[ ✨ Cập Nhật Vào Hồ Sơ Cá Nhân ]`**.
5. Quan sát trang `MyProfile.tsx`:
   - Biểu mẫu thông tin cá nhân lập tức được cập nhật đầy đủ thông tin.
   - Chuyển sang trang **`MyProjects.tsx`**: Thấy các đồ án vừa bóc tách đã xuất hiện và tự động có huy hiệu **`🚀 Demo Ready`**!

---

## 4. Lệnh Kiểm Tra Cổng Chất Lượng (Quality Gates)

```powershell
# 1. Chạy toàn bộ test suites
npm test -- --run

# 2. Kiểm tra TypeScript Strict
npx tsc --noEmit

# 3. Đóng gói Production
npm run build
```
* Tiêu chuẩn nghiệm thu: **100% Tests Pass**, **0 Lỗi TypeScript**, **Build Success**.
