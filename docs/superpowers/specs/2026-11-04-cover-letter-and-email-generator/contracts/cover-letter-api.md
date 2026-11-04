# Interface Contract: Cover Letter & Email Generator Service

> **Module:** `profilehub/src/services/coverLetterService.ts`  

---

## 1. Service Seam Methods

### `generateCoverLetterDraft(input: GenerateCoverLetterInput): CoverLetterDraft`
* **Mục đích:** Sinh ra trọn bộ Cover Letter (A4 Markdown) và Outbound HR Email Template tương ứng theo thông tin vị trí và ứng viên.
* **Đầu vào:** `GenerateCoverLetterInput` (tên công ty, vị trí, tone, dự án).
* **Đầu ra:** `CoverLetterDraft` chứa đầy đủ 4 đoạn thư, email body, và metadata dự án.

### `getSavedCoverLetter(applicationId: string): CoverLetterDraft | null`
* **Mục đích:** Lấy bản nháp thư ứng tuyển đã lưu trong `localStorage` theo đơn nộp.

### `saveCoverLetter(draft: CoverLetterDraft): void`
* **Mục đích:** Lưu trữ bản nháp thư ứng tuyển vào `localStorage` theo `applicationId` và `draft.id`.

### `exportCoverLetterAsMarkdown(draft: CoverLetterDraft): string`
* **Mục đích:** Xuất nội dung bức thư thành chuỗi Markdown hoàn chỉnh có tiêu đề, ngày tháng, thông tin người gửi/nhận và chữ ký chuẩn.

---

## 2. Component Contract: `CoverLetterModal.tsx`

* **Props:**
  ```typescript
  export interface CoverLetterModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationId?: string;
    companyName: string;
    roleTitle: string;
    linkedCvId?: string;
  }
  ```
* **Tabs:**
  1. `Tab 1: Thư Ứng Tuyển A4 (Cover Letter)` — Hiển thị bản xem trước sang trọng, hỗ trợ chỉnh sửa trực tiếp từng đoạn, đổi 3 Tone (Chuyên nghiệp / Startup / Kỹ thuật) và nút Tải Markdown / Copy.
  2. `Tab 2: Mẫu Email Gửi Kèm CV` — Hiển thị Tiêu đề email (Subject), Nội dung thư ngắn gọn kèm checklist file đính kèm và nút Copy 1-click để dán thẳng vào Gmail/Outlook.
  3. `Tab 3: Đối Chiếu Dự Án Nổi Bật` — Hiển thị các dự án đã được AI trích xuất đưa vào thư.
