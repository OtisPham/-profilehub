# Nghiên Cứu Kỹ Thuật: Bộ Chọn Theme & Tuỳ Biến Xuất PDF Chuyên Nghiệp (Technical Research)

> **Mã tài liệu:** `RESEARCH-20261105-MULTI-THEME-PDF-STYLER`  
> **Tính năng:** Multi-Theme PDF Styler, Live A4 Print Sheet Preview & Professional Resume Export Studio  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Đánh Giá Hiện Trạng Kiến Trúc & Điểm Nghẽn

### 1.1. Luồng Xuất PDF Hiện Tại
- Nút `[ Xuất PDF ]` trong `src/pages/student/CVBuilder.tsx` hiện thực thi như sau:
  ```typescript
  const handlePrint = () => {
    const previousMode = isEditorMode;
    setIsEditorMode(false);
    setTimeout(() => {
      window.print();
      setIsEditorMode(previousMode);
    }, 150);
  };
  ```
- **Hạn chế:**
  - Bấm vào là lập tức bật dialog `window.print()` của trình duyệt. Người dùng không có bước chuyển giao (transition) để ngắm nhìn bố cục A4 hoàn chỉnh.
  - Người dùng không có cách nào bật/tắt nhanh mã QR, ẩn avatar cho thị trường quốc tế, hoặc đổi mật độ giãn dòng (Density) để chống tràn trang A4.

### 1.2. Nguồn Lực Đã Có Trong Hệ Thống
- Đã có sẵn 6 mẫu CV trong [`CVTemplates.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/components/cv/CVTemplates.tsx):
  1. `classic`: Modern Top-Banner
  2. `minimal`: Minimalist Harvard
  3. `tech`: Tech Developer Terminal
  4. `executive`: Timeline Milestone
  5. `pro_split`: Left Solid Sidebar
  6. `compact_ats`: Compact 1-Page ATS
- Đã có sẵn 5 bảng màu chuẩn trong `COLOR_PALETTES`.
- Đã có sẵn 5 bộ phông trong `FONT_OPTIONS`.

---

## 2. Các Quyết Định Kiến Trúc Cốt Lõi (Architectural Decisions)

### Quyết định 1: Xây Dựng `PdfExportStylerModal.tsx` Với Cơ Chế Split-Pane
- **Cột Trái (Thanh điều khiển phong cách - 380px):**
  - Danh sách 6 card template có hình thumbnail wireframe mô phỏng.
  - Bộ 6 chip màu sắc hiện đại.
  - Bộ 4 phông chữ chuyên nghiệp.
  - Bộ 4 công tắc in ấn chuyên nghiệp (In mã QR, Ẩn ảnh thẻ, Hiện huy hiệu bảo chứng, Mật độ dòng).
- **Cột Phải (Tờ giấy in A4 Live Preview):**
  - Tỷ lệ chuẩn $210\text{mm} \times 297\text{mm}$ với nền trắng, viền sắc nét, bóng đổ nhẹ trên nền xám trung tính `#0f172a`.
  - Zoom & Pan linh hoạt phù hợp với mọi kích thước màn hình laptop/desktop.
  - Thanh cảnh báo ngân sách trang A4 thời gian thực.

### Quyết định 2: Tối Ưu Hóa `@media print` Bản Địa Trình Duyệt Thay Vì Thư Viện Nặng
- Không dùng `html2canvas` hay `jspdf` vì:
  1. Làm tăng bundle size thêm > 1MB.
  2. Biến chữ thành ảnh raster (pixelated), mất khả năng bôi đen text, khiến các hệ thống ATS của nhà tuyển dụng không đọc được (0 điểm ATS).
  3. Màu sắc in ấn dễ bị lệch gam màu.
- Dùng giải pháp CSS `@media print`:
  ```css
  @media print {
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    body * {
      visibility: hidden;
    }
    #cv-print-area, #cv-print-area * {
      visibility: visible;
    }
    #cv-print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100% !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
  ```
- **Lợi ích:** Tốc độ xuất bản 0ms, text vector 100% siêu nét, file PDF dưới 300KB, thân thiện tuyệt đối với mọi phần mềm ATS.

### Quyết định 3: Bộ Tùy Biến In Ấn Độc Lập Không Làm Hỏng State Soạn Thảo
- Các tùy biến in ấn (như ẩn avatar, đổi template tạm thời, chọn mật độ compact) chỉ áp dụng trong phạm vi phiên in (Export Session State).
- Cung cấp nút `[ 💾 Lưu Phong Cách Này Làm Mặc Định ]` nếu người dùng muốn lưu cố định vào hồ sơ.
