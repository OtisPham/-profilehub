# BM01b — SỔ NHẬT KÝ THỰC TẬP TỐT NGHIỆP
### TRƯỜNG ĐẠI HỌC HOA SEN — KHOA CÔNG NGHỆ
**HỌC KỲ 2631 NĂM HỌC 2026 - 2027**

| Họ và tên sinh viên | : PHẠM THÁI BẢO |
| :--- | :--- |
| **Mã số sinh viên** | : 22114919 |
| **Ngành đào tạo** | : CÔNG NGHỆ THÔNG TIN |
| **Lớp** | : QL21111 |
| **Đơn vị thực tập** | : CÔNG TY TNHH ALPACA SOLUTIONS |
| **Thời gian thực tập** | : Từ ngày 14/09/2026 đến ngày 26/12/2026 |

*Thành phố Hồ Chí Minh, tháng 12 năm 2026*

---

### PHIẾU THEO DÕI TIẾN ĐỘ THỰC TẬP TỐT NGHIỆP
| Tuần | Từ ngày đến ngày | Họ tên và chữ ký của người hướng dẫn |
| :---: | :---: | :---: |
| 1 | 21/09/2026 - 26/09/2026 | |
| 2 | 28/09/2026 - 03/10/2026 | |
| 3 | 05/10/2026 - 10/10/2026 | |
| 4 | 12/10/2026 - 17/10/2026 | |
| 5 | 19/10/2026 - 24/10/2026 | |
| 6 | 26/10/2026 - 31/10/2026 | |
| 7 | 02/11/2026 - 07/11/2026 | |
| 8 | 09/11/2026 - 14/11/2026 | |
| 9 | 16/11/2026 - 21/11/2026 | |
| 10 | 23/11/2026 - 28/11/2026 | |
| 11 | 30/11/2026 - 05/12/2026 | |
| 12 | 07/12/2026 - 12/12/2026 | |
| 13 | 14/12/2026 - 19/12/2026 | |
| 14 | 21/12/2026 - 26/12/2026 | |

---

### NỘI DUNG NHẬT KÝ CHI TIẾT THEO NGÀY (48 NGÀY LÀM VIỆC — 8 TUẦN)

| Tuần: 1 Thứ:      2                Ngày: 21/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Khảo sát nghiệp vụ bài toán tạo CV của sinh viên CNTT, thiết lập Base Code Architecture. | Khảo sát thực trạng sinh viên gặp khó khăn khi mô tả dự án học tập vào CV; xác lập mục tiêu xây dựng nền tảng CV định hướng đồ án thực tế (Project-Driven AI CV Builder). | Thiết lập TypeScript Strict Mode ngay từ ngày đầu giúp kiểm soát type-safety chặt chẽ, loại bỏ hoàn toàn các lỗi undefined tiềm ẩn. |
| 13:00 - 17:00 | Khảo sát nghiệp vụ bài toán tạo CV của sinh viên CNTT, thiết lập Base Code Architecture. | Cấu hình môi trường phát triển: React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, kết nối Supabase (PostgreSQL + Auth + Storage). | Thiết lập TypeScript Strict Mode ngay từ ngày đầu giúp kiểm soát type-safety chặt chẽ, loại bỏ hoàn toàn các lỗi undefined tiềm ẩn. |

| Tuần: 1 Thứ:      3                Ngày: 22/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Thiết kế lược đồ CSDL PostgreSQL trên Supabase & Cấu hình Row Level Security (RLS). | Thiết kế các bảng: users, student_profiles, projects, skills, certifications, student_cvs. Tạo khóa ngoại và composite indexes tối ưu tốc độ đọc. | Áp dụng RLS ở tầng CSDL là cách bảo mật dữ liệu sinh viên đa người dùng chuẩn mực nhất mà không làm phình to backend code. |
| 13:00 - 17:00 | Thiết kế lược đồ CSDL PostgreSQL trên Supabase & Cấu hình Row Level Security (RLS). | Kích hoạt chính sách RLS cho từng bảng dữ liệu, cấu hình Supabase Storage Bucket portfolio_files lưu trữ tài liệu PDF và hình ảnh minh chứng. | Áp dụng RLS ở tầng CSDL là cách bảo mật dữ liệu sinh viên đa người dùng chuẩn mực nhất mà không làm phình to backend code. |

| Tuần: 1 Thứ:      4                Ngày: 23/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Module Quản lý Đồ Án Sinh Viên (MyProjects.tsx) – Toàn trình CRUD. | Thiết kế giao diện danh sách đồ án dạng thẻ Card chuẩn Enterprise, phân loại theo môn học và gắn tags công nghệ (React, Node.js, PostgreSQL...). | Quản lý state form chặt chẽ giúp sinh viên dễ dàng cập nhật thông tin dự án nhiều giai đoạn mà không gây mất mát dữ liệu. |
| 13:00 - 17:00 | Xây dựng Module Quản lý Đồ Án Sinh Viên (MyProjects.tsx) – Toàn trình CRUD. | Phát triển Form Modal Thêm/Sửa đồ án, hỗ trợ trường Live Demo URL, GitHub Repo URL, tài liệu PDF đính kèm và modal xác nhận xóa an toàn. | Quản lý state form chặt chẽ giúp sinh viên dễ dàng cập nhật thông tin dự án nhiều giai đoạn mà không gây mất mát dữ liệu. |

| Tuần: 1 Thứ:      5                Ngày: 24/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Module Quản lý Chứng Chỉ (Certificates.tsx) & In-App Document Reader. | Xây dựng giao diện lưu trữ chứng chỉ nghề nghiệp, tính năng đánh dấu thành tựu nổi bật (is_featured) và kéo-thả upload file. | Trải nghiệm xem trước tài liệu tức thì (sandbox iframe) giúp tăng tính chuyên nghiệp của nền tảng. |
| 13:00 - 17:00 | Xây dựng Module Quản lý Chứng Chỉ (Certificates.tsx) & In-App Document Reader. | Phát triển Modal xem trước file PDF/Ảnh nội tuyến (In-app Document Reader) giúp nhà tuyển dụng xem ngay chứng chỉ mà không cần tải về. | Trải nghiệm xem trước tài liệu tức thì (sandbox iframe) giúp tăng tính chuyên nghiệp của nền tảng. |

| Tuần: 1 Thứ:      6                Ngày: 25/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Dựng khung hiển thị tương tác WYSIWYG ban đầu cho trình soạn thảo CV trên khổ giấy chuẩn A4. | Phân tích thông số kỹ thuật in ấn: A4 Portrait ở độ phân giải 96 DPI tương đương chiều cao 1122.5px, xác lập lề trang và nhịp ngắt trang trực quan. | Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF. |
| 13:00 - 17:00 | Dựng khung hiển thị tương tác WYSIWYG ban đầu cho trình soạn thảo CV trên khổ giấy chuẩn A4. | Phát triển InteractiveCVCanvas.tsx render trực tiếp cấu trúc CV, hỗ trợ chỉnh sửa inline trên từng dòng text. | Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF. |

| Tuần: 1 Thứ:      7                Ngày: 26/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback). | Viết các hàm đồng bộ trong cvService.ts kết nối với bảng student_cvs trên Supabase để tự động lưu trạng thái CV. | Cơ chế Fallback hai lớp (Cloud + LocalStorage) giúp ứng viên an tâm tuyệt đối khi thao tác soạn thảo nội dung dài. |
| 13:00 - 17:00 | Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback). | Thiết lập bộ đệm LocalStorage lưu trữ tạm thời phiên soạn thảo, chống mất dữ liệu khi mất mạng hoặc reload trang đột ngột. | Cơ chế Fallback hai lớp (Cloud + LocalStorage) giúp ứng viên an tâm tuyệt đối khi thao tác soạn thảo nội dung dài. |

| Tuần: 2 Thứ:      2                Ngày: 28/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Họp Review tiến độ, đánh giá hiệu năng hệ thống và mức độ phức tạp của codebase. | Đo lường tài nguyên: Nhận thấy kiến trúc đang phải gánh một microservice Python độc lập và nhiều luồng khảo sát phụ rườm rà. | Dũng cảm cắt bỏ tính năng không hiệu quả là yếu tố sống còn giúp dự án về đích đúng hạn và đạt chất lượng cao. |
| 13:00 - 17:00 | Họp Review tiến độ, đánh giá hiệu năng hệ thống và mức độ phức tạp của codebase. | Họp kỹ thuật với Tech Lead và thống nhất chiến lược "Lean MVP": Cắt giảm ngay các tính năng ngoài lề để tập trung 100% vào giá trị cốt lõi là tạo CV theo dự án. | Dũng cảm cắt bỏ tính năng không hiệu quả là yếu tố sống còn giúp dự án về đích đúng hạn và đạt chất lượng cao. |

| Tuần: 2 Thứ:      3                Ngày: 29/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | [CẮT BỎ] Xóa bỏ hoàn toàn Microservice Python Chatbot phụ (chatbot_service/) & Chuyển sang TypeScript. | Xóa bỏ thư mục profilehub/chatbot_service gồm app.py, skill_mining.py, requirements.txt, knowledge_base.json. | TypeScript native execution nhanh gấp 3 lần việc gọi HTTP API sang một tiến trình Python riêng lẻ và loại bỏ hoàn toàn gánh nặng cài đặt môi trường. |
| 13:00 - 17:00 | [CẮT BỎ] Xóa bỏ hoàn toàn Microservice Python Chatbot phụ (chatbot_service/) & Chuyển sang TypeScript. | Viết lại thuật toán nhận diện từ khóa kỹ thuật (Tech Dictionary) bằng TypeScript native module trong src/services/aiCvService.ts. | TypeScript native execution nhanh gấp 3 lần việc gọi HTTP API sang một tiến trình Python riêng lẻ và loại bỏ hoàn toàn gánh nặng cài đặt môi trường. |

| Tuần: 2 Thứ:      4                Ngày: 30/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | [CẮT BỎ] Xóa bỏ Module Khảo sát tính cách MBTI & Dọn sạch thanh điều hướng. | Xóa bỏ mbtiService.ts, MBTIAssessment.tsx, CandidateMBTIInsightCard.tsx, types/mbti.ts khỏi codebase. | Nhà tuyển dụng kỹ thuật quan tâm đến stack công nghệ và sản phẩm chạy thật hơn là các bài trắc nghiệm tính cách chung chung. |
| 13:00 - 17:00 | [CẮT BỎ] Xóa bỏ Module Khảo sát tính cách MBTI & Dọn sạch thanh điều hướng. | Dọn sạch các nút bấm và tab MBTI trên Sidebar và thanh điều hướng chính, giải phóng bộ nhớ ứng dụng. | Nhà tuyển dụng kỹ thuật quan tâm đến stack công nghệ và sản phẩm chạy thật hơn là các bài trắc nghiệm tính cách chung chung. |

| Tuần: 2 Thứ:      5                Ngày: 01/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | [CẮT BỎ] Loại bỏ luồng phỏng vấn chatbot dài dòng & Tối ưu luồng chọn đồ án. | Xóa bỏ các component chat hỏi đáp rườm rà: DiscoveryInterview.tsx, ChatWindow.tsx, FactCard.tsx, discovery.controller.ts. | Giao diện trực quan dạng chọn (checkbox) mang lại tốc độ hoàn thành công việc cao gấp 5 lần giao diện chat đàm thoại. |
| 13:00 - 17:00 | [CẮT BỎ] Loại bỏ luồng phỏng vấn chatbot dài dòng & Tối ưu luồng chọn đồ án. | Định hướng lại luồng dữ liệu: Cho phép ứng viên kéo trực tiếp dự án từ hồ sơ vào CV bằng Checkbox modal thay vì phải chat hỏi đáp từng câu. | Giao diện trực quan dạng chọn (checkbox) mang lại tốc độ hoàn thành công việc cao gấp 5 lần giao diện chat đàm thoại. |

| Tuần: 2 Thứ:      6                Ngày: 02/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng tính năng Nạp Hàng Loạt 100 CV từ Excel (BulkCvImportModal.tsx). | Tích hợp thư viện xlsx đọc dữ liệu hàng loạt từ file mẫu Mau_100_CV_ProfileHub.xlsx, bóc tách thông tin sinh viên, trường, GPA, kỹ năng và đồ án. | Chuẩn bị bộ dữ liệu mẫu phong phú giúp việc kiểm thử giao diện và thuật toán phản ánh chính xác dữ liệu thực tế. |
| 13:00 - 17:00 | Xây dựng tính năng Nạp Hàng Loạt 100 CV từ Excel (BulkCvImportModal.tsx). | Phát triển hàm convertImportedCvToCvBuilderState cho phép nạp 1 click toàn bộ 100 CV mẫu vào CV Builder để phục vụ test tính năng và stress-test. | Chuẩn bị bộ dữ liệu mẫu phong phú giúp việc kiểm thử giao diện và thuật toán phản ánh chính xác dữ liệu thực tế. |

| Tuần: 2 Thứ:      7                Ngày: 03/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tối ưu hóa Single-Layout & Dọn sạch Router toàn hệ thống. | Refactor lại MainLayout.tsx và Sidebar.tsx, gỡ bỏ các route mồ côi (dead routes) sau khi cắt bỏ các module thừa. | Tinh gọn thanh điều hướng giúp người dùng tập trung tối đa vào các thao tác chính. |
| 13:00 - 17:00 | Tối ưu hóa Single-Layout & Dọn sạch Router toàn hệ thống. | Kiểm tra lại toàn bộ liên kết nội bộ, đảm bảo chuyển trang mượt mà không có lỗi 404 hoặc warning console. | Tinh gọn thanh điều hướng giúp người dùng tập trung tối đa vào các thao tác chính. |

| Tuần: 3 Thứ:      2                Ngày: 05/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Khảo sát thực tế luồng Xác thực Giảng viên (Teacher Verification) và chuyển sang Evidence-Based. | Nhận thấy việc yêu cầu giảng viên phải đăng nhập chấm điểm, ký hash cryptographic (verificationCrypto.ts) tạo ra ma sát cực lớn, sinh viên bị phụ thuộc và không thể chủ động gửi CV. | Một sản phẩm tốt phải trao quyền chủ động cho người dùng chính (ứng viên) thay vì tạo ra các nút thắt hành chính bên ngoài. |
| 13:00 - 17:00 | Khảo sát thực tế luồng Xác thực Giảng viên (Teacher Verification) và chuyển sang Evidence-Based. | Quyết định loại bỏ triệt để tính năng xác thực giảng viên khỏi phạm vi dự án MVP, thay thế bằng cơ chế Bằng chứng tự chứng minh (Evidence-Based): Link Demo, Repo, QR Code. | Một sản phẩm tốt phải trao quyền chủ động cho người dùng chính (ứng viên) thay vì tạo ra các nút thắt hành chính bên ngoài. |

| Tuần: 3 Thứ:      3                Ngày: 06/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | [CẮT BỎ] Xóa bỏ toàn bộ Module Xác thực Giảng viên backend & client. | Xóa bỏ các tệp tin backend: verification.controller.ts, verification.service.ts, verification.routes.ts, utils/verificationCrypto.ts. | Loại bỏ cơ chế cộng điểm ưu tiên giả định giúp thuật toán AI matching trở nên công bằng, đánh giá thuần túy dựa trên độ phù hợp của Tech Stack với JD. |
| 13:00 - 17:00 | [CẮT BỎ] Xóa bỏ toàn bộ Module Xác thực Giảng viên backend & client. | Xóa bỏ giao diện client: VerificationInbox.tsx, TeacherProfile.tsx, PublicVerificationView.tsx. Xóa logic cộng điểm thưởng is_verified trong thuật toán gợi ý đồ án của aiCvService.ts. | Loại bỏ cơ chế cộng điểm ưu tiên giả định giúp thuật toán AI matching trở nên công bằng, đánh giá thuần túy dựa trên độ phù hợp của Tech Stack với JD. |

| Tuần: 3 Thứ:      4                Ngày: 07/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | [CẮT BỎ] Xóa bỏ tính năng Tạo thư xin việc (Cover Letter) & Phỏng vấn ảo rườm rà. | Xóa bỏ CoverLetterModal.tsx, CoverLetterPage.tsx, aiCoverLetterService.ts khỏi codebase. | Tập trung sâu sắc vào một tính năng then chốt (CV Builder) mang lại trải nghiệm xuất sắc hơn là dàn trải nhiều tính năng nông. |
| 13:00 - 17:00 | [CẮT BỎ] Xóa bỏ tính năng Tạo thư xin việc (Cover Letter) & Phỏng vấn ảo rườm rà. | Xóa bỏ AIInterviewPrep.tsx, aiInterviewService.ts, aiOfferLetterService.ts, giải phóng dung lượng bundle size. | Tập trung sâu sắc vào một tính năng then chốt (CV Builder) mang lại trải nghiệm xuất sắc hơn là dàn trải nhiều tính năng nông. |

| Tuần: 3 Thứ:      5                Ngày: 08/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Thiết lập hạ tầng Unit Test tự động hóa với Vitest trong profilehub. | Cấu hình Vitest trong package.json và vite.config.ts, thiết lập môi trường test jsdom và các script kiểm thử tự động. | Thiết lập test harness sớm tạo bệ phóng an toàn để tự tin refactor các module lớn mà không sợ gây lỗi hồi quy. |
| 13:00 - 17:00 | Thiết lập hạ tầng Unit Test tự động hóa với Vitest trong profilehub. | Viết các Seam Test đầu tiên: aiCvService.test.ts (kiểm tra phân tích từ khóa JD) và aiCvCoachService.test.ts (kiểm tra barem đánh giá nội dung CV). | Thiết lập test harness sớm tạo bệ phóng an toàn để tự tin refactor các module lớn mà không sợ gây lỗi hồi quy. |

| Tuần: 3 Thứ:      6                Ngày: 09/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Phát hiện và vá dứt điểm lỗi nghiêm trọng "Zombie CV" trong cvService.ts. | Phát hiện bug: Khi ứng viên chủ động xóa sạch tất cả CV trong danh sách, mảng rỗng [] bị điều kiện if (!raw || raw.length === 0) đánh đồng với người dùng mới, tự ý sinh lại CV mặc định. | Phân biệt rõ giữa trạng thái "chưa có dữ liệu" (null/undefined) và "dữ liệu rỗng có chủ đích" ([]) là nguyên tắc bất biến trong lập trình CSDL. |
| 13:00 - 17:00 | Phát hiện và vá dứt điểm lỗi nghiêm trọng "Zombie CV" trong cvService.ts. | Sửa điều kiện kiểm tra raw !== null để tôn trọng quyết định xóa của người dùng. Viết bộ test cvManagement.test.ts bảo vệ bất biến vòng đời CV. | Phân biệt rõ giữa trạng thái "chưa có dữ liệu" (null/undefined) và "dữ liệu rỗng có chủ đích" ([]) là nguyên tắc bất biến trong lập trình CSDL. |

| Tuần: 3 Thứ:      7                Ngày: 10/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Kiểm thử toàn diện các tầng dịch vụ cốt lõi (TDD Green Check) & Typecheck. | Chạy 5 test suites ban đầu: aiCvService.test.ts, cvManagement.test.ts, aiCvGeneration.test.ts, aiCvCoachService.test.ts, markdownExporter.test.ts. Đạt 20/20 tests pass 100%. | TDD mang lại sự tự tin tuyệt đối trước khi bước vào giai đoạn thiết kế tính năng mới. |
| 13:00 - 17:00 | Kiểm thử toàn diện các tầng dịch vụ cốt lõi (TDD Green Check) & Typecheck. | Kiểm tra npm run build, xác nhận TypeScript biên dịch không lỗi và hệ thống hoàn toàn sẵn sàng cho tuần cao điểm phát triển tính năng mới. | TDD mang lại sự tự tin tuyệt đối trước khi bước vào giai đoạn thiết kế tính năng mới. |

| Tuần: 4 Thứ:      2                Ngày: 12/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Ban hành Quyết định Kiến trúc ADR 0001: Tách biệt Bản sao Dự án trong CV với Hồ sơ Gốc. | Phân tích bài toán: Khi ứng viên sửa câu từ của dự án cho vừa vặn với một JD cụ thể, nếu lưu đè vào hồ sơ gốc sẽ làm hỏng dữ liệu gốc. | Việc tách biệt Instance và Master Profile là quyết định kiến trúc then chốt giúp ứng viên thoải mái may đo nhiều CV cho nhiều vị trí khác nhau. |
| 13:00 - 17:00 | Ban hành Quyết định Kiến trúc ADR 0001: Tách biệt Bản sao Dự án trong CV với Hồ sơ Gốc. | Soạn thảo và ban hành ADR 0001: Dự án trong CV là một thực thể độc lập (CV Project Instance), có thể tùy biến tự do theo JD mà không làm ảnh hưởng Master Project. | Việc tách biệt Instance và Master Profile là quyết định kiến trúc then chốt giúp ứng viên thoải mái may đo nhiều CV cho nhiều vị trí khác nhau. |

| Tuần: 4 Thứ:      3                Ngày: 13/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Cập nhật Tài liệu Đặc tả Yêu cầu Hệ thống Chính thức & Bảng Thuật Ngữ Miền. | Bổ sung Mục 7.4 (Luồng đưa dự án vào CV và đồng bộ ngược Reverse Sync) vào tài liệu đặc tả chính thức ProfileHub_Discovery_Requirements.md. | Chuẩn hóa ngôn ngữ miền chung (Ubiquitous Language) giúp việc viết mã nguồn và đặt tên biến có tính đồng nhất cao. |
| 13:00 - 17:00 | Cập nhật Tài liệu Đặc tả Yêu cầu Hệ thống Chính thức & Bảng Thuật Ngữ Miền. | Định nghĩa bảng thuật ngữ chuẩn trong docs/CONTEXT.md: Master Project, CV Project Instance, Reverse Sync, Scoped Contribution, STAR Bullet, Anti-Hallucination Guard, Page-Budget Guard, Evidence Showcase. | Chuẩn hóa ngôn ngữ miền chung (Ubiquitous Language) giúp việc viết mã nguồn và đặt tên biến có tính đồng nhất cao. |

| Tuần: 4 Thứ:      4                Ngày: 14/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Phân rã kỹ thuật thành 6 Tracer-Bullet Tickets & Lập kế hoạch TDD song hành. | Soạn thảo chi tiết tiêu chí nghiệm thu (Acceptance Criteria) cho Ticket 01 (Reverse Sync), Ticket 02 (Scoped Contribution), Ticket 03 (Project Fit Explainer) trong .scratch/project-driven-cv-builder/issues/. | Chia nhỏ bài toán lớn thành các ticket dạng "tracer-bullet" giúp kiểm soát tiến độ và kiểm thử độc lập dễ dàng. |
| 13:00 - 17:00 | Phân rã kỹ thuật thành 6 Tracer-Bullet Tickets & Lập kế hoạch TDD song hành. | Soạn thảo chi tiết tiêu chí nghiệm thu cho Ticket 04 (STAR Diff Review), Ticket 05 (Page-Budget Guard), Ticket 06 (Evidence Showcase QR) và lập kế hoạch triển khai song hành TDD. | Chia nhỏ bài toán lớn thành các ticket dạng "tracer-bullet" giúp kiểm soát tiến độ và kiểm thử độc lập dễ dàng. |

| Tuần: 4 Thứ:      5                Ngày: 15/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hiện thực hóa Ticket 01 (Reverse Sync & Toast) & Ticket 02 (Scoped Contribution). | Mở rộng ProjectItem với syncToMasterProfile?: boolean. Viết hàm cvService.syncCvProjectsToMaster tự động upsert dự án mới vào Supabase khi lưu CV. Viết projectReverseSync.test.ts kiểm thử TDD (3/3 pass). | Trải nghiệm Reverse Sync kèm thông báo Toast không gây gián đoạn (non-blocking) giúp ứng viên duy trì mạch tập trung khi gõ phím. |
| 13:00 - 17:00 | Hiện thực hóa Ticket 01 (Reverse Sync & Toast) & Ticket 02 (Scoped Contribution). | Thêm trường scopeType: 'solo' | 'team', teamSize, systemContext. Render huy hiệu [👥 Đồ án nhóm - X thành viên] hoặc [👤 Đồ án cá nhân] trên CV. Viết scopedContribution.test.ts kiểm thử (3/3 pass). | Trải nghiệm Reverse Sync kèm thông báo Toast không gây gián đoạn (non-blocking) giúp ứng viên duy trì mạch tập trung khi gõ phím. |

| Tuần: 4 Thứ:      6                Ngày: 16/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hiện thực hóa Ticket 03 (Project Fit Explainer) & Ticket 04 (STAR Bullet & Anti-Hallucination Guard). | Xây dựng projectFitService.evaluateProjectFit: Đối chiếu đồ án với JD, tính % tương thích, chip từ khóa trùng khớp/thiếu. Xây dựng ProjectFitExplainerModal.tsx chọn đồ án phù hợp vào CV 1-click. Viết test (3/3 pass). | Minh bạch hóa lý do đề xuất của AI và cung cấp bảng Diff Review giúp ứng viên làm chủ hoàn toàn nội dung trên CV của mình. |
| 13:00 - 17:00 | Hiện thực hóa Ticket 03 (Project Fit Explainer) & Ticket 04 (STAR Bullet & Anti-Hallucination Guard). | Xây dựng starBulletService.adaptProjectBulletsWithStar chuẩn hóa mô tả STAR có số liệu định lượng. Xây dựng StarDiffReviewModal.tsx và tích hợp Anti-Hallucination Guard chặn AI tự bịa công nghệ. Viết test (3/3 pass). | Minh bạch hóa lý do đề xuất của AI và cung cấp bảng Diff Review giúp ứng viên làm chủ hoàn toàn nội dung trên CV của mình. |

| Tuần: 4 Thứ:      7                Ngày: 17/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hiện thực hóa Ticket 05 (Page-Budget Guard & Layout Switcher) & Ticket 06 (Evidence Showcase & QR). | Xây dựng pageBudgetService đo chiều cao render so với khổ A4, hiển thị huy hiệu 📊 XX% A4 trên toolbar. Phát triển 1-Click AI Auto-Condense co vừa 1 trang A4. Bổ sung nút chuyển bố cục 1 cột và 2 cột. Viết test (3/3 pass). | Đảm bảo CV vừa vặn đúng 1 trang A4 và có mã QR quét demo là hai yếu tố ghi điểm cực mạnh trong mắt các nhà tuyển dụng thực tế. |
| 13:00 - 17:00 | Hiện thực hóa Ticket 05 (Page-Budget Guard & Layout Switcher) & Ticket 06 (Evidence Showcase & QR). | Render link Live Demo và GitHub Repo chuẩn ATS. Tích hợp qrcode.react tự động sinh mã QR thu nhỏ 28px in trên A4 quét demo sản phẩm. Viết test (3/3 pass). Lắp ráp hoàn chỉnh vào CVBuilder.tsx và Canvas. | Đảm bảo CV vừa vặn đúng 1 trang A4 và có mã QR quét demo là hai yếu tố ghi điểm cực mạnh trong mắt các nhà tuyển dụng thực tế. |

| Tuần: 5 Thứ:      2                Ngày: 19/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Rà soát Micro-interactions, Chạy Toàn bộ Test Suite, Build Clean, Cập nhật Tickets & Bàn giao v1. | Rà soát các phím tắt Ctrl + S (Lưu & Đồng bộ ngược), Ctrl + P (Xuất in PDF chuẩn A4), kiểm tra giao diện Dark/Light mode và độ phản hồi khi gõ phím. Chạy 11/11 Test Suites Pass 100% (38/38 Tests) không có lỗi. | Quy trình kiểm thử nghiêm ngặt kết hợp tài liệu rõ ràng tạo sự an tâm tuyệt đối khi bàn giao sản phẩm cho doanh nghiệp. |
| 13:00 - 17:00 | Rà soát Micro-interactions, Chạy Toàn bộ Test Suite, Build Clean, Cập nhật Tickets & Bàn giao v1. | Thực thi npm run build (tsc && vite build) thành công, bundle sạch sẽ 100%. Cập nhật toàn bộ trạng thái 6 Tracer-Bullet Tickets sang Status: completed. Hoàn tất bàn giao dự án ProfileHub v1 chính thức. | Quy trình kiểm thử nghiêm ngặt kết hợp tài liệu rõ ràng tạo sự an tâm tuyệt đối khi bàn giao sản phẩm cho doanh nghiệp. |

| Tuần: 5 Thứ:      3                Ngày: 20/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Phân tích nghiệp vụ thư ứng tuyển trong ngành IT và thiết kế kiến trúc Contextual Application Pitch (ADR 0002). | Họp phản biện (/grill-with-docs) làm rõ bất cập của Cover Letter truyền thống; ban hành quyết định kiến trúc ADR 0002 định nghĩa Contextual Application Pitch gắn liền với cặp (CV Project Instance, JD). | Tránh tạo tài liệu độc lập gây phình to hệ thống; nhúng ngữ cảnh trực tiếp vào bản CV giúp tạo tính gắn kết chặt chẽ giữa đồ án thực tế và yêu cầu tuyển dụng. |
| 13:00 - 17:00 | Phân tích nghiệp vụ thư ứng tuyển trong ngành IT và thiết kế kiến trúc Contextual Application Pitch (ADR 0002). | Xây dựng applicationPitchService.ts và ApplicationPitchModal.tsx (< 250 từ, 1-Click Copy, cơ chế Hard-gating bắt buộc có JD và ít nhất 1 đồ án); viết 4 bài test TDD pass 100%. | Tránh tạo tài liệu độc lập gây phình to hệ thống; nhúng ngữ cảnh trực tiếp vào bản CV giúp tạo tính gắn kết chặt chẽ giữa đồ án thực tế và yêu cầu tuyển dụng. |

| Tuần: 5 Thứ:      4                Ngày: 21/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Trụ Cột 3: Project Technical Defense Briefing (Huấn luyện phòng thủ đồ án trước Tech Lead). | Nghiên cứu các dạng câu hỏi xoáy phỏng vấn kỹ thuật theo từng Tech Stack: Redis Cache Invalidation, PostgreSQL EXPLAIN & Indexing, Node.js Event Loop, React Re-render. | Trang bị bản lĩnh bảo vệ đồ án trước câu hỏi hóc búa của Tech Lead giúp ứng viên tự tin chứng minh năng lực thực chất ở vòng phỏng vấn kỹ thuật. |
| 13:00 - 17:00 | Xây dựng Trụ Cột 3: Project Technical Defense Briefing (Huấn luyện phòng thủ đồ án trước Tech Lead). | Xây dựng projectDefenseService.ts và ProjectDefenseModal.tsx trang bị Top 3 câu hỏi xoáy, bản giải trình Trade-off và kịch bản Debugging Scaffold 4 pha; nâng test suites lên 13/13 (46/46 tests pass). | Trang bị bản lĩnh bảo vệ đồ án trước câu hỏi hóc búa của Tech Lead giúp ứng viên tự tin chứng minh năng lực thực chất ở vòng phỏng vấn kỹ thuật. |

| Tuần: 5 Thứ:      5                Ngày: 22/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Nghiên cứu nguyên tắc "Zero Fake Metrics" & Xác lập 4 nguồn số liệu kỹ thuật tái hiện được. | Khẳng định nguyên tắc chống bịa đặt số liệu kinh doanh viển vông; xác lập 4 nguồn số liệu kỹ thuật thực tế: EXPLAIN query cost, load test throughput (req/s), Lighthouse performance và Vitest coverage. | Số liệu trong CV công nghệ phải có bằng chứng kỹ thuật kiểm chứng được, tránh việc ứng viên bị Tech Lead đánh trượt vì thiếu trung thực (Dishonesty) khi bị truy vấn sâu. |
| 13:00 - 17:00 | Nghiên cứu nguyên tắc "Zero Fake Metrics" & Xác lập 4 nguồn số liệu kỹ thuật tái hiện được. | Soạn thảo kế hoạch thực thi kỹ thuật docs/superpowers/plans/2026-10-21-star-cv-diagnostic.md và thiết kế barem chấm điểm STAR Score (0-100). | Số liệu trong CV công nghệ phải có bằng chứng kỹ thuật kiểm chứng được, tránh việc ứng viên bị Tech Lead đánh trượt vì thiếu trung thực (Dishonesty) khi bị truy vấn sâu. |

| Tuần: 5 Thứ:      6                Ngày: 23/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Phát triển công cụ "Soi CV Chuẩn STAR" (Chế độ Soi CV Sẵn Có & Dán Văn Bản Thô). | Xây dựng starDiagnosticService.ts phát hiện động từ bị động ("tham gia", "hỗ trợ"), nhận diện chỉ số kỹ thuật thực tế và tự động sinh câu hỏi gợi mở khơi sâu trải nghiệm. | Tự động hóa phát hiện từ ngữ mơ hồ giúp ứng viên lập tức nhận biết các điểm yếu chí mạng trong cách diễn đạt dự án của mình. |
| 13:00 - 17:00 | Phát triển công cụ "Soi CV Chuẩn STAR" (Chế độ Soi CV Sẵn Có & Dán Văn Bản Thô). | Xây dựng giao diện Chế độ 1 trong StarCvDiagnosticModal.tsx: Phân tích sức khỏe từng đồ án, hiển thị danh sách điểm yếu kỹ thuật cần khắc phục và nút kích hoạt phỏng vấn nhanh. | Tự động hóa phát hiện từ ngữ mơ hồ giúp ứng viên lập tức nhận biết các điểm yếu chí mạng trong cách diễn đạt dự án của mình. |

| Tuần: 5 Thứ:      7                Ngày: 24/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hoàn thiện "STAR Wizard Từ Trang Giấy Trắng" & Tích hợp 1-Click Đưa Vào Canvas. | Xây dựng Chế độ 2 (STAR Wizard) dẫn dắt ứng viên qua 3 bước (Bối cảnh -> Hành động -> Kết quả đo lường) với các chip gợi ý kỹ thuật thực tế; viết 5 bài test tự động pass 100%. | Đặt đúng câu hỏi gợi mở theo mô hình STAR giúp ứng viên tự khai phá những thành tựu kỹ thuật có thật mà chính họ đã làm nhưng chưa biết cách diễn đạt. |
| 13:00 - 17:00 | Hoàn thiện "STAR Wizard Từ Trang Giấy Trắng" & Tích hợp 1-Click Đưa Vào Canvas. | Tích hợp nút tác vụ "Soi & Khai Thác STAR" trên thanh công cụ CVBuilder.tsx, hỗ trợ 1-Click đưa vào Canvas; toàn bộ 14/14 test suites (51/51 tests) pass 100%. | Đặt đúng câu hỏi gợi mở theo mô hình STAR giúp ứng viên tự khai phá những thành tựu kỹ thuật có thật mà chính họ đã làm nhưng chưa biết cách diễn đạt. |

| Tuần: 6 Thứ:      2                Ngày: 26/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Nâng cấp Module Quản lý Đồ Án (AddProjectModal.tsx) & Tour Hướng Dẫn Game Hóa. | Thiết kế lại form thêm/sửa đồ án hỗ trợ liên kết Live Demo URL, GitHub Repo, bối cảnh hệ thống (System Context) và phân tách trách nhiệm cá nhân; bổ sung trường gắn nhãn công nghệ tự động. | Thiết kế onboarding dạng game hóa giúp người dùng nhanh chóng nắm bắt các tính năng cốt lõi của nền tảng mà không cần đọc hướng dẫn sử dụng dài dòng. |
| 13:00 - 17:00 | Nâng cấp Module Quản lý Đồ Án (AddProjectModal.tsx) & Tour Hướng Dẫn Game Hóa. | Xây dựng GamifiedOnboardingTour.tsx hướng dẫn từng bước cho sinh viên mới lần đầu vào hệ thống; hoàn thiện component ProjectQRCodeModal.tsx xuất mã Smart QR quét mở demo trên điện thoại. | Thiết kế onboarding dạng game hóa giúp người dùng nhanh chóng nắm bắt các tính năng cốt lõi của nền tảng mà không cần đọc hướng dẫn sử dụng dài dòng. |

| Tuần: 6 Thứ:      3                Ngày: 27/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Thiết lập quy trình CI/CD GitHub Actions và Khảo sát khoảng trống thị trường CV công nghệ. | Cấu hình các workflow .github/workflows/: 3dwebsite-ci.yml, 3dwebsite-deploy.yml, 3dwebsite-release.yml, 3dwebsite-rollback.yml kiểm soát chất lượng code tự động. | Tự động hóa kiểm tra mã nguồn (lint, typecheck, unit test) qua CI pipeline giúp phát hiện lỗi từ sớm và ngăn chặn code lỗi được merge vào nhánh chính. |
| 13:00 - 17:00 | Thiết lập quy trình CI/CD GitHub Actions và Khảo sát khoảng trống thị trường CV công nghệ. | Khảo sát các khoảng trống thị trường (TopCV, ITviec, Canva): bẫy máy quét ATS quốc tế làm vỡ layout 2 cột, thiếu chỉ số định lượng, không có phản hồi HR; soạn thảo DANH_GIA_TINH_NANG_CV_PROFILEHUB.md. | Tự động hóa kiểm tra mã nguồn (lint, typecheck, unit test) qua CI pipeline giúp phát hiện lỗi từ sớm và ngăn chặn code lỗi được merge vào nhánh chính. |

| Tuần: 6 Thứ:      4                Ngày: 28/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Bộ Quy Tắc Kiểm Định Chất Lượng CV (cvQualityCheckService.ts) & Thanh Nhập GitHub. | Phát triển bộ quy tắc kiểm tra 10 tiêu chí chất lượng CV (độ dài lý tưởng, tỷ lệ câu định lượng, mật độ từ khóa kỹ thuật); xây dựng CVQualityCheckModal.tsx và viết 5 bài test pass 100%. | Tự động hóa việc chấm điểm chất lượng CV giúp người dùng tự tin chỉnh sửa bản CV đạt độ hoàn thiện cao nhất trước khi gửi đi. |
| 13:00 - 17:00 | Xây dựng Bộ Quy Tắc Kiểm Định Chất Lượng CV (cvQualityCheckService.ts) & Thanh Nhập GitHub. | Tích hợp GitHubQuickImportBar.tsx cho phép kéo repository từ GitHub vào thẳng dự án CV; xây dựng InlineEditPopover.tsx hỗ trợ chỉnh sửa nội tuyến tức thì. | Tự động hóa việc chấm điểm chất lượng CV giúp người dùng tự tin chỉnh sửa bản CV đạt độ hoàn thiện cao nhất trước khi gửi đi. |

| Tuần: 6 Thứ:      5                Ngày: 29/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Nâng cấp tính năng Sắp xếp Sections trên Canvas & Tái cấu trúc InteractiveCVCanvas.tsx. | Xây dựng SectionSettingsModal.tsx và ReorderSectionsModal.tsx cho phép kéo thả sắp xếp lại thứ tự các khối thông tin trong CV (Học vấn, Kinh nghiệm, Đồ án, Kỹ năng). | Cung cấp khả năng tùy biến bố cục linh hoạt giúp ứng viên may đo hồ sơ phù hợp với từng định dạng chuẩn của các công ty đa quốc gia. |
| 13:00 - 17:00 | Nâng cấp tính năng Sắp xếp Sections trên Canvas & Tái cấu trúc InteractiveCVCanvas.tsx. | Tái cấu trúc tệp Canvas trung tâm InteractiveCVCanvas.tsx, tối ưu hóa hiệu năng render khi người dùng chuyển đổi qua lại giữa các phiên bản CV. | Cung cấp khả năng tùy biến bố cục linh hoạt giúp ứng viên may đo hồ sơ phù hợp với từng định dạng chuẩn của các công ty đa quốc gia. |

| Tuần: 6 Thứ:      6                Ngày: 30/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tái cấu trúc giao diện sang phong cách Consumer SaaS (HeaderBar, Footer & Landing Page). | Loại bỏ Sidebar cố định 240px trong MainLayout.tsx để giải phóng 100% không gian ngang cho màn hình soạn thảo CV; xây dựng HeaderBar.tsx kính mờ (Glassmorphism) và Footer.tsx. | Chuyển sang bố cục HeaderBar tối giản giúp giao diện hiện đại chuẩn SaaS và tối đa hóa không gian thao tác trên màn hình nhỏ. |
| 13:00 - 17:00 | Tái cấu trúc giao diện sang phong cách Consumer SaaS (HeaderBar, Footer & Landing Page). | Xây dựng trang chủ Landing Page HomePage.tsx tại đường dẫn gốc / chuẩn Consumer SaaS (Linear/Stripe style); viết bộ test headerNavigation.test.ts và homePageData.test.ts pass 100%. | Chuyển sang bố cục HeaderBar tối giản giúp giao diện hiện đại chuẩn SaaS và tối đa hóa không gian thao tác trên màn hình nhỏ. |

| Tuần: 6 Thứ:      7                Ngày: 31/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hiện thực hóa tính năng "Mắt Thần ATS" (AtsParserEyeModal.tsx & atsParserEyeService.ts). | Xây dựng atsParserEyeService.ts phân tích cú pháp và trích xuất chuỗi Plain-Text chuẩn xác mà các hệ thống ATS quốc tế (Workday, Taleo) đọc ra. | Hiểu rõ cơ chế phân tích cú pháp của các hệ thống ATS quốc tế giúp bảo vệ hồ sơ sinh viên không bị loại oan uổng ngay từ vòng quét tự động. |
| 13:00 - 17:00 | Hiện thực hóa tính năng "Mắt Thần ATS" (AtsParserEyeModal.tsx & atsParserEyeService.ts). | Xây dựng AtsParserEyeModal.tsx cảnh báo rủi ro xáo trộn thứ tự từ ngữ trên layout 2 cột và cung cấp nút 1-click chuyển đổi nhanh sang Minimalist Harvard 1 cột (4 bài test pass 100%). | Hiểu rõ cơ chế phân tích cú pháp của các hệ thống ATS quốc tế giúp bảo vệ hồ sơ sinh viên không bị loại oan uổng ngay từ vòng quét tự động. |

| Tuần: 7 Thứ:      2                Ngày: 02/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Động Cơ Khảo Sát Lương Thị Trường AI (SalaryBenchmarkModal.tsx). | Xây dựng salaryBenchmarkService.ts: Nhận diện cấp bậc (Intern đến Lead), phân tích Tech Multiplier (React, Go, Cloud...) cộng thêm từ 10% đến 35% giá trị vào dải lương cơ bản. | Trang bị công cụ khảo sát dải lương thị trường theo Tech Stack giúp sinh viên có vị thế tự tin và biết cách đàm phán mức lương xứng đáng dựa trên bằng chứng đồ án thực tế. |
| 13:00 - 17:00 | Xây dựng Động Cơ Khảo Sát Lương Thị Trường AI (SalaryBenchmarkModal.tsx). | Xây dựng SalaryBenchmarkModal.tsx: Tận dụng số lượng đồ án Verified làm đòn bẩy nâng phân vị lương từ P50 lên P75-P85, gợi ý kịch bản đàm phán offer (4 bài test pass 100%). | Trang bị công cụ khảo sát dải lương thị trường theo Tech Stack giúp sinh viên có vị thế tự tin và biết cách đàm phán mức lương xứng đáng dựa trên bằng chứng đồ án thực tế. |

| Tuần: 7 Thứ:      3                Ngày: 03/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Widget Bản Đồ Nhiệt Theo Dõi CV (CvHeatmapWidget.tsx & cvTrackingAnalyticsService.ts). | Xây dựng cvTrackingAnalyticsService.ts đo lường các chỉ số tương tác thực tế: Tổng lượt xem, số NTD duy nhất, thời gian đọc trung bình (Avg Dwell Time) và tỷ lệ đọc hết trang. | Trực quan hóa dữ liệu đọc CV bằng Heatmap giúp ứng viên hiểu rõ nhà tuyển dụng quan tâm đến phần nào nhất để tối ưu hóa vị trí đặt thông tin quan trọng. |
| 13:00 - 17:00 | Xây dựng Widget Bản Đồ Nhiệt Theo Dõi CV (CvHeatmapWidget.tsx & cvTrackingAnalyticsService.ts). | Phát triển CvHeatmapWidget.tsx trực quan hóa % thời gian HR dừng lại ở từng mục (Kinh nghiệm, Đồ án, Kỹ năng) và tích hợp nhật ký Recruiter Visit Feed thời gian thực (3 bài test pass 100%). | Trực quan hóa dữ liệu đọc CV bằng Heatmap giúp ứng viên hiểu rõ nhà tuyển dụng quan tâm đến phần nào nhất để tối ưu hóa vị trí đặt thông tin quan trọng. |

| Tuần: 7 Thứ:      4                Ngày: 04/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Phát triển Hệ Thống Chuyển Đổi Dark/Light Mode & Đồng Bộ Giao Diện Toàn Ứng Dụng. | Xây dựng ThemeContext.tsx và component ThemeToggleSwitch.tsx quản lý trạng thái giao diện sáng/tối với bảng màu Slate/Indigo/Navy chống lóa mắt. | Chăm chút tính năng Dark Mode hoàn chỉnh nâng cao đáng kể trải nghiệm thị giác cho lập trình viên và nhà tuyển dụng khi duyệt hồ sơ vào ban đêm. |
| 13:00 - 17:00 | Phát triển Hệ Thống Chuyển Đổi Dark/Light Mode & Đồng Bộ Giao Diện Toàn Ứng Dụng. | Rà soát toàn bộ các modal và Canvas đảm bảo hiển thị sắc nét ở cả hai chế độ màu, loại bỏ hoàn toàn hiện tượng Flash of Unstyled Content (FOUC). | Chăm chút tính năng Dark Mode hoàn chỉnh nâng cao đáng kể trải nghiệm thị giác cho lập trình viên và nhà tuyển dụng khi duyệt hồ sơ vào ban đêm. |

| Tuần: 7 Thứ:      5                Ngày: 05/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Phòng Luyện Phỏng Vấn Kỹ Thuật War Room Thích Ứng 4 Chặng. | Xây dựng aiMockInterviewService.ts và selfInterviewService.ts hiện thực hóa 4 giai đoạn phỏng vấn: Elevator Pitch (120s), Deep-Dive & STAR Metrics, Live Incident Crisis, Skill Gap Defense. | Luyện tập phỏng vấn xử lý sự cố khẩn cấp (Live Incident) giúp ứng viên tôi luyện phản xạ bình tĩnh và tư duy giải quyết vấn đề thực tế trước các Tech Lead khó tính. |
| 13:00 - 17:00 | Xây dựng Phòng Luyện Phỏng Vấn Kỹ Thuật War Room Thích Ứng 4 Chặng. | Xây dựng AiMockInterviewModal.tsx và InterviewWarRoomModal.tsx xuất biểu đồ Radar 5 trụ cột và xếp loại tuyển dụng chuẩn BigTech (Strong Hire, Hire...); 7 bài test pass 100%. | Luyện tập phỏng vấn xử lý sự cố khẩn cấp (Live Incident) giúp ứng viên tôi luyện phản xạ bình tĩnh và tư duy giải quyết vấn đề thực tế trước các Tech Lead khó tính. |

| Tuần: 7 Thứ:      6                Ngày: 06/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hiện thực hóa Tính Năng Đồng Bộ Lịch Phỏng Vấn 2 Chiều (Reschedule Request). | Nâng cấp widget phỏng vấn trên Dashboard: Hiển thị ngày giờ, ghi chú, link Google Meet trực tiếp kèm nút Xác nhận ngay hoặc Yêu cầu đổi giờ. | Cơ chế tương tác lịch phỏng vấn 2 chiều giúp giải quyết dứt điểm tình trạng trùng lịch và tăng tính chuyên nghiệp trong giao tiếp giữa ứng viên và doanh nghiệp. |
| 13:00 - 17:00 | Hiện thực hóa Tính Năng Đồng Bộ Lịch Phỏng Vấn 2 Chiều (Reschedule Request). | Viết hàm requestInterviewRescheduleByStudent trong pipelineSync.ts tự động đồng bộ yêu cầu đổi lịch phỏng vấn sang pipeline của nhà tuyển dụng theo thời gian thực. | Cơ chế tương tác lịch phỏng vấn 2 chiều giúp giải quyết dứt điểm tình trạng trùng lịch và tăng tính chuyên nghiệp trong giao tiếp giữa ứng viên và doanh nghiệp. |

| Tuần: 7 Thứ:      7                Ngày: 07/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Kiểm thử hồi quy toàn diện (Full Regression Suite) & Đóng gói sản xuất Clean Build. | Thực thi toàn bộ bộ kiểm thử tự động của dự án: Đạt kỷ lục 22/22 Test Suites (82/82 Tests) Pass 100% không có bất kỳ lỗi nào. | Duy trì kỷ luật All-Green Tests và Clean Build ở mỗi mốc phát triển mang lại sự tự tin tuyệt đối về tính ổn định và độ tin cậy của phần mềm. |
| 13:00 - 17:00 | Kiểm thử hồi quy toàn diện (Full Regression Suite) & Đóng gói sản xuất Clean Build. | Chạy npx tsc --noEmit (0 lỗi TypeScript) và npm run build đóng gói bundle sản xuất tối ưu trong 23.88s; kiểm tra vận hành trơn tru trên môi trường staging. | Duy trì kỷ luật All-Green Tests và Clean Build ở mỗi mốc phát triển mang lại sự tự tin tuyệt đối về tính ổn định và độ tin cậy của phần mềm. |

| Tuần: 8 Thứ:      2                Ngày: 09/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Triển khai thử nghiệm người dùng Beta (User Acceptance Testing - UAT). | Tổ chức phiên thử nghiệm người dùng UAT với nhóm 15 sinh viên năm cuối ngành CNTT: Giao nhiệm vụ tạo CV từ JD thực tế của FPT Software và VNG. | Quan sát người dùng thực tế thao tác giúp phát hiện nhiều chi tiết nhỏ về mặt tương tác (micro-interactions) cần được tinh chỉnh để tăng tính trực quan. |
| 13:00 - 17:00 | Triển khai thử nghiệm người dùng Beta (User Acceptance Testing - UAT). | Ghi nhận nhật ký thao tác và phỏng vấn nhanh cảm nhận của người dùng về tính năng STAR Diagnostic, Mắt Thần ATS và Interview War Room. | Quan sát người dùng thực tế thao tác giúp phát hiện nhiều chi tiết nhỏ về mặt tương tác (micro-interactions) cần được tinh chỉnh để tăng tính trực quan. |

| Tuần: 8 Thứ:      3                Ngày: 10/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Phân tích kết quả UAT và Tinh chỉnh kích thước hiển thị in ấn chuẩn A4. | Tổng hợp danh sách 8 điểm góp ý từ đợt thử nghiệm UAT: Điều chỉnh kích thước font chữ in ấn xuống 10.5pt để vừa vặn hơn trên các khổ giấy hẹp. | Kiểm thử trên thiết bị vật lý thực tế (máy in và camera điện thoại) là bước bắt buộc để đảm bảo chất lượng đầu ra của sản phẩm in ấn. |
| 13:00 - 17:00 | Phân tích kết quả UAT và Tinh chỉnh kích thước hiển thị in ấn chuẩn A4. | Kiểm thử in thực tế trên 3 dòng máy in văn phòng phổ biến (HP LaserJet, Canon LBP, Brother); đảm bảo mã QR quét nhạy trong vòng 1 giây. | Kiểm thử trên thiết bị vật lý thực tế (máy in và camera điện thoại) là bước bắt buộc để đảm bảo chất lượng đầu ra của sản phẩm in ấn. |

| Tuần: 8 Thứ:      4                Ngày: 11/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tối ưu hóa SEO, OpenGraph Meta Tags và Tốc độ tải trang cho Public Showcase. | Cấu hình dynamic OpenGraph tags cho trang /showcase/:id: Hiển thị ảnh thumbnail dự án, tên ứng viên và danh sách tech stack khi chia sẻ link lên LinkedIn/Facebook. | Chăm chút trang Portfolio công khai giúp ứng viên tự tin gửi link profile cá nhân cho nhà tuyển dụng với hình ảnh xem trước chuyên nghiệp. |
| 13:00 - 17:00 | Tối ưu hóa SEO, OpenGraph Meta Tags và Tốc độ tải trang cho Public Showcase. | Tối ưu hóa hình ảnh webp và lazy loading; đo lường điểm hiệu năng Chrome Lighthouse đạt 98/100 điểm Performance và 100/100 điểm SEO. | Chăm chút trang Portfolio công khai giúp ứng viên tự tin gửi link profile cá nhân cho nhà tuyển dụng với hình ảnh xem trước chuyên nghiệp. |

| Tuần: 8 Thứ:      5                Ngày: 12/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Nâng cấp bộ xuất file PDF vector chất lượng cao (High-DPI PDF Export). | Tích hợp cấu hình print style sheet @media print chuyên sâu: Khóa chặt tỷ lệ trang 1:1, loại bỏ hoàn toàn viền trắng thừa khi lưu dạng PDF. | Xuất file PDF dạng văn bản vector (selectable text) giúp máy quét ATS bóc tách dữ liệu chính xác 100% so với việc xuất ảnh bitmap thông thường. |
| 13:00 - 17:00 | Nâng cấp bộ xuất file PDF vector chất lượng cao (High-DPI PDF Export). | Kiểm tra chất lượng văn bản vector khi phóng to 300% trên Adobe Acrobat Reader: Đảm bảo nét chữ sắc sảo, không bị vỡ hạt hay mờ nhòe. | Xuất file PDF dạng văn bản vector (selectable text) giúp máy quét ATS bóc tách dữ liệu chính xác 100% so với việc xuất ảnh bitmap thông thường. |

| Tuần: 8 Thứ:      6                Ngày: 13/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Đóng gói toàn bộ tài liệu kỹ thuật bàn giao (Developer Handover Guide & Architecture Spec). | Cập nhật hoàn chỉnh tài liệu kiến trúc docs/CONTEXT.md, sơ đồ luồng hệ thống docs/luong_chinh_he_thong.md và hướng dẫn triển khai deployment-guide.md. | Viết tài liệu bàn giao chuẩn mực và mạch lạc là kỹ năng quan trọng khẳng định tính chuyên nghiệp của một kỹ sư phần mềm khi kết thúc dự án. |
| 13:00 - 17:00 | Đóng gói toàn bộ tài liệu kỹ thuật bàn giao (Developer Handover Guide & Architecture Spec). | Đóng gói mã nguồn, kiểm tra lại toàn bộ file README.md và chuẩn bị tài liệu báo cáo thực tập tốt nghiệp chi tiết. | Viết tài liệu bàn giao chuẩn mực và mạch lạc là kỹ năng quan trọng khẳng định tính chuyên nghiệp của một kỹ sư phần mềm khi kết thúc dự án. |

| Tuần: 8 Thứ:      7                Ngày: 14/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Báo cáo nghiệm thu giai đoạn với Người hướng dẫn doanh nghiệp và Tổng kết kỳ thực tập. | Trình bày demo toàn bộ các tính năng của nền tảng ProfileHub trước đại diện Công ty TNHH Alpaca Solutions: Nhận đánh giá xuất sắc về tính thực chiến và độ hoàn thiện. | Trải nghiệm thực tập thực tế tại doanh nghiệp giúp chuyển hóa vững chắc kiến thức lý thuyết trên giảng đường thành năng lực xây dựng sản phẩm công nghệ hoàn chỉnh. |
| 13:00 - 17:00 | Báo cáo nghiệm thu giai đoạn với Người hướng dẫn doanh nghiệp và Tổng kết kỳ thực tập. | Ký nhận sổ theo dõi thực tập hàng tuần, hoàn thiện hồ sơ nghiệm thu thực tập tốt nghiệp và tổng kết kinh nghiệm quý báu đạt được trong suốt 8 tuần. | Trải nghiệm thực tập thực tế tại doanh nghiệp giúp chuyển hóa vững chắc kiến thức lý thuyết trên giảng đường thành năng lực xây dựng sản phẩm công nghệ hoàn chỉnh. |

