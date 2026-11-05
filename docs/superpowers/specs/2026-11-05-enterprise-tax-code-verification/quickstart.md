# Hướng Dẫn Nghiệm Thu Nhanh (Quickstart & Validation Guide)
> **Mã tài liệu:** `QS-20261105-ENTERPRISE-TAX-VERIFICATION`  
> **Vị trí lưu:** [`docs/superpowers/specs/2026-11-05-enterprise-tax-code-verification/quickstart.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-05-enterprise-tax-code-verification/quickstart.md)

---

## 1. Điều Kiện Tiên Quyết (Prerequisites)
- Môi trường Node.js v18+ và kho lưu trữ nhánh `profilehub_v1`.
- Đã cài đặt dependencies: `npm install`.
- Máy chủ phát triển hoạt động: `npm run dev`.

---

## 2. Kịch Bản Kiểm Thử Tự Động (Automated Test Suites)

### Chạy Bộ Kiểm Thử Dịch Vụ Thuế
```bash
# Chạy riêng biệt bộ Unit Test cho Tax Verification Service
npm test -- src/services/taxVerificationService.test.ts --run

# Chạy toàn bộ test suite để đảm bảo không có bất kỳ regression nào
npm test -- --run
```

### Các Trường Hợp Kiểm Thử Trọng Tâm Cần Đạt (100% Pass):
1. **TC-TAX-01 (Format & Checksum):**
   - Nhập MST 10 số hợp lệ (ví dụ: `0305011749` của VNG) $\implies$ `isValid: true`, `taxType: '10_digit_parent'`.
   - Nhập MST 13 số chi nhánh hợp lệ (ví dụ: `0305011749-001`) $\implies$ `isValid: true`, `taxType: '13_digit_branch'`.
   - Nhập MST sai số kiểm tra (ví dụ: `0305011740`) $\implies$ `isValid: false`, trả về lỗi sai check digit.
   - Nhập chuỗi rác (`ABC1234567`) $\implies$ `isValid: false`, báo lỗi định dạng số.
2. **TC-TAX-02 (Anti-Spoofing & Name Matching):**
   - Nhập MST VNG với tên công ty `VNG Corporation` $\implies$ `isMatchWithCompany: true`, `matchScore >= 80%`.
   - Nhập MST VNG với tên công ty `Công Ty TNHH Lừa Đảo ABC` $\implies$ `isMatchWithCompany: false`, `matchScore < 30%`, từ chối cấp Tích Xanh.
3. **TC-TAX-03 (Reset Tích Xanh Khi Đổi Tên):**
   - Đang ở trạng thái `verified`, người dùng đổi `companyName` sang tên mới mà chưa xác thực lại $\implies$ Tự động chuyển thành `reverification_required`, ẩn Tích Xanh.
4. **TC-TAX-04 (Offline Sandbox Fallback):**
   - Khi ngắt kết nối mạng hoặc VietQR API timeout, dịch vụ tự động tra cứu trong Sandbox Registry không làm crash ứng dụng.

---

## 3. Kịch Bản Nghiệm Thu Bằng Tay Trên Giao Diện (Manual UI Verification)

### Kịch Bản 1: Nhà tuyển dụng xác thực MST và nhận Tích Xanh
1. Đăng nhập với tài khoản Nhà tuyển dụng (`/recruiter/profile`).
2. Tại mục **Thông Tin Doanh Nghiệp**, nhập MST: `0305011749` và Tên công ty: `VNG Corporation`.
3. Nhấp nút **[ 🛡️ Xác Thực Mã Số Thuế ]**.
4. **Kết quả mong đợi:**
   - Nút hiển thị trạng thái đang kiểm tra trong $\approx 300\text{ms}$.
   - Xuất hiện thông báo: *"Xác thực doanh nghiệp thành công!"*.
   - Huy hiệu `🛡️ Doanh Nghiệp Đã Xác Thực (Verified Enterprise)` màu xanh lá hiển thị ngay dưới tên công ty.
   - Hiển thị tên pháp nhân: `CÔNG TY CỔ PHẦN VNG` và địa chỉ đăng ký kinh doanh.

### Kịch Bản 2: Sinh viên xem tin tuyển dụng và lọc công ty Tích Xanh
1. Đăng nhập với tài khoản Sinh viên và truy cập `/student/jobs`.
2. Quan sát các Job của công ty vừa được xác thực:
   - Thẻ việc làm xuất hiện huy hiệu `🛡️ Tích Xanh` bên cạnh tên công ty.
3. Nhấp vào nút bộ lọc nhanh: **`[ 🛡️ Chỉ xem công ty có Tích Xanh ]`**.
4. **Kết quả mong đợi:**
   - Danh sách chỉ hiển thị các việc làm từ doanh nghiệp đã được xác thực MST.
5. Nhấp vào nút **"Xem chi tiết công ty"**:
   - Modal hiển thị khối **"Thông Tin Pháp Lý Đã Xác Minh"** với mã số thuế và tên pháp nhân ĐKKD rõ ràng.
