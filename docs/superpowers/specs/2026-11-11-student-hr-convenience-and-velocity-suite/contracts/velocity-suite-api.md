# Hợp Đồng Giao Diện & API: Bộ Tiện Ích Siêu Tốc Độ Tuyển Dụng
> **Mã đặc tả:** `SPEC-20261111-VELOCITY-SUITE`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [`data-model.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-11-student-hr-convenience-and-velocity-suite/data-model.md)

---

## 1. Dịch Vụ Đồng Bộ Lịch Đa Nền Tảng (`calendarExportService.ts`)

```typescript
export interface CalendarExportPayload {
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
}

export interface CalendarExportService {
  /**
   * Sinh đường dẫn tạo sự kiện trực tiếp trên Google Calendar (RFC 5545)
   */
  generateGoogleCalendarUrl(payload: CalendarExportPayload): string;

  /**
   * Sinh nội dung tệp .ics và kích hoạt tải về máy cho Apple Calendar / Outlook
   */
  downloadIcsFile(payload: CalendarExportPayload, filename?: string): void;
}
```

---

## 2. Dịch Vụ Duyệt Hồ Sơ Thần Tốc Phím Tắt (`speedScreenerService.ts`)

```typescript
export type SpeedScreenerAction = 'advance' | 'challenge' | 'reject' | 'open_details';

export interface SpeedScreenerKeyMap {
  'KeyJ': 'next';
  'KeyK': 'prev';
  'KeyA': 'advance';
  'KeyT': 'challenge';
  'KeyR': 'reject';
  'KeyO': 'open_details';
  'Escape': 'close';
}

export interface SpeedScreenerService {
  /**
   * Trả về ứng viên tiếp theo trong danh sách đã tải trước
   */
  getNextCandidate(currentIndex: number, items: CandidatePipelineItem[]): { candidate: CandidatePipelineItem; newIndex: number };

  /**
   * Trả về ứng viên trước đó
   */
  getPrevCandidate(currentIndex: number, items: CandidatePipelineItem[]): { candidate: CandidatePipelineItem; newIndex: number };

  /**
   * Xử lý hành động từ phím tắt và trả về trạng thái pipeline mới
   */
  applyAction(action: SpeedScreenerAction, candidate: CandidatePipelineItem): CandidatePipelineItem;
}
```

---

## 3. Dịch Vụ Trộn Mẫu Email Hàng Loạt (`batchEmailService.ts`)

```typescript
export interface BatchMergeContext {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  topProjectName?: string;
  interviewSlotTime?: string;
  challengeDeadline?: string;
}

export interface BatchEmailService {
  /**
   * Biên dịch mẫu email với các thẻ biến động
   */
  compileTemplate(templateText: string, context: BatchMergeContext): string;

  /**
   * Sinh liên kết mailto: có sẵn danh sách người nhận và nội dung đã merge
   */
  generateMailtoLink(recipientEmail: string, subject: string, body: string): string;

  /**
   * Sao chép toàn bộ danh sách email đã merge vào Clipboard
   */
  copyBatchToClipboard(items: Array<{ email: string; content: string }>): Promise<boolean>;
}
```

---

## 4. Dịch Vụ Thẻ Tác Chiến 60s Bỏ Túi (`preInterviewCheatSheetService.ts`)

```typescript
export interface PreInterviewCheatSheetService {
  /**
   * Trích xuất tóm tắt tác chiến 60s từ CV và JD
   */
  generateCheatSheet(candidate: CandidatePipelineItem, cvData?: any): PreInterviewCheatSheet;

  /**
   * Lưu bộ đệm ngoại tuyến vào LocalStorage
   */
  saveOfflineCheatSheet(sheet: PreInterviewCheatSheet): void;

  /**
   * Lấy bản lưu ngoại tuyến từ LocalStorage
   */
  getOfflineCheatSheet(candidateId: string): PreInterviewCheatSheet | null;
}
```
