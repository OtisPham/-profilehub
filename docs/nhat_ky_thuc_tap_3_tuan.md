# 📓 SỔ NHẬT KÝ THỰC TẬP TỐT NGHIỆP (BM01b) — DỰ ÁN PROFILEHUB / UNIPORTFOLIO (LỘ TRÌNH 3 TUẦN)

* **Họ và tên sinh viên:** PHẠM THÁI BẢO
* **Mã số sinh viên:** 22114919
* **Ngành:** CÔNG NGHỆ THÔNG TIN
* **Đơn vị thực tập:** CÔNG TY TNHH ALPACA SOLUTIONS
* **Dự án thực hiện:** PROFILEHUB - Verified Academic & Career Platform (UniPortfolio)
* **Thời gian ghi nhật ký:** 18/09/2026 – 10/10/2026 (3 Tuần làm việc cô đọng)

---

## 📅 TUẦN 1: KHỞI TẠO DỰ ÁN, NỀN TẢNG CSDL & MODULE CORE SINH VIÊN (18/09/2026 – 25/09/2026)

### 🔴 Thứ 6 (18/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Khảo sát bài toán nghiệp vụ & Phân tích yêu cầu hệ thống quản lý hồ sơ sinh viên (UniPortfolio).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tìm hiểu thực trạng hồ sơ ứng tuyển của sinh viên CNTT, phân tích 3 trụ cột lớn: Xác thực đồ án thực tế (Academic Verification), Tìm kiếm ứng viên dựa trên bằng chứng đồ án (Evidence-Based Matching), và Luyện phỏng vấn AI.
  * Chiều (13:00 - 17:00): Lập sơ đồ phân rã chức năng (WBS) và chia lộ trình phát triển dự án thành 3 Phase trọng tâm cô đọng.
* **Kinh nghiệm rút ra:** Phân tích kỹ yêu cầu nghiệp vụ thực tế giúp định hình đúng cấu trúc hệ thống và tránh phải refactor nhiều ở các giai đoạn sau.

### 🔴 Thứ 7 (19/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Lựa chọn Tech Stack & Khởi tạo mã nguồn cơ sở (Base Code Setup).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Đánh giá công nghệ, chốt Tech Stack: React 18, TypeScript (Strict Mode), Vite, Inline CSS/Tailwind cho Frontend và Supabase (PostgreSQL, Auth, Storage) cho Backend.
  * Chiều (13:00 - 17:00): Cấu hình mã nguồn base với Vite, cài đặt ESLint, Prettier, Lucide React icons và thiết lập bộ định tuyến React Router v7.
* **Kinh nghiệm rút ra:** Thiết lập chuẩn mã nguồn (Coding Conventions) khắt khe ngay từ đầu giúp phát hiện sớm các lỗi cú pháp và đảm bảo tính đồng bộ khi làm việc.

### 🔴 Thứ 2 (21/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Thiết kế CSDL PostgreSQL trên Supabase & Tích hợp Supabase Storage Bucket.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Viết kịch bản SQL khởi tạo các bảng: `users`, `student_profiles`, `projects`, `skills`, `certificates`, `achievements`. Thiết lập các khóa ngoại (`FOREIGN KEY`) và bật Row Level Security (RLS).
  * Chiều (13:00 - 17:00): Khởi tạo Supabase Storage bucket `portfolio_files` và viết helper service upload file trực tiếp từ giao diện lên cloud storage.
* **Kinh nghiệm rút ra:** Nắm vững cơ chế bảo mật RLS (Row Level Security) trên PostgreSQL để bảo vệ dữ liệu cá nhân của từng sinh viên.

### 🔴 Thứ 3 (22/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng Module Quản lý Đồ Án (`MyProjects.tsx`) - Tính năng CRUD cơ bản.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế giao diện danh sách đồ án dạng thẻ Card chuẩn Enterprise, hỗ trợ lọc theo công nghệ (Tech Stack tags).
  * Chiều (13:00 - 17:00): Xây dựng Form Modal Thêm/Sửa đồ án, tích hợp Confirmation Modal khi Xóa đồ án và xử lý tự động điền lại dữ liệu cũ khi cập nhật.
* **Kinh nghiệm rút ra:** Quản lý state của Form với React Hooks cẩn thận giúp tránh lỗi render sai dữ liệu cũ khi thao tác giữa các đồ án khác nhau.

### 🔴 Thứ 4 (23/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng Module Quản lý Chứng Chỉ (`Certificates.tsx`) & Trình Xem Tài Liệu Thông Minh (Smart Document Reader).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Hoàn thiện UI Dashboard chứng chỉ, vinh danh thành tựu nổi bật (`is_featured`) và tích hợp tính năng Drag & Drop upload file minh chứng.
  * Chiều (13:00 - 17:00): Phát triển Modal xem trước file PDF/Hình ảnh nội tuyến (`In-app Document Reader`) qua iframe/img mà không cần chuyển trang.
* **Kinh nghiệm rút ra:** Xử lý render điều kiện (Conditional Rendering) thông minh giúp tối ưu trải nghiệm đọc tài liệu minh chứng mà không vỡ layout ứng dụng.

### 🔴 Thứ 5 (24/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Phân quyền Vai Trò (Role-based Routing) & Kiến trúc Giao diện Single-Layout.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình `MainLayout.tsx` và `Sidebar.tsx` duy nhất để tránh nhảy giao diện khi chuyển đổi qua lại giữa các vai trò `student`, `teacher`, `recruiter`.
  * Chiều (13:00 - 17:00): Viết middleware điều hướng bảo vệ các routes (`ProtectedRoutes`) dựa trên vai trò lưu trong `users.role`.
* **Kinh nghiệm rút ra:** Thiết kế Single-Layout giúp mã nguồn gọn gàng, giảm thiểu re-render không cần thiết cho Sidebar.

### 🔴 Thứ 6 (25/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Refactor Codebase, đồng bộ Type Definitions & Kiểm thử trạng thái UI Sinh Viên.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Rà soát toàn bộ code, đồng bộ định nghĩa kiểu dữ liệu trong `types/database.ts` và xử lý 100% cảnh báo ESLint.
  * Chiều (13:00 - 17:00): Bổ sung các thông báo Toast Notification và cập nhật loading skeletons, empty states phản hồi mượt mà cho Module Sinh Viên.
* **Kinh nghiệm rút ra:** Giữ mã nguồn sạch sẽ và hoàn thiện UI states trước khi chuyển sang giai đoạn phát triển các tính năng nâng cao.

---

## 📅 TUẦN 2: HỆ THỐNG XÁC THỰC GIẢNG VIÊN, PUBLIC PORTAL & RECRUITER TALENT PORTAL (26/09/2026 – 03/10/2026)

### 🔵 Thứ 7 (26/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Phát triển Portal Hộp Thư Giảng Viên (`pages/teacher/VerificationInbox.tsx`).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng giao diện Hộp thư duyệt đồ án cho Giảng viên, chia các tab trạng thái: Chờ duyệt (Pending), Đã duyệt (Verified), Cần sửa (Rejected).
  * Chiều (13:00 - 17:00): Lập trình bộ lọc bảo mật định danh strict: Chỉ hiển thị các đồ án sinh viên gửi đích danh cho Email/Tên của Giảng viên đó.
* **Kinh nghiệm rút ra:** Phân quyền lọc dữ liệu ở cấp độ Query Supabase giúp nâng cao tính riêng tư và bảo mật dữ liệu môn học.

### 🔵 Thứ 2 (28/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng Modal Đánh Giá đồ án & Thuật toán Sinh Mã Bảo Chứng Hash.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển Form Modal cho Giảng viên nhập điểm số (`score`), lời nhận xét chi tiết (`teacher_feedback`) và bấm Phê duyệt/Từ chối.
  * Chiều (13:00 - 17:00): Tích hợp tính năng tự động sinh mã xác thực `verification_code` (dạng `PH-VER-XXXXXX`) và chuỗi Hash bảo mật cryptographic (`verification_hash`) khi đồ án được duyệt.
* **Kinh nghiệm rút ra:** Sử dụng thuật toán băm (Hash) giúp bảo chứng tính toàn vẹn của đồ án, tránh việc sinh viên tự ý sửa thông tin sau khi đã được duyệt.

### 🔵 Thứ 3 (29/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Phát triển Component Verified Badge 🛡️ & Luồng Gửi Duyệt từ Sinh viên.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng component `VerifiedBadge.tsx` hiển thị huy hiệu xác thực màu xanh ngọc kèm tên Giảng viên hướng dẫn.
  * Chiều (13:00 - 17:00): Bổ sung nút "🛡️ Gửi Duyệt" trên giao diện Đồ án của Sinh viên, cho phép sinh viên chọn Giảng viên hướng dẫn và chuyển tới Hộp thư verification.
* **Kinh nghiệm rút ra:** Giao diện phản hồi trạng thái minh bạch giúp sinh viên dễ dàng theo dõi tiến độ phê duyệt đồ án môn học.

### 🔵 Thứ 4 (30/09/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Phát triển Cổng Tra Cứu Xác Thực Công Khai (`/verify/:verificationCode`).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Đăng ký public route độc lập không chứa Sidebar/Navigation bar để phục vụ truy cập ngoài không cần đăng nhập.
  * Chiều (13:00 - 17:00): Xây dựng giao diện `PublicVerificationView.tsx` hiển thị thông tin đồ án, Giảng viên duyệt, con dấu Verified Badge và mã Hash; đồng thời thiết lập RLS ẩn hoàn toàn GPA và SĐT/Email cá nhân.
* **Kinh nghiệm rút ra:** Bảo vệ ranh giới dữ liệu riêng tư (Privacy Boundary) là yếu tố bắt buộc khi thiết kế các trang web tra cứu công khai.

### 🔵 Thứ 5 (01/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Phát triển Component Xuất Mã QR Xác Thực (`ProjectQRCodeModal.tsx`).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tích hợp thư viện `qrcode.react` để tự động mã hóa đường dẫn công khai `https://profilehub.vn/verify/PH-VER-XXXXXX` thành mã QR Code.
  * Chiều (13:00 - 17:00): Bổ sung tính năng cho phép sinh viên tải ảnh mã QR (PNG) về máy để dán vào CV PDF hoặc Slide bảo vệ đồ án.
* **Kinh nghiệm rút ra:** Kết hợp biến môi trường (`VITE_APP_URL`) giúp đường dẫn QR tự động thích ứng chuẩn xác từ môi trường Localhost sang Production.

### 🔵 Thứ 6 (02/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng Recruiter Talent Portal (`pages/recruiter/CandidateSearch.tsx`).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế giao diện tìm kiếm ứng viên thông minh dành cho HR/Recruiter, hỗ trợ lọc theo Trường, Chuyên ngành, Kỹ năng và Đồ án Verified.
  * Chiều (13:00 - 17:00): Xây dựng thuật toán xếp hạng ứng viên dựa trên bằng chứng (Evidence-Based Match Engine), ưu tiên hiển thị sinh viên có đồ án xác thực bởi Giảng viên.
* **Kinh nghiệm rút ra:** Lọc ứng viên theo bằng chứng sản phẩm thực tế giúp Nhà tuyển dụng đánh giá đúng năng lực nhân sự trẻ.

### 🔵 Thứ 7 (03/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Xây dựng Bảng Kanban Tuyển Dụng & Recruiter Feedback Loop.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế bảng Kanban 5 cột tiến trình tuyển dụng (`CandidatePipeline.tsx`) với tính năng kéo thả luân chuyển hồ sơ ứng viên.
  * Chiều (13:00 - 17:00): Phát triển Modal Phản hồi Phỏng vấn (`RecruiterFeedbackModal.tsx`), kết nối dữ liệu Email/Doanh nghiệp thật trên Supabase gửi nhận xét & thẻ Knowledge Blind Spots cho Sinh viên.
* **Kinh nghiệm rút ra:** Vòng lặp phản hồi phỏng vấn minh bạch từ HR giúp sinh viên nhận biết chính xác điểm yếu để hoàn thiện bản thân.

---

## 📅 TUẦN 3: TÍCH HỢP AI ENGINE, KIỂM THỬ TOÀN DIỆN, DEPLOYMENT & BÁO CÁO (05/10/2026 – 10/10/2026)

### 🟢 Thứ 2 (05/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Tích hợp AI CV Builder & Tính Năng Xuất CV PDF In Chuẩn A4.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng `aiCvService.ts` bóc tách JD, tính điểm phù hợp (Match Score 40-99%) và thiết kế 4 mẫu giao diện CV với Live Preview A4 (`CVBuilder.tsx`).
  * Chiều (13:00 - 17:00): Tích hợp thư viện `react-to-print` kết hợp CSS `@media print` ẩn bộ điều hướng, xuất file PDF in ấn sắc nét không vỡ lề.
* **Kinh nghiệm rút ra:** Tự động hóa đề xuất nội dung CV dựa trên đồ án Verified giúp sinh viên tạo CV chuẩn ấn tượng trong thời gian ngắn.

### 🟢 Thứ 3 (06/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Phát triển Module Luyện Phỏng Vấn AI Cá Nhân Hóa (`AIInterviewPrep.tsx`).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Lập trình 3 chế độ phỏng vấn: Ngân hàng câu hỏi ngành, AI sinh câu hỏi tình huống cá nhân hóa theo Đồ án Verified & JD.
  * Chiều (13:00 - 17:00): Phát triển bộ chấm điểm câu trả lời sinh viên (Thang điểm 100), phân tích chi tiết điểm mạnh và khuyến nghị cải thiện.
* **Kinh nghiệm rút ra:** Luyện tập phỏng vấn với AI hỗ trợ sinh viên rèn tư duy trả lời câu hỏi kỹ thuật bài bản trước khi làm việc với nhà tuyển dụng.

### 🟢 Thứ 4 (07/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Widget AI Gợi Ý Đồ Án & Bộ Xuất Tài Liệu 1-Click Markdown Spec.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Lập trình `AIProjectRecommenderWidget.tsx` tự động phân tích "Điểm mù kiến thức" từ phỏng vấn/feedback để gợi ý đề tài đồ án mới kèm Tech Stack & Backlog.
  * Chiều (13:00 - 17:00): Viết module `markdownExporter.ts` đóng gói kết quả gợi ý thành file `README-spec.md` chuẩn GitHub Markdown cho sinh viên tải về.
* **Kinh nghiệm rút ra:** Chuyển đổi phản hồi của AI thành file tài liệu Markdown giúp sinh viên dễ dàng đưa vào quy trình làm việc thực tế với Git.

### 🟢 Thứ 5 (08/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Thực hiện Vòng Kiểm Thử TDD & Browser Testing (QA).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Viết bộ test tự động [verificationService.test.ts](file:///C:/Users/ADMIN/Desktop/STUDY/PROFILEHUB/portfolio-web/src/services/verificationService.test.ts) và [markdownExporter.test.ts](file:///C:/Users/ADMIN/Desktop/STUDY/PROFILEHUB/portfolio-web/src/utils/markdownExporter.test.ts) kiểm thử logic sinh mã Hash và xuất Markdown.
  * Chiều (13:00 - 17:00): Kiểm thử trình duyệt thực tế trên Chrome, Edge, Firefox, Safari và tối ưu hóa Responsive cho thiết bị di động/tablet.
* **Kinh nghiệm rút ra:** Thực hiện unit tests tại các seam quan trọng đảm bảo hệ thống vận hành ổn định và không phát sinh lỗi tiềm ẩn.

### 🟢 Thứ 6 (09/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Kiểm Tra Biên Dịch TypeScript Strict & Tối Ưu Hiệu Năng Đóng Gói (Build).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Chạy lệnh kiểm tra typecheck strict `npx tsc -b`, sửa triệt để các cảnh báo kiểu dữ liệu còn tồn đọng.
  * Chiều (13:00 - 17:00): Thực thi `npm run build` đóng gói bundle ứng dụng, tối ưu kích thước file JS/CSS và verified 0 lỗi build.
* **Kinh nghiệm rút ra:** Đảm bảo quá trình biên dịch luôn đạt trạng thái Green Build giúp tự tin triển khai ứng dụng lên môi trường Production.

### 🟢 Thứ 7 (10/10/2026)
* **Thời gian:** 08:30 – 17:00
* **Công việc được giao:** Triển Khai Sản Phẩm (Deployment) & Hoàn Tất Báo Cáo Thực Tập Tốt Nghiệp.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Triển khai thành công ứng dụng lên Vercel / Cloudflare Pages, thiết lập domain công khai & biến môi trường `VITE_APP_URL`.
  * Chiều (13:00 - 17:00): Đóng gói tài liệu dự án (`README.md`, `system-design-spec.md`), nghiệm thu 100% mục tiêu thực tập tốt nghiệp và hoàn thiện Sổ Nhật Ký 3 Tuần.
* **Kinh nghiệm rút ra:** Đạt trải nghiệm thực tế trọn vẹn trong việc xây dựng sản phẩm Web Enterprise từ khâu phân tích, CSDL, Full-stack UI/UX, tích hợp AI đến đóng gói triển khai Cloud.

---

### ✍️ ĐÁNH GIÁ CHUNG CỦA SINH VIÊN VỀ QUÁ TRÌNH THỰC TẬP
* Trong 3 tuần thực tập cô đọng và giàu hiệu suất tại **CÔNG TY TNHH ALPACA SOLUTIONS**, em đã hoàn thành 100% mục tiêu phát triển hệ thống **PROFILEHUB / UNIPORTFOLIO**.
* Lộ trình 3 tuần được thiết kế chặt chẽ, loại bỏ hoàn toàn các khoảng thời gian trống, tập trung giải quyết trọn vẹn 3 trụ cột giá trị: **Academic Verification**, **Evidence-Based Matching** và **AI Career Guidance Engine**.
* Qua dự án, em đã làm chủ các công nghệ hiện đại: **React 18, TypeScript, Supabase PostgreSQL & Auth/Storage, Gemini AI Engine**, đồng thời nâng cao tư duy thiết kế phần mềm doanh nghiệp và quy trình làm việc chuẩn nghiệp nghiệp.
