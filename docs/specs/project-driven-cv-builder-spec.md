# 📄 Specification: Project-Driven CV Builder & Intelligent Evidence Showcase

**Status:** Ready for Implementation  
**Triage Label:** `ready-for-agent`  
**Related ADR:** [`docs/adr/0001-separate-cv-project-instances-from-master-profile.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/adr/0001-separate-cv-project-instances-from-master-profile.md)  
**Glossary Reference:** [`docs/CONTEXT.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/CONTEXT.md)

---

## 1. Problem Statement

Sinh viên, ứng viên trẻ và người chuyển ngành (Career Pivoter) gặp nhiều khó khăn khi đưa các đồ án và dự án thực tế vào CV:
1. **Mô tả chức năng đơn điệu, thiếu số liệu:** Đa số ứng viên viết mô tả dự án theo lối liệt kê chức năng bề nổi (*"Làm web bán hàng", "Làm trang quản trị"*) mà không thể hiện được chiều sâu kỹ thuật, kiến trúc hệ thống, bài toán kỹ thuật đã giải quyết và kết quả định lượng.
2. **Lạc đề so với Job Description (JD):** Khi ứng tuyển vào một vị trí cụ thể (ví dụ: Frontend React), ứng viên lúng túng không biết nên chọn 2–3 dự án nào trong kho 5–6 dự án của mình và không biết cách làm nổi bật đúng công nghệ mà nhà tuyển dụng đang tìm kiếm.
3. **Mối hoài nghi của Nhà tuyển dụng về tính xác thực:** Nhà tuyển dụng thường nghi ngờ các dự án sinh viên tự khai báo là mã nguồn sao chép trên mạng do thiếu liên kết kiểm chứng trực tiếp (Live Demo, GitHub Code Tree, tài liệu thiết kế).
4. **Vỡ bố cục trang A4:** Đưa nhiều dự án hoặc viết mô tả dài khiến CV bị tràn 3–5 dòng sang trang thứ 2 một cách vụng về, làm mất đi tính thẩm mỹ và chuẩn mực chuyên nghiệp của một CV 1 trang.
5. **Nhập nhằng giữa công sức cá nhân và đồ án nhóm:** Trong các đồ án nhóm 3–5 người, ứng viên thường viết chung chung cả sản phẩm, dẫn đến việc bị nhà tuyển dụng đánh giá là "nhận vơ" hoặc không giải thích được chi tiết khi bị phỏng vấn sâu.

---

## 2. Solution

Xây dựng hệ thống **Project-Driven CV Builder** thông minh, tập trung giải quyết trọn vẹn vòng đời đưa dự án vào CV:
1. **Mô hình Dữ liệu Độc lập (Decoupled Instances):** Tách biệt rõ giữa **Master Project** trong kho hồ sơ gốc và **CV Project Instance** trên từng bản CV, hỗ trợ **Reverse Sync** có chủ đích để lưu ngược về hồ sơ gốc khi cần.
2. **Trợ lý Tuyển chọn Dự án Minh bạch (Project Fit Explainer):** AI phân tích JD, đối chiếu với toàn bộ kho dự án của ứng viên, chấm điểm tương thích (%) và hiển thị bảng giải trình rõ ràng các từ khóa trùng khớp/thiếu để ứng viên chủ động tích chọn.
3. **Nâng cấp Câu chữ chuẩn STAR (STAR Adaptation & Diff Review):** AI cấu trúc lại câu mô tả thành các mệnh đề hành động kỹ thuật chuẩn STAR có số liệu định lượng, cho phép ứng viên so sánh trước/sau (Diff Review) và duyệt từng gạch đầu dòng; tích hợp **Anti-Hallucination Guard** ngăn chặn AI tự bịa đặt kỹ năng chưa có.
4. **Bóc tách Đóng góp Cá nhân (Scoped Contribution):** Phân tầng rõ giữa bối cảnh quy mô sản phẩm chung của nhóm và trách nhiệm kỹ thuật cụ thể do chính ứng viên trực tiếp đảm nhiệm.
5. **Minh chứng Tương tác 2 Chiều (Evidence Showcase):** Tích hợp nút bấm **Interactive Evidence Pill** (chuẩn ATS) trên bản PDF/Web và mã **Project Quick-Verify QR** trên bản in A4 để nhà tuyển dụng quét xem demo chạy thực tế trong 5 giây.
6. **Kiểm soát Dung lượng Trang Thông minh (Page-Budget Guard & Adaptive Switcher):** Thanh đo tỷ lệ đầy trang A4 thời gian thực kèm 3 công cụ 1-Click khắc phục tràn trang (AI Auto-Condense, Density Compact, và đổi luân phiên bố cục 1 cột / 2 cột theo ý muốn).
7. **Trợ lý Khởi động từ số 0 (Cold-Start Onboarding):** Quét nhanh GitHub Repository hoặc cung cấp Khung dự án tiêu chuẩn (Starter Templates) cho người mới bắt đầu.

---

## 3. User Stories

### A. Quản lý & Lựa chọn Dự án vào CV
1. *As a candidate with multiple projects*, I want the system to analyze my Job Description and rank all my Master Projects with percentage scores and explicit tech-matching reasons, so that I know exactly which 2–3 projects give me the highest chance of landing an interview.
2. *As a candidate*, I want to preview the AI's project recommendations in an interactive drawer and selectively toggle projects on or off, so that I maintain ultimate editorial control over my CV.
3. *As a candidate*, I want edits made to a project inside a specific CV to remain isolated as a CV Project Instance, so that customizing a project for a Frontend position does not corrupt the narrative I use for a Backend position.
4. *As a candidate who typed a new project directly into a CV*, I want to see a non-blocking toast upon saving with a 1-click 'Sync to Profile Library' action, so that I can preserve my project for future CVs without having my save workflow interrupted by a blocking modal.
5. *As a candidate who intentionally turned off the 'Sync to Master Profile' toggle on a temporary project*, I want the system to respect my decision and not show any sync toast upon saving, so that my choice is honored without nagging.
6. *As a candidate with zero projects in my profile*, I want the system to offer 1-click GitHub Repository scanning or industry starter templates, so that I can quickly generate my first structured project entry without a blank-page block.

### B. Tối ưu hóa Câu chữ Mô tả Kỹ thuật (STAR Phrasing)
6. *As a candidate*, I want the AI to rewrite my basic, flat project sentences into action-oriented STAR bullet points with technical context and quantifiable impact metrics, so that recruiters perceive my practical engineering competency.
7. *As a candidate*, I want a side-by-side Diff Review interface comparing my original bullet points with the AI's proposed enhancements, so that I can evaluate the phrasing line-by-line.
8. *As a candidate*, I want to accept, reject, or directly edit individual bullet points within the Diff Review modal, so that I never have to accept an all-or-nothing AI rewrite.
9. *As a candidate*, I want the AI to strictly abide by an Anti-Hallucination Guard that prevents it from inventing technologies or roles not present in my original input, so that I am never caught off-guard with false claims during an interview.
10. *As a candidate*, I want the AI to flag any recommended metric or number with a "Please verify actual metric" label, so that I can verify and adjust the numbers to reflect genuine achievements.

### C. Phân định Đồ án Nhóm vs Cá nhân
11. *As a candidate who worked in an academic group project*, I want to specify the project as a team project with team size and high-level system context, so that recruiters understand the broader product scope.
12. *As a candidate who worked in a team project*, I want the bullet points to focus 100% on my personal technical ownership and specific modules delivered, so that recruiters clearly distinguish my work from that of my teammates.
13. *As a candidate presenting a solo project*, I want an indicator highlighting that I architected and implemented the entire product end-to-end.

### D. Trưng bày Bằng chứng & Kiểm chứng Nhanh (Proof Layer)
14. *As a candidate exporting a digital PDF CV*, I want clickable, elegantly styled Interactive Evidence Pills linking directly to my live demo and GitHub repository, so that recruiters viewing my PDF on a screen can immediately test my application.
15. *As a candidate printing my CV on physical A4 paper*, I want a neat, high-resolution Project Quick-Verify QR code generated adjacent to the project, so that an interviewer holding my paper CV can scan it with a smartphone camera and open my demo instantly.
16. *As a recruiter reviewing a candidate's CV*, I want clicking a project link or scanning its QR code to open an authenticated or public evidence view displaying live demo, architecture overview, and GitHub file tree.

### E. Kiểm soát Dung lượng & Bố cục Trang A4
17. *As a candidate editing my CV*, I want a real-time Page-Budget meter displaying current A4 page height utilization (0–100%), so that I know immediately if my projects are causing an awkward page overflow.
18. *As a candidate whose CV overflows onto page 2*, I want an AI Auto-Condense button that automatically tightens the phrasing of project bullets by 10–15% while preserving all technical keywords, so that the CV snaps neatly back onto a single page.
19. *As a candidate*, I want a 1-click spacing toggle to switch between standard and compact line/section density, so that I can adjust vertical breathing room effortlessly.
20. *As a candidate*, I want an Adaptive Layout Switcher that lets me freely alternate between single-column and two-column layouts without being forced into an inflexible design, so that I can present my projects in whichever structure best suits my industry.

---

## 4. Implementation Decisions

### Modules & Architecture
1. **Decoupled CV Section State:**
   * Extend `ProjectItem` in `cvSection.ts` to support:
     * `scopeType`: `'solo' | 'team'`
     * `teamSize`?: `number`
     * `systemContext`?: `string` (high-level system scope)
     * `bullets`: `string[]` (structured STAR action points)
     * `demoUrl`?: `string`
     * `repoUrl`?: `string`
     * `qrSlug`?: `string`
     * `originMasterId`?: `string` (reference to master project for reverse sync)
2. **Project Fit Explainer Engine:**
   * Pure domain function evaluating a list of `ProjectItem` objects against parsed JD keywords.
   * Produces a scored list: `{ projectId, matchScore, matchingKeywords, missingKeywords, recommendationRationale }`.
3. **STAR Bullet Optimizer & Diff State Machine:**
   * Sub-service providing surgical prompting for project bullets:
     * Takes: `originalText`, `techStack`, `targetRole`, `jdKeywords`.
     * Returns: `Array<{ original: string, suggested: string, changedTerms: string[], requiresVerification: boolean }>`.
4. **Page-Budget Calculator:**
   * Client-side DOM measuring hook calculating total rendered CV height relative to standard A4 printable height (`1123px` at 96 DPI / `297mm`).
   * Emits utilization status: `safe (< 92%)`, `warning (92% - 100%)`, `overflow (> 100%)`.
5. **Reverse Sync Service:**
   * Dedicated method `cvService.syncCvProjectToMaster(cvProject, userId)` that performs Supabase upsert into the `projects` table upon explicit user confirmation.

---

## 5. Testing Decisions (TDD Seams)

### Good Test Principles
* **Test behavior through public interfaces:** Tests must assert against domain functions and service interfaces (`evaluateProjectFit`, `adaptProjectBullets`, `reverseSync`), never mocking private internal variables or verifying database rows out-of-band.
* **Deterministic, Non-Tautological Assertions:** Expected match scores, keyword arrays, and diff structures must be tested against realistic domain fixtures and real-world JD text.

### Testing Seams
* **Seam 1 (Domain Logic - Project Scoring):**
  * File: `src/services/projectFitService.test.ts`
  * Tests: Keyword weighting in title vs tags vs description, correct calculation of missing keywords, handling empty/unrelated projects.
* **Seam 2 (Domain Service - STAR Adaptation & Anti-Hallucination):**
  * File: `src/services/projectStarAdapter.test.ts`
  * Tests: Preservation of original technologies, generation of metric placeholders without inventing fake libraries, structure of diff review payload.
* **Seam 3 (CV Lifecycle - Reverse Sync & Isolation):**
  * File: `src/services/projectSync.test.ts`
  * Tests: Independent copy integrity (editing CV project does not mutate master project), explicit reverse sync creates or updates master project record correctly.
* **Seam 4 (Page-Budget Engine):**
  * File: `src/utils/pageBudget.test.ts`
  * Tests: Calculating height thresholds, detecting overflow conditions, formatting compact density transitions.

---

## 6. Out of Scope

* Tự động gửi CV trực tiếp tới hệ thống tuyển dụng ngoài hoặc email doanh nghiệp.
* Quét toàn bộ mã nguồn private GitHub của ứng viên (chỉ hỗ trợ repository public hoặc file README/package.json được cung cấp).
* Tự động duyệt hoặc đánh giá đồ án từ bên thứ ba (đã bãi bỏ tính năng giảng viên duyệt).
* Hệ thống sinh video demo tự động (chỉ hỗ trợ liên kết URL tới video hoặc bản demo có sẵn của ứng viên).

---

## 7. Further Notes

* File này đóng vai trò là nguồn đặc tả chính thức cho các vé công việc (`/to-tickets`) và chu trình TDD kế tiếp.
* Mọi thay đổi về thuật ngữ phải được cập nhật đồng bộ vào [`docs/CONTEXT.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/CONTEXT.md).
