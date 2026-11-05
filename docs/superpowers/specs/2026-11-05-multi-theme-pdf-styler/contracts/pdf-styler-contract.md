# Giao Ước Kỹ Thuật: Multi-Theme PDF Styler & Export Studio Contract

> **Mã tài liệu:** `CONTRACT-20261105-MULTI-THEME-PDF-STYLER`  
> **Tính năng:** Multi-Theme PDF Styler, Live A4 Print Sheet Preview & Professional Resume Export Studio  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Giao Ước Dịch Vụ Hỗ Trợ In Ấn (`pdfStylerService.ts`)

Vị trí: [`src/services/pdfStylerService.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/pdfStylerService.ts)

### 1.1. Lấy & Lưu Cấu Hình Phong Cách Người Dùng
```typescript
export function getStoredStylerPreferences(fallbackDefaults?: Partial<PdfStylerOptions>): PdfStylerOptions;
export function saveStylerPreferences(options: PdfStylerOptions): void;
```
* **Nhiệm vụ:** Đọc từ `localStorage` khóa `'profilehub_pdf_styler_prefs_v1'`. Nếu chưa có hoặc dữ liệu không hợp lệ, trả về cấu hình mặc định an toàn (`templateId: 'classic'`, `primaryColor: '#1e3a8a'`, `density: 'normal'`).

### 1.2. Tính Toán Ngân Sách Trang A4 Thời Gian Thực
```typescript
export function calculatePageBudget(contentHeightPx: number, a4BaseHeightPx?: number): PageBudgetMetric;
```
* **Đầu vào:** Chiều cao tính bằng pixel của vùng chứa CV preview (`contentHeightPx`).
* **Đầu ra:** Cấu trúc `PageBudgetMetric`:
  - `ratioPercent`: Phần trăm so với kích thước trang chuẩn A4 ($\approx 1122\text{px}$ tại 96 DPI).
  - `isSinglePage`: `true` nếu $\le 100\%$.
  - `isWarning`: `true` nếu $100\% < \text{ratio} \le 115\%$.
  - `statusMessage`: Chuỗi thông báo gợi ý người dùng (Ví dụ: *"🟢 Vừa khít 1 trang A4 hoàn hảo"* hoặc *"🟡 Chớm tràn 2 dòng, hãy chuyển sang chế độ Compact!"*).

### 1.3. Trả Về Lớp CSS Mật Độ Co Giãn Dòng
```typescript
export function getDensityStyles(density: PrintDensity): {
  fontSizeScale: string;
  lineHeight: string;
  sectionGap: string;
  pagePadding: string;
};
```

---

## 2. Giao Ước Thành Phần Giao Diện (`PdfExportStylerModal.tsx`)

Vị trí: [`src/components/cv/PdfExportStylerModal.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/components/cv/PdfExportStylerModal.tsx)

```typescript
export interface PdfExportStylerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVDataProps;
  currentTemplate: CVTemplateType;
  currentColor: string;
  currentFontId?: string;
  onApplyPreferencesToBuilder?: (options: PdfStylerOptions) => void;
}
```

### 2.1. Luồng Tương Tác Thành Phần (Component Workflow)
1. **Khởi tạo khi mở modal:**
   - Nạp cấu hình từ `localStorage` hoặc kế thừa từ `currentTemplate`, `currentColor` của `CVBuilder.tsx`.
   - Render tức thì tờ giấy in A4 ở cột phải với đầy đủ dữ liệu của ứng viên.
2. **Tương tác trên cột trái:**
   - Nhấp vào bất kỳ thẻ nào trong 6 Template Card $\to$ Tờ A4 đổi giao diện ngay lập tức (0ms).
   - Nhấp vào chip màu sắc $\to$ Tờ A4 cập nhật màu chủ đạo ngay lập tức.
   - Bật/tắt các công tắc in:
     * `In mã QR bằng chứng`: Hiện/ẩn component QR ở góc trên CV.
     * `Ẩn ảnh thẻ đại diện`: Ẩn avatar để tạo CV dạng Blind Hiring chuẩn quốc tế.
     * `Mật độ co giãn dòng`: Thu gọn hoặc giãn nở các khoảng cách thẻ.
3. **Thao tác in ấn:**
   - Nhấp `[ 🖨️ In / Tải PDF Chuẩn Kích Thước A4 ]`:
     * Kích hoạt CSS `@media print` sạch.
     * Gọi `window.print()` của trình duyệt.
     * Tự động đóng modal sau khi hoàn tất.
