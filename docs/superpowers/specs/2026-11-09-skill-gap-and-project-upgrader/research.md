# Nghiên Cứu Kỹ Thuật: Hệ Thống Chẩn Đoán Khoảng Cách Kỹ Năng & Trợ Lý Nâng Cấp Đồ Án (Skill-Gap Diagnostic & Project Upgrader)
> **Mã đặc tả:** `SPEC-20261109-SKILL-GAP-UPGRADER`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [`docs/architecture/ROLES_AND_GOVERNANCE_RULES.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/architecture/ROLES_AND_GOVERNANCE_RULES.md), [`src/services/aiCvService.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/aiCvService.ts), [`src/pages/student/StudentJobs.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/student/StudentJobs.tsx), [`src/pages/student/MyProjects.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/student/MyProjects.tsx)

---

## 1. Bối Cảnh & Vấn Đề Kỹ Thuật Cốt Lõi

1. **Khoảng trống thông tin giữa JD và Đồ án sinh viên:**
   - Khi sinh viên xem tin tuyển dụng, họ chỉ thấy danh sách yêu cầu chung chung (ví dụ: *Yêu cầu 1 năm kinh nghiệm NodeJS, Docker, Redis*). Sinh viên thường tự ti không dám nộp đơn, hoặc nộp đơn nhưng không biết mình thiếu kỹ năng gì trong đồ án hiện tại.
2. **Thiếu tính định hướng thực hành (Actionability):**
   - Hầu hết các nền tảng tuyển dụng chỉ dừng lại ở việc chấm điểm phần trăm (Match Score: 60%) nhưng không đưa ra giải pháp cụ thể giúp sinh viên nâng từ 60% lên 90%.
3. **Mã nguồn đồ án thiếu tiêu chuẩn công nghiệp (Production Readiness Gap):**
   - Đồ án sinh viên thường chỉ chạy được trên máy cục bộ (localhost), thiếu Unit Tests, lộ file cấu hình nhạy cảm (`.env`), không có tài liệu cài đặt chuẩn mực trong `README.md`, khiến Nhà tuyển dụng ngần ngại đánh giá cao.

---

## 2. Các Quyết Định Kiến Trúc & Đánh Giá Đổi Trả (Decisions & Trade-offs)

### Quyết định 1: Kiến trúc Kết hợp Heuristic Từ Điển Kỹ Năng & AI Diagnostic (Hybrid Engine with Fallback)
- **Lựa chọn:** Xây dựng module `skillGapService.ts` với cơ chế Hybrid:
  1. *Rule-based / Heuristic Engine:* Tự động bóc tách từ khóa công nghệ, alias (ví dụ: `['postgres', 'postgresql']`, `['react', 'reactjs']`), đối chiếu tập hợp kỹ năng từ CV và Đồ án của sinh viên với `required_skills` của Job để phân loại: `matchedSkills`, `missingSkills` (phân cấp `critical`, `recommended`, `optional`), và tính `readinessScore` (0 - 100).
  2. *AI Recipe Generator:* Khi có kết nối API (Gemini/OpenAI), hệ thống bổ sung phân tích ngữ cảnh sâu; khi chạy offline/local, hệ thống sử dụng **Recipe Template Bank** định sẵn chuẩn hóa theo từng công nghệ.
- **Lý do:** Đảm bảo hệ thống hoạt động 100% thời gian, phản hồi tức thì (< 100ms) mà không phụ thuộc vào trạng thái API AI bên ngoài.
- **Phương án thay thế đã loại bỏ:** Phụ thuộc 100% vào gọi API AI qua mạng (gây giật lag, timeout, tiêu tốn token không cần thiết cho các phép so sánh từ khóa cơ bản).

---

### Quyết định 2: Ngân Hàng Công Thức Nâng Cấp Đồ Án (Project Upgrade Recipes Bank)
- **Lựa chọn:** Xây dựng bộ công thức nâng cấp mã nguồn thực chiến (Engineering Recipes) cho các kỹ năng phổ biến nhất mà sinh viên hay thiếu:
  - **Redis / In-memory Caching:** Hướng dẫn thêm lớp Cache-aside pattern cho REST API.
  - **Docker & Docker Compose:** Hướng dẫn container hóa ứng dụng Frontend + Backend + Database.
  - **Unit Testing (Vitest / Jest / PyTest):** Hướng dẫn viết test suite đạt coverage > 80%.
  - **Message Queue (RabbitMQ / BullMQ / Kafka):** Hướng dẫn tách tác vụ nền (gửi email, xử lý ảnh) khỏi request-response cycle.
  - **Database Indexing & Query Optimization:** Hướng dẫn đánh index và tối ưu truy vấn SQL `EXPLAIN ANALYZE`.
  - **CI/CD Pipeline (GitHub Actions):** Hướng dẫn tạo workflow tự động test và lint khi tạo Pull Request.
- **Mỗi Recipe cung cấp:**
  - `title`, `estimatedHours`, `complexity` (`Beginner` | `Intermediate` | `Advanced`).
  - Hướng dẫn thực hiện 3 bước rõ ràng (`stepByStepGuide`).
  - Mã nguồn mẫu thực chiến (`codeSnippet`).
  - Tiêu chí nghiệm thu (`acceptanceCriteria`).
- **Lý do:** Biến việc học kỹ năng mới thành trải nghiệm "Gamification" gắn liền với đồ án thực tế của sinh viên, kích thích sinh viên chủ động code và cập nhật repo.

---

### Quyết định 3: Bộ Kiểm Định Sức Khỏe Mã Nguồn Không Xâm Lấn (Non-Invasive Code Quality Check)
- **Lựa chọn:** Xây dựng `codeHealthService.ts` cho phép kiểm định repo GitHub công khai của sinh viên thông qua GitHub REST API công khai (hoặc nhập thủ công file manifest / cấu trúc repo):
  - **Security Check:** Quét phát hiện file nhạy cảm `.env`, hardcoded secret keys.
  - **Documentation Check:** Kiểm tra sự tồn tại của `README.md`, hướng dẫn cài đặt và chạy thử.
  - **Testing Check:** Kiểm tra thư mục kiểm thử (`__tests__`, `tests`, `*.spec.ts`, `*.test.ts`).
  - **Architecture Health Score:** Tính điểm sức khỏe codebase từ 0 đến 100, xếp hạng phân bậc (`A+ Production-Ready`, `B Solid Junior`, `C Needs Refactor`).
  - Cấp các huy hiệu bảo chứng: `Clean Code Verified`, `Security-Checked Badge`, `Test-Ready Badge`.
- **Lý do:** Giúp sinh viên tự tin chứng minh với Nhà tuyển dụng rằng đồ án của mình không phải code rác, mà tuân thủ các chuẩn mực công nghiệp.
- **Phương án thay thế đã loại bỏ:** Bắt buộc cài đặt GitHub App phức tạp với quyền truy cập sâu (gây rào cản tâm lý cho sinh viên, vi phạm quyền riêng tư tài khoản cá nhân).

---

### Quyết định 4: Lưu Trữ & Đồng Bộ Dữ Liệu Chẩn Đoán (Storage & Sync Strategy)
- **Lựa chọn:** Lưu kết quả chẩn đoán vào `localStorage` dưới các key:
  - `profilehub_skill_gap_reports`: Lưu lịch sử chẩn đoán giữa các cặp `(studentId, jobId)`.
  - `profilehub_code_health_reports`: Lưu kết quả kiểm định codebase theo `projectId`.
  - Đồng bộ trạng thái hoàn thành mini-task với hệ thống tích điểm kỹ năng của ProfileHub.
- **Lý do:** Nhẹ nhàng, tương thích hoàn toàn với kiến trúc frontend hiện tại của ProfileHub, cho phép truy xuất tức thì mà không cần migrate schema DB nặng nề.
