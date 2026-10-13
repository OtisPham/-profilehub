# SPEC: AI Phỏng Vấn Kỹ Thuật Giả Lập & Phân Tích Điểm Mù Kiến Thức (AI Mock Interview & Knowledge Blind Spot Engine)

## Problem Statement

Sinh viên CNTT thường thiếu cơ hội cọ xát thực tế với các buổi phỏng vấn kỹ thuật trực tiếp trước khi ứng tuyển. Họ không biết chính xác điểm yếu kiến thức (Knowledge Blind Spots) của mình nằm ở đâu (ví dụ: hổng kiến thức về React Lifecycle, SQL Indexing, hay Async/Await) và không có công cụ cá nhân hóa để vừa luyện tập phỏng vấn, vừa tự động sinh ra đồ án thực hành khắc phục đúng các điểm hổng đó.

## Solution

Tích hợp tính năng **AI Mock Interview & Knowledge Blind Spot Engine** vào ProfileHub cho phép Sinh viên:
1. Tham gia phỏng vấn kỹ thuật giả lập thời gian thực (Real-time Adaptive Chat) với AI theo vị trí, cấp độ hoặc Job Description (JD) tùy chỉnh.
2. Nhận Báo cáo Phân tích Điểm mù Kiến thức (Blind Spot Report) chứa ma trận lỗ hổng kiến thức và điểm số năng lực sau mỗi buổi phỏng vấn.
3. 1-Click xuất file đặc tả đồ án thực hành (`README-spec.md`) được AI thiết kế dành riêng cho việc bù đắp các điểm mù vừa phát hiện (kết nối trực tiếp với luồng `AI Project Recommendation`).
4. Xem lại toàn bộ Lịch sử Phỏng vấn (Interview History Replay) để theo dõi sự tiến bộ qua thời gian.

## User Stories

1. As a student, I want to start an AI mock interview session by selecting my target role, level, or pasting a Job Description, so that I can practice answering technical questions relevant to my career goals.
2. As a student, I want the AI interviewer to dynamically suggest topics based on my profile's tech stack, so that I don't have to manually type in what I know.
3. As a student, I want an interactive chat interface with a progress bar (5-7 questions), so that I can answer questions one by one with code snippets and track session progress.
4. As a student, I want to be able to end the mock interview session early at any time, so that I can immediately receive my blind spot analysis if I run out of time.
5. As a student, I want to view my overall interview score (0-100) and structured performance summary, so that I can gauge my interview readiness.
6. As a student, I want to see a detailed Knowledge Blind Spot Matrix categorized by severity (High/Medium/Low) with explanations, so that I understand exactly where my knowledge gaps are.
7. As a student, I want to click a "Tạo Spec Đồ Án Khắc Phục (.md)" button, so that I can export a custom project specification file designed to fix my specific blind spots.
8. As a student, I want to access my Mock Interview History at `/student/mock-interviews`, so that I can see a timeline of all my past interview attempts.
9. As a student, I want to click on any past interview session in my history, so that I can replay the full conversation and re-examine the blind spot report.
10. As a student, I want my interview history and blind spot reports to be private to my account by default, so that I can practice safely without fear of low scores affecting my public profile.

## Implementation Decisions

### 1. Data Model & Storage (Supabase Single Table Payload)
- Bảng `mock_interviews` trong Supabase lưu trữ:
  - `id` (uuid, primary key)
  - `student_id` (uuid, references profiles/auth)
  - `topic` (text, e.g. "React & Node.js")
  - `level` (text, e.g. "Intern / Fresher")
  - `jd_content` (text, optional)
  - `status` (text: `'in_progress' | 'completed'`)
  - `overall_score` (integer, 0-100)
  - `messages` (jsonb array): Mảng lưu trữ đối thoại chat `[{ id, sender: 'ai'|'student', text, code_snippet, timestamp }]`
  - `report` (jsonb object): Lưu trữ kết quả phân tích `{ summary, blind_spots: [{ topic, severity, description }], recommended_project_spec }`
  - `created_at`, `updated_at` (timestamptz)

### 2. Gemini AI Integration Service
- Xây dựng module `mockInterviewService.ts` kết nối với `@google/genai` hoặc REST API Gemini API với system instructions chuyên biệt:
  - Mode Phỏng vấn: Đóng vai Tech Lead phỏng vấn khó tính nhưng tôn trọng, đưa ra từng câu hỏi ngắn gọn, đào sâu vào câu trả lời của sinh viên.
  - Mode Phân tích Điểm mù: Đánh giá toàn bộ mảng `messages`, trích xuất ma trận điểm mù định dạng JSON ngặt nghèo.
- Xử lý lỗi API Key: Hiển thị Banner/Modal báo lỗi trực tiếp trên giao diện nếu API Key bị thiếu hoặc quá hạn quota.

### 3. UI/UX Components
- `MockInterviewSetupModal.tsx`: Form chọn chủ đề, cấp độ, dán JD.
- `MockInterviewChatView.tsx`: Màn hình phỏng vấn chat có Progress Bar (Câu 1/5, 2/5...), ô nhập text + format code snippet, nút "Kết thúc & Phân tích ngay".
- `BlindSpotReportModal.tsx`: Render Báo cáo 3 phần (Điểm số -> Ma trận Điểm mù -> Nút 1-Click Tải File Spec `.md`).
- `MockInterviewHistoryView.tsx`: Trang quản lý danh sách `/student/mock-interviews` hỗ trợ Replay từng bài phỏng vấn.

## Testing Decisions

### Good Test Principles
- Thử nghiệm hành vi bên ngoài (external behavior): Đảm bảo các hàm service trả về kết quả đúng cấu trúc JSON, trạng thái session được lưu vào Supabase đúng payload, và UI render đúng thông tin điểm mù.
- Không phụ thuộc vào chi tiết triển khai nội bộ.

### Modules to Test
- `mockInterviewService`: Unit test cho logic tạo prompt, format payload `messages` và parse JSON report từ Gemini API response.
- `mockInterviewRepository`: Test các thao tác CRUD lên bảng `mock_interviews` Supabase.
- Component render test cho `BlindSpotReportModal` và `MockInterviewHistoryView`.

## Out of Scope

- Phỏng vấn bằng giọng nói (Voice Audio STT/TTS).
- Tự động giao bài phỏng vấn bắt buộc từ Giảng viên.
- Công khai điểm mù phỏng vấn lên Verification Gateway công khai.

## Further Notes

Tính năng này phát triển dựa trên định nghĩa **Knowledge Blind Spot** và **AI Project Recommendation** quy định tại [CONTEXT.md](file:///C:/Users/ADMIN/Desktop/STUDY/PROFILEHUB/CONTEXT.md#L59-L80).
