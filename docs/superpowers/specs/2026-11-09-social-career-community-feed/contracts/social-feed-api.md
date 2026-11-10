# Giao Kèo & Hợp Đồng Kỹ Thuật (Contracts): Social Feed API

> **Feature:** `SPEC-20261109-SOCIAL-CAREER-FEED`  
> **Tài liệu:** `contracts/social-feed-api.md`

---

## 1. Service Interface: `socialFeedService`

### `getPosts(filter?: FeedFilter): SocialPost[]`
- **Mục đích:** Lấy danh sách bài viết trên dòng tin, tự động sắp xếp theo thứ tự mới nhất hoặc bài vinh danh nổi bật.
- **Tham số:** `filter`: `'all' | 'job_hiring' | 'project_showcase' | 'tech_discussion' | 'saved'`.
- **Đầu ra:** Mảng các đối tượng `SocialPost`.

---

### `createPost(params: CreatePostParams): SocialPost`
- **Mục đích:** Đăng bài viết mới lên dòng tin mạng xã hội.
- **Ràng buộc:** Tiêu đề và nội dung không được để trống; tự động gán ID duy nhất và thời gian đăng bài hiện tại.

---

### `toggleLikePost(postId: string): { success: boolean; likesCount: number; isLiked: boolean }`
- **Mục đích:** Thả cảm xúc hoặc bỏ thích bài viết.
- **Tác vụ:** Tăng/giảm `likes_count` và cập nhật cờ `is_liked` tức thời.

---

### `toggleBookmarkPost(postId: string): { success: boolean; isSaved: boolean }`
- **Mục đích:** Lưu bài viết vào mục Bookmark cá nhân hoặc bỏ lưu.

---

### `addComment(postId: string, comment: { authorId: string; authorName: string; content: string }): PostComment`
- **Mục đích:** Thêm một bình luận thảo luận vào bài viết.
- **Đầu ra:** Trả về đối tượng `PostComment` vừa tạo, tự động tăng `comments_count`.

---

### `quickApplyJobFromPost(postId: string, applicant: { studentId: string; studentName: string }): { success: boolean; message: string }`
- **Mục đích:** Thực hiện ứng tuyển nhanh 1-click từ bài viết việc làm, tự động đẩy hồ sơ vào `getSharedPipeline()` của Nhà tuyển dụng.
