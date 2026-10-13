import re
from unidecode import unidecode

# Từ điển các kỹ năng chuyên môn và mẫu nâng cấp CV chuẩn STAR
SKILL_CATALOG = {
    # 1. FRONTEND
    "react": {
        "name": "ReactJS",
        "category": "Frontend",
        "keywords": ["react", "reactjs", "react.js", "jsx", "tsx", "hooks"],
        "star_template": "Thiết kế & phát triển giao diện người dùng tương tác bằng **ReactJS**, áp dụng Custom Hooks & Clean Architecture, tối ưu thời gian phản hồi trang nhanh hơn 35%.",
        "deep_dive_questions": [
            {
                "question": "Trong dự án React vừa rồi, bạn đã quản lý state (trạng thái ứng dụng) như thế nào (dùng Context API, Redux Toolkit, Zustand hay React Query)?",
                "hints": ["Dùng Redux Toolkit quản lý global state", "Dùng Context API & Custom Hooks", "Dùng React Query / SWR để cache API"]
            },
            {
                "question": "Bạn đã áp dụng kỹ thuật nào để tối ưu hiệu năng và trải nghiệm người dùng trong React (Lazy loading, Code splitting, Memoization, useMemo, useCallback)?",
                "hints": ["Sử dụng React.lazy & Suspense", "Tối ưu re-render bằng useMemo & useCallback", "Tối ưu hóa kích thước bundle"]
            }
        ]
    },
    "vue": {
        "name": "Vue.js",
        "category": "Frontend",
        "keywords": ["vue", "vuejs", "vue.js", "vuex", "pinia", "nuxt"],
        "star_template": "Xây dựng Single Page Application (SPA) hiệu năng cao với **Vue.js & Pinia**, tái sử dụng Component đạt trên 80% và tối ưu rendering UI.",
        "deep_dive_questions": [
            {
                "question": "Bạn đã sử dụng Composition API hay Options API, và cấu trúc luồng dữ liệu giữa các Component như thế nào?",
                "hints": ["Sử dụng Composition API với script setup", "Quản lý state tập trung với Pinia", "Tạo các composables tái sử dụng"]
            }
        ]
    },
    "tailwind": {
        "name": "TailwindCSS / UI Design",
        "category": "Frontend",
        "keywords": ["tailwind", "tailwindcss", "css", "scss", "sass", "bootstrap", "responsive", "ui"],
        "star_template": "Thiết kế giao diện Responsive chuẩn Mobile-First bằng **TailwindCSS**, đảm bảo tương thích 100% trên các thiết bị và tối ưu trải nghiệm UI/UX.",
        "deep_dive_questions": [
            {
                "question": "Bạn đã áp dụng chiến lược thiết kế Responsive và Dark Mode như thế nào để đảm bảo tính đồng bộ của Design System?",
                "hints": ["Áp dụng Mobile-first với Tailwind breakpoints", "Xây dựng hệ thống UI Components đồng bộ", "Tối ưu độ tương phản màu sắc và Dark Mode"]
            }
        ]
    },

    # 2. BACKEND & API
    "nodejs": {
        "name": "Node.js / Express",
        "category": "Backend",
        "keywords": ["node", "nodejs", "node.js", "express", "expressjs", "nestjs"],
        "star_template": "Xây dựng kiến trúc Backend RESTful API bằng **Node.js/Express**, tích hợp Middleware phân quyền JWT và xử lý hơn 1,000+ request/phút ổn định.",
        "deep_dive_questions": [
            {
                "question": "Trong hệ thống backend Node.js, bạn đã xử lý xác thực (Authentication) & phân quyền (Role-based Authorization) như thế nào?",
                "hints": ["Sử dụng JWT (JSON Web Tokens) & Refresh Token", "Tạo Auth Middleware bảo vệ private endpoints", "Mã hóa mật khẩu an toàn bằng bcrypt"]
            },
            {
                "question": "Bạn đã xử lý lỗi tập trung (Centralized Error Handling) và ghi log hệ thống như thế nào để dễ debug trong production?",
                "hints": ["Dùng Custom Error Middleware", "Ghi log với Winston / Morgan", "Bắt validation errors bằng Zod / Joi"]
            }
        ]
    },
    "python": {
        "name": "Python / Backend",
        "category": "Backend / Data",
        "keywords": ["python", "django", "fastapi", "flask"],
        "star_template": "Phát triển dịch vụ API hiệu năng cao bằng **Python (FastAPI/Flask)**, tự động hóa xử lý logic nghiệp vụ và tối ưu thời gian phản hồi dưới 150ms.",
        "deep_dive_questions": [
            {
                "question": "Bạn đã tổ chức cấu trúc dự án Python và viết API documentation (Swagger/OpenAPI) cũng như kiểm thử tự động (Unit Test) ra sao?",
                "hints": ["Tự động sinh tài liệu Swagger/OpenAPI", "Viết test case với PyTest", "Áp dụng Pydantic để validate schema dữ liệu"]
            }
        ]
    },

    # 3. DATABASE & CACHING
    "mongodb": {
        "name": "MongoDB / NoSQL",
        "category": "Database",
        "keywords": ["mongo", "mongodb", "nosql", "mongoose"],
        "star_template": "Thiết kế cơ sở dữ liệu phi quan hệ **MongoDB/Mongoose**, đánh chỉ mục (Indexing) thông minh giúp giảm 40% thời gian truy vấn dữ liệu lớn.",
        "deep_dive_questions": [
            {
                "question": "Bạn đã áp dụng kỹ thuật đánh Index hoặc Aggregate Pipeline trong MongoDB như thế nào để xử lý các báo cáo hoặc tìm kiếm phức tạp?",
                "hints": ["Đánh Compound Index cho các trường thường truy vấn", "Sử dụng Aggregation Pipeline lọc dữ liệu", "Phân trang dữ liệu (Pagination) bằng skip & limit"]
            }
        ]
    },
    "sql": {
        "name": "SQL / Relational DB",
        "category": "Database",
        "keywords": ["sql", "mysql", "postgres", "postgresql", "oracle", "sql server", "supabase"],
        "star_template": "Thiết kế mô hình cơ sở dữ liệu quan hệ **PostgreSQL/MySQL**, chuẩn hóa dữ liệu 3NF và tối ưu các câu truy vấn phức tạp (Joins, Indexing, Transactions).",
        "deep_dive_questions": [
            {
                "question": "Bạn đã đảm bảo tính toàn vẹn dữ liệu (ACID Transactions) hoặc ngăn ngừa rủi ro SQL Injection như thế nào?",
                "hints": ["Sử dụng ORM / Query Builder với Parameterized Queries", "Áp dụng Database Transactions cho các luồng thanh toán", "Tối ưu hóa Foreign Keys & Cascade constraints"]
            }
        ]
    },
    "redis": {
        "name": "Redis / Caching",
        "category": "Database / Performance",
        "keywords": ["redis", "cache", "caching", "in-memory"],
        "star_template": "Tích hợp tầng nhớ đệm **Redis Cache**, giảm tải 60% truy vấn trực tiếp vào Database chính và tăng tốc độ xử lý dữ liệu thời gian thực.",
        "deep_dive_questions": [
            {
                "question": "Bạn đã áp dụng chiến lược Cache Invalidation (xóa cache khi dữ liệu thay đổi) và cài đặt TTL (Time-To-Live) như thế nào?",
                "hints": ["Cài đặt TTL hợp lý cho dữ liệu tĩnh", "Xóa cache chủ động khi có sự kiện Update/Delete", "Dùng Redis làm Session Store"]
            }
        ]
    },

    # 4. DEVOPS & CLOUD & TOOLS
    "docker": {
        "name": "Docker / DevOps",
        "category": "DevOps",
        "keywords": ["docker", "container", "dockerfile", "docker-compose", "k8s", "kubernetes", "ci/cd", "github actions"],
        "star_template": "Đóng gói ứng dụng dạng container bằng **Docker & Docker Compose**, tự động hóa quy trình CI/CD giúp giảm thời gian triển khai xuống dưới 5 phút.",
        "deep_dive_questions": [
            {
                "question": "Bạn đã tối ưu kích thước Docker Image (Multi-stage build) hoặc cấu hình mạng giữa các container (Docker Network) như thế nào?",
                "hints": ["Áp dụng Multi-stage build giảm dung lượng image", "Tách riêng môi trường dev và production", "Tự động hóa build & test qua GitHub Actions"]
            }
        ]
    },
    "git": {
        "name": "Git / Version Control",
        "category": "Tools & Workflow",
        "keywords": ["git", "github", "gitlab", "branch", "pull request", "merge"],
        "star_template": "Quản lý mã nguồn dự án chuyên nghiệp bằng **Git/GitHub**, tuân thủ quy trình Gitflow và review code giúp giảm 50% lỗi xung đột mã nguồn.",
        "deep_dive_questions": [
            {
                "question": "Khi làm việc nhóm, bạn đã áp dụng quy tắc đặt tên nhánh (Branching strategy) và giải quyết xung đột mã nguồn (Merge conflicts) ra sao?",
                "hints": ["Áp dụng quy chuẩn Git Flow (feature, release, hotfix)", "Viết commit message chuẩn Conventional Commits", "Tạo Pull Request và thực hiện Code Review"]
            }
        ]
    },

    # 5. SOFT SKILLS & METHODOLOGY
    "agile": {
        "name": "Agile / Scrum & Teamwork",
        "category": "Methodology",
        "keywords": ["scrum", "agile", "jira", "trello", "sprint", "làm việc nhóm", "lam viec nhom", "leader", "trưởng nhóm"],
        "star_template": "Thực thi dự án theo mô hình **Agile/Scrum**, tham gia Daily Standup & Sprint Planning, đảm bảo bàn giao 100% tính năng đúng tiến độ cam kết.",
        "deep_dive_questions": [
            {
                "question": "Khi dự án gặp rủi ro trễ tiến độ hoặc phát sinh yêu cầu đột xuất từ khách hàng/giáo viên, bạn đã giải quyết và phân chia lại công việc ra sao?",
                "hints": ["Họp Retrospective để tìm nguyên nhân gốc rễ", "Ưu tiên các tính năng cốt lõi (MVP)", "Tăng cường phối hợp và hỗ trợ các thành viên trong nhóm"]
            }
        ]
    }
}

def analyze_candidate_answer(user_message: str):
    """
    Phân tích câu trả lời của ứng viên:
    1. Quét tìm các từ khóa kỹ năng xuất hiện
    2. Sinh các bullet points chuẩn STAR để đưa vào CV
    3. Tạo câu hỏi đào sâu tiếp theo (Deep-dive)
    4. Tính điểm tăng cấp kỹ năng (+EXP)
    """
    msg_raw = user_message.lower()
    msg_clean = unidecode(msg_raw)

    detected_skills = []
    upgraded_bullet_points = []
    deep_dive_candidate_questions = []
    total_boost_exp = 0

    for skill_key, skill_info in SKILL_CATALOG.items():
        is_matched = False
        for kw in skill_info["keywords"]:
            kw_clean = unidecode(kw.lower())
            if kw in msg_raw or kw_clean in msg_clean:
                is_matched = True
                break
        
        if is_matched:
            detected_skills.append({
                "key": skill_key,
                "name": skill_info["name"],
                "category": skill_info["category"],
                "boost": "+25 EXP"
            })
            total_boost_exp += 25
            upgraded_bullet_points.append(skill_info["star_template"])
            deep_dive_candidate_questions.extend(skill_info.get("deep_dive_questions", []))

    # Nếu phát hiện được kỹ năng
    if detected_skills:
        # Chọn câu hỏi đào sâu ngẫu nhiên/tiêu biểu
        selected_deep_dive = deep_dive_candidate_questions[0] if deep_dive_candidate_questions else {
            "question": "Bạn có thể chia sẻ chi tiết hơn về thách thức lớn nhất bạn đã vượt qua trong dự án này không?",
            "hints": ["Vấn đề tối ưu hiệu năng", "Lỗi liên quan đến logic xử lý dữ liệu", "Khó khăn khi tích hợp API"]
        }

        # Tạo phản hồi AI thông minh
        skills_text = ", ".join([f"**{s['name']}**" for s in detected_skills])
        ai_response = f"✨ **Tuyệt vời! Tôi đã ghi nhận các kỹ năng chuyên môn:** {skills_text} (+{total_boost_exp} EXP).\n\n"
        ai_response += "🎯 **Câu viết nâng cấp chuẩn STAR để đưa vào CV của bạn:**\n"
        for bp in upgraded_bullet_points:
            ai_response += f"• {bp}\n"

        ai_response += f"\n❓ **Câu hỏi đào sâu để khai phá thêm điểm mạnh của bạn:**\n👉 *{selected_deep_dive['question']}*"

        return {
            "status": "success",
            "detected_skills": detected_skills,
            "upgraded_bullet_points": upgraded_bullet_points,
            "answer": ai_response,
            "next_deep_dive": selected_deep_dive["question"],
            "suggestions": selected_deep_dive.get("hints", [
                "Cập nhật câu này vào CV Builder",
                "Tiếp tục khai thác kỹ năng khác"
            ]),
            "boost_exp": total_boost_exp
        }
    
    # Nếu không tìm thấy keyword cụ thể, hỏi gợi mở
    return {
        "status": "not_detected",
        "detected_skills": [],
        "upgraded_bullet_points": [],
        "answer": "Tôi đã ghi nhận chia sẻ của bạn! Để giúp bạn chuyển hóa thành điểm sáng trong CV, bạn có thể nêu rõ hơn về các **Công nghệ cụ thể (React, Node, Python, SQL, Docker...)** hoặc **Kết quả cụ thể** bạn đã đạt được không?",
        "next_deep_dive": "Bạn đã sử dụng những công nghệ và công cụ lập trình nào trong dự án gần đây nhất?",
        "suggestions": [
            "Em dùng ReactJS & TailwindCSS ở Frontend",
            "Em viết Backend bằng Node.js & Express API",
            "Em quản lý cơ sở dữ liệu với MongoDB / SQL",
            "Em đã xây dựng ứng dụng với Python & AI"
        ],
        "boost_exp": 0
    }
