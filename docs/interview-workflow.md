# 🔄 Workflow & Architecture Specification: AI Interview & Feedback Loop

Sơ đồ và tài liệu dưới đây mô tả lộ trình 3 giai đoạn triển khai tính năng **Luyện tập phỏng vấn thông minh (AI Interview Prep & Feedback Loop)** cho nền tảng PROFILEHUB.

---

## 📊 1. Sơ đồ Luồng hoạt động (Mermaid Diagram)

```mermaid
graph TD
    %% Định nghĩa các Style
    classDef student fill:#d4edda,stroke:#28a745,stroke-width:2px;
    classDef recruiter fill:#cce5ff,stroke:#007bff,stroke-width:2px;
    classDef ai fill:#fff3cd,stroke:#ffc107,stroke-width:2px,stroke-dasharray: 5 5;
    classDef database fill:#e2e3e5,stroke:#6c757d,stroke-width:2px;

    %% Giai đoạn 1: Mockup Data
    subgraph Phase 1: Mockup Data & Practice UI
        S1[👨‍🎓 Sinh viên]:::student -->|Chọn vị trí ứng tuyển| DB1[(Bộ câu hỏi tĩnh theo ngành)]:::database
        DB1 --> Prac1[Luyện tập phỏng vấn cơ bản & Nhận phản hồi instant]
    end

    %% Giai đoạn 2: JD & CV Matching
    subgraph Phase 2: AI Tailored Question Generation
        R1[🏢 Nhà tuyển dụng]:::recruiter -->|Đăng tải JD| JD[Job Description - JD]
        S2[👨‍🎓 Sinh viên]:::student -->|Chọn JD & Đính kèm Đồ án Verified| AI1{🤖 AI Interview Engine}:::ai
        JD --> AI1
        AI1 -->|So khớp Skill/Đồ án Verified với JD| QG[Sinh câu hỏi kỹ thuật/Tình huống cá nhân hóa]
        QG --> Prac2[Luyện tập phỏng vấn sát thực tế & Chấm điểm AI]
    end

    %% Giai đoạn 3: Feedback Loop
    subgraph Phase 3: Recruiter Feedback Loop & Blind Spot Analysis
        Prac2 --> IV[Phỏng vấn thực tế với Recruiter]
        IV -->|Phản hồi & Chấm điểm| R2[🏢 Nhà tuyển dụng]:::recruiter
        R2 -->|Lưu nhận xét & Đánh giá| DB2[(Bảng: interview_feedbacks)]:::database
        DB2 --> AI2{🤖 AI Analysis Engine}:::ai
        AI2 -->|Bóc tách lỗ hổng kỹ năng| Rep[Báo cáo: Lỗ hổng Kỹ năng & Điểm mù Kiến thức]
        Rep --> S3[👨‍🎓 Sinh viên]:::student
        S3 -->|Học tập cải thiện| Task[Hệ thống đề xuất Khóa học / Đồ án khắc phục mới]
        Task -.-> S1
    end
```

---

## 🗄️ 2. Mô Hình Dữ Liệu Database Schema (Supabase Extension)

```sql
-- Bảng 1: Lịch sử phiên luyện tập phỏng vấn của Sinh viên
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_role VARCHAR(255) NOT NULL,
    jd_id UUID REFERENCES recruiter_jobs(id) ON DELETE SET NULL,
    score INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed', -- in_progress, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Bảng 2: Phản hồi & Đánh giá thực tế từ Nhà tuyển dụng (Phase 3)
CREATE TABLE IF NOT EXISTS interview_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES recruiter_jobs(id) ON DELETE CASCADE,
    technical_score INTEGER DEFAULT 0, -- Thang điểm 1-10
    soft_skills_score INTEGER DEFAULT 0, -- Thang điểm 1-10
    recruiter_comment TEXT,
    blind_spots TEXT[], -- Mảng lưu các điểm yếu/lỗ hổng cần khắc phục
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

## 🚀 3. Kế Hoạch Triển Khai Theo Giai Đoạn (Phase Execution Plan)

### 🟢 **PHASE 1: Mockup Data & Practice UI (Luyện Tập Phỏng Vấn Cơ Bản)**
- [x] Tạo trang `AIInterviewPrep.tsx` cho vai trò Sinh viên.
- [x] Thiết lập Bộ câu hỏi phỏng vấn chuẩn theo từng vị trí (Frontend, UI/UX, Backend, Data Analyst).
- [x] Xây dựng giao diện luyện tập phỏng vấn theo từng câu hỏi (nhập câu trả lời, nhận gợi ý đáp án chuẩn từ AI).
- [x] **QA & Verification Gate:** Chạy `npx tsc --noEmit` & `npx eslint src` đạt 0 errors.

### 🔵 **PHASE 2: AI Tailored Question Generation (Sinh Câu Hỏi Theo Đồ Án Verified & JD)**
- [x] Tích hợp `aiInterviewService` để tự động bóc tách kỹ năng từ Đồ án Verified của Sinh viên và yêu cầu từ JD.
- [x] Sinh câu hỏi tình huống thực tế cá nhân hóa theo từng dự án và vị trí tuyển dụng.
- [x] Chấm điểm câu trả lời tự động bằng AI (Match score + Điểm mạnh + Góp ý cải thiện instant).
- [x] **QA & Verification Gate:** Chạy `npx tsc --noEmit` & `npx eslint src` đạt 0 errors.

### 🟣 **PHASE 3: Feedback Loop & Blind Spot Analysis (Báo Cáo Điểm Mù Kiến Thức)**
- [x] Xây dựng Modal cho Nhà tuyển dụng nhập đánh giá phỏng vấn thực tế (`RecruiterFeedbackModal.tsx` / `interview_feedbacks`).
- [x] AI tổng hợp phân tích điểm mù kiến thức & kỹ năng của sinh viên (`feedbackService.ts`).
- [x] Gợi ý lộ trình tự học & đề xuất đồ án thực chiến khắc phục triệt để lỗ hổng.
- [x] **QA & Verification Gate:** Chạy `npx tsc --noEmit` & `npx eslint src` đạt 0 errors.