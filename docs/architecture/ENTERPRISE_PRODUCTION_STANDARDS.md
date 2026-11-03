# CHUẨN MỰC SẢN PHẨM DOANH NGHIỆP THỰC CHIẾN (ENTERPRISE PRODUCTION STANDARDS)
> *Được đúc kết từ 6 kho lưu trữ kỹ thuật doanh nghiệp quy mô toàn cầu:*
> 1. `alan2207/bulletproof-react` - Tiêu chuẩn kiến trúc ứng dụng React/TypeScript quy mô Enterprise.
> 2. `goldbergyoni/nodebestpractices` - Hơn 80 quy tắc thiết kế backend Node.js chịu tải cao và an toàn.
> 3. `donnemartin/system-design-primer` - Thiết kế hệ thống phân tán, chịu tải cao (High Availability & Scalability).
> 4. `kuchin/awesome-cto` - Quản trị công nghệ, chiến lược sản phẩm B2B/B2C SaaS từ các tập đoàn công nghệ.
> 5. `goldbergyoni/javascript-testing-best-practices` - Kiểm thử toàn diện cấp doanh nghiệp (Pyramid, Chaos, Regression).
> 6. `trimstray/the-book-of-secret-knowledge` & OWASP - Bảo mật DevSecOps, phòng thủ dữ liệu và Zero-Trust.

---

## I. CHUYỂN DỊCH TƯ DUY: TỪ "ĐỒ ÁN HỌC THUẬT" SANG "SẢN PHẨM DOANH NGHIỆP"

| Tiêu chí | Đồ Án Học Thuật (Hạn Chế) | Chuẩn Sản Phẩm Doanh Nghiệp (ProfileHub Enterprise) |
| :--- | :--- | :--- |
| **Mục tiêu sản phẩm** | Chạy được demo cho thầy cô chấm điểm, nộp báo cáo. | Giải quyết nỗi đau thị trường thực tế, sẵn sàng thương mại hóa (B2B SaaS / B2C freemium), phục vụ hàng nghìn người dùng đồng thời. |
| **Tư duy Product Owner** | Thêm nhiều tính năng càng tốt để báo cáo dày trang. | **Product-Led Growth (PLG)**, đo lường Activation Rate, Time-to-Value, giảm Churn, tối ưu tỷ lệ chuyển đổi. |
| **Kiến trúc mã nguồn** | Chia thư mục theo kiểu kỹ thuật (`components/`, `utils/`), dễ sinh mã lặp. | **Feature-Driven Architecture (`bulletproof-react`)**: Mỗi tính năng (`cv`, `dashboard`, `auth`) là một module độc lập khép kín. |
| **Xử lý dữ liệu & Lỗi** | Giả định dữ liệu luôn đúng, chỉ kiểm tra Type lúc compile. | **Runtime Validation (Zod)** + **Error Boundaries**: Ứng dụng không bao giờ bị trắng trang (crash) khi dữ liệu sai lệch. |
| **Kiểm thử chất lượng** | Viết vài test tượng trưng đối phó. | **Test Diamond / Pyramid**: Unit Test 100% logic phức tạp, Integration Test luồng thanh toán/đồng bộ, Zero Flaky Tests. |
| **Bảo mật & Vận hành** | Hardcode token, không rate limit, không phòng vệ. | **OWASP Top 10 Defense**, Zero-Trust, Sanitization chống XSS/Injection, Idempotency Keys chống trùng giao dịch. |
| **Tài liệu & Vết tích** | Viết nhật ký đối phó học viện. | **Architecture Decision Records (ADR)** ghi lại lý do đưa ra các quyết định kỹ thuật lớn + Runbook ứng cứu sự cố. |

---

## II. MA TRẬN NÂNG CẤP NĂNG LỰC DOANH NGHIỆP CHO TỪNG ROLE

### 1. Role 1: Enterprise Product Owner (Alex)
- **Tư duy:** Không chạy theo số lượng tính năng rườm rà. Tập trung vào **Core Value Loop** của ProfileHub:
  - Giúp ứng viên tạo CV đạt chuẩn ATS chỉ trong < 3 phút.
  - Tỷ lệ được nhà tuyển dụng liên hệ tăng $\ge 35\%$.
- **Idempotency & Data Integrity:** Mọi hành vi quan trọng (lưu CV, đồng bộ ngược, tạo dự án mới) phải có Idempotency Key để chống lưu trùng lặp khi mạng chập chờn.
- **Tuân thủ Quyền riêng tư (Privacy & GDPR/PDPA):** Dữ liệu ứng viên (SĐT, Email, CCCD) phải được ẩn/mã hóa khi chia sẻ link công khai.

### 2. Role 2: Enterprise BA & Solutions Architect (Sarah & David)
- **Kiến trúc Feature-Driven (`bulletproof-react`):**
  ```text
  profilehub/src/features/cv/
  ├── api/          # Các endpoint gọi dữ liệu
  ├── components/   # UI components nội bộ của tính năng CV
  ├── hooks/        # Custom hooks riêng cho CV logic
  ├── types/        # Type definitions & Zod schemas
  └── index.ts      # Public API duy nhất xuất khẩu ra bên ngoài
  ```
- **Hồ Sơ Quyết Định Kiến Trúc (Architecture Decision Record - ADR):**
  Mỗi khi chọn một thư viện (ví dụ: Zod vs Yup, Vitest vs Jest, Tailwind vs CSS Modules), BA phải ghi nhận 1 file ADR gồm: *Bối cảnh - Các phương án xem xét - Quyết định & Hệ quả*.

### 3. Role 3: Enterprise Developer
- **Runtime Validation kết hợp Compile-time (`Zod` + `TypeScript`):**
  Không tin tưởng bất kỳ dữ liệu nào đến từ LocalStorage, URL Params hoặc API backend mà không parse qua Zod Schema.
- **Enterprise Error Boundaries:**
  Mọi Widget phức tạp (`InteractiveCVCanvas`, `StarCvDiagnostic`) đều được bọc bởi `ErrorBoundary` có Fallback UI thân thiện, có nút "Thử lại" thay vì để văng lỗi trắng trang.
- **Tối ưu Core Web Vitals:**
  - LCP (Largest Contentful Paint) $< 1.2s$.
  - CLS (Cumulative Layout Shift) $= 0$.
  - INP (Interaction to Next Paint) $< 100ms$.

### 4. Role 4: Enterprise QA & Site Reliability Engineer (Tester)
- **Kiểm thử Phòng thủ (Defensive Testing):**
  - Giả lập mạng chậm (Slow 3G), mất kết nối đột ngột (Offline).
  - Giả lập dữ liệu CV siêu dài (10 trang) và kiểm tra xem `PageBudgetGuardBar` có cảnh báo đúng không.
  - Giả lập ký tự đặc biệt, emoji, script tags (`<script>alert(1)</script>`) để kiểm tra tính năng lọc XSS.
- **Zero Flakiness Policy:** Test case nào chạy 10 lần có 1 lần fail bất thường phải được cách ly và sửa ngay lập tức.

### 5. Role 5: Enterprise CI/CD & DevSecOps
- **Pre-flight Security Gate:**
  Tự động rà soát Dependency Vulnerabilities (Dependabot, `npm audit`) trước khi build.
- **Zero-Downtime Deployment & Instant Rollback:**
  Mỗi commit deploy lên Vercel Production đều có đường link Preview độc lập để kiểm chứng trước khi chuyển hướng 100% traffic người dùng thật.

### 6. Role 6: Enterprise Technical Writer & Master Diary
- **Báo cáo Kỹ thuật Chuẩn Quốc Tế:**
  - Viết tài liệu theo khung **Diátaxis**: (1) Tutorials (Hướng dẫn bắt đầu), (2) How-to Guides (Cách giải quyết vấn đề), (3) Reference (Đặc tả API/Props), (4) Explanation (Giải thích nguyên lý kiến trúc).
- **Nhật ký Thực tập Thực tế:**
  Thể hiện rõ các chỉ số kỹ thuật doanh nghiệp (Tokens, Latency, Test Coverage, Commit Hash) trong Bảng 4 Sổ BM01b, khẳng định hàm lượng chất xám thực chiến vượt xa đồ án lý thuyết thông thường.
