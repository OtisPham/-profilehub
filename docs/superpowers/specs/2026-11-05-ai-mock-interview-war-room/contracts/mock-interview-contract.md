# Giao Ước Kỹ Thuật: AI Mock Interview War Room & Radar Contract
> **Mã tài liệu:** `CONTRACT-20261105-AI-MOCK-INTERVIEW-WAR-ROOM`  
> **Tính năng:** AI Mock Interview Simulator & 5-Axis Radar Skill Competency Matrix (FR-008)  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Giao Ước Dịch Vụ Cốt Lõi (`aiMockInterviewService.ts`)

Vị trí: [`src/services/aiMockInterviewService.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/aiMockInterviewService.ts)

### 1.1. Khởi Tạo Phiên Phỏng Vấn Thích Ứng
```typescript
export function generateInterviewSession(
  candidateName: string,
  roleTitle?: string,
  projectName?: string,
  techStack?: string[],
  missingSkill?: string,
  companyName?: string
): InterviewQuestion[];
```
* **Đầu vào:** Tên ứng viên, Vị trí mong muốn, Đồ án được chọn, Danh sách công nghệ chính của đồ án, Kỹ năng còn thiếu trong JD, Tên công ty ứng tuyển.
* **Đầu ra:** Danh sách 4 câu hỏi thực chiến chuẩn hóa theo 4 chặng:
  - Chặng 1: Elevator Pitch (60-90s)
  - Chặng 2: Deep-Dive Đồ Án & Kiến Trúc STAR
  - Chặng 3: Xử Lý Khủng Hoảng Sự Cố Hệ Thống
  - Chặng 4: Bào Chữa Lỗ Hổng Kỹ Năng

### 1.2. Đánh Giá Câu Trả Lời & Câu Hỏi Vặn Tech Lead
```typescript
export function evaluateAnswer(
  question: InterviewQuestion,
  answer: string
): InterviewAnswerFeedback;
```
* **Quy tắc chấm:**
  - Phát hiện số liệu kỹ thuật thực tế (`ms`, `RPS`, `%`, `connections`) $\to$ Điểm cộng chất lượng (+15đ).
  - Thuật ngữ chuyên sâu kiến trúc $\to$ Điểm cộng chuyên môn (+10đ).
  - Thiếu dẫn chứng cụ thể $\to$ Kích hoạt `followUpProbing` ("Tech Lead chất vấn lại").

### 1.3. Tính Toán Tọa Độ Biểu Đồ Radar SVG 5 Trục
```typescript
export function calculateRadarPolygonPoints(
  scores: RadarScoreRecord,
  cx?: number,
  cy?: number,
  radius?: number
): string;
```
* **Đầu ra:** Chuỗi tọa độ `"x0,y0 x1,y1 x2,y2 x3,y3 x4,y4"` để render trực tiếp vào thuộc tính `points` của thẻ `<polygon>`.

### 1.4. Quản Lý & Lưu Trữ Lịch Sử Phiên Phỏng Vấn
```typescript
export function saveInterviewRecord(record: StoredInterviewRecord): void;
export function getStoredInterviewRecords(studentId?: string): StoredInterviewRecord[];
```

---

## 2. Giao Ước Màn Hình Trang Độc Lập (`src/pages/student/MockInterview.tsx`)

* **Đường dẫn truy cập:** `/mock-interview` (hoặc `/interview-prep`)
* **Bảo vệ đăng nhập:** `allowedRoles={['student']}`
* **Các chế độ hiển thị:**
  1. `mode === 'setup'`:
     - Dropdown chọn đồ án thực tế của sinh viên (hiển thị tag `🚀 Demo Ready`, `🛡️ Verified`).
     - Chọn vị trí công việc từ sàn việc làm ProfileHub hoặc dán JD thô.
     - Nút `[ 🎙️ Bắt Đầu Phỏng Vấn Thử Ngay ]`.
  2. `mode === 'session'`:
     - Đồng hồ đếm ngược áp lực thời gian (Timer) theo từng chặng.
     - Ô trả lời bằng bàn phím kèm nút gửi câu trả lời.
     - Thẻ phản hồi tức thì của AI Coach + Câu hỏi vặn Tech Lead nếu có.
  3. `mode === 'report'`:
     - Thẻ điểm tổng thể và Huy hiệu xếp loại tuyển dụng (`Strong Hire`, `Hire`, `Leaning Hire`).
     - **Biểu đồ Radar SVG 5 trục** tương tác mượt mà.
     - Bảng so sánh cấp bậc (`Fresher`, `Junior 1`, `Junior 2`) và dải lương đề xuất.
     - Nút `[ In Báo Cáo Phỏng Vấn / PDF ]` và `[ Luyện Tập Phiên Mới ]`.
  4. `mode === 'history'`:
     - Danh sách các phiên phỏng vấn đã thực hiện, cho phép sinh viên xem lại hành trình cải thiện điểm số.
