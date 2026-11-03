/**
 * Danh mục Khung Dự Án Mẫu Theo Chuyên Ngành (Industry Starter Templates)
 * Cung cấp sẵn các đồ án chuẩn mực theo STAR giúp ứng viên xóa bỏ nỗi sợ trang giấy trắng (Cold-Start)
 */

import type { IndustryStarterTemplate } from '../types/coldStart.types';

export const STARTER_DOMAINS = [
  { id: 'all', title: 'Tất Cả Ngành' },
  { id: 'frontend', title: 'Frontend Developer' },
  { id: 'backend', title: 'Backend Engineer' },
  { id: 'fullstack', title: 'Fullstack Developer' },
  { id: 'mobile', title: 'Mobile Developer' },
  { id: 'ai_data', title: 'AI & Data Specialist' }
] as const;

export const INDUSTRY_STARTER_TEMPLATES: IndustryStarterTemplate[] = [
  {
    id: 'starter-fe-ecommerce',
    domain: 'frontend',
    domainTitle: 'Frontend React / Next.js',
    projectName: 'Nền Tảng Thương Mại Điện Tử Mini (Mini E-Commerce Storefront)',
    role: 'Frontend Developer',
    technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Vite'],
    systemContext: 'Hệ thống mua sắm trực tuyến cho cửa hàng bán lẻ phục vụ 5.000 người dùng hàng tháng',
    scopeType: 'team',
    teamSize: 3,
    description: 'Phát triển giao diện web mua sắm trực tuyến chuẩn responsive, tích hợp giỏ hàng và thanh toán.',
    bullets: [
      'Thiết kế giao diện mua sắm chuẩn Responsive Mobile-First với Tailwind CSS, tối ưu hóa điểm Google Lighthouse đạt 95/100.',
      'Tích hợp luồng giỏ hàng và quản lý trạng thái bằng Zustand, giảm thiểu 40% re-render dư thừa so với Context API.',
      'Triển khai tìm kiếm và bộ lọc sản phẩm đa tiêu chí với Debounce 300ms, nâng cao tốc độ phản hồi người dùng.'
    ],
    demoUrl: 'https://ecommerce-store-demo.vercel.app',
    githubUrl: 'https://github.com/example/mini-ecommerce-store',
    starsOrMetrics: '95/100 Lighthouse'
  },
  {
    id: 'starter-be-booking',
    domain: 'backend',
    domainTitle: 'Backend Node.js / Go',
    projectName: 'Hệ Thống API Đặt Lịch Khám Bệnh Trực Tuyến (Telehealth Booking API)',
    role: 'Backend Engineer',
    technologies: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
    systemContext: 'Nền tảng đặt khám và điều phối ca làm việc bác sĩ cho phòng khám đa khoa',
    scopeType: 'team',
    teamSize: 4,
    description: 'Xây dựng hệ thống RESTful API xử lý giao dịch đặt lịch khám theo thời gian thực và phân quyền người dùng.',
    bullets: [
      'Xây dựng kiến trúc RESTful API chuẩn Clean Architecture với Node.js và TypeScript, xử lý 200+ yêu cầu đặt lịch mỗi phút.',
      'Tối ưu hóa truy vấn PostgreSQL kết hợp bộ nhớ đệm Redis, giảm thời gian phản hồi API trung bình từ 450ms xuống 85ms.',
      'Đóng gói dịch vụ bằng Docker Compose và viết bộ kiểm thử tự động với Jest đạt độ bao phủ mã nguồn 88%.'
    ],
    demoUrl: 'https://booking-api-demo.dev',
    githubUrl: 'https://github.com/example/telehealth-booking-api',
    starsOrMetrics: '85ms API Latency'
  },
  {
    id: 'starter-fs-kanban',
    domain: 'fullstack',
    domainTitle: 'Fullstack Web Application',
    projectName: 'Bảng Quản Lý Dự Án Thời Gian Thực (Collaborative Kanban Board)',
    role: 'Fullstack Developer',
    technologies: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'Socket.io', 'Tailwind CSS'],
    systemContext: 'Công cụ quản lý công việc và tiến độ đồ án nhóm theo mô hình Agile/Scrum',
    scopeType: 'solo',
    teamSize: 1,
    description: 'Ứng dụng quản trị công việc nhóm với tính năng kéo thả trực quan và đồng bộ dữ liệu thời gian thực.',
    bullets: [
      'Phát triển ứng dụng Web fullstack kéo thả công việc mượt mà bằng dnd-kit và Next.js App Router.',
      'Tích hợp WebSocket thời gian thực cho phép các thành viên trong nhóm nhận cập nhật trạng thái thẻ task tức thì (<100ms).',
      'Thiết kế Schema cơ sở dữ liệu quan hệ với Prisma ORM và phân quyền truy cập theo vai trò (Role-Based Access Control).'
    ],
    demoUrl: 'https://collab-kanban-demo.vercel.app',
    githubUrl: 'https://github.com/example/collab-kanban-board',
    starsOrMetrics: '<100ms Sync'
  },
  {
    id: 'starter-mobile-habit',
    domain: 'mobile',
    domainTitle: 'Mobile Flutter / React Native',
    projectName: 'Ứng Dụng Rèn Luyện Thói Quen Cá Nhân (Habit Tracker Mobile App)',
    role: 'Mobile Developer',
    technologies: ['Flutter', 'Dart', 'Bloc', 'SQLite', 'Firebase Auth'],
    systemContext: 'Ứng dụng di động theo dõi mục tiêu cá nhân và nhắc nhở thói quen thông minh',
    scopeType: 'solo',
    teamSize: 1,
    description: 'Ứng dụng di động theo dõi thói quen hàng ngày với cơ chế lưu trữ offline và đồng bộ đám mây.',
    bullets: [
      'Xây dựng giao diện ứng dụng di động tương thích đa nền tảng (iOS & Android) theo chuẩn Material Design 3.',
      'Quản lý trạng thái phức tạp bằng BLoC Pattern, đảm bảo luồng dữ liệu một chiều rõ ràng và dễ bảo trì.',
      'Tích hợp lưu trữ dữ liệu cục bộ ngoại tuyến (Offline-First) với SQLite và đồng bộ đám mây tự động khi có kết nối mạng.'
    ],
    demoUrl: 'https://habit-tracker-demo.app',
    githubUrl: 'https://github.com/example/habit-tracker-flutter',
    starsOrMetrics: 'Offline-First'
  },
  {
    id: 'starter-ai-resumematcher',
    domain: 'ai_data',
    domainTitle: 'AI & Data Specialist',
    projectName: 'Hệ Thống Phân Tích Độ Khớp CV Với JD (AI Resume Matcher & Parser)',
    role: 'AI & Data Specialist',
    technologies: ['Python', 'FastAPI', 'LangChain', 'Scikit-learn', 'Docker'],
    systemContext: 'Công cụ hỗ trợ sinh viên đối chiếu hồ sơ năng lực với bản mô tả công việc của nhà tuyển dụng',
    scopeType: 'team',
    teamSize: 2,
    description: 'Hệ thống trích xuất văn bản CV tự động và phân tích độ tương đồng từ khóa kỹ thuật với Job Description.',
    bullets: [
      'Xây dựng pipeline xử lý ngôn ngữ tự nhiên (NLP) trích xuất kỹ năng và kinh nghiệm từ file PDF với độ chính xác 91%.',
      'Tính toán vector embedding và độ tương đồng Cosine Similarity để xếp hạng mức độ phù hợp của đồ án với yêu cầu JD.',
      'Đóng gói API bằng FastAPI và Docker container, đảm bảo thời gian xử lý phân tích hoàn tất dưới 1.2 giây/bản CV.'
    ],
    demoUrl: 'https://ai-matcher-demo.dev',
    githubUrl: 'https://github.com/example/ai-resume-matcher',
    starsOrMetrics: '91% Accuracy'
  }
];
