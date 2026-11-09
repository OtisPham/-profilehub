export interface ChallengeTemplate {
  id: string;
  category: 'backend' | 'frontend' | 'fullstack' | 'devops';
  title: string;
  description: string;
  requirements: string[];
  recommendedHours: number;
  evaluationCriteria: string[];
}

export const CHALLENGE_TEMPLATE_BANK: ChallengeTemplate[] = [
  {
    id: 'tpl_backend_rbac',
    category: 'backend',
    title: 'Bổ sung Phân Quyền Vai Trò (Role-Based Access Control) cho API',
    description: 'Tạo một branch mới `feature/rbac-authorization` trên repo đồ án của bạn. Thiết lập phân quyền 3 cấp (Admin, Recruiter, Student) cho các endpoint nhạy cảm với JWT Middleware.',
    requirements: [
      'Tạo middleware kiểm tra role trong token JWT trước khi cho phép gọi handler',
      'Xử lý trả về mã lỗi 403 Forbidden kèm thông điệp rõ ràng khi không đủ quyền hạn',
      'Viết ít nhất 3 unit tests kiểm thử các trường hợp: Đúng quyền, Sai quyền, và Token hết hạn',
      'Tạo Pull Request trên GitHub mô tả ngắn gọn sơ đồ phân quyền đã áp dụng'
    ],
    recommendedHours: 48,
    evaluationCriteria: [
      'Cấu trúc middleware sạch, dễ mở rộng thêm roles mới',
      'Không hardcode secret key hoặc danh sách quyền trong controller',
      'Test coverage cho luồng xác thực đạt yêu cầu'
    ]
  },
  {
    id: 'tpl_backend_cache',
    category: 'backend',
    title: 'Tối ưu Tốc độ Phản hồi API với Redis In-Memory Caching',
    description: 'Tích hợp lớp đệm Redis Cache-Aside Pattern cho endpoint danh sách sản phẩm hoặc hồ sơ ứng viên để giảm thời gian phản hồi từ > 150ms xuống < 15ms.',
    requirements: [
      'Triển khai Redis client với cơ chế kết nối an toàn và fallback khi Redis offline',
      'Thiết lập thời gian hết hạn (TTL) 60 giây và cơ chế xóa cache khi có bản ghi mới',
      'Đính kèm ảnh chụp màn hình đo lường thời gian phản hồi (Network Tab hoặc Postman)',
      'Tạo Pull Request chi tiết trên GitHub'
    ],
    recommendedHours: 48,
    evaluationCriteria: [
      'Không gây lỗi hệ thống nếu cụm Redis gặp sự cố (Graceful Degradation)',
      'Thời gian phản hồi giảm rõ rệt so với truy vấn Database trực tiếp'
    ]
  },
  {
    id: 'tpl_frontend_webvitals',
    category: 'frontend',
    title: 'Tối ưu Core Web Vitals & Caching Dữ Liệu Phía Client',
    description: 'Cải thiện trải nghiệm tải trang trên repo đồ án: Tối ưu LCP (Largest Contentful Paint) < 2.0s, áp dụng Code Splitting / Lazy Loading cho các component nặng.',
    requirements: [
      'Áp dụng React.lazy() và Suspense cho các trang phụ và modal phức tạp',
      'Tối ưu kích thước hình ảnh và sử dụng định dạng hiện đại (WebP/SVG)',
      'Đo lường điểm Lighthouse trước và sau khi tối ưu hóa',
      'Gửi link Pull Request và link Preview/Vercel đã triển khai'
    ],
    recommendedHours: 48,
    evaluationCriteria: [
      'Không gây hiện tượng giật layout (Cumulative Layout Shift CLS < 0.1)',
      'Kích thước gói bundle giảm đáng kể'
    ]
  },
  {
    id: 'tpl_devops_docker',
    category: 'devops',
    title: 'Container hóa Toàn Diện Hệ Thống với Docker & Docker Compose',
    description: 'Đóng gói đồ án của bạn thành cụm container đồng nhất gồm App Service và Database, cho phép người khác chạy thử chỉ với 1 lệnh `docker compose up`.',
    requirements: [
      'Viết Dockerfile nhiều tầng (Multi-stage build) để tối ưu kích thước image (< 150MB)',
      'Tạo file `docker-compose.yml` cấu hình mạng nội bộ và volume lưu trữ cơ sở dữ liệu',
      'Tạo file `.dockerignore` đầy đủ',
      'Cập nhật file README.md hướng dẫn 3 bước khởi chạy nhanh cho người mới'
    ],
    recommendedHours: 48,
    evaluationCriteria: [
      'Image build nhanh, không chứa cache dư thừa và file nhạy cảm',
      'Khởi chạy thành công không bị crash khi database chưa sẵn sàng (healthcheck)'
    ]
  }
];
