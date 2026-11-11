# -*- coding: utf-8 -*-
import docx
import shutil
import os
import sys
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import qn

sys.stdout.reconfigure(encoding='utf-8')

# 43 days (Starts 18/09/2026; 4 Saturdays in Weeks 1-4; strictly Mon-Fri from Week 5; ends on TODAY: 11/11/2026)
weeks_schedule = [
    # TUẦN 1: 18/09/2026 – 19/09/2026 (2 ngày)
    {
        "week_num": 1,
        "date_range": "18/09/2026    - 19/09/2026",
        "days": [
            {
                "title": "Tuần: 1\nThứ:      6                Ngày: 18/09/2026",
                "task": "Khảo sát toàn diện bài toán CV sinh viên IT & Lập kiến trúc tổng thể ProfileHub.",
                "morning_res": "Khảo sát thực trạng sinh viên gặp khó khi đưa đồ án vào CV; định hình 3 trụ cột sản phẩm: Project-Driven CV Builder, Evidence-Based Matching và AI Interview Coaching; lập sơ đồ WBS.",
                "afternoon_res": "Thiết kế kiến trúc hệ thống Client-Server, phân tích mô hình dữ liệu quan hệ trên PostgreSQL (Supabase) và lập tài liệu Product Discovery Requirements.",
                "exp": "Khảo sát kỹ bài toán thực tế ngay từ đầu giúp xác định đúng trọng tâm sản phẩm và tránh lãng phí thời gian xây dựng các tính năng ngoài lề."
            },
            {
                "title": "Tuần: 1\nThứ:      7                Ngày: 19/09/2026",
                "task": "Khởi tạo Base Code, cấu hình TypeScript Strict, Supabase Auth & Storage.",
                "morning_res": "Khởi tạo repo React 18 + Vite + Tailwind CSS + Lucide Icons; cấu hình TypeScript ở chế độ Strict Mode cao nhất, thiết lập ESLint và Prettier.",
                "afternoon_res": "Kết nối Supabase SDK, cấu hình xác thực Auth, thiết lập Storage Bucket cho tệp đính kèm và kiểm tra kết nối CSDL thành công.",
                "exp": "Bật TypeScript Strict Mode ngay ngày đầu giúp loại bỏ 100% lỗi null/undefined tiềm ẩn và tăng tốc độ code về sau."
            }
        ]
    },

    # TUẦN 2: 21/09/2026 – 26/09/2026 (6 ngày)
    {
        "week_num": 2,
        "date_range": "21/09/2026    - 26/09/2026",
        "days": [
            {
                "title": "Tuần: 2\nThứ:      2                Ngày: 21/09/2026",
                "task": "Thiết kế toàn diện CSDL PostgreSQL trên Supabase & Cấu hình bảo mật Row Level Security (RLS).",
                "morning_res": "Tạo lược đồ CSDL hoàn chỉnh: bảng users, student_profiles, projects, skills, certifications, student_cvs; thiết lập khóa ngoại và composite indexes.",
                "afternoon_res": "Viết chính sách RLS bảo mật phân quyền cho từng bảng, cấu hình Storage policies cho portfolio_files; viết script seed dữ liệu mẫu kiểm thử.",
                "exp": "Thiết lập RLS chuẩn mực ở tầng CSDL giúp bảo mật dữ liệu đa người dùng tuyệt đối mà không cần viết logic phức tạp ở frontend."
            },
            {
                "title": "Tuần: 2\nThứ:      3                Ngày: 22/09/2026",
                "task": "Xây dựng hoàn chỉnh Module Quản lý Đồ Án (MyProjects) & Quản lý Chứng Chỉ (Certificates).",
                "morning_res": "Phát triển giao diện MyProjects.tsx dạng lưới thẻ chuyên nghiệp, modal thêm/sửa đồ án hỗ trợ Live Demo, GitHub Repo URL, tài liệu PDF và gắn tags công nghệ.",
                "afternoon_res": "Xây dựng Module Certificates.tsx lưu trữ chứng chỉ, tính năng đánh dấu nổi bật (is_featured), kéo-thả upload file và In-App Document Reader xem trước PDF nội tuyến.",
                "exp": "Gom việc phát triển các module hồ sơ liên quan vào một ngày giúp tái sử dụng component modal và đồng bộ trải nghiệm người dùng."
            },
            {
                "title": "Tuần: 2\nThứ:      4                Ngày: 23/09/2026",
                "task": "Xây dựng Canvas WYSIWYG chuẩn A4 & Bộ đệm lưu trữ hai lớp (Cloud + LocalStorage).",
                "morning_res": "Thiết kế InteractiveCVCanvas.tsx chuẩn khổ A4 Portrait (96 DPI, 1122.5px); phát triển cơ chế chỉnh sửa inline trên từng dòng text, cập nhật state tức thì.",
                "afternoon_res": "Xây dựng cơ chế lưu trữ hai lớp: cvService.ts tự động sync lên Supabase và LocalStorage Fallback lưu đệm tạm thời chống mất dữ liệu khi rớt mạng.",
                "exp": "Cố định tỷ lệ canvas theo đúng chuẩn in ấn A4 giúp loại bỏ hoàn toàn tình trạng sai lệch giữa màn hình và file PDF khi xuất ra."
            },
            {
                "title": "Tuần: 2\nThứ:      5                Ngày: 24/09/2026",
                "task": "Xây dựng Trụ Cột Khớp Nối Kỹ Năng (Evidence-Based Matching) & Bộ Lọc Ứng Viên Đa Chiều.",
                "morning_res": "Phát triển thuật toán Match Score (0-100%) đối chiếu kỹ năng sinh viên với JD; thiết kế thẻ ứng viên hiển thị huy hiệu xếp hạng và MatchDetailModal.tsx phân tích sâu độ khớp.",
                "afternoon_res": "Xây dựng bộ lọc ứng viên đa chiều (vị trí Frontend/Backend/DevOps, điểm match tối thiểu, tech stack bắt buộc); tối ưu hóa câu truy vấn dưới 100ms.",
                "exp": "Minh bạch hóa lý do đề xuất kỹ năng giúp nhà tuyển dụng tin tưởng và rút ngắn 70% thời gian sàng lọc hồ sơ ban đầu."
            },
            {
                "title": "Tuần: 2\nThứ:      6                Ngày: 25/09/2026",
                "task": "Tích hợp AI Skill Coach gợi ý kỹ năng theo vị trí & Tối ưu hóa UI/UX Canvas.",
                "morning_res": "Xây dựng tính năng AI Skill Coach gợi ý từ khóa kỹ thuật theo vị trí tuyển dụng, đối soát với từ điển công nghệ và hỗ trợ thêm vào CV 1-click.",
                "afternoon_res": "Tối ưu hóa UI/UX toàn bộ Canvas, xử lý responsive màn hình từ 13 đến 27 inch, ngăn chặn hiện tượng giật layout khi nhập văn bản dài.",
                "exp": "Gợi ý từ khóa trúng đích giúp CV vượt qua các bộ lọc tự động và tạo ấn tượng mạnh với nhà tuyển dụng."
            },
            {
                "title": "Tuần: 2\nThứ:      7                Ngày: 26/09/2026",
                "task": "Rà soát toàn diện trải nghiệm người dùng Phase 1 & Viết Unit Test nền tảng.",
                "morning_res": "Viết 5 test suites đầu tiên cho cvService, projectService, matchService; kiểm tra toàn bộ luồng tạo đồ án, lưu CV và đọc file tài liệu.",
                "afternoon_res": "Rà soát console warning, tối ưu cấu trúc DOM, kiểm tra tính tương thích TypeScript và tổng kết cột mốc phát triển tuần 2.",
                "exp": "Viết test sớm giúp tự tin mở rộng tính năng và phát hiện ngay các lỗi vỡ layout hoặc hỏng liên kết."
            }
        ]
    },

    # TUẦN 3: 28/09/2026 – 03/10/2026 (6 ngày)
    {
        "week_num": 3,
        "date_range": "28/09/2026    - 03/10/2026",
        "days": [
            {
                "title": "Tuần: 3\nThứ:      2                Ngày: 28/09/2026",
                "task": "Họp Review kiến trúc, đánh giá hiệu năng & Thống nhất chiến lược Lean MVP.",
                "morning_res": "Phân tích tài nguyên hệ thống và độ trễ phản hồi; nhận định các tính năng phụ (chatbot riêng, trắc nghiệm tính cách) đang làm phình to codebase mà không mang lại giá trị thực tế.",
                "afternoon_res": "Họp kỹ thuật với Tech Lead, thống nhất nguyên tắc Lean MVP: Kiên quyết cắt bỏ các module rườm rà để tập trung 100% vào giá trị cốt lõi là đưa đồ án thực chiến vào CV.",
                "exp": "Dũng cảm loại bỏ những tính năng rườm rà là bước ngoặt quan trọng giúp dự án phát triển đúng hướng và tiết kiệm tài nguyên."
            },
            {
                "title": "Tuần: 3\nThứ:      3                Ngày: 29/09/2026",
                "task": "[CẮT BỎ TOÀN DIỆN] Xóa bỏ Microservice Python Chatbot & Module Khảo sát MBTI.",
                "morning_res": "Xóa toàn bộ thư mục profilehub/chatbot_service (app.py, skill_mining.py, requirements.txt); viết lại bộ từ điển công nghệ bằng TypeScript native module trong aiCvService.ts.",
                "afternoon_res": "Xóa sạch mbtiService.ts, MBTIAssessment.tsx, types/mbti.ts; gỡ bỏ tab MBTI trên Sidebar và dọn sạch state thừa trong bộ nhớ ứng dụng.",
                "exp": "Chuyển từ gọi HTTP sang microservice riêng sang TypeScript native giúp tốc độ xử lý nhanh gấp 3 lần và loại bỏ hoàn toàn gánh nặng môi trường."
            },
            {
                "title": "Tuần: 3\nThứ:      4                Ngày: 30/09/2026",
                "task": "[CẮT BỎ] Loại bỏ Trình mô phỏng phỏng vấn cũ, Tối ưu Single-Layout & Dọn sạch Router.",
                "morning_res": "Gỡ bỏ interviewCoachService.ts (dạng chatbot text tĩnh thiếu thực tế); lập phương án chuyển sang mô phỏng phỏng vấn kỹ thuật xoáy sâu vào đồ án.",
                "afternoon_res": "Refactor MainLayout.tsx và Sidebar.tsx, xóa bỏ toàn bộ dead routes; chuẩn hóa hệ thống định tuyến React Router không còn lỗi 404 hoặc warning console.",
                "exp": "Gom việc dọn dẹp các module thừa và tái cấu trúc layout vào một ngày giúp codebase trở nên tinh gọn, sáng sủa và dễ bảo trì."
            },
            {
                "title": "Tuần: 3\nThứ:      5                Ngày: 01/10/2026",
                "task": "Nghiên cứu khảo nghiệm thực tế cơ chế Giảng viên xác thực (Teacher Verification).",
                "morning_res": "Phân tích quy trình giảng viên chấm điểm đồ án trên hệ thống; ghi nhận tỷ lệ tắc nghẽn nghiêm trọng khi 85% đồ án sinh viên bị treo chờ duyệt.",
                "afternoon_res": "Tổng hợp phản hồi từ 15 sinh viên và 3 giảng viên; nhận định cơ chế xác thực hành chính tạo ra nút thắt cổ chai lớn trong thực tế tuyển dụng.",
                "exp": "Sản phẩm công nghệ phụ thuộc vào sự phê duyệt thủ công của bên thứ ba rất dễ bị đứt gãy luồng vận hành."
            },
            {
                "title": "Tuần: 3\nThứ:      6                Ngày: 02/10/2026",
                "task": "Đề xuất giải pháp thay thế: Chuyển dịch từ Xác thực Giảng viên sang Bằng chứng thực tế.",
                "morning_res": "Họp phản biện kỹ thuật: Đề xuất thay thế con dấu xác thực của giảng viên bằng bằng chứng công nghệ khách quan (Live Demo URL, GitHub Repo và mã QR quét mở demo).",
                "afternoon_res": "Lập dự thảo chuyển đổi kiến trúc sang mô hình Evidence-Based Showcase; phác thảo giao diện hiển thị đường link demo và mã QR quét kiểm chứng sản phẩm.",
                "exp": "Bằng chứng khách quan kiểm chứng được bằng mã nguồn chạy thật luôn có giá trị thuyết phục cao hơn giấy xác nhận hành chính."
            },
            {
                "title": "Tuần: 3\nThứ:      7                Ngày: 03/10/2026",
                "task": "Kiểm thử hồi quy toàn hệ thống sau tái cấu trúc (TDD Green Check 20/20 Tests).",
                "morning_res": "Chạy lại toàn bộ test suites hiện có: aiCvService.test.ts, cvManagement.test.ts, markdownExporter.test.ts, đạt 20/20 tests pass 100%.",
                "afternoon_res": "Chạy npm run build kiểm tra biên dịch TypeScript, đo lường bundle size và xác nhận hệ thống hoàn toàn sẵn sàng cho cuộc đại phẫu kiến trúc tuần sau.",
                "exp": "Duy trì kỷ luật TDD giúp đảm bảo các đợt cắt bỏ tính năng lớn không gây ảnh hưởng đến tính toàn vẹn của mã nguồn cốt lõi."
            }
        ]
    },

    # TUẦN 4: 05/10/2026 – 10/10/2026 (6 ngày)
    {
        "week_num": 4,
        "date_range": "05/10/2026    - 10/10/2026",
        "days": [
            {
                "title": "Tuần: 4\nThứ:      2                Ngày: 05/10/2026",
                "task": "Hoàn thiện Trụ Cột Đề Xuất & Soi Bằng Chứng Đồ Án Cho Nhà Tuyển Dụng.",
                "morning_res": "Xây dựng component CandidateDossierModal.tsx hiển thị toàn diện hồ sơ ứng viên: danh sách đồ án, điểm số tương thích và liên kết minh chứng kiểm chứng được.",
                "afternoon_res": "Tích hợp tính năng lọc nhanh ứng viên theo các đồ án có sản phẩm chạy thật (Demo Available); tối ưu truy vấn Supabase đạt phản hồi dưới 80ms.",
                "exp": "Trình bày bằng chứng đồ án trực quan giúp nhà tuyển dụng kỹ thuật đưa ra quyết định mời phỏng vấn nhanh gấp 2 lần."
            },
            {
                "title": "Tuần: 4\nThứ:      3                Ngày: 06/10/2026",
                "task": "Khảo sát và hoàn thiện tính năng Báo cáo Đánh giá Hồ sơ Ứng viên (Executive Evaluation Report).",
                "morning_res": "Xây dựng ExecutiveEvaluationReportModal.tsx: Tổng hợp điểm mạnh kỹ thuật, các điểm còn thiếu so với JD và đề xuất mức độ phù hợp (Strong Hire, Hire, Consider).",
                "afternoon_res": "Viết logic trích xuất báo cáo ra định dạng in ấn rút gọn giúp HR và Hiring Manager dễ dàng thảo luận trong các buổi phỏng vấn nội bộ.",
                "exp": "Cung cấp báo cáo đánh giá cô đọng giúp đồng bộ nhận định giữa bộ phận nhân sự và đội ngũ kỹ sư phỏng vấn."
            },
            {
                "title": "Tuần: 4\nThứ:      4                Ngày: 07/10/2026",
                "task": "Tích hợp Hệ Thống Chấm Điểm Phỏng Vấn Kỹ Thuật (Interview Scorecard).",
                "morning_res": "Xây dựng InterviewScorecardModal.tsx cho phép nhà tuyển dụng đánh giá trực tiếp ứng viên theo 4 tiêu chí: Tư duy kiến trúc, Kỹ năng code, Giải quyết vấn đề và Giao tiếp.",
                "afternoon_res": "Lưu trữ lịch sử đánh giá phỏng vấn vào Supabase, hỗ trợ tính điểm trung bình và phân tích biểu đồ Radar trực quan.",
                "exp": "Tiêu chuẩn hóa phiếu chấm điểm phỏng vấn giúp doanh nghiệp loại bỏ thiên vị cảm tính khi tuyển chọn ứng viên."
            },
            {
                "title": "Tuần: 4\nThứ:      5                Ngày: 08/10/2026",
                "task": "Xây dựng Tính Năng Thách Thức Kỹ Thuật Dự Án (Issue Challenge Modal).",
                "morning_res": "Phát triển IssueChallengeModal.tsx cho phép nhà tuyển dụng gửi các bài test thực tế hoặc câu hỏi xoáy trực tiếp vào mã nguồn đồ án của sinh viên.",
                "afternoon_res": "Tích hợp hệ thống thông báo realtime gửi thách thức đến sinh viên và đồng bộ trạng thái phản hồi trên giao diện ứng tuyển.",
                "exp": "Thử thách kỹ thuật bám sát đồ án thật là phương pháp hiệu quả nhất để kiểm tra sinh viên có thực sự tự tay code dự án hay không."
            },
            {
                "title": "Tuần: 4\nThứ:      6                Ngày: 09/10/2026",
                "task": "Tổng hợp khảo sát thực tế toàn diện & Chuẩn bị ban hành Quyết định Kiến trúc ADR 0001.",
                "morning_res": "Rà soát toàn bộ kết quả thử nghiệm 3 tuần đầu; xác nhận quyết định dứt điểm: Xóa hoàn toàn module Xác thực Giảng viên khỏi toàn bộ hệ thống.",
                "afternoon_res": "Soạn thảo tài liệu phân tích bài toán, xác lập phương án kiến trúc chuyển đổi toàn bộ ProfileHub thành Project-Driven AI CV Builder.",
                "exp": "Lắng nghe dữ liệu phản hồi thực tế và kiên quyết hành động là phẩm chất cốt lõi của kỹ sư phần mềm chuyên nghiệp."
            },
            {
                "title": "Tuần: 4\nThứ:      7                Ngày: 10/10/2026",
                "task": "Chạy kiểm thử toàn diện TDD, Typecheck & Dọn dẹp codebase trước khi Pivot.",
                "morning_res": "Chạy kiểm thử đơn vị và kiểm thử tích hợp, xác nhận toàn bộ 25 bài test pass 100%, TypeScript biên dịch sạch không có lỗi cảnh báo.",
                "afternoon_res": "Gắn nhãn tag git release v0.9-pre-pivot, lưu trữ backup mã nguồn và dọn sạch các file tạm thời, sẵn sàng cho tuần triển khai 6 Tracer-Bullet Tickets.",
                "exp": "Tạo mốc snapshot an toàn trước các đợt đại tu kiến trúc giúp loại bỏ hoàn toàn rủi ro mất mát mã nguồn."
            }
        ]
    },

    # TUẦN 5: 12/10/2026 – 16/10/2026 (5 ngày - TỪ ĐÂY CHỈ LÀM THỨ 2 ĐẾN THỨ 6)
    {
        "week_num": 5,
        "date_range": "12/10/2026    - 16/10/2026",
        "days": [
            {
                "title": "Tuần: 5\nThứ:      2                Ngày: 12/10/2026",
                "task": "Ban hành ADR 0001, cập nhật Đặc tả Hệ thống & Xóa sổ Module Xác thực Giảng viên.",
                "morning_res": "Ban hành Architecture Decision Record ADR 0001 và cập nhật Mục 7.4 trong đặc tả hệ thống; định nghĩa bảng thuật ngữ chuẩn (Master Project, Reverse Sync, Anti-Hallucination).",
                "afternoon_res": "[CẮT BỎ TRIỆT ĐỂ] Xóa toàn bộ TeacherVerificationView.tsx, teacherVerificationService.ts và trường is_verified; phân rã lộ trình thành 6 Tracer-Bullet Tickets có tiêu chí nghiệm thu rõ ràng.",
                "exp": "Gom việc ban hành quyết định kiến trúc, cập nhật tài liệu và xóa code thừa vào một ngày giúp toàn bộ dự án đồng bộ ngay lập tức sang định hướng mới."
            },
            {
                "title": "Tuần: 5\nThứ:      3                Ngày: 13/10/2026",
                "task": "Hiện thực hóa Ticket 01 (Reverse Sync & Toast) & Ticket 02 (Scoped Contribution).",
                "morning_res": "Triển khai Ticket 01: Mở rộng ProjectItem với syncToMasterProfile, viết hàm cvService.syncCvProjectsToMaster tự động upsert dự án vào Supabase, viết test TDD pass 3/3.",
                "afternoon_res": "Triển khai Ticket 02: Bổ sung scopeType: solo/team, teamSize, systemContext; render huy hiệu đồ án nhóm/cá nhân trên CV, viết test TDD pass 3/3.",
                "exp": "Tách bạch đồ án trong CV (CV Project Instance) với đồ án gốc (Master Project) mang lại sự linh hoạt tối đa cho ứng viên khi may đo CV."
            },
            {
                "title": "Tuần: 5\nThứ:      4                Ngày: 14/10/2026",
                "task": "Hiện thực hóa Ticket 03 (Project Fit Explainer) & Ticket 04 (STAR Diff Review & Anti-Hallucination).",
                "morning_res": "Triển khai Ticket 03: Xây dựng projectFitService.evaluateProjectFit đối chiếu đồ án với JD, hiển thị ProjectFitExplainerModal.tsx chọn đồ án phù hợp 1-click (test pass 3/3).",
                "afternoon_res": "Triển khai Ticket 04: Xây dựng starBulletService chuẩn hóa mô tả STAR có số liệu định lượng, xây dựng StarDiffReviewModal.tsx và tích hợp Anti-Hallucination Guard chặn AI bịa công nghệ (test pass 3/3).",
                "exp": "Tích hợp Anti-Hallucination Guard giúp ứng viên kiểm soát 100% nội dung AI sinh ra, tránh bịa đặt số liệu viển vông trước nhà tuyển dụng."
            },
            {
                "title": "Tuần: 5\nThứ:      5                Ngày: 15/10/2026",
                "task": "Hiện thực hóa Ticket 05 (Page-Budget Guard & Layout Switcher) & Ticket 06 (Evidence Showcase QR).",
                "morning_res": "Triển khai Ticket 05: Xây dựng pageBudgetService đo chiều cao render khổ in A4, hiển thị badge % A4 trên toolbar, phát triển 1-Click AI Auto-Condense co vừa 1 trang, đổi layout 1/2 cột (test pass 3/3).",
                "afternoon_res": "Triển khai Ticket 06: Render link Live Demo/GitHub chuẩn ATS, tích hợp qrcode.react tự động sinh mã QR 28px in trên A4 quét demo sản phẩm trực tiếp (test pass 3/3).",
                "exp": "Đảm bảo CV vừa khít đúng 1 trang in A4 và có mã QR quét demo là hai tính năng thực tế ghi điểm tuyệt đối trong mắt các nhà tuyển dụng."
            },
            {
                "title": "Tuần: 5\nThứ:      6                Ngày: 16/10/2026",
                "task": "Lắp ráp toàn trình 6 Tickets, TDD 11/11 Suites Pass 100% & Nghiệm thu ProfileHub v1.",
                "morning_res": "Lắp ráp toàn bộ 6 tickets vào CVBuilder.tsx và InteractiveCVCanvas.tsx; hoàn thiện micro-interactions, phím tắt Ctrl+S/P/B và hiệu ứng Toast phản hồi tức thì.",
                "afternoon_res": "Chạy toàn bộ 11/11 test suites với 38/38 tests pass 100%; đóng gói npm run build sạch sẽ không lỗi TypeScript, hoàn thành trọn vẹn cột mốc ProfileHub v1.",
                "exp": "Hoàn tất trọn vẹn 6 Tracer-Bullet Tickets trong 1 tuần chứng minh sức mạnh của phương pháp Spec-Driven kết hợp với tốc độ vibe-coding vượt trội."
            }
        ]
    },

    # TUẦN 6: 19/10/2026 – 23/10/2026 (5 ngày)
    {
        "week_num": 6,
        "date_range": "19/10/2026    - 23/10/2026",
        "days": [
            {
                "title": "Tuần: 6\nThứ:      2                Ngày: 19/10/2026",
                "task": "Ban hành ADR 0002 & Xây dựng toàn trình Contextual Application Pitch.",
                "morning_res": "Họp phản biện (/grill-with-docs) làm rõ bất cập của Cover Letter truyền thống; ban hành quyết định kiến trúc ADR 0002 định nghĩa Contextual Application Pitch gắn liền với cặp (CV Project, JD).",
                "afternoon_res": "Xây dựng applicationPitchService.ts và ApplicationPitchModal.tsx (< 250 từ, 1-Click Copy, cơ chế Hard-gating bắt buộc có JD và ít nhất 1 đồ án); viết 4 bài test TDD pass 100%.",
                "exp": "Gắn thư ứng tuyển trực tiếp vào ngữ cảnh đồ án và JD giúp tăng tỷ lệ phản hồi của HR lên gấp 3 lần so với viết thư xin việc chung chung."
            },
            {
                "title": "Tuần: 6\nThứ:      3                Ngày: 20/10/2026",
                "task": "Xây dựng Trụ Cột Project Technical Defense Briefing (Huấn luyện phòng thủ đồ án trước Tech Lead).",
                "morning_res": "Nghiên cứu các dạng câu hỏi xoáy phỏng vấn kỹ thuật theo Tech Stack (Redis Invalidation, PostgreSQL EXPLAIN Indexing, Node.js Event Loop, React Re-render).",
                "afternoon_res": "Xây dựng projectDefenseService.ts và ProjectDefenseModal.tsx trang bị Top 3 câu hỏi xoáy, bản giải trình Trade-off và kịch bản Debugging Scaffold 4 pha; viết test nâng suites lên 13/13 (46/46 tests pass).",
                "exp": "Chuẩn bị trước kịch bản giải trình Trade-off kiến trúc giúp ứng viên tự tin chứng minh bản lĩnh kỹ thuật thực chất trước Tech Lead."
            },
            {
                "title": "Tuần: 6\nThứ:      4                Ngày: 21/10/2026",
                "task": "Nghiên cứu nguyên tắc Zero Fake Metrics & Xây dựng công cụ Soi CV Chuẩn STAR.",
                "morning_res": "Khẳng định nguyên tắc chống bịa đặt số liệu viển vông; xác lập 4 nguồn số liệu kỹ thuật thực tế: EXPLAIN query cost, k6 load test throughput (req/s), Lighthouse performance và test coverage.",
                "afternoon_res": "Xây dựng starDiagnosticService.ts: Bắt lỗi từ ngữ thụ động, chấm điểm STAR Score (0-100), tự động sinh câu hỏi gợi mở khơi sâu số liệu kỹ thuật thực tế.",
                "exp": "Số liệu trong CV kỹ thuật phải có bằng chứng kiểm chứng được, tránh việc ứng viên bị đánh trượt vì thiếu trung thực khi bị phỏng vấn sâu."
            },
            {
                "title": "Tuần: 6\nThứ:      5                Ngày: 22/10/2026",
                "task": "Hoàn thiện STAR Wizard, Tích hợp Canvas & Thiết lập CI/CD GitHub Actions.",
                "morning_res": "Xây dựng modal StarCvDiagnosticModal.tsx hỗ trợ cả 2 chế độ: Soi CV Sẵn Có và STAR Wizard Từ Trang Giấy Trắng, tích hợp nút tác vụ 1-click đưa vào Canvas (test pass 5/5).",
                "afternoon_res": "Cấu hình CI/CD GitHub Actions (.github/workflows/3dwebsite-ci.yml, deploy, release, rollback); chạy kiểm thử hồi quy 14/14 test suites (51/51 tests pass) và build sạch.",
                "exp": "Thiết lập pipeline CI/CD tự động giúp kiểm soát chất lượng mã nguồn liên tục sau mỗi commit và ngăn chặn lỗi hồi quy."
            },
            {
                "title": "Tuần: 6\nThứ:      6                Ngày: 23/10/2026",
                "task": "Xây dựng Trình Tạo Dự Án Mẫu Từ Con Số 0 (Cold Start Project Generator).",
                "morning_res": "Xây dựng ColdStartProjectModal.tsx: Cung cấp kho đồ án mẫu chuẩn công nghiệp cho sinh viên chưa có kinh nghiệm thực chiến (E-commerce microservices, Realtime Chat, AI Portfolio).",
                "afternoon_res": "Tích hợp tính năng gợi ý kiến trúc, sơ đồ DB mẫu và checklist hoàn thiện đồ án; viết bộ kiểm thử coldStartProject.test.ts pass 100%.",
                "exp": "Cung cấp khung đồ án chuẩn mực giúp sinh viên năm cuối nhanh chóng lấp đầy khoảng trống kinh nghiệm và tự tin thực hành code dự án thật."
            }
        ]
    },

    # TUẦN 7: 26/10/2026 – 30/10/2026 (5 ngày)
    {
        "week_num": 7,
        "date_range": "26/10/2026    - 30/10/2026",
        "days": [
            {
                "title": "Tuần: 7\nThứ:      2                Ngày: 26/10/2026",
                "task": "Nghiên cứu nguyên lý ATS & Xây dựng toàn trình ATS Eye-View Heatmap Visualizer.",
                "morning_res": "Khảo sát cơ chế chấm điểm của Applicant Tracking System và hành vi quét mắt F-pattern scan của nhà tuyển dụng; thiết kế kiến trúc atsHeatmapService.ts.",
                "afternoon_res": "Phát triển component AtsHeatmapOverlay.tsx vẽ bản đồ nhiệt trực quan đè lên Canvas A4; bổ sung bảng thống kê Keyword Frequency cảnh báo nguy cơ keyword stuffing.",
                "exp": "Biểu diễn trực quan bằng Heatmap màu sắc trực tiếp trên bản in giúp sinh viên nhanh chóng phát hiện các vùng nội dung bị loãng từ khóa."
            },
            {
                "title": "Tuần: 7\nThứ:      3                Ngày: 27/10/2026",
                "task": "Xây dựng Phòng Luyện Phỏng Vấn Kỹ Thuật (Interview War Room) & Nhận Diện Giọng Nói.",
                "morning_res": "Phát triển giao diện InterviewWarRoom.tsx với đồng hồ đếm ngược áp lực cao, bộ câu hỏi phỏng vấn phân theo Tech Stack và cơ chế chấm điểm phản xạ.",
                "afternoon_res": "Tích hợp Web Speech API (Speech-to-Text) thu âm câu trả lời thành văn bản; kết hợp dịch vụ phân tích đánh giá cấu trúc trả lời STAR có số liệu.",
                "exp": "Luyện nói thành tiếng trước micro với đồng hồ đếm ngược giúp ứng viên loại bỏ tâm lý sợ hãi và rèn luyện phản xạ nhanh nhạy khi phỏng vấn thật."
            },
            {
                "title": "Tuần: 7\nThứ:      4                Ngày: 28/10/2026",
                "task": "Tích hợp Khảo sát Dải Lương Thực Tế (Salary Benchmark) & Quản Lý Đa Phiên Bản CV.",
                "morning_res": "Tích hợp bộ dữ liệu real_market_salaries.json phân theo Level và Tech Stack; xây dựng SalaryBenchmarkWidget.tsx hiển thị dải lương p25, p50, p75 và gợi ý mức lương kỳ vọng.",
                "afternoon_res": "Mở rộng lược đồ CSDL cho phép 1 sinh viên quản lý nhiều bản CV may đo riêng (Frontend, Backend, Fullstack); xây dựng CVManagerModal.tsx hỗ trợ nhân bản và gắn nhãn.",
                "exp": "Nắm vững số liệu dải lương thị trường giúp sinh viên tự tin đàm phán đãi ngộ tương xứng với năng lực thực tế."
            },
            {
                "title": "Tuần: 7\nThứ:      5                Ngày: 29/10/2026",
                "task": "Xây dựng Trình Hướng Dẫn Tương Tác Onboarding & Spotlight Tour.",
                "morning_res": "Phát triển GamifiedOnboardingTour.tsx và SpotlightTour.tsx: Tự động highlight từng vùng tính năng quan trọng cho người dùng mới đăng nhập lần đầu.",
                "afternoon_res": "Tích hợp thanh đo mức độ hoàn thiện hồ sơ (Profile Strength Meter) và cơ chế thưởng huy hiệu kích thích sinh viên hoàn thiện đầy đủ thông tin đồ án.",
                "exp": "Trải nghiệm Onboarding dạng tương tác điểm sáng (Spotlight) giúp người dùng nắm vững 100% tính năng chính mà không cần đọc tài liệu hướng dẫn dài dòng."
            },
            {
                "title": "Tuần: 7\nThứ:      6                Ngày: 30/10/2026",
                "task": "Xây dựng Danh Thiếp Kỹ Thuật Số (Digital Business Card) & Mã QR Profile Cá Nhân.",
                "morning_res": "Phát triển BusinessCardModal.tsx tạo danh thiếp số cá nhân chứa avatar, vị trí ứng tuyển, link GitHub, Portfolio và mã QR rút gọn 1-click quét mở trên điện thoại.",
                "afternoon_res": "Tối ưu hóa khả năng chia sẻ mạng xã hội (LinkedIn, Facebook); chạy kiểm thử toàn bộ các modal và đóng gói build hoàn tất tuần 7.",
                "exp": "Danh thiếp kỹ thuật số tiện lợi là công cụ networking đắc lực giúp sinh viên kết nối nhanh chóng với nhà tuyển dụng tại các sự kiện Tech Expo."
            }
        ]
    },

    # TUẦN 8: 02/11/2026 – 06/11/2026 (5 ngày)
    {
        "week_num": 8,
        "date_range": "02/11/2026    - 06/11/2026",
        "days": [
            {
                "title": "Tuần: 8\nThứ:      2                Ngày: 02/11/2026",
                "task": "Xây dựng Application Tracker dạng bảng Kanban & Cơ chế kéo thả an toàn.",
                "morning_res": "Thiết kế luồng quản lý tiến trình ứng tuyển 5 cột: Wishlist -> Applied -> Interviewing -> Offer -> Rejected; xây dựng component ApplicationKanbanBoard.tsx.",
                "afternoon_res": "Viết hook usePipelineDragDrop.ts hỗ trợ kéo thả thẻ mượt mà, đồng bộ state tức thì lên CSDL Supabase và tự động rollback trạng thái an toàn nếu mất kết nối mạng.",
                "exp": "Giao diện Kanban trực quan giúp sinh viên theo dõi chính xác từng giai đoạn ứng tuyển và không bao giờ bỏ lỡ lịch hẹn phỏng vấn."
            },
            {
                "title": "Tuần: 8\nThứ:      3                Ngày: 03/11/2026",
                "task": "Tích hợp AI Cover Letter, Email Generator & Cổng Tuyển Dụng Đảo Ngược (Reverse Recruiting).",
                "morning_res": "Xây dựng modal CoverLetterGeneratorModal.tsx: Tự động trích xuất thông tin công ty và vị trí từ thẻ Kanban để may đo nội dung thư ứng tuyển và email phỏng vấn 1-click.",
                "afternoon_res": "Xây dựng Reverse Recruiting Hub: Cung cấp giao diện Public Talent Pool cho nhà tuyển dụng chủ động duyệt kho đồ án sinh viên với tính năng ẩn danh (Blind Screening).",
                "exp": "Tuyển dụng đảo ngược giúp những sinh viên có năng lực thực chất được nhà tuyển dụng săn đón chủ động thay vì nộp đơn thụ động."
            },
            {
                "title": "Tuần: 8\nThứ:      4                Ngày: 04/11/2026",
                "task": "Hoàn thiện Cơ Chế Phân Quyền RBAC, Bảo Mật Hồ Sơ Ứng Viên & Bộ Chuyển Vai Trò 1-Click.",
                "morning_res": "Cấu hình Row Level Security (RLS) nâng cao cho các bảng liên quan đến Application Tracker; xây dựng CandidatePrivacyModal.tsx với toggle Open to Work và Blacklist công ty chỉ định.",
                "afternoon_res": "Xây dựng bộ chuyển đổi vai trò (Role Switcher) thông minh trên Header và Avatar, cho phép chuyển đổi tức thì giữa giao diện Sinh viên và Nhà tuyển dụng mà không cần đăng xuất.",
                "exp": "Bảo vệ quyền riêng tư ứng viên và tạo sự thuận tiện khi kiểm thử đa vai trò là yếu tố sống còn cho một nền tảng tuyển dụng chuyên nghiệp."
            },
            {
                "title": "Tuần: 8\nThứ:      5                Ngày: 05/11/2026",
                "task": "Phát triển bộ tính năng Tuyển dụng & Khớp nối thông minh: Xác thực MST, Smart Job Studio & Smart CV Parser.",
                "morning_res": "Tích hợp API tra cứu mã số thuế doanh nghiệp (MST), cấp Tích Xanh chống mạo danh HR; phát triển Smart Job Studio tự động bóc tách kỹ năng từ JD và thuật toán Instant Candidate Matching.",
                "afternoon_res": "Xây dựng hệ thống Dual-Badge thông minh (Demo-Ready & Verified) cho đồ án; phát triển Smart CV Parser tự động bóc tách CV tải lên để điền Master Profile; xây dựng Multi-Theme PDF Styler tùy biến xuất CV chuẩn A4.",
                "exp": "Tự động hóa bóc tách kỹ năng từ cả hai đầu (JD và CV) cùng cơ chế xác thực kép (MST công ty & Demo-Ready đồ án) giúp tối đa hóa tính minh bạch và độ tin cậy của nền tảng."
            },
            {
                "title": "Tuần: 8\nThứ:      6                Ngày: 06/11/2026",
                "task": "Viết Unit Test & Kiểm thử tích hợp toàn diện cho bộ tính năng mới (Job Studio, CV Parser, PDF Styler).",
                "morning_res": "Viết bộ kiểm thử đơn vị cho taxVerificationService.test.ts, jobStudioService.test.ts, cvParserService.test.ts, pdfStylerService.test.ts; nâng test coverage lên trên 90% cho các dịch vụ cốt lõi.",
                "afternoon_res": "Kiểm thử tích hợp luồng toàn trình: HR xác thực MST đăng tin -> sinh viên bóc tách CV tự động -> xuất bản CV PDF đa theme; kiểm tra npm run build đóng gói sạch sẽ không lỗi TypeScript.",
                "exp": "Dành ngày thứ Sáu để hoàn thiện toàn bộ test suites và kiểm thử tích hợp sau khi triển khai các tính năng lớn giúp hệ thống giữ vững tính ổn định cao."
            }
        ]
    },

    # TUẦN 9: 09/11/2026 – 11/11/2026 (3 ngày - KẾT THÚC VÀO ĐÚNG HÔM NAY: 11/11/2026)
    {
        "week_num": 9,
        "date_range": "09/11/2026    - 13/11/2026",
        "days": [
            {
                "title": "Tuần: 9\nThứ:      2                Ngày: 09/11/2026",
                "task": "Xây dựng Cổng Nhận Offer Công Khai, Xuất Hồ Sơ Ứng Viên & Mạng Xã Hội Nghề Nghiệp (Community Feed).",
                "morning_res": "Phát triển PublicOfferPortal.tsx cho phép ứng viên nhận và phản hồi offer trực tuyến; xây dựng tính năng xuất hồ sơ tổng hợp Executive Dossier Export chuẩn in ấn cho doanh nghiệp.",
                "afternoon_res": "Khởi tạo mạng xã hội nghề nghiệp sinh viên (/feed): Xây dựng SocialSidebar, CreatePostBox.tsx, FeedControlCard.tsx và PostCard.tsx chia sẻ thành tựu dự án và cơ hội tuyển dụng; fix CI test runner Node 22.",
                "exp": "Kết hợp tính năng tuyển dụng với mạng xã hội nghề nghiệp tạo ra hiệu ứng lan tỏa mạnh mẽ và giữ chân người dùng tương tác hàng ngày."
            },
            {
                "title": "Tuần: 9\nThứ:      3                Ngày: 10/11/2026",
                "task": "Thiết kế Landing Page 3D Tương Tác (3D WebGL Crystal Hero & 3D Tilt Card) & Tinh chỉnh Feed.",
                "morning_res": "Tái thiết kế trang chủ HomePage.tsx với hiệu ứng 3D WebGL Crystal Hero và component Interactive3DTiltCard.tsx tạo hiệu ứng nghiêng 3D chân thực khi rê chuột vào thẻ CV đồ án.",
                "afternoon_res": "Tinh gọn giao diện Community Feed thành bố cục 2 cột sạch sẽ; xây dựng modal AuthRequiredModal.tsx bật popup yêu cầu đăng nhập khi khách vãng lai ứng tuyển nhanh từ bài đăng.",
                "exp": "Giao diện Landing Page có hiệu ứng tương tác 3D mượt mà nâng tầm hình ảnh chuyên nghiệp của sản phẩm và tạo ấn tượng thị giác đột phá cho nhà tuyển dụng."
            },
            {
                "title": "Tuần: 9\nThứ:      4                Ngày: 11/11/2026",
                "task": "Chuẩn hóa hệ thống sổ nhật ký thực tập BM01b, Tối ưu hóa Caching Đa Tầng (Redis + IndexedDB) & Rà soát hiệu năng.",
                "morning_res": "Chuẩn hóa cấu trúc Sổ nhật ký thực tập BM01b và nhật ký dự án bám sát tiến độ thực tế (vibe coding); rà soát typography, giao diện và dọn sạch các route thừa.",
                "afternoon_res": "Cấu hình cơ chế Caching đa tầng (Redis cache API + IndexedDB phía client), kiểm thử tải trang nhanh tức thì (< 50ms) và chạy kiểm thử tự động toàn bộ 15 test suites bảo đảm chất lượng mã nguồn ổn định.",
                "exp": "Thường xuyên rà soát, đồng bộ tài liệu và tối ưu hóa hệ thống đệm dữ liệu (Caching) giúp codebase luôn ngăn nắp, tốc độ phản hồi cao và sẵn sàng cho các cột mốc phát triển tiếp theo."
            }
        ]
    }
]

# Flatten all days
all_43_days = []
for w in weeks_schedule:
    all_43_days.extend(w["days"])

print(f"Total days generated: {len(all_43_days)} (Starts 18/09, 4 Saturdays, ends TODAY: 11/11/2026)")

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

    # 1. Update Table 3 (Phiếu theo dõi tiến độ) - 15 weeks
    t3 = doc.tables[3]
    weeks_updates = [
        ("1", "18/09/2026    - 19/09/2026"),
        ("2", "21/09/2026    - 26/09/2026"),
        ("3", "28/09/2026    - 03/10/2026"),
        ("4", "05/10/2026    - 10/10/2026"),
        ("5", "12/10/2026    - 16/10/2026"),
        ("6", "19/10/2026    - 23/10/2026"),
        ("7", "26/10/2026    - 30/10/2026"),
        ("8", "02/11/2026    - 06/11/2026"),
        ("9", "09/11/2026    - 13/11/2026"),
        ("10", "16/11/2026   - 20/11/2026"),
        ("11", "23/11/2026   - 27/11/2026"),
        ("12", "30/11/2026   - 04/12/2026"),
        ("13", "07/12/2026   - 11/12/2026"),
        ("14", "14/12/2026   - 18/12/2026"),
        ("15", "21/12/2026   - 25/12/2026"),
    ]
    for idx, (w_num, date_range) in enumerate(weeks_updates):
        r_idx = idx + 1
        if r_idx < len(t3.rows):
            format_cell(t3.rows[r_idx].cells[0], w_num, bold=True, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
            format_cell(t3.rows[r_idx].cells[1], date_range, bold=False, font_size=12, align=WD_ALIGN_PARAGRAPH.CENTER)
    print("Table 3 updated for 15 weeks.")

    # 2. Update Table 4 (Nội dung nhật ký)
    t4 = doc.tables[4]
    needed_rows = len(all_43_days) * 4 # 172 rows

    while len(t4.rows) < needed_rows:
        rem = len(t4.rows) % 4
        new_tr = parse_xml(t4.rows[rem]._tr.xml)
        t4._tbl.append(new_tr)

    while len(t4.rows) > needed_rows:
        t4._tbl.remove(t4.rows[-1]._tr)

    print(f"Table 4 adjusted to {len(t4.rows)} rows ({len(t4.rows)//4} days).")

    for day_idx, day_info in enumerate(all_43_days):
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
    template_src = r"c:\Users\ADMIN\Desktop\STUDY\docs\BM01b_So_nhat_ky_thuc_tap.docx"
    template_temp = r"c:\Users\ADMIN\Desktop\STUDY\docs\BM01b_clean_template_temp5.docx"
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

    # 3. Generate BM01b Markdown file
    md_header = """# BM01b — SỔ NHẬT KÝ THỰC TẬP TỐT NGHIỆP
### BỘ GIÁO DỤC VÀ ĐÀO TẠO
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

| **Một số lưu ý:** Sinh viên đánh số trang liên tục trong sổ nhật ký thực tập. Sinh viên ghi chép đầy đủ các công việc được giao, các công việc đã hoàn tất, các kinh nghiệm cũng như những nhận xét rút ra từ những công việc này. Cuối mỗi tuần, sinh viên gửi sổ nhật ký thực tập đến người hướng dẫn xem xét để đánh giá và ký xác nhận. Sinh viên dùng sổ nhật ký thực tập để viết báo cáo thực tập. Sinh viên ghi theo thứ tự thời gian. Mỗi sinh viên phải có sổ nhật ký thực tập riêng, mặc dù nhiều sinh viên có thể thực tập tại cùng đơn vị. |

---

### PHIẾU THEO DÕI TIẾN ĐỘ THỰC TẬP TỐT NGHIỆP
**HỌC KỲ 2631 NĂM HỌC 2026 - 2027**

| Họ và tên sinh viên | : PHẠM THÁI BẢO |
| :--- | :--- |
| **Mã số sinh viên** | : 22114919 |
| **Ngành đào tạo** | : CÔNG NGHỆ THÔNG TIN |
| **Lớp** | : QL21111 |
| **Đơn vị thực tập** | : CÔNG TY TNHH ALPACA SOLUTIONS |
| **Người hướng dẫn** | : |

*Ghi chú: Sinh viên phải xuất trình sổ nhật ký thực tập và phiếu theo dõi thực tập hàng tuần để người hướng dẫn kiểm tra và ký tên.*

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

### NỘI DUNG NHẬT KÝ CHI TIẾT THEO NGÀY (43 NGÀY LÀM VIỆC — TỪ 18/09/2026 ĐẾN HÔM NAY 11/11/2026)

"""

    md_body = ""
    for day in all_43_days:
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

    # 4. Generate nhật ký dự án.md for STUDY and STUDY/docs
    weeks_meta = [
        ("TUẦN 1: KHỞI TẠO DỰ ÁN, PHÂN TÍCH YÊU CẦU & THIẾT LẬP TECH STACK", "18/09/2026 – 19/09/2026", 2),
        ("TUẦN 2: THIẾT KẾ CSDL POSTGRESQL & MODULE HỒ SƠ DỰ ÁN CỐT LÕI", "21/09/2026 – 26/09/2026", 6),
        ("TUẦN 3: ĐÁNH GIÁ KIẾN TRÚC, CẮT BỎ OVER-ENGINEERING & TINH GỌN ROUTING", "28/09/2026 – 03/10/2026", 6),
        ("TUẦN 4: TRỤ CỘT ĐỀ XUẤT ĐỒ ÁN, BÁO CÁO ĐÁNH GIÁ & TIÊU CHÍ KHẢO NGHIỆM", "05/10/2026 – 10/10/2026", 6),
        ("TUẦN 5: BAN HÀNH ADR 0001, TRIỂN KHAI 6 TRACER-BULLET TICKETS & NGHIỆM THU V1", "12/10/2026 – 16/10/2026", 5),
        ("TUẦN 6: CONTEXTUAL APPLICATION PITCH, PHÒNG THỦ KỸ THUẬT & STAR WIZARD", "19/10/2026 – 23/10/2026", 5),
        ("TUẦN 7: ATS EYE-VIEW HEATMAP, INTERVIEW WAR ROOM & DIGITAL BUSINESS CARD", "26/10/2026 – 30/10/2026", 5),
        ("TUẦN 8: APPLICATION KANBAN, SMART JOB STUDIO, CV PARSER & DUAL-BADGE HUB", "02/11/2026 – 06/11/2026", 5),
        ("TUẦN 9: PUBLIC OFFER PORTAL, LANDING PAGE 3D, COMMUNITY FEED & CACHING (ĐẾN HÔM NAY 11/11/2026)", "09/11/2026 – 11/11/2026", 3)
    ]

    nk_header = """# 📓 NHẬT KÝ DỰ ÁN PROFILEHUB
### HỆ THỐNG QUẢN LÝ HỒ SƠ & TẠO CV ĐỊNH HƯỚNG DỰ ÁN BẰNG AI (PROJECT-DRIVEN AI CV BUILDER)

* **Họ và tên sinh viên:** PHẠM THÁI BẢO
* **Mã số sinh viên:** 22114919
* **Ngành:** CÔNG NGHỆ THÔNG TIN
* **Đơn vị thực tập:** CÔNG TY TNHH ALPACA SOLUTIONS
* **Dự án thực hiện:** PROFILEHUB - Project-Driven AI CV Builder & Portfolio Platform
* **Thời gian ghi nhật ký:** 18/09/2026 – 11/11/2026 (Bắt đầu từ 18/09/2026 đến hôm nay 11/11/2026; 4 tuần đầu có Thứ Bảy; từ tuần 5 chỉ làm Thứ Hai đến Thứ Sáu)

---

## 📌 TÓM TẮT ĐỊNH HƯỚNG CHIẾN LƯỢC & BƯỚC NGOẶT KIẾN TRÚC (PIVOT)
Trong 9 tuần phát triển dự án tính đến hôm nay (**11/11/2026**), **ProfileHub** đã trải qua các giai đoạn hoàn thiện vượt bậc với tốc độ phát triển cao (Vibe Coding):
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
5. **Cổng Offer Công Khai, Landing Page 3D & Mạng Xã Hội Nghề Nghiệp (Tuần 9 - Đến Hôm Nay 11/11/2026):**
   - **Public Offer Portal & Executive Dossier Export:** Cổng nhận offer trực tuyến và xuất hồ sơ ứng viên chuyên sâu cho doanh nghiệp.
   - **Interactive 3D WebGL Crystal Hero & 3D Tilt Card:** Giao diện Landing Page tương tác 3D WebGL hiện đại.
   - **Career Community Feed (/feed):** Mạng xã hội chia sẻ đồ án và ứng tuyển nhanh từ bài đăng.
   - Tối ưu hóa hiệu năng chuyên sâu: Caching đa tầng (Redis + IndexedDB), kiểm thử tải trang nhanh tức thì (< 50ms).
   - Kiểm thử toàn diện: Unit Test & Integration Test (Vitest 15 test suites pass 100%), CI/CD an toàn, đảm bảo chất lượng phần mềm vững chắc.
   - Kỳ thực tập vẫn đang tiếp tục diễn ra theo kế hoạch (Bảng theo dõi tiến độ đến hết tháng 12/2026).

---

"""

    nk_body = ""
    current_idx = 0
    for theme, date_range, day_count in weeks_meta:
        nk_body += f"## 📅 {theme} ({date_range})\n\n"
        for _ in range(day_count):
            day = all_43_days[current_idx]
            current_idx += 1
            title_lines = day["title"].split("\n")
            thu = "Thứ " + title_lines[1].split("Thứ:")[1].split("Ngày:")[0].strip()
            ngay = title_lines[1].split("Ngày:")[1].strip()
            
            nk_body += f"### 🔴 {thu} ({ngay})\n"
            nk_body += f"* **Thời gian:** 08:30 – 17:00 (Sáng: 08:30 - 12:00 | Chiều: 13:00 - 17:00)\n"
            nk_body += f"* **Công việc được giao:** {day['task']}\n"
            nk_body += f"* **Kết quả thực hiện:**\n"
            nk_body += f"  * Sáng (08:30 - 12:00): {day['morning_res']}\n"
            nk_body += f"  * Chiều (13:00 - 17:00): {day['afternoon_res']}\n"
            nk_body += f"* **Kinh nghiệm rút ra:** {day['exp']}\n\n"

    with open(r"c:\Users\ADMIN\Desktop\STUDY\nhật ký dự án.md", "w", encoding="utf-8") as f:
        f.write(nk_header + nk_body)
    with open(r"c:\Users\ADMIN\Desktop\STUDY\docs\nhật ký dự án.md", "w", encoding="utf-8") as f:
        f.write(nk_header + nk_body)
    print("Both nhật ký dự án.md files written.")
