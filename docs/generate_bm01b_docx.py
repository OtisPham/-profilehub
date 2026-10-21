import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_shading(cell, color_hex):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="A0AEC0", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def set_run_font(run, name="Times New Roman", size_pt=12, bold=False, italic=False, color=RGBColor(0,0,0)):
    run.font.name = name
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = color
    # Ensure proper font for East Asian / Complex scripts in Word
    rPr = run._r.get_or_add_rPr()
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), name)
    rFonts.set(qn('w:hAnsi'), name)
    rFonts.set(qn('w:cs'), name)
    rPr.append(rFonts)

def format_cell_para(cell, text, bold=False, italic=False, font_size=11, align=WD_ALIGN_PARAGRAPH.LEFT, color=RGBColor(0,0,0)):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    set_run_font(run, name="Times New Roman", size_pt=font_size, bold=bold, italic=italic, color=color)
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    return p

def create_bm01b_document():
    doc = Document()
    
    # Page setup - A4, margins: top=2cm, bottom=2cm, left=2.5cm, right=2cm
    sections = doc.sections
    for section in sections:
        section.page_width = Cm(21.0)
        section.page_height = Cm(29.7)
        section.top_margin = Cm(2.0)
        section.bottom_margin = Cm(2.0)
        section.left_margin = Cm(2.5)
        section.right_margin = Cm(2.0)

    # BM01b Code in top right
    p_code = doc.add_paragraph()
    p_code.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_code.paragraph_format.space_after = Pt(6)
    run_code = p_code.add_run("BM01b")
    set_run_font(run_code, name="Times New Roman", size_pt=11, bold=True)

    # University Header
    p_uni1 = doc.add_paragraph()
    p_uni1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_uni1.paragraph_format.space_after = Pt(2)
    r = p_uni1.add_run("BỘ GIÁO DỤC VÀ ĐÀO TẠO\nTRƯỜNG ĐẠI HỌC HOA SEN\nKHOA CÔNG NGHỆ")
    set_run_font(r, name="Times New Roman", size_pt=12, bold=True)

    # Line separator
    p_sep = doc.add_paragraph()
    p_sep.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sep.paragraph_format.space_after = Pt(14)
    r = p_sep.add_run("━━━━━━━ ★ ━━━━━━━")
    set_run_font(r, name="Times New Roman", size_pt=10, color=RGBColor(100, 100, 100))

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(4)
    r = p_title.add_run("SỔ NHẬT KÝ THỰC TẬP TỐT NGHIỆP")
    set_run_font(r, name="Times New Roman", size_pt=16, bold=True, color=RGBColor(26, 54, 93))

    p_term = doc.add_paragraph()
    p_term.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_term.paragraph_format.space_after = Pt(18)
    r = p_term.add_run("HỌC KỲ 2631 NĂM HỌC 2026 - 2027")
    set_run_font(r, name="Times New Roman", size_pt=13, bold=True, italic=True)

    # Student Info Table
    info_table = doc.add_table(rows=6, cols=2)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_widths = [Cm(5.0), Cm(11.5)]
    info_data = [
        ("Họ và tên sinh viên", ": PHẠM THÁI BẢO"),
        ("Mã số sinh viên", ": 22114919"),
        ("Ngành đào tạo", ": CÔNG NGHỆ THÔNG TIN"),
        ("Lớp", ": QL21111"),
        ("Đơn vị thực tập", ": CÔNG TY TNHH ALPACA SOLUTIONS"),
        ("Thời gian thực tập", ": Từ ngày 14/09/2026 đến ngày 26/12/2026")
    ]
    for i, (k, v) in enumerate(info_data):
        row = info_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = col_widths[0], col_widths[1]
        format_cell_para(c0, k, bold=True, font_size=12)
        format_cell_para(c1, v, bold=(i == 0 or i == 1), font_size=12)
        set_cell_margins(c0, top=60, bottom=60, left=80, right=80)
        set_cell_margins(c1, top=60, bottom=60, left=80, right=80)

    p_city = doc.add_paragraph()
    p_city.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_city.paragraph_format.space_before = Pt(18)
    p_city.paragraph_format.space_after = Pt(18)
    r = p_city.add_run("Thành phố Hồ Chí Minh, tháng 12 năm 2026")
    set_run_font(r, name="Times New Roman", size_pt=12, italic=True)

    # Notice Box
    notice_table = doc.add_table(rows=1, cols=1)
    notice_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    notice_cell = notice_table.rows[0].cells[0]
    notice_cell.width = Cm(16.5)
    set_cell_shading(notice_cell, "F7FAFC")
    set_table_borders(notice_table, color="CBD5E0", sz="6", val="single")
    set_cell_margins(notice_cell, top=140, bottom=140, left=180, right=180)
    
    notice_text = (
        "Một số lưu ý:\n"
        "• Sinh viên đánh số trang liên tục trong sổ nhật ký thực tập.\n"
        "• Sinh viên ghi chép đầy đủ các công việc được giao, các công việc đã hoàn tất, các kinh nghiệm cũng như những nhận xét rút ra từ những công việc này.\n"
        "• Cuối mỗi tuần, sinh viên gửi sổ nhật ký thực tập đến người hướng dẫn xem xét để đánh giá và ký xác nhận.\n"
        "• Sinh viên dùng sổ nhật ký thực tập để viết báo cáo thực tập.\n"
        "• Sinh viên ghi theo thứ tự thời gian. Mỗi sinh viên phải có sổ nhật ký thực tập riêng, mặc dù nhiều sinh viên có thể thực tập tại cùng đơn vị."
    )
    notice_cell.text = ""
    for idx, line in enumerate(notice_text.split("\n")):
        p = notice_cell.add_paragraph() if idx > 0 else notice_cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(line)
        set_run_font(r, name="Times New Roman", size_pt=10.5, bold=(idx == 0), italic=(idx > 0), color=RGBColor(45, 55, 72))

    doc.add_page_break()

    # SECTION 2: PHIẾU THEO DÕI TIẾN ĐỘ
    p_track_head = doc.add_paragraph()
    p_track_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_track_head.paragraph_format.space_after = Pt(2)
    r = p_track_head.add_run("PHIẾU THEO DÕI TIẾN ĐỘ THỰC TẬP TỐT NGHIỆP")
    set_run_font(r, name="Times New Roman", size_pt=14, bold=True, color=RGBColor(26, 54, 93))

    p_track_term = doc.add_paragraph()
    p_track_term.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_track_term.paragraph_format.space_after = Pt(12)
    r = p_track_term.add_run("HỌC KỲ 2631 NĂM HỌC 2026 - 2027")
    set_run_font(r, name="Times New Roman", size_pt=12, bold=True, italic=True)

    # Info summary table
    info_table2 = doc.add_table(rows=6, cols=2)
    info_table2.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, (k, v) in enumerate(info_data[:5] + [("Người hướng dẫn", ": ")]):
        row = info_table2.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = Cm(4.5), Cm(12.0)
        format_cell_para(c0, k, bold=True, font_size=11)
        format_cell_para(c1, v, bold=(i == 0), font_size=11)
        set_cell_margins(c0, top=40, bottom=40, left=60, right=60)
        set_cell_margins(c1, top=40, bottom=40, left=60, right=60)

    p_note2 = doc.add_paragraph()
    p_note2.paragraph_format.space_before = Pt(8)
    p_note2.paragraph_format.space_after = Pt(10)
    r = p_note2.add_run("Ghi chú: Sinh viên phải xuất trình sổ nhật ký thực tập và phiếu theo dõi thực tập hàng tuần để người hướng dẫn kiểm tra và ký tên.")
    set_run_font(r, name="Times New Roman", size_pt=10.5, italic=True)

    # 13-week table
    track_table = doc.add_table(rows=14, cols=3)
    track_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(track_table, color="718096", sz="4", val="single")
    t_widths = [Cm(2.0), Cm(6.5), Cm(8.0)]

    headers = ["Tuần", "Từ ngày đến ngày", "Họ tên và chữ ký của người hướng dẫn"]
    h_row = track_table.rows[0]
    for j, h_text in enumerate(headers):
        c = h_row.cells[j]
        c.width = t_widths[j]
        set_cell_shading(c, "E2E8F0")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        format_cell_para(c, h_text, bold=True, font_size=11, align=WD_ALIGN_PARAGRAPH.CENTER)

    weeks_data = [
        ("1", "21/09/2026 - 26/09/2026"),
        ("2", "28/09/2026 - 03/10/2026"),
        ("3", "05/10/2026 - 10/10/2026"),
        ("4", "12/10/2026 - 19/10/2026"),
        ("5", "26/10/2026 - 31/10/2026"),
        ("6", "02/11/2026 - 07/11/2026"),
        ("7", "09/11/2026 - 14/11/2026"),
        ("8", "16/11/2026 - 21/11/2026"),
        ("9", "23/11/2026 - 28/11/2026"),
        ("10", "30/11/2026 - 05/12/2026"),
        ("11", "07/12/2026 - 12/12/2026"),
        ("12", "14/12/2026 - 19/12/2026"),
        ("13", "21/12/2026 - 26/12/2026")
    ]
    for i, (w, d_range) in enumerate(weeks_data):
        row = track_table.rows[i+1]
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width, c1.width, c2.width = t_widths[0], t_widths[1], t_widths[2]
        set_cell_margins(c0, top=60, bottom=60, left=60, right=60)
        set_cell_margins(c1, top=60, bottom=60, left=80, right=80)
        set_cell_margins(c2, top=60, bottom=60, left=80, right=80)
        format_cell_para(c0, w, bold=True, font_size=11, align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell_para(c1, d_range, font_size=11, align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell_para(c2, "", font_size=11)

    doc.add_page_break()

    # SECTION 3: NỘI DUNG NHẬT KÝ CHI TIẾT
    p_detail_head = doc.add_paragraph()
    p_detail_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_detail_head.paragraph_format.space_after = Pt(14)
    r = p_detail_head.add_run("NỘI DUNG NHẬT KÝ THỰC TẬP CHI TIẾT THEO NGÀY")
    set_run_font(r, name="Times New Roman", size_pt=14, bold=True, color=RGBColor(26, 54, 93))

    # All days data
    # (week_title, day_title, morning_task, morning_result, morning_exp, afternoon_task, afternoon_result, afternoon_exp)
    diary_days = [
        # TUAN 1
        {
            "week_header": "TUẦN 1: KHẢO SÁT, THIẾT KẾ CSDL & MODULE HỒ SƠ DỰ ÁN CỐT LÕI (21/09/2026 – 26/09/2026)",
            "day_title": "Tuần: 1   Thứ: 2   Ngày: 21/09/2026",
            "morning": (
                "Khảo sát nghiệp vụ bài toán tạo CV của sinh viên CNTT & Xác lập kiến trúc base code",
                "Khảo sát thực trạng sinh viên gặp khó khăn khi mô tả dự án học tập vào CV; xác lập mục tiêu xây dựng nền tảng ProfileHub định hướng đồ án thực tế (Project-Driven AI CV Builder).",
                "Phân tích bài toán xuất phát từ nhu cầu thực tế của người dùng giúp định hình đúng cấu trúc dữ liệu và phạm vi chức năng ngay từ đầu."
            ),
            "afternoon": (
                "Khởi tạo cấu trúc dự án và cấu hình Tech Stack",
                "Cấu hình mã nguồn base với React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, kết nối Supabase (PostgreSQL + Auth + Storage).",
                "Thiết lập TypeScript Strict Mode ngay từ ngày đầu giúp kiểm soát type-safety chặt chẽ, loại bỏ hoàn toàn các lỗi undefined tiềm ẩn."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 1   Thứ: 3   Ngày: 22/09/2026",
            "morning": (
                "Thiết kế lược đồ CSDL PostgreSQL trên Supabase",
                "Thiết kế các bảng: users, student_profiles, projects, skills, certifications, student_cvs. Tạo khóa ngoại và composite indexes tối ưu tốc độ đọc.",
                "Chuẩn hóa cấu trúc CSDL quan hệ từ đầu giúp việc truy vấn và đồng bộ giữa CV và hồ sơ gốc diễn ra trơn tru."
            ),
            "afternoon": (
                "Cấu hình Row Level Security (RLS) & Supabase Storage",
                "Kích hoạt chính sách RLS cho từng bảng dữ liệu, cấu hình Supabase Storage Bucket portfolio_files lưu trữ tài liệu PDF và hình ảnh minh chứng.",
                "Áp dụng RLS ở tầng CSDL là phương pháp bảo mật dữ liệu sinh viên đa người dùng chuẩn mực nhất mà không làm phình to backend code."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 1   Thứ: 4   Ngày: 23/09/2026",
            "morning": (
                "Xây dựng Module Quản lý Đồ Án Sinh Viên (MyProjects.tsx)",
                "Thiết kế giao diện danh sách đồ án dạng thẻ Card chuẩn Enterprise, hỗ trợ lọc theo môn học và gắn tags công nghệ (React, Node.js, PostgreSQL...).",
                "Giao diện quản lý đồ án trực quan giúp sinh viên có cái nhìn tổng quan về kho dự án cá nhân đã tích lũy."
            ),
            "afternoon": (
                "Phát triển tính năng CRUD đồ án và liên kết minh chứng",
                "Phát triển Form Modal Thêm/Sửa đồ án, hỗ trợ trường Live Demo URL, GitHub Repo URL, tài liệu PDF đính kèm và modal xác nhận xóa an toàn.",
                "Quản lý state form chặt chẽ giúp sinh viên dễ dàng cập nhật thông tin dự án nhiều giai đoạn mà không gây mất mát dữ liệu."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 1   Thứ: 5   Ngày: 24/09/2026",
            "morning": (
                "Xây dựng Module Quản lý Chứng Chỉ (Certificates.tsx)",
                "Xây dựng giao diện lưu trữ chứng chỉ nghề nghiệp, tính năng đánh dấu thành tựu nổi bật (is_featured) và kéo-thả upload file minh chứng.",
                "Tổ chức lưu trữ bằng chứng chứng chỉ khoa học giúp ứng viên dễ dàng đính kèm vào hồ sơ khi ứng tuyển."
            ),
            "afternoon": (
                "Phát triển In-App Document Reader",
                "Phát triển Modal xem trước file PDF/Ảnh nội tuyến (In-app Document Reader) qua iframe/img mà không cần tải về máy hay chuyển hướng trang.",
                "Trải nghiệm xem trước tài liệu tức thì (sandbox iframe) giúp tăng tính chuyên nghiệp và liền mạch của ứng dụng."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 1   Thứ: 6   Ngày: 25/09/2026",
            "morning": (
                "Nghiên cứu thông số in ấn khổ giấy chuẩn A4 cho trình tạo CV",
                "Phân tích thông số kỹ thuật in ấn: A4 Portrait ở độ phân giải 96 DPI tương đương chiều cao 1122.5px, xác lập lề trang và nhịp ngắt trang trực quan.",
                "Hiểu rõ quy chuẩn in ấn CSS Print và độ phân giải màn hình giúp thiết kế khung soạn thảo đạt độ chính xác pixel-perfect."
            ),
            "afternoon": (
                "Dựng khung hiển thị tương tác WYSIWYG trên Canvas A4",
                "Phát triển component InteractiveCVCanvas.tsx render trực tiếp cấu trúc CV, hỗ trợ chỉnh sửa inline trên từng dòng text.",
                "Cố định tỷ lệ hiển thị canvas theo đúng tỷ lệ in ấn thực tế loại bỏ hoàn toàn sự sai lệch giữa màn hình và file in PDF."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 1   Thứ: 7   Ngày: 26/09/2026",
            "morning": (
                "Cấu hình cơ chế lưu trữ Supabase Cloud Backup",
                "Viết các hàm đồng bộ trong cvService.ts kết nối với bảng student_cvs trên Supabase để tự động lưu trạng thái CV.",
                "Phân tách logic gọi API vào tầng service riêng biệt giúp code UI gọn gàng và dễ kiểm thử."
            ),
            "afternoon": (
                "Tích hợp bộ đệm LocalStorage Fallback",
                "Thiết lập bộ đệm LocalStorage lưu trữ tạm thời phiên soạn thảo, chống mất dữ liệu khi mất mạng hoặc người dùng vô tình reload trang đột ngột.",
                "Cơ chế dự phòng hai lớp (Cloud + LocalStorage) bảo vệ an toàn tối đa cho trải nghiệm soạn thảo nội dung của người dùng."
            )
        },

        # TUAN 2
        {
            "week_header": "TUẦN 2: AUDIT KIẾN TRÚC & CẮT BỎ CÁC TÍNH NĂNG THỪA - PHA 1 (28/09/2026 – 03/10/2026)",
            "day_title": "Tuần: 2   Thứ: 2   Ngày: 28/09/2026",
            "morning": (
                "Họp Review tiến độ tuần 1 và đánh giá hiệu năng hệ thống",
                "Tiến hành đo lường tài nguyên: Nhận thấy kiến trúc đang phải gánh một microservice Python độc lập và nhiều luồng khảo sát phụ rườm rà.",
                "Nhìn nhận thẳng thắn vào các điểm thắt cổ chai kiến trúc giúp kịp thời điều chỉnh trước khi dự án phình to mất kiểm soát."
            ),
            "afternoon": (
                "Thống nhất chiến lược \"Lean MVP\"",
                "Họp kỹ thuật với Tech Lead và thống nhất chiến lược: Cắt giảm ngay các tính năng ngoài lề để tập trung 100% vào giá trị cốt lõi là tạo CV theo dự án.",
                "Dũng cảm cắt bỏ tính năng không hiệu quả là yếu tố sống còn giúp dự án về đích đúng hạn và đạt chất lượng cao."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 2   Thứ: 3   Ngày: 29/09/2026",
            "morning": (
                "[CẮT BỎ] Xóa bỏ hoàn toàn Microservice Python Chatbot phụ (chatbot_service/)",
                "Xóa bỏ thư mục profilehub/chatbot_service gồm app.py, skill_mining.py, requirements.txt, knowledge_base.json, loại bỏ hạ tầng phức tạp.",
                "Loại bỏ phụ thuộc đa ngôn ngữ giúp tinh giản quy trình CI/CD và giảm thiểu rủi ro vận hành môi trường."
            ),
            "afternoon": (
                "Viết lại thuật toán khai phá kỹ năng sang TypeScript Native",
                "Viết lại thuật toán nhận diện từ khóa kỹ thuật (Tech Dictionary) bằng TypeScript native module trực tiếp trong src/services/aiCvService.ts.",
                "TypeScript native execution nhanh gấp 3 lần việc gọi HTTP API sang một tiến trình Python riêng lẻ và loại bỏ hoàn toàn độ trễ mạng nội bộ."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 2   Thứ: 4   Ngày: 30/09/2026",
            "morning": (
                "[CẮT BỎ] Xóa bỏ Module Khảo sát tính cách MBTI",
                "Xóa bỏ mbtiService.ts, MBTIAssessment.tsx, CandidateMBTIInsightCard.tsx, types/mbti.ts khỏi codebase.",
                "Nhận thức rõ chân dung khách hàng mục tiêu: Nhà tuyển dụng kỹ thuật quan tâm đến stack công nghệ và sản phẩm chạy thật hơn là trắc nghiệm tính cách."
            ),
            "afternoon": (
                "Tinh giản thanh điều hướng và dọn dẹp state",
                "Dọn sạch các nút bấm, icon và tab MBTI trên Sidebar và thanh điều hướng chính, giải phóng bộ nhớ ứng dụng.",
                "Giao diện tối giản mang lại không gian thao tác tập trung và giảm bớt gánh nặng nhận thức cho người dùng."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 2   Thứ: 5   Ngày: 01/10/2026",
            "morning": (
                "[CẮT BỎ] Loại bỏ luồng phỏng vấn chatbot dài dòng (Discovery Interview)",
                "Xóa bỏ các component chat hỏi đáp rườm rà: DiscoveryInterview.tsx, ChatWindow.tsx, FactCard.tsx, discovery.controller.ts.",
                "Tránh bẫy thiết kế theo trào lưu hội thoại khi giao diện đồ họa truyền thống giải quyết bài toán nhanh và chính xác hơn."
            ),
            "afternoon": (
                "Định hướng lại luồng nhập liệu đưa dự án vào CV",
                "Thiết kế luồng cho phép ứng viên chọn trực tiếp dự án từ hồ sơ vào CV bằng Checkbox modal nhanh chóng thay vì phải chat hỏi đáp từng câu.",
                "Giao diện trực quan dạng chọn (checkbox) mang lại tốc độ hoàn thành công việc cao gấp 5 lần giao diện chat đàm thoại."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 2   Thứ: 6   Ngày: 02/10/2026",
            "morning": (
                "Xây dựng tính năng Nạp Hàng Loạt 100 CV từ Excel (BulkCvImportModal.tsx)",
                "Tích hợp thư viện xlsx đọc dữ liệu hàng loạt từ file mẫu Mau_100_CV_ProfileHub.xlsx, bóc tách thông tin sinh viên, trường, GPA, kỹ năng và đồ án.",
                "Xử lý parser dữ liệu ngoại vi cần tính toán đầy đủ các trường hợp ô rỗng, sai định dạng để tránh crash ứng dụng."
            ),
            "afternoon": (
                "Kết nối dữ liệu nhập hàng loạt vào trạng thái CV Builder",
                "Phát triển hàm convertImportedCvToCvBuilderState cho phép nạp 1 click toàn bộ 100 CV mẫu vào CV Builder để phục vụ test tính năng và stress-test.",
                "Chuẩn bị bộ dữ liệu mẫu phong phú giúp việc kiểm thử giao diện và thuật toán phản ánh chính xác các kịch bản thực tế."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 2   Thứ: 7   Ngày: 03/10/2026",
            "morning": (
                "Tối ưu hóa Single-Layout & Dọn sạch Router hệ thống",
                "Refactor lại MainLayout.tsx và Sidebar.tsx, gỡ bỏ các route mồ côi (dead routes) sau khi cắt bỏ các module thừa.",
                "Thường xuyên dọn dẹp routing giúp cây DOM gọn nhẹ và loại bỏ hoàn toàn các liên kết hỏng."
            ),
            "afternoon": (
                "Kiểm thử luồng điều hướng toàn ứng dụng",
                "Kiểm tra lại toàn bộ liên kết nội bộ, các nút bấm trên giao diện, đảm bảo chuyển trang mượt mà không có lỗi 404 hoặc warning console.",
                "Giữ codebase luôn trong trạng thái ngăn nắp giúp quá trình phát triển các tính năng lớn ở các tuần sau diễn ra thuận lợi."
            )
        },

        # TUAN 3
        {
            "week_header": "TUẦN 3: CẮT BỎ LUỒNG DUYỆT GIẢNG VIÊN - PHA 2 & THIẾT LẬP HARNESS VITEST TDD (05/10/2026 – 10/10/2026)",
            "day_title": "Tuần: 3   Thứ: 2   Ngày: 05/10/2026",
            "morning": (
                "Khảo sát thực tế luồng Xác thực Giảng viên (Teacher Verification)",
                "Phân tích dữ liệu vận hành: Việc yêu cầu giảng viên đăng nhập chấm điểm, ký hash cryptographic tạo ra ma sát cực lớn, sinh viên bị phụ thuộc và không thể gửi CV.",
                "Nhận diện đúng rào cản vận hành: Một quy trình hành chính phức tạp trên lý thuyết sẽ triệt tiêu khả năng ứng dụng thực tế của sản phẩm."
            ),
            "afternoon": (
                "Quyết định chuyển hướng sang cơ chế Bằng chứng thực chiến",
                "Họp và quyết định loại bỏ triệt để tính năng xác thực giảng viên khỏi phạm vi dự án, thay thế bằng cơ chế Bằng chứng tự chứng minh (Evidence-Based): Link Demo, Repo, QR Code.",
                "Sản phẩm tốt phải trao quyền chủ động cho người dùng chính (ứng viên) thay vì tạo ra các nút thắt phê duyệt bên ngoài."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 3   Thứ: 3   Ngày: 06/10/2026",
            "morning": (
                "[CẮT BỎ] Xóa bỏ toàn bộ Module Xác thực Giảng viên tầng Backend",
                "Xóa bỏ các tệp tin backend: verification.controller.ts, verification.service.ts, verification.routes.ts, utils/verificationCrypto.ts.",
                "Dứt khoát loại bỏ các module phức tạp không còn phục vụ định hướng mới giúp giảm đáng kể chi phí bảo trì."
            ),
            "afternoon": (
                "Xóa bỏ giao diện xác thực và làm sạch thuật toán gợi ý",
                "Xóa bỏ VerificationInbox.tsx, TeacherProfile.tsx, PublicVerificationView.tsx. Xóa logic cộng điểm thưởng is_verified trong thuật toán gợi ý đồ án của aiCvService.ts.",
                "Loại bỏ cơ chế cộng điểm ưu tiên giả định giúp thuật toán AI matching trở nên khách quan, đánh giá thuần túy dựa trên độ phù hợp của Tech Stack với JD."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 3   Thứ: 4   Ngày: 07/10/2026",
            "morning": (
                "[CẮT BỎ] Xóa bỏ tính năng Tạo thư xin việc (Cover Letter)",
                "Xóa bỏ CoverLetterModal.tsx, CoverLetterPage.tsx, aiCoverLetterService.ts khỏi codebase.",
                "Tránh tình trạng phân tán nguồn lực vào các tính năng phụ mà thị trường đã có nhiều công cụ giải quyết tốt."
            ),
            "afternoon": (
                "[CẮT BỎ] Xóa bỏ tính năng phỏng vấn ảo rườm rà",
                "Xóa bỏ AIInterviewPrep.tsx, aiInterviewService.ts, aiOfferLetterService.ts, giải phóng dung lượng bundle size và tối ưu thời gian tải trang.",
                "Tập trung sâu sắc vào một tính năng then chốt (CV Builder theo đồ án) mang lại trải nghiệm xuất sắc hơn là dàn trải nhiều tính năng nông."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 3   Thứ: 5   Ngày: 08/10/2026",
            "morning": (
                "Thiết lập hạ tầng Unit Test tự động hóa với Vitest",
                "Cấu hình Vitest trong package.json và vite.config.ts, thiết lập môi trường test jsdom và các script kiểm thử tự động.",
                "Lựa chọn Vitest tích hợp tự nhiên với Vite mang lại tốc độ chạy test siêu nhanh so với cấu hình Jest truyền thống."
            ),
            "afternoon": (
                "Viết các Seam Test đầu tiên bảo vệ logic AI Service",
                "Viết các unit tests đầu tiên: aiCvService.test.ts (kiểm tra phân tích từ khóa JD) và aiCvCoachService.test.ts (kiểm tra barem đánh giá nội dung CV).",
                "Thiết lập test harness sớm tạo bệ phóng an toàn để tự tin refactor các module lớn mà không sợ gây lỗi hồi quy (regression bugs)."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 3   Thứ: 6   Ngày: 09/10/2026",
            "morning": (
                "Điều tra lỗi nghiêm trọng \"Zombie CV\" trong cvService.ts",
                "Phát hiện bug: Khi ứng viên chủ động xóa sạch tất cả CV trong danh sách, mảng rỗng [] bị điều kiện if (!raw || raw.length === 0) đánh đồng với người dùng mới, tự ý sinh lại CV mặc định.",
                "Cần điều tra tận gốc nguyên nhân hành vi bất thường của state thay vì chỉ xử lý phần ngọn trên giao diện."
            ),
            "afternoon": (
                "Vá dứt điểm lỗi và viết test bảo vệ bất biến",
                "Sửa điều kiện kiểm tra raw !== null để tôn trọng quyết định xóa của người dùng. Viết bộ test cvManagement.test.ts bảo vệ bất biến vòng đời CV.",
                "Phân biệt rõ giữa trạng thái \"chưa có dữ liệu\" (null/undefined) và \"dữ liệu rỗng có chủ đích\" ([]) là nguyên tắc bất biến trong lập trình CSDL."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 3   Thứ: 7   Ngày: 10/10/2026",
            "morning": (
                "Kiểm thử toàn diện các tầng dịch vụ cốt lõi (TDD Green Check)",
                "Chạy 5 test suites ban đầu: aiCvService.test.ts, cvManagement.test.ts, aiCvGeneration.test.ts, aiCvCoachService.test.ts, markdownExporter.test.ts. Đạt 20/20 tests pass 100%.",
                "Đạt trạng thái All-Green trên test suite mang lại sự tự tin cao độ cho toàn bộ đội ngũ phát triển."
            ),
            "afternoon": (
                "Kiểm tra biên dịch TypeScript và tối ưu hóa hệ thống",
                "Thực thi npm run build, xác nhận TypeScript biên dịch không lỗi và hệ thống hoàn toàn sẵn sàng cho tuần cao điểm phát triển tính năng mới.",
                "Duy trì kỷ luật kiểm tra biên dịch thường xuyên giúp phát hiện sớm các xung đột kiểu dữ liệu."
            )
        },

        # TUAN 4
        {
            "week_header": "TUẦN 4: BAN HÀNH ADR 0001, HOÀN THIỆN 6 TRACER-BULLET TICKETS & BÀN GIAO (12/10/2026 – 19/10/2026)",
            "day_title": "Tuần: 4   Thứ: 2   Ngày: 12/10/2026",
            "morning": (
                "Nghiên cứu giải pháp cho bài toán mâu thuẫn dữ liệu dự án trên CV",
                "Phân tích bài toán: Khi ứng viên sửa câu từ của dự án cho vừa vặn với một JD cụ thể, nếu lưu đè vào hồ sơ gốc sẽ làm sai lệch dữ liệu gốc của dự án.",
                "Phân tích thấu đáo ranh giới giữa dữ liệu gốc (Master) và phiên bản ngữ cảnh (Instance) giúp giải quyết triệt để xung đột dữ liệu."
            ),
            "afternoon": (
                "Ban hành Quyết định Kiến trúc ADR 0001",
                "Soạn thảo và ban hành ADR 0001: Tách biệt Bản sao Dự án trong CV (CV Project Instance) và Dự án Gốc (Master Project), cho phép tùy biến tự do theo JD mà không làm hỏng dữ liệu gốc.",
                "Văn bản hóa các quyết định kiến trúc quan trọng (ADR) giúp định hướng thống nhất cho toàn bộ quá trình lập trình."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 4   Thứ: 3   Ngày: 13/10/2026",
            "morning": (
                "Cập nhật Tài liệu Đặc tả Yêu cầu Hệ thống Chính thức",
                "Bổ sung Mục 7.4 (Luồng đưa dự án vào CV và đồng bộ ngược Reverse Sync) vào tài liệu đặc tả ProfileHub_Discovery_Requirements.md.",
                "Tài liệu đặc tả yêu cầu cần luôn được cập nhật đồng bộ với các quyết định kiến trúc mới nhất."
            ),
            "afternoon": (
                "Chuẩn hóa Bảng Thuật Ngữ Miền (Domain Glossary)",
                "Định nghĩa bảng thuật ngữ chuẩn trong docs/CONTEXT.md: Master Project, CV Project Instance, Reverse Sync, Scoped Contribution, STAR Bullet, Anti-Hallucination Guard, Page-Budget Guard, Evidence Showcase.",
                "Chuẩn hóa ngôn ngữ miền chung (Ubiquitous Language) giúp việc viết mã nguồn và đặt tên biến có tính đồng nhất cao giữa các module."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 4   Thứ: 4   Ngày: 14/10/2026",
            "morning": (
                "Phân rã kỹ thuật thành 6 Tracer-Bullet Tickets (Ticket 01, 02, 03)",
                "Soạn thảo chi tiết tiêu chí nghiệm thu (Acceptance Criteria) cho Ticket 01 (Reverse Sync), Ticket 02 (Scoped Contribution), Ticket 03 (Project Fit Explainer) trong .scratch/project-driven-cv-builder/issues/.",
                "Lập kế hoạch chi tiết với tiêu chí nghiệm thu cụ thể giúp việc triển khai không bị lạc đề và kiểm thử dễ dàng."
            ),
            "afternoon": (
                "Phân rã kỹ thuật cho Ticket 04, 05, 06 và lập kế hoạch TDD",
                "Soạn thảo chi tiết tiêu chí nghiệm thu cho Ticket 04 (STAR Diff Review), Ticket 05 (Page-Budget Guard), Ticket 06 (Evidence Showcase QR) và thiết lập ma trận kiểm thử song hành.",
                "Chia nhỏ bài toán lớn thành các ticket dạng \"tracer-bullet\" giúp kiểm soát tiến độ và phân lập rủi ro hiệu quả."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 4   Thứ: 5   Ngày: 15/10/2026",
            "morning": (
                "Hiện thực hóa Ticket 01 (Reverse Sync & Toast)",
                "Mở rộng ProjectItem với syncToMasterProfile?: boolean. Viết hàm cvService.syncCvProjectsToMaster tự động upsert dự án mới vào Supabase khi lưu CV. Viết test projectReverseSync.test.ts (3/3 pass).",
                "Thiết kế tính năng đồng bộ tự động kèm tùy chọn gạt bật/tắt mang lại sự tiện lợi nhưng vẫn trao quyền kiểm soát cho người dùng."
            ),
            "afternoon": (
                "Hiện thực hóa Ticket 02 (Scoped Contribution)",
                "Thêm trường scopeType: 'solo' | 'team', teamSize, systemContext. Render huy hiệu [👥 Đồ án nhóm - X thành viên] hoặc [👤 Đồ án cá nhân]. Viết test scopedContribution.test.ts (3/3 pass).",
                "Minh bạch vai trò cá nhân trong đồ án nhóm giúp nhà tuyển dụng đánh giá chính xác năng lực thực chất của ứng viên."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 4   Thứ: 6   Ngày: 16/10/2026",
            "morning": (
                "Hiện thực hóa Ticket 03 (Project Fit Explainer)",
                "Xây dựng projectFitService.evaluateProjectFit: Đối chiếu đồ án với JD, tính % tương thích, chip từ khóa trùng khớp/thiếu. Xây dựng ProjectFitExplainerModal.tsx đưa đồ án vào CV với 1-click. Viết test (3/3 pass).",
                "Minh bạch hóa lý do đề xuất của AI bằng số liệu và từ khóa giúp tăng độ tin cậy của thuật toán so khớp."
            ),
            "afternoon": (
                "Hiện thực hóa Ticket 04 (STAR Bullet & Anti-Hallucination Guard)",
                "Xây dựng starBulletService.adaptProjectBulletsWithStar chuẩn hóa mô tả theo mô hình STAR có số liệu định lượng. Xây dựng StarDiffReviewModal.tsx và tích hợp Anti-Hallucination Guard. Viết test (3/3 pass).",
                "Cơ chế kiểm duyệt Anti-Hallucination ngăn chặn AI tự bịa đặt công nghệ, bảo vệ tính trung thực tuyệt đối của hồ sơ sinh viên."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 4   Thứ: 7   Ngày: 17/10/2026",
            "morning": (
                "Hiện thực hóa Ticket 05 (Page-Budget Guard & Layout Switcher)",
                "Xây dựng pageBudgetService đo chiều cao render so với khổ A4, hiển thị huy hiệu 📊 XX% A4. Phát triển 1-Click AI Auto-Condense co vừa 1 trang A4. Thêm nút chuyển bố cục 1 cột (Harvard ATS) và 2 cột. Viết test (3/3 pass).",
                "Tính năng tự động co gọn văn bản bảo toàn từ khóa giúp giải quyết triệt để tình trạng CV bị tràn sang trang thứ 2 ngoài ý muốn."
            ),
            "afternoon": (
                "Hiện thực hóa Ticket 06 (Evidence Showcase & QR) & Tích hợp tổng thể",
                "Render link Live Demo và GitHub Repo chuẩn ATS trên web/PDF. Tích hợp qrcode.react tự động sinh mã QR thu nhỏ 28px in trên A4 quét demo sản phẩm. Lắp ráp hoàn chỉnh vào CVBuilder.tsx. Viết test (3/3 pass).",
                "Tích hợp mã QR quét demo trực tiếp trên bản in A4 biến CV giấy thành cánh cổng tương tác với sản phẩm thực tế, gây ấn tượng mạnh với HR."
            )
        },
        {
            "week_header": None,
            "day_title": "Tuần: 4   Thứ: 2   Ngày: 19/10/2026",
            "morning": (
                "Rà soát tính xác thực của tính năng mở rộng, kiên định triết lý Evidence-Based",
                "Đánh giá rủi ro làm giả của trắc nghiệm tự khai báo và bóc tách package.json. Quyết định dũng cảm cắt bỏ các tính năng hình thức để kiên định với dữ liệu thực chiến (Live Demo, GitHub Repo, QR A4). Tinh gọn Canvas & Sidebar. Chạy 11/11 Test Suites (38/38 Tests) pass 100%.",
                "Trong phát triển sản phẩm phần mềm, loại bỏ tính năng hình thức dễ bị làm giả giúp bảo vệ sự trung thực và tính thực chiến của hồ sơ ứng viên."
            ),
            "afternoon": (
                "Kiểm tra UX/Phím tắt, Build Production Clean & Bàn giao nghiệm thu",
                "Rà soát phím tắt Ctrl+S (Reverse Sync), Ctrl+P (PDF A4), Ctrl+B (Sidebar), Dark/Light mode. Thực thi npm run build (tsc && vite build) thành công 100%, 0 lỗi. Chuyển trạng thái 6 Tracer-Bullet Tickets sang completed và hoàn thiện bàn giao.",
                "Quy trình chuẩn mực từ lập kế hoạch, phát triển TDD đến đóng gói nghiệm thu giúp hoàn thành kỳ thực tập với kết quả xuất sắc nhất."
            )
        },
        {
            "week_header": "TUẦN 5: CONTEXTUAL APPLICATION PITCH & PROJECT DEFENSE BRIEFING (20/10/2026)",
            "day_title": "Tuần: 5   Thứ: 3   Ngày: 20/10/2026",
            "morning": (
                "Phản biện Cover Letter ngành IT, ban hành ADR 0002 Contextual Application Pitch",
                "Tổ chức phiên phản biện chuyên sâu làm rõ bản chất Cover Letter trong tuyển dụng IT. Ban hành ADR 0002 Contextual Application Pitch: nhúng thư ứng tuyển trực tiếp vào bản CV, loại bỏ bảng dữ liệu phụ cồng kềnh. Khống chế độ dài 3 đoạn dưới 250 từ chuẩn Evidence-First.",
                "Tái định nghĩa tính năng theo dạng Embedded Contextual Artifact giúp loại bỏ lãng phí tài nguyên và tập trung giải quyết đúng nhu cầu cốt lõi."
            ),
            "afternoon": (
                "Xây dựng ApplicationPitchModal & Trụ Cột 3: Project Technical Defense Briefing",
                "Xây dựng applicationPitchService.ts, ApplicationPitchModal.tsx (đếm từ thời gian thực, 1-Click Copy). Xây dựng projectDefenseService.ts và ProjectDefenseModal.tsx huấn luyện ứng viên phòng thủ trước Tech Lead (Top 3 câu hỏi xoáy, Trade-off, Debugging Scaffold). Tích hợp Sidebar. Chạy 13 test suites (46 tests) pass 100%.",
                "Trang bị bản lĩnh phòng thủ đồ án trước Tech Lead giúp ứng viên tự tin vượt qua cả vòng lọc CV lẫn vòng phỏng vấn kỹ thuật chuyên sâu."
            )
        }
    ]

    col_widths = [Cm(2.6), Cm(4.5), Cm(5.4), Cm(4.0)]

    for entry in diary_days:
        if entry["week_header"]:
            p_wh = doc.add_paragraph()
            p_wh.paragraph_format.space_before = Pt(14)
            p_wh.paragraph_format.space_after = Pt(6)
            r = p_wh.add_run(entry["week_header"])
            set_run_font(r, name="Times New Roman", size_pt=12, bold=True, color=RGBColor(43, 108, 176))

        # Create table for this day: 4 rows (Day title, Column headers, Morning, Afternoon)
        table = doc.add_table(rows=4, cols=4)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(table, color="A0AEC0", sz="4", val="single")

        # Row 0: Day Title (Merge all 4 cells)
        r0 = table.rows[0]
        c_title = r0.cells[0]
        for c in r0.cells[1:]:
            c_title.merge(c)
        c_title.width = Cm(16.5)
        set_cell_shading(c_title, "EDF2F7")
        set_cell_margins(c_title, top=90, bottom=90, left=100, right=100)
        format_cell_para(c_title, entry["day_title"], bold=True, font_size=11, color=RGBColor(26, 32, 44))

        # Row 1: Column Headers
        r1 = table.rows[1]
        headers = ["Thời gian", "Công việc được giao", "Kết quả thực hiện", "Kinh nghiệm"]
        for j, h_text in enumerate(headers):
            c = r1.cells[j]
            c.width = col_widths[j]
            set_cell_shading(c, "F7FAFC")
            set_cell_margins(c, top=70, bottom=70, left=70, right=70)
            format_cell_para(c, h_text, bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER)

        # Row 2: Morning
        r2 = table.rows[2]
        m_task, m_res, m_exp = entry["morning"]
        format_cell_para(r2.cells[0], "08:30 - 12:00", bold=True, font_size=10, align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell_para(r2.cells[1], m_task, font_size=10)
        format_cell_para(r2.cells[2], m_res, font_size=10)
        format_cell_para(r2.cells[3], m_exp, font_size=10)

        # Row 3: Afternoon
        r3 = table.rows[3]
        a_task, a_res, a_exp = entry["afternoon"]
        format_cell_para(r3.cells[0], "13:00 - 17:00", bold=True, font_size=10, align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell_para(r3.cells[1], a_task, font_size=10)
        format_cell_para(r3.cells[2], a_res, font_size=10)
        format_cell_para(r3.cells[3], a_exp, font_size=10)

        for r_item in [r2, r3]:
            for j in range(4):
                c = r_item.cells[j]
                c.width = col_widths[j]
                set_cell_margins(c, top=70, bottom=70, left=70, right=70)

        # Add small spacing between tables
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_before = Pt(0)
        p_sp.paragraph_format.space_after = Pt(6)

    output_path = r"c:\Users\ADMIN\Desktop\STUDY\docs\BM01b_So_nhat_ky_thuc_tap.docx"
    doc.save(output_path)
    print(f"Successfully generated docx at: {output_path}")

if __name__ == "__main__":
    create_bm01b_document()
