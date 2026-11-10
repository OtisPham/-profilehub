# Hợp Đồng Giao Diện Kỹ Thuật (API & UI Contracts)
> **Mã đặc tả:** `SPEC-20261109-GROWTH-PIPELINE`  
> **Áp dụng:** Tương tác dịch vụ giữa Sinh viên (Candidate), Nhà tuyển dụng (Recruiter) và Hệ thống Thông báo (Notification Engine).

---

## 1. Giao Thức Hàm Dịch Vụ Đồng Bộ (Pipeline Sync Service Contracts)

### 1.1 `scheduleInterviewForCandidate`
*Được gọi khi Nhà tuyển dụng lên lịch hoặc dời lịch phỏng vấn cho ứng viên từ `CandidatePipeline.tsx`.*
```typescript
function scheduleInterviewForCandidate(
  itemId: string,
  schedule: {
    interview_date: string;     // YYYY-MM-DD
    interview_time: string;     // HH:mm AM/PM
    meeting_link?: string;      // URL Google Meet / Zoom
    interview_location?: string;// Địa chỉ trực tiếp hoặc Online
    company_name?: string;      // Tên công ty tuyển dụng
    job_title?: string;         // Chức danh công việc
  },
  userId?: string
): CandidatePipelineItem[];
```
- **Hành vi:**
  1. Cập nhật `stage = 'interview'` và `interview_status = 'pending_student'`.
  2. Ghi dữ liệu vào `localStorage` (`pipeline_shared_data` & `pipeline_{userId}`).
  3. Kích hoạt `broadcastPipelineEvent` gửi thông điệp `INTERVIEW_SCHEDULED`.
  4. Trả về danh sách pipeline đã cập nhật.

---

### 1.2 `updateInterviewStatusByStudent`
*Được gọi khi Ứng viên bấm "Xác Nhận Tham Gia" hoặc "Hủy" trên `HeaderBar.tsx` hoặc `Dashboard.tsx`.*
```typescript
function updateInterviewStatusByStudent(
  studentId: string,
  status: 'confirmed' | 'cancelled'
): CandidatePipelineItem[];
```
- **Hành vi:**
  1. Cập nhật `interview_status = status`.
  2. Kích hoạt `broadcastPipelineEvent` gửi thông điệp `INTERVIEW_STATUS_UPDATED`.
  3. Phía Nhà tuyển dụng nhận được push alert: `"{studentName} đã đồng ý tham gia phỏng vấn vị trí {jobTitle}"`.

---

### 1.3 `requestInterviewRescheduleByStudent`
*Được gọi khi Ứng viên bận lịch thi cử/học tập và muốn đề xuất lịch hẹn mới.*
```typescript
function requestInterviewRescheduleByStudent(
  studentId: string,
  newDate: string,
  newTime: string,
  reason?: string
): CandidatePipelineItem[];
```
- **Hành vi:**
  1. Cập nhật `interview_status = 'reschedule_requested'`, lưu `suggested_interview_date`, `suggested_interview_time`, `student_reschedule_reason`.
  2. Kích hoạt `broadcastPipelineEvent` gửi thông điệp với `status = 'reschedule_requested'`.
  3. Phía Nhà tuyển dụng nhận được push alert: `"{studentName} đề xuất dời lịch sang {newDate} lúc {newTime}"`.

---

### 1.4 `selfInterviewService.syncFromPipelineItem`
*Được gọi để tự động tạo một buổi phỏng vấn chuẩn bị trong phòng War Room của Sinh viên.*
```typescript
function syncFromPipelineItem(item: {
  id: string;
  job?: { title?: string; company_name?: string; required_skills?: string[] };
  interview_date?: string;
  interview_time?: string;
  meeting_link?: string;
  interview_location?: string;
  interview_status?: string;
}): CandidateInterviewSession | null;
```
- **Hành vi:**
  1. Tạo hoặc cập nhật session với `id = 'recruiter_' + item.id` và `source = 'recruiter_invited'`.
  2. Tự động bóc tách Tech Stack từ JD để sinh kịch bản câu hỏi phỏng vấn thực chiến 4 chặng.

---

## 2. Giao Ước Thành Phần Giao Diện (UI Contracts)

### 2.1 Chuông Thông Báo Toàn Cục (`HeaderBar.tsx`)
- Hiển thị chấm đỏ nhấp nháy (`animate-pulse`) khi có lịch hẹn phỏng vấn cần xác nhận (`pending_student`).
- Trong menu popover:
  - Nếu quyền thông báo là `'default'`: Hiển thị banner đề xuất **"Bật thông báo đẩy"** kèm nút **"Bật ngay"**.
  - Nếu quyền là `'granted'`: Hiển thị huy hiệu xanh **"Đã kích hoạt thông báo đẩy"**.
  - Mỗi thẻ lịch hẹn có nút hành động nhanh **"Xác Nhận Tham Gia"** (1-click confirm).

### 2.2 Thẻ Ứng Viên Trên Bảng Tuyển Dụng (`CandidatePipeline.tsx`)
- Hiển thị chuẩn hóa nhãn: `🎯 Độ tương thích JD: {score}%`.
- Có nút mở **Cặp hồ sơ năng lực (Dossier)** để xem CV, Thư giới thiệu, Link GitHub, Demo URL.
- Có nút mở Modal xếp lịch phỏng vấn: chọn ngày, giờ, link Google Meet, địa điểm.
