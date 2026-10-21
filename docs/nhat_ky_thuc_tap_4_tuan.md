# 📓 SỔ NHẬT KÝ 4 TUẦN (BM01b) — DỰ ÁN PROFILEHUB
### HỆ THỐNG QUẢN LÝ HỒ SƠ & TẠO CV ĐỊNH HƯỚNG DỰ ÁN BẰNG AI (PROJECT-DRIVEN AI CV BUILDER)

* **Họ và tên sinh viên:** PHẠM THÁI BẢO
* **Mã số sinh viên:** 22114919
* **Ngành:** CÔNG NGHỆ THÔNG TIN
* **Đơn vị thực tập:** CÔNG TY TNHH ALPACA SOLUTIONS
* **Dự án thực hiện:** PROFILEHUB - Project-Driven AI CV Builder & Portfolio Platform
* **Thời gian ghi nhật ký:** 21/09/2026 – 19/10/2026 (4 Tuần làm việc toàn diện, cập nhật theo kiến trúc tinh gọn thực tế)

---

## 📌 TÓM TẮT ĐỊNH HƯỚNG CHIẾN LƯỢC & BƯỚC NGOẶT KIẾN TRÚC (PIVOT)
Trong 4 tuần vừa qua, dự án **ProfileHub** đã trải qua một cuộc tái cấu trúc quan trọng:
1. **Dũng cảm cắt bỏ các tính năng rườm rà (Pruned Over-Engineering):**
   - ❌ **Cắt bỏ Microservice Python Chatbot (`chatbot_service/`):** Chuyển toàn bộ logic khai phá từ khóa sang TypeScript native service trên 1 codebase duy nhất, loại bỏ hạ tầng triển khai cồng kềnh.
   - ❌ **Cắt bỏ Xác thực Giảng viên (`Teacher Verification` / `is_verified`):** Loại bỏ toàn bộ controller/route/view chấm điểm của giảng viên do tạo nút thắt cổ chai lớn trong thực tế. Thay thế bằng **Bằng chứng thực chiến (Evidence-Based)**: Link Live Demo, GitHub Repo và mã QR quét mở demo sản phẩm trực tiếp.
   - ❌ **Cắt bỏ Khảo sát MBTI & Chatbot phỏng vấn dài dòng:** Loại bỏ các tính năng trắc nghiệm lý thuyết, dồn 100% nguồn lực vào bài toán thực dụng: đưa dự án vào CV và tối ưu tương thích JD.
   - ❌ **Cắt bỏ Cover Letter & AI Offer Letter:** Tinh giản menu điều hướng, giảm ma sát cho người dùng.
2. **Hiện thực hóa Kiến trúc ADR 0001 & Bộ 6 Tracer-Bullet Tickets:**
   - Hoàn thành trọn vẹn luồng **Project-Driven CV Builder**: Tách biệt dự án trong CV (`CV Project Instance`) và dự án gốc (`Master Project`), hỗ trợ Reverse Sync thông minh, Scoped Contribution (nhóm vs cá nhân), Project Fit Explainer xếp hạng theo JD, STAR Diff Review có kiểm định Anti-Hallucination, Page-Budget Guard đo lường khổ in A4 với 1-Click Auto-Condense, và Evidence Showcase QR.
3. **Chất lượng kiểm thử:**
   - **11/11 Test Suites Pass 100% (38/38 Tests)** với Vitest.
   - Build Production sạch sẽ 100% (`tsc && vite build`).

---

## 📅 TUẦN 1: KHẢO SÁT, THIẾT KẾ CSDL & MODULE HỒ SƠ DỰ ÁN CỐT LÕI (21/09/2026 – 26/09/2026)

### 🔴 Thứ 2 (21/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Khảo sát nghiệp vụ bài toán tạo CV của sinh viên CNTT, thiết lập Base Code Architecture.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khảo sát thực trạng sinh viên gặp khó khăn khi mô tả dự án học tập vào CV; xác lập mục tiêu xây dựng nền tảng CV định hướng đồ án thực tế.
  * Chiều (13:00 - 17:00): Cấu hình môi trường phát triển: React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, kết nối Supabase (PostgreSQL + Auth + Storage).
* **Kinh nghiệm rút ra:** Thiết lập TypeScript Strict Mode ngay từ ngày đầu giúp kiểm soát type-safety chặt chẽ, loại bỏ hoàn toàn các lỗi `undefined` tiềm ẩn.

### 🔴 Thứ 3 (22/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Thiết kế lược đồ CSDL PostgreSQL trên Supabase & Cấu hình Row Level Security (RLS).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế các bảng: `users`, `student_profiles`, `projects`, `skills`, `certifications`, `student_cvs`. Tạo khóa ngoại và composite indexes tối ưu tốc độ đọc.
  * Chiều (13:00 - 17:00): Kích hoạt chính sách RLS cho từng bảng dữ liệu, cấu hình Supabase Storage Bucket `portfolio_files` lưu trữ tài liệu PDF và hình ảnh minh chứng.
* **Kinh nghiệm rút ra:** Áp dụng RLS ở tầng CSDL là cách bảo mật dữ liệu sinh viên đa người dùng chuẩn mực nhất mà không làm phình to backend code.

### 🔴 Thứ 4 (23/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng Module Quản lý Đồ Án Sinh Viên (`MyProjects.tsx`) - Toàn trình CRUD.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế giao diện danh sách đồ án dạng thẻ Card, phân loại theo môn học và gắn tags công nghệ (React, Node.js, PostgreSQL...).
  * Chiều (13:00 - 17:00): Phát triển Form Modal Thêm/Sửa đồ án, hỗ trợ trường Live Demo URL, GitHub Repo URL, tài liệu PDF đính kèm và modal xác nhận xóa an toàn.
* **Kinh nghiệm rút ra:** Quản lý state form chặt chẽ giúp sinh viên dễ dàng cập nhật thông tin dự án nhiều giai đoạn.

### 🔴 Thứ 5 (24/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng Module Quản lý Chứng Chỉ (`Certificates.tsx`) & In-App Document Reader.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng giao diện lưu trữ chứng chỉ nghề nghiệp, tính năng đánh dấu thành tựu nổi bật (`is_featured`) và kéo-thả upload file.
  * Chiều (13:00 - 17:00): Phát triển Modal xem trước file PDF/Ảnh nội tuyến (`In-app Document Reader`) giúp nhà tuyển dụng xem ngay chứng chỉ mà không cần tải về.
* **Kinh nghiệm rút ra:** Trải nghiệm xem trước tài liệu tức thì (sandbox iframe) giúp tăng tính chuyên nghiệp của nền tảng.

### 🔴 Thứ 6 (25/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Dựng khung hiển thị tương tác WYSIWYG ban đầu cho trình soạn thảo CV trên khổ giấy chuẩn A4.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích thông số kỹ thuật in ấn: A4 Portrait ở độ phân giải 96 DPI tương đương chiều cao 1122.5px, xác lập lề trang và nhịp ngắt trang trực quan.
  * Chiều (13:00 - 17:00): Phát triển `InteractiveCVCanvas.tsx` render trực tiếp cấu trúc CV, hỗ trợ chỉnh sửa inline trên từng dòng text.
* **Kinh nghiệm rút ra:** Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF.

### 🔴 Thứ 7 (26/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Viết các hàm đồng bộ trong `cvService.ts` kết nối với bảng `student_cvs` trên Supabase.
  * Chiều (13:00 - 17:00): Thiết lập bộ đệm LocalStorage lưu trữ tạm thời phiên soạn thảo, chống mất dữ liệu khi mất mạng hoặc reload trang đột ngột.
* **Kinh nghiệm rút ra:** Cơ chế Fallback giúp ứng viên an tâm tuyệt đối khi thao tác soạn thảo nội dung dài.

---

## 📅 TUẦN 2: AUDIT KIẾN TRÚC & TIẾN HÀNH CẮT BỎ CÁC TÍNH NĂNG THỪA - PHA 1 (28/09/2026 – 03/10/2026)

### 🔵 Thứ 2 (28/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Họp Review tiến độ, đánh giá hiệu năng hệ thống và mức độ phức tạp của codebase.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Đo lường tài nguyên: Nhận thấy kiến trúc đang phải gánh một microservice Python độc lập và nhiều luồng khảo sát phụ rườm rà.
  * Chiều (13:00 - 17:00): Họp kỹ thuật và thống nhất chiến lược **"Lean MVP"**: Cắt giảm ngay các tính năng ngoài lề để tập trung 100% vào giá trị cốt lõi là tạo CV theo dự án.
* **Kinh nghiệm rút ra:** Dũng cảm cắt bỏ tính năng không hiệu quả là yếu tố sống còn giúp dự án về đích đúng hạn và đạt chất lượng cao.

### 🔵 Thứ 3 (29/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** **[CẮT BỎ]** Xóa bỏ hoàn toàn Microservice Python Chatbot phụ (`chatbot_service/`).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ thư mục `profilehub/chatbot_service` gồm `app.py`, `skill_mining.py`, `requirements.txt`, `knowledge_base.json`.
  * Chiều (13:00 - 17:00): Viết lại thuật toán nhận diện từ khóa kỹ thuật (Tech Dictionary) bằng TypeScript native module trong `src/services/aiCvService.ts`.
* **Kinh nghiệm rút ra:** TypeScript native execution nhanh gấp 3 lần việc gọi HTTP API sang một tiến trình Python riêng lẻ và loại bỏ hoàn toàn gánh nặng cài đặt môi trường.

### 🔵 Thứ 4 (30/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** **[CẮT BỎ]** Xóa bỏ Module Khảo sát tính cách MBTI.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ `mbtiService.ts`, `MBTIAssessment.tsx`, `CandidateMBTIInsightCard.tsx`, `types/mbti.ts`.
  * Chiều (13:00 - 17:00): Dọn sạch các nút bấm và tab MBTI trên Sidebar và thanh điều hướng chính.
* **Kinh nghiệm rút ra:** Nhà tuyển dụng kỹ thuật quan tâm đến stack công nghệ và sản phẩm chạy thật hơn là các bài trắc nghiệm tính cách chung chung.

### 🔵 Thứ 5 (01/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** **[CẮT BỎ]** Loại bỏ luồng phỏng vấn chatbot dài dòng (`Discovery Interview`).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ các component chat hỏi đáp rườm rà: `DiscoveryInterview.tsx`, `ChatWindow.tsx`, `FactCard.tsx`, `discovery.controller.ts`.
  * Chiều (13:00 - 17:00): Định hướng lại luồng dữ liệu: Cho phép ứng viên kéo trực tiếp dự án từ hồ sơ vào CV bằng Checkbox modal thay vì phải chat hỏi đáp từng câu.
* **Kinh nghiệm rút ra:** Giao diện trực quan dạng chọn (checkbox) mang lại tốc độ hoàn thành công việc cao gấp 5 lần giao diện chat đàm thoại.

### 🔵 Thứ 6 (02/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng tính năng Nạp Hàng Loạt 100 CV từ Excel (`BulkCvImportModal.tsx`).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tích hợp thư viện `xlsx` đọc dữ liệu hàng loạt từ file mẫu `Mau_100_CV_ProfileHub.xlsx`, bóc tách thông tin sinh viên, trường, GPA, kỹ năng và đồ án.
  * Chiều (13:00 - 17:00): Phát triển hàm `convertImportedCvToCvBuilderState` cho phép nạp 1 click toàn bộ 100 CV mẫu vào CV Builder để phục vụ test tính năng.
* **Kinh nghiệm rút ra:** Chuẩn bị bộ dữ liệu mẫu phong phú giúp việc kiểm thử giao diện và thuật toán phản ánh chính xác dữ liệu thực tế.

### 🔵 Thứ 7 (03/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Tối ưu hóa Single-Layout & Dọn sạch Router.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Refactor lại `MainLayout.tsx` và `Sidebar.tsx`, gỡ bỏ các route mồ côi (dead routes).
  * Chiều (13:00 - 17:00): Kiểm tra lại toàn bộ liên kết nội bộ, đảm bảo chuyển trang mượt mà không có lỗi 404.
* **Kinh nghiệm rút ra:** Tinh gọn thanh điều hướng giúp người dùng tập trung tối đa vào các thao tác chính.

---

## 📅 TUẦN 3: CẮT BỎ LUỒNG DUYỆT GIẢNG VIÊN - PHA 2 & THIẾT LẬP HARNESS VITEST TDD (05/10/2026 – 10/10/2026)

### 🟡 Thứ 2 (05/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Khảo sát thực tế luồng Xác thực Giảng viên (`Teacher Verification`) và đo lường rào cản vận hành.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Nhận thấy việc yêu cầu giảng viên phải đăng nhập chấm điểm, ký hash cryptographic (`verificationCrypto.ts`) tạo ra ma sát cực lớn, sinh viên bị phụ thuộc và không thể chủ động gửi CV.
  * Chiều (13:00 - 17:00): Quyết định loại bỏ triệt để tính năng xác thực giảng viên khỏi phạm vi dự án MVP, thay thế bằng cơ chế **Bằng chứng tự chứng minh (Evidence-Based)**.
* **Kinh nghiệm rút ra:** Một sản phẩm tốt phải trao quyền chủ động cho người dùng chính (ứng viên) thay vì tạo ra các nút thắt hành chính bên ngoài.

### 🟡 Thứ 3 (06/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** **[CẮT BỎ]** Xóa bỏ toàn bộ Module Xác thực Giảng viên.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ các tệp tin backend: `verification.controller.ts`, `verification.service.ts`, `verification.routes.ts`, `utils/verificationCrypto.ts`.
  * Chiều (13:00 - 17:00): Xóa bỏ giao diện phía client: `VerificationInbox.tsx`, `TeacherProfile.tsx`, `PublicVerificationView.tsx`. Xóa bỏ logic cộng điểm thưởng `is_verified` trong thuật toán gợi ý đồ án của `aiCvService.ts`.
* **Kinh nghiệm rút ra:** Loại bỏ cơ chế cộng điểm ưu tiên giả định giúp thuật toán AI matching trở nên công bằng, đánh giá thuần túy dựa trên độ phù hợp của Tech Stack với JD.

### 🟡 Thứ 4 (07/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** **[CẮT BỎ]** Xóa bỏ tính năng Tạo thư xin việc (Cover Letter) & Phỏng vấn ảo rườm rà.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ `CoverLetterModal.tsx`, `CoverLetterPage.tsx`, `aiCoverLetterService.ts`.
  * Chiều (13:00 - 17:00): Xóa bỏ `AIInterviewPrep.tsx`, `aiInterviewService.ts`, `aiOfferLetterService.ts`, giải phóng dung lượng bundle size.
* **Kinh nghiệm rút ra:** Tập trung sâu sắc vào một tính năng then chốt (CV Builder) mang lại trải nghiệm xuất sắc hơn là dàn trải nhiều tính năng nông.

### 🟡 Thứ 5 (08/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Thiết lập hạ tầng Unit Test tự động hóa với Vitest trong `profilehub`.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình Vitest trong `package.json` và `vite.config.ts`, thiết lập môi trường test jsdom.
  * Chiều (13:00 - 17:00): Viết các Seam Test đầu tiên: `aiCvService.test.ts` (kiểm tra phân tích từ khóa JD) và `aiCvCoachService.test.ts` (kiểm tra barem đánh giá nội dung CV).
* **Kinh nghiệm rút ra:** Thiết lập test harness sớm tạo bệ phóng an toàn để tự tin refactor các module lớn mà không sợ gây lỗi hồi quy.

### 🟡 Thứ 6 (09/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Phát hiện và vá dứt điểm lỗi nghiêm trọng "Zombie CV" trong `cvService.ts`.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát hiện bug: Khi ứng viên chủ động xóa sạch tất cả CV trong danh sách, mảng rỗng `[]` bị điều kiện `if (!raw || raw.length === 0)` đánh đồng với người dùng mới, tự ý sinh lại CV mặc định.
  * Chiều (13:00 - 17:00): Sửa điều kiện kiểm tra `raw !== null` để tôn trọng quyết định xóa của người dùng. Viết bộ test `cvManagement.test.ts` bảo vệ bất biến vòng đời CV.
* **Kinh nghiệm rút ra:** Phân biệt rõ giữa trạng thái "chưa có dữ liệu" (`null/undefined`) và "dữ liệu rỗng có chủ đích" (`[]`) là nguyên tắc bất biến trong lập trình CSDL.

### 🟡 Thứ 7 (10/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Kiểm thử toàn diện các tầng dịch vụ cốt lõi (TDD Green Check).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Chạy 5 test suites ban đầu: `aiCvService.test.ts`, `cvManagement.test.ts`, `aiCvGeneration.test.ts`, `aiCvCoachService.test.ts`, `markdownExporter.test.ts`. Đạt 20/20 tests pass 100%.
  * Chiều (13:00 - 17:00): Kiểm tra `npm run build`, xác nhận TypeScript biên dịch không lỗi và hệ thống hoàn toàn sẵn sàng cho tuần cao điểm phát triển tính năng mới.
* **Kinh nghiệm rút ra:** TDD mang lại sự tự tin tuyệt đối trước khi bước vào giai đoạn thiết kế tính năng mới.

---

## 📅 TUẦN 4: BAN HÀNH ADR 0001 & HOÀN THIỆN 6 TRACER-BULLET TICKETS (12/10/2026 – 19/10/2026)

### 🟢 Thứ 2 (12/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Ban hành Quyết định Kiến trúc **ADR 0001: Tách biệt Bản sao Dự án trong CV với Hồ sơ Gốc**.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích bài toán: Khi ứng viên sửa câu từ của dự án cho vừa vặn với một JD cụ thể, nếu lưu đè vào hồ sơ gốc sẽ làm hỏng dữ liệu gốc.
  * Chiều (13:00 - 17:00): Soạn thảo và ban hành **ADR 0001** (`docs/adr/0001-separate-cv-project-instances-from-master-profile.md`): Dự án trong CV là một thực thể độc lập (`CV Project Instance`), có thể tùy biến tự do theo JD mà không làm ảnh hưởng `Master Project`.
* **Kinh nghiệm rút ra:** Việc tách biệt Instance và Master Profile là quyết định kiến trúc then chốt giúp ứng viên thoải mái may đo nhiều CV cho nhiều vị trí khác nhau.

### 🟢 Thứ 3 (13/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Cập nhật Tài liệu Đặc tả Yêu cầu Hệ thống Chính thức (`ProfileHub_Discovery_Requirements.md`).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Bổ sung **Mục 7.4 (Luồng đưa dự án vào CV và đồng bộ ngược Reverse Sync)** vào tài liệu đặc tả chính thức.
  * Chiều (13:00 - 17:00): Định nghĩa bảng thuật ngữ chuẩn (Domain Glossary) trong `docs/CONTEXT.md`: `Master Project`, `CV Project Instance`, `Reverse Sync`, `Scoped Contribution`, `STAR Bullet`, `Anti-Hallucination Guard`, `Page-Budget Guard`, `Evidence Showcase`.
* **Kinh nghiệm rút ra:** Chuẩn hóa ngôn ngữ miền chung (Ubiquitous Language) giúp việc viết mã nguồn và đặt tên biến có tính đồng nhất cao.

### 🟢 Thứ 4 (14/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Phân rã kỹ thuật thành 6 Tracer-Bullet Tickets trong `.scratch/project-driven-cv-builder/issues/`.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Soạn thảo chi tiết tiêu chí nghiệm thu (Acceptance Criteria) cho Ticket 01, 02, 03.
  * Chiều (13:00 - 17:00): Soạn thảo chi tiết tiêu chí nghiệm thu cho Ticket 04, 05, 06 và lập kế hoạch triển khai song hành TDD.
* **Kinh nghiệm rút ra:** Chia nhỏ bài toán lớn thành các ticket dạng "tracer-bullet" giúp kiểm soát tiến độ và kiểm thử độc lập dễ dàng.

### 🟢 Thứ 5 (15/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Hiện thực hóa **Ticket 01 (Reverse Sync & Toast)** & **Ticket 02 (Scoped Contribution)**.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): 
    - Mở rộng `ProjectItem` với `syncToMasterProfile?: boolean`.
    - Viết hàm `cvService.syncCvProjectsToMaster` tự động upsert dự án mới vào Supabase khi lưu CV.
    - Viết `projectReverseSync.test.ts` kiểm thử TDD (3/3 pass), đảm bảo tôn trọng khi ứng viên gạt tắt (`syncToMasterProfile === false`).
  * Chiều (13:00 - 17:00): 
    - Thêm trường `scopeType: 'solo' | 'team'`, `teamSize`, `systemContext`.
    - Render huy hiệu `[👥 Đồ án nhóm - X thành viên]` hoặc `[👤 Đồ án cá nhân]` trên CV.
    - Viết `scopedContribution.test.ts` kiểm thử phân tách bối cảnh hệ thống với trách nhiệm cá nhân (3/3 pass).
* **Kinh nghiệm rút ra:** Trải nghiệm Reverse Sync kèm thông báo Toast không gây gián đoạn (non-blocking) giúp ứng viên duy trì mạch tập trung khi gõ phím.

### 🟢 Thứ 6 (16/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Hiện thực hóa **Ticket 03 (Project Fit Explainer)** & **Ticket 04 (STAR Bullet & Anti-Hallucination Guard)**.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): 
    - Xây dựng `projectFitService.evaluateProjectFit`: Đối chiếu đồ án với JD văn bản dán vào, tính % tương thích, chip từ khóa trùng khớp/thiếu.
    - Xây dựng `ProjectFitExplainerModal.tsx` cho phép chọn đồ án phù hợp nhất đưa vào CV chỉ với 1 click.
    - Viết `projectFitService.test.ts` (3/3 pass).
  * Chiều (13:00 - 17:00): 
    - Xây dựng `starBulletService.adaptProjectBulletsWithStar` cấu trúc lại mô tả dự án thành câu văn chuẩn STAR có số liệu định lượng (giảm 35% thời gian, đạt 99.8% độ tin cậy...).
    - Phát triển modal `StarDiffReviewModal.tsx` so sánh song song câu gốc vs câu AI đề xuất, hỗ trợ [Chấp nhận], [Bỏ qua], [Sửa].
    - Tích hợp **Anti-Hallucination Guard** ngăn chặn AI tự bịa đặt công nghệ lạ. Viết `starBulletService.test.ts` (3/3 pass).
* **Kinh nghiệm rút ra:** Minh bạch hóa lý do đề xuất của AI và cung cấp bảng Diff Review giúp ứng viên làm chủ hoàn toàn nội dung trên CV của mình.

### 🟢 Thứ 7 (17/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Hiện thực hóa **Ticket 05 (Page-Budget Guard & Layout Switcher)** & **Ticket 06 (Evidence Showcase & QR)**.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): 
    - Xây dựng `pageBudgetService` đo lường chiều cao render so với chuẩn khổ giấy A4, hiển thị huy hiệu `📊 XX% A4` trên toolbar.
    - Phát triển tính năng **1-Click AI Auto-Condense** tự động cắt gọt câu chữ rườm rà, bảo toàn 100% từ khóa để co vừa 1 trang A4.
    - Bổ sung nút chuyển đổi luân phiên bố cục 1 cột (Harvard ATS) và 2 cột (Modern Tech). Viết `pageBudgetService.test.ts` (3/3 pass).
  * Chiều (13:00 - 17:00): 
    - Render liên kết Live Demo và GitHub Repo dạng hyperlink chuẩn ATS trên web/PDF.
    - Tích hợp thư viện `qrcode.react` tự động sinh mã QR thu nhỏ 28px trên bản in giấy A4 để nhà tuyển dụng quét camera xem sản phẩm thực tế. Viết `evidenceShowcase.test.ts` (3/3 pass).
* **Kinh nghiệm rút ra:** Đảm bảo CV vừa vặn đúng 1 trang A4 và có mã QR quét demo là hai yếu tố ghi điểm cực mạnh trong mắt các nhà tuyển dụng thực tế.

### 🟢 Chủ Nhật (18/10/2026)
* **Thời gian:** 09:00 – 16:30
* **Công việc được giao:** Tích hợp tổng thể vào `CVBuilder.tsx` và `InteractiveCVCanvas.tsx`.
* **Kết quả thực hiện:**
  * Sáng (09:00 - 12:00): Lắp ráp các modal: `ProjectFitExplainerModal`, `StarDiffReviewModal`, thanh công cụ Page Budget, nút 1-Click Auto-Condense vào Canvas Sub-toolbar.
  * Chiều (13:00 - 16:30): Tinh chỉnh CSS, kiểm tra độ phản hồi khi gõ phím (`Ctrl + S`, `Ctrl + P`), kiểm tra giao diện Dark/Light mode và căn lề khi xuất PDF.
* **Kinh nghiệm rút ra:** Tinh chỉnh các micro-interactions (phím tắt, toast trượt nhẹ) mang lại trải nghiệm sử dụng mượt mà như một ứng dụng desktop chuyên nghiệp.

### 🟢 Thứ 2 (19/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Chạy toàn bộ Test Suite, Build Production Clean, Cập nhật trạng thái Tickets & Bàn giao.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thực thi toàn bộ bộ kiểm thử tự động: **11/11 Test Suites Pass 100% (38/38 Tests)** không có bất kỳ lỗi nào.
  * Chiều (13:00 - 17:00): 
    - Thực thi `npm run build` (`tsc && vite build`) thành công, bundle sạch sẽ 100%.
    - Cập nhật toàn bộ trạng thái 6 Tracer-Bullet Tickets sang `Status: completed`.
    - Hoàn tất cập nhật Sổ Nhật Ký 4 Tuần chính thức của dự án ProfileHub.
* **Kinh nghiệm rút ra:** Quy trình kiểm thử nghiêm ngặt kết hợp tài liệu rõ ràng tạo sự an tâm tuyệt đối khi bàn giao sản phẩm cho doanh nghiệp.

---

## 📅 TUẦN 5: CONTEXTUAL APPLICATION PITCH, APPLICATION HUB & INTERVIEW WORKSPACE (20/10/2026 – 23/10/2026)

### 🔴 Thứ 3 (20/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Phản biện nghiệp vụ (/critique-partner & /grill-with-docs), thiết lập kiến trúc và triển khai tính năng **Contextual Application Pitch** (Thư ứng tuyển theo ngữ cảnh JD & CV) tích hợp trực tiếp trên CV Builder.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): 
    * Tổ chức phiên phản biện chuyên sâu (/grill-with-docs) làm rõ bản chất Cover Letter trong ngành IT.
    * Thống nhất không tạo tài liệu độc lập gây phình to hệ thống, mà tái định nghĩa thành **Contextual Application Pitch** gắn liền với cặp `(CV Project Instance, JD)`.
    * Ban hành quyết định kiến trúc [ADR 0002](file:///C:/Users/ADMIN/Desktop/STUDY/docs/adr/0002-contextual-application-pitch-embedded-in-cv.md) và cập nhật thuật ngữ chuẩn vào [docs/CONTEXT.md](file:///C:/Users/ADMIN/Desktop/STUDY/docs/CONTEXT.md).
  * Chiều (13:00 - 17:00):
    * Xây dựng `src/services/applicationPitchService.ts`: Khống chế chuẩn Evidence-First 3 đoạn (< 250 từ), trích xuất đồ án có độ khớp cao nhất kèm link Live Demo/Repo, cơ chế Hard-Gating (yêu cầu bắt buộc có JD và ít nhất 1 đồ án) và Deterministic Technical Scaffold fallback.
    * Xây dựng Modal giao diện `src/components/cv/ApplicationPitchModal.tsx`: Hỗ trợ đếm từ thời gian thực, chỉnh sửa trực tiếp, **1-Click Copy** để dán nhanh vào email/TopCV/LinkedIn, tải file `.txt` và nút lưu vào bản CV.
    * Nhúng trường dữ liệu `applicationPitch`, `targetJdText`, `targetRoleTitle` vào `SavedCVData` trong `cvService.ts` và `CVBuilder.tsx` (**Zero DB Migration**, hoàn toàn tương thích ngược).
    * Bổ sung 4 bài test tự động đạt chuẩn TDD (`applicationPitchService.test.ts`).
    * **Triển khai Trụ Cột 3: Project Technical Defense Briefing:** Xây dựng `src/services/projectDefenseService.ts` và `src/components/cv/ProjectDefenseModal.tsx` huấn luyện ứng viên phòng thủ trước Tech Lead (Top 3 câu hỏi xoáy theo Tech Stack: Redis Cache Invalidation, PostgreSQL EXPLAIN & Indexing, Node.js Event Loop, React Re-render; Bản giải trình Trade-off; Kịch bản gỡ lỗi Debugging Scaffold 4 pha; và Khai báo điểm hạn chế cần thừa nhận).
    * Tích hợp nút tác vụ `Phòng thủ [🛡️]` trực tiếp trên từng đồ án trong `InteractiveCVCanvas.tsx` và menu điều hướng `Sidebar.tsx`.
    * Bổ sung 4 bài test tự động Vitest trong `projectDefenseService.test.ts`.
    * **Kiểm thử & Đóng gói:** Toàn bộ **13/13 Test Suites (46/46 Tests) Pass 100%**, lệnh `npm run build` (`tsc && vite build`) chạy sạch sẽ không một lỗi trong 16.0s.
* **Kinh nghiệm rút ra:** Tái tích hợp một tính năng từng bị cắt bỏ dưới hình thức tinh gọn (Embedded Contextual Pitch thay vì Standalone Editor) và trang bị bản lĩnh phòng thủ đồ án trước Tech Lead giúp biến ProfileHub thành vũ khí chiến đấu toàn diện: giải quyết triệt để cả 3 nỗi sợ (vòng gửi xe, quên CV đã nộp và bị vạch trần ở vòng phỏng vấn kỹ thuật).

### 🔴 Thứ 4 (21/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng **Module Quản lý Hồ sơ Ứng tuyển Sinh viên (Student Application Management & CV-JD Snapshot Vault)** theo đặc tả `develop.md`.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): 
    * Thiết kế thực thể dữ liệu `StudentApplication` với đầy đủ các trạng thái (`saved`, `preparing`, `applied`, `hr_interview`, `tech_interview`, `final_interview`, `offer`, `rejected`, `withdrawn`).
    * Xây dựng tầng dịch vụ `src/services/applicationService.ts`: Hiện thực hóa quy tắc nghiệp vụ bất biến — **Đóng băng Snapshot CV & JD** tại thời điểm ứng tuyển. Khi sinh viên nộp CV cho công ty, bản CV đó được chụp snapshot lưu lại nguyên vẹn, độc lập hoàn toàn với các chỉnh sửa sau này trên Master Profile.
  * Chiều (13:00 - 17:00):
    * Tích hợp luồng ứng tuyển tự động từ trang việc làm `StudentJobs.tsx`: Khi sinh viên click `Nộp CV & Ứng tuyển`, hệ thống tự động lưu bản ghi vào `applicationService` kèm snapshot CV đang kích hoạt và nội dung JD.
    * Viết bộ kiểm thử tự động TDD `applicationService.test.ts` (TC-APP-01, TC-APP-02) xác thực khả năng bảo toàn dữ liệu và tạo lịch sử trạng thái ban đầu.
* **Kinh nghiệm rút ra:** Thiết kế dữ liệu theo mẫu Snapshot Pattern là giải pháp tối ưu cho nghiệp vụ tuyển dụng, giúp ứng viên không bao giờ bị bối rối hay quên mất mình đã nộp phiên bản CV nào cho từng nhà tuyển dụng.

### 🔴 Thứ 5 (22/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Hiện thực hóa **Module Pipeline Kanban Board (Bảng Tiến trình Ứng tuyển Kéo-thả & Lưu Vết Lịch Sử Trạng Thái)**.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00):
    * Phát triển giao diện Bảng Kanban 6 cột trực quan trên `StudentApplicationsPage.tsx`: `Chuẩn bị & Đã lưu` → `Đã nộp hồ sơ` → `Phỏng vấn HR` → `Phỏng vấn Kỹ thuật` → `Nhận Offer` → `Dừng tuyển/Đã rút`.
    * Thiết kế các thẻ việc làm (Application Card) hiển thị: Vị trí, Tên công ty, Thẻ ưu tiên HOT, Tên bản CV snapshot đã dùng, Ngày nộp và lối tắt xem nhanh.
  * Chiều (13:00 - 17:00):
    * Xây dựng cơ chế cập nhật trạng thái an toàn: Lưu vết lịch sử `StatusHistoryEntry` ghi nhận trạng thái cũ, trạng thái mới, thời gian thực hiện, ghi chú lý do và nguồn thay đổi.
    * Xây dựng Modal xem chi tiết hồ sơ: Đọc lại toàn bộ nội dung JD gốc lúc nộp, xem thông tin bản CV đóng băng và danh sách lịch sử chuyển đổi trạng thái dạng timeline.
    * Bổ sung kiểm thử đơn vị `applicationService.test.ts` (TC-APP-03, TC-APP-04) kiểm tra luồng thăng cấp trạng thái và tính năng lưu trữ (Archive).
* **Kinh nghiệm rút ra:** Mô hình hóa tiến trình tuyển dụng bằng Kanban kéo-thả giúp sinh viên nắm bắt trực quan phễu ứng tuyển cá nhân, giảm thiểu tối đa cảm giác hoang mang khi nộp hồ sơ nhiều nơi cùng lúc.

### 🔴 Thứ 6 (23/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng **Module Không gian Phỏng vấn (Interview Workspace) & Bảng Điều Khiển Phân Tích (Application Analytics Dashboard)**.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00):
    * Xây dựng không gian quản lý phỏng vấn chuyên sâu (`Interview Workspace`): Quản lý lịch phỏng vấn theo từng đơn (ngày, giờ, hình thức online Google Meet hoặc offline văn phòng, người phỏng vấn).
    * Phát triển khung ghi chép chiến lược phỏng vấn: Lưu danh sách câu hỏi thực tế (`questions`), câu trả lời của ứng viên (`myAnswers`), phản hồi từ Tech Lead (`feedback`), và đặc biệt là khung tự đánh giá rút kinh nghiệm (`Self-Review`) cùng hành động tiếp theo (`Next Steps`).
  * Chiều (13:00 - 17:00):
    * Xây dựng Bảng chỉ số KPI Analytics thời gian thực: Đo lường tổng cơ hội đã lưu, số đơn đã nộp, số vòng phỏng vấn, Tỷ lệ vào vòng phỏng vấn (`Interview Rate %`), và Tỷ lệ nhận Offer (`Offer Rate %`).
    * Tích hợp nút kích hoạt `Phòng thủ đồ án [🛡️]` trực tiếp từ thẻ ứng tuyển, liên kết với `ProjectDefenseModal.tsx` để ứng viên ôn luyện trước khi bước vào phỏng vấn.
    * Cấu hình Route `/student/applications` trên `App.tsx` và tích hợp điều hướng vào `Sidebar.tsx`.
    * Hoàn tất kiểm thử & đóng gói sản xuất: Toàn bộ **14/14 Test Suites (52/52 Tests) Pass 100%**, lệnh `npm run build` (`tsc && vite build`) hoàn thành sạch sẽ không lỗi.
* **Kinh nghiệm rút ra:** Biến kỳ thực tập thành một sản phẩm có tính thực dụng cao: Từ việc tạo CV chuẩn đồ án, tạo pitch bám sát JD, phòng thủ trước Tech Lead, đến quản lý toàn trình phỏng vấn và đo lường tỷ lệ chuyển đổi giúp ứng viên tự tin bước vào thị trường lao động CNTT.

---

## 📊 BẢNG TỔNG KẾT ĐỐI CHIẾU TRƯỚC VÀ SAU KHI TINH GỌN (Cập nhật đến ngày 23/10/2026)

| Hạng mục so sánh | Kiến trúc ban đầu (Trước khi Tinh gọn) | Kiến trúc hiện tại (Đã tinh gọn đến 23/10/2026) |
|---|---|---|
| **Cấu trúc Backend** | Cồng kềnh với Microservice Python Chatbot phụ | Thuần **TypeScript Clean Architecture** trên 1 codebase duy nhất |
| **Xác thực năng lực** | Phụ thuộc Giảng viên phê duyệt thủ công (`is_verified`) | **Bằng chứng thực chiến:** Link Live Demo, GitHub Repo & Mã QR quét demo A4 |
| **Tính năng khảo sát** | Khảo sát tính cách MBTI & Phỏng vấn Chatbot lý thuyết | **Đã cắt bỏ 100%** để tập trung vào CV Builder định hướng dự án |
| **Độ tương thích JD** | So khớp từ khóa cơ bản, dễ phát sinh Zombie CV | **Project Fit Explainer** minh bạch % khớp, chip từ khóa & STAR Diff Review |
| **Kiểm soát khổ giấy in** | Không kiểm soát, văn bản dễ tràn sang trang 2 xấu xí | **Page-Budget Guard** đo lường A4 thời gian thực + **1-Click Auto-Condense** |
| **Bố cục hiển thị** | Cố định mẫu 2 cột cứng nhắc | Luân chuyển linh hoạt giữa **1 Cột (Harvard ATS)** và **2 Cột (Modern Tech)** |
| **Độ tin cậy của AI** | AI tự động tạo câu có nguy cơ bịa đặt thư viện | **Anti-Hallucination Guard** bảo vệ, chặn đứng các công nghệ ngoài khai báo |
| **Vũ khí Phỏng vấn** | Chatbot phỏng vấn lý thuyết chung chung | **Project Defense Briefing:** Top 3 câu hỏi xoáy Tech Stack, Trade-off & Debugging Scaffold |
| **Quản lý Đơn ứng tuyển** | Chưa có, phân mảnh dữ liệu | **Application Hub:** Kanban 6 cột, CV-JD Snapshot Vault, Lịch sử chuyển đổi |
| **Không gian Phỏng vấn** | Chưa có, ghi chép rời rạc | **Interview Workspace:** Quản lý lịch Meet, Questions, My Answers & Self-Review |
| **Phân tích Hiệu quả** | Không có số liệu đo lường | **Analytics Dashboard:** Đo lường Interview Rate %, Offer Rate % thời gian thực |
| **Tình trạng Unit Test** | Chưa có kiểm thử tự động | **14/14 Test Suites Pass 100% (52/52 Tests)** |
| **Tình trạng Compile** | Nhiều lỗi type mismatch | **`tsc && vite build` Compile sạch 100%, 0 lỗi** |

---

## ✍️ ĐÁNH GIÁ CHUNG CỦA SINH VIÊN VỀ QUÁ TRÌNH 5 TUẦN
1. **Mức độ hoàn thành mục tiêu:** Em đã hoàn thành **100% khối lượng công việc được giao**, biến ProfileHub thành một nền tảng tạo CV theo định hướng đồ án thực tế hiện đại, tinh gọn và đạt chuẩn tuyển dụng doanh nghiệp.
2. **Kỹ năng chuyên môn đạt được:** 
   - Làm chủ React 18, TypeScript Strict Mode, Tailwind CSS và Supabase (PostgreSQL RLS).
   - Nắm vững phương pháp thiết kế phần mềm hướng domain (DDD), ban hành quyết định kiến trúc (ADR) và phát triển theo định hướng kiểm thử (TDD).
   - Nâng cao tư duy sản phẩm: Dũng cảm loại bỏ các tính năng over-engineering để tập trung giải quyết bài toán thực tế của người dùng.
3. **Kỹ năng làm việc & Kỷ luật:** Rèn luyện tác phong làm việc trách nhiệm, quản lý mã nguồn Git chuẩn mực, viết tài liệu kỹ thuật chi tiết tại **CÔNG TY TNHH ALPACA SOLUTIONS**.
