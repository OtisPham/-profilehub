# Đặc Tả Kỹ Thuật (Spec): Hồ Sơ Đánh Giá Phỏng Vấn Chuyên Sâu & Xuất Báo Cáo Điều Hành PDF (Executive Evaluation Dossier & 1-Click PDF Export)

> **Mã đặc tả:** `SPEC-20261109-EXECUTIVE-DOSSIER-PDF`  
> **Kế hoạch liên kết:** [`docs/superpowers/plans/2026-11-09-candidate-dossier-and-executive-pdf-export-plan.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/plans/2026-11-09-candidate-dossier-and-executive-pdf-export-plan.md)  
> **Nhánh phát triển:** `profilehub_v1`  
> **Trạng thái:** COMPLETED / VERIFIED IN PRODUCTION (53 test files, 293 tests pass)

---

## 1. Bối Cảnh & Vấn Đề (Context & Problem Statement)

Trong thực tế tuyển dụng tại các công ty công nghệ, quy trình ra quyết định tuyển dụng không bao giờ kết thúc ở phòng phỏng vấn:
1. **Sự gián đoạn thông tin giữa Người phỏng vấn và Người ký duyệt (Handoff Gap):** Người trực tiếp phỏng vấn (Tech Lead, Senior Engineer) chấm điểm kỹ thuật và ghi chú chi tiết. Tuy nhiên, người quyết định cấp ngân sách và ký duyệt offer lại là Giám đốc kỹ thuật (CTO/VP of Engineering), Giám đốc nhân sự (CHRO) hoặc CEO. Những nhà điều hành này **không bao giờ đăng nhập vào website tuyển dụng** để lội qua từng thẻ Kanban hay bấm vào từng trang con để đọc code.
2. **Dữ liệu bị "giam cầm" trong trình duyệt (Data Lock-in):** ProfileHub đã có bảng chấm Scorecard 5 tiêu chuẩn vàng, bài giải Take-Home Challenge, đồ án bảo chứng và ghi chú nội bộ. Nhưng hiện tại không có cách nào để đóng gói toàn bộ bức tranh năng lực này thành một tài liệu tiêu chuẩn, chuyên nghiệp để gửi qua email hoặc in ấn trong buổi họp hội đồng tuyển dụng (Hiring Committee).
3. **Mất thời gian soạn thảo báo cáo thủ công:** HR Specialist thường phải mất từ 30 - 45 phút cho mỗi ứng viên để copy-paste điểm số, nhận xét, link GitHub PR vào file Word/PowerPoint để trình sếp.

---

## 2. Giải Pháp Toàn Diện (Solution Overview)

Tính năng **Executive Candidate Evaluation Dossier & 1-Click PDF Export** kết hợp hai giá trị chiến lược:

1. **Bộ Tổng Hợp Báo Cáo Đánh Giá Điều Hành (Executive Dossier Engine):**
   - 1-Click tổng hợp tự động mọi dữ liệu của ứng viên:
     - Điểm đồng thuận phỏng vấn trung bình (Consensus Score: 0 - 100).
     - Bảng chi tiết 5 tiêu chuẩn vàng (Kiến trúc, Code Defense, Debugging, Giao tiếp, Văn hóa) kèm nhận xét của từng interviewer.
     - Kết quả thử thách kỹ thuật Take-Home Challenge (link GitHub PR, ghi chú giải pháp, thời gian nộp).
     - Danh sách đồ án nổi bật đã được Giảng viên bảo chứng (Verified Badges & Demo URLs).
     - Ghi chú thẩm định nội bộ và mức lương kỳ vọng.
     - Khuyến nghị quyết định tuyển dụng rõ ràng (`STRONG_HIRE`, `HIRE`, `NEUTRAL`, `NO_HIRE`).
2. **Trình Xem & Xuất Báo Cáo A4 Chuẩn Doanh Nghiệp (1-Click Print & PDF):**
   - Giao diện Preview dạng tài liệu A4 trang trọng, phân mục rõ ràng, có tiêu đề bảo mật `CONFIDENTIAL HIRING DOSSIER`.
   - Sử dụng CSS in ấn `@media print` tối ưu: Tự động căn chỉnh ngắt trang sạch sẽ, giấu bỏ thanh điều hướng và nút bấm, cho phép in ngay hoặc lưu thành file PDF sắc nét qua hộp thoại in mặc định của trình duyệt.
   - Tương thích 100% với Chế độ sàng lọc ẩn danh (Blind Screening): Nếu đang bật Blind Mode, hồ sơ xuất ra sẽ tự động mã hóa tên thành `Ứng viên #DEV-XXXX` và che tên trường học để phục vụ đánh giá công bằng.
3. **Ngân Hàng 6 Mẫu JD Chuẩn Ngành Kèm Khung Lương Gợi Ý (Job Template Quick-Picker):**
   - Giúp NTD khi tạo JD trên [`JobManagement.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/recruiter/JobManagement.tsx) chỉ cần chọn 1 mẫu là tự điền toàn bộ từ khóa công nghệ, cấp bậc, khung lương thị trường và mô tả chuẩn.

---

## 3. Yêu Cầu Chức Năng (Functional Requirements)

- **FR-001 (Dossier Data Aggregation):** Hệ thống phải cung cấp hàm tổng hợp `executiveDossierService.buildExecutiveDossier(candidate, isBlind)` trả về đầy đủ các thông tin: ứng viên, điểm số, đồ án, bài test, scorecard và khuyến nghị.
- **FR-002 (Modal Preview):** Cung cấp modal xem trước bản báo cáo với khổ giấy A4, typography chuyên nghiệp, huy hiệu khuyến nghị nổi bật và bố cục rõ ràng.
- **FR-003 (Print & PDF Export):** Cung cấp nút `[ 🖨️ In / Tải PDF Báo Cáo ]` kích hoạt `window.print()` với style `@media print` được thiết lập chỉ in vùng nội dung báo cáo.
- **FR-004 (Quick Copy Summary):** Cung cấp nút `[ 📋 Sao Chép Tóm Tắt Gửi Email ]` copy định dạng tóm tắt Markdown/Text để dán nhanh vào Slack/Email gửi Trưởng phòng.
- **FR-005 (Kanban & Pipeline Integration):** Thêm nút bấm trực quan `[ 📑 Báo Cáo PDF ]` trên mỗi thẻ ứng viên có Scorecard hoặc bài test trong [`CandidatePipeline.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/recruiter/CandidatePipeline.tsx).
- **FR-006 (Job Studio Template Quick-Picker):** Cung cấp bộ chọn template JD nhanh trong modal tạo mới JD tại [`JobManagement.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/pages/recruiter/JobManagement.tsx).

---

## 4. Tiêu Chuẩn Nghiệm Thu & Kiểm Thử (Acceptance Criteria)

- **AC-01:** Mở trang Pipeline Tuyển Dụng, trên thẻ ứng viên đã có Scorecard, bấm `[ 📑 Báo Cáo PDF ]` ➔ Modal Báo cáo Điều hành A4 mở ra với đầy đủ thông tin điểm số, nhận xét và đồ án.
- **AC-02:** Bấm `[ 🖨️ In / Tải PDF Báo Cáo ]` ➔ Mở hộp thoại in trình duyệt, trang in sạch sẽ, đúng khổ A4, không có nút bấm điều hướng của website lọt vào.
- **AC-03:** Khi kích hoạt công tắc `Blind Screening`, mở Báo cáo PDF ➔ Tên ứng viên chuyển thành `Ứng viên #DEV-XXXX`, tên trường bị ẩn.
- **AC-04:** Tại trang Quản lý Tin tuyển dụng, bấm Thêm việc làm ➔ Chọn template "Frontend React Fresher" ➔ Toàn bộ tiêu đề, mô tả, từ khóa và mức lương 8-12 triệu VND tự động điền sẵn.
- **AC-05:** Toàn bộ test suites tự động đạt 100% pass, TypeScript check 0 lỗi, bundle Vite production thành công.
