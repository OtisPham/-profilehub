# Mô Hình Dữ Liệu (Data Model): Social Career Community Feed

> **Feature:** `SPEC-20261109-SOCIAL-CAREER-FEED`  
> **Tài liệu:** `data-model.md`

---

## 1. Thực Thể Cốt Lõi: `SocialPost`

Đại diện cho một bài viết trên dòng tin mạng xã hội.

| Trường Dữ Liệu | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ý Nghĩa |
|---|---|:---:|---|
| `id` | `string` | Có | Định danh bài viết (VD: `post_17150000_abc`) |
| `author_id` | `string` | Có | ID người đăng bài |
| `author_name` | `string` | Có | Họ tên tác giả bài viết |
| `author_avatar` | `string` | Không | Ảnh đại diện của tác giả |
| `author_role` | `string` | Có | Vai trò (`student`, `recruiter`, `instructor`) |
| `author_headline` | `string` | Không | Dòng mô tả ngắn (VD: "Senior Frontend Lead @ FPT" hoặc "SV Năm 4 ĐH Bách Khoa") |
| `is_author_verified` | `boolean` | Có | Huy hiệu Tích xanh xác thực |
| `post_type` | `PostType` | Có | Phân loại bài viết: `job_hiring`, `project_showcase`, `offer_celebration`, `tech_discussion` |
| `title` | `string` | Có | Tiêu đề bài viết |
| `content` | `string` | Có | Nội dung bài viết (hỗ trợ markdown / emoji) |
| `tags` | `string[]` | Có | Danh sách thẻ kỹ năng / chủ đề (VD: `['ReactJS', 'TuyểnDụng', 'Lương15M']`) |
| `created_at` | `string` | Có | Thời gian đăng bài (ISO string) |
| `likes_count` | `number` | Có | Số lượt yêu thích / thả cảm xúc |
| `comments_count` | `number` | Có | Số lượng bình luận |
| `is_liked` | `boolean` | Không | Trạng thái người dùng hiện tại đã bấm thích chưa |
| `is_saved` | `boolean` | Không | Đã lưu bài viết vào bookmark chưa |
| `comments` | `PostComment[]` | Có | Danh sách bình luận thảo luận |

### Các trường dữ liệu ngữ cảnh đặc biệt:
- **Nếu `post_type === 'job_hiring'`:**
  - `job_salary_range`: Dải lương hiển thị (VD: `15,000,000 - 22,000,000 VND`).
  - `job_location`: Địa điểm làm việc (`TP. Hồ Chí Minh (Hybrid)`).
  - `job_id`: ID liên kết đến tin tuyển dụng chính thức.
- **Nếu `post_type === 'project_showcase'`:**
  - `project_demo_url`: Link chạy thử sản phẩm thực tế (Live Demo).
  - `project_github_url`: Link mã nguồn GitHub để Tech Lead review.
  - `project_score`: Điểm bảo chứng của hệ thống hoặc giảng viên (VD: `9.2/10`).
- **Nếu `post_type === 'offer_celebration'`:**
  - `offer_company_name`: Tên công ty ứng viên vừa trúng tuyển.
  - `offer_position`: Vị trí nhận việc.

---

## 2. Kiểu Dữ Liệu Bổ Trợ

### 2.1 Phân Loại Bài Viết (`PostType`)
```typescript
export type PostType = 
  | 'job_hiring'          // Bài đăng tuyển dụng của Doanh nghiệp
  | 'project_showcase'     // Bài khoe đồ án có bảo chứng của Ứng viên
  | 'offer_celebration'    // Bài chúc mừng nhận việc thành công
  | 'tech_discussion';     // Bài chia sẻ tips, kinh nghiệm phỏng vấn, hỏi đáp IT
```

### 2.2 Bình Luận (`PostComment`)
```typescript
export interface PostComment {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  author_role: string;
  content: string;
  created_at: string;
}
```

### 2.3 Bộ Lọc Dòng Tin (`FeedFilter`)
```typescript
export type FeedFilter = 'all' | 'job_hiring' | 'project_showcase' | 'tech_discussion' | 'saved';
```
