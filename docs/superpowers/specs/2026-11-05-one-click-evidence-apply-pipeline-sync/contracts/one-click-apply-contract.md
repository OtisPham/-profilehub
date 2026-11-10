# Giao Ước Kỹ Thuật: 1-Click Evidence Apply & Pipeline Sync Contract
> **Mã tài liệu:** `CONTRACT-20261105-ONE-CLICK-EVIDENCE-APPLY-PIPELINE-SYNC`  
> **Tính năng:** 1-Click Evidence-Based Apply & Real-Time Two-Way Hiring Pipeline Sync  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Giao Ước Dịch Vụ Ứng Tuyển Cốt Lõi (`jobApplicationService.ts`)

Vị trí: [`src/services/jobApplicationService.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/jobApplicationService.ts)

### 1.1. Nộp Hồ Sơ Ứng Tuyển Bằng Bằng Chứng (`submitApplication`)
```typescript
export function submitApplication(
  input: JobApplicationSubmissionInput,
  currentUser?: { id: string; email?: string; full_name?: string }
): Promise<JobApplicationRecord>;
```
* **Nhiệm vụ:**
  1. Tạo bản ghi đơn ứng tuyển với bản chụp snapshot CV và đồ án.
  2. Tạo/cập nhật thẻ ứng viên trong `CandidatePipeline` của Nhà tuyển dụng tại cột `discovered` (`Ứng viên mới`).
  3. Tự động đồng bộ vào Bảng Kanban cá nhân của Sinh viên (`applicationTrackerService`).
  4. Lưu trữ đa tầng (Local Storage Cache + Supabase Cloud Database).

### 1.2. Kiểm Tra Trạng Thái Đã Ứng Tuyển (`hasStudentAppliedToJob`)
```typescript
export function hasStudentAppliedToJob(
  jobId: string, 
  studentId: string
): boolean;
```
* Kiểm tra nhanh để vô hiệu hóa nút bấm và hiển thị nhãn `[ ✅ Đã Nộp Hồ Sơ ]` trên Job Card.

### 1.3. Đồng Bộ Trạng Thái Hai Chiều & Bắn Thông Báo (`syncPipelineStageToStudent`)
```typescript
export function syncPipelineStageToStudent(
  recruiterId: string,
  studentId: string,
  jobId: string,
  newStage: PipelineStage,
  details?: {
    interviewDate?: string;
    interviewTime?: string;
    meetingLink?: string;
    interviewLocation?: string;
    companyName?: string;
    jobTitle?: string;
  }
): void;
```
* Khi Recruiter kéo thẻ trên Kanban hoặc hẹn lịch phỏng vấn, hàm này tự động:
  - Cập nhật stage trong bảng theo dõi của sinh viên.
  - Tạo thông báo mới trong danh sách chuông thông báo của sinh viên.

---

## 2. Giao Ước Component Giao Diện Người Dùng (UI Contracts)

### 2.1. Modal Ứng Tuyển Bằng Bằng Chứng (`ApplyWithEvidenceModal.tsx`)
Vị trí: [`src/components/student/ApplyWithEvidenceModal.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/components/student/ApplyWithEvidenceModal.tsx)

```typescript
export interface ApplyWithEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPost;
  companyName: string;
  onAppliedSuccess: (application: JobApplicationRecord) => void;
}
```
* **Giao diện 3 khối trực quan:**
  1. *Khối 1: Chọn Bản CV May Đo:* Liệt kê danh sách các bản CV của sinh viên (hiển thị targetRole, ngày cập nhật, tag CV Mặc Định).
  2. *Khối 2: Chọn Đồ Án Minh Chứng Nổi Bật:* Hiển thị danh sách đồ án thực tế kèm huy hiệu `🚀 Demo Ready` và `🛡️ Verified Code`. Cho phép sinh viên tick chọn 1 - 2 đồ án xuất sắc nhất.
  3. *Khối 3: Thư Giới Thiệu / Pitch Ngắn:* Tự động điền lời chào súc tích, cho phép sinh viên chỉnh sửa tự do.
  4. *Nút hành động:* `[ 🚀 Xác Nhận Nộp Đơn Bằng Bằng Chứng ]` (kèm hiệu ứng loading và gửi đơn).

### 2.2. Nâng Cấp Sàn Việc Làm Sinh Viên (`StudentJobs.tsx`)
* Nút bấm trên Job Card:
  - Nếu chưa nộp: `[ 🚀 Ứng Tuyển Ngay ]` ➔ Mở `ApplyWithEvidenceModal`.
  - Nếu đã nộp: `[ ✅ Đã Nộp Hồ Sơ - Đang Chờ Phản Hồi ]` (disabled, hiển thị ngày nộp và trạng thái hiện tại).

### 2.3. Nâng Cấp Thẻ Kanban Nhà Tuyển Dụng (`CandidatePipeline.tsx`)
* Trên thẻ ứng viên ở cột `discovered`:
  - Hiển thị danh sách đồ án được đính kèm với huy hiệu `VerifiedBadge` đa biến thể (`🚀 Demo Ready`, `🛡️ Verified Code`).
  - Nhà tuyển dụng có thể click trực tiếp vào badge để mở link demo kiểm tra sản phẩm.
  - Hiển thị tên bản CV đã nộp và đoạn trích Cover Note.
