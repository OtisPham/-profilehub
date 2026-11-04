import docx
import shutil
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import qn

# Define all 45 days (9 weeks * 5 days: Thứ 2 -> Thứ 6)
weeks_schedule = [
    # TUẦN 1: 21/09/2026 – 25/09/2026
    {
        "week_num": 1,
        "date_range": "21/09/2026    - 25/09/2026",
        "days": [
            {
                "title": "Tuần: 1\nThứ:      2                Ngày: 21/09/2026",
                "task": "Khảo sát nghiệp vụ bài toán tạo CV của sinh viên CNTT, thiết lập Base Code Architecture.",
                "morning_res": "Khảo sát thực trạng sinh viên gặp khó khăn khi mô tả dự án học tập vào CV; xác lập mục tiêu xây dựng nền tảng CV định hướng đồ án thực tế (Project-Driven AI CV Builder).",
                "afternoon_res": "Cấu hình môi trường phát triển: React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, kết nối Supabase (PostgreSQL + Auth + Storage).",
                "exp": "Thiết lập TypeScript Strict Mode ngay từ ngày đầu giúp kiểm soát type-safety chặt chẽ, loại bỏ hoàn toàn các lỗi undefined tiềm ẩn."
            },
            {
                "title": "Tuần: 1\nThứ:      3                Ngày: 22/09/2026",
                "task": "Thiết kế lược đồ CSDL PostgreSQL trên Supabase & Cấu hình Row Level Security (RLS).",
                "morning_res": "Thiết kế các bảng: users, student_profiles, projects, skills, certifications, student_cvs. Tạo khóa ngoại và composite indexes tối ưu tốc độ đọc.",
                "afternoon_res": "Kích hoạt chính sách RLS cho từng bảng dữ liệu, cấu hình Supabase Storage Bucket portfolio_files lưu trữ tài liệu PDF và hình ảnh minh chứng.",
                "exp": "Áp dụng RLS ở tầng CSDL là cách bảo mật dữ liệu sinh viên đa người dùng chuẩn mực nhất mà không làm phình to backend code."
            },
            {
                "title": "Tuần: 1\nThứ:      4                Ngày: 23/09/2026",
                "task": "Xây dựng Module Quản lý Đồ Án Sinh Viên (MyProjects.tsx) – Toàn trình CRUD.",
                "morning_res": "Thiết kế giao diện danh sách đồ án dạng thẻ Card chuẩn Enterprise, phân loại theo môn học và gắn tags công nghệ (React, Node.js, PostgreSQL...).",
                "afternoon_res": "Phát triển Form Modal Thêm/Sửa đồ án, hỗ trợ trường Live Demo URL, GitHub Repo URL, tài liệu PDF đính kèm và modal xác nhận xóa an toàn.",
                "exp": "Quản lý state form chặt chẽ giúp sinh viên dễ dàng cập nhật thông tin dự án nhiều giai đoạn mà không gây mất mát dữ liệu."
            },
            {
                "title": "Tuần: 1\nThứ:      5                Ngày: 24/09/2026",
                "task": "Xây dựng Module Quản lý Chứng Chỉ (Certificates.tsx) & In-App Document Reader.",
                "morning_res": "Xây dựng giao diện lưu trữ chứng chỉ nghề nghiệp, tính năng đánh dấu thành tựu nổi bật (is_featured) và kéo-thả upload file.",
                "afternoon_res": "Phát triển Modal xem trước file PDF/Ảnh nội tuyến (In-app Document Reader) giúp nhà tuyển dụng xem ngay chứng chỉ mà không cần tải về.",
                "exp": "Trải nghiệm xem trước tài liệu tức thì (sandbox iframe) giúp tăng tính chuyên nghiệp của nền tảng."
            },
            {
                "title": "Tuần: 1\nThứ:      6                Ngày: 25/09/2026",
                "task": "Dựng khung hiển thị tương tác WYSIWYG trên Canvas A4 & Cơ chế lưu trữ 2 lớp.",
                "morning_res": "Phân tích thông số kỹ thuật in ấn: A4 Portrait ở độ phân giải 96 DPI (chiều cao 1122.5px), phát triển InteractiveCVCanvas.tsx hỗ trợ chỉnh sửa inline trên từng dòng text.",
                "afternoon_res": "Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback), thiết lập bộ đệm LocalStorage lưu trữ tạm thời chống mất dữ liệu khi mất mạng.",
                "exp": "Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF; cơ chế lưu trữ hai lớp mang lại độ an toàn cao."
            }
        ]
    },

    # TUẦN 2: 28/09/2026 – 02/10/2026
    {
        "week_num": 2,
        "date_range": "28/09/2026    - 02/10/2026",
        "days": [
            {
                "title": "Tuần: 2\nThứ:      2                Ngày: 28/09/2026",
                "task": "Họp Review tiến độ tuần 1, đánh giá kiến trúc hệ thống & Tối ưu hóa Single-Layout.",
                "morning_res": "Đo lường tài nguyên hệ thống, họp kỹ thuật với Tech Lead và thống nhất chiến lược \"Lean MVP\": Cắt giảm ngay các tính năng ngoài lề để dồn sức cho giá trị cốt lõi.",
                "afternoon_res": "Tối ưu hóa Single-Layout: Refactor lại MainLayout.tsx và Sidebar.tsx, gỡ bỏ các route mồ côi (dead routes) và kiểm tra lại toàn bộ liên kết nội bộ không có lỗi 404.",
                "exp": "Dũng cảm cắt bỏ tính năng không hiệu quả và gom việc đánh giá hiệu năng cùng tái cấu trúc layout vào một ngày giúp codebase luôn ngăn nắp và tiết kiệm thời gian."
            },
            {
                "title": "Tuần: 2\nThứ:      3                Ngày: 29/09/2026",
                "task": "[CẮT BỎ] Xóa bỏ hoàn toàn Microservice Python Chatbot phụ & Viết lại sang TypeScript.",
                "morning_res": "Xóa bỏ thư mục profilehub/chatbot_service gồm app.py, skill_mining.py, requirements.txt, knowledge_base.json, loại bỏ hạ tầng triển khai cồng kềnh.",
                "afternoon_res": "Viết lại thuật toán nhận diện từ khóa kỹ thuật (Tech Dictionary) bằng TypeScript native module trực tiếp trong src/services/aiCvService.ts.",
                "exp": "TypeScript native execution nhanh gấp 3 lần việc gọi HTTP API sang một tiến trình Python riêng lẻ và loại bỏ hoàn toàn gánh nặng cài đặt môi trường."
            },
            {
                "title": "Tuần: 2\nThứ:      4                Ngày: 30/09/2026",
                "task": "[CẮT BỎ] Xóa bỏ Module Khảo sát tính cách MBTI & Dọn sạch thanh điều hướng.",
                "morning_res": "Xóa bỏ mbtiService.ts, MBTIAssessment.tsx, CandidateMBTIInsightCard.tsx, types/mbti.ts khỏi codebase.",
                "afternoon_res": "Dọn sạch các nút bấm và tab MBTI trên Sidebar và thanh điều hướng chính, giải phóng bộ nhớ ứng dụng.",
                "exp": "Nhà tuyển dụng kỹ thuật quan tâm đến stack công nghệ và sản phẩm chạy thật hơn là các bài trắc nghiệm tính cách chung chung."
            },
            {
                "title": "Tuần: 2\nThứ:      5                Ngày: 01/10/2026",
                "task": "[CẮT BỎ] Loại bỏ luồng phỏng vấn chatbot dài dòng & Tối ưu luồng chọn đồ án.",
                "morning_res": "Xóa bỏ các component chat hỏi đáp rườm rà: DiscoveryInterview.tsx, ChatWindow.tsx, FactCard.tsx, discovery.controller.ts.",
                "afternoon_res": "Định hướng lại luồng dữ liệu: Cho phép ứng viên kéo trực tiếp dự án từ hồ sơ vào CV bằng Checkbox modal thay vì phải chat hỏi đáp từng câu.",
                "exp": "Giao diện trực quan dạng chọn (checkbox) mang lại tốc độ hoàn thành công việc cao gấp 5 lần giao diện chat đàm thoại."
            },
            {
                "title": "Tuần: 2\nThứ:      6                Ngày: 02/10/2026",
                "task": "Xây dựng tính năng Nạp Hàng Loạt 100 CV từ Excel (BulkCvImportModal.tsx).",
                "morning_res": "Tích hợp thư viện xlsx đọc dữ liệu hàng loạt từ file mẫu Mau_100_CV_ProfileHub.xlsx, bóc tách thông tin sinh viên, trường, GPA, kỹ năng và đồ án.",
                "afternoon_res": "Phát triển hàm convertImportedCvToCvBuilderState cho phép nạp 1 click toàn bộ 100 CV mẫu vào CV Builder để phục vụ test tính năng và stress-test.",
                "exp": "Chuẩn bị bộ dữ liệu mẫu phong phú giúp việc kiểm thử giao diện và thuật toán phản ánh chính xác dữ liệu thực tế."
            }
        ]
    },

    # TUẦN 3: 05/10/2026 – 09/10/2026
    {
        "week_num": 3,
        "date_range": "05/10/2026    - 09/10/2026",
        "days": [
            {
                "title": "Tuần: 3\nThứ:      2                Ngày: 05/10/2026",
                "task": "Khảo sát thực tế luồng Xác thực Giảng viên (Teacher Verification) và chuyển sang Evidence-Based.",
                "morning_res": "Nhận thấy việc yêu cầu giảng viên phải đăng nhập chấm điểm, ký hash cryptographic (verificationCrypto.ts) tạo ra ma sát cực lớn, sinh viên bị phụ thuộc và không thể chủ động gửi CV.",
                "afternoon_res": "Quyết định loại bỏ triệt để tính năng xác thực giảng viên khỏi phạm vi dự án MVP, thay thế bằng cơ chế Bằng chứng tự chứng minh (Evidence-Based): Link Demo, Repo, QR Code.",
                "exp": "Một sản phẩm tốt phải trao quyền chủ động cho người dùng chính (ứng viên) thay vì tạo ra các nút thắt hành chính bên ngoài."
            },
            {
                "title": "Tuần: 3\nThứ:      3                Ngày: 06/10/2026",
                "task": "[CẮT BỎ] Xóa bỏ toàn bộ Module Xác thực Giảng viên backend & client.",
                "morning_res": "Xóa bỏ các tệp tin backend: verification.controller.ts, verification.service.ts, verification.routes.ts, utils/verificationCrypto.ts.",
                "afternoon_res": "Xóa bỏ giao diện client: VerificationInbox.tsx, TeacherProfile.tsx, PublicVerificationView.tsx. Xóa logic cộng điểm thưởng is_verified trong thuật toán gợi ý đồ án của aiCvService.ts.",
                "exp": "Loại bỏ cơ chế cộng điểm ưu tiên giả định giúp thuật toán AI matching trở nên công bằng, đánh giá thuần túy dựa trên độ phù hợp của Tech Stack với JD."
            },
            {
                "title": "Tuần: 3\nThứ:      4                Ngày: 07/10/2026",
                "task": "[CẮT BỎ] Xóa bỏ tính năng Tạo thư xin việc (Cover Letter) & Phỏng vấn ảo rườm rà.",
                "morning_res": "Xóa bỏ CoverLetterModal.tsx, CoverLetterPage.tsx, aiCoverLetterService.ts khỏi codebase.",
                "afternoon_res": "Xóa bỏ AIInterviewPrep.tsx, aiInterviewService.ts, aiOfferLetterService.ts, giải phóng dung lượng bundle size.",
                "exp": "Tập trung sâu sắc vào một tính năng then chốt (CV Builder) mang lại trải nghiệm xuất sắc hơn là dàn trải nhiều tính năng nông."
            },
            {
                "title": "Tuần: 3\nThứ:      5                Ngày: 08/10/2026",
                "task": "Thiết lập hạ tầng Unit Test tự động hóa với Vitest trong profilehub.",
                "morning_res": "Cấu hình Vitest trong package.json và vite.config.ts, thiết lập môi trường test jsdom và các script kiểm thử tự động.",
                "afternoon_res": "Viết các Seam Test đầu tiên: aiCvService.test.ts (kiểm tra phân tích từ khóa JD) và aiCvCoachService.test.ts (kiểm tra barem đánh giá nội dung CV).",
                "exp": "Thiết lập test harness sớm tạo bệ phóng an toàn để tự tin refactor các module lớn mà không sợ gây lỗi hồi quy."
            },
            {
                "title": "Tuần: 3\nThứ:      6                Ngày: 09/10/2026",
                "task": "Vá lỗi \"Zombie CV\" trong cvService.ts & Kiểm thử toàn diện TDD Green Check.",
                "morning_res": "Phát hiện và sửa điều kiện kiểm tra raw !== null trong cvService.ts để tôn trọng quyết định xóa của người dùng. Viết bộ test cvManagement.test.ts bảo vệ bất biến vòng đời CV.",
                "afternoon_res": "Chạy 5 test suites ban đầu (aiCvService, cvManagement, aiCvGeneration, aiCvCoach, markdownExporter) đạt 20/20 tests pass 100%, kiểm tra npm run build xác nhận TypeScript biên dịch không lỗi.",
                "exp": "Gom việc vá lỗi logic CSDL và kiểm thử hồi quy toàn diện vào chiều thứ 6 giúp khép lại tuần làm việc với trạng thái All-Green an tâm tuyệt đối."
            }
        ]
    },

    # TUẦN 4: 12/10/2026 – 16/10/2026
    {
        "week_num": 4,
        "date_range": "12/10/2026    - 16/10/2026",
        "days": [
            {
                "title": "Tuần: 4\nThứ:      2                Ngày: 12/10/2026",
                "task": "Ban hành Quyết định Kiến trúc ADR 0001: Tách biệt Bản sao Dự án trong CV với Hồ sơ Gốc.",
                "morning_res": "Phân tích bài toán: Khi ứng viên sửa câu từ của dự án cho vừa vặn với một JD cụ thể, nếu lưu đè vào hồ sơ gốc sẽ làm hỏng dữ liệu gốc.",
                "afternoon_res": "Soạn thảo và ban hành ADR 0001: Dự án trong CV là một thực thể độc lập (CV Project Instance), có thể tùy biến tự do theo JD mà không làm ảnh hưởng Master Project.",
                "exp": "Việc tách biệt Instance và Master Profile là quyết định kiến trúc then chốt giúp ứng viên thoải mái may đo nhiều CV cho nhiều vị trí khác nhau."
            },
            {
                "title": "Tuần: 4\nThứ:      3                Ngày: 13/10/2026",
                "task": "Cập nhật Tài liệu Đặc tả Yêu cầu Hệ thống Chính thức & Bảng Thuật Ngữ Miền.",
                "morning_res": "Bổ sung Mục 7.4 (Luồng đưa dự án vào CV và đồng bộ ngược Reverse Sync) vào tài liệu đặc tả chính thức ProfileHub_Discovery_Requirements.md.",
                "afternoon_res": "Định nghĩa bảng thuật ngữ chuẩn trong docs/CONTEXT.md: Master Project, CV Project Instance, Reverse Sync, Scoped Contribution, STAR Bullet, Anti-Hallucination Guard, Page-Budget Guard, Evidence Showcase.",
                "exp": "Chuẩn hóa ngôn ngữ miền chung (Ubiquitous Language) giúp việc viết mã nguồn và đặt tên biến có tính đồng nhất cao."
            },
            {
                "title": "Tuần: 4\nThứ:      4                Ngày: 14/10/2026",
                "task": "Phân rã kỹ thuật thành 6 Tracer-Bullet Tickets & Lập kế hoạch TDD song hành.",
                "morning_res": "Soạn thảo chi tiết tiêu chí nghiệm thu (Acceptance Criteria) cho Ticket 01 (Reverse Sync), Ticket 02 (Scoped Contribution), Ticket 03 (Project Fit Explainer) trong .scratch/project-driven-cv-builder/issues/.",
                "afternoon_res": "Soạn thảo chi tiết tiêu chí nghiệm thu cho Ticket 04 (STAR Diff Review), Ticket 05 (Page-Budget Guard), Ticket 06 (Evidence Showcase QR) và lập kế hoạch triển khai song hành TDD.",
                "exp": "Chia nhỏ bài toán lớn thành các ticket dạng \"tracer-bullet\" giúp kiểm soát tiến độ và kiểm thử độc lập dễ dàng."
            },
            {
                "title": "Tuần: 4\nThứ:      5                Ngày: 15/10/2026",
                "task": "Hiện thực hóa Ticket 01 (Reverse Sync & Toast) & Ticket 02 (Scoped Contribution).",
                "morning_res": "Mở rộng ProjectItem với syncToMasterProfile?: boolean. Viết hàm cvService.syncCvProjectsToMaster tự động upsert dự án mới vào Supabase khi lưu CV. Viết projectReverseSync.test.ts kiểm thử TDD (3/3 pass).",
                "afternoon_res": "Thêm trường scopeType: 'solo' | 'team', teamSize, systemContext. Render huy hiệu [👥 Đồ án nhóm - X thành viên] hoặc [👤 Đồ án cá nhân] trên CV. Viết scopedContribution.test.ts kiểm thử (3/3 pass).",
                "exp": "Trải nghiệm Reverse Sync kèm thông báo Toast không gây gián đoạn (non-blocking) giúp ứng viên duy trì mạch tập trung khi gõ phím."
            },
            {
                "title": "Tuần: 4\nThứ:      6                Ngày: 16/10/2026",
                "task": "Hiện thực hóa Ticket 03 (Project Fit Explainer) & Ticket 04 (STAR Bullet & Anti-Hallucination Guard).",
                "morning_res": "Xây dựng projectFitService.evaluateProjectFit: Đối chiếu đồ án với JD, tính % tương thích, chip từ khóa trùng khớp/thiếu. Xây dựng ProjectFitExplainerModal.tsx chọn đồ án phù hợp vào CV 1-click. Viết test (3/3 pass).",
                "afternoon_res": "Xây dựng starBulletService.adaptProjectBulletsWithStar chuẩn hóa mô tả STAR có số liệu định lượng. Xây dựng StarDiffReviewModal.tsx và tích hợp Anti-Hallucination Guard chặn AI tự bịa công nghệ. Viết test (3/3 pass).",
                "exp": "Minh bạch hóa lý do đề xuất của AI và cung cấp bảng Diff Review giúp ứng viên làm chủ hoàn toàn nội dung trên CV của mình."
            }
        ]
    },

    # TUẦN 5: 19/10/2026 – 23/10/2026
    {
        "week_num": 5,
        "date_range": "19/10/2026    - 23/10/2026",
        "days": [
            {
                "title": "Tuần: 5\nThứ:      2                Ngày: 19/10/2026",
                "task": "Hiện thực hóa Ticket 05, Ticket 06 & Nghiệm thu toàn diện ProfileHub v1.",
                "morning_res": "Hoàn thiện Ticket 05 (Page-Budget Guard đo chiều cao khổ A4, 1-Click Auto-Condense, đổi layout 1/2 cột) và Ticket 06 (Evidence Showcase render link demo/repo và mã QR 28px in A4); viết test pass 100%.",
                "afternoon_res": "Rà soát micro-interactions, phím tắt Ctrl + S/P/B, chạy toàn bộ 11/11 test suites (38/38 tests pass 100%) và đóng gói npm run build sạch sẽ, nghiệm thu bàn giao ProfileHub v1.",
                "exp": "Gom việc hoàn tất 2 ticket cuối cùng với quy trình đóng gói nghiệm thu giúp khép lại phiên bản v1 một cách trọn vẹn và đúng tiến độ."
            },
            {
                "title": "Tuần: 5\nThứ:      3                Ngày: 20/10/2026",
                "task": "Phân tích nghiệp vụ thư ứng tuyển trong ngành IT và thiết kế kiến trúc Contextual Application Pitch (ADR 0002).",
                "morning_res": "Họp phản biện (/grill-with-docs) làm rõ bất cập của Cover Letter truyền thống; ban hành quyết định kiến trúc ADR 0002 định nghĩa Contextual Application Pitch gắn liền với cặp (CV Project Instance, JD).",
                "afternoon_res": "Xây dựng applicationPitchService.ts và ApplicationPitchModal.tsx (< 250 từ, 1-Click Copy, cơ chế Hard-gating bắt buộc có JD và ít nhất 1 đồ án); viết 4 bài test TDD pass 100%.",
                "exp": "Tránh tạo tài liệu độc lập gây phình to hệ thống; nhúng ngữ cảnh trực tiếp vào bản CV giúp tạo tính gắn kết chặt chẽ giữa đồ án thực tế và yêu cầu tuyển dụng."
            },
            {
                "title": "Tuần: 5\nThứ:      4                Ngày: 21/10/2026",
                "task": "Xây dựng Trụ Cột 3: Project Technical Defense Briefing (Huấn luyện phòng thủ đồ án trước Tech Lead).",
                "morning_res": "Nghiên cứu các dạng câu hỏi xoáy phỏng vấn kỹ thuật theo từng Tech Stack: Redis Cache Invalidation, PostgreSQL EXPLAIN & Indexing, Node.js Event Loop, React Re-render.",
                "afternoon_res": "Xây dựng projectDefenseService.ts và ProjectDefenseModal.tsx trang bị Top 3 câu hỏi xoáy, bản giải trình Trade-off và kịch bản Debugging Scaffold 4 pha; nâng test suites lên 13/13 (46/46 tests pass).",
                "exp": "Trang bị bản lĩnh bảo vệ đồ án trước câu hỏi hóc búa của Tech Lead giúp ứng viên tự tin chứng minh năng lực thực chất ở vòng phỏng vấn kỹ thuật."
            },
            {
                "title": "Tuần: 5\nThứ:      5                Ngày: 22/10/2026",
                "task": "Nghiên cứu nguyên tắc \"Zero Fake Metrics\" & Xây dựng công cụ \"Soi CV Chuẩn STAR\".",
                "morning_res": "Khẳng định nguyên tắc chống bịa đặt số liệu viển vông; xác lập 4 nguồn số liệu kỹ thuật thực tế: EXPLAIN query cost, k6 load test throughput (req/s), Lighthouse performance và Vitest test coverage.",
                "afternoon_res": "Xây dựng starDiagnosticService.ts: Bắt lỗi từ ngữ thụ động (\"tham gia\", \"hỗ trợ\"), chấm điểm STAR Score (0-100), tự động sinh câu hỏi gợi mở khơi sâu trải nghiệm thực tế.",
                "exp": "Số liệu trong CV công nghệ phải có bằng chứng kỹ thuật kiểm chứng được, tránh việc ứng viên bị Tech Lead đánh trượt vì thiếu trung thực (Dishonesty) khi bị truy vấn sâu."
            },
            {
                "title": "Tuần: 5\nThứ:      6                Ngày: 23/10/2026",
                "task": "Hoàn thiện STAR Wizard, Tích hợp Canvas & Thiết lập CI/CD GitHub Actions.",
                "morning_res": "Xây dựng modal StarCvDiagnosticModal.tsx hỗ trợ cả 2 chế độ: \"Soi CV Sẵn Có\" và \"STAR Wizard Từ Trang Giấy Trắng\", tích hợp nút tác vụ 1-click đưa vào CV Canvas (5 bài test pass 100%).",
                "afternoon_res": "Cấu hình CI/CD GitHub Actions (.github/workflows/3dwebsite-ci.yml, deploy, release, rollback), chạy kiểm thử hồi quy 14/14 test suites (51/51 tests pass) và kiểm tra hiệu năng đóng gói build sạch.",
                "exp": "Gom việc tích hợp giao diện STAR Wizard với quy trình kiểm thử hiệu năng CI/CD vào ngày thứ 6 giúp đảm bảo tính ổn định cao của mã nguồn trước khi sang tuần mới."
            }
        ]
    },

    # TUẦN 6: 26/10/2026 – 30/10/2026
    {
        "week_num": 6,
        "date_range": "26/10/2026    - 30/10/2026",
        "days": [
            {
                "title": "Tuần: 6\nThứ:      2                Ngày: 26/10/2026",
                "task": "Nâng cấp Module Quản lý Đồ Án (AddProjectModal.tsx) & Tour Hướng Dẫn Game Hóa.",
                "morning_res": "Thiết kế lại form thêm/sửa đồ án hỗ trợ liên kết Live Demo URL, GitHub Repo, bối cảnh hệ thống (System Context) và phân tách trách nhiệm cá nhân; bổ sung trường gắn nhãn công nghệ tự động.",
                "afternoon_res": "Xây dựng GamifiedOnboardingTour.tsx hướng dẫn từng bước cho sinh viên mới lần đầu vào hệ thống; hoàn thiện component ProjectQRCodeModal.tsx xuất mã Smart QR quét mở demo trên điện thoại.",
                "exp": "Thiết kế onboarding dạng game hóa giúp người dùng nhanh chóng nắm bắt các tính năng cốt lõi của nền tảng mà không cần đọc hướng dẫn sử dụng dài dòng."
            },
            {
                "title": "Tuần: 6\nThứ:      3                Ngày: 27/10/2026",
                "task": "Xây dựng Bộ Quy Tắc Kiểm Định Chất Lượng CV & Nâng cấp CV Canvas linh hoạt.",
                "morning_res": "Phát triển cvQualityCheckService.ts kiểm tra 10 tiêu chí chất lượng CV (độ dài lý tưởng, tỷ lệ định lượng, từ khóa kỹ thuật) và modal CVQualityCheckModal.tsx (5 bài test pass 100%).",
                "afternoon_res": "Xây dựng InlineEditPopover.tsx, SectionSettingsModal.tsx, ReorderSectionsModal.tsx cho phép kéo thả sắp xếp lại các phần; tích hợp GitHubQuickImportBar.tsx kéo repo từ GitHub vào thẳng CV.",
                "exp": "Tự động hóa việc chấm điểm chất lượng CV kết hợp tùy biến khối thông tin linh hoạt giúp ứng viên may đo hồ sơ đạt độ hoàn thiện cao nhất."
            },
            {
                "title": "Tuần: 6\nThứ:      4                Ngày: 28/10/2026",
                "task": "Tái cấu trúc giao diện sang Consumer SaaS & Hiện thực hóa \"Mắt Thần ATS\".",
                "morning_res": "Loại bỏ Sidebar cố định 240px trong MainLayout.tsx giải phóng 100% không gian ngang cho màn hình soạn thảo CV; xây dựng HeaderBar.tsx kính mờ, Footer.tsx và trang chủ HomePage.tsx tại /.",
                "afternoon_res": "Hoàn thành atsParserEyeService.ts & AtsParserEyeModal.tsx hiển thị chuỗi Plain-Text chuẩn xác mà các hệ thống ATS quốc tế (Workday, Taleo) đọc ra, kèm nút 1-click chuyển Minimalist Harvard 1 cột (4 tests pass).",
                "exp": "Chuyển sang bố cục HeaderBar tối giản giúp giao diện hiện đại chuẩn SaaS và hiểu rõ cơ chế máy quét ATS quốc tế bảo vệ hồ sơ không bị loại oan."
            },
            {
                "title": "Tuần: 6\nThứ:      5                Ngày: 29/10/2026",
                "task": "Xây dựng Động Cơ Khảo Sát Lương Thị Trường AI & Widget Bản Đồ Nhiệt Theo Dõi CV.",
                "morning_res": "Xây dựng salaryBenchmarkService.ts & SalaryBenchmarkModal.tsx nhận diện cấp bậc, tính Tech Multiplier (+10% đến 35%) và dùng đồ án làm đòn bẩy nâng phân vị lương từ P50 lên P75-P85 (4 tests pass).",
                "afternoon_res": "Xây dựng cvTrackingAnalyticsService.ts & CvHeatmapWidget.tsx đo lường lượt xem, thời gian dừng đọc trung bình (Avg Dwell Time), trực quan hóa % thời gian dừng ở từng mục; thêm ThemeToggleSwitch.tsx (Dark/Light mode).",
                "exp": "Trang bị công cụ khảo sát dải lương giúp ứng viên tự tin đàm phán và dữ liệu bản đồ nhiệt giúp hiểu rõ phần nào trong CV được nhà tuyển dụng chú ý nhiều nhất."
            },
            {
                "title": "Tuần: 6\nThứ:      6                Ngày: 30/10/2026",
                "task": "Xây dựng Interview War Room 4 Chặng & Kiểm thử hồi quy hiệu năng toàn diện.",
                "morning_res": "Hoàn thành aiMockInterviewService.ts, selfInterviewService.ts, AiMockInterviewModal.tsx, InterviewWarRoomModal.tsx mô phỏng 4 chặng: Elevator Pitch, STAR Deep-Dive, Live Incident Crisis, Skill Gap Defense.",
                "afternoon_res": "Tích hợp tính năng đổi giờ phỏng vấn (Reschedule) đồng bộ 2 chiều sang pipeline NTD; chạy toàn bộ 82/82 Unit Tests (22/22 Test Suites pass 100%) và đo lường hiệu năng bundle build sạch sẽ trong 23s.",
                "exp": "Luyện tập phỏng vấn xử lý sự cố khẩn cấp (Live Incident) kết hợp kiểm thử hồi quy và đo lường hiệu năng vào chiều thứ 6 giúp đóng gói hệ thống an toàn và vững chắc."
            }
        ]
    },

    # TUẦN 7: 02/11/2026 – 06/11/2026
    {
        "week_num": 7,
        "date_range": "02/11/2026    - 06/11/2026",
        "days": [
            {
                "title": "Tuần: 7\nThứ:      2                Ngày: 02/11/2026",
                "task": "Khảo sát tiến trình ứng tuyển & Thiết kế kiến trúc Application Pipeline Tracker.",
                "morning_res": "Khảo sát góc khuất tâm lý ứng viên sau khi nộp đơn: nỗi sợ thất lạc hồ sơ và quên phiên bản CV đã nộp; xây dựng đặc tả kiến trúc cho Application Pipeline Tracker và Public Verification Gateway.",
                "afternoon_res": "Khai báo Schema Types (application.types.ts, starDefense.types.ts, projects.types.ts) và thiết lập kiến trúc dịch vụ bảo chứng & băm mật mã học (applicationTrackerService.ts, verificationService.ts).",
                "exp": "Phân tích sâu hành vi ứng viên sau khi gửi CV giúp xây dựng các tính năng đồng hành liên tục suốt quá trình tìm việc chứ không dừng lại ở khâu xuất file."
            },
            {
                "title": "Tuần: 7\nThứ:      3                Ngày: 03/11/2026",
                "task": "Hiện thực hóa Bảng Kanban Ứng Tuyển & Phao Cứu Sinh Giải Trình Số Liệu STAR.",
                "morning_res": "Xây dựng bảng Kanban ApplicationKanbanBoard.tsx với các cột trạng thái rõ ràng (Đã nộp, Chờ phỏng vấn, Đã nhận offer, Từ chối), tích hợp dữ liệu ứng tuyển đồng bộ.",
                "afternoon_res": "Xây dựng modal phao cứu sinh giải trình số liệu StarDefenseModal.tsx giúp ứng viên ôn tập nhanh các luận điểm kỹ thuật then chốt 15 phút trước giờ phỏng vấn; viết test TDD pass 100%.",
                "exp": "Cung cấp bản tóm tắt luận điểm kỹ thuật rút gọn ngay trên bảng Kanban giúp ứng viên luôn ở trạng thái sẵn sàng cao nhất khi nhận cuộc gọi từ nhà tuyển dụng."
            },
            {
                "title": "Tuần: 7\nThứ:      4                Ngày: 04/11/2026",
                "task": "Xây dựng Cổng Tra Cứu Bảo Chứng Công Khai (/verify/:code) & Kiểm thử bảo mật.",
                "morning_res": "Xây dựng PublicVerificationView.tsx tại route độc lập /verify/:code, kết nối thuật toán băm cryptographic bảo chứng tính toàn vẹn của đồ án và đồng bộ mã QR quét mở trực tiếp.",
                "afternoon_res": "Kiểm thử bảo mật ranh giới riêng tư (Privacy Boundary): thiết lập RLS ẩn GPA và số điện thoại/email cá nhân trên cổng tra cứu công khai, chỉ hiển thị minh chứng đồ án và kỹ năng kỹ thuật.",
                "exp": "Bảo vệ dữ liệu riêng tư cá nhân khi thiết kế cổng tra cứu công khai là yêu cầu an toàn thông tin bắt buộc đối với nền tảng giáo dục - tuyển dụng."
            },
            {
                "title": "Tuần: 7\nThứ:      5                Ngày: 05/11/2026",
                "task": "Khảo sát nhu cầu ứng tuyển & Xây dựng Bộ Hồ Sơ Ứng Tuyển Toàn Diện (Cover Letter Service).",
                "morning_res": "Ban hành đặc tả kỹ thuật SDD, khai báo Schema Types (coverLetter.types.ts) cho Cover Letter & Outbound Email Generator bám sát đồ án thực tế và JD.",
                "afternoon_res": "Xây dựng coverLetterService.ts với Rule Template Engine 4 đoạn kết hợp thuật toán dệt số liệu định lượng STAR từ CV; viết 7/7 bài kiểm thử Vitest pass 100%.",
                "exp": "Tạo thư ứng tuyển tự động bám sát đồ án thực tế và số liệu định lượng giúp ứng viên thể hiện năng lực nổi bật mà không bao giờ bịa đặt công nghệ."
            },
            {
                "title": "Tuần: 7\nThứ:      6                Ngày: 06/11/2026",
                "task": "Hiện thực hóa CoverLetterModal.tsx & Kiểm thử hiệu năng hệ thống toàn dự án.",
                "morning_res": "Phát triển CoverLetterModal.tsx hỗ trợ 3 phong cách (Chuyên nghiệp/Startup/Kỹ thuật), mẫu Email gửi HR chuẩn quốc tế, xuất Markdown, tích hợp nút gọi nhanh từ ApplicationCard.tsx.",
                "afternoon_res": "Kiểm thử toàn diện 37 files (151/151 tests pass 100%), đo lường hiệu năng rendering trên các trình duyệt Chrome/Edge/Firefox và build sản xuất sạch sẽ 100%.",
                "exp": "Tích hợp liền mạch giữa Kanban theo dõi ứng tuyển và công cụ may đo thư xin việc, đồng thời gom kiểm tra hiệu năng hệ thống vào cuối tuần giúp đảm bảo toàn bộ hệ sinh thái chạy mượt mà."
            }
        ]
    },

    # TUẦN 8: 09/11/2026 – 13/11/2026
    {
        "week_num": 8,
        "date_range": "09/11/2026    - 13/11/2026",
        "days": [
            {
                "title": "Tuần: 8\nThứ:      2                Ngày: 09/11/2026",
                "task": "Triển khai thử nghiệm người dùng Beta (User Acceptance Testing - UAT).",
                "morning_res": "Tổ chức phiên thử nghiệm người dùng UAT với nhóm 15 sinh viên năm cuối ngành CNTT: Giao nhiệm vụ tạo CV từ JD thực tế của FPT Software và VNG.",
                "afternoon_res": "Ghi nhận nhật ký thao tác và phỏng vấn nhanh cảm nhận của người dùng về tính năng STAR Diagnostic, Mắt Thần ATS, Application Tracker và Cover Letter.",
                "exp": "Quan sát người dùng thực tế thao tác giúp phát hiện nhiều chi tiết nhỏ về mặt tương tác (micro-interactions) cần được tinh chỉnh để tăng tính trực quan."
            },
            {
                "title": "Tuần: 8\nThứ:      3                Ngày: 10/11/2026",
                "task": "Phân tích kết quả UAT và Tinh chỉnh kích thước hiển thị in ấn chuẩn A4.",
                "morning_res": "Tổng hợp danh sách góp ý từ đợt thử nghiệm UAT, điều chỉnh kích thước font chữ in ấn xuống 10.5pt để vừa vặn hơn trên các khổ giấy hẹp.",
                "afternoon_res": "Kiểm thử in thực tế trên 3 dòng máy in văn phòng phổ biến (HP LaserJet, Canon LBP, Brother); kiểm tra độ sắc nét và đảm bảo mã QR quét nhạy trong vòng 1 giây.",
                "exp": "Kiểm thử trên thiết bị vật lý thực tế (máy in và camera điện thoại) là bước bắt buộc để đảm bảo chất lượng đầu ra của sản phẩm in ấn."
            },
            {
                "title": "Tuần: 8\nThứ:      4                Ngày: 11/11/2026",
                "task": "Tối ưu hóa SEO, OpenGraph Meta Tags & Nâng cấp bộ xuất PDF vector chất lượng cao.",
                "morning_res": "Cấu hình dynamic OpenGraph tags cho trang /showcase/:id: Hiển thị ảnh thumbnail dự án, tên ứng viên và danh sách tech stack khi chia sẻ link lên LinkedIn/Facebook.",
                "afternoon_res": "Tích hợp cấu hình print style sheet @media print chuyên sâu: Khóa chặt tỷ lệ trang 1:1, kiểm tra văn bản vector có thể bôi đen và tìm kiếm được (selectable text) không bị vỡ hạt khi phóng to 300%.",
                "exp": "Chăm chút trang Portfolio công khai và xuất file PDF vector giúp máy quét ATS bóc tách dữ liệu chính xác 100% so với việc xuất ảnh bitmap thông thường."
            },
            {
                "title": "Tuần: 8\nThứ:      5                Ngày: 12/11/2026",
                "task": "Đóng gói toàn bộ tài liệu kỹ thuật bàn giao (Developer Handover Guide & Architecture Spec).",
                "morning_res": "Cập nhật hoàn chỉnh tài liệu kiến trúc docs/CONTEXT.md, sơ đồ luồng hệ thống docs/luong_chinh_he_thong.md và hướng dẫn triển khai.",
                "afternoon_res": "Đóng gói mã nguồn, kiểm tra lại toàn bộ file README.md, rà soát các biến môi trường và chuẩn bị tài liệu báo cáo thực tập tốt nghiệp chi tiết.",
                "exp": "Viết tài liệu bàn giao chuẩn mực và mạch lạc là kỹ năng quan trọng khẳng định tính chuyên nghiệp của một kỹ sư phần mềm khi kết thúc dự án."
            },
            {
                "title": "Tuần: 8\nThứ:      6                Ngày: 13/11/2026",
                "task": "Đo lường hiệu năng hệ thống lần cuối & Báo cáo nghiệm thu với Người hướng dẫn doanh nghiệp.",
                "morning_res": "Đo lường điểm hiệu năng toàn diện trên Chrome Lighthouse (đạt 98/100 Performance, 100/100 SEO), kiểm tra tải trang và tối ưu hóa tài nguyên bundle lần cuối.",
                "afternoon_res": "Báo cáo nghiệm thu dự án ProfileHub trước đại diện Công ty TNHH Alpaca Solutions, ký nhận phiếu theo dõi tiến độ thực tập và hoàn tất hồ sơ thực tập tốt nghiệp.",
                "exp": "Trải nghiệm thực tập thực tế tại doanh nghiệp giúp chuyển hóa vững chắc kiến thức lý thuyết trên giảng đường thành năng lực xây dựng sản phẩm công nghệ hoàn chỉnh."
            }
        ]
    },

    # TUẦN 9: 16/11/2026 – 20/11/2026
    {
        "week_num": 9,
        "date_range": "16/11/2026    - 20/11/2026",
        "days": [
            {
                "title": "Tuần: 9\nThứ:      2                Ngày: 16/11/2026",
                "task": "Rà soát và chuẩn hóa Typography, font chữ hệ thống trên toàn bộ giao diện.",
                "morning_res": "Rà soát và chuẩn hóa Typography, font chữ hệ thống trên toàn bộ các trang (Dashboard, CV Builder, Showcase, Kanban).",
                "afternoon_res": "Viết các bài kiểm thử tự động kiểm tra tính tương thích font chữ và độ tương phản màu sắc trên các kích thước màn hình khác nhau.",
                "exp": "Đảm bảo tính nhất quán về mặt thị giác và khả năng đọc (readability) nâng cao tính thẩm mỹ và độ tin cậy của sản phẩm."
            },
            {
                "title": "Tuần: 9\nThứ:      3                Ngày: 17/11/2026",
                "task": "Kiểm thử tích hợp luồng tương tác giữa Kanban ứng tuyển và gửi Email HR.",
                "morning_res": "Kiểm thử tích hợp luồng tương tác giữa bảng Kanban ứng tuyển và modal gửi Email cho nhà tuyển dụng.",
                "afternoon_res": "Tối ưu hóa các thao tác kéo thả trạng thái ứng viên, bổ sung thông báo Toast phản hồi tức thì khi cập nhật tiến độ phỏng vấn.",
                "exp": "Phản hồi giao diện tức thì khi người dùng tương tác giúp ứng dụng mang lại cảm giác mượt mà và chuyên nghiệp như các công cụ SaaS quốc tế."
            },
            {
                "title": "Tuần: 9\nThứ:      4                Ngày: 18/11/2026",
                "task": "Tinh chỉnh các mẫu template Cover Letter & Hoàn thiện tính năng xuất đa định dạng.",
                "morning_res": "Tinh chỉnh các mẫu template Cover Letter theo 3 phong cách (Chuyên nghiệp, Startup, Kỹ thuật chuyên sâu) dựa trên phản hồi của sinh viên.",
                "afternoon_res": "Hoàn thiện tính năng xuất Cover Letter ra file .txt và Markdown chuẩn GitHub để ứng viên dễ dàng lưu trữ và tùy biến thêm.",
                "exp": "Đa dạng hóa định dạng xuất tài liệu giúp đáp ứng linh hoạt các phương thức nộp đơn khác nhau của các công ty công nghệ."
            },
            {
                "title": "Tuần: 9\nThứ:      5                Ngày: 19/11/2026",
                "task": "Rà soát toàn bộ liên kết tài liệu minh chứng & Thiết lập cơ chế sao lưu dữ liệu tự động.",
                "morning_res": "Rà soát toàn bộ các liên kết tài liệu minh chứng, link GitHub Repo và Demo của các đồ án mẫu trong hệ thống.",
                "afternoon_res": "Kiểm tra cơ chế sao lưu dự phòng CSDL trên Supabase và thiết lập lịch tự động sao lưu định kỳ hàng tuần.",
                "exp": "Thiết lập chính sách sao lưu định kỳ là biện pháp phòng ngừa rủi ro mất mát dữ liệu quan trọng nhất cho hệ thống đang vận hành."
            },
            {
                "title": "Tuần: 9\nThứ:      6                Ngày: 20/11/2026",
                "task": "Chạy kiểm thử tải hệ thống (Load Testing) & Tổng kết tuần thực tập 9.",
                "morning_res": "Chạy kiểm thử tải (load testing) với k6 mô phỏng 100 người dùng đồng thời truy cập Public Showcase, ghi nhận thời gian phản hồi API < 200ms.",
                "afternoon_res": "Tổng kết tuần 9, bàn giao tài liệu bổ sung cho doanh nghiệp và chuẩn bị các nội dung chuẩn bị cho lễ bảo vệ thực tập tốt nghiệp.",
                "exp": "Thực hiện kiểm thử tải trước khi bàn giao giúp đánh giá chính xác năng lực chịu tải của hạ tầng và mang lại sự an tâm tuyệt đối."
            }
        ]
    }
]

# Flatten all days
all_45_days = []
for w in weeks_schedule:
    all_45_days.extend(w["days"])

print(f"Total days generated: {len(all_45_days)} (strictly Mon-Fri, 9 weeks * 5 days = 45 days)")

def format_cell(cell, text, bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.LEFT):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(font_size)
    run.bold = bold
    rPr = run._r.get_or_add_rPr()
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), 'Times New Roman')
    rFonts.set(qn('w:hAnsi'), 'Times New Roman')
    rFonts.set(qn('w:cs'), 'Times New Roman')
    rPr.append(rFonts)

def update_docx_file(source_template, target_docx):
    print(f"Reading from template: {source_template}")
    doc = docx.Document(source_template)

    # 1. Update Table 3 (Phiếu theo dõi tiến độ)
    t3 = doc.tables[3]
    weeks_updates = [
        ("1", "21/09/2026    - 25/09/2026"),
        ("2", "28/09/2026    - 02/10/2026"),
        ("3", "05/10/2026    - 09/10/2026"),
        ("4", "12/10/2026    - 16/10/2026"),
        ("5", "19/10/2026    - 23/10/2026"),
        ("6", "26/10/2026    - 30/10/2026"),
        ("7", "02/11/2026    - 06/11/2026"),
        ("8", "09/11/2026    - 13/11/2026"),
        ("9", "16/11/2026    - 20/11/2026"),
        ("10", "23/11/2026   - 27/11/2026"),
        ("11", "30/11/2026   - 04/12/2026"),
        ("12", "07/12/2026   - 11/12/2026"),
        ("13", "14/12/2026   - 18/12/2026"),
        ("14", "21/12/2026   - 25/12/2026"),
    ]
    for idx, (w_num, date_range) in enumerate(weeks_updates):
        r_idx = idx + 1
        if r_idx < len(t3.rows):
            format_cell(t3.rows[r_idx].cells[0], w_num, bold=True, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
            format_cell(t3.rows[r_idx].cells[1], date_range, bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
    print("Table 3 updated for 14 weeks (Mon-Fri).")

    # 2. Update Table 4 (Nội dung nhật ký)
    t4 = doc.tables[4]
    needed_rows = len(all_45_days) * 4 # 180 rows

    while len(t4.rows) < needed_rows:
        rem = len(t4.rows) % 4
        new_tr = parse_xml(t4.rows[rem]._tr.xml)
        t4._tbl.append(new_tr)

    while len(t4.rows) > needed_rows:
        t4._tbl.remove(t4.rows[-1]._tr)

    print(f"Table 4 adjusted to {len(t4.rows)} rows ({len(t4.rows)//4} days).")

    for day_idx, day_info in enumerate(all_45_days):
        base_r = day_idx * 4

        # Row 0: Title row
        r0 = t4.rows[base_r]
        format_cell(r0.cells[0], day_info["title"], bold=True, font_size=13, align=WD_ALIGN_PARAGRAPH.LEFT)

        # Row 1: Headers
        r1 = t4.rows[base_r + 1]
        format_cell(r1.cells[0], "Thời gian", bold=True, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell(r1.cells[1], "Công việc được giao", bold=True, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell(r1.cells[2], "Kết quả thực hiện", bold=True, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell(r1.cells[3], "Kinh nghiệm", bold=True, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)

        # Row 2: Morning
        r2 = t4.rows[base_r + 2]
        format_cell(r2.cells[0], "08:30 - 12:00", bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell(r2.cells[1], day_info["task"], bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.LEFT)
        format_cell(r2.cells[2], day_info["morning_res"], bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.LEFT)
        format_cell(r2.cells[3], day_info["exp"], bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.LEFT)

        # Row 3: Afternoon
        r3 = t4.rows[base_r + 3]
        format_cell(r3.cells[0], "13:00 - 17:00", bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell(r3.cells[1], day_info["task"], bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.LEFT)
        format_cell(r3.cells[2], day_info["afternoon_res"], bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.LEFT)
        format_cell(r3.cells[3], day_info["exp"], bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.LEFT)

    doc.save(target_docx)
    print(f"Saved cleanly to: {target_docx}")

if __name__ == "__main__":
    import shutil
    import os
    template_src = r"c:\Users\ADMIN\Desktop\STUDY\docs\BM01b_So_nhat_ky_thuc_tap.docx"
    template_temp = r"c:\Users\ADMIN\Desktop\STUDY\docs\BM01b_clean_template_temp.docx"
    shutil.copyfile(template_src, template_temp)

    # 1. Update INTERN FINNAL files
    f1 = r"C:\Users\ADMIN\Desktop\INTERN FINNAL\BM01b So nhat ky TTTN.docx"
    update_docx_file(template_temp, f1)

    f2 = r"C:\Users\ADMIN\Desktop\INTERN FINNAL\BM01b So nhat ky TTTN (3 Tuan).docx"
    update_docx_file(template_temp, f2)

    # 2. Update STUDY docx
    f3 = r"c:\Users\ADMIN\Desktop\STUDY\docs\BM01b_So_nhat_ky_thuc_tap.docx"
    update_docx_file(template_temp, f3)

    if os.path.exists(template_temp):
        os.remove(template_temp)

    # Generate Markdown file
    md_header = """# BM01b — SỔ NHẬT KÝ THỰC TẬP TỐT NGHIỆP
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
| 1 | 21/09/2026 - 25/09/2026 | |
| 2 | 28/09/2026 - 02/10/2026 | |
| 3 | 05/10/2026 - 09/10/2026 | |
| 4 | 12/10/2026 - 16/10/2026 | |
| 5 | 19/10/2026 - 23/10/2026 | |
| 6 | 26/10/2026 - 30/10/2026 | |
| 7 | 02/11/2026 - 06/11/2026 | |
| 8 | 09/11/2026 - 13/11/2026 | |
| 9 | 16/11/2026 - 20/11/2026 | |
| 10 | 23/11/2026 - 27/11/2026 | |
| 11 | 30/11/2026 - 04/12/2026 | |
| 12 | 07/12/2026 - 11/12/2026 | |
| 13 | 14/12/2026 - 18/12/2026 | |
| 14 | 21/12/2026 - 25/12/2026 | |

---

### NỘI DUNG NHẬT KÝ CHI TIẾT THEO NGÀY (45 NGÀY LÀM VIỆC — THỨ 2 ĐẾN THỨ 6)

"""

    md_body = ""
    for day in all_45_days:
        clean_title = day["title"].replace("\n", " ")
        md_body += f"""| {clean_title} <td colspan=4/> |
| :--- | :--- | :--- | :--- |
| **Thời gian** | **Công việc được giao** | **Kết quả thực hiện** | **Kinh nghiệm** |
| 08:30 - 12:00 | {day["task"]} | {day["morning_res"]} | {day["exp"]} |
| 13:00 - 17:00 | {day["task"]} | {day["afternoon_res"]} | {day["exp"]} |

"""

    with open(r"c:\Users\ADMIN\Desktop\STUDY\docs\BM01b_So_nhat_ky_thuc_tap.md", "w", encoding="utf-8") as f:
        f.write(md_header + md_body)
    print("BM01b_So_nhat_ky_thuc_tap.md written.")
