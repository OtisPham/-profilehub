# Mô Hình Dữ Liệu: Lời Mời Phỏng Vấn Trực Tiếp Từ Cổng Công Khai
> **Mã đặc tả:** `SPEC-20261109-VIRAL-GATEWAY`  
> **Áp dụng:** Quản lý lời mời phỏng vấn và chuyển đổi ứng viên từ trang công khai.

---

## 1. Cấu Trúc Dữ Liệu Lời Mời Phỏng Vấn Đến (Inbound Interview Invite)

```typescript
export interface InboundInterviewInvite {
  id: string;
  verification_code: string;
  student_id: string;
  student_name: string;
  recruiter_id?: string;
  company_name: string;
  recruiter_email: string;
  role_title: string;
  proposed_date: string;       // YYYY-MM-DD
  proposed_time: string;       // HH:mm AM/PM
  meeting_link?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}
```

---

## 2. Tích Hợp Vào Bảng Kanban Pipeline (`CandidatePipelineItem`)

Khi lời mời phỏng vấn trực tiếp được gửi:
- Hệ thống tự động tạo một `CandidatePipelineItem`:
  - `id`: `pipe_inbound_{timestamp}`
  - `stage`: `'interview'`
  - `interview_status`: `'pending_student'`
  - `student_id`: `student_id` của đồ án
  - `job`: `{ id: 'job_inbound', title: role_title, company_name: company_name }`
  - `interview_date`: `proposed_date`
  - `interview_time`: `proposed_time`
  - `meeting_link`: `meeting_link`
  - `private_notes`: `message` kèm tag `[Inbound từ Cổng Bảo Chứng Công Khai]`
- Phát sự kiện `INTERVIEW_SCHEDULED` qua `pipelineSync.ts` để chuông thông báo trên máy sinh viên lập tức nhấp nháy đỏ!
