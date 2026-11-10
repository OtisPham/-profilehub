# Đặc Tả Kỹ Thuật (Spec): Mạng Xã Hội Nghề Nghiệp & Dòng Tin Tuyển Dụng Tương Tác (Social Career Community Feed)

> **Mã đặc tả:** `SPEC-20261109-SOCIAL-CAREER-FEED`  
> **Kế hoạch liên kết:** [`docs/superpowers/plans/2026-11-09-social-career-community-feed-plan.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/plans/2026-11-09-social-career-community-feed-plan.md)  
> **Nhánh phát triển:** `profilehub_v1`  
> **Trạng thái:** DRAFT / APPROVED FOR PLANNING  
> **Đối tượng sử dụng:** Khách công khai (Guests), Sinh viên / Ứng viên (Students/Candidates), Nhà tuyển dụng / Doanh nghiệp (Recruiters).

---

## 1. Mục Đích & Phạm Vi (Goals & Scope)

### Mục Đích:
- Chuyển đổi trải nghiệm trang chủ [`HomePage.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/public/HomePage.tsx) từ một trang giới thiệu một chiều thành **Mạng Xã Hội Nghề Nghiệp & Tuyển Dụng Công Nghệ Tương Tác Hai Chiều**.
- Biến ProfileHub thành điểm đến hàng ngày (Daily Habit) của cộng đồng lập trình viên và nhà tuyển dụng, nơi người dùng có thể đọc tin tuyển dụng thực chiến, chia sẻ đồ án bảo chứng, thảo luận kinh nghiệm phỏng vấn và chúc mừng nhau khi nhận được việc làm.
- Cung cấp cơ chế **Ứng Tuyển Nhanh 1-Click (Instant Apply)** trực tiếp trên dòng tin mà không cần chuyển trang phức tạp.

### Phạm Vi (Scope):
1. **Dòng Tin Xã Hội 3 Cột (3-Column Layout):**
   - Cột trái: Thẻ tóm tắt thông tin cá nhân (Mini Profile) & Menu bộ lọc phân loại tin.
   - Cột giữa: Hộp soạn thảo bài đăng đa năng (Composer) + Dòng tin tương tác (Newsfeed).
   - Cột phải: Widget Việc Làm Nổi Bật (Hot Jobs), Đồ Án Điểm Cao (Top Verified Projects) và Doanh nghiệp tích cực.
2. **Các Loại Bài Viết Trên Dòng Tin (`PostType`):**
   - `job_hiring`: Bài tuyển dụng của doanh nghiệp kèm dải lương, tags kỹ năng, tích xanh và nút ứng tuyển ngay.
   - `project_showcase`: Bài khoe đồ án của sinh viên kèm link GitHub, Demo, điểm bảo chứng và nút mời phỏng vấn.
   - `offer_celebration`: Bài chúc mừng ứng viên vừa ký nhận offer thành công.
   - `tech_discussion`: Bài chia sẻ kinh nghiệm phỏng vấn, hỏi đáp kỹ thuật.
3. **Cơ Chế Tương Tác Xã Hội:**
   - Thả cảm xúc (`like`, `celebrate`, `insightful`).
   - Bình luận bài viết và trả lời phản hồi.
   - Lưu bài viết (Bookmark) và chia sẻ liên kết.

---

## 2. Yêu Cầu Chức Năng (Functional Requirements)

- **FR-001 (Feed Display & Filtering):** Trang chủ hiển thị dòng bài viết sắp xếp theo thời gian mới nhất hoặc bài viết nổi bật. Hỗ trợ lọc theo: `Tất cả (all)`, `Việc làm (job_hiring)`, `Đồ án (project_showcase)`, `Thảo luận (tech_discussion)`.
- **FR-002 (Quick Post Composer):** Cho phép người dùng đăng bài viết mới với tiêu đề, nội dung, loại bài viết, ảnh đính kèm, tags công nghệ và link demo/GitHub nếu có.
- **FR-003 (1-Click Instant Apply from Feed):** Trên thẻ bài viết việc làm (`job_hiring`), ứng viên có thể bấm `[ 🚀 Ứng Tuyển Nhanh 1-Click ]`. Hệ thống tự động lấy hồ sơ và đồ án tốt nhất của ứng viên gửi thẳng vào Pipeline của nhà tuyển dụng.
- **FR-004 (Direct Interview Invite from Project Post):** Trên thẻ bài viết đồ án (`project_showcase`), nhà tuyển dụng có thể bấm `[ 🎯 Mời Phỏng Vấn ]` để gửi lời mời trực tiếp đến chủ nhân đồ án.
- **FR-005 (Social Reactions & Comments):** Người dùng có thể bấm thích, đổi cảm xúc hoặc gửi bình luận góp ý dưới từng bài viết. Số lượt tương tác cập nhật ngay lập tức (Optimistic Update).
- **FR-006 (Auto-Seed Realistic Posts):** Khởi tạo sẵn một kho bài viết mẫu phong phú (người thật việc thật, các công ty công nghệ lớn, các bạn sinh viên khoe đồ án Web 3D, AI, React) để trang web luôn tràn ngập sức sống ngay từ ngày đầu ra mắt.
- **FR-007 (Responsive Layout):** Tối ưu hóa giao diện hiển thị 3 cột trên Desktop lớn, tự động ẩn sidebar phụ trên Tablet và hiển thị gọn gàng 1 cột trên Smartphone.

---

## 3. Tiêu Chuẩn Nghiệm Thu (Acceptance Criteria)

- **AC-01:** Mở trang chủ `http://localhost:5173/` ➔ Hiển thị dòng tin xã hội 3 cột sống động, có các bài viết tuyển dụng thực tế, đồ án sinh viên và tin chúc mừng nhận việc.
- **AC-02:** Bấm chuyển tab bộ lọc `[ 💼 Việc Làm ]` hoặc `[ 🚀 Đồ Án ]` ➔ Dòng tin lọc chính xác bài viết theo loại mà không reload trang.
- **AC-03:** Bấm nút `[ ❤️ Thích ]` trên bài viết ➔ Số lượt thích tăng lên ngay lập tức và icon chuyển sang màu đỏ rực rỡ.
- **AC-04:** Nhập nội dung bình luận và bấm gửi ➔ Bình luận xuất hiện ngay dưới bài viết.
- **AC-05:** Tại bài đăng tuyển dụng, bấm `[ 🚀 Ứng Tuyển Nhanh ]` ➔ Hiển thị thông báo ứng tuyển thành công kèm mã hồ sơ bảo chứng.
- **AC-06:** TypeScript check 0 lỗi, Vitest passed 100%, Vite build production thành công.
