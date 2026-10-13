# ⚙️ Backend Architecture Document

## 1. Database & Infrastructure
* **Engine:** PostgreSQL 15 quản lý trên nền tảng Supabase.
* **Security:** Row Level Security (RLS) với các policy nghiêm ngặt theo vai trò người dùng (Student chỉ sửa đồ án của mình, Teacher được quyền xác thực đồ án, Recruiter quản lý pipeline riêng).

## 2. Serverless Edge Functions
* `POST /functions/v1/projects-create`: Kiểm tra và tạo mới đồ án với `verification_status = 'pending'`.
* `POST /functions/v1/projects-verify`: Giảng viên thẩm định và cấp nhãn `Verified Badge 🛡️`.
* `GET /functions/v1/profile-get`: Truy xuất chi tiết hồ sơ sinh viên kèm danh sách đồ án verified.
* `GET /functions/v1/recruiter-jobs`: Danh sách tin tuyển dụng active của doanh nghiệp.
* `POST /functions/v1/recruiter-pipeline-update`: Cập nhật trạng thái ứng viên trong quy trình tuyển dụng Kanban.
