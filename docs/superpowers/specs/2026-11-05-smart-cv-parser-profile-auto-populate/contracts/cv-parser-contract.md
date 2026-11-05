# Giao Ước Kỹ Thuật: Smart CV Parser & Profile Auto-Populate Contract
> **Mã tài liệu:** `CONTRACT-20261105-SMART-CV-PARSER-PROFILE-AUTO-POPULATE`  
> **Tính năng:** Smart CV Parser, Structured Evidence Extraction & Master Profile Auto-Population  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Giao Ước Dịch Vụ Cốt Lõi (`cvParserService.ts`)

Vị trí: [`src/services/cvParserService.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/cvParserService.ts)

### 1.1. Bóc Tách Văn Bản CV Thô (`parseCvText`)
```typescript
export function parseCvText(text: string): ParsedCvData;
```
* **Đầu vào:** Chuỗi văn bản thô bóc tách từ file CV hoặc dán trực tiếp (`text`).
* **Đầu ra:** Cấu trúc `ParsedCvData`:
  - `personalInfo`: `{ fullName, email, phone, location, targetRole, bio }`
  - `education`: `{ university, major, gpa, graduationYear }`
  - `skills`: Mảng danh sách kỹ năng chuẩn hóa (`['React', 'TypeScript', 'Node.js', ...]`)
  - `projects`: Mảng đồ án `{ title, role, description, tags, github_url, demo_url }`
  - `certificates`: Mảng chứng chỉ `{ title, issuer, year }`
  - `confidenceScore`: Điểm tin cậy (0 - 100%)

### 1.2. Đọc & Bóc Tách Từ File Tải Lên (`parseCvFile`)
```typescript
export function parseCvFile(file: File): Promise<ParsedCvData>;
```
* **Định dạng hỗ trợ:** `.txt`, `.pdf`, `.docx`, `.json`.
* **Cơ chế xử lý:** Sử dụng `FileReader` đọc text UTF-8 an toàn tại trình duyệt.

### 1.3. Tự Động Điền Vào Cơ Sở Dữ Liệu Hồ Sơ (`populateProfileWithParsedData`)
```typescript
export function populateProfileWithParsedData(
  parsedData: ParsedCvData,
  options: ProfileAutoPopulateOptions,
  userId?: string
): Promise<ProfilePopulateResult>;
```
* **Nhiệm vụ:**
  1. Cập nhật bảng `student_profiles` (hoặc LocalStorage profile) với thông tin học vấn & liên hệ.
  2. Tạo mới các bản ghi trong bảng `projects` nếu `options.includeProjects === true`.
  3. Tạo mới các bản ghi trong bảng `certificates` nếu `options.includeCertificates === true`.
  4. Phát sự kiện `storage` và gọi callback để giao diện `MyProfile.tsx` cập nhật tức thì 0ms.

---

## 2. Giao Ước Thành Phần Giao Diện (`ImportCvToProfileModal.tsx`)

Vị trí: [`src/components/student/ImportCvToProfileModal.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/components/student/ImportCvToProfileModal.tsx)

```typescript
export interface ImportCvToProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}
```

### 2.1. Các Bước Trải Nghiệm (Workflow Steps)
1. **Bước 1: Tiếp nhận tệp (Ingestion):**
   - Vùng kéo thả file (Drag & Drop zone) hoặc nút chọn file từ máy tính.
   - Tab chuyển đổi: **"Dán nội dung văn bản CV (Raw Paste)"** dành cho ứng viên muốn dán nhanh từ Notion/Google Docs.
   - Nút `[ ⚡ Bắt Đầu Quét CV ]`.
2. **Bước 2: Xem trước & Tinh chỉnh (Review & Confirmation):**
   - Hiển thị bảng đối soát trực quan:
     * Card Thông tin cá nhân & Học vấn (cho phép chỉnh sửa trực tiếp các ô input).
     * Card Kỹ năng (hiển thị dạng tag có thể xóa bớt hoặc thêm mới).
     * Card Đồ án được bóc tách (hiển thị rõ tên đồ án, vai trò và link demo/github).
     * Card Chứng chỉ.
   - Khối tùy chọn:
     * `🔘 Chế độ bổ sung (Merge):` Chỉ điền vào các ô đang trống, giữ nguyên thông tin cũ.
     * `🔘 Chế độ ghi đè (Overwrite):` Thay thế toàn bộ bằng thông tin CV mới.
     * Checkbox `[x] Tự động tạo đồ án vào Kho Đồ Án (MyProjects)`.
     * Checkbox `[x] Tự động tạo chứng chỉ vào Kho Chứng Chỉ`.
3. **Bước 3: Xác nhận & Hoàn tất:**
   - Nút `[ ✨ Cập Nhật Vào Hồ Sơ Cá Nhân ]`.
   - Hiệu ứng tải và thông báo hoàn thành rực rỡ, tự động đóng modal và tải lại dữ liệu trên trang `MyProfile.tsx`.
