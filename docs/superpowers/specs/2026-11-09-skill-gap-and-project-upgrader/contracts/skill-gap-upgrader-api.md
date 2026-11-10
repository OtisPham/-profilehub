# Giao Ước Kỹ Thuật: Service API Chẩn Đoán Skill-Gap & Kiểm Định Codebase
> **Mã đặc tả:** `SPEC-20261109-SKILL-GAP-UPGRADER`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [`data-model.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-09-skill-gap-and-project-upgrader/data-model.md), [`src/services/aiCvService.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/aiCvService.ts)

---

## 1. Giao Ước Service `skillGapService.ts`

```typescript
export interface ISkillGapService {
  /**
   * Phân tích khoảng cách kỹ năng giữa hồ sơ sinh viên và tin tuyển dụng.
   * Tính toán matchedSkills, missingSkills (criticality, category) và đề xuất mini-recipes.
   */
  diagnoseSkillGap(
    studentProfile: {
      id?: string;
      skills: string[];
      projects?: Array<{ id: string; title: string; tags?: string[] }>;
    },
    job: {
      id: string;
      title: string;
      department?: string;
      required_skills?: string[];
      company_name?: string;
    }
  ): SkillGapReport;

  /**
   * Lấy báo cáo chẩn đoán đã lưu gần nhất cho một cặp (studentId, jobId)
   */
  getStoredSkillGapReport(studentId: string, jobId: string): SkillGapReport | null;

  /**
   * Cập nhật trạng thái thực thi công thức nâng cấp đồ án (Recipe) và tính toán lại readinessScore
   */
  updateRecipeStatus(
    reportId: string,
    recipeId: string,
    status: RecipeStatus
  ): SkillGapReport;

  /**
   * Lấy toàn bộ danh sách báo cáo chẩn đoán của sinh viên
   */
  getAllReportsForStudent(studentId: string): SkillGapReport[];
}
```

---

## 2. Giao Ước Service `codeHealthService.ts`

```typescript
export interface ICodeHealthService {
  /**
   * Kiểm định sức khỏe mã nguồn từ GitHub URL hoặc cấu trúc đồ án.
   * Chạy không xâm lấn, đánh giá 5 khía cạnh cốt lõi và cấp huy hiệu.
   */
  analyzeCodeHealth(project: {
    id: string;
    title: string;
    github_url?: string;
    tags?: string[];
  }): Promise<CodeHealthReport>;

  /**
   * Lấy báo cáo kiểm định mã nguồn gần nhất của một đồ án
   */
  getStoredCodeHealthReport(projectId: string): CodeHealthReport | null;

  /**
   * Khôi phục hoặc tạo nhanh báo cáo giả lập chuẩn xác khi repo ở chế độ offline/sandbox
   */
  buildMockCodeHealthReport(
    projectId: string,
    projectTitle: string,
    githubUrl: string
  ): CodeHealthReport;
}
```

---

## 3. UI Component Contracts

### 3.1. `SkillGapDiagnosticModal.tsx`
* **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `job: JobPost | null`
  - `studentSkills: string[]`
  - `studentProjects?: any[]`
  - `onApplyWithUpgradedSkills?: () => void`
* **Trạng thái hiển thị:**
  - Radial Gauge / Progress Bar hiển thị `readinessScore` (0 - 100%).
  - 2 Cột: Kỹ năng đã khớp (Xanh lá) $\leftrightarrow$ Kỹ năng còn thiếu (Đỏ/Cam phân loại Critical/Recommended).
  - Danh sách thẻ Công thức Nâng cấp Đồ án (Recipe Card) kèm checkbox hoàn thành, nút xem mã nguồn mẫu và hướng dẫn 3 bước.

### 3.2. `CodeHealthDiagnosticModal.tsx`
* **Props:**
  - `isOpen: boolean`
  - `onClose: () => void`
  - `project: Project | null`
* **Trạng thái hiển thị:**
  - Badge Huy Hiệu Điểm Sức Khỏe: `A+ Production-Ready` / `B Solid Junior` / `C Needs Refactor`.
  - Bảng Checklist 5 tiêu chuẩn vàng: README, Gitignore, Security no-leaked-env, Unit Testing, CI/CD.
  - Nút sao chép mã Markdown Huy Hiệu dán vào GitHub README.
