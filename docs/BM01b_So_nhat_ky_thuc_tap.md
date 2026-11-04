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
| 1 | 18/09/2026 - 19/09/2026 | |
| 2 | 21/09/2026 - 26/09/2026 | |
| 3 | 28/09/2026 - 03/10/2026 | |
| 4 | 05/10/2026 - 10/10/2026 | |
| 5 | 12/10/2026 - 16/10/2026 | |
| 6 | 19/10/2026 - 23/10/2026 | |
| 7 | 26/10/2026 - 30/10/2026 | |
| 8 | 02/11/2026 - 06/11/2026 | |
| 9 | 09/11/2026 - 13/11/2026 | |
| 10 | 16/11/2026 - 20/11/2026 | |
| 11 | 23/11/2026 - 27/11/2026 | |
| 12 | 30/11/2026 - 04/12/2026 | |
| 13 | 07/12/2026 - 11/12/2026 | |
| 14 | 14/12/2026 - 18/12/2026 | |
| 15 | 21/12/2026 - 25/12/2026 | |

---

### NỘI DUNG NHẬT KÝ CHI TIẾT THEO NGÀY (50 NGÀY LÀM VIỆC — BẮT ĐẦU 18/09/2026, 4 THỨ BẢY ĐẦU TIÊN)

| Tuần: 1 Thứ:      6                Ngày: 18/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Khảo sát bài toán nghiệp vụ & Phân tích yêu cầu hệ thống quản lý hồ sơ sinh viên (UniPortfolio). | Tìm hiểu thực trạng hồ sơ ứng tuyển của sinh viên CNTT, phân tích 3 trụ cột lớn: Đồ án thực tế (Project-Driven), Khớp nối bằng chứng (Evidence-Based Matching), và Luyện phỏng vấn AI. | Phân tích kỹ yêu cầu nghiệp vụ thực tế giúp định hình đúng cấu trúc hệ thống và tránh phải refactor nhiều ở các giai đoạn sau. |
| 13:00 - 17:00 | Khảo sát bài toán nghiệp vụ & Phân tích yêu cầu hệ thống quản lý hồ sơ sinh viên (UniPortfolio). | Lập sơ đồ phân rã chức năng (WBS) và chia lộ trình phát triển dự án thành các giai đoạn trọng tâm cô đọng. | Phân tích kỹ yêu cầu nghiệp vụ thực tế giúp định hình đúng cấu trúc hệ thống và tránh phải refactor nhiều ở các giai đoạn sau. |

| Tuần: 1 Thứ:      7                Ngày: 19/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Lựa chọn Tech Stack & Khởi tạo mã nguồn cơ sở (Base Code Setup). | Đánh giá công nghệ, chốt Tech Stack: React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, kết nối Supabase (PostgreSQL + Auth + Storage). | Chuẩn hóa quy chuẩn mã nguồn và TypeScript Strict Mode ngay từ đầu giúp loại bỏ 80% lỗi tiềm ẩn trong quá trình phát triển. |
| 13:00 - 17:00 | Lựa chọn Tech Stack & Khởi tạo mã nguồn cơ sở (Base Code Setup). | Cấu hình ESLint, Prettier, cấu trúc thư mục chuẩn mô hình Feature-driven và kiểm tra kết nối CSDL Supabase. | Chuẩn hóa quy chuẩn mã nguồn và TypeScript Strict Mode ngay từ đầu giúp loại bỏ 80% lỗi tiềm ẩn trong quá trình phát triển. |

| Tuần: 2 Thứ:      2                Ngày: 21/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Thiết kế lược đồ CSDL PostgreSQL trên Supabase & Cấu hình Row Level Security (RLS). | Thiết kế các bảng: users, student_profiles, projects, skills, certifications, student_cvs. Tạo khóa ngoại và composite indexes tối ưu tốc độ đọc. | Áp dụng RLS ở tầng CSDL là cách bảo mật dữ liệu sinh viên đa người dùng chuẩn mực nhất mà không làm phình to backend code. |
| 13:00 - 17:00 | Thiết kế lược đồ CSDL PostgreSQL trên Supabase & Cấu hình Row Level Security (RLS). | Kích hoạt chính sách RLS cho từng bảng dữ liệu, cấu hình Supabase Storage Bucket portfolio_files lưu trữ tài liệu PDF và hình ảnh minh chứng. | Áp dụng RLS ở tầng CSDL là cách bảo mật dữ liệu sinh viên đa người dùng chuẩn mực nhất mà không làm phình to backend code. |

| Tuần: 2 Thứ:      3                Ngày: 22/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Module Quản lý Đồ Án Sinh Viên (MyProjects.tsx) – Toàn trình CRUD. | Thiết kế giao diện danh sách đồ án dạng thẻ Card chuẩn Enterprise, phân loại theo môn học và gắn tags công nghệ (React, Node.js, PostgreSQL...). | Quản lý state form chặt chẽ giúp sinh viên dễ dàng cập nhật thông tin dự án nhiều giai đoạn mà không gây mất mát dữ liệu. |
| 13:00 - 17:00 | Xây dựng Module Quản lý Đồ Án Sinh Viên (MyProjects.tsx) – Toàn trình CRUD. | Phát triển Form Modal Thêm/Sửa đồ án, hỗ trợ trường Live Demo URL, GitHub Repo URL, tài liệu PDF đính kèm và modal xác nhận xóa an toàn. | Quản lý state form chặt chẽ giúp sinh viên dễ dàng cập nhật thông tin dự án nhiều giai đoạn mà không gây mất mát dữ liệu. |

| Tuần: 2 Thứ:      4                Ngày: 23/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Module Quản lý Chứng Chỉ (Certificates.tsx) & In-App Document Reader. | Xây dựng giao diện lưu trữ chứng chỉ nghề nghiệp, tính năng đánh dấu thành tựu nổi bật (is_featured) và kéo-thả upload file. | Trải nghiệm xem trước tài liệu tức thì (sandbox iframe) giúp tăng tính chuyên nghiệp của nền tảng. |
| 13:00 - 17:00 | Xây dựng Module Quản lý Chứng Chỉ (Certificates.tsx) & In-App Document Reader. | Phát triển Modal xem trước file PDF/Ảnh nội tuyến (In-app Document Reader) giúp nhà tuyển dụng xem ngay chứng chỉ mà không cần tải về. | Trải nghiệm xem trước tài liệu tức thì (sandbox iframe) giúp tăng tính chuyên nghiệp của nền tảng. |

| Tuần: 2 Thứ:      5                Ngày: 24/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Dựng khung hiển thị tương tác WYSIWYG trên Canvas A4 và cơ chế render linh hoạt. | Phân tích thông số kỹ thuật in ấn: A4 Portrait ở độ phân giải 96 DPI (chiều cao 1122.5px), tính toán khoảng cách dòng, lề trang tiêu chuẩn. | Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF. |
| 13:00 - 17:00 | Dựng khung hiển thị tương tác WYSIWYG trên Canvas A4 và cơ chế render linh hoạt. | Phát triển InteractiveCVCanvas.tsx hỗ trợ chỉnh sửa inline trên từng dòng text, cập nhật state tức thì khi người dùng gõ phím. | Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF. |

| Tuần: 2 Thứ:      6                Ngày: 25/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tối ưu hóa UI/UX Canvas, xử lý responsive và đồng bộ state tức thì. | Tối ưu hóa các thao tác chỉnh sửa trực tiếp trên Canvas, chống hiện tượng nhảy layout khi gõ nội dung dài. | Đảm bảo trải nghiệm trực quan (WYSIWYG) mượt mà là chìa khóa giúp giữ chân người dùng trong các ứng dụng biên tập tài liệu. |
| 13:00 - 17:00 | Tối ưu hóa UI/UX Canvas, xử lý responsive và đồng bộ state tức thì. | Kiểm thử tương thích trên các kích thước màn hình từ 13 inch đến 27 inch, đảm bảo canvas luôn căn giữa hoàn hảo. | Đảm bảo trải nghiệm trực quan (WYSIWYG) mượt mà là chìa khóa giúp giữ chân người dùng trong các ứng dụng biên tập tài liệu. |

| Tuần: 2 Thứ:      7                Ngày: 26/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback). | Viết các hàm đồng bộ trong cvService.ts kết nối với bảng student_cvs trên Supabase để tự động lưu trạng thái CV. | Cơ chế Fallback hai lớp (Cloud + LocalStorage) giúp ứng viên an tâm tuyệt đối khi thao tác soạn thảo nội dung dài. |
| 13:00 - 17:00 | Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback). | Thiết lập bộ đệm LocalStorage lưu trữ tạm thời phiên soạn thảo, chống mất dữ liệu khi mất mạng hoặc reload trang đột ngột. | Cơ chế Fallback hai lớp (Cloud + LocalStorage) giúp ứng viên an tâm tuyệt đối khi thao tác soạn thảo nội dung dài. |

| Tuần: 3 Thứ:      2                Ngày: 28/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Họp Review tiến độ, đánh giá kiến trúc hệ thống & Lập kế hoạch tinh gọn (Lean MVP). | Đo lường tài nguyên hệ thống, họp kỹ thuật với Tech Lead và thống nhất chiến lược "Lean MVP": Cắt giảm ngay các tính năng ngoài lề để dồn sức cho giá trị cốt lõi. | Dũng cảm cắt bỏ tính năng không hiệu quả sớm giúp bảo toàn nguồn lực phát triển cho các tính năng thực sự tạo ra giá trị. |
| 13:00 - 17:00 | Họp Review tiến độ, đánh giá kiến trúc hệ thống & Lập kế hoạch tinh gọn (Lean MVP). | Rà soát toàn bộ cây thư mục mã nguồn, lập danh sách các module dư thừa cần loại bỏ để tối ưu hiệu năng và tinh giản trải nghiệm. | Dũng cảm cắt bỏ tính năng không hiệu quả sớm giúp bảo toàn nguồn lực phát triển cho các tính năng thực sự tạo ra giá trị. |

| Tuần: 3 Thứ:      3                Ngày: 29/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | [CẮT BỎ] Xóa bỏ hoàn toàn Microservice Python Chatbot phụ & Viết lại sang TypeScript. | Xóa bỏ thư mục profilehub/chatbot_service gồm app.py, skill_mining.py, requirements.txt, knowledge_base.json, loại bỏ hạ tầng triển khai cồng kềnh. | TypeScript native execution nhanh gấp 3 lần việc gọi HTTP API sang một tiến trình Python riêng lẻ và loại bỏ hoàn toàn gánh nặng cài đặt môi trường. |
| 13:00 - 17:00 | [CẮT BỎ] Xóa bỏ hoàn toàn Microservice Python Chatbot phụ & Viết lại sang TypeScript. | Viết lại thuật toán nhận diện từ khóa kỹ thuật (Tech Dictionary) bằng TypeScript native module trực tiếp trong src/services/aiCvService.ts. | TypeScript native execution nhanh gấp 3 lần việc gọi HTTP API sang một tiến trình Python riêng lẻ và loại bỏ hoàn toàn gánh nặng cài đặt môi trường. |

| Tuần: 3 Thứ:      4                Ngày: 30/09/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | [CẮT BỎ] Xóa bỏ Module Khảo sát tính cách MBTI & Dọn sạch thanh điều hướng. | Xóa bỏ mbtiService.ts, MBTIAssessment.tsx, CandidateMBTIInsightCard.tsx, types/mbti.ts khỏi codebase. | Nhà tuyển dụng kỹ thuật quan tâm đến stack công nghệ và sản phẩm chạy thật hơn là các bài trắc nghiệm tính cách chung chung. |
| 13:00 - 17:00 | [CẮT BỎ] Xóa bỏ Module Khảo sát tính cách MBTI & Dọn sạch thanh điều hướng. | Dọn sạch các nút bấm và tab MBTI trên Sidebar và thanh điều hướng chính, giải phóng bộ nhớ ứng dụng. | Nhà tuyển dụng kỹ thuật quan tâm đến stack công nghệ và sản phẩm chạy thật hơn là các bài trắc nghiệm tính cách chung chung. |

| Tuần: 3 Thứ:      5                Ngày: 01/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | [CẮT BỎ] Xóa bỏ Trình mô phỏng phỏng vấn bằng Chatbot & Chuẩn bị tích hợp Voice AI thực chiến. | Gỡ bỏ interviewCoachService.ts (dạng chatbot text đơn giản, thiếu tương tác thực tế) và xóa bỏ các view phỏng vấn tĩnh. | Luyện phỏng vấn bằng chatbot gõ chữ không mô phỏng được áp lực thực tế trong phòng phỏng vấn kỹ thuật. |
| 13:00 - 17:00 | [CẮT BỎ] Xóa bỏ Trình mô phỏng phỏng vấn bằng Chatbot & Chuẩn bị tích hợp Voice AI thực chiến. | Lập kiến trúc cho mô phỏng phỏng vấn kỹ thuật bám sát trực tiếp vào đồ án và các câu hỏi xoáy chuyên môn thay vì chat vu vơ. | Luyện phỏng vấn bằng chatbot gõ chữ không mô phỏng được áp lực thực tế trong phòng phỏng vấn kỹ thuật. |

| Tuần: 3 Thứ:      6                Ngày: 02/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng tính năng Gợi ý hoàn thiện mô tả kỹ năng bằng AI (Skill Coach). | Thiết kế giao diện gợi ý kỹ năng theo vị trí công việc (Frontend, Backend, Fullstack), đối soát với bộ từ điển công nghệ chuẩn. | Đề xuất kỹ năng trúng đích giúp hồ sơ ứng viên nổi bật hơn trước bộ lọc tự động của nhà tuyển dụng. |
| 13:00 - 17:00 | Xây dựng tính năng Gợi ý hoàn thiện mô tả kỹ năng bằng AI (Skill Coach). | Viết logic đề xuất kỹ năng còn thiếu dựa trên mục tiêu nghề nghiệp của sinh viên, hỗ trợ thêm nhanh vào CV 1-click. | Đề xuất kỹ năng trúng đích giúp hồ sơ ứng viên nổi bật hơn trước bộ lọc tự động của nhà tuyển dụng. |

| Tuần: 3 Thứ:      7                Ngày: 03/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tối ưu hóa Single-Layout & Dọn sạch Router toàn hệ thống. | Refactor lại MainLayout.tsx và Sidebar.tsx, gỡ bỏ các route mồ côi (dead routes) sau khi cắt bỏ các module thừa. | Tinh gọn thanh điều hướng giúp người dùng tập trung tối đa vào các thao tác chính. |
| 13:00 - 17:00 | Tối ưu hóa Single-Layout & Dọn sạch Router toàn hệ thống. | Kiểm tra lại toàn bộ liên kết nội bộ, đảm bảo chuyển trang mượt mà không có lỗi 404 hoặc warning console. | Tinh gọn thanh điều hướng giúp người dùng tập trung tối đa vào các thao tác chính. |

| Tuần: 4 Thứ:      2                Ngày: 05/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Trụ Cột 1: Cơ chế Đề xuất & Xếp hạng Ứng viên Dựa Trên Bằng Chứng (Evidence-Based Matching). | Xây dựng thuật toán tính điểm khớp nối kỹ thuật (Match Score 0-100%) giữa bộ kỹ năng của sinh viên với Job Description (JD). | Định lượng mức độ tương thích kỹ năng giúp nhà tuyển dụng rút ngắn 70% thời gian duyệt hồ sơ ban đầu. |
| 13:00 - 17:00 | Xây dựng Trụ Cột 1: Cơ chế Đề xuất & Xếp hạng Ứng viên Dựa Trên Bằng Chứng (Evidence-Based Matching). | Thiết kế giao diện thẻ ứng viên hiển thị huy hiệu xếp hạng, thanh đo % Match và các chip kỹ năng nổi bật. | Định lượng mức độ tương thích kỹ năng giúp nhà tuyển dụng rút ngắn 70% thời gian duyệt hồ sơ ban đầu. |

| Tuần: 4 Thứ:      3                Ngày: 06/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tích hợp Modal Chi Tiết Khớp Nối (Match Detail Modal) & Soi Chi Tiết Dự Án. | Phát triển MatchDetailModal.tsx phân tích sâu: Kỹ năng trùng khớp hoàn toàn, kỹ năng tương đương và kỹ năng còn thiếu. | Minh bạch hóa lý do đề xuất giúp tăng mức độ tin cậy của thuật toán gợi ý trong mắt nhà tuyển dụng. |
| 13:00 - 17:00 | Tích hợp Modal Chi Tiết Khớp Nối (Match Detail Modal) & Soi Chi Tiết Dự Án. | Bổ sung danh sách các đồ án liên quan trực tiếp đến yêu cầu của JD, hỗ trợ mở xem chi tiết bằng chứng đồ án ngay trên modal. | Minh bạch hóa lý do đề xuất giúp tăng mức độ tin cậy của thuật toán gợi ý trong mắt nhà tuyển dụng. |

| Tuần: 4 Thứ:      4                Ngày: 07/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Bộ Lọc Ứng Viên Đa Chiều Cho Nhà Tuyển Dụng (Candidate Filter). | Thiết kế bộ lọc kết hợp: Lọc theo vị trí (Frontend, Backend, DevOps, Data), lọc theo điểm Match tối thiểu và lọc theo công nghệ bắt buộc. | Xây dựng bộ lọc đa chiều ngay từ tầng CSDL giúp giảm tải xử lý dữ liệu cho phía client-side. |
| 13:00 - 17:00 | Xây dựng Bộ Lọc Ứng Viên Đa Chiều Cho Nhà Tuyển Dụng (Candidate Filter). | Tối ưu hóa truy vấn CSDL Supabase với bộ lọc kết hợp, đảm bảo thời gian trả lời truy vấn dưới 100ms trên tập dữ liệu mẫu. | Xây dựng bộ lọc đa chiều ngay từ tầng CSDL giúp giảm tải xử lý dữ liệu cho phía client-side. |

| Tuần: 4 Thứ:      5                Ngày: 08/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Khảo sát và rà soát cơ chế Giảng viên xác thực (Teacher Verification) trên thực tế. | Khảo sát thực nghiệm quy trình giảng viên chấm điểm và xác thực đồ án cho sinh viên trên hệ thống. | Các tính năng phụ thuộc vào sự phê duyệt thủ công của bên thứ ba thường gây ra điểm nghẽn nghiêm trọng cho luồng sản phẩm. |
| 13:00 - 17:00 | Khảo sát và rà soát cơ chế Giảng viên xác thực (Teacher Verification) trên thực tế. | Phát hiện nút thắt cổ chai nghiêm trọng: Giảng viên bận rộn không kịp phê duyệt khiến đồ án của sinh viên bị treo trạng thái "Pending Verification" hàng tuần. | Các tính năng phụ thuộc vào sự phê duyệt thủ công của bên thứ ba thường gây ra điểm nghẽn nghiêm trọng cho luồng sản phẩm. |

| Tuần: 4 Thứ:      6                Ngày: 09/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Khảo sát phản hồi sinh viên và chuẩn bị bước chuyển kiến trúc (Pivot sang Evidence-Based). | Tổng hợp phản hồi thực tế từ 15 sinh viên dùng thử; ghi nhận 85% gặp tắc nghẽn do giảng viên bận chấm đồ án. | Luôn lắng nghe phản hồi của người dùng thực tế; không bảo thủ giữ lại tính năng tạo ra nút thắt cổ chai. |
| 13:00 - 17:00 | Khảo sát phản hồi sinh viên và chuẩn bị bước chuyển kiến trúc (Pivot sang Evidence-Based). | Họp nội bộ với Mentor công ty, phân tích nguyên nhân gốc rễ và thống nhất chuẩn bị chuyển đổi từ "Giảng viên xác thực" sang "Bằng chứng thực chiến (Evidence-Based)". | Luôn lắng nghe phản hồi của người dùng thực tế; không bảo thủ giữ lại tính năng tạo ra nút thắt cổ chai. |

| Tuần: 4 Thứ:      7                Ngày: 10/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Kiểm thử toàn diện các tầng dịch vụ cốt lõi (TDD Green Check) & Typecheck. | Chạy 5 test suites ban đầu: aiCvService.test.ts, cvManagement.test.ts, aiCvGeneration.test.ts, aiCvCoachService.test.ts, markdownExporter.test.ts. Đạt 20/20 tests pass 100%. | TDD mang lại sự tự tin tuyệt đối trước khi bước vào giai đoạn thiết kế tính năng mới. |
| 13:00 - 17:00 | Kiểm thử toàn diện các tầng dịch vụ cốt lõi (TDD Green Check) & Typecheck. | Kiểm tra npm run build, xác nhận TypeScript biên dịch không lỗi và hệ thống hoàn toàn sẵn sàng cho tuần cao điểm phát triển tính năng mới. | TDD mang lại sự tự tin tuyệt đối trước khi bước vào giai đoạn thiết kế tính năng mới. |

| Tuần: 5 Thứ:      2                Ngày: 12/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Ban hành Quyết định Kiến trúc ADR 0001: Pivot sang Nền tảng CV Định Hướng Đồ Án. | Soạn thảo và ban hành tài liệu Architecture Decision Record ADR 0001 tại docs/adr/0001-project-driven-cv-builder.md. | Thay thế dấu xác nhận hành chính bằng bằng chứng khách quan (mã nguồn, sản phẩm chạy thật) là tư duy chuẩn mực của ngành phần mềm hiện đại. |
| 13:00 - 17:00 | Ban hành Quyết định Kiến trúc ADR 0001: Pivot sang Nền tảng CV Định Hướng Đồ Án. | [CẮT BỎ] Xóa sổ toàn bộ TeacherVerificationView.tsx, teacherVerificationService.ts và trường is_verified; dồn 100% tài nguyên sang bằng chứng thực chiến. | Thay thế dấu xác nhận hành chính bằng bằng chứng khách quan (mã nguồn, sản phẩm chạy thật) là tư duy chuẩn mực của ngành phần mềm hiện đại. |

| Tuần: 5 Thứ:      3                Ngày: 13/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Cập nhật Tài liệu Đặc tả Yêu cầu Hệ thống Chính thức & Bảng Thuật Ngữ Miền. | Bổ sung Mục 7.4 (Luồng đưa dự án vào CV và đồng bộ ngược Reverse Sync) vào tài liệu đặc tả chính thức ProfileHub_Discovery_Requirements.md. | Chuẩn hóa ngôn ngữ miền chung (Ubiquitous Language) giúp việc viết mã nguồn và đặt tên biến có tính đồng nhất cao. |
| 13:00 - 17:00 | Cập nhật Tài liệu Đặc tả Yêu cầu Hệ thống Chính thức & Bảng Thuật Ngữ Miền. | Định nghĩa bảng thuật ngữ chuẩn trong docs/CONTEXT.md: Master Project, CV Project Instance, Reverse Sync, Scoped Contribution, STAR Bullet, Anti-Hallucination Guard, Page-Budget Guard, Evidence Showcase. | Chuẩn hóa ngôn ngữ miền chung (Ubiquitous Language) giúp việc viết mã nguồn và đặt tên biến có tính đồng nhất cao. |

| Tuần: 5 Thứ:      4                Ngày: 14/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Phân rã kỹ thuật thành 6 Tracer-Bullet Tickets & Lập kế hoạch TDD song hành. | Soạn thảo chi tiết tiêu chí nghiệm thu (Acceptance Criteria) cho Ticket 01 (Reverse Sync), Ticket 02 (Scoped Contribution), Ticket 03 (Project Fit Explainer) trong .scratch/project-driven-cv-builder/issues/. | Chia nhỏ bài toán lớn thành các ticket dạng "tracer-bullet" giúp kiểm soát tiến độ và kiểm thử độc lập dễ dàng. |
| 13:00 - 17:00 | Phân rã kỹ thuật thành 6 Tracer-Bullet Tickets & Lập kế hoạch TDD song hành. | Soạn thảo chi tiết tiêu chí nghiệm thu cho Ticket 04 (STAR Diff Review), Ticket 05 (Page-Budget Guard), Ticket 06 (Evidence Showcase QR) và lập kế hoạch triển khai song hành TDD. | Chia nhỏ bài toán lớn thành các ticket dạng "tracer-bullet" giúp kiểm soát tiến độ và kiểm thử độc lập dễ dàng. |

| Tuần: 5 Thứ:      5                Ngày: 15/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hiện thực hóa Ticket 01 (Reverse Sync & Toast) & Ticket 02 (Scoped Contribution). | Mở rộng ProjectItem với syncToMasterProfile?: boolean. Viết hàm cvService.syncCvProjectsToMaster tự động upsert dự án mới vào Supabase khi lưu CV. Viết projectReverseSync.test.ts kiểm thử TDD (3/3 pass). | Trải nghiệm Reverse Sync kèm thông báo Toast không gây gián đoạn (non-blocking) giúp ứng viên duy trì mạch tập trung khi gõ phím. |
| 13:00 - 17:00 | Hiện thực hóa Ticket 01 (Reverse Sync & Toast) & Ticket 02 (Scoped Contribution). | Thêm trường scopeType: 'solo' | 'team', teamSize, systemContext. Render huy hiệu [👥 Đồ án nhóm - X thành viên] hoặc [👤 Đồ án cá nhân] trên CV. Viết scopedContribution.test.ts kiểm thử (3/3 pass). | Trải nghiệm Reverse Sync kèm thông báo Toast không gây gián đoạn (non-blocking) giúp ứng viên duy trì mạch tập trung khi gõ phím. |

| Tuần: 5 Thứ:      6                Ngày: 16/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hiện thực hóa Ticket 03 (Project Fit Explainer) & Ticket 04 (STAR Bullet & Anti-Hallucination Guard). | Xây dựng projectFitService.evaluateProjectFit: Đối chiếu đồ án với JD, tính % tương thích, chip từ khóa trùng khớp/thiếu. Xây dựng ProjectFitExplainerModal.tsx chọn đồ án phù hợp vào CV 1-click. Viết test (3/3 pass). | Minh bạch hóa lý do đề xuất của AI và cung cấp bảng Diff Review giúp ứng viên làm chủ hoàn toàn nội dung trên CV của mình. |
| 13:00 - 17:00 | Hiện thực hóa Ticket 03 (Project Fit Explainer) & Ticket 04 (STAR Bullet & Anti-Hallucination Guard). | Xây dựng starBulletService.adaptProjectBulletsWithStar chuẩn hóa mô tả STAR có số liệu định lượng. Xây dựng StarDiffReviewModal.tsx và tích hợp Anti-Hallucination Guard chặn AI tự bịa công nghệ. Viết test (3/3 pass). | Minh bạch hóa lý do đề xuất của AI và cung cấp bảng Diff Review giúp ứng viên làm chủ hoàn toàn nội dung trên CV của mình. |

| Tuần: 6 Thứ:      2                Ngày: 19/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hiện thực hóa Ticket 05 (Page-Budget Guard) & Ticket 06 (Evidence Showcase QR), nghiệm thu v1. | Xây dựng pageBudgetService đo chiều cao render khổ A4, hiển thị huy hiệu 📊 XX% A4, phát triển 1-Click Auto-Condense co vừa 1 trang A4, bổ sung đổi bố cục 1/2 cột (3/3 test pass). | Đảm bảo CV vừa vặn đúng 1 trang A4 và có mã QR quét demo là hai yếu tố ghi điểm cực mạnh trong mắt nhà tuyển dụng. |
| 13:00 - 17:00 | Hiện thực hóa Ticket 05 (Page-Budget Guard) & Ticket 06 (Evidence Showcase QR), nghiệm thu v1. | Render link Live Demo và GitHub Repo chuẩn ATS, tích hợp qrcode.react sinh mã QR 28px in trên A4 quét demo (3/3 test pass); chạy toàn bộ 11/11 test suites pass 100% và đóng gói build nghiệm thu v1. | Đảm bảo CV vừa vặn đúng 1 trang A4 và có mã QR quét demo là hai yếu tố ghi điểm cực mạnh trong mắt nhà tuyển dụng. |

| Tuần: 6 Thứ:      3                Ngày: 20/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Phân tích nghiệp vụ thư ứng tuyển trong ngành IT và thiết kế kiến trúc Contextual Application Pitch (ADR 0002). | Họp phản biện (/grill-with-docs) làm rõ bất cập của Cover Letter truyền thống; ban hành quyết định kiến trúc ADR 0002 định nghĩa Contextual Application Pitch gắn liền với cặp (CV Project Instance, JD). | Tránh tạo tài liệu độc lập gây phình to hệ thống; nhúng ngữ cảnh trực tiếp vào bản CV giúp tạo tính gắn kết chặt chẽ giữa đồ án thực tế và yêu cầu tuyển dụng. |
| 13:00 - 17:00 | Phân tích nghiệp vụ thư ứng tuyển trong ngành IT và thiết kế kiến trúc Contextual Application Pitch (ADR 0002). | Xây dựng applicationPitchService.ts và ApplicationPitchModal.tsx (< 250 từ, 1-Click Copy, cơ chế Hard-gating bắt buộc có JD và ít nhất 1 đồ án); viết 4 bài test TDD pass 100%. | Tránh tạo tài liệu độc lập gây phình to hệ thống; nhúng ngữ cảnh trực tiếp vào bản CV giúp tạo tính gắn kết chặt chẽ giữa đồ án thực tế và yêu cầu tuyển dụng. |

| Tuần: 6 Thứ:      4                Ngày: 21/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Trụ Cột 3: Project Technical Defense Briefing (Huấn luyện phòng thủ đồ án trước Tech Lead). | Nghiên cứu các dạng câu hỏi xoáy phỏng vấn kỹ thuật theo từng Tech Stack: Redis Cache Invalidation, PostgreSQL EXPLAIN & Indexing, Node.js Event Loop, React Re-render. | Trang bị bản lĩnh bảo vệ đồ án trước câu hỏi hóc búa của Tech Lead giúp ứng viên tự tin chứng minh năng lực thực chất ở vòng phỏng vấn kỹ thuật. |
| 13:00 - 17:00 | Xây dựng Trụ Cột 3: Project Technical Defense Briefing (Huấn luyện phòng thủ đồ án trước Tech Lead). | Xây dựng projectDefenseService.ts và ProjectDefenseModal.tsx trang bị Top 3 câu hỏi xoáy, bản giải trình Trade-off và kịch bản Debugging Scaffold 4 pha; nâng test suites lên 13/13 (46/46 tests pass). | Trang bị bản lĩnh bảo vệ đồ án trước câu hỏi hóc búa của Tech Lead giúp ứng viên tự tin chứng minh năng lực thực chất ở vòng phỏng vấn kỹ thuật. |

| Tuần: 6 Thứ:      5                Ngày: 22/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Nghiên cứu nguyên tắc "Zero Fake Metrics" & Xây dựng công cụ "Soi CV Chuẩn STAR". | Khẳng định nguyên tắc chống bịa đặt số liệu viển vông; xác lập 4 nguồn số liệu kỹ thuật thực tế: EXPLAIN query cost, k6 load test throughput (req/s), Lighthouse performance và Vitest test coverage. | Số liệu trong CV công nghệ phải có bằng chứng kỹ thuật kiểm chứng được, tránh việc ứng viên bị Tech Lead đánh trượt vì thiếu trung thực (Dishonesty) khi bị truy vấn sâu. |
| 13:00 - 17:00 | Nghiên cứu nguyên tắc "Zero Fake Metrics" & Xây dựng công cụ "Soi CV Chuẩn STAR". | Xây dựng starDiagnosticService.ts: Bắt lỗi từ ngữ thụ động ("tham gia", "hỗ trợ"), chấm điểm STAR Score (0-100), tự động sinh câu hỏi gợi mở khơi sâu trải nghiệm thực tế. | Số liệu trong CV công nghệ phải có bằng chứng kỹ thuật kiểm chứng được, tránh việc ứng viên bị Tech Lead đánh trượt vì thiếu trung thực (Dishonesty) khi bị truy vấn sâu. |

| Tuần: 6 Thứ:      6                Ngày: 23/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hoàn thiện STAR Wizard, Tích hợp Canvas & Thiết lập CI/CD GitHub Actions. | Xây dựng modal StarCvDiagnosticModal.tsx hỗ trợ cả 2 chế độ: "Soi CV Sẵn Có" và "STAR Wizard Từ Trang Giấy Trắng", tích hợp nút tác vụ 1-click đưa vào CV Canvas (5 bài test pass 100%). | Gom việc tích hợp giao diện STAR Wizard với quy trình kiểm thử hiệu năng CI/CD vào ngày thứ 6 giúp đảm bảo tính ổn định cao của mã nguồn trước khi sang tuần mới. |
| 13:00 - 17:00 | Hoàn thiện STAR Wizard, Tích hợp Canvas & Thiết lập CI/CD GitHub Actions. | Cấu hình CI/CD GitHub Actions (.github/workflows/3dwebsite-ci.yml, deploy, release, rollback), chạy kiểm thử hồi quy 14/14 test suites (51/51 tests pass) và kiểm tra hiệu năng đóng gói build sạch. | Gom việc tích hợp giao diện STAR Wizard với quy trình kiểm thử hiệu năng CI/CD vào ngày thứ 6 giúp đảm bảo tính ổn định cao của mã nguồn trước khi sang tuần mới. |

| Tuần: 7 Thứ:      2                Ngày: 26/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Nghiên cứu và thiết kế mô phỏng góc nhìn ATS (ATS Eye-View Heatmap). | Khảo sát nguyên lý hoạt động của các hệ thống Applicant Tracking System (ATS) phổ biến và hành vi quét mắt (F-pattern scan) của nhà tuyển dụng. | Hiểu rõ cơ chế chấm điểm của ATS giúp định hình chính xác các vùng không gian chiến lược trên bản CV. |
| 13:00 - 17:00 | Nghiên cứu và thiết kế mô phỏng góc nhìn ATS (ATS Eye-View Heatmap). | Thiết kế kiến trúc module atsHeatmapService.ts phân tích mật độ phân bổ từ khóa kỹ thuật và tỷ lệ phủ nội dung theo từng vùng thị giác trên CV. | Hiểu rõ cơ chế chấm điểm của ATS giúp định hình chính xác các vùng không gian chiến lược trên bản CV. |

| Tuần: 7 Thứ:      3                Ngày: 27/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng ATS Heatmap Visualizer & Thống kê từ khóa kỹ thuật. | Phát triển component AtsHeatmapOverlay.tsx vẽ bản đồ nhiệt trực quan (đỏ - vàng - xanh) đè lên bản vẽ Canvas A4. | Biểu diễn trực quan bằng Heatmap trực tiếp trên Canvas giúp sinh viên dễ dàng nhận diện điểm yếu trong bố cục CV hơn là các con số khô khan. |
| 13:00 - 17:00 | Xây dựng ATS Heatmap Visualizer & Thống kê từ khóa kỹ thuật. | Bổ sung bảng thống kê Keyword Frequency, cảnh báo nguy cơ keyword stuffing hoặc thiếu hụt kỹ năng cốt lõi so với JD mục tiêu. | Biểu diễn trực quan bằng Heatmap trực tiếp trên Canvas giúp sinh viên dễ dàng nhận diện điểm yếu trong bố cục CV hơn là các con số khô khan. |

| Tuần: 7 Thứ:      4                Ngày: 28/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Phát triển Module Interview War Room & Trình mô phỏng phỏng vấn âm thanh. | Thiết kế giao diện phòng luyện phỏng vấn kỹ thuật InterviewWarRoom.tsx với đồng hồ đếm ngược và trạng thái micro. | Luyện nói thành tiếng trước micro giúp ứng viên rèn luyện phản xạ nhanh và sự lưu loát trước khi bước vào phỏng vấn thực chiến. |
| 13:00 - 17:00 | Phát triển Module Interview War Room & Trình mô phỏng phỏng vấn âm thanh. | Tích hợp Web Speech API (Speech-to-Text) thu âm câu trả lời của ứng viên, tự động chuyển thành văn bản để phân tích cấu trúc phản biện STAR. | Luyện nói thành tiếng trước micro giúp ứng viên rèn luyện phản xạ nhanh và sự lưu loát trước khi bước vào phỏng vấn thực chiến. |

| Tuần: 7 Thứ:      5                Ngày: 29/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tích hợp tính năng Khảo sát dải lương thị trường theo thời gian thực (Salary Benchmark). | Xây dựng cơ sở dữ liệu dải lương thị trường IT Việt Nam phân theo Level (Intern, Fresher, Junior) và theo Tech Stack (React, Node.js, Golang, Python). | Cung cấp số liệu lương thực tế giúp sinh viên CNTT tự tin hơn trong vòng đàm phán đãi ngộ với nhà tuyển dụng. |
| 13:00 - 17:00 | Tích hợp tính năng Khảo sát dải lương thị trường theo thời gian thực (Salary Benchmark). | Xây dựng SalaryBenchmarkWidget.tsx hiển thị biểu đồ dải lương p25, p50, p75 và gợi ý mức lương kỳ vọng phù hợp với năng lực dự án thực tế. | Cung cấp số liệu lương thực tế giúp sinh viên CNTT tự tin hơn trong vòng đàm phán đãi ngộ với nhà tuyển dụng. |

| Tuần: 7 Thứ:      6                Ngày: 30/10/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Module Quản lý Đa Phiên Bản CV (Multi-Version CVs) & Tối ưu hiệu năng. | Mở rộng lược đồ CSDL cho phép một sinh viên tạo và quản lý nhiều bản CV may đo riêng cho từng vị trí ứng tuyển (Frontend CV, Backend CV, Fullstack CV). | May đo CV riêng cho từng vị trí tuyển dụng làm tăng cơ hội được mời phỏng vấn lên gấp 3 lần so với việc dùng một bản CV chung cho mọi công ty. |
| 13:00 - 17:00 | Xây dựng Module Quản lý Đa Phiên Bản CV (Multi-Version CVs) & Tối ưu hiệu năng. | Phát triển giao diện quản lý phiên bản CV dạng lưới thẻ, hỗ trợ nhân bản (clone), gắn nhãn trạng thái và kiểm tra hiệu năng đóng gói hoàn tất tuần 7. | May đo CV riêng cho từng vị trí tuyển dụng làm tăng cơ hội được mời phỏng vấn lên gấp 3 lần so với việc dùng một bản CV chung cho mọi công ty. |

| Tuần: 8 Thứ:      2                Ngày: 02/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Thiết kế và xây dựng Application Tracker dạng bảng Kanban. | Khảo sát nhu cầu theo dõi tiến trình nộp đơn của sinh viên, thiết kế luồng trạng thái 5 cột: Wishlist -> Applied -> Interviewing -> Offer -> Rejected. | Giao diện Kanban giúp sinh viên quản lý lộ trình tìm việc một cách trực quan, tránh tình trạng quên lịch phỏng vấn hoặc gửi trùng lặp hồ sơ. |
| 13:00 - 17:00 | Thiết kế và xây dựng Application Tracker dạng bảng Kanban. | Xây dựng component ApplicationKanbanBoard.tsx với khả năng kéo thả card linh hoạt và lưu trạng thái ứng tuyển tức thì vào CSDL Supabase. | Giao diện Kanban giúp sinh viên quản lý lộ trình tìm việc một cách trực quan, tránh tình trạng quên lịch phỏng vấn hoặc gửi trùng lặp hồ sơ. |

| Tuần: 8 Thứ:      3                Ngày: 03/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tích hợp AI Cover Letter & Email Generator may đo theo từng thẻ Kanban. | Xây dựng modal CoverLetterGeneratorModal.tsx: Tự động trích xuất thông tin công ty, vị trí ứng tuyển từ thẻ Kanban để may đo nội dung thư. | Cung cấp sẵn các mẫu thư chuyên nghiệp giúp ứng viên duy trì sự chuẩn mực trong giao tiếp với bộ phận tuyển dụng của doanh nghiệp. |
| 13:00 - 17:00 | Tích hợp AI Cover Letter & Email Generator may đo theo từng thẻ Kanban. | Tích hợp tính năng 1-Click Copy và tạo mẫu thư gửi kèm CV (Follow-up email, Thank-you email sau phỏng vấn), viết bài kiểm thử TDD pass 100%. | Cung cấp sẵn các mẫu thư chuyên nghiệp giúp ứng viên duy trì sự chuẩn mực trong giao tiếp với bộ phận tuyển dụng của doanh nghiệp. |

| Tuần: 8 Thứ:      4                Ngày: 04/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Xây dựng Reverse Recruiting Hub (Cổng kết nối nhà tuyển dụng chủ động). | Thiết kế giao diện cho nhà tuyển dụng chủ động duyệt kho hồ sơ đồ án sinh viên (Public Talent Pool) với tính năng ẩn thông tin cá nhân (Blind Screening). | Mô hình tuyển dụng đảo ngược (Reverse Recruiting) giúp sinh viên có năng lực thực chất được các công ty săn đón mà không cần nộp đơn thụ động. |
| 13:00 - 17:00 | Xây dựng Reverse Recruiting Hub (Cổng kết nối nhà tuyển dụng chủ động). | Phát triển cơ chế gửi lời mời phỏng vấn trực tiếp (Direct Invite) từ HR đến sinh viên thông qua hệ thống thông báo nội bộ. | Mô hình tuyển dụng đảo ngược (Reverse Recruiting) giúp sinh viên có năng lực thực chất được các công ty săn đón mà không cần nộp đơn thụ động. |

| Tuần: 8 Thứ:      5                Ngày: 05/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Hoàn thiện cơ chế phân quyền RBAC và bảo mật hồ sơ ứng viên. | Cấu hình Row Level Security (RLS) nâng cao cho các bảng liên quan đến Application Tracker và Public Talent Pool. | Tôn trọng quyền riêng tư và bảo mật thông tin là yếu tố tiên quyết để người dùng tin tưởng sử dụng nền tảng dài lâu. |
| 13:00 - 17:00 | Hoàn thiện cơ chế phân quyền RBAC và bảo mật hồ sơ ứng viên. | Phát triển tính năng cho phép sinh viên bật/tắt chế độ "Mở cơ hội việc làm" (Open to Work) và ẩn CV khỏi các công ty chỉ định. | Tôn trọng quyền riêng tư và bảo mật thông tin là yếu tố tiên quyết để người dùng tin tưởng sử dụng nền tảng dài lâu. |

| Tuần: 8 Thứ:      6                Ngày: 06/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Viết Unit Test & Tích hợp E2E cho Module Application Tracker. | Viết bộ kiểm thử đơn vị cho applicationTrackerService.ts và coverLetterService.ts, đạt 100% test coverage trên các hàm cốt lõi. | Gom việc kiểm thử đơn vị và tích hợp luồng vào ngày thứ 6 giúp xác nhận độ tin cậy tuyệt đối của tính năng trước khi bước sang tuần tối ưu sâu. |
| 13:00 - 17:00 | Viết Unit Test & Tích hợp E2E cho Module Application Tracker. | Kiểm thử luồng người dùng toàn trình: Từ tạo thẻ Kanban, sinh thư ứng tuyển, cập nhật trạng thái đến lưu trữ lịch sử phỏng vấn, kiểm tra build sạch. | Gom việc kiểm thử đơn vị và tích hợp luồng vào ngày thứ 6 giúp xác nhận độ tin cậy tuyệt đối của tính năng trước khi bước sang tuần tối ưu sâu. |

| Tuần: 9 Thứ:      2                Ngày: 09/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Thiết kế và triển khai cơ chế Caching đa tầng (Redis + IndexedDB). | Phân tích các điểm nghẽn truy vấn: Các truy vấn lấy chi tiết đồ án và bộ từ điển công nghệ bị lặp lại nhiều lần gây tải cho CSDL Supabase. | Kết hợp bộ nhớ đệm client-side (IndexedDB) với server cache (Redis) mang lại tốc độ phản hồi tức thì cho người dùng. |
| 13:00 - 17:00 | Thiết kế và triển khai cơ chế Caching đa tầng (Redis + IndexedDB). | Cấu hình Redis cache ở tầng API và thiết lập IndexedDB lưu trữ cục bộ phía client, giảm 80% số lượng request đọc CSDL thừa thãi. | Kết hợp bộ nhớ đệm client-side (IndexedDB) với server cache (Redis) mang lại tốc độ phản hồi tức thì cho người dùng. |

| Tuần: 9 Thứ:      3                Ngày: 10/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tối ưu hóa Hydration và giảm thiểu độ trễ tải trang ban đầu. | Phân tích hiệu năng bằng Google Lighthouse trên trang CV Canvas: Ghi nhận cảnh báo về kích thước file JavaScript và thời gian tương tác TTI. | Chia nhỏ mã nguồn (Code Splitting) theo từng modal giúp trang chủ tải nhanh vượt trội và tiết kiệm băng thông mạng. |
| 13:00 - 17:00 | Tối ưu hóa Hydration và giảm thiểu độ trễ tải trang ban đầu. | Tối ưu hóa React lazy loading cho các modal nặng (StarDiffReviewModal, AtsHeatmapOverlay, InterviewWarRoom), đưa điểm Lighthouse Performance lên 96/100. | Chia nhỏ mã nguồn (Code Splitting) theo từng modal giúp trang chủ tải nhanh vượt trội và tiết kiệm băng thông mạng. |

| Tuần: 9 Thứ:      4                Ngày: 11/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Viết kịch bản kiểm thử tự động toàn trình (E2E Test với Playwright). | Cấu hình framework Playwright cho dự án, thiết lập các biến môi trường kiểm thử tách biệt với môi trường phát triển. | Kiểm thử tự động E2E giúp phát hiện sớm các lỗi hồi quy giao diện mà kiểm thử đơn vị thông thường không bao quát được. |
| 13:00 - 17:00 | Viết kịch bản kiểm thử tự động toàn trình (E2E Test với Playwright). | Viết 3 kịch bản E2E kiểm thử tự động: (1) Luồng sinh viên tạo CV và Reverse Sync, (2) Luồng soi CV chuẩn STAR, (3) Luồng kéo thả Kanban và sinh Cover Letter. | Kiểm thử tự động E2E giúp phát hiện sớm các lỗi hồi quy giao diện mà kiểm thử đơn vị thông thường không bao quát được. |

| Tuần: 9 Thứ:      5                Ngày: 12/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Rà soát bảo mật toàn diện (Security Audit) & Vá các lỗ hổng OWASP. | Thực hiện rà soát bảo mật mã nguồn theo danh mục OWASP Top 10: Kiểm tra nguy cơ SQL Injection, Cross-Site Scripting (XSS) và Broken Access Control. | Làm sạch dữ liệu đầu vào và thiết lập CSP headers là lá chắn thiết yếu bảo vệ ứng dụng trước các cuộc tấn công mã độc. |
| 13:00 - 17:00 | Rà soát bảo mật toàn diện (Security Audit) & Vá các lỗ hổng OWASP. | Áp dụng DOMPurify làm sạch dữ liệu nhập từ người dùng trước khi render vào Canvas, cấu hình Content Security Policy (CSP) headers chặt chẽ. | Làm sạch dữ liệu đầu vào và thiết lập CSP headers là lá chắn thiết yếu bảo vệ ứng dụng trước các cuộc tấn công mã độc. |

| Tuần: 9 Thứ:      6                Ngày: 13/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tối ưu hóa Bundle Size (Tree Shaking, Dynamic Import) & Kiểm thử tải. | Phân tích trực quan gói đóng gói (bundle visualizer), loại bỏ các thư viện phụ thuộc trùng lặp, tối ưu hóa import icon từ lucide-react. | Gom việc tối ưu hóa bundle size và kiểm thử tốc độ tải vào ngày thứ 6 giúp chốt hạ tuần tăng tốc hiệu năng một cách mỹ mãn. |
| 13:00 - 17:00 | Tối ưu hóa Bundle Size (Tree Shaking, Dynamic Import) & Kiểm thử tải. | Giảm dung lượng file bundle chính từ 1.2MB xuống còn 280KB (Gzipped), thực hiện test tải cục bộ và xác nhận thời gian First Contentful Paint (FCP) < 0.8s. | Gom việc tối ưu hóa bundle size và kiểm thử tốc độ tải vào ngày thứ 6 giúp chốt hạ tuần tăng tốc hiệu năng một cách mỹ mãn. |

| Tuần: 10 Thứ:     2                Ngày: 16/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Rà soát và chuẩn hóa Typography, font chữ hệ thống trên toàn bộ giao diện. | Rà soát và chuẩn hóa Typography, font chữ hệ thống trên toàn bộ các trang (Dashboard, CV Builder, Showcase, Kanban). | Đảm bảo tính nhất quán về mặt thị giác và khả năng đọc (readability) nâng cao tính thẩm mỹ và độ tin cậy của sản phẩm. |
| 13:00 - 17:00 | Rà soát và chuẩn hóa Typography, font chữ hệ thống trên toàn bộ giao diện. | Viết các bài kiểm thử tự động kiểm tra tính tương thích font chữ và độ tương phản màu sắc trên các kích thước màn hình khác nhau. | Đảm bảo tính nhất quán về mặt thị giác và khả năng đọc (readability) nâng cao tính thẩm mỹ và độ tin cậy của sản phẩm. |

| Tuần: 10 Thứ:     3                Ngày: 17/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Kiểm thử tích hợp luồng tương tác giữa Kanban ứng tuyển và gửi Email HR. | Kiểm thử tích hợp luồng tương tác giữa bảng Kanban ứng tuyển và modal gửi Email cho nhà tuyển dụng. | Phản hồi giao diện tức thì khi người dùng tương tác giúp ứng dụng mang lại cảm giác mượt mà và chuyên nghiệp như các công cụ SaaS quốc tế. |
| 13:00 - 17:00 | Kiểm thử tích hợp luồng tương tác giữa Kanban ứng tuyển và gửi Email HR. | Tối ưu hóa các thao tác kéo thả trạng thái ứng viên, bổ sung thông báo Toast phản hồi tức thì khi cập nhật tiến độ phỏng vấn. | Phản hồi giao diện tức thì khi người dùng tương tác giúp ứng dụng mang lại cảm giác mượt mà và chuyên nghiệp như các công cụ SaaS quốc tế. |

| Tuần: 10 Thứ:     4                Ngày: 18/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tinh chỉnh các mẫu template Cover Letter & Hoàn thiện tính năng xuất đa định dạng. | Tinh chỉnh các mẫu template Cover Letter theo 3 phong cách (Chuyên nghiệp, Startup, Kỹ thuật chuyên sâu) dựa trên phản hồi của sinh viên. | Đa dạng hóa định dạng xuất tài liệu giúp đáp ứng linh hoạt các phương thức nộp đơn khác nhau của các công ty công nghệ. |
| 13:00 - 17:00 | Tinh chỉnh các mẫu template Cover Letter & Hoàn thiện tính năng xuất đa định dạng. | Hoàn thiện tính năng xuất Cover Letter ra file .txt và Markdown chuẩn GitHub để ứng viên dễ dàng lưu trữ và tùy biến thêm. | Đa dạng hóa định dạng xuất tài liệu giúp đáp ứng linh hoạt các phương thức nộp đơn khác nhau của các công ty công nghệ. |

| Tuần: 10 Thứ:     5                Ngày: 19/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Tích hợp công cụ giám sát hiệu năng & lỗi ứng dụng (Sentry SDK) và thiết lập Alerting. | Cấu hình Sentry SDK trên frontend React Vite, bắt unhandled exceptions và capture error boundary trên các component chính. | Thiết lập hệ thống monitoring sớm giúp đội ngũ kỹ thuật chủ động nắm bắt lỗi người dùng thay vì chờ phản ánh gián tiếp. |
| 13:00 - 17:00 | Tích hợp công cụ giám sát hiệu năng & lỗi ứng dụng (Sentry SDK) và thiết lập Alerting. | Kiểm thử gửi test exception, cấu hình webhook nhận cảnh báo lỗi realtime qua kênh nội bộ khi người dùng gặp sự cố. | Thiết lập hệ thống monitoring sớm giúp đội ngũ kỹ thuật chủ động nắm bắt lỗi người dùng thay vì chờ phản ánh gián tiếp. |

| Tuần: 10 Thứ:     6                Ngày: 20/11/2026 <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | Họp định kỳ Sprint Review với Mentor doanh nghiệp, đánh giá Milestone 2 và lập kế hoạch kỹ thuật chặng tiếp theo. | Demo các tính năng hoàn thiện (ATS Heatmap, Interview War Room, Application Tracker) cho Mentor doanh nghiệp và tiếp nhận góp ý kỹ thuật. | Duy trì họp Sprint Review định kỳ với Mentor giúp nắm chắc định hướng sản phẩm thực tế và liên tục cải tiến chất lượng kỹ thuật trong suốt kỳ thực tập. |
| 13:00 - 17:00 | Họp định kỳ Sprint Review với Mentor doanh nghiệp, đánh giá Milestone 2 và lập kế hoạch kỹ thuật chặng tiếp theo. | Cập nhật backlog kỹ thuật, phân chia các đầu việc mở rộng tiếp theo cho hệ thống ProfileHub và chuẩn bị kế hoạch phát triển cho tuần mới. | Duy trì họp Sprint Review định kỳ với Mentor giúp nắm chắc định hướng sản phẩm thực tế và liên tục cải tiến chất lượng kỹ thuật trong suốt kỳ thực tập. |

