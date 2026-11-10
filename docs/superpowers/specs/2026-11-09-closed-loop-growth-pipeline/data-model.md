# Mô Hình Dữ Liệu & Hợp Đồng Trạng Thái (Data Model & State Transitions)
> **Mã đặc tả:** `SPEC-20261109-GROWTH-PIPELINE`  
> **Áp dụng:** Quản lý quy trình ứng tuyển, bảo chứng năng lực và đồng bộ phỏng vấn đa bên.

---

## 1. Sơ Đồ Thực Thể & Quan Hệ (Entity Relationship)

```mermaid
erDiagram
    STUDENT_PROFILE ||--o{ PROJECT : "sở hữu"
    STUDENT_PROFILE ||--o{ CANDIDATE_PIPELINE : "ứng tuyển"
    STUDENT_PROFILE ||--o{ INTERVIEW_SESSION : "luyện tập"
    JOB_POST ||--o{ CANDIDATE_PIPELINE : "nhận hồ sơ"
    RECRUITER_PROFILE ||--o{ JOB_POST : "đăng tin"

    STUDENT_PROFILE {
        string id PK
        string full_name
        string major
        string[] skills
        boolean is_open_to_work
    }

    PROJECT {
        string id PK
        string student_id FK
        string title
        string description
        string github_url
        string demo_url
        string figma_url
        boolean is_verified
        string verification_code
        string verification_hash
        string[] technologies
    }

    JOB_POST {
        string id PK
        string recruiter_id FK
        string title
        string department
        string workplace_type
        string experience_level
        number salary_min
        number salary_max
        string currency
        string[] required_skills
        boolean is_tax_verified
        string tax_verification_tier
    }

    CANDIDATE_PIPELINE {
        string id PK
        string recruiter_id FK
        string student_id FK
        string job_id FK
        string stage
        string interview_date
        string interview_time
        string meeting_link
        string interview_location
        string interview_status
        string suggested_interview_date
        string suggested_interview_time
        string student_reschedule_reason
        string private_notes
        timestamp updated_at
    }

    INTERVIEW_SESSION {
        string id PK
        string company_name
        string role_title
        string interview_date
        string interview_time
        string format
        string meeting_link
        string[] target_tech_stack
        string source
        string status
    }
```

---

## 2. Máy Trạng Thái Ứng Tuyển & Phỏng Vấn (State Machine)

### 2.1 Quy Trình Chuyển Đổi Trạng Thái Pipeline (`stage`)
```mermaid
stateDiagram-v2
    [*] --> discovered : Ứng viên nộp đơn / HR lưu ứng viên
    discovered --> shortlisted : HR chọn vào danh sách rút gọn
    shortlisted --> contacted : HR gửi email / tin nhắn sơ khởi
    contacted --> interview : HR mở modal xếp lịch phỏng vấn
    interview --> hired : Phỏng vấn thành công, gửi Offer
    interview --> [*] : Không phù hợp (Gửi kèm Feedback điểm mù)
    hired --> [*] : Gia nhập doanh nghiệp
```

### 2.2 Quy Trình Trạng Thái Hẹn Phỏng Vấn (`interview_status`)
```mermaid
stateDiagram-v2
    [*] --> pending_student : HR xếp lịch & gửi thư mời
    pending_student --> confirmed : Ứng viên bấm "Xác Nhận Tham Gia"
    pending_student --> reschedule_requested : Ứng viên đề xuất ngày/giờ mới kèm lý do
    reschedule_requested --> pending_student : HR cập nhật lại lịch hẹn mới
    confirmed --> completed : Buổi phỏng vấn đã diễn ra
    confirmed --> cancelled : Một trong hai bên hủy lịch
    reschedule_requested --> cancelled : Hai bên không thống nhất được lịch
    completed --> [*]
    cancelled --> [*]
```

---

## 3. Cấu Trúc Bản Tin Broadcast Real-time (`PipelineBroadcastEvent`)

```typescript
export interface PipelineBroadcastEvent {
  type: 'INTERVIEW_SCHEDULED' | 'INTERVIEW_STATUS_UPDATED' | 'PIPELINE_UPDATED';
  studentId?: string;
  studentName?: string;
  jobTitle?: string;
  companyName?: string;
  interviewDate?: string;
  interviewTime?: string;
  status?: 'pending_student' | 'confirmed' | 'reschedule_requested' | 'cancelled' | 'completed';
  timestamp: number;
}
```
