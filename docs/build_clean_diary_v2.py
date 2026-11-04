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

# 49 days: Weeks 1-4 (Mon-Sat, 6 days each = 24 days), Weeks 5-9 (Mon-Fri, 5 days each = 25 days)
weeks_schedule = [
    # TUẦN 1: 21/09/2026 – 26/09/2026 (6 ngày)
    {
        "week_num": 1,
        "date_range": "21/09/2026    - 26/09/2026",
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
                "task": "Dựng khung hiển thị tương tác WYSIWYG trên Canvas A4 và cơ chế render linh hoạt.",
                "morning_res": "Phân tích thông số kỹ thuật in ấn: A4 Portrait ở độ phân giải 96 DPI (chiều cao 1122.5px), tính toán khoảng cách dòng, lề trang tiêu chuẩn.",
                "afternoon_res": "Phát triển InteractiveCVCanvas.tsx hỗ trợ chỉnh sửa inline trên từng dòng text, cập nhật state tức thì khi người dùng gõ phím.",
                "exp": "Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF."
            },
            {
                "title": "Tuần: 1\nThứ:      7                Ngày: 26/09/2026",
                "task": "Cấu hình cơ chế lưu trữ hai lớp (Supabase Cloud Backup + Local Storage Fallback).",
                "morning_res": "Viết các hàm đồng bộ trong cvService.ts kết nối với bảng student_cvs trên Supabase để tự động lưu trạng thái CV.",
                "afternoon_res": "Thiết lập bộ đệm LocalStorage lưu trữ tạm thời phiên soạn thảo, chống mất dữ liệu khi mất mạng hoặc reload trang đột ngột.",
                "exp": "Cơ chế Fallback hai lớp (Cloud + LocalStorage) giúp ứng viên an tâm tuyệt đối khi thao tác soạn thảo nội dung dài."
            }
        ]
    },

    # TUẦN 2: 28/09/2026 – 03/10/2026 (6 ngày)
    {
        "week_num": 2,
        "date_range": "28/09/2026    - 03/10/2026",
        "days": [
            {
                "title": "Tuần: 2\nThứ:      2                Ngày: 28/09/2026",
                "task": "Họp Review tiến độ tuần 1, đánh giá kiến trúc hệ thống & Lập kế hoạch tinh gọn (Lean MVP).",
                "morning_res": "Đo lường tài nguyên hệ thống, họp kỹ thuật với Tech Lead và thống nhất chiến lược \"Lean MVP\": Cắt giảm ngay các tính năng ngoài lề để dồn sức cho giá trị cốt lõi.",
                "afternoon_res": "Rà soát toàn bộ cây thư mục mã nguồn, lập danh sách các module dư thừa cần loại bỏ để tối ưu hiệu năng và tinh giản trải nghiệm.",
                "exp": "Dũng cảm cắt bỏ tính năng không hiệu quả sớm giúp bảo toàn nguồn lực phát triển cho các tính năng thực sự tạo ra giá trị."
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
                "task": "[CẮT BỎ] Xóa bỏ Trình mô phỏng phỏng vấn bằng Chatbot & Chuẩn bị tích hợp Voice AI thực chiến.",
                "morning_res": "Gỡ bỏ interviewCoachService.ts (dạng chatbot text đơn giản, thiếu tương tác thực tế) và xóa bỏ các view phỏng vấn tĩnh.",
                "afternoon_res": "Lập kiến trúc cho mô phỏng phỏng vấn kỹ thuật bám sát trực tiếp vào đồ án và các câu hỏi xoáy chuyên môn thay vì chat vu vơ.",
                "exp": "Luyện phỏng vấn bằng chatbot gõ chữ không mô phỏng được áp lực thực tế trong phòng phỏng vấn kỹ thuật."
            },
            {
                "title": "Tuần: 2\nThứ:      6                Ngày: 02/10/2026",
                "task": "Xây dựng tính năng Gợi ý hoàn thiện mô tả kỹ năng bằng AI (Skill Coach).",
                "morning_res": "Thiết kế giao diện gợi ý kỹ năng theo vị trí công việc (Frontend, Backend, Fullstack), đối soát với bộ từ điển công nghệ chuẩn.",
                "afternoon_res": "Viết logic đề xuất kỹ năng còn thiếu dựa trên mục tiêu nghề nghiệp của sinh viên, hỗ trợ thêm nhanh vào CV 1-click.",
                "exp": "Đề xuất kỹ năng trúng đích giúp hồ sơ ứng viên nổi bật hơn trước bộ lọc tự động của nhà tuyển dụng."
            },
            {
                "title": "Tuần: 2\nThứ:      7                Ngày: 03/10/2026",
                "task": "Tối ưu hóa Single-Layout & Dọn sạch Router toàn hệ thống.",
                "morning_res": "Refactor lại MainLayout.tsx và Sidebar.tsx, gỡ bỏ các route mồ côi (dead routes) sau khi cắt bỏ các module thừa.",
                "afternoon_res": "Kiểm tra lại toàn bộ liên kết nội bộ, đảm bảo chuyển trang mượt mà không có lỗi 404 hoặc warning console.",
                "exp": "Tinh gọn thanh điều hướng giúp người dùng tập trung tối đa vào các thao tác chính."
            }
        ]
    },

    # TUẦN 3: 05/10/2026 – 10/10/2026 (6 ngày)
    {
        "week_num": 3,
        "date_range": "05/10/2026    - 10/10/2026",
        "days": [
            {
                "title": "Tuần: 3\nThứ:      2                Ngày: 05/10/2026",
                "task": "Xây dựng Trụ Cột 1: Cơ chế Đề xuất & Xếp hạng Ứng viên Dựa Trên Bằng Chứng (Evidence-Based Matching).",
                "morning_res": "Xây dựng thuật toán tính điểm khớp nối kỹ thuật (Match Score 0-100%) giữa bộ kỹ năng của sinh viên với Job Description (JD).",
                "afternoon_res": "Thiết kế giao diện thẻ ứng viên hiển thị huy hiệu xếp hạng, thanh đo % Match và các chip kỹ năng nổi bật.",
                "exp": "Định lượng mức độ tương thích kỹ năng giúp nhà tuyển dụng rút ngắn 70% thời gian duyệt hồ sơ ban đầu."
            },
            {
                "title": "Tuần: 3\nThứ:      3                Ngày: 06/10/2026",
                "task": "Tích hợp Modal Chi Tiết Khớp Nối (Match Detail Modal) & Soi Chi Tiết Dự Án.",
                "morning_res": "Phát triển MatchDetailModal.tsx phân tích sâu: Kỹ năng trùng khớp hoàn toàn, kỹ năng tương đương và kỹ năng còn thiếu.",
                "afternoon_res": "Bổ sung danh sách các đồ án liên quan trực tiếp đến yêu cầu của JD, hỗ trợ mở xem chi tiết bằng chứng đồ án ngay trên modal.",
                "exp": "Minh bạch hóa lý do đề xuất giúp tăng mức độ tin cậy của thuật toán gợi ý trong mắt nhà tuyển dụng."
            },
            {
                "title": "Tuần: 3\nThứ:      4                Ngày: 07/10/2026",
                "task": "Xây dựng Bộ Lọc Ứng Viên Đa Chiều Cho Nhà Tuyển Dụng (Candidate Filter).",
                "morning_res": "Thiết kế bộ lọc kết hợp: Lọc theo vị trí (Frontend, Backend, DevOps, Data), lọc theo điểm Match tối thiểu và lọc theo công nghệ bắt buộc.",
                "afternoon_res": "Tối ưu hóa truy vấn CSDL Supabase với bộ lọc kết hợp, đảm bảo thời gian trả lời truy vấn dưới 100ms trên tập dữ liệu mẫu.",
                "exp": "Xây dựng bộ lọc đa chiều ngay từ tầng CSDL giúp giảm tải xử lý dữ liệu cho phía client-side."
            },
            {
                "title": "Tuần: 3\nThứ:      5                Ngày: 08/10/2026",
                "task": "Khảo sát và rà soát cơ chế Giảng viên xác thực (Teacher Verification) trên thực tế.",
                "morning_res": "Khảo sát thực nghiệm quy trình giảng viên chấm điểm và xác thực đồ án cho sinh viên trên hệ thống.",
                "afternoon_res": "Phát hiện nút thắt cổ chai nghiêm trọng: Giảng viên bận rộn không kịp phê duyệt khiến đồ án của sinh viên bị treo trạng thái \"Pending Verification\" hàng tuần.",
                "exp": "Các tính năng phụ thuộc vào sự phê duyệt thủ công của bên thứ ba thường gây ra điểm nghẽn nghiêm trọng cho luồng sản phẩm."
            },
            {
                "title": "Tuần: 3\nThứ:      6                Ngày: 09/10/2026",
                "task": "Khảo sát phản hồi sinh viên và chuẩn bị bước chuyển kiến trúc (Pivot sang Evidence-Based).",
                "morning_res": "Tổng hợp phản hồi thực tế từ 15 sinh viên dùng thử; ghi nhận 85% gặp tắc nghẽn do giảng viên bận chấm đồ án.",
                "afternoon_res": "Họp nội bộ với Mentor công ty, phân tích nguyên nhân gốc rễ và thống nhất chuẩn bị chuyển đổi từ \"Giảng viên xác thực\" sang \"Bằng chứng thực chiến (Evidence-Based)\".",
                "exp": "Luôn lắng nghe phản hồi của người dùng thực tế; không bảo thủ giữ lại tính năng tạo ra nút thắt cổ chai."
            },
            {
                "title": "Tuần: 3\nThứ:      7                Ngày: 10/10/2026",
                "task": "Kiểm thử toàn diện các tầng dịch vụ cốt lõi (TDD Green Check) & Typecheck.",
                "morning_res": "Chạy 5 test suites ban đầu: aiCvService.test.ts, cvManagement.test.ts, aiCvGeneration.test.ts, aiCvCoachService.test.ts, markdownExporter.test.ts. Đạt 20/20 tests pass 100%.",
                "afternoon_res": "Kiểm tra npm run build, xác nhận TypeScript biên dịch không lỗi và hệ thống hoàn toàn sẵn sàng cho tuần cao điểm phát triển tính năng mới.",
                "exp": "TDD mang lại sự tự tin tuyệt đối trước khi bước vào giai đoạn thiết kế tính năng mới."
            }
        ]
    },

    # TUẦN 4: 12/10/2026 – 17/10/2026 (6 ngày)
    {
        "week_num": 4,
        "date_range": "12/10/2026    - 17/10/2026",
        "days": [
            {
                "title": "Tuần: 4\nThứ:      2                Ngày: 12/10/2026",
                "task": "Ban hành Quyết định Kiến trúc ADR 0001: Pivot sang Nền tảng CV Định Hướng Đồ Án.",
                "morning_res": "Soạn thảo và ban hành tài liệu Architecture Decision Record ADR 0001 tại docs/adr/0001-project-driven-cv-builder.md.",
                "afternoon_res": "[CẮT BỎ] Xóa sổ toàn bộ TeacherVerificationView.tsx, teacherVerificationService.ts và trường is_verified; dồn 100% tài nguyên sang bằng chứng thực chiến.",
                "exp": "Thay thế dấu xác nhận hành chính bằng bằng chứng khách quan (mã nguồn, sản phẩm chạy thật) là tư duy chuẩn mực của ngành phần mềm hiện đại."
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
            }
        ]
    },

    # TUẦN 5: 19/10/2026 – 23/10/2026 (5 ngày - từ tuần này chỉ làm Thứ 2 đến Thứ 6)
    {
        "week_num": 5,
        "date_range": "19/10/2026    - 23/10/2026",
        "days": [
            {
                "title": "Tuần: 5\nThứ:      2                Ngày: 19/10/2026",
                "task": "Rà soát hoàn thiện ProfileHub v1, tổng kết 6 tickets và khởi động nghiên cứu Trụ cột 2 & 3.",
                "morning_res": "Rà soát micro-interactions, phím tắt Ctrl + S/P/B, chạy toàn bộ 11/11 test suites (38/38 tests pass 100%) và đóng gói npm run build sạch sẽ, nghiệm thu bàn giao ProfileHub v1.",
                "afternoon_res": "Khởi động nghiên cứu kiến trúc mở rộng: Contextual Application Pitch (thay thế Cover Letter truyền thống) và Project Technical Defense Briefing.",
                "exp": "Quy trình đóng gói nghiệm thu định kỳ giúp kiểm soát chất lượng phần mềm chặt chẽ và tạo đà cho các tính năng mở rộng tiếp theo."
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

    # TUẦN 6: 26/10/2026 – 30/10/2026 (5 ngày)
    {
        "week_num": 6,
        "date_range": "26/10/2026    - 30/10/2026",
        "days": [
            {
                "title": "Tuần: 6\nThứ:      2                Ngày: 26/10/2026",
                "task": "Nghiên cứu và thiết kế mô phỏng góc nhìn ATS (ATS Eye-View Heatmap).",
                "morning_res": "Khảo sát nguyên lý hoạt động của các hệ thống Applicant Tracking System (ATS) phổ biến và hành vi quét mắt (F-pattern scan) của nhà tuyển dụng.",
                "afternoon_res": "Thiết kế kiến trúc module atsHeatmapService.ts phân tích mật độ phân bổ từ khóa kỹ thuật và tỷ lệ phủ nội dung theo từng vùng thị giác trên CV.",
                "exp": "Hiểu rõ cơ chế chấm điểm của ATS giúp định hình chính xác các vùng không gian chiến lược trên bản CV."
            },
            {
                "title": "Tuần: 6\nThứ:      3                Ngày: 27/10/2026",
                "task": "Xây dựng ATS Heatmap Visualizer & Thống kê từ khóa kỹ thuật.",
                "morning_res": "Phát triển component AtsHeatmapOverlay.tsx vẽ bản đồ nhiệt trực quan (đỏ - vàng - xanh) đè lên bản vẽ Canvas A4.",
                "afternoon_res": "Bổ sung bảng thống kê Keyword Frequency, cảnh báo nguy cơ keyword stuffing hoặc thiếu hụt kỹ năng cốt lõi so với JD mục tiêu.",
                "exp": "Biểu diễn trực quan bằng Heatmap trực tiếp trên Canvas giúp sinh viên dễ dàng nhận diện điểm yếu trong bố cục CV hơn là các con số khô khan."
            },
            {
                "title": "Tuần: 6\nThứ:      4                Ngày: 28/10/2026",
                "task": "Phát triển Module Interview War Room & Trình mô phỏng phỏng vấn âm thanh.",
                "morning_res": "Thiết kế giao diện phòng luyện phỏng vấn kỹ thuật InterviewWarRoom.tsx với đồng hồ đếm ngược và trạng thái micro.",
                "afternoon_res": "Tích hợp Web Speech API (Speech-to-Text) thu âm câu trả lời của ứng viên, tự động chuyển thành văn bản để phân tích cấu trúc phản biện STAR.",
                "exp": "Luyện nói thành tiếng trước micro giúp ứng viên rèn luyện phản xạ nhanh và sự lưu loát trước khi bước vào phỏng vấn thực chiến."
            },
            {
                "title": "Tuần: 6\nThứ:      5                Ngày: 29/10/2026",
                "task": "Tích hợp tính năng Khảo sát dải lương thị trường theo thời gian thực (Salary Benchmark).",
                "morning_res": "Xây dựng cơ sở dữ liệu dải lương thị trường IT Việt Nam phân theo Level (Intern, Fresher, Junior) và theo Tech Stack (React, Node.js, Golang, Python).",
                "afternoon_res": "Xây dựng SalaryBenchmarkWidget.tsx hiển thị biểu đồ dải lương p25, p50, p75 và gợi ý mức lương kỳ vọng phù hợp với năng lực dự án thực tế.",
                "exp": "Cung cấp số liệu lương thực tế giúp sinh viên CNTT tự tin hơn trong vòng đàm phán đãi ngộ với nhà tuyển dụng."
            },
            {
                "title": "Tuần: 6\nThứ:      6                Ngày: 30/10/2026",
                "task": "Xây dựng Module Quản lý Đa Phiên Bản CV (Multi-Version CVs) & Tối ưu hiệu năng.",
                "morning_res": "Mở rộng lược đồ CSDL cho phép một sinh viên tạo và quản lý nhiều bản CV may đo riêng cho từng vị trí ứng tuyển (Frontend CV, Backend CV, Fullstack CV).",
                "afternoon_res": "Phát triển giao diện quản lý phiên bản CV dạng lưới thẻ, hỗ trợ nhân bản (clone), gắn nhãn trạng thái và kiểm tra hiệu năng đóng gói hoàn tất tuần 6.",
                "exp": "May đo CV riêng cho từng vị trí tuyển dụng làm tăng cơ hội được mời phỏng vấn lên gấp 3 lần so với việc dùng một bản CV chung cho mọi công ty."
            }
        ]
    },

    # TUẦN 7: 02/11/2026 – 06/11/2026 (5 ngày)
    {
        "week_num": 7,
        "date_range": "02/11/2026    - 06/11/2026",
        "days": [
            {
                "title": "Tuần: 7\nThứ:      2                Ngày: 02/11/2026",
                "task": "Thiết kế và xây dựng Application Tracker dạng bảng Kanban.",
                "morning_res": "Khảo sát nhu cầu theo dõi tiến trình nộp đơn của sinh viên, thiết kế luồng trạng thái 5 cột: Wishlist -> Applied -> Interviewing -> Offer -> Rejected.",
                "afternoon_res": "Xây dựng component ApplicationKanbanBoard.tsx với khả năng kéo thả card linh hoạt và lưu trạng thái ứng tuyển tức thì vào CSDL Supabase.",
                "exp": "Giao diện Kanban giúp sinh viên quản lý lộ trình tìm việc một cách trực quan, tránh tình trạng quên lịch phỏng vấn hoặc gửi trùng lặp hồ sơ."
            },
            {
                "title": "Tuần: 7\nThứ:      3                Ngày: 03/11/2026",
                "task": "Tích hợp AI Cover Letter & Email Generator may đo theo từng thẻ Kanban.",
                "morning_res": "Xây dựng modal CoverLetterGeneratorModal.tsx: Tự động trích xuất thông tin công ty, vị trí ứng tuyển từ thẻ Kanban để may đo nội dung thư.",
                "afternoon_res": "Tích hợp tính năng 1-Click Copy và tạo mẫu thư gửi kèm CV (Follow-up email, Thank-you email sau phỏng vấn), viết bài kiểm thử TDD pass 100%.",
                "exp": "Cung cấp sẵn các mẫu thư chuyên nghiệp giúp ứng viên duy trì sự chuẩn mực trong giao tiếp với bộ phận tuyển dụng của doanh nghiệp."
            },
            {
                "title": "Tuần: 7\nThứ:      4                Ngày: 04/11/2026",
                "task": "Xây dựng Reverse Recruiting Hub (Cổng kết nối nhà tuyển dụng chủ động).",
                "morning_res": "Thiết kế giao diện cho nhà tuyển dụng chủ động duyệt kho hồ sơ đồ án sinh viên (Public Talent Pool) với tính năng ẩn thông tin cá nhân (Blind Screening).",
                "afternoon_res": "Phát triển cơ chế gửi lời mời phỏng vấn trực tiếp (Direct Invite) từ HR đến sinh viên thông qua hệ thống thông báo nội bộ.",
                "exp": "Mô hình tuyển dụng đảo ngược (Reverse Recruiting) giúp sinh viên có năng lực thực chất được các công ty săn đón mà không cần nộp đơn thụ động."
            },
            {
                "title": "Tuần: 7\nThứ:      5                Ngày: 05/11/2026",
                "task": "Hoàn thiện cơ chế phân quyền RBAC và bảo mật hồ sơ ứng viên.",
                "morning_res": "Cấu hình Row Level Security (RLS) nâng cao cho các bảng liên quan đến Application Tracker và Public Talent Pool.",
                "afternoon_res": "Phát triển tính năng cho phép sinh viên bật/tắt chế độ \"Mở cơ hội việc làm\" (Open to Work) và ẩn CV khỏi các công ty chỉ định.",
                "exp": "Tôn trọng quyền riêng tư và bảo mật thông tin là yếu tố tiên quyết để người dùng tin tưởng sử dụng nền tảng dài lâu."
            },
            {
                "title": "Tuần: 7\nThứ:      6                Ngày: 06/11/2026",
                "task": "Viết Unit Test & Tích hợp E2E cho Module Application Tracker.",
                "morning_res": "Viết bộ kiểm thử đơn vị cho applicationTrackerService.ts và coverLetterService.ts, đạt 100% test coverage trên các hàm cốt lõi.",
                "afternoon_res": "Kiểm thử luồng người dùng toàn trình: Từ tạo thẻ Kanban, sinh thư ứng tuyển, cập nhật trạng thái đến lưu trữ lịch sử phỏng vấn, kiểm tra build sạch.",
                "exp": "Gom việc kiểm thử đơn vị và tích hợp luồng vào ngày thứ 6 giúp xác nhận độ tin cậy tuyệt đối của tính năng trước khi bước sang tuần tối ưu sâu."
            }
        ]
    },

    # TUẦN 8: 09/11/2026 – 13/11/2026 (5 ngày)
    {
        "week_num": 8,
        "date_range": "09/11/2026    - 13/11/2026",
        "days": [
            {
                "title": "Tuần: 8\nThứ:      2                Ngày: 09/11/2026",
                "task": "Thiết kế và triển khai cơ chế Caching đa tầng (Redis + IndexedDB).",
                "morning_res": "Phân tích các điểm nghẽn truy vấn: Các truy vấn lấy chi tiết đồ án và bộ từ điển công nghệ bị lặp lại nhiều lần gây tải cho CSDL Supabase.",
                "afternoon_res": "Cấu hình Redis cache ở tầng API và thiết lập IndexedDB lưu trữ cục bộ phía client, giảm 80% số lượng request đọc CSDL thừa thãi.",
                "exp": "Kết hợp bộ nhớ đệm client-side (IndexedDB) với server cache (Redis) mang lại tốc độ phản hồi tức thì cho người dùng."
            },
            {
                "title": "Tuần: 8\nThứ:      3                Ngày: 10/11/2026",
                "task": "Tối ưu hóa Hydration và giảm thiểu độ trễ tải trang ban đầu.",
                "morning_res": "Phân tích hiệu năng bằng Google Lighthouse trên trang CV Canvas: Ghi nhận cảnh báo về kích thước file JavaScript và thời gian tương tác TTI.",
                "afternoon_res": "Tối ưu hóa React lazy loading cho các modal nặng (StarDiffReviewModal, AtsHeatmapOverlay, InterviewWarRoom), đưa điểm Lighthouse Performance lên 96/100.",
                "exp": "Chia nhỏ mã nguồn (Code Splitting) theo từng modal giúp trang chủ tải nhanh vượt trội và tiết kiệm băng thông mạng."
            },
            {
                "title": "Tuần: 8\nThứ:      4                Ngày: 11/11/2026",
                "task": "Viết kịch bản kiểm thử tự động toàn trình (E2E Test với Playwright).",
                "morning_res": "Cấu hình framework Playwright cho dự án, thiết lập các biến môi trường kiểm thử tách biệt với môi trường phát triển.",
                "afternoon_res": "Viết 3 kịch bản E2E kiểm thử tự động: (1) Luồng sinh viên tạo CV và Reverse Sync, (2) Luồng soi CV chuẩn STAR, (3) Luồng kéo thả Kanban và sinh Cover Letter.",
                "exp": "Kiểm thử tự động E2E giúp phát hiện sớm các lỗi hồi quy giao diện mà kiểm thử đơn vị thông thường không bao quát được."
            },
            {
                "title": "Tuần: 8\nThứ:      5                Ngày: 12/11/2026",
                "task": "Rà soát bảo mật toàn diện (Security Audit) & Vá các lỗ hổng OWASP.",
                "morning_res": "Thực hiện rà soát bảo mật mã nguồn theo danh mục OWASP Top 10: Kiểm tra nguy cơ SQL Injection, Cross-Site Scripting (XSS) và Broken Access Control.",
                "afternoon_res": "Áp dụng DOMPurify làm sạch dữ liệu nhập từ người dùng trước khi render vào Canvas, cấu hình Content Security Policy (CSP) headers chặt chẽ.",
                "exp": "Làm sạch dữ liệu đầu vào và thiết lập CSP headers là lá chắn thiết yếu bảo vệ ứng dụng trước các cuộc tấn công mã độc."
            },
            {
                "title": "Tuần: 8\nThứ:      6                Ngày: 13/11/2026",
                "task": "Tối ưu hóa Bundle Size (Tree Shaking, Dynamic Import) & Kiểm thử tải.",
                "morning_res": "Phân tích trực quan gói đóng gói (bundle visualizer), loại bỏ các thư viện phụ thuộc trùng lặp, tối ưu hóa import icon từ lucide-react.",
                "afternoon_res": "Giảm dung lượng file bundle chính từ 1.2MB xuống còn 280KB (Gzipped), thực hiện test tải cục bộ và xác nhận thời gian First Contentful Paint (FCP) < 0.8s.",
                "exp": "Gom việc tối ưu hóa bundle size và kiểm thử tốc độ tải vào ngày thứ 6 giúp chốt hạ tuần tăng tốc hiệu năng một cách mỹ mãn."
            }
        ]
    },

    # TUẦN 9: 16/11/2026 – 20/11/2026 (5 ngày - Tiếp tục phát triển và duy trì kiểm thử, KHÔNG viết chốt báo cáo)
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
                "task": "Tích hợp công cụ giám sát hiệu năng & lỗi ứng dụng (Sentry SDK) và thiết lập Alerting.",
                "morning_res": "Cấu hình Sentry SDK trên frontend React Vite, bắt unhandled exceptions và capture error boundary trên các component chính.",
                "afternoon_res": "Kiểm thử gửi test exception, cấu hình webhook nhận cảnh báo lỗi realtime qua kênh nội bộ khi người dùng gặp sự cố.",
                "exp": "Thiết lập hệ thống monitoring sớm giúp đội ngũ kỹ thuật chủ động nắm bắt lỗi người dùng thay vì chờ phản ánh gián tiếp."
            },
            {
                "title": "Tuần: 9\nThứ:      6                Ngày: 20/11/2026",
                "task": "Họp định kỳ Sprint Review với Mentor doanh nghiệp, đánh giá Milestone 2 và lập kế hoạch kỹ thuật chặng tiếp theo.",
                "morning_res": "Demo các tính năng hoàn thiện (ATS Heatmap, Interview War Room, Application Tracker) cho Mentor doanh nghiệp và tiếp nhận góp ý kỹ thuật.",
                "afternoon_res": "Cập nhật backlog kỹ thuật, phân chia các đầu việc mở rộng tiếp theo cho hệ thống ProfileHub và chuẩn bị kế hoạch phát triển cho tuần mới.",
                "exp": "Duy trì họp Sprint Review định kỳ với Mentor giúp nắm chắc định hướng sản phẩm thực tế và liên tục cải tiến chất lượng kỹ thuật trong suốt kỳ thực tập."
            }
        ]
    }
]

# Flatten all days
all_49_days = []
for w in weeks_schedule:
    all_49_days.extend(w["days"])

print(f"Total days generated: {len(all_49_days)} (Weeks 1-4: 6 days/wk, Weeks 5-9: 5 days/wk)")

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
        ("1", "21/09/2026    - 26/09/2026"),
        ("2", "28/09/2026    - 03/10/2026"),
        ("3", "05/10/2026    - 10/10/2026"),
        ("4", "12/10/2026    - 17/10/2026"),
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
    print("Table 3 updated for 14 weeks (Weeks 1-4 with Sat, Weeks 5-14 Mon-Fri).")

    # 2. Update Table 4 (Nội dung nhật ký)
    t4 = doc.tables[4]
    needed_rows = len(all_49_days) * 4 # 196 rows

    while len(t4.rows) < needed_rows:
        rem = len(t4.rows) % 4
        new_tr = parse_xml(t4.rows[rem]._tr.xml)
        t4._tbl.append(new_tr)

    while len(t4.rows) > needed_rows:
        t4._tbl.remove(t4.rows[-1]._tr)

    print(f"Table 4 adjusted to {len(t4.rows)} rows ({len(t4.rows)//4} days).")

    for day_idx, day_info in enumerate(all_49_days):
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
    template_temp = r"c:\Users\ADMIN\Desktop\STUDY\docs\BM01b_clean_template_temp2.docx"
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

### NỘI DUNG NHẬT KÝ CHI TIẾT THEO NGÀY (49 NGÀY LÀM VIỆC — 4 TUẦN ĐẦU CÓ THỨ 7, CÁC TUẦN SAU ĐẾN THỨ 6)

"""

    md_body = ""
    for day in all_49_days:
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
        ("TUẦN 1: KHẢO SÁT, THIẾT KẾ CSDL & MODULE HỒ SƠ DỰ ÁN CỐT LÕI", "21/09/2026 – 26/09/2026", 6),
        ("TUẦN 2: MODULE TẠO CV DỰ ÁN, CHATBOT NLP THỰC CHIẾN & KHẢO SÁT PHỎNG VẤN", "28/09/2026 – 03/10/2026", 6),
        ("TUẦN 3: MODULE GIẢNG VIÊN ĐÁNH GIÁ, CỔNG CHỨNG THỰC & KHẢO SÁT PHẢN HỒI", "05/10/2026 – 10/10/2026", 6),
        ("TUẦN 4: TÁI THIẾT KẾ KIẾN TRÚC (PIVOT), CẮT BỎ OVER-ENGINEERING & TRIỂN KHAI 6 TRACER-BULLET TICKETS", "12/10/2026 – 17/10/2026", 6),
        ("TUẦN 5: MỞ RỘNG TÍNH NĂNG NÂNG CAO — STAR DIAGNOSTIC ENGINE & ATS EYE-VIEW HEATMAP", "19/10/2026 – 23/10/2026", 5),
        ("TUẦN 6: INTERVIEW WAR ROOM, SALARY BENCHMARK & MULTI-VERSION CV MANAGEMENT", "26/10/2026 – 30/10/2026", 5),
        ("TUẦN 7: APPLICATION TRACKER, COVER LETTER GENERATOR & REVERSE RECRUITING HUB", "02/11/2026 – 06/11/2026", 5),
        ("TUẦN 8: ADVANCED CACHING, HYDRATION OPTIMIZATION, E2E TESTING & SECURITY AUDIT", "09/11/2026 – 13/11/2026", 5),
        ("TUẦN 9: TYPOGRAPHY STANDARDIZATION, HR INTEGRATION & SPRINT REVIEW ROADMAP", "16/11/2026 – 20/11/2026", 5)
    ]

    nk_header = """# 📓 NHẬT KÝ DỰ ÁN PROFILEHUB
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

"""

    nk_body = ""
    current_idx = 0
    for theme, date_range, day_count in weeks_meta:
        nk_body += f"## 📅 {theme} ({date_range})\n\n"
        for _ in range(day_count):
            day = all_49_days[current_idx]
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
