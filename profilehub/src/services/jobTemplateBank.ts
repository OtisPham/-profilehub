import type { JobTemplateItem } from '../types/database';

export const JOB_TEMPLATE_BANK: JobTemplateItem[] = [
  {
    id: 'tpl_frontend_react',
    title: 'Kỹ Sư Frontend (ReactJS / TypeScript / Tailwind CSS)',
    department: 'Công nghệ thông tin & Phần mềm',
    experienceLevel: 'fresher',
    workplaceType: 'hybrid',
    salaryMin: 8000000,
    salaryMax: 12000000,
    currency: 'VND',
    requiredSkills: ['ReactJS', 'TypeScript', 'Tailwind CSS', 'Redux', 'Git', 'REST API'],
    description: `### Mô Tả Công Việc
- Tham gia phát triển và tối ưu hóa các module giao diện người dùng (Web App) bằng React và TypeScript.
- Chuyển đổi bản thiết kế Figma thành giao diện chuẩn Responsive, tối ưu điểm trải nghiệm Web Vitals.
- Phối hợp chặt chẽ với Backend team để tích hợp RESTful APIs và xử lý luồng dữ liệu thời gian thực.
- Viết mã nguồn sạch, tuân thủ Clean Architecture và tham gia review code hàng tuần.

### Yêu Cầu Ứng Viên
- Nắm vững kiến thức nền tảng JavaScript (ES6+), HTML5/CSS3 và TypeScript.
- Có ít nhất 1-2 đồ án thực tế đã hoàn thiện bằng React (có link GitHub và Demo chạy thật).
- Thành thạo Git, hiểu quy trình làm việc theo nhánh (Gitflow) và tạo Pull Request chuẩn mực.
- Tinh thần học hỏi cao, chủ động tìm kiếm giải pháp và khả năng đọc hiểu tài liệu tiếng Anh.`,
    highlightBenefit: 'Review lương 6 tháng/lần, hỗ trợ thiết bị làm việc và tài trợ thi chứng chỉ quốc tế.'
  },
  {
    id: 'tpl_backend_node',
    title: 'Kỹ Sư Backend (Node.js / Express / PostgreSQL)',
    department: 'Công nghệ thông tin & Phần mềm',
    experienceLevel: 'junior',
    workplaceType: 'on-site',
    salaryMin: 10000000,
    salaryMax: 16000000,
    currency: 'VND',
    requiredSkills: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'REST API'],
    description: `### Mô Tả Công Việc
- Thiết kế và xây dựng các dịch vụ RESTful API hiệu năng cao phục vụ hàng chục nghìn người dùng.
- Thiết kế cơ sở dữ liệu quan hệ (PostgreSQL), tối ưu hóa câu lệnh truy vấn SQL và indexing.
- Triển khai cơ chế phân quyền bảo mật (RBAC, JWT Authentication) và tích hợp Redis Caching giảm tải DB.
- Đóng gói ứng dụng bằng Docker Compose và tham gia thiết lập quy trình CI/CD.

### Yêu Cầu Ứng Viên
- Tốt nghiệp hoặc chuẩn bị tốt nghiệp chuyên ngành CNTT, Khoa học Máy tính hoặc tương đương.
- Có kinh nghiệm thực chiến với Node.js (Express/NestJS) và kiến thức vững về kiến trúc MVC / Layered Architecture.
- Có đồ án minh chứng về khả năng xử lý Database, chống SQL Injection và bảo mật API.
- Tư duy gỡ lỗi (debugging) tốt, chủ động nhận diện bottleneck hiệu năng.`,
    highlightBenefit: 'Lương thưởng cạnh tranh, cơ hội làm việc trực tiếp cùng Tech Lead giàu kinh nghiệm.'
  },
  {
    id: 'tpl_fullstack_web',
    title: 'Kỹ Sư Fullstack Web (React / Node.js / Docker)',
    department: 'Công nghệ thông tin & Phần mềm',
    experienceLevel: 'junior',
    workplaceType: 'hybrid',
    salaryMin: 12000000,
    salaryMax: 18000000,
    currency: 'VND',
    requiredSkills: ['ReactJS', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'Git'],
    description: `### Mô Tả Công Việc
- Đảm nhận phát triển toàn diện tính năng sản phẩm từ giao diện Frontend (React) đến logic xử lý Backend (Node.js).
- Xây dựng kiến trúc dữ liệu và API an toàn, đáp ứng tiêu chuẩn mở rộng (Scalability).
- Cải thiện tốc độ tải trang, nâng cao điểm Code Health và trải nghiệm người dùng tổng thể.
- Quản lý môi trường phát triển nhất quán thông qua container Docker.

### Yêu Cầu Ứng Viên
- Thành thạo cả hai mảng Frontend và Backend với hệ sinh thái JavaScript/TypeScript.
- Có portfolio hoặc repository đồ án hoàn chỉnh có kiểm thử tự động (Unit Test / Integration Test).
- Kỹ năng giải quyết vấn đề độc lập và khả năng giao tiếp kỹ thuật mạch lạc.`,
    highlightBenefit: 'Môi trường Startup năng động, giờ làm việc linh hoạt, bảo hiểm sức khỏe cao cấp.'
  },
  {
    id: 'tpl_ai_data_fresher',
    title: 'Kỹ Sư Dữ Liệu & AI Ứng Dụng (Python / FastAPI / LangChain)',
    department: 'Dữ liệu & Trí tuệ nhân tạo (AI/Data)',
    experienceLevel: 'fresher',
    workplaceType: 'hybrid',
    salaryMin: 10000000,
    salaryMax: 15000000,
    currency: 'VND',
    requiredSkills: ['Python', 'FastAPI', 'Pandas', 'LangChain', 'OpenAI API', 'SQL', 'Docker'],
    description: `### Mô Tả Công Việc
- Xây dựng các đường ống tiền xử lý dữ liệu và tích hợp các mô hình ngôn ngữ lớn (LLM/GenAI) vào sản phẩm.
- Phát triển các microservices bằng Python FastAPI để cung cấp dự đoán và phân tích dữ liệu realtime.
- Đánh giá chất lượng mô hình, xây dựng kho Vector Database (Chroma/Pinecone) phục vụ RAG.
- Tham gia trực quan hóa số liệu và tối ưu hóa chi phí token gọi AI.

### Yêu Cầu Ứng Viên
- Nắm vững lập trình Python, thư viện phân tích dữ liệu (NumPy, Pandas) và cấu trúc dữ liệu giải thuật.
- Có đồ án tốt nghiệp hoặc dự án cá nhân ứng dụng GenAI / Machine Learning thực tế.
- Khả năng đọc hiểu paper kỹ thuật và cập nhật nhanh các công nghệ AI mới nhất.`,
    highlightBenefit: 'Cấp tài khoản tài nguyên GPU/Cloud AI phục vụ nghiên cứu và phát triển sản phẩm.'
  },
  {
    id: 'tpl_devops_cloud',
    title: 'Kỹ Sư DevOps & Hạ Tầng Cloud (Docker / CI-CD / Linux)',
    department: 'Công nghệ thông tin & Phần mềm',
    experienceLevel: 'junior',
    workplaceType: 'remote',
    salaryMin: 12000000,
    salaryMax: 20000000,
    currency: 'VND',
    requiredSkills: ['Docker', 'Linux', 'GitHub Actions', 'CI/CD', 'AWS', 'Nginx', 'Bash Script'],
    description: `### Mô Tả Công Việc
- Xây dựng và duy trì các pipeline CI/CD tự động hóa quy trình kiểm thử và triển khai mã nguồn lên môi trường staging/production.
- Quản trị hệ thống máy chủ Linux, thiết lập Reverse Proxy (Nginx) và chứng chỉ bảo mật SSL.
- Giám sát sức khỏe hệ thống (Monitoring & Logging), chủ động xử lý sự cố và báo động tải.
- Tối ưu hóa chi phí vận hành hạ tầng đám mây (Cloud Cost Optimization).

### Yêu Cầu Ứng Viên
- Thành thạo môi trường dòng lệnh Linux (Ubuntu/Debian) và viết kịch bản Bash/Shell.
- Hiểu sâu về Docker containerization và có kinh nghiệm cấu hình GitHub Actions / GitLab CI.
- Ý thức bảo mật hệ thống cao, hiểu về firewall, SSH keys và VPC networking.`,
    highlightBenefit: 'Làm việc từ xa 100% linh hoạt, thưởng hiệu suất hàng quý.'
  },
  {
    id: 'tpl_ui_ux_designer',
    title: 'Chuyên Viên Thiết Kế Sản Phẩm UI/UX (Figma / Design Systems)',
    department: 'Thiết kế sản phẩm (UI/UX)',
    experienceLevel: 'fresher',
    workplaceType: 'hybrid',
    salaryMin: 8000000,
    salaryMax: 14000000,
    currency: 'VND',
    requiredSkills: ['Figma', 'UI/UX', 'Design System', 'Wireframing', 'Prototyping', 'User Research'],
    description: `### Mô Tả Công Việc
- Nghiên cứu hành vi người dùng, vẽ luồng trải nghiệm (User Flow) và khung dây sơ bộ (Wireframe).
- Thiết kế giao diện chi tiết (Pixel-perfect) trên Figma theo chuẩn Design System của công ty.
- Tạo bản mẫu tương tác (Interactive Prototype) phục vụ kiểm thử người dùng (Usability Testing).
- Bàn giao thiết kế tỉ mỉ cho đội ngũ kỹ sư Frontend, hỗ trợ kiểm thử giao diện thực tế.

### Yêu Cầu Ứng Viên
- Có Portfolio đồ án thiết kế UI/UX thực tế minh họa rõ ràng quy trình giải quyết vấn đề (Case Study).
- Sử dụng thành thạo Figma (Auto Layout, Components, Variants, Variables).
- Hiểu cơ bản về HTML/CSS để thiết kế có tính khả thi kỹ thuật cao.
- Tư duy thẩm mỹ tốt, chú ý đến từng chi tiết nhỏ về khoảng cách, màu sắc và kiểu chữ.`,
    highlightBenefit: 'Trang bị máy tính cấu hình cao, môi trường sáng tạo không giới hạn.'
  }
];

export const jobTemplateBank = {
  getAllTemplates: (): JobTemplateItem[] => {
    return [...JOB_TEMPLATE_BANK];
  },
  getTemplateById: (id: string): JobTemplateItem | undefined => {
    return JOB_TEMPLATE_BANK.find(t => t.id === id);
  }
};
