import os
import shutil
import sys
import docx
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import qn

sys.stdout.reconfigure(encoding='utf-8')

# 25 days data extracted from "nhật ký dự án.md"
days_data = [
    # TUẦN 1: KHẢO SÁT, THIẾT KẾ CSDL & MODULE HỒ SƠ DỰ ÁN CỐT LÕI (21/09/2026 – 26/09/2026)
    {
        "title": "Tuần: 1\nThứ:      2                Ngày: 21/09/2026",
        "task": "Khảo sát nghiệp vụ bài toán tạo CV của sinh viên CNTT, thiết lập Base Code Architecture.",
        "morning_res": "Khảo sát thực trạng sinh viên gặp khó khăn khi mô tả dự án học tập vào CV; xác lập mục tiêu xây dựng nền tảng CV định hướng đồ án thực tế (Project-Driven AI CV Builder).",
        "afternoon_res": "Cấu hình môi trường phát triển: React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, kết nối Supabase (PostgreSQL + Auth + Storage).",
        "exp": "Thiết lập TypeScript Strict Mode ngay từ ngày đầu giúp kiểm soát type-safety chặt chẽ, loại bỏ hoàn toàn các lỗi undefined tiềm ẩn."
    },
    {
        "title": "Tuần: 1\nThứ:      3                Ngày: 22/09/2026",
        "task": "Thiết kế CSDL PostgreSQL trên Supabase & Cấu hình Row Level Security (RLS).",
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
        "task": "Dựng khung hiển thị tương tác WYSIWYG ban đầu cho trình soạn thảo CV trên khổ giấy chuẩn A4.",
        "morning_res": "Phân tích thông số kỹ thuật in ấn: A4 Portrait ở độ phân giải 96 DPI tương đương chiều cao 1122.5px, xác lập lề trang và nhịp ngắt trang trực quan.",
        "afternoon_res": "Phát triển InteractiveCVCanvas.tsx render trực tiếp cấu trúc CV, hỗ trợ chỉnh sửa inline trên từng dòng text.",
        "exp": "Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF."
    },
    {
        "title": "Tuần: 1\nThứ:      7                Ngày: 26/09/2026",
        "task": "Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback).",
        "morning_res": "Viết các hàm đồng bộ trong cvService.ts kết nối với bảng student_cvs trên Supabase để tự động lưu trạng thái CV.",
        "afternoon_res": "Thiết lập bộ đệm LocalStorage lưu trữ tạm thời phiên soạn thảo, chống mất dữ liệu khi mất mạng hoặc reload trang đột ngột.",
        "exp": "Cơ chế Fallback hai lớp (Cloud + LocalStorage) giúp ứng viên an tâm tuyệt đối khi thao tác soạn thảo nội dung dài."
    },

    # TUẦN 2: AUDIT KIẾN TRÚC & TIẾN HÀNH CẮT BỎ CÁC TÍNH NĂNG THỪA - PHA 1 (28/09/2026 – 03/10/2026)
    {
        "title": "Tuần: 2\nThứ:      2                Ngày: 28/09/2026",
        "task": "Họp Review tiến độ, đánh giá hiệu năng hệ thống và mức độ phức tạp của codebase.",
        "morning_res": "Đo lường tài nguyên: Nhận thấy kiến trúc đang phải gánh một microservice Python độc lập và nhiều luồng khảo sát phụ rườm rà.",
        "afternoon_res": "Họp kỹ thuật với Tech Lead và thống nhất chiến lược \"Lean MVP\": Cắt giảm ngay các tính năng ngoài lề để tập trung 100% vào giá trị cốt lõi là tạo CV theo dự án.",
        "exp": "Dũng cảm cắt bỏ tính năng không hiệu quả là yếu tố sống còn giúp dự án về đích đúng hạn và đạt chất lượng cao."
    },
    {
        "title": "Tuần: 2\nThứ:      3                Ngày: 29/09/2026",
        "task": "[CẮT BỎ] Xóa bỏ hoàn toàn Microservice Python Chatbot phụ (chatbot_service/) & Chuyển sang TypeScript.",
        "morning_res": "Xóa bỏ thư mục profilehub/chatbot_service gồm app.py, skill_mining.py, requirements.txt, knowledge_base.json.",
        "afternoon_res": "Viết lại thuật toán nhận diện từ khóa kỹ thuật (Tech Dictionary) bằng TypeScript native module trong src/services/aiCvService.ts.",
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
    },
    {
        "title": "Tuần: 2\nThứ:      7                Ngày: 03/10/2026",
        "task": "Tối ưu hóa Single-Layout & Dọn sạch Router toàn hệ thống.",
        "morning_res": "Refactor lại MainLayout.tsx và Sidebar.tsx, gỡ bỏ các route mồ côi (dead routes) sau khi cắt bỏ các module thừa.",
        "afternoon_res": "Kiểm tra lại toàn bộ liên kết nội bộ, đảm bảo chuyển trang mượt mà không có lỗi 404 hoặc warning console.",
        "exp": "Tinh gọn thanh điều hướng giúp người dùng tập trung tối đa vào các thao tác chính."
    },

    # TUẦN 3: CẮT BỎ LUỒNG DUYỆT GIẢNG VIÊN - PHA 2 & THIẾT LẬP HARNESS VITEST TDD (05/10/2026 – 10/10/2026)
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
        "task": "Phát hiện và vá dứt điểm lỗi nghiêm trọng \"Zombie CV\" trong cvService.ts.",
        "morning_res": "Phát hiện bug: Khi ứng viên chủ động xóa sạch tất cả CV trong danh sách, mảng rỗng [] bị điều kiện if (!raw || raw.length === 0) đánh đồng với người dùng mới, tự ý sinh lại CV mặc định.",
        "afternoon_res": "Sửa điều kiện kiểm tra raw !== null để tôn trọng quyết định xóa của người dùng. Viết bộ test cvManagement.test.ts bảo vệ bất biến vòng đời CV.",
        "exp": "Phân biệt rõ giữa trạng thái \"chưa có dữ liệu\" (null/undefined) và \"dữ liệu rỗng có chủ đích\" ([]) là nguyên tắc bất biến trong lập trình CSDL."
    },
    {
        "title": "Tuần: 3\nThứ:      7                Ngày: 10/10/2026",
        "task": "Kiểm thử toàn diện các tầng dịch vụ cốt lõi (TDD Green Check) & Typecheck.",
        "morning_res": "Chạy 5 test suites ban đầu: aiCvService.test.ts, cvManagement.test.ts, aiCvGeneration.test.ts, aiCvCoachService.test.ts, markdownExporter.test.ts. Đạt 20/20 tests pass 100%.",
        "afternoon_res": "Kiểm tra npm run build, xác nhận TypeScript biên dịch không lỗi và hệ thống hoàn toàn sẵn sàng cho tuần cao điểm phát triển tính năng mới.",
        "exp": "TDD mang lại sự tự tin tuyệt đối trước khi bước vào giai đoạn thiết kế tính năng mới."
    },

    # TUẦN 4: BAN HÀNH ADR 0001, HOÀN THIỆN 6 TRACER-BULLET TICKETS & ĐÓNG GÓI BÀN GIAO (12/10/2026 – 19/10/2026)
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
    },
    {
        "title": "Tuần: 4\nThứ:      7                Ngày: 17/10/2026",
        "task": "Hiện thực hóa Ticket 05 (Page-Budget Guard & Layout Switcher) & Ticket 06 (Evidence Showcase & QR).",
        "morning_res": "Xây dựng pageBudgetService đo chiều cao render so với khổ A4, hiển thị huy hiệu 📊 XX% A4 trên toolbar. Phát triển 1-Click AI Auto-Condense co vừa 1 trang A4. Bổ sung nút chuyển bố cục 1 cột và 2 cột. Viết test (3/3 pass).",
        "afternoon_res": "Render link Live Demo và GitHub Repo chuẩn ATS. Tích hợp qrcode.react tự động sinh mã QR thu nhỏ 28px in trên A4 quét demo sản phẩm. Viết test (3/3 pass). Lắp ráp hoàn chỉnh vào CVBuilder.tsx và Canvas.",
        "exp": "Đảm bảo CV vừa vặn đúng 1 trang A4 và có mã QR quét demo là hai yếu tố ghi điểm cực mạnh trong mắt các nhà tuyển dụng thực tế."
    },
    {
        "title": "Tuần: 4\nThứ:      2                Ngày: 19/10/2026",
        "task": "Rà soát tính xác thực tính năng mở rộng, kiên định triết lý Evidence-Based, Lean Pruning & Bàn giao.",
        "morning_res": "Đánh giá rủi ro làm giả của trắc nghiệm tự khai báo và bóc tách package.json. Dũng cảm cắt bỏ các tính năng hình thức để kiên định với dữ liệu thực chiến (Live Demo, GitHub Repo, QR A4). Tinh gọn Canvas & Sidebar. Chạy 11/11 Test Suites (38/38 Tests) pass 100%.",
        "afternoon_res": "Rà soát UX, phím tắt Ctrl+S (Reverse Sync), Ctrl+P (PDF A4), Ctrl+B (Sidebar), Dark/Light mode. Thực thi npm run build (tsc && vite build) sạch 100%, 0 lỗi. Chuyển trạng thái 6 Tracer-Bullet Tickets sang completed và bàn giao.",
        "exp": "Trong phát triển phần mềm, dũng cảm loại bỏ tính năng hình thức dễ bị làm giả giúp bảo vệ sự trung thực và tính thực chiến của hồ sơ ứng viên."
    }
]

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

def update_docx_file(source_bak, target_docx):
    if not os.path.exists(source_bak):
        if os.path.exists(target_docx):
            shutil.copy2(target_docx, source_bak)
        else:
            print(f"File not found: {target_docx}")
            return
    print(f"Reading from backup: {source_bak}")
    doc = docx.Document(source_bak)

    # 1. Update Table 3 (Phiếu theo dõi tiến độ)
    t3 = doc.tables[3]
    weeks_updates = [
        ("1", "21/09/2026    - 26/09/2026"),
        ("2", "28/09/2026    - 03/10/2026"),
        ("3", "05/10/2026    - 10/10/2026"),
        ("4", "12/10/2026    - 19/10/2026"),
        ("5", "26/10/2026    - 31/10/2026"),
        ("6", "02/11/2026    - 07/11/2026"),
        ("7", "09/11/2026    - 14/11/2026"),
        ("8", "16/11/2026    - 21/11/2026"),
        ("9", "23/11/2026    - 28/11/2026"),
        ("10", "30/11/2026   - 05/12/2026"),
        ("11", "07/12/2026   - 12/12/2026"),
        ("12", "14/12/2026   - 19/12/2026"),
        ("13", "21/12/2026   - 26/12/2026"),
    ]
    for idx, (w_num, date_range) in enumerate(weeks_updates):
        r_idx = idx + 1
        if r_idx < len(t3.rows):
            format_cell(t3.rows[r_idx].cells[0], w_num, bold=True, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
            format_cell(t3.rows[r_idx].cells[1], date_range, bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
    print("Table 3 updated.")

    # 2. Update Table 4 (Nội dung nhật ký)
    t4 = doc.tables[4]
    needed_rows = len(days_data) * 4 # 100 rows

    # Clone rows until we reach 100 rows
    while len(t4.rows) < needed_rows:
        rem = len(t4.rows) % 4
        # Use existing rows 0..3 as template
        new_tr = parse_xml(t4.rows[rem]._tr.xml)
        t4._tbl.append(new_tr)

    while len(t4.rows) > needed_rows:
        t4._tbl.remove(t4.rows[-1]._tr)

    print(f"Table 4 adjusted to {len(t4.rows)} rows.")

    for day_idx, day_info in enumerate(days_data):
        base_r = day_idx * 4

        # Row 0: Title row (single merged cell with gridSpan)
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
    f1 = r"C:\Users\ADMIN\Desktop\INTERN FINNAL\BM01b So nhat ky TTTN (3 Tuan).docx"
    b1 = r"C:\Users\ADMIN\Desktop\INTERN FINNAL\BM01b So nhat ky TTTN (3 Tuan).docx.bak"
    update_docx_file(b1, f1)

    f2 = r"C:\Users\ADMIN\Desktop\INTERN FINNAL\BM01b So nhat ky TTTN.docx"
    b2 = r"C:\Users\ADMIN\Desktop\INTERN FINNAL\BM01b So nhat ky TTTN.docx.bak"
    update_docx_file(b2, f2)
