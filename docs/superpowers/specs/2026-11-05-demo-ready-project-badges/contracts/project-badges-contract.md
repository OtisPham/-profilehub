# Giao Ước Kỹ Thuật: Smart Project Badges Contract
> **Mã tài liệu:** `CONTRACT-20261105-DEMO-READY-BADGES`  
> **Tính năng:** Smart Project Badges: "Demo Ready" vs "Verified Codebase"  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Giao Ước Thành Phần Giao Diện (`VerifiedBadge.tsx`)

Vị trí: [`src/components/common/VerifiedBadge.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/components/common/VerifiedBadge.tsx)

### 1.1. Props & Thuộc Tính
```typescript
export interface VerifiedBadgeProps {
  variant?: 'full' | 'demo-ready' | 'verified' | 'none';
  demoUrl?: string;
  verifiedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean; // Mặc định true nếu có demoUrl
  className?: string;
}
```

### 1.2. Hành Vi Trực Quan & Tương Tác
* Nếu `interactive={true}` và có `demoUrl`:
  - Render thẻ `<a>` (hoặc `<div>` có `role="button"` và `tabIndex={0}`).
  - Hover: Đổi nhẹ màu nền, hiệu ứng phóng to viền (scale 102%).
  - Click: Gọi `window.open(demoUrl, '_blank', 'noopener,noreferrer')` và ngăn chặn sự kiện nổi bọt (`e.stopPropagation()`).
  - Hỗ trợ phím `Enter` và `Space` cho chuẩn Accessibility (WCAG a11y).

---

## 2. Giao Ước Dịch Vụ Cốt Lõi (`projectBadgeService.ts`)

Vị trí: [`src/services/projectBadgeService.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/projectBadgeService.ts)

### 2.1. `getProjectBadgeVariant(project?: ProjectBadgeEvaluationInput): ProjectBadgeVariant`
* **Đầu vào:**
  ```typescript
  export interface ProjectBadgeEvaluationInput {
    is_verified?: boolean;
    verification_status?: string;
    demo_url?: string;
  }
  ```
* **Đầu ra:** `'full' | 'demo-ready' | 'verified' | 'none'`

### 2.2. `countCandidateProjectBadges(projects: ProjectBadgeEvaluationInput[]): { demoReadyCount: number; verifiedCount: number; fullCount: number }`
* Đếm tổng số lượng đồ án thuộc từng nhóm để hiển thị chính xác trên thẻ ứng viên và phục vụ lọc nhanh trong `CandidateSearch.tsx`.

---

## 3. Giao Ước Màn Hình Tìm Kiếm Ứng Viên (`CandidateSearch.tsx`)

1. **Thẻ Ứng Viên (Candidate Card):**
   - Hiển thị hai chip thông tin trực quan:
     * `🚀 {demoReadyCount} Demo Ready` (Nếu ứng viên có đồ án chạy thật).
     * `🛡️ {verifiedCount} Verified` (Nếu ứng viên có đồ án đã bảo chứng).
2. **Thanh Bộ Lọc (Quick Filter):**
   - Hỗ trợ nút chọn:
     * `[ 🚀 Có Demo Chạy Thật (Demo Ready) ]` (Tìm ứng viên có ít nhất 1 đồ án demo_url hoạt động).
     * `[ 🛡️ Có Đồ Án Verified ]`.

---

## 4. Giao Ước Màn Hình Quản Lý Đồ Án (`MyProjects.tsx`)

* Tại tiêu đề mỗi thẻ đồ án:
  - Gọi `getProjectBadgeVariant(proj)` để lấy biến thể phù hợp.
  - Render `<VerifiedBadge variant={variant} demoUrl={proj.demo_url} size="sm" interactive={true} />`.
  - Sinh viên và Nhà tuyển dụng có thể click trực tiếp vào huy hiệu `Demo Ready` để mở trang Live Demo ngay lập tức!
