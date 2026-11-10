# Đặc Tả Kiến Trúc & Thiết Kế Giao Diện Consumer SaaS (HeaderBar, Landing Page & CV Workspace)

- **Ngày ban hành:** 28/10/2026
- **Trạng thái:** Đã phê duyệt qua Brainstorming (Approved)
- **Tác giả:** Đội ngũ Kỹ thuật ProfileHub & Antigravity Assistant
- **Mục tiêu:** Chuyển đổi ProfileHub từ giao diện Dashboard quản trị kiểu ERP nội bộ sang nền tảng **Consumer SaaS Career Profile Platform** hiện đại, giải phóng 100% không gian màn hình viết CV và tối ưu trải nghiệm tiếp cận người dùng.

---

## 1. Bối Cảnh & Vấn Đề Cần Giải Quyết

### 1.1 Hiện trạng cũ
- Ứng dụng sử dụng thanh điều hướng dọc bên trái ([Sidebar.tsx](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/components/layout/Sidebar.tsx)) cố định 240px (`w-64`). Khi mở các trang đòi hỏi không gian lớn như Studio viết CV ([CVBuilder.tsx](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/student/CVBuilder.tsx)) kèm theo bảng [LiveAICoachPanel.tsx](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/components/cv/LiveAICoachPanel.tsx) bên phải, khung Canvas A4 ở giữa bị thu hẹp đáng kể, gây chật chội trên laptop màn hình 13-15 inch.
- Trang chủ tại URL gốc (`/`) trỏ thẳng vào [Dashboard.tsx](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/student/Dashboard.tsx) hoặc màn hình đăng nhập nhân viên công ty, thiếu một bộ mặt sản phẩm hoàn chỉnh để giải thích giá trị thực tế của ProfileHub ("Evidence-Based CV & Career Platform") cho người dùng mới.

### 1.2 Giải pháp kiến trúc mới
1. **Thay thế Sidebar 240px bằng HeaderBar Kính Mờ (Glassmorphism):** Cố định trên đỉnh (`sticky top-0 z-50`), chiều cao chuẩn 64px (`h-16`), nền trong mờ `backdrop-blur-md bg-white/85`, giải phóng toàn bộ không gian ngang cho Canvas.
2. **Xây dựng Trang Chủ Landing Page ([HomePage.tsx](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/public/HomePage.tsx)):** Đặt tại `/`, phong cách chuẩn Consumer SaaS hiện đại (Linear/Stripe), giới thiệu 4 trụ cột cốt lõi dựa trên bằng chứng kiểm chứng được (Evidence-Based).
3. **Đưa Quản Lý CV ([CVManagementPage.tsx](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/student/CVManagementPage.tsx)) thành Workspace Trung Tâm:** Là điểm đến chính của ứng viên khi truy cập ứng dụng hoặc đăng nhập.

---

## 2. Chi Tiết Thiết Kế Thành Phần (Component Specifications)

### 2.1 Thành phần HeaderBar Kính Mờ (`src/components/layout/HeaderBar.tsx`)
- **Vị trí & Bố cục:** `sticky top-0 z-50 h-16 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs`.
- **Khu vực Trái:**
  - Logo ProfileHub (Icon tia sét/tài liệu công nghệ cao màu Indigo) + Text `ProfileHub` in đậm + Badge phiên bản `v1.0`.
  - Liên kết điều hướng về trang chủ `/`.
- **Khu vực Giữa (Navigation Tabs linh hoạt theo vai trò):**
  - **Dành cho Ứng viên / Sinh viên / Khách:**
    * `Quản lý CV`: Trỏ về `/cv-management` (Active indicator khi đang ở trang này hoặc `/cv-builder`).
    * `Kho Dự án`: Trỏ về `/my-projects`.
    * `Việc làm`: Trỏ về `/student/jobs`.
    * `Menu Tiện ích ▾` (Dropdown popover):
      - 🎙️ Luyện phỏng vấn AI (`/interview-prep`)
      - 🎯 Khớp hồ sơ việc làm (`/portfolio-match`)
      - 🧠 Trắc nghiệm MBTI (`/mbti`)
      - 📜 Chứng chỉ & Năng lực (`/certificates`)
      - 👤 Hồ sơ năng lực gốc (`/my-profile`)
  - **Dành cho Nhà tuyển dụng (Recruiter):**
    * `Bảng tin tuyển dụng`: `/recruiter/dashboard`
    * `Tin tuyển dụng`: `/recruiter/jobs`
    * `Tìm kiếm ứng viên`: `/recruiter/candidates`
    * `Pipeline phỏng vấn`: `/recruiter/pipeline`
- **Khu vực Phải (Actions & Profile):**
  - Nút CTA chính: `[ ✨ Tạo CV Mới ]` (Mở modal tạo CV nhanh hoặc điều hướng sang `/cv-builder`).
  - Chuông thông báo: Kế thừa hook đồng bộ thời gian thực từ `pipelineSync.ts`, hiển thị số lượng lời mời phỏng vấn mới chưa xác nhận.
  - Avatar & Menu Tài khoản: Cho phép chuyển đổi vai trò nhanh (Sinh viên ⇄ Nhà tuyển dụng), Cài đặt và Đăng xuất.
  - Mobile Menu (Hamburger): Drawer trượt dọc hiển thị đầy đủ các liên kết khi màn hình `< 768px`.

### 2.2 Thành phần Trang Chủ Landing Page (`src/pages/public/HomePage.tsx`)
- **Hero Section:**
  - Badge: `🚀 ProfileHub v1.0 — Nền tảng tạo CV dựa trên bằng chứng & dự án thực chiến`.
  - Headline: **Xây Dựng Thương Hiệu Nghề Nghiệp Dựa Trên Bằng Chứng Thực Chiến**.
  - Sub-headline: *"Không bịa số liệu ảo. Bóc tách 1-click từ GitHub Repo, chuẩn hóa STAR kỹ thuật, bảo vệ vừa vặn 1 trang A4 và trang bị bản lĩnh phòng thủ trước Tech Lead."*
  - Dual CTA: `[ ✨ Bắt Đầu Tạo CV Ngay — Miễn Phí ]` và `[ 🌐 Khám Phá Showcase Đồ Án Mẫu ]`.
  - Trust Bar: *100% Anti-Hallucination • In chuẩn A4 kèm QR Code Demo • Chuẩn tương thích ATS*.
- **Interactive Product Mockup Section:**
  - Khung giao diện trình diễn sản phẩm (Canvas A4 với huy hiệu [👥 Đồ án nhóm], [🔗 Repo], vạch ngắt trang A4 và Live Actionable AI Coach bên cạnh đạt 92/100 điểm).
- **Core Pillars Bento Grid (4 Trụ cột):**
  1. *⚡ Bóc tách 1-Click từ GitHub Repo:* Tự động nhận diện tech stack từ `package.json` và phân tích commit tác giả thành câu văn Google XYZ / STAR.
  2. *🛡️ Anti-Hallucination & Zero Fake Metrics:* Không bịa số liệu kinh doanh viển vông; khơi gợi chỉ số kỹ thuật có thật (Lighthouse, query latency, unit test coverage).
  3. *📄 Page-Budget Guard & Dấu Ngắt Trang A4:* Kiểm soát chiều cao trang in, đảm bảo vừa khít 1 trang A4 và mã QR mở demo tức thì.
  4. *🎙️ Project Technical Defense Briefing:* Bộ 3 câu hỏi xoáy theo Tech Stack và kịch bản gỡ lỗi giúp ứng viên tự tin đối đáp khi phỏng vấn.
- **Before / After Comparison:**
  - Bảng đối sánh rõ nét giữa "CV Truyền Thống Nói Suông" vs "CV ProfileHub Minh Bạch Bằng Chứng".
- **Bottom CTA Banner:**
  - Khung xanh đen `bg-slate-900` cao cấp thúc đẩy người dùng tạo CV đầu tiên.

### 2.3 Thành phần Chân Trang Tối Giản (`src/components/layout/Footer.tsx`)
- Hiển thị logo, thông tin bản quyền và liên kết điều hướng nhanh (Về chúng tôi, Showcase mẫu, Hướng dẫn viết CV, Liên hệ).

### 2.4 Tái Cấu Trúc Bố Cục Toàn Cục (`src/components/layout/MainLayout.tsx`)
- Thay thế hoàn toàn `<Sidebar />` bằng `<HeaderBar />`.
- Bỏ padding-left `pl-64` cũ. Sử dụng cấu trúc flex dọc:
  ```tsx
  <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900">
    <HeaderBar />
    <main className="flex-1 w-full">
      <Outlet />
    </main>
    <Footer />
  </div>
  ```

### 2.5 Cập Nhật Tuyến Đường (`src/App.tsx`)
- Tuyến `/`: Trỏ vào `HomePage`.
- Tuyến `/dashboard`: Tự động chuyển hướng (Redirect):
  - Sinh viên / Ứng viên ➔ `/cv-management`
  - Nhà tuyển dụng ➔ `/recruiter/dashboard`
- Tuyến `/cv-management`: Trung tâm điều phối CV của ứng viên.
- Tuyến `/cv-builder`: Canvas biên tập CV toàn màn hình.

---

## 3. Kế Hoạch Kiểm Thử & Tiêu Chí Nghiệm Thu (Quality Gate)

1. **TypeScript Type Safety:** Thực thi `npx tsc --noEmit` đạt 0 lỗi.
2. **Automated Unit Tests:** Chạy toàn bộ test suites (`vitest run`), bảo toàn 15/15 suites (56/56 tests) pass 100%.
3. **Responsive Visual Check:**
   - Desktop (>= 1024px): HeaderBar hiển thị đầy đủ menu và nút bấm hành động; trang Canvas mở rộng 100% không gian.
   - Mobile (< 768px): Hamburger menu đóng/mở mượt mà, đầy đủ các liên kết.
4. **Luồng Chuyển Trang (Navigation Flow):**
   - Click logo ➔ Về `/`.
   - Click "Tạo CV Ngay" ➔ Dẫn vào `/cv-management` hoặc `/cv-builder`.
   - Chuyển đổi vai trò Sinh viên ⇄ Nhà tuyển dụng trên Avatar menu cập nhật HeaderBar ngay lập tức.
