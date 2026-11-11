# 📓 NHẬT KÝ DỰ ÁN PROFILEHUB
### HỆ THỐNG QUẢN LÝ HỒ SƠ & TẠO CV ĐỊNH HƯỚNG DỰ ÁN BẰNG AI (PROJECT-DRIVEN AI CV BUILDER)

* **Họ và tên sinh viên:** PHẠM THÁI BẢO
* **Mã số sinh viên:** 22114919
* **Ngành:** CÔNG NGHỆ THÔNG TIN
* **Đơn vị thực tập:** CÔNG TY TNHH ALPACA SOLUTIONS
* **Dự án thực hiện:** PROFILEHUB - Project-Driven AI CV Builder & Portfolio Platform
* **Thời gian ghi nhật ký:** 18/09/2026 – 20/11/2026 (Bắt đầu từ 18/09/2026; 4 tuần đầu có Thứ Bảy; từ tuần 5 chỉ làm Thứ Hai đến Thứ Sáu)

---

## 📌 TÓM TẮT ĐỊNH HƯỚNG CHIẾN LƯỢC & BƯỚC NGOẶT KIẾN TRÚC (PIVOT)
Trong 10 tuần phát triển dự án (18/09/2026 – 20/11/2026), **ProfileHub** đã trải qua các giai đoạn hoàn thiện vượt bậc với tốc độ phát triển cao (Vibe Coding):
1. **Khởi tạo và xây dựng nền tảng (Tuần 1 – Tuần 2):**
   - Khởi tạo kiến trúc dự án từ ngày 18/09/2026 với React 18, TypeScript (Strict Mode) và Supabase.
   - Xây dựng các module cốt lõi: Quản lý đồ án (MyProjects), Quản lý chứng chỉ (Certificates), tương tác Canvas WYSIWYG chuẩn A4.
2. **Dũng cảm cắt bỏ các tính năng rườm rà (Pruned Over-Engineering - Tuần 3):**
   - ❌ **Cắt bỏ Microservice Python Chatbot (`chatbot_service/`):** Chuyển toàn bộ logic khai phá từ khóa sang TypeScript native service trên 1 codebase duy nhất, loại bỏ hạ tầng triển khai cồng kềnh.
   - ❌ **Cắt bỏ Xác thực Giảng viên (`Teacher Verification` / `is_verified`):** Loại bỏ toàn bộ controller/route/view chấm điểm của giảng viên do tạo nút thắt cổ chai lớn trong thực tế. Thay thế bằng **Bằng chứng thực chiến (Evidence-Based)**: Link Live Demo, GitHub Repo và mã QR quét mở demo sản phẩm trực tiếp.
   - ❌ **Cắt bỏ Khảo sát MBTI & Chatbot phỏng vấn dài dòng:** Dồn 100% nguồn lực vào bài toán thực dụng: đưa dự án vào CV và tối ưu tương thích JD tuyển dụng.
3. **Hiện thực hóa Kiến trúc ADR 0001 & Bộ 6 Tracer-Bullet Tickets (Tuần 5):**
   - Hoàn thành trọn vẹn luồng **Project-Driven CV Builder**: Tách biệt dự án trong CV (`CV Project Instance`) và dự án gốc (`Master Project`), hỗ trợ Reverse Sync thông minh, Scoped Contribution (nhóm vs cá nhân), Project Fit Explainer xếp hạng theo JD, STAR Diff Review có kiểm định Anti-Hallucination, Page-Budget Guard đo lường khổ in A4 với 1-Click Auto-Condense, và Evidence Showcase QR.
4. **Mở rộng các Module nâng cao & Khớp nối thông minh (Tuần 6 – Tuần 8):**
   - **Contextual Application Pitch (ADR 0002) & Project Defense Briefing:** Luyện tập bảo vệ đồ án trước câu hỏi hóc búa của Tech Lead.
   - **STAR Diagnostic Engine & Rewrite:** Phân tích cấu trúc viên đạn theo phương pháp STAR, cung cấp gợi ý viết lại có số liệu định lượng.
   - **ATS Eye-View Heatmap & Interview War Room:** Mô phỏng góc nhìn hệ thống ATS (F-pattern scan) và phòng luyện phỏng vấn áp lực cao.
   - **Application Kanban Tracker & Candidate Pipeline Drag-Drop:** Quản lý vòng đời ứng tuyển với trải nghiệm kéo thả trực quan.
   - **Xác thực MST Doanh Nghiệp & Tích Xanh:** Chống mạo danh HR, đảm bảo môi trường tuyển dụng minh bạch.
   - **Smart Job Studio & Smart CV Parser:** Tự động trích xuất kỹ năng từ JD và CV tải lên, khớp nối ứng viên tức thì và tự động điền Master Profile.
   - **Multi-Theme PDF Styler:** Tùy biến theme và màu sắc xuất CV chuẩn in ấn A4 chuyên nghiệp.
5. **Cổng Offer Công Khai, Landing Page 3D & Mạng Xã Hội Nghề Nghiệp (Tuần 9 – Tuần 10):**
   - **Public Offer Portal & Executive Dossier Export:** Cổng nhận offer trực tuyến và xuất hồ sơ ứng viên chuyên sâu.
   - **Interactive 3D WebGL Crystal Hero & 3D Tilt Card:** Giao diện Landing Page tương tác 3D WebGL hiện đại.
   - **Career Community Feed (/feed):** Mạng xã hội chia sẻ đồ án và ứng tuyển nhanh từ bài đăng.
   - Tối ưu hóa hiệu năng chuyên sâu: Caching đa tầng (Redis + IndexedDB), Service Worker offline cache, Bundle Splitting (giảm xuống 280KB Gzip).
   - Kiểm thử toàn diện: Unit Test & Integration Test (Vitest 100% pass), End-to-End Test (Playwright), Sentry giám sát lỗi thời gian thực.
   - Duy trì họp Sprint Review định kỳ với Mentor doanh nghiệp để liên tục mở rộng sản phẩm (kỳ thực tập tiếp tục diễn ra theo kế hoạch).

---

## 📅 TUẦN 1: KHỞI TẠO DỰ ÁN, PHÂN TÍCH YÊU CẦU & THIẾT LẬP TECH STACK (18/09/2026 – 19/09/2026)

### 🔴 Thứ 6 (18/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Khảo sát toàn diện bài toán CV sinh viên IT & Lập kiến trúc tổng thể ProfileHub.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khảo sát thực trạng sinh viên gặp khó khi đưa đồ án vào CV; định hình 3 trụ cột sản phẩm: Project-Driven CV Builder, Evidence-Based Matching và AI Interview Coaching; lập sơ đồ WBS.
  * Chiều (13:00 - 17:00): Thiết kế kiến trúc hệ thống Client-Server, phân tích mô hình dữ liệu quan hệ trên PostgreSQL (Supabase) và lập tài liệu Product Discovery Requirements.
* **Kinh nghiệm rút ra:** Khảo sát kỹ bài toán thực tế ngay từ đầu giúp xác định đúng trọng tâm sản phẩm và tránh lãng phí thời gian xây dựng các tính năng ngoài lề.

### 🔴 Thứ 7 (19/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Khởi tạo Base Code, cấu hình TypeScript Strict, Supabase Auth & Storage.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khởi tạo repo React 18 + Vite + Tailwind CSS + Lucide Icons; cấu hình TypeScript ở chế độ Strict Mode cao nhất, thiết lập ESLint và Prettier.
  * Chiều (13:00 - 17:00): Kết nối Supabase SDK, cấu hình xác thực Auth, thiết lập Storage Bucket cho tệp đính kèm và kiểm tra kết nối CSDL thành công.
* **Kinh nghiệm rút ra:** Bật TypeScript Strict Mode ngay ngày đầu giúp loại bỏ 100% lỗi null/undefined tiềm ẩn và tăng tốc độ code về sau.

## 📅 TUẦN 2: THIẾT KẾ CSDL POSTGRESQL & MODULE HỒ SƠ DỰ ÁN CỐT LÕI (21/09/2026 – 26/09/2026)

### 🔴 Thứ 2 (21/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Thiết kế toàn diện CSDL PostgreSQL trên Supabase & Cấu hình bảo mật Row Level Security (RLS).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tạo lược đồ CSDL hoàn chỉnh: bảng users, student_profiles, projects, skills, certifications, student_cvs; thiết lập khóa ngoại và composite indexes.
  * Chiều (13:00 - 17:00): Viết chính sách RLS bảo mật phân quyền cho từng bảng, cấu hình Storage policies cho portfolio_files; viết script seed dữ liệu mẫu kiểm thử.
* **Kinh nghiệm rút ra:** Thiết lập RLS chuẩn mực ở tầng CSDL giúp bảo mật dữ liệu đa người dùng tuyệt đối mà không cần viết logic phức tạp ở frontend.

### 🔴 Thứ 3 (22/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng hoàn chỉnh Module Quản lý Đồ Án (MyProjects) & Quản lý Chứng Chỉ (Certificates).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển giao diện MyProjects.tsx dạng lưới thẻ chuyên nghiệp, modal thêm/sửa đồ án hỗ trợ Live Demo, GitHub Repo URL, tài liệu PDF và gắn tags công nghệ.
  * Chiều (13:00 - 17:00): Xây dựng Module Certificates.tsx lưu trữ chứng chỉ, tính năng đánh dấu nổi bật (is_featured), kéo-thả upload file và In-App Document Reader xem trước PDF nội tuyến.
* **Kinh nghiệm rút ra:** Gom việc phát triển các module hồ sơ liên quan vào một ngày giúp tái sử dụng component modal và đồng bộ trải nghiệm người dùng.

### 🔴 Thứ 4 (23/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Canvas WYSIWYG chuẩn A4 & Bộ đệm lưu trữ hai lớp (Cloud + LocalStorage).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế InteractiveCVCanvas.tsx chuẩn khổ A4 Portrait (96 DPI, 1122.5px); phát triển cơ chế chỉnh sửa inline trên từng dòng text, cập nhật state tức thì.
  * Chiều (13:00 - 17:00): Xây dựng cơ chế lưu trữ hai lớp: cvService.ts tự động sync lên Supabase và LocalStorage Fallback lưu đệm tạm thời chống mất dữ liệu khi rớt mạng.
* **Kinh nghiệm rút ra:** Cố định tỷ lệ canvas theo đúng chuẩn in ấn A4 giúp loại bỏ hoàn toàn tình trạng sai lệch giữa màn hình và file PDF khi xuất ra.

### 🔴 Thứ 5 (24/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Trụ Cột Khớp Nối Kỹ Năng (Evidence-Based Matching) & Bộ Lọc Ứng Viên Đa Chiều.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển thuật toán Match Score (0-100%) đối chiếu kỹ năng sinh viên với JD; thiết kế thẻ ứng viên hiển thị huy hiệu xếp hạng và MatchDetailModal.tsx phân tích sâu độ khớp.
  * Chiều (13:00 - 17:00): Xây dựng bộ lọc ứng viên đa chiều (vị trí Frontend/Backend/DevOps, điểm match tối thiểu, tech stack bắt buộc); tối ưu hóa câu truy vấn dưới 100ms.
* **Kinh nghiệm rút ra:** Minh bạch hóa lý do đề xuất kỹ năng giúp nhà tuyển dụng tin tưởng và rút ngắn 70% thời gian sàng lọc hồ sơ ban đầu.

### 🔴 Thứ 6 (25/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tích hợp AI Skill Coach gợi ý kỹ năng theo vị trí & Tối ưu hóa UI/UX Canvas.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng tính năng AI Skill Coach gợi ý từ khóa kỹ thuật theo vị trí tuyển dụng, đối soát với từ điển công nghệ và hỗ trợ thêm vào CV 1-click.
  * Chiều (13:00 - 17:00): Tối ưu hóa UI/UX toàn bộ Canvas, xử lý responsive màn hình từ 13 đến 27 inch, ngăn chặn hiện tượng giật layout khi nhập văn bản dài.
* **Kinh nghiệm rút ra:** Gợi ý từ khóa trúng đích giúp CV vượt qua các bộ lọc tự động và tạo ấn tượng mạnh với nhà tuyển dụng.

### 🔴 Thứ 7 (26/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Rà soát toàn diện trải nghiệm người dùng Phase 1 & Viết Unit Test nền tảng.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Viết 5 test suites đầu tiên cho cvService, projectService, matchService; kiểm tra toàn bộ luồng tạo đồ án, lưu CV và đọc file tài liệu.
  * Chiều (13:00 - 17:00): Rà soát console warning, tối ưu cấu trúc DOM, kiểm tra tính tương thích TypeScript và tổng kết cột mốc phát triển tuần 2.
* **Kinh nghiệm rút ra:** Viết test sớm giúp tự tin mở rộng tính năng và phát hiện ngay các lỗi vỡ layout hoặc hỏng liên kết.

## 📅 TUẦN 3: ĐÁNH GIÁ KIẾN TRÚC, CẮT BỎ OVER-ENGINEERING & TINH GỌN ROUTING (28/09/2026 – 03/10/2026)

### 🔴 Thứ 2 (28/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Họp Review kiến trúc, đánh giá hiệu năng & Thống nhất chiến lược Lean MVP.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích tài nguyên hệ thống và độ trễ phản hồi; nhận định các tính năng phụ (chatbot riêng, trắc nghiệm tính cách) đang làm phình to codebase mà không mang lại giá trị thực tế.
  * Chiều (13:00 - 17:00): Họp kỹ thuật với Tech Lead, thống nhất nguyên tắc Lean MVP: Kiên quyết cắt bỏ các module rườm rà để tập trung 100% vào giá trị cốt lõi là đưa đồ án thực chiến vào CV.
* **Kinh nghiệm rút ra:** Dũng cảm loại bỏ những tính năng rườm rà là bước ngoặt quan trọng giúp dự án phát triển đúng hướng và tiết kiệm tài nguyên.

### 🔴 Thứ 3 (29/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** [CẮT BỎ TOÀN DIỆN] Xóa bỏ Microservice Python Chatbot & Module Khảo sát MBTI.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xóa toàn bộ thư mục profilehub/chatbot_service (app.py, skill_mining.py, requirements.txt); viết lại bộ từ điển công nghệ bằng TypeScript native module trong aiCvService.ts.
  * Chiều (13:00 - 17:00): Xóa sạch mbtiService.ts, MBTIAssessment.tsx, types/mbti.ts; gỡ bỏ tab MBTI trên Sidebar và dọn sạch state thừa trong bộ nhớ ứng dụng.
* **Kinh nghiệm rút ra:** Chuyển từ gọi HTTP sang microservice riêng sang TypeScript native giúp tốc độ xử lý nhanh gấp 3 lần và loại bỏ hoàn toàn gánh nặng môi trường.

### 🔴 Thứ 4 (30/09/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** [CẮT BỎ] Loại bỏ Trình mô phỏng phỏng vấn cũ, Tối ưu Single-Layout & Dọn sạch Router.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Gỡ bỏ interviewCoachService.ts (dạng chatbot text tĩnh thiếu thực tế); lập phương án chuyển sang mô phỏng phỏng vấn kỹ thuật xoáy sâu vào đồ án.
  * Chiều (13:00 - 17:00): Refactor MainLayout.tsx và Sidebar.tsx, xóa bỏ toàn bộ dead routes; chuẩn hóa hệ thống định tuyến React Router không còn lỗi 404 hoặc warning console.
* **Kinh nghiệm rút ra:** Gom việc dọn dẹp các module thừa và tái cấu trúc layout vào một ngày giúp codebase trở nên tinh gọn, sáng sủa và dễ bảo trì.

### 🔴 Thứ 5 (01/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Nghiên cứu khảo nghiệm thực tế cơ chế Giảng viên xác thực (Teacher Verification).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích quy trình giảng viên chấm điểm đồ án trên hệ thống; ghi nhận tỷ lệ tắc nghẽn nghiêm trọng khi 85% đồ án sinh viên bị treo chờ duyệt.
  * Chiều (13:00 - 17:00): Tổng hợp phản hồi từ 15 sinh viên và 3 giảng viên; nhận định cơ chế xác thực hành chính tạo ra nút thắt cổ chai lớn trong thực tế tuyển dụng.
* **Kinh nghiệm rút ra:** Sản phẩm công nghệ phụ thuộc vào sự phê duyệt thủ công của bên thứ ba rất dễ bị đứt gãy luồng vận hành.

### 🔴 Thứ 6 (02/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Đề xuất giải pháp thay thế: Chuyển dịch từ Xác thực Giảng viên sang Bằng chứng thực tế.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Họp phản biện kỹ thuật: Đề xuất thay thế con dấu xác thực của giảng viên bằng bằng chứng công nghệ khách quan (Live Demo URL, GitHub Repo và mã QR quét mở demo).
  * Chiều (13:00 - 17:00): Lập dự thảo chuyển đổi kiến trúc sang mô hình Evidence-Based Showcase; phác thảo giao diện hiển thị đường link demo và mã QR quét kiểm chứng sản phẩm.
* **Kinh nghiệm rút ra:** Bằng chứng khách quan kiểm chứng được bằng mã nguồn chạy thật luôn có giá trị thuyết phục cao hơn giấy xác nhận hành chính.

### 🔴 Thứ 7 (03/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Kiểm thử hồi quy toàn hệ thống sau tái cấu trúc (TDD Green Check 20/20 Tests).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Chạy lại toàn bộ test suites hiện có: aiCvService.test.ts, cvManagement.test.ts, markdownExporter.test.ts, đạt 20/20 tests pass 100%.
  * Chiều (13:00 - 17:00): Chạy npm run build kiểm tra biên dịch TypeScript, đo lường bundle size và xác nhận hệ thống hoàn toàn sẵn sàng cho cuộc đại phẫu kiến trúc tuần sau.
* **Kinh nghiệm rút ra:** Duy trì kỷ luật TDD giúp đảm bảo các đợt cắt bỏ tính năng lớn không gây ảnh hưởng đến tính toàn vẹn của mã nguồn cốt lõi.

## 📅 TUẦN 4: TRỤ CỘT ĐỀ XUẤT ĐỒ ÁN, BÁO CÁO ĐÁNH GIÁ & TIÊU CHÍ KHẢO NGHIỆM (05/10/2026 – 10/10/2026)

### 🔴 Thứ 2 (05/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hoàn thiện Trụ Cột Đề Xuất & Soi Bằng Chứng Đồ Án Cho Nhà Tuyển Dụng.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng component CandidateDossierModal.tsx hiển thị toàn diện hồ sơ ứng viên: danh sách đồ án, điểm số tương thích và liên kết minh chứng kiểm chứng được.
  * Chiều (13:00 - 17:00): Tích hợp tính năng lọc nhanh ứng viên theo các đồ án có sản phẩm chạy thật (Demo Available); tối ưu truy vấn Supabase đạt phản hồi dưới 80ms.
* **Kinh nghiệm rút ra:** Trình bày bằng chứng đồ án trực quan giúp nhà tuyển dụng kỹ thuật đưa ra quyết định mời phỏng vấn nhanh gấp 2 lần.

### 🔴 Thứ 3 (06/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Khảo sát và hoàn thiện tính năng Báo cáo Đánh giá Hồ sơ Ứng viên (Executive Evaluation Report).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng ExecutiveEvaluationReportModal.tsx: Tổng hợp điểm mạnh kỹ thuật, các điểm còn thiếu so với JD và đề xuất mức độ phù hợp (Strong Hire, Hire, Consider).
  * Chiều (13:00 - 17:00): Viết logic trích xuất báo cáo ra định dạng in ấn rút gọn giúp HR và Hiring Manager dễ dàng thảo luận trong các buổi phỏng vấn nội bộ.
* **Kinh nghiệm rút ra:** Cung cấp báo cáo đánh giá cô đọng giúp đồng bộ nhận định giữa bộ phận nhân sự và đội ngũ kỹ sư phỏng vấn.

### 🔴 Thứ 4 (07/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tích hợp Hệ Thống Chấm Điểm Phỏng Vấn Kỹ Thuật (Interview Scorecard).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng InterviewScorecardModal.tsx cho phép nhà tuyển dụng đánh giá trực tiếp ứng viên theo 4 tiêu chí: Tư duy kiến trúc, Kỹ năng code, Giải quyết vấn đề và Giao tiếp.
  * Chiều (13:00 - 17:00): Lưu trữ lịch sử đánh giá phỏng vấn vào Supabase, hỗ trợ tính điểm trung bình và phân tích biểu đồ Radar trực quan.
* **Kinh nghiệm rút ra:** Tiêu chuẩn hóa phiếu chấm điểm phỏng vấn giúp doanh nghiệp loại bỏ thiên vị cảm tính khi tuyển chọn ứng viên.

### 🔴 Thứ 5 (08/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Tính Năng Thách Thức Kỹ Thuật Dự Án (Issue Challenge Modal).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển IssueChallengeModal.tsx cho phép nhà tuyển dụng gửi các bài test thực tế hoặc câu hỏi xoáy trực tiếp vào mã nguồn đồ án của sinh viên.
  * Chiều (13:00 - 17:00): Tích hợp hệ thống thông báo realtime gửi thách thức đến sinh viên và đồng bộ trạng thái phản hồi trên giao diện ứng tuyển.
* **Kinh nghiệm rút ra:** Thử thách kỹ thuật bám sát đồ án thật là phương pháp hiệu quả nhất để kiểm tra sinh viên có thực sự tự tay code dự án hay không.

### 🔴 Thứ 6 (09/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tổng hợp khảo sát thực tế toàn diện & Chuẩn bị ban hành Quyết định Kiến trúc ADR 0001.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Rà soát toàn bộ kết quả thử nghiệm 3 tuần đầu; xác nhận quyết định dứt điểm: Xóa hoàn toàn module Xác thực Giảng viên khỏi toàn bộ hệ thống.
  * Chiều (13:00 - 17:00): Soạn thảo tài liệu phân tích bài toán, xác lập phương án kiến trúc chuyển đổi toàn bộ ProfileHub thành Project-Driven AI CV Builder.
* **Kinh nghiệm rút ra:** Lắng nghe dữ liệu phản hồi thực tế và kiên quyết hành động là phẩm chất cốt lõi của kỹ sư phần mềm chuyên nghiệp.

### 🔴 Thứ 7 (10/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Chạy kiểm thử toàn diện TDD, Typecheck & Dọn dẹp codebase trước khi Pivot.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Chạy kiểm thử đơn vị và kiểm thử tích hợp, xác nhận toàn bộ 25 bài test pass 100%, TypeScript biên dịch sạch không có lỗi cảnh báo.
  * Chiều (13:00 - 17:00): Gắn nhãn tag git release v0.9-pre-pivot, lưu trữ backup mã nguồn và dọn sạch các file tạm thời, sẵn sàng cho tuần triển khai 6 Tracer-Bullet Tickets.
* **Kinh nghiệm rút ra:** Tạo mốc snapshot an toàn trước các đợt đại tu kiến trúc giúp loại bỏ hoàn toàn rủi ro mất mát mã nguồn.

## 📅 TUẦN 5: BAN HÀNH ADR 0001, TRIỂN KHAI 6 TRACER-BULLET TICKETS & NGHIỆM THU V1 (12/10/2026 – 16/10/2026)

### 🔴 Thứ 2 (12/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Ban hành ADR 0001, cập nhật Đặc tả Hệ thống & Xóa sổ Module Xác thực Giảng viên.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Ban hành Architecture Decision Record ADR 0001 và cập nhật Mục 7.4 trong đặc tả hệ thống; định nghĩa bảng thuật ngữ chuẩn (Master Project, Reverse Sync, Anti-Hallucination).
  * Chiều (13:00 - 17:00): [CẮT BỎ TRIỆT ĐỂ] Xóa toàn bộ TeacherVerificationView.tsx, teacherVerificationService.ts và trường is_verified; phân rã lộ trình thành 6 Tracer-Bullet Tickets có tiêu chí nghiệm thu rõ ràng.
* **Kinh nghiệm rút ra:** Gom việc ban hành quyết định kiến trúc, cập nhật tài liệu và xóa code thừa vào một ngày giúp toàn bộ dự án đồng bộ ngay lập tức sang định hướng mới.

### 🔴 Thứ 3 (13/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hiện thực hóa Ticket 01 (Reverse Sync & Toast) & Ticket 02 (Scoped Contribution).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Triển khai Ticket 01: Mở rộng ProjectItem với syncToMasterProfile, viết hàm cvService.syncCvProjectsToMaster tự động upsert dự án vào Supabase, viết test TDD pass 3/3.
  * Chiều (13:00 - 17:00): Triển khai Ticket 02: Bổ sung scopeType: solo/team, teamSize, systemContext; render huy hiệu đồ án nhóm/cá nhân trên CV, viết test TDD pass 3/3.
* **Kinh nghiệm rút ra:** Tách bạch đồ án trong CV (CV Project Instance) với đồ án gốc (Master Project) mang lại sự linh hoạt tối đa cho ứng viên khi may đo CV.

### 🔴 Thứ 4 (14/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hiện thực hóa Ticket 03 (Project Fit Explainer) & Ticket 04 (STAR Diff Review & Anti-Hallucination).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Triển khai Ticket 03: Xây dựng projectFitService.evaluateProjectFit đối chiếu đồ án với JD, hiển thị ProjectFitExplainerModal.tsx chọn đồ án phù hợp 1-click (test pass 3/3).
  * Chiều (13:00 - 17:00): Triển khai Ticket 04: Xây dựng starBulletService chuẩn hóa mô tả STAR có số liệu định lượng, xây dựng StarDiffReviewModal.tsx và tích hợp Anti-Hallucination Guard chặn AI bịa công nghệ (test pass 3/3).
* **Kinh nghiệm rút ra:** Tích hợp Anti-Hallucination Guard giúp ứng viên kiểm soát 100% nội dung AI sinh ra, tránh bịa đặt số liệu viển vông trước nhà tuyển dụng.

### 🔴 Thứ 5 (15/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hiện thực hóa Ticket 05 (Page-Budget Guard & Layout Switcher) & Ticket 06 (Evidence Showcase QR).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Triển khai Ticket 05: Xây dựng pageBudgetService đo chiều cao render khổ in A4, hiển thị badge % A4 trên toolbar, phát triển 1-Click AI Auto-Condense co vừa 1 trang, đổi layout 1/2 cột (test pass 3/3).
  * Chiều (13:00 - 17:00): Triển khai Ticket 06: Render link Live Demo/GitHub chuẩn ATS, tích hợp qrcode.react tự động sinh mã QR 28px in trên A4 quét demo sản phẩm trực tiếp (test pass 3/3).
* **Kinh nghiệm rút ra:** Đảm bảo CV vừa khít đúng 1 trang in A4 và có mã QR quét demo là hai tính năng thực tế ghi điểm tuyệt đối trong mắt các nhà tuyển dụng.

### 🔴 Thứ 6 (16/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Lắp ráp toàn trình 6 Tickets, TDD 11/11 Suites Pass 100% & Nghiệm thu ProfileHub v1.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Lắp ráp toàn bộ 6 tickets vào CVBuilder.tsx và InteractiveCVCanvas.tsx; hoàn thiện micro-interactions, phím tắt Ctrl+S/P/B và hiệu ứng Toast phản hồi tức thì.
  * Chiều (13:00 - 17:00): Chạy toàn bộ 11/11 test suites với 38/38 tests pass 100%; đóng gói npm run build sạch sẽ không lỗi TypeScript, hoàn thành trọn vẹn cột mốc ProfileHub v1.
* **Kinh nghiệm rút ra:** Hoàn tất trọn vẹn 6 Tracer-Bullet Tickets trong 1 tuần chứng minh sức mạnh của phương pháp Spec-Driven kết hợp với tốc độ vibe-coding vượt trội.

## 📅 TUẦN 6: CONTEXTUAL APPLICATION PITCH, PHÒNG THỦ KỸ THUẬT & STAR WIZARD (19/10/2026 – 23/10/2026)

### 🔴 Thứ 2 (19/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Ban hành ADR 0002 & Xây dựng toàn trình Contextual Application Pitch.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Họp phản biện (/grill-with-docs) làm rõ bất cập của Cover Letter truyền thống; ban hành quyết định kiến trúc ADR 0002 định nghĩa Contextual Application Pitch gắn liền với cặp (CV Project, JD).
  * Chiều (13:00 - 17:00): Xây dựng applicationPitchService.ts và ApplicationPitchModal.tsx (< 250 từ, 1-Click Copy, cơ chế Hard-gating bắt buộc có JD và ít nhất 1 đồ án); viết 4 bài test TDD pass 100%.
* **Kinh nghiệm rút ra:** Gắn thư ứng tuyển trực tiếp vào ngữ cảnh đồ án và JD giúp tăng tỷ lệ phản hồi của HR lên gấp 3 lần so với viết thư xin việc chung chung.

### 🔴 Thứ 3 (20/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Trụ Cột Project Technical Defense Briefing (Huấn luyện phòng thủ đồ án trước Tech Lead).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Nghiên cứu các dạng câu hỏi xoáy phỏng vấn kỹ thuật theo Tech Stack (Redis Invalidation, PostgreSQL EXPLAIN Indexing, Node.js Event Loop, React Re-render).
  * Chiều (13:00 - 17:00): Xây dựng projectDefenseService.ts và ProjectDefenseModal.tsx trang bị Top 3 câu hỏi xoáy, bản giải trình Trade-off và kịch bản Debugging Scaffold 4 pha; viết test nâng suites lên 13/13 (46/46 tests pass).
* **Kinh nghiệm rút ra:** Chuẩn bị trước kịch bản giải trình Trade-off kiến trúc giúp ứng viên tự tin chứng minh bản lĩnh kỹ thuật thực chất trước Tech Lead.

### 🔴 Thứ 4 (21/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Nghiên cứu nguyên tắc Zero Fake Metrics & Xây dựng công cụ Soi CV Chuẩn STAR.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khẳng định nguyên tắc chống bịa đặt số liệu viển vông; xác lập 4 nguồn số liệu kỹ thuật thực tế: EXPLAIN query cost, k6 load test throughput (req/s), Lighthouse performance và test coverage.
  * Chiều (13:00 - 17:00): Xây dựng starDiagnosticService.ts: Bắt lỗi từ ngữ thụ động, chấm điểm STAR Score (0-100), tự động sinh câu hỏi gợi mở khơi sâu số liệu kỹ thuật thực tế.
* **Kinh nghiệm rút ra:** Số liệu trong CV kỹ thuật phải có bằng chứng kiểm chứng được, tránh việc ứng viên bị đánh trượt vì thiếu trung thực khi bị phỏng vấn sâu.

### 🔴 Thứ 5 (22/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hoàn thiện STAR Wizard, Tích hợp Canvas & Thiết lập CI/CD GitHub Actions.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng modal StarCvDiagnosticModal.tsx hỗ trợ cả 2 chế độ: Soi CV Sẵn Có và STAR Wizard Từ Trang Giấy Trắng, tích hợp nút tác vụ 1-click đưa vào Canvas (test pass 5/5).
  * Chiều (13:00 - 17:00): Cấu hình CI/CD GitHub Actions (.github/workflows/3dwebsite-ci.yml, deploy, release, rollback); chạy kiểm thử hồi quy 14/14 test suites (51/51 tests pass) và build sạch.
* **Kinh nghiệm rút ra:** Thiết lập pipeline CI/CD tự động giúp kiểm soát chất lượng mã nguồn liên tục sau mỗi commit và ngăn chặn lỗi hồi quy.

### 🔴 Thứ 6 (23/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Trình Tạo Dự Án Mẫu Từ Con Số 0 (Cold Start Project Generator).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng ColdStartProjectModal.tsx: Cung cấp kho đồ án mẫu chuẩn công nghiệp cho sinh viên chưa có kinh nghiệm thực chiến (E-commerce microservices, Realtime Chat, AI Portfolio).
  * Chiều (13:00 - 17:00): Tích hợp tính năng gợi ý kiến trúc, sơ đồ DB mẫu và checklist hoàn thiện đồ án; viết bộ kiểm thử coldStartProject.test.ts pass 100%.
* **Kinh nghiệm rút ra:** Cung cấp khung đồ án chuẩn mực giúp sinh viên năm cuối nhanh chóng lấp đầy khoảng trống kinh nghiệm và tự tin thực hành code dự án thật.

## 📅 TUẦN 7: ATS EYE-VIEW HEATMAP, INTERVIEW WAR ROOM & DIGITAL BUSINESS CARD (26/10/2026 – 30/10/2026)

### 🔴 Thứ 2 (26/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Nghiên cứu nguyên lý ATS & Xây dựng toàn trình ATS Eye-View Heatmap Visualizer.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Khảo sát cơ chế chấm điểm của Applicant Tracking System và hành vi quét mắt F-pattern scan của nhà tuyển dụng; thiết kế kiến trúc atsHeatmapService.ts.
  * Chiều (13:00 - 17:00): Phát triển component AtsHeatmapOverlay.tsx vẽ bản đồ nhiệt trực quan đè lên Canvas A4; bổ sung bảng thống kê Keyword Frequency cảnh báo nguy cơ keyword stuffing.
* **Kinh nghiệm rút ra:** Biểu diễn trực quan bằng Heatmap màu sắc trực tiếp trên bản in giúp sinh viên nhanh chóng phát hiện các vùng nội dung bị loãng từ khóa.

### 🔴 Thứ 3 (27/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Phòng Luyện Phỏng Vấn Kỹ Thuật (Interview War Room) & Nhận Diện Giọng Nói.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển giao diện InterviewWarRoom.tsx với đồng hồ đếm ngược áp lực cao, bộ câu hỏi phỏng vấn phân theo Tech Stack và cơ chế chấm điểm phản xạ.
  * Chiều (13:00 - 17:00): Tích hợp Web Speech API (Speech-to-Text) thu âm câu trả lời thành văn bản; kết hợp dịch vụ phân tích đánh giá cấu trúc trả lời STAR có số liệu.
* **Kinh nghiệm rút ra:** Luyện nói thành tiếng trước micro với đồng hồ đếm ngược giúp ứng viên loại bỏ tâm lý sợ hãi và rèn luyện phản xạ nhanh nhạy khi phỏng vấn thật.

### 🔴 Thứ 4 (28/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tích hợp Khảo sát Dải Lương Thực Tế (Salary Benchmark) & Quản Lý Đa Phiên Bản CV.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tích hợp bộ dữ liệu real_market_salaries.json phân theo Level và Tech Stack; xây dựng SalaryBenchmarkWidget.tsx hiển thị dải lương p25, p50, p75 và gợi ý mức lương kỳ vọng.
  * Chiều (13:00 - 17:00): Mở rộng lược đồ CSDL cho phép 1 sinh viên quản lý nhiều bản CV may đo riêng (Frontend, Backend, Fullstack); xây dựng CVManagerModal.tsx hỗ trợ nhân bản và gắn nhãn.
* **Kinh nghiệm rút ra:** Nắm vững số liệu dải lương thị trường giúp sinh viên tự tin đàm phán đãi ngộ tương xứng với năng lực thực tế.

### 🔴 Thứ 5 (29/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Trình Hướng Dẫn Tương Tác Onboarding & Spotlight Tour.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển GamifiedOnboardingTour.tsx và SpotlightTour.tsx: Tự động highlight từng vùng tính năng quan trọng cho người dùng mới đăng nhập lần đầu.
  * Chiều (13:00 - 17:00): Tích hợp thanh đo mức độ hoàn thiện hồ sơ (Profile Strength Meter) và cơ chế thưởng huy hiệu kích thích sinh viên hoàn thiện đầy đủ thông tin đồ án.
* **Kinh nghiệm rút ra:** Trải nghiệm Onboarding dạng tương tác điểm sáng (Spotlight) giúp người dùng nắm vững 100% tính năng chính mà không cần đọc tài liệu hướng dẫn dài dòng.

### 🔴 Thứ 6 (30/10/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Danh Thiếp Kỹ Thuật Số (Digital Business Card) & Mã QR Profile Cá Nhân.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển BusinessCardModal.tsx tạo danh thiếp số cá nhân chứa avatar, vị trí ứng tuyển, link GitHub, Portfolio và mã QR rút gọn 1-click quét mở trên điện thoại.
  * Chiều (13:00 - 17:00): Tối ưu hóa khả năng chia sẻ mạng xã hội (LinkedIn, Facebook); chạy kiểm thử toàn bộ các modal và đóng gói build hoàn tất tuần 7.
* **Kinh nghiệm rút ra:** Danh thiếp kỹ thuật số tiện lợi là công cụ networking đắc lực giúp sinh viên kết nối nhanh chóng với nhà tuyển dụng tại các sự kiện Tech Expo.

## 📅 TUẦN 8: APPLICATION KANBAN, SMART JOB STUDIO, CV PARSER & DUAL-BADGE HUB (02/11/2026 – 06/11/2026)

### 🔴 Thứ 2 (02/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Application Tracker dạng bảng Kanban & Cơ chế kéo thả an toàn.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Thiết kế luồng quản lý tiến trình ứng tuyển 5 cột: Wishlist -> Applied -> Interviewing -> Offer -> Rejected; xây dựng component ApplicationKanbanBoard.tsx.
  * Chiều (13:00 - 17:00): Viết hook usePipelineDragDrop.ts hỗ trợ kéo thả thẻ mượt mà, đồng bộ state tức thì lên CSDL Supabase và tự động rollback trạng thái an toàn nếu mất kết nối mạng.
* **Kinh nghiệm rút ra:** Giao diện Kanban trực quan giúp sinh viên theo dõi chính xác từng giai đoạn ứng tuyển và không bao giờ bỏ lỡ lịch hẹn phỏng vấn.

### 🔴 Thứ 3 (03/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tích hợp AI Cover Letter, Email Generator & Cổng Tuyển Dụng Đảo Ngược (Reverse Recruiting).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Xây dựng modal CoverLetterGeneratorModal.tsx: Tự động trích xuất thông tin công ty và vị trí từ thẻ Kanban để may đo nội dung thư ứng tuyển và email phỏng vấn 1-click.
  * Chiều (13:00 - 17:00): Xây dựng Reverse Recruiting Hub: Cung cấp giao diện Public Talent Pool cho nhà tuyển dụng chủ động duyệt kho đồ án sinh viên với tính năng ẩn danh (Blind Screening).
* **Kinh nghiệm rút ra:** Tuyển dụng đảo ngược giúp những sinh viên có năng lực thực chất được nhà tuyển dụng săn đón chủ động thay vì nộp đơn thụ động.

### 🔴 Thứ 4 (04/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hoàn thiện Cơ Chế Phân Quyền RBAC, Bảo Mật Hồ Sơ Ứng Viên & Bộ Chuyển Vai Trò 1-Click.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình Row Level Security (RLS) nâng cao cho các bảng liên quan đến Application Tracker; xây dựng CandidatePrivacyModal.tsx với toggle Open to Work và Blacklist công ty chỉ định.
  * Chiều (13:00 - 17:00): Xây dựng bộ chuyển đổi vai trò (Role Switcher) thông minh trên Header và Avatar, cho phép chuyển đổi tức thì giữa giao diện Sinh viên và Nhà tuyển dụng mà không cần đăng xuất.
* **Kinh nghiệm rút ra:** Bảo vệ quyền riêng tư ứng viên và tạo sự thuận tiện khi kiểm thử đa vai trò là yếu tố sống còn cho một nền tảng tuyển dụng chuyên nghiệp.

### 🔴 Thứ 5 (05/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Phát triển bộ tính năng Tuyển dụng & Khớp nối thông minh: Xác thực MST, Smart Job Studio & Smart CV Parser.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tích hợp API tra cứu mã số thuế doanh nghiệp (MST), cấp Tích Xanh chống mạo danh HR; phát triển Smart Job Studio tự động bóc tách kỹ năng từ JD và thuật toán Instant Candidate Matching.
  * Chiều (13:00 - 17:00): Xây dựng hệ thống Dual-Badge thông minh (Demo-Ready & Verified) cho đồ án; phát triển Smart CV Parser tự động bóc tách CV tải lên để điền Master Profile; xây dựng Multi-Theme PDF Styler tùy biến xuất CV chuẩn A4.
* **Kinh nghiệm rút ra:** Tự động hóa bóc tách kỹ năng từ cả hai đầu (JD và CV) cùng cơ chế xác thực kép (MST công ty & Demo-Ready đồ án) giúp tối đa hóa tính minh bạch và độ tin cậy của nền tảng.

### 🔴 Thứ 6 (06/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Viết Unit Test & Kiểm thử tích hợp toàn diện cho bộ tính năng mới (Job Studio, CV Parser, PDF Styler).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Viết bộ kiểm thử đơn vị cho taxVerificationService.test.ts, jobStudioService.test.ts, cvParserService.test.ts, pdfStylerService.test.ts; nâng test coverage lên trên 90% cho các dịch vụ cốt lõi.
  * Chiều (13:00 - 17:00): Kiểm thử tích hợp luồng toàn trình: HR xác thực MST đăng tin -> sinh viên bóc tách CV tự động -> xuất bản CV PDF đa theme; kiểm tra npm run build đóng gói sạch sẽ không lỗi TypeScript.
* **Kinh nghiệm rút ra:** Dành ngày thứ Sáu để hoàn thiện toàn bộ test suites và kiểm thử tích hợp sau khi triển khai các tính năng lớn giúp hệ thống giữ vững tính ổn định cao.

## 📅 TUẦN 9: PUBLIC OFFER PORTAL, LANDING PAGE 3D, COMMUNITY FEED & MULTI-TIER CACHE (09/11/2026 – 13/11/2026)

### 🔴 Thứ 2 (09/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Xây dựng Cổng Nhận Offer Công Khai, Xuất Hồ Sơ Ứng Viên & Mạng Xã Hội Nghề Nghiệp (Community Feed).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phát triển PublicOfferPortal.tsx cho phép ứng viên nhận và phản hồi offer trực tuyến; xây dựng tính năng xuất hồ sơ tổng hợp Executive Dossier Export chuẩn in ấn cho doanh nghiệp.
  * Chiều (13:00 - 17:00): Khởi tạo mạng xã hội nghề nghiệp sinh viên (/feed): Xây dựng SocialSidebar, CreatePostBox.tsx, FeedControlCard.tsx và PostCard.tsx chia sẻ thành tựu dự án và cơ hội tuyển dụng.
* **Kinh nghiệm rút ra:** Kết hợp tính năng tuyển dụng với mạng xã hội nghề nghiệp tạo ra hiệu ứng lan tỏa mạnh mẽ và giữ chân người dùng tương tác hàng ngày.

### 🔴 Thứ 3 (10/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Thiết kế Landing Page 3D Tương Tác (3D WebGL Crystal Hero & 3D Tilt Card) & Tinh chỉnh Feed.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tái thiết kế trang chủ HomePage.tsx với hiệu ứng 3D WebGL Crystal Hero và component Interactive3DTiltCard.tsx tạo hiệu ứng nghiêng 3D chân thực khi rê chuột vào thẻ CV đồ án.
  * Chiều (13:00 - 17:00): Tinh gọn giao diện Community Feed thành bố cục 2 cột sạch sẽ; xây dựng modal AuthRequiredModal.tsx bật popup yêu cầu đăng nhập khi khách vãng lai ứng tuyển nhanh từ bài đăng.
* **Kinh nghiệm rút ra:** Giao diện Landing Page có hiệu ứng tương tác 3D mượt mà nâng tầm hình ảnh chuyên nghiệp của sản phẩm và tạo ấn tượng thị giác đột phá cho nhà tuyển dụng.

### 🔴 Thứ 4 (11/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Thiết kế & Triển khai Cơ chế Caching Đa Tầng (Redis + IndexedDB) & Service Worker.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình Redis cache ở tầng API server và thiết lập IndexedDB lưu trữ cục bộ phía client cho bộ từ điển công nghệ và danh sách đồ án mẫu, giảm 85% request trùng lặp.
  * Chiều (13:00 - 17:00): Cấu hình Service Worker offline cache cho các asset tĩnh, đảm bảo ứng dụng vẫn hiển thị bản thảo CV khi mất kết nối mạng đột ngột.
* **Kinh nghiệm rút ra:** Kết hợp cache đa tầng ở cả client và server giúp tốc độ phản hồi giao diện đạt mức tức thì (< 50ms) ngay cả khi mạng chập chờn.

### 🔴 Thứ 5 (12/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tối ưu hóa Hydration, Code-Splitting & Kiểm thử tự động E2E với Playwright.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Phân tích hiệu năng bằng Google Lighthouse, áp dụng React.lazy và dynamic imports cho các modal nặng, đưa điểm số hiệu năng Performance lên 98/100.
  * Chiều (13:00 - 17:00): Cấu hình Playwright, viết kịch bản kiểm thử tự động toàn trình (E2E Test): luồng tạo CV, soi chuẩn STAR, kéo thả Kanban và xuất bản PDF; kiểm tra build sạch.
* **Kinh nghiệm rút ra:** Kiểm thử tự động E2E định kỳ giúp phát hiện tức thì các lỗi giao diện và bảo đảm trải nghiệm người dùng luôn hoàn hảo trước mỗi đợt phát hành.

### 🔴 Thứ 6 (13/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Rà soát bảo mật OWASP, Tối ưu hóa Bundle Size & Tải trang dưới 0.8s.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Rà soát bảo mật toàn diện theo chuẩn OWASP Top 10, cấu hình CSP headers, áp dụng DOMPurify làm sạch dữ liệu nhập từ người dùng trước khi render lên Canvas.
  * Chiều (13:00 - 17:00): Áp dụng Tree Shaking và loại bỏ các dependency thừa, giảm dung lượng bundle chính từ 1.2MB xuống 280KB (Gzipped); chạy kiểm thử tải xác nhận FCP < 0.8s.
* **Kinh nghiệm rút ra:** Tối ưu hóa bảo mật và tốc độ tải trang là yếu tố then chốt giúp ứng dụng hoạt động ổn định và an toàn trên môi trường production.

## 📅 TUẦN 10: TYPOGRAPHY, SENTRY MONITORING, VECTOR EMBEDDINGS & SPRINT REVIEW ROADMAP (16/11/2026 – 20/11/2026)

### 🔴 Thứ 2 (16/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Chuẩn hóa Typography, Dark/Light Mode & Khả năng truy cập tiếp cận (Accessibility - a11y).
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Rà soát và đồng bộ typography, font chữ liên trang; hoàn thiện cơ chế chuyển đổi theme Dark/Light mượt mà với ThemeContext và CSS variables.
  * Chiều (13:00 - 17:00): Kiểm tra độ tương phản màu sắc đạt chuẩn WCAG AA, bổ sung thuộc tính ARIA labels và hỗ trợ điều hướng hoàn toàn bằng bàn phím trên các modal.
* **Kinh nghiệm rút ra:** Tuân thủ chuẩn tiếp cận a11y giúp mở rộng đối tượng người dùng và khẳng định tính chuyên nghiệp của sản phẩm tiêu chuẩn Enterprise.

### 🔴 Thứ 3 (17/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Tích hợp Công Cụ Giám Sát Lỗi Thời Gian Thực (Sentry SDK) & Cảnh Báo Realtime.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Tích hợp Sentry SDK trên frontend React Vite, cấu hình bắt unhandled exceptions, theo dõi transaction trace và thiết lập Error Boundary trên các component trọng yếu.
  * Chiều (13:00 - 17:00): Thiết lập webhook tự động đẩy thông báo lỗi nghiêm trọng về kênh nội bộ của đội ngũ kỹ thuật khi người dùng gặp sự cố.
* **Kinh nghiệm rút ra:** Hệ thống giám sát lỗi chủ động giúp đội ngũ phát hiện và vá lỗi ngay trước khi người dùng kịp phản ánh.

### 🔴 Thứ 4 (18/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Nâng cấp Thuật Toán AI Recommender Dựa Trên Vector Embeddings & Thử Nghiệm Tải K6.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Nghiên cứu áp dụng Vector Embeddings tính toán độ tương đồng ngữ nghĩa giữa đoạn văn mô tả đồ án của sinh viên và yêu cầu trách nhiệm công việc trong JD.
  * Chiều (13:00 - 17:00): Chạy thử nghiệm kiểm thử tải với k6 mô phỏng 200 người dùng đồng thời truy cập Public Showcase và Feed, xác nhận thời gian phản hồi API duy trì < 150ms.
* **Kinh nghiệm rút ra:** Khớp nối theo ngữ nghĩa (Semantic Matching) giúp nhận diện chính xác năng lực tiềm ẩn của ứng viên ngay cả khi từ khóa không hoàn toàn trùng khớp mặt chữ.

### 🔴 Thứ 5 (19/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Hoàn thiện Cơ Chế Xuất Bản Đa Nền Tảng (PWA Ready) & Tinh chỉnh SEO Meta Tags.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Cấu hình manifest.json và PWA service worker cho phép cài đặt ProfileHub như một ứng dụng độc lập trên máy tính và thiết bị di động.
  * Chiều (13:00 - 17:00): Cấu hình thẻ OpenGraph và Twitter Card meta tags động cho từng trang Portfolio cá nhân, đảm bảo ảnh thumbnail và thông tin sinh viên hiển thị đẹp mắt khi chia sẻ.
* **Kinh nghiệm rút ra:** Tối ưu hóa khả năng chia sẻ mạng xã hội (OpenGraph) là kênh đòn bẩy tự nhiên giúp thu hút nhà tuyển dụng tìm đến hồ sơ của sinh viên.

### 🔴 Thứ 6 (20/11/2026)
* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)
* **Công việc được giao:** Họp định kỳ Sprint Review với Mentor doanh nghiệp, đánh giá Milestone 2 và lập kế hoạch kỹ thuật chặng tiếp theo.
* **Kết quả thực hiện:**
  * Sáng (08:30 - 12:00): Demo toàn diện các tính năng đã hoàn thành (Landing Page 3D, Smart Job Studio, CV Parser, Community Feed, Application Kanban) cho Mentor doanh nghiệp và tiếp nhận góp ý kỹ thuật.
  * Chiều (13:00 - 17:00): Tiếp thu phản hồi của Mentor, cập nhật backlog kỹ thuật, phân chia các đầu việc mở rộng tiếp theo cho hệ thống ProfileHub và chuẩn bị kế hoạch phát triển cho chặng tới.
* **Kinh nghiệm rút ra:** Duy trì họp Sprint Review định kỳ với Mentor giúp nắm chắc định hướng sản phẩm thực tế và liên tục cải tiến chất lượng kỹ thuật trong suốt kỳ thực tập.

