# Nghiên Cứu Kỹ Thuật: Bộ Tiện Ích Siêu Tốc Độ Tuyển Dụng Dành Cho Sinh Viên & HR
> **Mã đặc tả:** `SPEC-20261111-VELOCITY-SUITE`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [`docs/superpowers/specs/2026-11-11-student-hr-convenience-and-velocity-suite/spec.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-11-student-hr-convenience-and-velocity-suite/spec.md), [`src/pages/recruiter/CandidatePipeline.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/recruiter/CandidatePipeline.tsx), [`src/utils/pipelineSync.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/utils/pipelineSync.ts)

---

## 1. Các Quyết Định Kiến Trúc & Đánh Giá Đổi Trả (Architectural Decisions & Trade-offs)

### Quyết định 1: Kiến Trúc Phím Tắt Toàn Cục & Bộ Đệm Pre-fetch Cục Bộ Cho Speed Screener
- **Lựa chọn:** Xây dựng hook `useSpeedScreenerKeyboard` lắng nghe sự kiện `keydown` ở tầng cao nhất khi modal/view Speed Screener mở ra:
  - Phím `J` / `K` (hoặc Mũi tên Lên/Xuống): Thay đổi `selectedIndex`.
  - Phím `A` / `T` / `R`: Kích hoạt hành động chuyển trạng thái Pipeline ngay lập tức (Optimistic Update).
  - Tải trước (pre-fetch) bản vẽ CV và dữ liệu đồ án của 3 ứng viên kế tiếp vào RAM/LocalStorage, tránh hiện tượng giật màn hình khi lướt nhanh.
- **Lý do:** Đạt tốc độ phản hồi tức thì $\le 50ms$, không phụ thuộc vào độ trễ mạng Internet.
- **Phương án thay thế đã loại bỏ:** Gọi API fetch CV mỗi lần bấm phím (gây giật lag $300-500ms$ và tiêu tốn băng thông).

---

### Quyết định 2: Định Dạng Lịch Đa Nền Tảng Client-Side Không Cần Backend OAuth
- **Lựa chọn:** Xây dựng tiện ích `calendarExportService.ts` tạo URL và file trực tiếp phía trình duyệt:
  1. *Google Calendar:* Tạo URL theo cú pháp `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...&location=...`
  2. *iCalendar (.ics):* Tạo Blob chuỗi tuân thủ chuẩn RFC 5545 với các thuộc tính:
     ```text
     BEGIN:VCALENDAR
     VERSION:2.0
     PRODID:-//ProfileHub//VN
     BEGIN:VEVENT
     SUMMARY:[Phỏng Vấn ProfileHub] Vị trí ...
     DTSTART:20261115T090000Z
     DTEND:20261115T100000Z
     LOCATION:Google Meet: https://meet.google.com/...
     DESCRIPTION:...
     END:VEVENT
     END:VCALENDAR
     ```
- **Lý do:** Hoạt động 100% độc lập, không yêu cầu người dùng cấp quyền Google OAuth phức tạp hay lưu trữ token nhạy cảm, chạy ngoại tuyến được.
- **Phương án thay thế đã loại bỏ:** Tích hợp Google Calendar API qua OAuth 2.0 (yêu cầu cấu hình Google Cloud Console, duyệt quyền và quản lý Refresh Token phức tạp).

---

### Quyết định 3: Cơ Chế Chọn Khung Giờ Hai Chiều Tự Khóa (Self-Service Slot Picker & Optimistic Lock)
- **Lựa chọn:** Lưu mảng `interviewSlots: Array<{ id: string, startTime: string, endTime: string, status: 'available' | 'booked', bookedBy?: string }>` trong đối tượng `CandidatePipelineItem`:
  - HR mở từ 3-5 slot thời gian.
  - Sinh viên truy cập Dashboard hoặc modal xem danh sách slot còn trống và bấm chọn 1 slot duy nhất.
  - Khi chọn, trạng thái slot đổi sang `booked`, đồng thời phát sự kiện `PipelineBroadcastEvent` kiểu `'INTERVIEW_SLOT_CONFIRMED'`.
- **Lý do:** Đơn giản, tin cậy, không làm phát sinh database phức tạp, đồng bộ thời gian thực mượt mà.

---

### Quyết định 4: Trộn Thẻ Động Cá Nhân Hóa Email Hàng Loạt (Batch Outbound Merge Engine)
- **Lựa chọn:** Xây dựng `batchEmailService.ts` với hàm Regex thay thế token:
  ```typescript
  const compileEmailTemplate = (template: string, vars: Record<string, string>) => {
    return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] || '');
  };
  ```
  Cung cấp tùy chọn:
  - *Mở Mail Client:* Tạo chuỗi `mailto:?bcc=...` hoặc mở từng email nháp.
  - *Sao chép nhanh danh sách:* Copy toàn bộ nội dung đã merge vào Clipboard để HR dán vào Gmail / Outlook.
- **Lý do:** Tôn trọng thói quen gửi thư của HR từ hòm mail công ty chính thức (`@fpt.com`, `@vng.com.vn`), tăng tỷ lệ thư vào Inbox lên 100% so với việc gửi qua dịch vụ SMTP trung gian không có chữ ký DKIM/SPF của doanh nghiệp.

---

### Quyết định 5: Bộ Nhớ Đệm Thẻ Tác Chiến 60s Bỏ Túi Hoạt Động Ngoại Tuyến
- **Lựa chọn:** Khi ứng viên chuẩn bị vào phỏng vấn, dữ liệu tóm tắt STAR, 3 killer metrics và 3 câu hỏi gợi ý được lưu trữ tự động trong `localStorage['profilehub_cheat_sheet_' + candidateId]`.
- **Lý do:** Đảm bảo ứng viên mở điện thoại xem mượt mà ngay cả khi ở dưới tầng hầm tòa nhà hoặc thang máy công ty nơi sóng 4G chập chờn.
