# Nghiên Cứu Kỹ Thuật: Thử Thách Kỹ Thuật Thực Chiến & Bảng Chấm Điểm Phỏng Vấn Chuẩn Hóa
> **Mã đặc tả:** `SPEC-20261109-CHALLENGE-SCORECARD`  
> **Nhánh Git:** `profilehub_v1`  
> **Tài liệu tham chiếu:** [`docs/architecture/ROLES_AND_GOVERNANCE_RULES.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/architecture/ROLES_AND_GOVERNANCE_RULES.md), [`src/utils/pipelineSync.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/utils/pipelineSync.ts), [`src/pages/recruiter/CandidatePipeline.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/recruiter/CandidatePipeline.tsx)

---

## 1. Bối Cảnh & Vấn Đề Kỹ Thuật Cốt Lõi

1. **Thẩm định kỹ thuật thiếu tính thực tế (Artificial Coding Tests):**
   - Hầu hết các bài kiểm tra trực tuyến hiện nay dùng thuật toán đố mẹo (LeetCode) không phản ánh khả năng xử lý bài toán kinh doanh, hoặc sinh viên dễ dàng dùng AI để giải đề. Doanh nghiệp cần một cơ chế giao thử thách thực tế (Take-Home Challenge) gắn liền với chính kho mã nguồn đồ án của ứng viên.
2. **Quy trình phỏng vấn thiếu chuẩn hóa (Unstructured Interviewing):**
   - Phỏng vấn kỹ thuật thường phụ thuộc vào cảm tính cá nhân của người phỏng vấn. Các thành viên trong hội đồng tuyển dụng (HR, Tech Lead, Engineering Manager) không có một biểu mẫu chấm điểm chung (Scorecard) để đưa ra quyết định dựa trên dữ liệu (Data-driven Hiring).
3. **Thiên kiến vô thức trong sàng lọc hồ sơ (Unconscious Bias):**
   - Việc nhìn thấy tên trường đại học, ảnh đại diện, giới tính dễ dẫn đến định kiến vô thức, bỏ sót các ứng viên có năng lực code xuất sắc nhưng đến từ các trường ít tiếng tăm hơn.

---

## 2. Các Quyết Định Kiến Trúc & Đánh Giá Đổi Trả (Decisions & Trade-offs)

### Quyết định 1: Vòng Đời Thử Thách Kỹ Thuật Gắn Liền GitHub Pull Request (PR-Based Challenge Workflow)
- **Lựa chọn:** Xây dựng module `takeHomeChallengeService.ts` quản lý vòng đời thử thách:
  1. *Giao đề (Issued):* NTD chọn template bài toán hoặc nhập đề bài riêng, thiết lập thời hạn (48h, 72h, 5 ngày).
  2. *Làm bài & Nộp bài (Submitted):* Ứng viên tạo branch mới trên repo đồ án của mình, commit code và nộp link GitHub Pull Request + mô tả giải pháp vào hệ thống.
  3. *Đánh giá (Evaluated):* NTD xem diff code trực tiếp trên GitHub, chấm điểm và chuyển bước pipeline.
- **Lý do:** Mô phỏng 100% quy trình làm việc thực tế của kỹ sư phần mềm chuyên nghiệp (Git Branching, PR Review, Code Diff), không tốn chi phí thuê nền tảng sandbox bên ngoài.
- **Phương án thay thế đã loại bỏ:** Xây dựng web IDE sandbox trực tiếp trên trình duyệt (chi phí máy chủ lớn, hạn chế về thư viện bên thứ 3 và cấu hình môi trường).

---

### Quyết định 2: Bảng Chấm Điểm Phỏng Vấn Chuẩn Hóa 5 Tiêu Chí (Collaborative Scorecard Matrix)
- **Lựa chọn:** Chuẩn hóa theo mô hình đánh giá 5 trụ cột tương tự Google & Meta:
  - **C1: Tư duy Kiến trúc & Thiết kế Hệ thống (System Architecture):** 1 - 5 sao.
  - **C2: Năng lực Giải thích & Phản biện Mã nguồn (Code Explanation & Defense):** 1 - 5 sao.
  - **C3: Kỹ năng Gỡ lỗi & Xử lý Khủng hoảng Trực tiếp (Live Debugging):** 1 - 5 sao.
  - **C4: Kỹ năng Giao tiếp Kỹ thuật & Trình bày (Technical Communication):** 1 - 5 sao.
  - **C5: Phù hợp Văn hóa & Tinh thần Cầu thị (Culture & Team Fit):** 1 - 5 sao.
  - Điểm tổng kết: Quy đổi ra thang điểm 100 và Khuyến nghị tuyển dụng: `Strong Hire`, `Hire`, `Neutral`, `No Hire`.
  - Hỗ trợ nhiều người phỏng vấn cùng chấm điểm độc lập trên cùng 1 ứng viên, tự động tính điểm đồng thuận (Consensus Score).
- **Lý do:** Đảm bảo mọi ứng viên đều được thẩm định công bằng trên cùng một thước đo tiêu chuẩn.

---

### Quyết định 3: Chế Độ Sàng Lọc Ẩn Danh Phía Client (Client-Side Blind Screening Mode)
- **Lựa chọn:** Cung cấp công tắc `[ 🕶️ Chế Độ Ẩn Danh (Blind Screening) ]` trong `CandidatePipeline.tsx` và `CandidateSearch.tsx`:
  - Khi bật: Che tên ứng viên bằng mã định danh hash trung tính (ví dụ: `Ứng viên #DEV-7A2B`), thay ảnh đại diện bằng avatar mã hóa, ẩn tên trường đại học, email và số điện thoại.
  - Giữ nguyên các thông tin thực lực: Đồ án, Tech Stack, Điểm kiểm định Codebase (`A+ Production-Ready`), Điểm bài test kỹ thuật.
  - Cho phép mở khóa danh tính (Unmask) khi ứng viên đã vượt qua vòng sàng lọc và bước vào vòng phỏng vấn trực tiếp.
- **Lý do:** Loại bỏ triệt để thiên kiến, thúc đẩy văn hóa tuyển dụng dựa trên năng lực thực chất (Merit-based Hiring).

---

### Quyết định 4: Cơ Chế Đồng Bộ Sự Kiện Thời Gian Thực (Pipeline Event Broadcast Extension)
- **Lựa chọn:** Bổ sung các sự kiện mới vào `PipelineBroadcastEvent` trong `pipelineSync.ts`:
  - `'CHALLENGE_ISSUED'`: Kích hoạt thông báo trình duyệt đẩy đến sinh viên.
  - `'CHALLENGE_SUBMITTED'`: Bắn thông báo đến NTD khi sinh viên nộp PR link.
  - `'SCORECARD_RECORDED'`: Cập nhật điểm phỏng vấn và trạng thái ứng viên.
- **Lý do:** Giữ vững trải nghiệm thời gian thực, đồng bộ mượt mà giữa hai tab trình duyệt của NTD và Sinh viên.
