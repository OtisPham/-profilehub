# Kế Hoạch Triển Khai: Mạng Xã Hội Nghề Nghiệp & Dòng Tin Tuyển Dụng Tương Tác Trên Trang Chủ (Social Career Community Feed)

> **Mã kế hoạch:** `PLAN-20261109-SOCIAL-CAREER-FEED`  
> **Mã đặc tả:** `SPEC-20261109-SOCIAL-CAREER-FEED`  
> **Áp dụng chuẩn:** [ROLES_AND_GOVERNANCE_RULES.md](file:///C:/Users/ADMIN/Desktop/STUDY/docs/architecture/ROLES_AND_GOVERNANCE_RULES.md) (Chuỗi Baton T1 - T2 - T3)  
> **Spec Directory:** [`docs/superpowers/specs/2026-11-09-social-career-community-feed/`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-09-social-career-community-feed/)  
> **Nhánh Git:** `profilehub_v1`  
> **Trạng thái:** APPROVED / READY FOR IMPLEMENTATION  
> **Mục tiêu:** Tái thiết kế trải nghiệm trang chủ [`HomePage.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/public/HomePage.tsx) từ một Landing Page tĩnh sang **Mạng Xã Hội Nghề Nghiệp Công Nghệ (Social Career & Community Feed)** chuẩn SaaS hiện đại kết hợp bảng tin 3 cột. Người tìm việc, sinh viên và nhà tuyển dụng có thể tương tác hai chiều: đăng bài chia sẻ, thảo luận, thả cảm xúc, khoe đồ án có bảo chứng, nộp hồ sơ 1-click trực tiếp trên dòng tin và săn ứng viên tức thì.

---

## 🎯 1. Bối Cảnh & Vấn Đề (Context & Problem Statement)

1. **Trang chủ tĩnh gây nhàm chán (Static Landing Page Churn):**
   - Hiện tại trang chủ ProfileHub là landing page quảng bá tính năng. Sau khi người dùng đã hiểu về sản phẩm, họ không có lý do để quay lại trang chủ mỗi ngày.
   - Các bài đăng tin tuyển dụng nằm rải rác sau các bộ lọc hoặc trang con, thiếu đi "nhịp đập sôi động" (social pulse) của một cộng đồng công nghệ thật sự.
2. **Khoảng cách tương tác giữa NTD và Ứng viên (One-way Communication):**
   - Nhà tuyển dụng chỉ biết đăng JD một chiều; ứng viên chỉ biết nộp hồ sơ rồi chờ đợi trong im lặng.
   - Không có nơi để NTD kể câu chuyện văn hóa công ty (Employer Branding), chia sẻ hình ảnh team, bài toán kỹ thuật hay chào mừng nhân sự mới.
   - Sinh viên/Ứng viên thiếu sân chơi để khoe đồ án thực chiến (Showcase) và nhận phản hồi trực tiếp từ các Tech Lead / Senior Engineer.
3. **Cơ hội Viral & Tăng trưởng tự nhiên (Organic Viral Engine):**
   - Khi trang chủ trở thành mạng xã hội việc làm có các bài viết kèm demo đồ án, nút nộp nhanh 1-click và thiệp chúc mừng nhận việc, người dùng sẽ tự động chia sẻ link bài viết lên Facebook, LinkedIn, Discord giúp kéo người dùng mới về liên tục mà không mất chi phí quảng cáo.

---

## 🏛️ 2. Kiến Trúc Giải Pháp 3 Cột (3-Column Layout Architecture)

Trang chủ sẽ được xây dựng theo layout 3 cột tối ưu chuẩn LinkedIn / Twitter / Product Hunt:

```text
┌──────────────────────┬──────────────────────────────────────────┬──────────────────────┐
│ CỘT TRÁI (260px)     │ CỘT GIỮA (Chính - 640px)                 │ CỘT PHẢI (280px)     │
│ Quick Navigation &   │ Interactive Social Feed                  │ Hot Jobs & Spotlight │
│ Mini Profile Card    │                                          │                      │
├──────────────────────┼──────────────────────────────────────────┼──────────────────────┤
│ • Thẻ cá nhân mini:  │ ✍️ Hộp Đăng Bài Đa Năng:                │ 🔥 Việc Làm Hot:     │
│   Avatar, Vai trò,   │    (Chia sẻ đồ án / Đăng tin tuyển dụng / │    Dải lương 15-30M, │
│   Huy hiệu Tích Xanh │    Tips phỏng vấn / Hỏi đáp)             │    Tích xanh ĐKKD.   │
│                      │                                          │                      │
│ • Bộ lọc Dòng tin:   │ 🏷️ Tab phân loại nhanh:                  │ 🌟 Đồ Án Bảo Chứng:  │
│   - 🌐 Tất cả tin    │    [Tất cả] [💼 Việc làm] [🚀 Đồ án]     │    Top đồ án GitHub/ │
│   - 💼 Tin tuyển dụng│    [💡 Tips & Q&A] [🎉 Vinh danh]        │    Demo điểm cao.    │
│   - 🚀 Đồ án nổi bật │                                          │                      │
│   - 💡 Thảo luận IT  │ 📰 Dòng bài viết tương tác:              │ 🏢 Doanh Nghiệp      │
│   - 🔖 Đã lưu        │    - Post Tuyển dụng: Có nút Nộp 1-click │    Tích Cực Trong    │
│                      │    - Post Đồ án: Link GitHub, video demo │    Tuần.             │
│ • Thống kê nhanh:    │    - Post Nhận việc: Chúc mừng, thiệp    │                      │
│   Số đồ án, Điểm ATS │    - Tương tác: Like, Thảo luận, Share   │ • Footer bản quyền   │
└──────────────────────┴──────────────────────────────────────────┴──────────────────────┘
```

---

## 📋 3. Phân Rã Tính Năng Trọng Tâm

### 🅰️ Dòng Bài Viết Tuyển Dụng & Đồ Án Tương Tác (The Feed Engine)
1. **Thẻ Bài Đăng Việc Làm (Hiring Post Card):**
   - Tên công ty, logo, huy hiệu Tích xanh ĐKKD & Work Email.
   - Tiêu đề vị trí, dải lương minh bạch (VD: `12,000,000 - 18,000,000 VND`), hình thức làm việc (`Hybrid / Remote`).
   - Tags kỹ năng chuẩn hóa (`ReactJS`, `Node.js`, `Docker`).
   - Nút hành động nhanh: **`[ 🚀 Ứng Tuyển Nhanh 1-Click ]`** (tự động đính kèm đồ án bảo chứng) và **`[ 💬 Hỏi HR Trực Tiếp ]`**.
2. **Thẻ Khoe Đồ Án & Nghiệm Thu (Project Showcase Card):**
   - Tên ứng viên, trường đại học/chuyên ngành.
   - Tên đồ án, mô tả giải pháp kỹ thuật và các công nghệ sử dụng.
   - Huy hiệu `Verified Demo-Ready` kèm điểm đánh giá của giảng viên/hệ thống.
   - Nút xem: `[ 🌐 Live Demo ]`, `[ 💻 GitHub Code ]`.
   - Nút dành cho NTD: **`[ 🎯 Mời Phỏng Vấn Ngay ]`** (kết nối trực tiếp vào Pipeline).
3. **Thẻ Vinh Danh Nhận Việc (Offer Celebration Card):**
   - Tự động sinh ra khi ứng viên ký nhận Offer từ Cổng công khai (`/offer/:token`).
   - Hiệu ứng thiệp mừng rực rỡ: *"Chúc mừng bạn [Tên] đã chính thức nhận Offer [Vị trí] tại [Công ty]!"*.
   - Cho phép cộng đồng thả tim `❤️`, vỗ tay `👏` và gửi lời chúc mừng.

### 🅱️ Hộp Đăng Bài Đa Năng (Quick Composer Box)
- Người dùng đã đăng nhập có thể đăng bài ngay tại đầu dòng tin:
  - Chọn chủ đề: `💼 Tin Tuyển Dụng`, `🚀 Giới Thiệu Đồ Án`, `💡 Chia Sẻ Kinh Nghiệm / Tips`, `💬 Hỏi Đáp IT`.
  - Hỗ trợ chèn link GitHub / Demo, hình ảnh, tag kỹ năng.
  - Phân quyền: Doanh nghiệp được đăng tin tuyển dụng chính thức; Sinh viên đăng bài khoe đồ án hoặc đặt câu hỏi.

### 🅲 Tương Tác Xã Hội Thời Gian Thực (Social Engagement)
- **Hệ thống cảm xúc phong phú:** `❤️ Thích (Like)`, `👏 Chúc mừng (Celebrate)`, `💡 Hữu ích (Insightful)`.
- **Luồng bình luận hai chiều (Comment Thread):** Cho phép ứng viên hỏi thêm về yêu cầu công việc hoặc giảng viên/kỹ sư review code đồ án trực tiếp dưới bài viết.
- **Lưu bài viết (Bookmark):** Lưu lại bài tuyển dụng hoặc tips phỏng vấn để xem lại sau.
- **Bộ lọc thông minh:** Chuyển đổi mượt mà giữa các tab mà không cần tải lại trang.

---

## 🛠️ 4. Phân Công Kỹ Thuật Baton Chain (T1 - T2 - T3)

- **Tầng 1 (Data Types & Models):**
  - Khai báo model `SocialPost`, `PostType`, `PostComment`, `PostReaction`, `FeedFilter` trong [`src/types/database.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/types/database.ts).
- **Tầng 2 (Logic & Storage Service):**
  - Viết `src/services/socialFeedService.ts`: CRUD bài viết, quản lý like/comment, tự động chuyển hóa Job Post và Offer Accepted thành Social Post, lưu trữ LocalStorage/Supabase Cache.
  - Viết bộ test `src/services/socialFeedService.test.ts` đảm bảo 100% logic lọc feed, tương tác và bảo toàn dữ liệu.
- **Tầng 3 (UI Components & Page Integration):**
  - Component `src/components/social/PostCard.tsx`: Thẻ bài viết đa năng (Tuyển dụng, Đồ án, Vinh danh).
  - Component `src/components/social/CreatePostBox.tsx`: Hộp soạn bài nhanh.
  - Component `src/components/social/SocialSidebarLeft.tsx`: Mini profile & bộ lọc.
  - Component `src/components/social/SocialSidebarRight.tsx`: Widget việc làm hot & đồ án nổi bật.
  - Tái thiết kế [`src/pages/public/HomePage.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/public/HomePage.tsx) thành Social Career Feed hoàn chỉnh.

---

## 🔒 5. Quality Gates & Acceptance Criteria

- **TypeScript:** `npx tsc --noEmit` đạt 0 lỗi.
- **Unit Tests:** Toàn bộ test suite cũ (54 files / 298 tests) + test mới cho `socialFeedService` pass 100%.
- **Vite Build:** `npm run build` xuất bản bundle production trơn tru.
- **UX Acceptance:** Trang chủ hiển thị ngay dòng tin xã hội sống động, cho phép lướt feed, bấm like, bình luận và bấm ứng tuyển việc làm trực tiếp mà không gặp lỗi gián đoạn.
