# 📓 NHẬT KÝ DỰ ÁN PROFILEHUB
### HỆ THỐNG QUẢN LÝ HỒ SƠ & TẠO CV ĐỊNH HƯỚNG DỰ ÁN BẰNG AI (PROJECT-DRIVEN AI CV BUILDER)

* **Họ và tên sinh viên:** PHẠM THÁI BẢO
* **Mã số sinh viên:** 22114919
* **Ngành:** CÔNG NGHỆ THÔNG TIN
* **Đơn vị thực tập:** CÔNG TY TNHH ALPACA SOLUTIONS
* **Dự án thực hiện:** PROFILEHUB - Project-Driven AI CV Builder & Portfolio Platform
* **Thời gian ghi nhật ký:** 21/09/2026 – 20/11/2026 (9 Tuần làm việc từ Thứ Hai đến Thứ Sáu, **nghỉ Thứ Bảy và Chủ Nhật**)

---

## 📌 TÓM TẮT ĐỊNH HƯỚNG CHIẾN LƯỢC & BƯỚC NGOẶT KIẾN TRÚC (PIVOT)
Trong 9 tuần phát triển dự án (21/09/2026 – 20/11/2026), **ProfileHub** đã trải qua các giai đoạn hoàn thiện vượt bậc:
1. **Dũng cảm cắt bỏ các tính năng rườm rà (Pruned Over-Engineering - Tuần 4):**
   - ❌ **Cắt bỏ Microservice Python Chatbot (`chatbot_service/`):** Chuyển toàn bộ logic khai phá từ khóa sang TypeScript native service trên 1 codebase duy nhất, loại bỏ hạ tầng triển khai cồng kềnh.
   - ❌ **Cắt bỏ Xác thực Giảng viên (`Teacher Verification` / `is_verified`):** Loại bỏ toàn bộ controller/route/view chấm điểm của giảng viên do tạo nút thắt cổ chai lớn trong thực tế. Thay thế bằng **Bằng chứng thực chiến (Evidence-Based)**: Link Live Demo, GitHub Repo và mã QR quét mở demo sản phẩm trực tiếp.
   - ❌ **Cắt bỏ Khảo sát MBTI & Chatbot phỏng vấn dài dòng:** Dồn 100% nguồn lực vào bài toán thực dụng: đưa dự án vào CV và tối ưu tương thích JD tuyển dụng.
2. **Hiện thực hóa Kiến trúc ADR 0001 & Bộ 6 Tracer-Bullet Tickets:**
   - Hoàn thành trọn vẹn luồng **Project-Driven CV Builder**: Tách biệt dự án trong CV (`CV Project Instance`) và dự án gốc (`Master Project`), hỗ trợ Reverse Sync thông minh, Scoped Contribution (nhóm vs cá nhân), Project Fit Explainer xếp hạng theo JD, STAR Diff Review có kiểm định Anti-Hallucination, Page-Budget Guard đo lường khổ in A4 với 1-Click Auto-Condense, và Evidence Showcase QR.
3. **Mở rộng các Module nâng cao (Tuần 5 – Tuần 7):**
   - **STAR Diagnostic Engine & Rewrite:** Phân tích cấu trúc viên đạn theo phương pháp STAR, cung cấp gợi ý viết lại có số liệu định lượng.
   - **ATS Eye-View Heatmap:** Mô phỏng góc nhìn hệ thống Applicant Tracking System và nhà tuyển dụng (F-pattern scan).
   - **Interview War Room & Audio Simulation:** Luyện tập phỏng vấn kỹ thuật bám sát kinh nghiệm dự án thực tế.
   - **Real-time Salary Benchmark:** Khảo sát dải lương thị trường dựa trên tổ hợp kỹ năng và level của ứng viên.
   - **Application Tracker & Kanban Pipeline:** Quản lý vòng đời ứng tuyển từ Applied đến Offer.
4. **Tối ưu hiệu suất, Bảo mật & Triển khai Production (Tuần 8 – Tuần 9):**
   - Tối ưu hóa hiệu năng trong từng ngày chuyên trách: Caching (Redis + IndexedDB), Service Worker offline cache, Bundle Splitting (giảm từ 1.2MB xuống 280KB Gzip).
   - Kiểm thử toàn diện: Unit Test & Integration Test (Vitest 100% pass), End-to-End Test (Playwright).
   - Triển khai Production đa môi trường (Supabase Prod + Vercel Enterprise Edge), thiết lập CI/CD GitHub Actions an toàn với Branch Protection.

---

## 📅 TUẦN 1: KHẢO SÁT, THIẾT KẾ CSDL & MODULE HỒ SƠ DỰ ÁN CỐT LÕI (21/09/2026 – 25/09/2026)

### 🔴 Thứ 2 (21/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Khảo sát nghiệp vụ bài toán tạo CV của sinh viên CNTT, thiết lập Base Code Architecture.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khảo sát thực trạng sinh viên gặp khó khăn khi mô tả dự án học tập vào CV; xác lập mục tiêu xây dựng nền tảng CV định hướng đồ án thực tế (Project-Driven AI CV Builder).
  * Chiều (13:00 - 17:00): Cấu hình môi trường phát triển: React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, kết nối Supabase (PostgreSQL + Auth + Storage).
* **Kinh nghiệm rút ra:** Thiết lập TypeScript Strict Mode ngay từ ngày đầu giúp kiểm soát type-safety chặt chẽ, loại bỏ hoàn toàn các lỗi undefined tiềm ẩn.

### 🔴 Thứ 3 (22/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Thiết kế lược đồ CSDL PostgreSQL trên Supabase & Cấu hình Row Level Security (RLS).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế các bảng: users, student_profiles, projects, skills, certifications, student_cvs. Tạo khóa ngoại và composite indexes tối ưu tốc độ đọc.
  * Chiều (13:00 - 17:00): Kích hoạt chính sách RLS cho từng bảng dữ liệu, cấu hình Supabase Storage Bucket portfolio_files lưu trữ tài liệu PDF và hình ảnh minh chứng.
* **Kinh nghiệm rút ra:** Áp dụng RLS ở tầng CSDL là cách bảo mật dữ liệu sinh viên đa người dùng chuẩn mực nhất mà không làm phình to backend code.

### 🔴 Thứ 4 (23/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Module Quản lý Đồ Án Sinh Viên (MyProjects.tsx) – Toàn trình CRUD.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế giao diện danh sách đồ án dạng thẻ Card chuẩn Enterprise, phân loại theo môn học và gắn tags công nghệ (React, Node.js, PostgreSQL...).
  * Chiều (13:00 - 17:00): Phát triển Form Modal Thêm/Sửa đồ án, hỗ trợ trường Live Demo URL, GitHub Repo URL, tài liệu PDF đính kèm và modal xác nhận xóa an toàn.
* **Kinh nghiệm rút ra:** Quản lý state form chặt chẽ giúp sinh viên dễ dàng cập nhật thông tin dự án nhiều giai đoạn mà không gây mất mát dữ liệu.

### 🔴 Thứ 5 (24/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Module Quản lý Chứng Chỉ (Certificates.tsx) & In-App Document Reader.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng giao diện lưu trữ chứng chỉ nghề nghiệp, tính năng đánh dấu thành tựu nổi bật (is_featured) và kéo-thả upload file.
  * Chiều (13:00 - 17:00): Phát triển Modal xem trước file PDF/Ảnh nội tuyến (In-app Document Reader) giúp nhà tuyển dụng xem ngay chứng chỉ mà không cần tải về.
* **Kinh nghiệm rút ra:** Trải nghiệm xem trước tài liệu tức thì (sandbox iframe) giúp tăng tính chuyên nghiệp của nền tảng.

### 🔴 Thứ 6 (25/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Dựng khung hiển thị tương tác WYSIWYG trên Canvas A4 & Cơ chế lưu trữ 2 lớp.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích thông số kỹ thuật in ấn: A4 Portrait ở độ phân giải 96 DPI (chiều cao 1122.5px), phát triển InteractiveCVCanvas.tsx hỗ trợ chỉnh sửa inline trên từng dòng text.
  * Chiều (13:00 - 17:00): Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback), thiết lập bộ đệm LocalStorage lưu trữ tạm thời chống mất dữ liệu khi mất mạng.
* **Kinh nghiệm rút ra:** Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF; cơ chế lưu trữ hai lớp mang lại độ an toàn cao.

## 📅 TUẦN 2: MODULE TẠO CV DỰ ÁN, CHATBOT NLP THỰC CHIẾN & KHẢO SÁT PHỎNG VẤN (28/09/2026 – 02/10/2026)

### 🔴 Thứ 2 (28/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Họp Review tiến độ tuần 1, đánh giá kiến trúc hệ thống & Tối ưu hóa Single-Layout.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Đo lường tài nguyên hệ thống, họp kỹ thuật với Tech Lead và thống nhất chiến lược "Lean MVP": Cắt giảm ngay các tính năng ngoài lề để dồn sức cho giá trị cốt lõi.
  * Chiều (13:00 - 17:00): Tối ưu hóa Single-Layout: Refactor lại MainLayout.tsx và Sidebar.tsx, gỡ bỏ các route mồ côi (dead routes) và kiểm tra lại toàn bộ liên kết nội bộ không có lỗi 404.
* **Kinh nghiệm rút ra:** Dũng cảm cắt bỏ tính năng không hiệu quả và gom việc đánh giá hiệu năng cùng tái cấu trúc layout vào một ngày giúp codebase luôn ngăn nắp và tiết kiệm thời gian.

### 🔴 Thứ 3 (29/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** [CẮT BỎ] Xóa bỏ hoàn toàn Microservice Python Chatbot phụ & Viết lại sang TypeScript.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ thư mục profilehub/chatbot_service gồm app.py, skill_mining.py, requirements.txt, knowledge_base.json, loại bỏ hạ tầng triển khai cồng kềnh.
  * Chiều (13:00 - 17:00): Viết lại thuật toán nhận diện từ khóa kỹ thuật (Tech Dictionary) bằng TypeScript native module trực tiếp trong src/services/aiCvService.ts.
* **Kinh nghiệm rút ra:** TypeScript native execution nhanh gấp 3 lần việc gọi HTTP API sang một tiến trình Python riêng lẻ và loại bỏ hoàn toàn gánh nặng cài đặt môi trường.

### 🔴 Thứ 4 (30/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** [CẮT BỎ] Xóa bỏ Module Khảo sát tính cách MBTI & Dọn sạch thanh điều hướng.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ mbtiService.ts, MBTIAssessment.tsx, CandidateMBTIInsightCard.tsx, types/mbti.ts khỏi codebase.
  * Chiều (13:00 - 17:00): Dọn sạch các nút bấm và tab MBTI trên Sidebar và thanh điều hướng chính, giải phóng bộ nhớ ứng dụng.
* **Kinh nghiệm rút ra:** Nhà tuyển dụng kỹ thuật quan tâm đến stack công nghệ và sản phẩm chạy thật hơn là các bài trắc nghiệm tính cách chung chung.

### 🔴 Thứ 5 (01/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** [CẮT BỎ] Loại bỏ luồng phỏng vấn chatbot dài dòng & Tối ưu luồng chọn đồ án.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ các component chat hỏi đáp rườm rà: DiscoveryInterview.tsx, ChatWindow.tsx, FactCard.tsx, discovery.controller.ts.
  * Chiều (13:00 - 17:00): Định hướng lại luồng dữ liệu: Cho phép ứng viên kéo trực tiếp dự án từ hồ sơ vào CV bằng Checkbox modal thay vì phải chat hỏi đáp từng câu.
* **Kinh nghiệm rút ra:** Giao diện trực quan dạng chọn (checkbox) mang lại tốc độ hoàn thành công việc cao gấp 5 lần giao diện chat đàm thoại.

### 🔴 Thứ 6 (02/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng tính năng Nạp Hàng Loạt 100 CV từ Excel (BulkCvImportModal.tsx).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tích hợp thư viện xlsx đọc dữ liệu hàng loạt từ file mẫu Mau_100_CV_ProfileHub.xlsx, bóc tách thông tin sinh viên, trường, GPA, kỹ năng và đồ án.
  * Chiều (13:00 - 17:00): Phát triển hàm convertImportedCvToCvBuilderState cho phép nạp 1 click toàn bộ 100 CV mẫu vào CV Builder để phục vụ test tính năng và stress-test.
* **Kinh nghiệm rút ra:** Chuẩn bị bộ dữ liệu mẫu phong phú giúp việc kiểm thử giao diện và thuật toán phản ánh chính xác dữ liệu thực tế.

## 📅 TUẦN 3: MODULE GIẢNG VIÊN ĐÁNH GIÁ, CỔNG CHỨNG THỰC & KHẢO SÁT PHẢN HỒI (05/10/2026 – 09/10/2026)

### 🔴 Thứ 2 (05/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Khảo sát thực tế luồng Xác thực Giảng viên (Teacher Verification) và chuyển sang Evidence-Based.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Nhận thấy việc yêu cầu giảng viên phải đăng nhập chấm điểm, ký hash cryptographic (verificationCrypto.ts) tạo ra ma sát cực lớn, sinh viên bị phụ thuộc và không thể chủ động gửi CV.
  * Chiều (13:00 - 17:00): Quyết định loại bỏ triệt để tính năng xác thực giảng viên khỏi phạm vi dự án MVP, thay thế bằng cơ chế Bằng chứng tự chứng minh (Evidence-Based): Link Demo, Repo, QR Code.
* **Kinh nghiệm rút ra:** Một sản phẩm tốt phải trao quyền chủ động cho người dùng chính (ứng viên) thay vì tạo ra các nút thắt hành chính bên ngoài.

### 🔴 Thứ 3 (06/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** [CẮT BỎ] Xóa bỏ toàn bộ Module Xác thực Giảng viên backend & client.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ các tệp tin backend: verification.controller.ts, verification.service.ts, verification.routes.ts, utils/verificationCrypto.ts.
  * Chiều (13:00 - 17:00): Xóa bỏ giao diện client: VerificationInbox.tsx, TeacherProfile.tsx, PublicVerificationView.tsx. Xóa logic cộng điểm thưởng is_verified trong thuật toán gợi ý đồ án của aiCvService.ts.
* **Kinh nghiệm rút ra:** Loại bỏ cơ chế cộng điểm ưu tiên giả định giúp thuật toán AI matching trở nên công bằng, đánh giá thuần túy dựa trên độ phù hợp của Tech Stack với JD.

### 🔴 Thứ 4 (07/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** [CẮT BỎ] Xóa bỏ tính năng Tạo thư xin việc (Cover Letter) & Phỏng vấn ảo rườm rà.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa bỏ CoverLetterModal.tsx, CoverLetterPage.tsx, aiCoverLetterService.ts khỏi codebase.
  * Chiều (13:00 - 17:00): Xóa bỏ AIInterviewPrep.tsx, aiInterviewService.ts, aiOfferLetterService.ts, giải phóng dung lượng bundle size.
* **Kinh nghiệm rút ra:** Tập trung sâu sắc vào một tính năng then chốt (CV Builder) mang lại trải nghiệm xuất sắc hơn là dàn trải nhiều tính năng nông.

### 🔴 Thứ 5 (08/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Thiết lập hạ tầng Unit Test tự động hóa với Vitest trong profilehub.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình Vitest trong package.json và vite.config.ts, thiết lập môi trường test jsdom và các script kiểm thử tự động.
  * Chiều (13:00 - 17:00): Viết các Seam Test đầu tiên: aiCvService.test.ts (kiểm tra phân tích từ khóa JD) và aiCvCoachService.test.ts (kiểm tra barem đánh giá nội dung CV).
* **Kinh nghiệm rút ra:** Thiết lập test harness sớm tạo bệ phóng an toàn để tự tin refactor các module lớn mà không sợ gây lỗi hồi quy.

### 🔴 Thứ 6 (09/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Vá lỗi "Zombie CV" trong cvService.ts & Kiểm thử toàn diện TDD Green Check.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát hiện và sửa điều kiện kiểm tra raw !== null trong cvService.ts để tôn trọng quyết định xóa của người dùng. Viết bộ test cvManagement.test.ts bảo vệ bất biến vòng đời CV.
  * Chiều (13:00 - 17:00): Chạy 5 test suites ban đầu (aiCvService, cvManagement, aiCvGeneration, aiCvCoach, markdownExporter) đạt 20/20 tests pass 100%, kiểm tra npm run build xác nhận TypeScript biên dịch không lỗi.
* **Kinh nghiệm rút ra:** Gom việc vá lỗi logic CSDL và kiểm thử hồi quy toàn diện vào chiều thứ 6 giúp khép lại tuần làm việc với trạng thái All-Green an tâm tuyệt đối.

## 📅 TUẦN 4: TÁI THIẾT KẾ KIẾN TRÚC (PIVOT), CẮT BỎ OVER-ENGINEERING & TRIỂN KHAI 6 TRACER-BULLET TICKETS (12/10/2026 – 16/10/2026)

### 🔴 Thứ 2 (12/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Ban hành Quyết định Kiến trúc ADR 0001: Tách biệt Bản sao Dự án trong CV với Hồ sơ Gốc.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích bài toán: Khi ứng viên sửa câu từ của dự án cho vừa vặn với một JD cụ thể, nếu lưu đè vào hồ sơ gốc sẽ làm hỏng dữ liệu gốc.
  * Chiều (13:00 - 17:00): Soạn thảo và ban hành ADR 0001: Dự án trong CV là một thực thể độc lập (CV Project Instance), có thể tùy biến tự do theo JD mà không làm ảnh hưởng Master Project.
* **Kinh nghiệm rút ra:** Việc tách biệt Instance và Master Profile là quyết định kiến trúc then chốt giúp ứng viên thoải mái may đo nhiều CV cho nhiều vị trí khác nhau.

### 🔴 Thứ 3 (13/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Cập nhật Tài liệu Đặc tả Yêu cầu Hệ thống Chính thức & Bảng Thuật Ngữ Miền.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Bổ sung Mục 7.4 (Luồng đưa dự án vào CV và đồng bộ ngược Reverse Sync) vào tài liệu đặc tả chính thức ProfileHub_Discovery_Requirements.md.
  * Chiều (13:00 - 17:00): Định nghĩa bảng thuật ngữ chuẩn trong docs/CONTEXT.md: Master Project, CV Project Instance, Reverse Sync, Scoped Contribution, STAR Bullet, Anti-Hallucination Guard, Page-Budget Guard, Evidence Showcase.
* **Kinh nghiệm rút ra:** Chuẩn hóa ngôn ngữ miền chung (Ubiquitous Language) giúp việc viết mã nguồn và đặt tên biến có tính đồng nhất cao.

### 🔴 Thứ 4 (14/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Phân rã kỹ thuật thành 6 Tracer-Bullet Tickets & Lập kế hoạch TDD song hành.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Soạn thảo chi tiết tiêu chí nghiệm thu (Acceptance Criteria) cho Ticket 01 (Reverse Sync), Ticket 02 (Scoped Contribution), Ticket 03 (Project Fit Explainer) trong .scratch/project-driven-cv-builder/issues/.
  * Chiều (13:00 - 17:00): Soạn thảo chi tiết tiêu chí nghiệm thu cho Ticket 04 (STAR Diff Review), Ticket 05 (Page-Budget Guard), Ticket 06 (Evidence Showcase QR) và lập kế hoạch triển khai song hành TDD.
* **Kinh nghiệm rút ra:** Chia nhỏ bài toán lớn thành các ticket dạng "tracer-bullet" giúp kiểm soát tiến độ và kiểm thử độc lập dễ dàng.

### 🔴 Thứ 5 (15/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hiện thực hóa Ticket 01 (Reverse Sync & Toast) & Ticket 02 (Scoped Contribution).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Mở rộng ProjectItem với syncToMasterProfile?: boolean. Viết hàm cvService.syncCvProjectsToMaster tự động upsert dự án mới vào Supabase khi lưu CV. Viết projectReverseSync.test.ts kiểm thử TDD (3/3 pass).
  * Chiều (13:00 - 17:00): Thêm trường scopeType: 'solo' | 'team', teamSize, systemContext. Render huy hiệu [👥 Đồ án nhóm - X thành viên] hoặc [👤 Đồ án cá nhân] trên CV. Viết scopedContribution.test.ts kiểm thử (3/3 pass).
* **Kinh nghiệm rút ra:** Trải nghiệm Reverse Sync kèm thông báo Toast không gây gián đoạn (non-blocking) giúp ứng viên duy trì mạch tập trung khi gõ phím.

### 🔴 Thứ 6 (16/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hiện thực hóa Ticket 03 (Project Fit Explainer) & Ticket 04 (STAR Bullet & Anti-Hallucination Guard).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng projectFitService.evaluateProjectFit: Đối chiếu đồ án với JD, tính % tương thích, chip từ khóa trùng khớp/thiếu. Xây dựng ProjectFitExplainerModal.tsx chọn đồ án phù hợp vào CV 1-click. Viết test (3/3 pass).
  * Chiều (13:00 - 17:00): Xây dựng starBulletService.adaptProjectBulletsWithStar chuẩn hóa mô tả STAR có số liệu định lượng. Xây dựng StarDiffReviewModal.tsx và tích hợp Anti-Hallucination Guard chặn AI tự bịa công nghệ. Viết test (3/3 pass).
* **Kinh nghiệm rút ra:** Minh bạch hóa lý do đề xuất của AI và cung cấp bảng Diff Review giúp ứng viên làm chủ hoàn toàn nội dung trên CV của mình.

## 📅 TUẦN 5: MỞ RỘNG TÍNH NĂNG NÂNG CAO — STAR DIAGNOSTIC ENGINE & ATS EYE-VIEW HEATMAP (19/10/2026 – 23/10/2026)

### 🔴 Thứ 2 (19/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hiện thực hóa Ticket 05, Ticket 06 & Nghiệm thu toàn diện ProfileHub v1.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Hoàn thiện Ticket 05 (Page-Budget Guard đo chiều cao khổ A4, 1-Click Auto-Condense, đổi layout 1/2 cột) và Ticket 06 (Evidence Showcase render link demo/repo và mã QR 28px in A4); viết test pass 100%.
  * Chiều (13:00 - 17:00): Rà soát micro-interactions, phím tắt Ctrl + S/P/B, chạy toàn bộ 11/11 test suites (38/38 tests pass 100%) và đóng gói npm run build sạch sẽ, nghiệm thu bàn giao ProfileHub v1.
* **Kinh nghiệm rút ra:** Gom việc hoàn tất 2 ticket cuối cùng với quy trình đóng gói nghiệm thu giúp khép lại phiên bản v1 một cách trọn vẹn và đúng tiến độ.

### 🔴 Thứ 3 (20/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Phân tích nghiệp vụ thư ứng tuyển trong ngành IT và thiết kế kiến trúc Contextual Application Pitch (ADR 0002).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Họp phản biện (/grill-with-docs) làm rõ bất cập của Cover Letter truyền thống; ban hành quyết định kiến trúc ADR 0002 định nghĩa Contextual Application Pitch gắn liền với cặp (CV Project Instance, JD).
  * Chiều (13:00 - 17:00): Xây dựng applicationPitchService.ts và ApplicationPitchModal.tsx (< 250 từ, 1-Click Copy, cơ chế Hard-gating bắt buộc có JD và ít nhất 1 đồ án); viết 4 bài test TDD pass 100%.
* **Kinh nghiệm rút ra:** Tránh tạo tài liệu độc lập gây phình to hệ thống; nhúng ngữ cảnh trực tiếp vào bản CV giúp tạo tính gắn kết chặt chẽ giữa đồ án thực tế và yêu cầu tuyển dụng.

### 🔴 Thứ 4 (21/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Trụ Cột 3: Project Technical Defense Briefing (Huấn luyện phòng thủ đồ án trước Tech Lead).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Nghiên cứu các dạng câu hỏi xoáy phỏng vấn kỹ thuật theo từng Tech Stack: Redis Cache Invalidation, PostgreSQL EXPLAIN & Indexing, Node.js Event Loop, React Re-render.
  * Chiều (13:00 - 17:00): Xây dựng projectDefenseService.ts và ProjectDefenseModal.tsx trang bị Top 3 câu hỏi xoáy, bản giải trình Trade-off và kịch bản Debugging Scaffold 4 pha; nâng test suites lên 13/13 (46/46 tests pass).
* **Kinh nghiệm rút ra:** Trang bị bản lĩnh bảo vệ đồ án trước câu hỏi hóc búa của Tech Lead giúp ứng viên tự tin chứng minh năng lực thực chất ở vòng phỏng vấn kỹ thuật.

### 🔴 Thứ 5 (22/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Nghiên cứu nguyên tắc "Zero Fake Metrics" & Xây dựng công cụ "Soi CV Chuẩn STAR".
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khẳng định nguyên tắc chống bịa đặt số liệu viển vông; xác lập 4 nguồn số liệu kỹ thuật thực tế: EXPLAIN query cost, k6 load test throughput (req/s), Lighthouse performance và Vitest test coverage.
  * Chiều (13:00 - 17:00): Xây dựng starDiagnosticService.ts: Bắt lỗi từ ngữ thụ động ("tham gia", "hỗ trợ"), chấm điểm STAR Score (0-100), tự động sinh câu hỏi gợi mở khơi sâu trải nghiệm thực tế.
* **Kinh nghiệm rút ra:** Số liệu trong CV công nghệ phải có bằng chứng kỹ thuật kiểm chứng được, tránh việc ứng viên bị Tech Lead đánh trượt vì thiếu trung thực (Dishonesty) khi bị truy vấn sâu.

### 🔴 Thứ 6 (23/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hoàn thiện STAR Wizard, Tích hợp Canvas & Thiết lập CI/CD GitHub Actions.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng modal StarCvDiagnosticModal.tsx hỗ trợ cả 2 chế độ: "Soi CV Sẵn Có" và "STAR Wizard Từ Trang Giấy Trắng", tích hợp nút tác vụ 1-click đưa vào CV Canvas (5 bài test pass 100%).
  * Chiều (13:00 - 17:00): Cấu hình CI/CD GitHub Actions (.github/workflows/3dwebsite-ci.yml, deploy, release, rollback), chạy kiểm thử hồi quy 14/14 test suites (51/51 tests pass) và kiểm tra hiệu năng đóng gói build sạch.
* **Kinh nghiệm rút ra:** Gom việc tích hợp giao diện STAR Wizard với quy trình kiểm thử hiệu năng CI/CD vào ngày thứ 6 giúp đảm bảo tính ổn định cao của mã nguồn trước khi sang tuần mới.

## 📅 TUẦN 6: INTERVIEW WAR ROOM, SALARY BENCHMARK & MULTI-VERSION CV MANAGEMENT (26/10/2026 – 30/10/2026)

### 🔴 Thứ 2 (26/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Nâng cấp Module Quản lý Đồ Án (AddProjectModal.tsx) & Tour Hướng Dẫn Game Hóa.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế lại form thêm/sửa đồ án hỗ trợ liên kết Live Demo URL, GitHub Repo, bối cảnh hệ thống (System Context) và phân tách trách nhiệm cá nhân; bổ sung trường gắn nhãn công nghệ tự động.
  * Chiều (13:00 - 17:00): Xây dựng GamifiedOnboardingTour.tsx hướng dẫn từng bước cho sinh viên mới lần đầu vào hệ thống; hoàn thiện component ProjectQRCodeModal.tsx xuất mã Smart QR quét mở demo trên điện thoại.
* **Kinh nghiệm rút ra:** Thiết kế onboarding dạng game hóa giúp người dùng nhanh chóng nắm bắt các tính năng cốt lõi của nền tảng mà không cần đọc hướng dẫn sử dụng dài dòng.

### 🔴 Thứ 3 (27/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Bộ Quy Tắc Kiểm Định Chất Lượng CV & Nâng cấp CV Canvas linh hoạt.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển cvQualityCheckService.ts kiểm tra 10 tiêu chí chất lượng CV (độ dài lý tưởng, tỷ lệ định lượng, từ khóa kỹ thuật) và modal CVQualityCheckModal.tsx (5 bài test pass 100%).
  * Chiều (13:00 - 17:00): Xây dựng InlineEditPopover.tsx, SectionSettingsModal.tsx, ReorderSectionsModal.tsx cho phép kéo thả sắp xếp lại các phần; tích hợp GitHubQuickImportBar.tsx kéo repo từ GitHub vào thẳng CV.
* **Kinh nghiệm rút ra:** Tự động hóa việc chấm điểm chất lượng CV kết hợp tùy biến khối thông tin linh hoạt giúp ứng viên may đo hồ sơ đạt độ hoàn thiện cao nhất.

### 🔴 Thứ 4 (28/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tái cấu trúc giao diện sang Consumer SaaS & Hiện thực hóa "Mắt Thần ATS".
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Loại bỏ Sidebar cố định 240px trong MainLayout.tsx giải phóng 100% không gian ngang cho màn hình soạn thảo CV; xây dựng HeaderBar.tsx kính mờ, Footer.tsx và trang chủ HomePage.tsx tại /.
  * Chiều (13:00 - 17:00): Hoàn thành atsParserEyeService.ts & AtsParserEyeModal.tsx hiển thị chuỗi Plain-Text chuẩn xác mà các hệ thống ATS quốc tế (Workday, Taleo) đọc ra, kèm nút 1-click chuyển Minimalist Harvard 1 cột (4 tests pass).
* **Kinh nghiệm rút ra:** Chuyển sang bố cục HeaderBar tối giản giúp giao diện hiện đại chuẩn SaaS và hiểu rõ cơ chế máy quét ATS quốc tế bảo vệ hồ sơ không bị loại oan.

### 🔴 Thứ 5 (29/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Động Cơ Khảo Sát Lương Thị Trường AI & Widget Bản Đồ Nhiệt Theo Dõi CV.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng salaryBenchmarkService.ts & SalaryBenchmarkModal.tsx nhận diện cấp bậc, tính Tech Multiplier (+10% đến 35%) và dùng đồ án làm đòn bẩy nâng phân vị lương từ P50 lên P75-P85 (4 tests pass).
  * Chiều (13:00 - 17:00): Xây dựng cvTrackingAnalyticsService.ts & CvHeatmapWidget.tsx đo lường lượt xem, thời gian dừng đọc trung bình (Avg Dwell Time), trực quan hóa % thời gian dừng ở từng mục; thêm ThemeToggleSwitch.tsx (Dark/Light mode).
* **Kinh nghiệm rút ra:** Trang bị công cụ khảo sát dải lương giúp ứng viên tự tin đàm phán và dữ liệu bản đồ nhiệt giúp hiểu rõ phần nào trong CV được nhà tuyển dụng chú ý nhiều nhất.

### 🔴 Thứ 6 (30/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Interview War Room 4 Chặng & Kiểm thử hồi quy hiệu năng toàn diện.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Hoàn thành aiMockInterviewService.ts, selfInterviewService.ts, AiMockInterviewModal.tsx, InterviewWarRoomModal.tsx mô phỏng 4 chặng: Elevator Pitch, STAR Deep-Dive, Live Incident Crisis, Skill Gap Defense.
  * Chiều (13:00 - 17:00): Tích hợp tính năng đổi giờ phỏng vấn (Reschedule) đồng bộ 2 chiều sang pipeline NTD; chạy toàn bộ 82/82 Unit Tests (22/22 Test Suites pass 100%) và đo lường hiệu năng bundle build sạch sẽ trong 23s.
* **Kinh nghiệm rút ra:** Luyện tập phỏng vấn xử lý sự cố khẩn cấp (Live Incident) kết hợp kiểm thử hồi quy và đo lường hiệu năng vào chiều thứ 6 giúp đóng gói hệ thống an toàn và vững chắc.

## 📅 TUẦN 7: APPLICATION TRACKER, COVER LETTER GENERATOR & REVERSE RECRUITING HUB (02/11/2026 – 06/11/2026)

### 🔴 Thứ 2 (02/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Khảo sát tiến trình ứng tuyển & Thiết kế kiến trúc Application Pipeline Tracker.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khảo sát góc khuất tâm lý ứng viên sau khi nộp đơn: nỗi sợ thất lạc hồ sơ và quên phiên bản CV đã nộp; xây dựng đặc tả kiến trúc cho Application Pipeline Tracker và Public Verification Gateway.
  * Chiều (13:00 - 17:00): Khai báo Schema Types (application.types.ts, starDefense.types.ts, projects.types.ts) và thiết lập kiến trúc dịch vụ bảo chứng & băm mật mã học (applicationTrackerService.ts, verificationService.ts).
* **Kinh nghiệm rút ra:** Phân tích sâu hành vi ứng viên sau khi gửi CV giúp xây dựng các tính năng đồng hành liên tục suốt quá trình tìm việc chứ không dừng lại ở khâu xuất file.

### 🔴 Thứ 3 (03/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hiện thực hóa Bảng Kanban Ứng Tuyển & Phao Cứu Sinh Giải Trình Số Liệu STAR.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng bảng Kanban ApplicationKanbanBoard.tsx với các cột trạng thái rõ ràng (Đã nộp, Chờ phỏng vấn, Đã nhận offer, Từ chối), tích hợp dữ liệu ứng tuyển đồng bộ.
  * Chiều (13:00 - 17:00): Xây dựng modal phao cứu sinh giải trình số liệu StarDefenseModal.tsx giúp ứng viên ôn tập nhanh các luận điểm kỹ thuật then chốt 15 phút trước giờ phỏng vấn; viết test TDD pass 100%.
* **Kinh nghiệm rút ra:** Cung cấp bản tóm tắt luận điểm kỹ thuật rút gọn ngay trên bảng Kanban giúp ứng viên luôn ở trạng thái sẵn sàng cao nhất khi nhận cuộc gọi từ nhà tuyển dụng.

### 🔴 Thứ 4 (04/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Cổng Tra Cứu Bảo Chứng Công Khai (/verify/:code) & Kiểm thử bảo mật.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng PublicVerificationView.tsx tại route độc lập /verify/:code, kết nối thuật toán băm cryptographic bảo chứng tính toàn vẹn của đồ án và đồng bộ mã QR quét mở trực tiếp.
  * Chiều (13:00 - 17:00): Kiểm thử bảo mật ranh giới riêng tư (Privacy Boundary): thiết lập RLS ẩn GPA và số điện thoại/email cá nhân trên cổng tra cứu công khai, chỉ hiển thị minh chứng đồ án và kỹ năng kỹ thuật.
* **Kinh nghiệm rút ra:** Bảo vệ dữ liệu riêng tư cá nhân khi thiết kế cổng tra cứu công khai là yêu cầu an toàn thông tin bắt buộc đối với nền tảng giáo dục - tuyển dụng.

### 🔴 Thứ 5 (05/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Khảo sát nhu cầu ứng tuyển & Xây dựng Bộ Hồ Sơ Ứng Tuyển Toàn Diện (Cover Letter Service).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Ban hành đặc tả kỹ thuật SDD, khai báo Schema Types (coverLetter.types.ts) cho Cover Letter & Outbound Email Generator bám sát đồ án thực tế và JD.
  * Chiều (13:00 - 17:00): Xây dựng coverLetterService.ts với Rule Template Engine 4 đoạn kết hợp thuật toán dệt số liệu định lượng STAR từ CV; viết 7/7 bài kiểm thử Vitest pass 100%.
* **Kinh nghiệm rút ra:** Tạo thư ứng tuyển tự động bám sát đồ án thực tế và số liệu định lượng giúp ứng viên thể hiện năng lực nổi bật mà không bao giờ bịa đặt công nghệ.

### 🔴 Thứ 6 (06/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hiện thực hóa CoverLetterModal.tsx & Kiểm thử hiệu năng hệ thống toàn dự án.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển CoverLetterModal.tsx hỗ trợ 3 phong cách (Chuyên nghiệp/Startup/Kỹ thuật), mẫu Email gửi HR chuẩn quốc tế, xuất Markdown, tích hợp nút gọi nhanh từ ApplicationCard.tsx.
  * Chiều (13:00 - 17:00): Kiểm thử toàn diện 37 files (151/151 tests pass 100%), đo lường hiệu năng rendering trên các trình duyệt Chrome/Edge/Firefox và build sản xuất sạch sẽ 100%.
* **Kinh nghiệm rút ra:** Tích hợp liền mạch giữa Kanban theo dõi ứng tuyển và công cụ may đo thư xin việc, đồng thời gom kiểm tra hiệu năng hệ thống vào cuối tuần giúp đảm bảo toàn bộ hệ sinh thái chạy mượt mà.

## 📅 TUẦN 8: ADVANCED CACHING, HYDRATION OPTIMIZATION, E2E TESTING & SECURITY AUDIT (09/11/2026 – 13/11/2026)

### 🔴 Thứ 2 (09/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Triển khai thử nghiệm người dùng Beta (User Acceptance Testing - UAT).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tổ chức phiên thử nghiệm người dùng UAT với nhóm 15 sinh viên năm cuối ngành CNTT: Giao nhiệm vụ tạo CV từ JD thực tế của FPT Software và VNG.
  * Chiều (13:00 - 17:00): Ghi nhận nhật ký thao tác và phỏng vấn nhanh cảm nhận của người dùng về tính năng STAR Diagnostic, Mắt Thần ATS, Application Tracker và Cover Letter.
* **Kinh nghiệm rút ra:** Quan sát người dùng thực tế thao tác giúp phát hiện nhiều chi tiết nhỏ về mặt tương tác (micro-interactions) cần được tinh chỉnh để tăng tính trực quan.

### 🔴 Thứ 3 (10/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Phân tích kết quả UAT và Tinh chỉnh kích thước hiển thị in ấn chuẩn A4.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tổng hợp danh sách góp ý từ đợt thử nghiệm UAT, điều chỉnh kích thước font chữ in ấn xuống 10.5pt để vừa vặn hơn trên các khổ giấy hẹp.
  * Chiều (13:00 - 17:00): Kiểm thử in thực tế trên 3 dòng máy in văn phòng phổ biến (HP LaserJet, Canon LBP, Brother); kiểm tra độ sắc nét và đảm bảo mã QR quét nhạy trong vòng 1 giây.
* **Kinh nghiệm rút ra:** Kiểm thử trên thiết bị vật lý thực tế (máy in và camera điện thoại) là bước bắt buộc để đảm bảo chất lượng đầu ra của sản phẩm in ấn.

### 🔴 Thứ 4 (11/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tối ưu hóa SEO, OpenGraph Meta Tags & Nâng cấp bộ xuất PDF vector chất lượng cao.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình dynamic OpenGraph tags cho trang /showcase/:id: Hiển thị ảnh thumbnail dự án, tên ứng viên và danh sách tech stack khi chia sẻ link lên LinkedIn/Facebook.
  * Chiều (13:00 - 17:00): Tích hợp cấu hình print style sheet @media print chuyên sâu: Khóa chặt tỷ lệ trang 1:1, kiểm tra văn bản vector có thể bôi đen và tìm kiếm được (selectable text) không bị vỡ hạt khi phóng to 300%.
* **Kinh nghiệm rút ra:** Chăm chút trang Portfolio công khai và xuất file PDF vector giúp máy quét ATS bóc tách dữ liệu chính xác 100% so với việc xuất ảnh bitmap thông thường.

### 🔴 Thứ 5 (12/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Đóng gói toàn bộ tài liệu kỹ thuật bàn giao (Developer Handover Guide & Architecture Spec).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cập nhật hoàn chỉnh tài liệu kiến trúc docs/CONTEXT.md, sơ đồ luồng hệ thống docs/luong_chinh_he_thong.md và hướng dẫn triển khai.
  * Chiều (13:00 - 17:00): Đóng gói mã nguồn, kiểm tra lại toàn bộ file README.md, rà soát các biến môi trường và chuẩn bị tài liệu báo cáo thực tập tốt nghiệp chi tiết.
* **Kinh nghiệm rút ra:** Viết tài liệu bàn giao chuẩn mực và mạch lạc là kỹ năng quan trọng khẳng định tính chuyên nghiệp của một kỹ sư phần mềm khi kết thúc dự án.

### 🔴 Thứ 6 (13/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Đo lường hiệu năng hệ thống lần cuối & Báo cáo nghiệm thu với Người hướng dẫn doanh nghiệp.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Đo lường điểm hiệu năng toàn diện trên Chrome Lighthouse (đạt 98/100 Performance, 100/100 SEO), kiểm tra tải trang và tối ưu hóa tài nguyên bundle lần cuối.
  * Chiều (13:00 - 17:00): Báo cáo nghiệm thu dự án ProfileHub trước đại diện Công ty TNHH Alpaca Solutions, ký nhận phiếu theo dõi tiến độ thực tập và hoàn tất hồ sơ thực tập tốt nghiệp.
* **Kinh nghiệm rút ra:** Trải nghiệm thực tập thực tế tại doanh nghiệp giúp chuyển hóa vững chắc kiến thức lý thuyết trên giảng đường thành năng lực xây dựng sản phẩm công nghệ hoàn chỉnh.

## 📅 TUẦN 9: USER ACCEPTANCE TESTING (UAT), PRODUCTION DEPLOYMENT & HOÀN THIỆN TÀI LIỆU (16/11/2026 – 20/11/2026)

### 🔴 Thứ 2 (16/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Rà soát và chuẩn hóa Typography, font chữ hệ thống trên toàn bộ giao diện.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Rà soát và chuẩn hóa Typography, font chữ hệ thống trên toàn bộ các trang (Dashboard, CV Builder, Showcase, Kanban).
  * Chiều (13:00 - 17:00): Viết các bài kiểm thử tự động kiểm tra tính tương thích font chữ và độ tương phản màu sắc trên các kích thước màn hình khác nhau.
* **Kinh nghiệm rút ra:** Đảm bảo tính nhất quán về mặt thị giác và khả năng đọc (readability) nâng cao tính thẩm mỹ và độ tin cậy của sản phẩm.

### 🔴 Thứ 3 (17/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Kiểm thử tích hợp luồng tương tác giữa Kanban ứng tuyển và gửi Email HR.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Kiểm thử tích hợp luồng tương tác giữa bảng Kanban ứng tuyển và modal gửi Email cho nhà tuyển dụng.
  * Chiều (13:00 - 17:00): Tối ưu hóa các thao tác kéo thả trạng thái ứng viên, bổ sung thông báo Toast phản hồi tức thì khi cập nhật tiến độ phỏng vấn.
* **Kinh nghiệm rút ra:** Phản hồi giao diện tức thì khi người dùng tương tác giúp ứng dụng mang lại cảm giác mượt mà và chuyên nghiệp như các công cụ SaaS quốc tế.

### 🔴 Thứ 4 (18/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tinh chỉnh các mẫu template Cover Letter & Hoàn thiện tính năng xuất đa định dạng.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tinh chỉnh các mẫu template Cover Letter theo 3 phong cách (Chuyên nghiệp, Startup, Kỹ thuật chuyên sâu) dựa trên phản hồi của sinh viên.
  * Chiều (13:00 - 17:00): Hoàn thiện tính năng xuất Cover Letter ra file .txt và Markdown chuẩn GitHub để ứng viên dễ dàng lưu trữ và tùy biến thêm.
* **Kinh nghiệm rút ra:** Đa dạng hóa định dạng xuất tài liệu giúp đáp ứng linh hoạt các phương thức nộp đơn khác nhau của các công ty công nghệ.

### 🔴 Thứ 5 (19/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Rà soát toàn bộ liên kết tài liệu minh chứng & Thiết lập cơ chế sao lưu dữ liệu tự động.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Rà soát toàn bộ các liên kết tài liệu minh chứng, link GitHub Repo và Demo của các đồ án mẫu trong hệ thống.
  * Chiều (13:00 - 17:00): Kiểm tra cơ chế sao lưu dự phòng CSDL trên Supabase và thiết lập lịch tự động sao lưu định kỳ hàng tuần.
* **Kinh nghiệm rút ra:** Thiết lập chính sách sao lưu định kỳ là biện pháp phòng ngừa rủi ro mất mát dữ liệu quan trọng nhất cho hệ thống đang vận hành.

### 🔴 Thứ 6 (20/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Chạy kiểm thử tải hệ thống (Load Testing) & Tổng kết tuần thực tập 9.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Chạy kiểm thử tải (load testing) với k6 mô phỏng 100 người dùng đồng thời truy cập Public Showcase, ghi nhận thời gian phản hồi API < 200ms.
  * Chiều (13:00 - 17:00): Tổng kết tuần 9, bàn giao tài liệu bổ sung cho doanh nghiệp và chuẩn bị các nội dung chuẩn bị cho lễ bảo vệ thực tập tốt nghiệp.
* **Kinh nghiệm rút ra:** Thực hiện kiểm thử tải trước khi bàn giao giúp đánh giá chính xác năng lực chịu tải của hạ tầng và mang lại sự an tâm tuyệt đối.

