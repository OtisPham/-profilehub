# Kế Hoạch Triển Khai: Bộ Chọn Theme & Tuỳ Biến Xuất PDF Chuyên Nghiệp (Multi-Theme PDF Styler & Professional Resume Export Studio)

> **Mã kế hoạch:** `PLAN-20261105-MULTI-THEME-PDF-STYLER`  
> **Áp dụng chuẩn:** [ROLES_AND_GOVERNANCE_RULES.md](file:///C:/Users/ADMIN/Desktop/STUDY/docs/architecture/ROLES_AND_GOVERNANCE_RULES.md) (Chuỗi Baton T1 - T2 - T3)  
> **Tài liệu tham chiếu:**  
> - Đặc tả chức năng: [`docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/spec.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/spec.md)  
> - Báo cáo nghiên cứu kỹ thuật: [`docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/research.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/research.md)  
> - Mô hình dữ liệu & Density Rules: [`docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/data-model.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/data-model.md)  
> - Giao ước kỹ thuật Service & Modal: [`docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/contracts/pdf-styler-contract.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/contracts/pdf-styler-contract.md)  
> - Hướng dẫn nghiệm thu nhanh: [`docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/quickstart.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-05-multi-theme-pdf-styler/quickstart.md)  
> **Nhánh Git:** `profilehub_v1`  
> **Mục tiêu:** Xây dựng Trạm Xuất Bản CV Chuyên Nghiệp (`PdfExportStylerModal.tsx`) cho phép ứng viên xem trước trang in A4 thực tế tỷ lệ 1:1, tùy biến nhanh 6 mẫu CV thẻ ảnh trực quan, chọn màu sắc & phông chữ chuẩn IT, bật/tắt các công tắc in ấn thông minh (Smart QR Code, Ẩn Avatar Blind Hiring, Mật độ Compact ép 1 trang) trước khi xuất file PDF.

---

## 🎯 Mục Tiêu Kỹ Thuật Trọng Tâm (Core Engineering Goals)

1. **Tầng Dịch Vụ & Kiểu Dữ Liệu (`pdfStylerService.ts` & `pdfStyler.types.ts`):**
   - Định nghĩa các kiểu `PdfStylerOptions`, `PrintDensity`, `PageBudgetMetric`, `VisualTemplateItem`.
   - Tính toán ngân sách trang A4 dựa trên chiều cao render pixel so với chuẩn $297\text{mm}$.
   - Tự động ghi nhớ và khôi phục tùy chọn in ấn yêu thích qua `localStorage`.
   - Trả về cấu hình styling (Base font size, line-height, section gap, padding) theo từng mật độ `compact`, `normal`, `relaxed`.
2. **Thành Phần Giao Diện Trạm Xuất Bản (`PdfExportStylerModal.tsx`):**
   - Thiết kế Split-Pane 2 cột: Cột trái điều khiển phong cách (380px), cột phải là tờ giấy in A4 Live Preview tỷ lệ 1:1.
   - Thẻ hiển thị 6 mẫu CV trực quan có nhãn đặc trưng (`TopCV Pro`, `Harvard Ivy League`, `Hacker Terminal`...).
   - Bộ 6 chip màu chủ đạo và 4 bộ phông chữ.
   - Bộ 4 công tắc in ấn chuyên nghiệp (Smart QR, Ẩn Avatar, Demo Ready badges, Mật độ co giãn dòng).
   - Thanh Page Budget cảnh báo màu xanh khi vừa vặn 1 trang A4, cảnh báo vàng khi chớm tràn dòng mồ côi.
3. **Tích Hợp Vào Trang Tạo CV ([`CVBuilder.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/student/CVBuilder.tsx)):**
   - Thay thế hành động gọi trực tiếp `window.print()` trên nút **`[ Xuất PDF ]`** bằng việc mở `PdfExportStylerModal`.
   - Đồng bộ ngược các tùy chọn template/màu sắc vào `CVBuilder` nếu người dùng chọn *"Lưu làm mặc định"*.
4. **Bảo Toàn Chất Lượng Tuyệt Đối (Quality Gates):**
   - Viết bộ kiểm thử đơn vị tự động 100% cho `pdfStylerService.test.ts`.
   - Đảm bảo toàn bộ 46 test suites vượt qua 100% (dự kiến $\ge 245$ tests).
   - Kiểm tra `npx tsc --noEmit` đạt 0 lỗi.
   - Đóng gói `npm run build` thành công.
   - Dual-Sync Git lên cả 2 nhánh `origin/profilehub_v1` và `origin/1310-co-ban-chua-sua`.

---

## 📋 Phân Rã Công Việc Kỹ Thuật (Baton Chain: T1 - T2 - T3)

### 🔹 Giai Đoạn T1: Nền Tảng Kiểu Dữ Liệu, Dịch Vụ Định Dạng & Kiểm Thử Đơn Vị
*Trách nhiệm: Backend & Core Logic Engineer*
* **T1.1:** Tạo file [`src/types/pdfStyler.types.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/types/pdfStyler.types.ts): Định nghĩa `PrintDensity`, `FontId`, `PdfStylerOptions`, `PageBudgetMetric`, `VisualTemplateItem`.
* **T1.2:** Xây dựng core helper [`src/services/pdfStylerService.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/pdfStylerService.ts):
  - `getStoredStylerPreferences(fallbackDefaults)`: Đọc và xác thực an toàn từ `localStorage`.
  - `saveStylerPreferences(options)`: Lưu cấu hình.
  - `calculatePageBudget(contentHeightPx, a4BaseHeightPx)`: Tính toán tỷ lệ phần trăm và trạng thái cảnh báo tràn trang.
  - `getDensityStyles(density)`: Cung cấp các thông số co giãn dòng và cỡ chữ.
* **T1.3:** Xây dựng bộ kiểm thử đơn vị tự động [`src/services/pdfStylerService.test.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/pdfStylerService.test.ts):
  - 8+ kịch bản kiểm thử: Đọc cấu hình mặc định, lưu cấu hình, tính toán ngân sách trang đơn, cảnh báo tràn trang, chuyển đổi mật độ compact/normal/relaxed, công tắc ẩn avatar, công tắc mã QR.

---

### 🔹 Giai Đoạn T2: Xây Dựng Giao Diện Studio & Tích Hợp CVBuilder
*Trách nhiệm: Frontend Engineer & UI/UX*
* **T2.1: Xây dựng Modal [`src/components/cv/PdfExportStylerModal.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/components/cv/PdfExportStylerModal.tsx):**
  - **Bố cục Split-Pane:** Phân vùng điều khiển bên trái và tờ A4 xem trước bên phải.
  - **Bộ chọn 6 Template thẻ ảnh:** Card trực quan có nhãn đặc trưng, bấm đổi ngay giao diện A4 bên phải.
  - **Bộ chọn Bảng Màu & Phông Chữ:** 6 chip màu và 4 phông chữ tiếng Việt chuẩn.
  - **Bộ 4 công tắc in ấn thông minh:** Bật/tắt QR code, ẩn/hiện avatar, hiện badge Demo Ready, mật độ dòng Compact/Normal/Relaxed.
  - **Thanh cảnh báo ngân sách trang A4:** Hiển thị trực tiếp tỷ lệ phần trăm chiều cao trang.
  - **Nút hành động in ấn:** `[ 🖨️ In / Tải PDF Chuẩn Kích Thước A4 ]` áp dụng CSS `@media print` sạch sẽ.
* **T2.2: Tích hợp vào trang Tạo CV [`src/pages/student/CVBuilder.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/student/CVBuilder.tsx):**
  - Gắn sự kiện mở `PdfExportStylerModal` khi nhấp nút **`[ Xuất PDF ]`** và phím tắt `Ctrl + P`.
  - Truyền đầy đủ dữ liệu hồ sơ `cvData`, `currentTemplate`, `currentColor` vào modal.
  - Cập nhật lại state của `CVBuilder` nếu người dùng chọn lưu phong cách làm mặc định.

---

### 🔹 Giai Đoạn T3: Kiểm Thử Toàn Diện, Nghiệm Thu & Dual-Sync Git
*Trách nhiệm: QA Tester & DevOps*
* **T3.1: Kiểm thử tự động:**
  - Chạy toàn bộ test suites: `npm test -- --run` $\to$ Đảm bảo toàn bộ 46 test suites vượt qua 100% (dự kiến $\ge 245$ tests).
  - Kiểm tra TypeScript nghiêm ngặt: `npx tsc --noEmit` $\to$ 0 lỗi.
  - Đóng gói ứng dụng: `npm run build` $\to$ Thành công.
* **T3.2: Kiểm thử trải nghiệm in thực tế:**
  - Mở modal $\to$ Đổi qua lại giữa các template $\to$ Đổi màu $\to$ Bật ẩn avatar và in QR code $\to$ Bấm in kiểm tra bản in không bị tràn lề.
* **T3.3: Bàn giao & Dual-Sync Git:**
  - Cập nhật artifact `session_log_2026-11-05.md`.
  - Tạo Git commit: `feat(cv): implement multi-theme pdf styler and professional resume export studio`.
  - Đẩy mã nguồn lên cả hai nhánh: `origin/profilehub_v1` và `origin/1310-co-ban-chua-sua`.
