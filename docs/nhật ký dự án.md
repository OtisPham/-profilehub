# 📓 NHẬT KÝ DỰ ÁN PROFILEHUB
### HỆ THỐNG QUẢN LÝ HỒ SƠ & TẠO CV ĐỊNH HƯỚNG DỰ ÁN BẰNG AI (PROJECT-DRIVEN AI CV BUILDER)

* **Họ và tên sinh viên:** PHẠM THÁI BẢO
* **Mã số sinh viên:** 22114919
* **Ngành:** CÔNG NGHỆ THÔNG TIN
* **Đơn vị thực tập:** CÔNG TY TNHH ALPACA SOLUTIONS
* **Dự án thực hiện:** PROFILEHUB - Project-Driven AI CV Builder & Portfolio Platform
* **Thời gian ghi nhật ký:** 21/09/2026 – 20/11/2026 (4 tuần đầu làm Thứ Hai đến Thứ Bảy; từ tuần 5 chỉ làm Thứ Hai đến Thứ Sáu)

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
4. **Tối ưu hiệu suất, Bảo mật & Vận hành Sprint liên tục (Tuần 8 – Tuần 9):**
   - Tối ưu hóa hiệu năng chuyên sâu: Caching (Redis + IndexedDB), Service Worker offline cache, Bundle Splitting (giảm từ 1.2MB xuống 280KB Gzip).
   - Kiểm thử toàn diện: Unit Test & Integration Test (Vitest 100% pass), End-to-End Test (Playwright).
   - Tích hợp Sentry giám sát lỗi thời gian thực, duy trì họp Sprint Review định kỳ với Mentor doanh nghiệp để liên tục mở rộng sản phẩm (kỳ thực tập tiếp tục diễn ra theo kế hoạch).

---

## 📅 TUẦN 1: KHẢO SÁT, THIẾT KẾ CSDL & MODULE HỒ SƠ DỰ ÁN CỐT LÕI (21/09/2026 – 26/09/2026)

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
* **Công việc được giao:** Dựng khung hiển thị tương tác WYSIWYG trên Canvas A4 và cơ chế render linh hoạt.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích thông số kỹ thuật in ấn: A4 Portrait ở độ phân giải 96 DPI (chiều cao 1122.5px), tính toán khoảng cách dòng, lề trang tiêu chuẩn.
  * Chiều (13:00 - 17:00): Phát triển InteractiveCVCanvas.tsx hỗ trợ chỉnh sửa inline trên từng dòng text, cập nhật state tức thì khi người dùng gõ phím.
* **Kinh nghiệm rút ra:** Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF.

### 🔴 Thứ 7 (26/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Viết các hàm đồng bộ trong cvService.ts kết nối với bảng student_cvs trên Supabase để tự động lưu trạng thái CV.
  * Chiều (13:00 - 17:00): Thiết lập bộ đệm LocalStorage lưu trữ tạm thời phiên soạn thảo, chống mất dữ liệu khi mất mạng hoặc reload trang đột ngột.
* **Kinh nghiệm rút ra:** Cơ chế Fallback hai lớp (Cloud + LocalStorage) giúp ứng viên an tâm tuyệt đối khi thao tác soạn thảo nội dung dài.

## 📅 TUẦN 2: MODULE TẠO CV DỰ ÁN, CHATBOT NLP THỰC CHIẾN & KHẢO SÁT PHỎNG VẤN (28/09/2026 – 03/10/2026)

### 🔴 Thứ 2 (28/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Họp Review tiến độ tuần 1, đánh giá kiến trúc hệ thống & Lập kế hoạch tinh gọn (Lean MVP).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Đo lường tài nguyên hệ thống, họp kỹ thuật với Tech Lead và thống nhất chiến lược "Lean MVP": Cắt giảm ngay các tính năng ngoài lề để dồn sức cho giá trị cốt lõi.
  * Chiều (13:00 - 17:00): Rà soát toàn bộ cây thư mục mã nguồn, lập danh sách các module dư thừa cần loại bỏ để tối ưu hiệu năng và tinh giản trải nghiệm.
* **Kinh nghiệm rút ra:** Dũng cảm cắt bỏ tính năng không hiệu quả sớm giúp bảo toàn nguồn lực phát triển cho các tính năng thực sự tạo ra giá trị.

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
* **Công việc được giao:** [CẮT BỎ] Xóa bỏ Trình mô phỏng phỏng vấn bằng Chatbot & Chuẩn bị tích hợp Voice AI thực chiến.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Gỡ bỏ interviewCoachService.ts (dạng chatbot text đơn giản, thiếu tương tác thực tế) và xóa bỏ các view phỏng vấn tĩnh.
  * Chiều (13:00 - 17:00): Lập kiến trúc cho mô phỏng phỏng vấn kỹ thuật bám sát trực tiếp vào đồ án và các câu hỏi xoáy chuyên môn thay vì chat vu vơ.
* **Kinh nghiệm rút ra:** Luyện phỏng vấn bằng chatbot gõ chữ không mô phỏng được áp lực thực tế trong phòng phỏng vấn kỹ thuật.

### 🔴 Thứ 6 (02/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng tính năng Gợi ý hoàn thiện mô tả kỹ năng bằng AI (Skill Coach).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế giao diện gợi ý kỹ năng theo vị trí công việc (Frontend, Backend, Fullstack), đối soát với bộ từ điển công nghệ chuẩn.
  * Chiều (13:00 - 17:00): Viết logic đề xuất kỹ năng còn thiếu dựa trên mục tiêu nghề nghiệp của sinh viên, hỗ trợ thêm nhanh vào CV 1-click.
* **Kinh nghiệm rút ra:** Đề xuất kỹ năng trúng đích giúp hồ sơ ứng viên nổi bật hơn trước bộ lọc tự động của nhà tuyển dụng.

### 🔴 Thứ 7 (03/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tối ưu hóa Single-Layout & Dọn sạch Router toàn hệ thống.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Refactor lại MainLayout.tsx và Sidebar.tsx, gỡ bỏ các route mồ côi (dead routes) sau khi cắt bỏ các module thừa.
  * Chiều (13:00 - 17:00): Kiểm tra lại toàn bộ liên kết nội bộ, đảm bảo chuyển trang mượt mà không có lỗi 404 hoặc warning console.
* **Kinh nghiệm rút ra:** Tinh gọn thanh điều hướng giúp người dùng tập trung tối đa vào các thao tác chính.

## 📅 TUẦN 3: MODULE GIẢNG VIÊN ĐÁNH GIÁ, CỔNG CHỨNG THỰC & KHẢO SÁT PHẢN HỒI (05/10/2026 – 10/10/2026)

### 🔴 Thứ 2 (05/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Trụ Cột 1: Cơ chế Đề xuất & Xếp hạng Ứng viên Dựa Trên Bằng Chứng (Evidence-Based Matching).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng thuật toán tính điểm khớp nối kỹ thuật (Match Score 0-100%) giữa bộ kỹ năng của sinh viên với Job Description (JD).
  * Chiều (13:00 - 17:00): Thiết kế giao diện thẻ ứng viên hiển thị huy hiệu xếp hạng, thanh đo % Match và các chip kỹ năng nổi bật.
* **Kinh nghiệm rút ra:** Định lượng mức độ tương thích kỹ năng giúp nhà tuyển dụng rút ngắn 70% thời gian duyệt hồ sơ ban đầu.

### 🔴 Thứ 3 (06/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tích hợp Modal Chi Tiết Khớp Nối (Match Detail Modal) & Soi Chi Tiết Dự Án.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển MatchDetailModal.tsx phân tích sâu: Kỹ năng trùng khớp hoàn toàn, kỹ năng tương đương và kỹ năng còn thiếu.
  * Chiều (13:00 - 17:00): Bổ sung danh sách các đồ án liên quan trực tiếp đến yêu cầu của JD, hỗ trợ mở xem chi tiết bằng chứng đồ án ngay trên modal.
* **Kinh nghiệm rút ra:** Minh bạch hóa lý do đề xuất giúp tăng mức độ tin cậy của thuật toán gợi ý trong mắt nhà tuyển dụng.

### 🔴 Thứ 4 (07/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Bộ Lọc Ứng Viên Đa Chiều Cho Nhà Tuyển Dụng (Candidate Filter).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế bộ lọc kết hợp: Lọc theo vị trí (Frontend, Backend, DevOps, Data), lọc theo điểm Match tối thiểu và lọc theo công nghệ bắt buộc.
  * Chiều (13:00 - 17:00): Tối ưu hóa truy vấn CSDL Supabase với bộ lọc kết hợp, đảm bảo thời gian trả lời truy vấn dưới 100ms trên tập dữ liệu mẫu.
* **Kinh nghiệm rút ra:** Xây dựng bộ lọc đa chiều ngay từ tầng CSDL giúp giảm tải xử lý dữ liệu cho phía client-side.

### 🔴 Thứ 5 (08/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Khảo sát và rà soát cơ chế Giảng viên xác thực (Teacher Verification) trên thực tế.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khảo sát thực nghiệm quy trình giảng viên chấm điểm và xác thực đồ án cho sinh viên trên hệ thống.
  * Chiều (13:00 - 17:00): Phát hiện nút thắt cổ chai nghiêm trọng: Giảng viên bận rộn không kịp phê duyệt khiến đồ án của sinh viên bị treo trạng thái "Pending Verification" hàng tuần.
* **Kinh nghiệm rút ra:** Các tính năng phụ thuộc vào sự phê duyệt thủ công của bên thứ ba thường gây ra điểm nghẽn nghiêm trọng cho luồng sản phẩm.

### 🔴 Thứ 6 (09/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Khảo sát phản hồi sinh viên và chuẩn bị bước chuyển kiến trúc (Pivot sang Evidence-Based).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tổng hợp phản hồi thực tế từ 15 sinh viên dùng thử; ghi nhận 85% gặp tắc nghẽn do giảng viên bận chấm đồ án.
  * Chiều (13:00 - 17:00): Họp nội bộ với Mentor công ty, phân tích nguyên nhân gốc rễ và thống nhất chuẩn bị chuyển đổi từ "Giảng viên xác thực" sang "Bằng chứng thực chiến (Evidence-Based)".
* **Kinh nghiệm rút ra:** Luôn lắng nghe phản hồi của người dùng thực tế; không bảo thủ giữ lại tính năng tạo ra nút thắt cổ chai.

### 🔴 Thứ 7 (10/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Kiểm thử toàn diện các tầng dịch vụ cốt lõi (TDD Green Check) & Typecheck.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Chạy 5 test suites ban đầu: aiCvService.test.ts, cvManagement.test.ts, aiCvGeneration.test.ts, aiCvCoachService.test.ts, markdownExporter.test.ts. Đạt 20/20 tests pass 100%.
  * Chiều (13:00 - 17:00): Kiểm tra npm run build, xác nhận TypeScript biên dịch không lỗi và hệ thống hoàn toàn sẵn sàng cho tuần cao điểm phát triển tính năng mới.
* **Kinh nghiệm rút ra:** TDD mang lại sự tự tin tuyệt đối trước khi bước vào giai đoạn thiết kế tính năng mới.

## 📅 TUẦN 4: TÁI THIẾT KẾ KIẾN TRÚC (PIVOT), CẮT BỎ OVER-ENGINEERING & TRIỂN KHAI 6 TRACER-BULLET TICKETS (12/10/2026 – 17/10/2026)

### 🔴 Thứ 2 (12/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Ban hành Quyết định Kiến trúc ADR 0001: Pivot sang Nền tảng CV Định Hướng Đồ Án.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Soạn thảo và ban hành tài liệu Architecture Decision Record ADR 0001 tại docs/adr/0001-project-driven-cv-builder.md.
  * Chiều (13:00 - 17:00): [CẮT BỎ] Xóa sổ toàn bộ TeacherVerificationView.tsx, teacherVerificationService.ts và trường is_verified; dồn 100% tài nguyên sang bằng chứng thực chiến.
* **Kinh nghiệm rút ra:** Thay thế dấu xác nhận hành chính bằng bằng chứng khách quan (mã nguồn, sản phẩm chạy thật) là tư duy chuẩn mực của ngành phần mềm hiện đại.

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

### 🔴 Thứ 7 (17/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hiện thực hóa Ticket 05 (Page-Budget Guard & Layout Switcher) & Ticket 06 (Evidence Showcase & QR).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng pageBudgetService đo chiều cao render so với khổ A4, hiển thị huy hiệu 📊 XX% A4 trên toolbar. Phát triển 1-Click AI Auto-Condense co vừa 1 trang A4. Bổ sung nút chuyển bố cục 1 cột và 2 cột. Viết test (3/3 pass).
  * Chiều (13:00 - 17:00): Render link Live Demo và GitHub Repo chuẩn ATS. Tích hợp qrcode.react tự động sinh mã QR thu nhỏ 28px in trên A4 quét demo sản phẩm. Viết test (3/3 pass). Lắp ráp hoàn chỉnh vào CVBuilder.tsx và Canvas.
* **Kinh nghiệm rút ra:** Đảm bảo CV vừa vặn đúng 1 trang A4 và có mã QR quét demo là hai yếu tố ghi điểm cực mạnh trong mắt các nhà tuyển dụng thực tế.

## 📅 TUẦN 5: MỞ RỘNG TÍNH NĂNG NÂNG CAO — STAR DIAGNOSTIC ENGINE & ATS EYE-VIEW HEATMAP (19/10/2026 – 23/10/2026)

### 🔴 Thứ 2 (19/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Rà soát hoàn thiện ProfileHub v1, tổng kết 6 tickets và khởi động nghiên cứu Trụ cột 2 & 3.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Rà soát micro-interactions, phím tắt Ctrl + S/P/B, chạy toàn bộ 11/11 test suites (38/38 tests pass 100%) và đóng gói npm run build sạch sẽ, nghiệm thu bàn giao ProfileHub v1.
  * Chiều (13:00 - 17:00): Khởi động nghiên cứu kiến trúc mở rộng: Contextual Application Pitch (thay thế Cover Letter truyền thống) và Project Technical Defense Briefing.
* **Kinh nghiệm rút ra:** Quy trình đóng gói nghiệm thu định kỳ giúp kiểm soát chất lượng phần mềm chặt chẽ và tạo đà cho các tính năng mở rộng tiếp theo.

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
* **Công việc được giao:** Nghiên cứu và thiết kế mô phỏng góc nhìn ATS (ATS Eye-View Heatmap).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khảo sát nguyên lý hoạt động của các hệ thống Applicant Tracking System (ATS) phổ biến và hành vi quét mắt (F-pattern scan) của nhà tuyển dụng.
  * Chiều (13:00 - 17:00): Thiết kế kiến trúc module atsHeatmapService.ts phân tích mật độ phân bổ từ khóa kỹ thuật và tỷ lệ phủ nội dung theo từng vùng thị giác trên CV.
* **Kinh nghiệm rút ra:** Hiểu rõ cơ chế chấm điểm của ATS giúp định hình chính xác các vùng không gian chiến lược trên bản CV.

### 🔴 Thứ 3 (27/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng ATS Heatmap Visualizer & Thống kê từ khóa kỹ thuật.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển component AtsHeatmapOverlay.tsx vẽ bản đồ nhiệt trực quan (đỏ - vàng - xanh) đè lên bản vẽ Canvas A4.
  * Chiều (13:00 - 17:00): Bổ sung bảng thống kê Keyword Frequency, cảnh báo nguy cơ keyword stuffing hoặc thiếu hụt kỹ năng cốt lõi so với JD mục tiêu.
* **Kinh nghiệm rút ra:** Biểu diễn trực quan bằng Heatmap trực tiếp trên Canvas giúp sinh viên dễ dàng nhận diện điểm yếu trong bố cục CV hơn là các con số khô khan.

### 🔴 Thứ 4 (28/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Phát triển Module Interview War Room & Trình mô phỏng phỏng vấn âm thanh.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế giao diện phòng luyện phỏng vấn kỹ thuật InterviewWarRoom.tsx với đồng hồ đếm ngược và trạng thái micro.
  * Chiều (13:00 - 17:00): Tích hợp Web Speech API (Speech-to-Text) thu âm câu trả lời của ứng viên, tự động chuyển thành văn bản để phân tích cấu trúc phản biện STAR.
* **Kinh nghiệm rút ra:** Luyện nói thành tiếng trước micro giúp ứng viên rèn luyện phản xạ nhanh và sự lưu loát trước khi bước vào phỏng vấn thực chiến.

### 🔴 Thứ 5 (29/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tích hợp tính năng Khảo sát dải lương thị trường theo thời gian thực (Salary Benchmark).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng cơ sở dữ liệu dải lương thị trường IT Việt Nam phân theo Level (Intern, Fresher, Junior) và theo Tech Stack (React, Node.js, Golang, Python).
  * Chiều (13:00 - 17:00): Xây dựng SalaryBenchmarkWidget.tsx hiển thị biểu đồ dải lương p25, p50, p75 và gợi ý mức lương kỳ vọng phù hợp với năng lực dự án thực tế.
* **Kinh nghiệm rút ra:** Cung cấp số liệu lương thực tế giúp sinh viên CNTT tự tin hơn trong vòng đàm phán đãi ngộ với nhà tuyển dụng.

### 🔴 Thứ 6 (30/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Module Quản lý Đa Phiên Bản CV (Multi-Version CVs) & Tối ưu hiệu năng.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Mở rộng lược đồ CSDL cho phép một sinh viên tạo và quản lý nhiều bản CV may đo riêng cho từng vị trí ứng tuyển (Frontend CV, Backend CV, Fullstack CV).
  * Chiều (13:00 - 17:00): Phát triển giao diện quản lý phiên bản CV dạng lưới thẻ, hỗ trợ nhân bản (clone), gắn nhãn trạng thái và kiểm tra hiệu năng đóng gói hoàn tất tuần 6.
* **Kinh nghiệm rút ra:** May đo CV riêng cho từng vị trí tuyển dụng làm tăng cơ hội được mời phỏng vấn lên gấp 3 lần so với việc dùng một bản CV chung cho mọi công ty.

## 📅 TUẦN 7: APPLICATION TRACKER, COVER LETTER GENERATOR & REVERSE RECRUITING HUB (02/11/2026 – 06/11/2026)

### 🔴 Thứ 2 (02/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Thiết kế và xây dựng Application Tracker dạng bảng Kanban.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khảo sát nhu cầu theo dõi tiến trình nộp đơn của sinh viên, thiết kế luồng trạng thái 5 cột: Wishlist -> Applied -> Interviewing -> Offer -> Rejected.
  * Chiều (13:00 - 17:00): Xây dựng component ApplicationKanbanBoard.tsx với khả năng kéo thả card linh hoạt và lưu trạng thái ứng tuyển tức thì vào CSDL Supabase.
* **Kinh nghiệm rút ra:** Giao diện Kanban giúp sinh viên quản lý lộ trình tìm việc một cách trực quan, tránh tình trạng quên lịch phỏng vấn hoặc gửi trùng lặp hồ sơ.

### 🔴 Thứ 3 (03/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tích hợp AI Cover Letter & Email Generator may đo theo từng thẻ Kanban.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng modal CoverLetterGeneratorModal.tsx: Tự động trích xuất thông tin công ty, vị trí ứng tuyển từ thẻ Kanban để may đo nội dung thư.
  * Chiều (13:00 - 17:00): Tích hợp tính năng 1-Click Copy và tạo mẫu thư gửi kèm CV (Follow-up email, Thank-you email sau phỏng vấn), viết bài kiểm thử TDD pass 100%.
* **Kinh nghiệm rút ra:** Cung cấp sẵn các mẫu thư chuyên nghiệp giúp ứng viên duy trì sự chuẩn mực trong giao tiếp với bộ phận tuyển dụng của doanh nghiệp.

### 🔴 Thứ 4 (04/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Reverse Recruiting Hub (Cổng kết nối nhà tuyển dụng chủ động).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế giao diện cho nhà tuyển dụng chủ động duyệt kho hồ sơ đồ án sinh viên (Public Talent Pool) với tính năng ẩn thông tin cá nhân (Blind Screening).
  * Chiều (13:00 - 17:00): Phát triển cơ chế gửi lời mời phỏng vấn trực tiếp (Direct Invite) từ HR đến sinh viên thông qua hệ thống thông báo nội bộ.
* **Kinh nghiệm rút ra:** Mô hình tuyển dụng đảo ngược (Reverse Recruiting) giúp sinh viên có năng lực thực chất được các công ty săn đón mà không cần nộp đơn thụ động.

### 🔴 Thứ 5 (05/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hoàn thiện cơ chế phân quyền RBAC và bảo mật hồ sơ ứng viên.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình Row Level Security (RLS) nâng cao cho các bảng liên quan đến Application Tracker và Public Talent Pool.
  * Chiều (13:00 - 17:00): Phát triển tính năng cho phép sinh viên bật/tắt chế độ "Mở cơ hội việc làm" (Open to Work) và ẩn CV khỏi các công ty chỉ định.
* **Kinh nghiệm rút ra:** Tôn trọng quyền riêng tư và bảo mật thông tin là yếu tố tiên quyết để người dùng tin tưởng sử dụng nền tảng dài lâu.

### 🔴 Thứ 6 (06/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Viết Unit Test & Tích hợp E2E cho Module Application Tracker.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Viết bộ kiểm thử đơn vị cho applicationTrackerService.ts và coverLetterService.ts, đạt 100% test coverage trên các hàm cốt lõi.
  * Chiều (13:00 - 17:00): Kiểm thử luồng người dùng toàn trình: Từ tạo thẻ Kanban, sinh thư ứng tuyển, cập nhật trạng thái đến lưu trữ lịch sử phỏng vấn, kiểm tra build sạch.
* **Kinh nghiệm rút ra:** Gom việc kiểm thử đơn vị và tích hợp luồng vào ngày thứ 6 giúp xác nhận độ tin cậy tuyệt đối của tính năng trước khi bước sang tuần tối ưu sâu.

## 📅 TUẦN 8: ADVANCED CACHING, HYDRATION OPTIMIZATION, E2E TESTING & SECURITY AUDIT (09/11/2026 – 13/11/2026)

### 🔴 Thứ 2 (09/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Thiết kế và triển khai cơ chế Caching đa tầng (Redis + IndexedDB).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích các điểm nghẽn truy vấn: Các truy vấn lấy chi tiết đồ án và bộ từ điển công nghệ bị lặp lại nhiều lần gây tải cho CSDL Supabase.
  * Chiều (13:00 - 17:00): Cấu hình Redis cache ở tầng API và thiết lập IndexedDB lưu trữ cục bộ phía client, giảm 80% số lượng request đọc CSDL thừa thãi.
* **Kinh nghiệm rút ra:** Kết hợp bộ nhớ đệm client-side (IndexedDB) với server cache (Redis) mang lại tốc độ phản hồi tức thì cho người dùng.

### 🔴 Thứ 3 (10/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tối ưu hóa Hydration và giảm thiểu độ trễ tải trang ban đầu.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích hiệu năng bằng Google Lighthouse trên trang CV Canvas: Ghi nhận cảnh báo về kích thước file JavaScript và thời gian tương tác TTI.
  * Chiều (13:00 - 17:00): Tối ưu hóa React lazy loading cho các modal nặng (StarDiffReviewModal, AtsHeatmapOverlay, InterviewWarRoom), đưa điểm Lighthouse Performance lên 96/100.
* **Kinh nghiệm rút ra:** Chia nhỏ mã nguồn (Code Splitting) theo từng modal giúp trang chủ tải nhanh vượt trội và tiết kiệm băng thông mạng.

### 🔴 Thứ 4 (11/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Viết kịch bản kiểm thử tự động toàn trình (E2E Test với Playwright).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình framework Playwright cho dự án, thiết lập các biến môi trường kiểm thử tách biệt với môi trường phát triển.
  * Chiều (13:00 - 17:00): Viết 3 kịch bản E2E kiểm thử tự động: (1) Luồng sinh viên tạo CV và Reverse Sync, (2) Luồng soi CV chuẩn STAR, (3) Luồng kéo thả Kanban và sinh Cover Letter.
* **Kinh nghiệm rút ra:** Kiểm thử tự động E2E giúp phát hiện sớm các lỗi hồi quy giao diện mà kiểm thử đơn vị thông thường không bao quát được.

### 🔴 Thứ 5 (12/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Rà soát bảo mật toàn diện (Security Audit) & Vá các lỗ hổng OWASP.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thực hiện rà soát bảo mật mã nguồn theo danh mục OWASP Top 10: Kiểm tra nguy cơ SQL Injection, Cross-Site Scripting (XSS) và Broken Access Control.
  * Chiều (13:00 - 17:00): Áp dụng DOMPurify làm sạch dữ liệu nhập từ người dùng trước khi render vào Canvas, cấu hình Content Security Policy (CSP) headers chặt chẽ.
* **Kinh nghiệm rút ra:** Làm sạch dữ liệu đầu vào và thiết lập CSP headers là lá chắn thiết yếu bảo vệ ứng dụng trước các cuộc tấn công mã độc.

### 🔴 Thứ 6 (13/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tối ưu hóa Bundle Size (Tree Shaking, Dynamic Import) & Kiểm thử tải.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích trực quan gói đóng gói (bundle visualizer), loại bỏ các thư viện phụ thuộc trùng lặp, tối ưu hóa import icon từ lucide-react.
  * Chiều (13:00 - 17:00): Giảm dung lượng file bundle chính từ 1.2MB xuống còn 280KB (Gzipped), thực hiện test tải cục bộ và xác nhận thời gian First Contentful Paint (FCP) < 0.8s.
* **Kinh nghiệm rút ra:** Gom việc tối ưu hóa bundle size và kiểm thử tốc độ tải vào ngày thứ 6 giúp chốt hạ tuần tăng tốc hiệu năng một cách mỹ mãn.

## 📅 TUẦN 9: TYPOGRAPHY STANDARDIZATION, HR INTEGRATION & SPRINT REVIEW ROADMAP (16/11/2026 – 20/11/2026)

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
* **Công việc được giao:** Tích hợp công cụ giám sát hiệu năng & lỗi ứng dụng (Sentry SDK) và thiết lập Alerting.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình Sentry SDK trên frontend React Vite, bắt unhandled exceptions và capture error boundary trên các component chính.
  * Chiều (13:00 - 17:00): Kiểm thử gửi test exception, cấu hình webhook nhận cảnh báo lỗi realtime qua kênh nội bộ khi người dùng gặp sự cố.
* **Kinh nghiệm rút ra:** Thiết lập hệ thống monitoring sớm giúp đội ngũ kỹ thuật chủ động nắm bắt lỗi người dùng thay vì chờ phản ánh gián tiếp.

### 🔴 Thứ 6 (20/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Họp định kỳ Sprint Review với Mentor doanh nghiệp, đánh giá Milestone 2 và lập kế hoạch kỹ thuật chặng tiếp theo.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Demo các tính năng hoàn thiện (ATS Heatmap, Interview War Room, Application Tracker) cho Mentor doanh nghiệp và tiếp nhận góp ý kỹ thuật.
  * Chiều (13:00 - 17:00): Cập nhật backlog kỹ thuật, phân chia các đầu việc mở rộng tiếp theo cho hệ thống ProfileHub và chuẩn bị kế hoạch phát triển cho tuần mới.
* **Kinh nghiệm rút ra:** Duy trì họp Sprint Review định kỳ với Mentor giúp nắm chắc định hướng sản phẩm thực tế và liên tục cải tiến chất lượng kỹ thuật trong suốt kỳ thực tập.

