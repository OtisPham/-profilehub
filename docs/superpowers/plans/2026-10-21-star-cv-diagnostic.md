# Star CV Diagnostic & Guided STAR Project Elicitation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng tính năng "Soi CV & Khai thác Dự án chuẩn STAR" hỗ trợ ứng viên từ trang giấy trắng hoặc khi tải/dán CV thô: tự động bóc tách từng câu dự án, chỉ ra điểm yếu (thiếu S-T-A-R, dùng từ mơ hồ, thiếu số liệu đo lường kỹ thuật) và đặt 3 câu hỏi gợi mở thực tế để sinh ra gạch đầu dòng chuẩn STAR có căn cứ kỹ thuật thật 100%.

**Architecture:** 
1. Service layer `starDiagnosticService.ts` phân tích văn bản dự án/CV thành các chiều S/T, A, R; phát hiện câu chữ mơ hồ ("tham gia", "hỗ trợ") và thiếu số liệu đo lường; tạo bộ câu hỏi gợi mở khơi gợi số liệu kỹ thuật tái hiện được (EXPLAIN ANALYZE, k6, Lighthouse, test coverage); tổng hợp câu trả lời của ứng viên thành bullet point chuẩn STAR.
2. UI layer `StarCvDiagnosticModal.tsx` hỗ trợ 2 chế độ: (A) Tải file/dán CV thô để soi và bóc tách lỗi từng câu; (B) Bắt đầu từ trang giấy trắng với wizard 3 bước trả lời ngắn.
3. Tích hợp vào `CVBuilder.tsx` cho phép đồng bộ trực tiếp kết quả vào CV Canvas với 1-Click.

**Tech Stack:** React 19, TypeScript, Vitest, TailwindCSS, Lucide-react.

**Spec:** [docs/specs/project-driven-cv-builder-spec.md](file:///C:/Users/ADMIN/Desktop/STUDY/docs/specs/project-driven-cv-builder-spec.md)

## Global Constraints
- Tuân thủ nghiêm ngặt quy tắc Anti-Hallucination: Không tự động bịa đặt số liệu kinh doanh viển vông (doanh thu, triệu users).
- Mọi số liệu đo lường được gợi ý phải là số liệu kỹ thuật có thể tái hiện và kiểm chứng được (Reproducible Technical Metrics).
- Giữ nguyên 100% các bài test hiện có (13/13 suites pass, 46/46 unit tests).
- Đảm bảo TypeCheck `npx tsc --noEmit` 0 lỗi và Production Build `npm run build` thành công.

## Review Focus
1. Input rỗng hoặc chỉ có 1-2 từ (vd: "làm web") không được crash hoặc trả về kết quả undefined.
2. Phát hiện chính xác các từ khóa mơ hồ (passive verbs: "tham gia", "hỗ trợ", "phụ trách", "làm") và cảnh báo thiếu vai trò kỹ thuật.
3. Phân biệt được số liệu kỹ thuật thực tế (ms, req/s, Lighthouse score, unit tests, coverage, schema tables) với các câu khẳng định chung chung.
4. Đảm bảo wizard "trang giấy trắng" sinh ra bullet point đúng cấu trúc `[Hành động cốt lõi] + [Công nghệ/Giải pháp] + [Kết quả/Cách kiểm chứng]`.
5. Đưa dữ liệu đã tối ưu vào `CVBuilder` mà không làm mất các section hoặc thông tin cá nhân hiện có.

---

### Task 1: Core STAR Diagnostic & Elicitation Service

**Files:**
- Create: `profilehub/src/services/starDiagnosticService.ts`
- Create: `profilehub/src/services/starDiagnosticService.test.ts`

- [x] **Step 1: Write failing unit test for `diagnoseProjectStatement`**
  - Viết test kiểm tra phân tích câu mô tả dự án:
    - Câu mơ hồ: *"Tham gia phát triển trang thương mại điện tử bằng React"* $\rightarrow$ Nhận diện `hasSituation: false`, `hasAction: false` (do dùng từ passive "tham gia"), `hasResult: false`, score < 40, chỉ rõ 3 điểm cần khai thác.
    - Câu chuẩn STAR: *"Trực tiếp kiến trúc module giỏ hàng bằng React và Zustand; tối ưu hoá truy vấn MongoDB với Compound Index giảm thời gian query từ 240ms xuống 18ms trên 50.000 bản ghi"* $\rightarrow$ `hasSituation: true`, `hasAction: true`, `hasResult: true`, score >= 90.

- [x] **Step 2: Run test to confirm it fails**
  - Chạy `npx vitest run profilehub/src/services/starDiagnosticService.test.ts`.

- [x] **Step 3: Implement `diagnoseProjectStatement` & `diagnoseCvText`**
  - Định nghĩa interface `StatementDiagnosis`, `ProjectDiagnosis`, `CvDiagnosticReport`.
  - Viết bộ Regex bóc tách:
    - Passive/Vague verbs: `['tham gia', 'hỗ trợ', 'làm', 'phụ trách', 'giúp', 'tìm hiểu']`.
    - Active engineering verbs: `['kiến trúc', 'phát triển', 'xây dựng', 'tối ưu', 'tái cấu trúc', 'thiết kế', 'kiểm thử', 'đóng gói', 'triển khai']`.
    - Technical metric patterns: `(\d+(\.\d+)?\s*(%|ms|s|giây|req\/s|tps|kb|mb|score|điểm|test|tests|coverage|bản ghi|records|tables|endpoints|commits?))/i`.
  - Tính điểm sức khỏe STAR Score (0-100) và trả về danh sách `weaknesses` & `actionableTips`.

- [x] **Step 4: Write test & implementation for `generateElicitationQuestions` & `assembleStarBullets`**
  - Viết test cho phương thức gợi mở 3 câu hỏi (S/T, A, R) và phương thức tổng hợp câu trả lời của ứng viên thành bullet points hoàn chỉnh kèm lời khuyên phỏng vấn kỹ thuật (`interviewDefenseTip`).
  - Implement logic trong `starDiagnosticService.ts`.

- [x] **Step 5: Run all unit tests for `starDiagnosticService`**
  - Chạy `npx vitest run profilehub/src/services/starDiagnosticService.test.ts` và đảm bảo 100% pass.

---

### Task 2: Build `StarCvDiagnosticModal.tsx` UI Component

**Files:**
- Create: `profilehub/src/components/cv/StarCvDiagnosticModal.tsx`

- [x] **Step 1: Tạo component `StarCvDiagnosticModal` với 2 Tabs**
  - Tab 1: **"Soi CV / Dán Văn Bản"**
    - Cho phép dán đoạn văn bản CV hoặc mô tả dự án thô.
    - Nút "Phân Tích Sức Khỏe STAR" $\rightarrow$ Hiển thị bảng chẩn đoán trực quan (Score bar, danh sách gạch đầu dòng kèm badge: 🔴 Thiếu bối cảnh, 🟡 Cần làm rõ vai trò, 🔴 Thiếu số đo kỹ thuật).
    - Nút "Khai thác sâu bằng STAR" trên từng dự án để kích hoạt bộ câu hỏi gợi mở.
  - Tab 2: **"Bắt đầu từ Trang Giấy Trắng"**
    - Wizard 3 bước:
      - Bước 1 (Bối cảnh/Thách thức): Ứng viên chọn vấn đề gặp phải hoặc gõ ngắn gọn.
      - Bước 2 (Hành động & Công nghệ): Chọn tech stack và gõ vai trò trực tiếp code.
      - Bước 3 (Kết quả & Cách chứng minh): Chọn phương pháp đo lường (EXPLAIN query, k6 tải, Lighthouse, Vitest test cases) và số liệu thật.
  - Bảng xem trước Before / After trực quan và khung ghi chú "Cách giải thích với Tech Lead khi phỏng vấn".

- [x] **Step 2: Viết test cho `StarCvDiagnosticModal`**
  - Kiểm tra render modal, chuyển đổi tab, và gọi callback `onApplyProjectBullets`.

---

### Task 3: Integration into `CVBuilder.tsx`

**Files:**
- Modify: `profilehub/src/pages/student/CVBuilder.tsx`

- [x] **Step 1: Thêm nút mở modal "Soi & Khai Thác STAR" trên thanh công cụ CVBuilder**
  - Thêm button với icon Sparkles & FileSearch trên thanh điều khiển CV Canvas.
  - Kết nối state `isStarDiagnosticModalOpen`.

- [x] **Step 2: Xử lý sự kiện `onApplyProjectBullets` và `onImportExtractedProjects`**
  - Khi ứng viên bấm "Áp dụng vào CV", tự động cập nhật hoặc thêm mới project vào section `projects` của `CVBuilder`.
  - Hiển thị Toast thông báo thành công.

---

### Task 4: Verification & Production Quality Gate

**Files:**
- Run test & build verification commands

- [x] **Step 1: Run all unit tests**
  - `npm --prefix profilehub test` (14/14 test suites, 51/51 tests PASS 100%).

- [x] **Step 2: TypeCheck & Production Build**
  - `npm --prefix profilehub run build` (tsc 0 lỗi, Vite build thành công sạch sẽ).

- [ ] **Step 4: Commit & Push**
  - Commit mã nguồn với thông điệp rõ ràng và push lên nhánh `profilehub_v1`.
