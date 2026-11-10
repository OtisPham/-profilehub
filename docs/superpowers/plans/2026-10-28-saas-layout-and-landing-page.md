# Kế Hoạch Triển Khai: Chuyển Đổi Giao Diện Consumer SaaS (HeaderBar, Landing Page & CV Workspace)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển đổi ProfileHub từ giao diện Dashboard có Sidebar cố định 240px thành nền tảng Consumer SaaS với HeaderBar kính mờ, Trang chủ Landing Page hiện đại tại `/` và biến Trang Quản lý CV (`/cv-management`) thành Workspace trung tâm.

**Architecture:** Thay thế component `Sidebar.tsx` bằng `HeaderBar.tsx` (Glassmorphism, responsive, dynamic roles) trong `MainLayout.tsx`. Xây dựng `HomePage.tsx` tại tuyến đường gốc `/` với phong cách Consumer SaaS (Linear/Stripe), cấu trúc lại luồng điều hướng trong `App.tsx` (tự động chuyển hướng `/dashboard` sang `/cv-management` hoặc `/recruiter/dashboard`).

**Tech Stack:** React 18, TypeScript Strict Mode, Tailwind CSS, Lucide React, Vitest, React Router v6.

**Spec:** `docs/superpowers/specs/2026-10-28-saas-layout-and-landing-page-design.md`

## Global Constraints
- TypeScript Strict Mode: `npx tsc --noEmit` phải đạt 0 lỗi ở mọi bước.
- Không làm vỡ hoặc suy giảm 15/15 Test Suites (56/56 Tests) hiện tại.
- Zero Flash of Unstyled Content (FOUC): Sử dụng Tailwind CSS chuẩn hóa với bảng màu Slate/Indigo/Navy.
- Chuẩn Responsive: Hoạt động trơn tru từ Mobile (< 768px) đến Desktop màn hình rộng (> 1280px).

## Review Focus
1. Menu điều hướng trên HeaderBar phải thích ứng chính xác theo vai trò đăng nhập (`student`, `recruiter`, `guest`).
2. Nút bấm `[ ✨ Tạo CV Mới ]` trên HeaderBar mở đúng luồng tạo CV hoặc điều hướng sang `/cv-builder`.
3. Chuông thông báo trên HeaderBar đồng bộ chính xác số lịch phỏng vấn real-time từ `pipelineSync.ts`.
4. Trang chủ `HomePage.tsx` hiển thị đầy đủ Hero, Product Mockup, 4 Trụ cột Bento Grid, Before/After và các nút CTA hoạt động mượt mà.
5. Việc loại bỏ Sidebar và `pl-64` trong `MainLayout.tsx` giải phóng 100% không gian ngang cho `/cv-builder` mà không làm lệch bố cục Canvas hay Live AI Coach Panel.

---

### Task 1: Xây Dựng Component HeaderBar Kính Mờ (`src/components/layout/HeaderBar.tsx`)

**Files:**
- Create: `profilehub/src/components/layout/HeaderBar.tsx`
- Create: `profilehub/src/components/layout/headerNavigation.ts`
- Test: `profilehub/src/components/layout/headerNavigation.test.ts`

**Interfaces:**
- Consumes: `useAuth` từ `../../context/AuthProvider`, `getSharedPipeline` từ `../../utils/pipelineSync`
- Produces: `<HeaderBar />` React Functional Component

- [x] **Step 1: Viết test cho HeaderBar**
- [x] **Step 2: Chạy test để xác nhận test fail do chưa có file component**
- [x] **Step 3: Xây dựng component `HeaderBar.tsx` và `headerNavigation.ts`**
- [x] **Step 4: Chạy lại test để xác nhận PASS**
- [x] **Step 5: Kiểm tra type check (`tsc --noEmit`) đạt 0 lỗi**

---

### Task 2: Xây Dựng Component Chân Trang SaaS Tối Giản (`src/components/layout/Footer.tsx`)

**Files:**
- Create: `profilehub/src/components/layout/Footer.tsx`

**Interfaces:**
- Produces: `<Footer />` React Functional Component

- [x] **Step 1: Xây dựng component `Footer.tsx`**
- [x] **Step 2: Kiểm tra type check (`tsc --noEmit`) đạt 0 lỗi**

---

### Task 3: Xây Dựng Trang Chủ Landing Page (`src/pages/public/HomePage.tsx`)

**Files:**
- Create: `profilehub/src/pages/public/HomePage.tsx`
- Create: `profilehub/src/pages/public/homePageData.ts`
- Test: `profilehub/src/pages/public/homePageData.test.ts`

**Interfaces:**
- Consumes: `useNavigate`, `Link` từ `react-router-dom`
- Produces: `<HomePage />` React Functional Component

- [x] **Step 1: Viết test cho HomePage Data**
- [x] **Step 2: Chạy test để xác nhận fail**
- [x] **Step 3: Xây dựng `HomePage.tsx` và `homePageData.ts` chuẩn Consumer SaaS**
- [x] **Step 4: Chạy test xác nhận PASS**
- [x] **Step 5: Kiểm tra type check (`tsc --noEmit`) đạt 0 lỗi**

---

### Task 4: Cập Nhật `MainLayout.tsx` — Loại Bỏ Sidebar 240px

**Files:**
- Modify: `profilehub/src/components/layout/MainLayout.tsx`

**Interfaces:**
- Consumes: `<HeaderBar />`, `<Footer />`, `<Outlet />`
- Produces: Layout wrapper bao bọc toàn bộ ứng dụng

- [x] **Step 1: Cập nhật `MainLayout.tsx` gỡ Sidebar, thay bằng HeaderBar + Footer, giải phóng không gian màn hình**
- [x] **Step 2: Kiểm tra type check (`tsc --noEmit`) đạt 0 lỗi**

---

### Task 5: Cập Nhật Định Tuyến Trong `App.tsx` & Điều Hướng Thông Minh

**Files:**
- Modify: `profilehub/src/App.tsx`

**Interfaces:**
- Consumes: `<HomePage />`, `<CVManagementPage />`, `<Dashboard />`

- [x] **Step 1: Cập nhật routing trong `App.tsx` đưa `/` về `HomePage`, `/dashboard` chuyển hướng thông minh**
- [x] **Step 2: Kiểm tra type check (`tsc --noEmit`) đạt 0 lỗi**

---

### Task 6: Kiểm Thử Toàn Diện (Full Regression Suite & Production Build)

- [x] **Step 1: Chạy toàn bộ Unit Tests (`npm test`): 17/17 Test Suites (63/63 Tests) Pass 100%**
- [x] **Step 2: Chạy kiểm tra TypeScript Strict Check (`npx tsc --noEmit`): 0 lỗi**
- [x] **Step 3: Chạy đóng gói sản xuất (`npm run build`): Thành công 100% trong 23.88s**
