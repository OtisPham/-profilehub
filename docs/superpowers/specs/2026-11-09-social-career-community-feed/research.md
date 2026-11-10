# Nghiên Cứu Kỹ Thuật (Research): Social Career Community Feed

> **Feature:** `SPEC-20261109-SOCIAL-CAREER-FEED`  
> **Tài liệu:** `research.md`

---

## 1. Quyết Định Layout: 3 Cột Hiện Đại Thay Vì Dòng Tin 1 Cột Cổ Điển

- **Vấn đề:** Dòng tin 1 cột ở giữa trang nếu để trống 2 bên sẽ tạo cảm giác thừa khoảng trắng trên màn hình Desktop lớn. Ngược lại, nếu dàn trang quá rộng sẽ khiến người dùng mỏi mắt khi đọc bài viết dài.
- **Quyết định:** Sử dụng Layout 3 cột kinh điển của các nền tảng mạng xã hội hàng đầu (LinkedIn, X, Reddit):
  - Cột Trái (Left Rail - 260px): Mini Profile, thống kê hồ sơ và danh mục bộ lọc nhanh.
  - Cột Giữa (Main Feed - 640px): Hộp soạn thảo bài đăng và dòng bài viết (Newsfeed stream).
  - Cột Phải (Right Rail - 280px): Widget công việc hot, danh sách đồ án được bảo chứng cao điểm nhất trong tuần.
- **Trên thiết bị di động:** Tự động chuyển thành 1 cột tối ưu cuộn vuốt chạm mượt mà.

---

## 2. Quyết Định Lưu Trữ Dữ Liệu & Hạt Giống Ban Đầu (Data Persistence & Cold-Start Seed)

- **Vấn đề:** Một mạng xã hội mới ra mắt nếu vào mà thấy "Chưa có bài viết nào" sẽ khiến người dùng lập tức rời bỏ trang (Cold-start Drop-off).
- **Quyết định:**
  - Khởi tạo `DEFAULT_SOCIAL_POSTS` với 6+ bài viết mẫu cực kỳ chất lượng và thực tế:
    - Bài tuyển dụng từ Doanh nghiệp (kèm dải lương 15 - 25M, Tích xanh).
    - Bài khoe đồ án Web 3D / AI của sinh viên kèm link GitHub demo.
    - Bài chia sẻ tips vượt qua vòng phỏng vấn Live Coding.
    - Bài chúc mừng ứng viên vừa nhận việc từ Cổng Offer.
  - Dữ liệu tương tác (Like, Comment, Bài đăng mới) được lưu trữ tại `profilehub_social_feed_store` trong LocalStorage kết hợp Broadcast Event để đồng bộ tức thời giữa các tab trình duyệt.

---

## 3. Quyết Định Hành Động Nhanh (In-Feed Micro-Actions)

- **Vấn đề:** Thông thường muốn nộp đơn xin việc hoặc mời phỏng vấn, người dùng phải bấm nhảy qua nhiều trang phức tạp.
- **Quyết định:** Tích hợp **Micro-Actions** trực tiếp trên từng thẻ bài viết:
  - Bài tuyển dụng: Bấm `[ Ứng Tuyển Nhanh 1-Click ]` -> Mở modal xác nhận nhanh, tự động kéo CV đang kích hoạt và đồ án bảo chứng gửi cho HR.
  - Bài đồ án: Bấm `[ Mời Phỏng Vấn ]` -> Mở modal gửi lời mời vào Pipeline của Recruiter.
