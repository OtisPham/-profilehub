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

  // Mặc định cho Student / Guest - Chỉ giữ các lối tắt thực sự hữu dụng và hoàn chỉnh (Fix.md BUG-01)
  return [
    { label: 'Quản Lý CV', path: '/cv-management' },
    { label: 'Kho Đồ Án', path: '/my-projects' },
  ];
}

/**
 * Tính toán số lượng thông báo phỏng vấn đang chờ xử lý từ pipeline
 */
export function getPendingInterviewNotificationCount(pipeline: CandidatePipelineItem[] | null | undefined): number {
  if (!Array.isArray(pipeline)) return 0;
  return pipeline.filter(item => item && (item.stage === 'interview' || Boolean(item.interview_date)) && item.interview_status !== 'confirmed').length;
}
