# Data Model: Public Verification Gateway

## Entities & Schemas

### 1. `PublicVerifiedProjectRecord` (DTO Công khai)
Đối tượng truyền tải dữ liệu công khai trên trang tra cứu bảo chứng. Đã qua lớp lọc bảo mật riêng tư.

| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `verificationCode` | `string` | Có | Mã tra cứu độc nhất (Định dạng: `PH-VER-[A-Z0-9]{6}`). |
| `verificationHash` | `string` | Có | Mã băm SHA-256 mã hóa tính toàn vẹn của đồ án. |
| `verifiedAt` | `string` | Có | Thời điểm ISO 8601 giảng viên duyệt đồ án. |
| `isValid` | `boolean` | Có | Trạng thái bảo chứng hợp lệ (`true`). |
| `project.id` | `string` | Có | Định danh đồ án. |
| `project.title` | `string` | Có | Tên đồ án kỹ thuật. |
| `project.projectType` | `string` | Có | Loại đồ án (`enterprise`, `academic`, `opensource`). |
| `project.description` | `string` | Có | Tóm tắt kiến trúc và nghiệp vụ đồ án. |
| `project.tags` | `string[]` | Có | Danh sách công nghệ (Tech Stack). |
| `project.demoUrl` | `string` | Không | Đường dẫn Web Live Demo. |
| `project.githubUrl` | `string` | Không | Đường dẫn GitHub Repository. |
| `project.figmaUrl` | `string` | Không | Đường dẫn thiết kế Figma UI/UX. |
| `project.docUrl` | `string` | Không | Đường dẫn tài liệu đặc tả đồ án. |
| `student.name` | `string` | Có | Họ tên sinh viên / tác giả đồ án. |
| `student.university` | `string` | Có | Trường đại học đào tạo. |
| `student.faculty` | `string` | Không | Khoa / Chuyên ngành đào tạo. |
| `student.avatarUrl` | `string` | Không | Ảnh đại diện của tác giả. |
| `instructor.name` | `string` | Có | Họ tên Giảng viên / Mentor bảo chứng. |
| `instructor.title` | `string` | Có | Học hàm, học vị (TS, ThS, GV...). |
| `instructor.department` | `string` | Không | Bộ môn / Viện phụ trách. |

### 2. Privacy Blacklist Rules (Rào chắn nghiêm cấm)
Tuyệt đối loại bỏ các trường sau khỏi luồng trả về cho khách công cộng:
- `student.gpa`: Điểm trung bình tích lũy.
- `student.phone`: Số điện thoại cá nhân.
- `student.email`: Địa chỉ hòm thư cá nhân.
- `student.student_id`: Mã số sinh viên nhạy cảm.
- `project.internal_notes`: Ghi chú nội bộ hoặc điểm mù kiến thức.

### 3. State Transitions & Verification Invariants
1. Đồ án chỉ được cấp `verificationCode` và `verificationHash` khi trạng thái chuyển từ `pending` sang `verified`.
2. Giá trị mã băm SHA-256 là bất biến, được tính toán dựa trên 4 yếu tố cố định:
   $$\text{SHA-256}(\text{projectId} + "|" + \text{studentId} + "|" + \text{teacherId} + "|" + \text{verifiedAt})$$
