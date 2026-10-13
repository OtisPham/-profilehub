# 🔄 Shared Architecture & Data Contracts

## 1. Role Definitions
* `student`: Người học đại học, tạo đồ án và tìm kiếm cơ hội việc làm.
* `teacher`: Giảng viên, người hướng dẫn, chịu trách nhiệm kiểm định chuyên môn.
* `recruiter`: Đại diện doanh nghiệp, tìm kiếm nhân sự và thực hiện phỏng vấn.

## 2. Verification Status States
* `pending`: Đồ án đã gửi yêu cầu duyệt, đang chờ giảng viên đánh giá.
* `verified`: Đồ án đã được thẩm định đạt chuẩn, gắn nhãn **Verified Badge 🛡️**.
* `rejected`: Đồ án bị từ chối hoặc cần bổ sung tài liệu.

## 3. Pipeline Stages
* `discovered` ➔ `shortlisted` ➔ `contacted` ➔ `interview` ➔ `hired`
