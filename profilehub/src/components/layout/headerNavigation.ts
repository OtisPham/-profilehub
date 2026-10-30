import type { UserRole, CandidatePipelineItem } from '../../types/database';

export interface HeaderNavLink {
  label: string;
  path: string;
  badge?: string;
  isDropdown?: boolean;
  subLinks?: {
    label: string;
    path: string;
    description?: string;
    icon?: string;
  }[];
}

/**
 * Trả về danh sách liên kết điều hướng trên HeaderBar dựa theo vai trò người dùng
 */
export function getHeaderNavLinks(role: UserRole = 'student'): HeaderNavLink[] {
  if (role === 'recruiter') {
    return [
      { label: 'Bảng Tin Tuyển Dụng', path: '/recruiter/dashboard' },
      { label: 'Tin Tuyển Dụng', path: '/recruiter/jobs' },
      { label: 'Tìm Ứng Viên', path: '/recruiter/candidates' },
      { label: 'Pipeline Phỏng Vấn', path: '/recruiter/pipeline' },
    ];
  }

  // Mặc định cho Student / Guest
  return [
    { label: 'Quản Lý CV', path: '/cv-management' },
    { label: 'Kho Dự Án', path: '/my-projects' },
    { label: 'Tìm Việc Làm', path: '/student/jobs' },
    {
      label: 'Công Cụ Nghề Nghiệp',
      path: '#tools',
      isDropdown: true,
      subLinks: [
        { label: 'Luyện Phỏng Vấn AI', path: '/interview-prep', description: 'Mô phỏng phỏng vấn & kịch bản gỡ lỗi' },
        { label: 'Khớp Hồ Sơ Việc Làm', path: '/portfolio-match', description: 'Đo lường độ khớp giữa đồ án và vị trí' },
        { label: 'Trắc Nghiệm MBTI', path: '/mbti', description: 'Định vị thiên hướng nghề nghiệp phù hợp' },
        { label: 'Chứng Chỉ & Thành Tựu', path: '/certificates', description: 'Hồ sơ chứng chỉ năng lực được bảo chứng' },
        { label: 'Hồ Sơ Năng Lực Gốc', path: '/my-profile', description: 'Master Profile đồng bộ ngược tự động' },
      ],
    },
  ];
}

/**
 * Tính toán số lượng thông báo phỏng vấn đang chờ xử lý từ pipeline
 */
export function getPendingInterviewNotificationCount(pipeline: CandidatePipelineItem[] | null | undefined): number {
  if (!Array.isArray(pipeline)) return 0;
  return pipeline.filter(item => item && (item.stage === 'interview' || Boolean(item.interview_date)) && item.interview_status !== 'confirmed').length;
}
