import {
  ProjectBadgeVariant,
  BadgeVisualConfig,
  ProjectBadgeEvaluationInput,
  CandidateBadgeSummary
} from '../types/projectBadge.types';

export const projectBadgeService = {
  /**
   * Đánh giá biến thể huy hiệu phù hợp dựa trên link demo và trạng thái bảo chứng
   * @param project Đối tượng đồ án với demo_url, is_verified, verification_status
   */
  getProjectBadgeVariant(project?: ProjectBadgeEvaluationInput | null): ProjectBadgeVariant {
    if (!project) return 'none';

    // Đánh giá tính khả dụng của demo_url (loại bỏ chuỗi rỗng, chỉ có khoảng trắng, hoặc ký tự '#')
    const hasDemo = Boolean(
      project.demo_url &&
      typeof project.demo_url === 'string' &&
      project.demo_url.trim() !== '' &&
      project.demo_url.trim() !== '#'
    );

    // Đánh giá tính hợp lệ của bảo chứng mã nguồn
    const isVerified = project.is_verified === true || project.verification_status === 'verified';

    if (hasDemo && isVerified) {
      return 'full'; // ✨ Demo Ready & Verified
    }

    if (hasDemo) {
      return 'demo-ready'; // 🚀 Demo Ready
    }

    if (isVerified) {
      return 'verified'; // 🛡️ Verified Code
    }

    return 'none';
  },

  /**
   * Cung cấp cấu hình hiển thị trực quan (màu sắc, icon, tooltip) cho từng biến thể
   */
  getBadgeVisualConfig(variant: ProjectBadgeVariant): BadgeVisualConfig | null {
    switch (variant) {
      case 'full':
        return {
          variant: 'full',
          label: 'Demo Ready & Verified',
          tooltip: 'Đồ án xuất sắc: Mã nguồn đã xác thực & Sẵn sàng trải nghiệm demo trực tiếp',
          bgColor: '#ecfdf5',
          textColor: '#065f46',
          borderColor: '#6ee7b7',
          iconType: 'sparkles'
        };

      case 'demo-ready':
        return {
          variant: 'demo-ready',
          label: 'Demo Ready',
          tooltip: 'Sản phẩm có bản chạy thử trực tiếp. Bấm để trải nghiệm ngay!',
          bgColor: '#eff6ff',
          textColor: '#1d4ed8',
          borderColor: '#93c5fd',
          iconType: 'rocket'
        };

      case 'verified':
        return {
          variant: 'verified',
          label: 'Verified Code',
          tooltip: 'Đồ án đã được xác thực mã nguồn / chữ ký số / giảng viên phê duyệt',
          bgColor: '#faf5ff',
          textColor: '#7e22ce',
          borderColor: '#d8b4fe',
          iconType: 'shield'
        };

      case 'none':
      default:
        return null;
    }
  },

  /**
   * Thống kê tổng hợp số lượng đồ án theo từng loại huy hiệu của một ứng viên
   * @param projects Danh sách các đồ án của ứng viên
   */
  countCandidateProjectBadges(projects?: ProjectBadgeEvaluationInput[] | null): CandidateBadgeSummary {
    const summary: CandidateBadgeSummary = {
      demoReadyCount: 0,
      verifiedCount: 0,
      fullCount: 0,
      totalCount: 0
    };

    if (!Array.isArray(projects) || projects.length === 0) {
      return summary;
    }

    for (const proj of projects) {
      const variant = this.getProjectBadgeVariant(proj);

      if (variant !== 'none') {
        summary.totalCount += 1;
      }

      if (variant === 'full') {
        summary.fullCount += 1;
        summary.demoReadyCount += 1;
        summary.verifiedCount += 1;
      } else if (variant === 'demo-ready') {
        summary.demoReadyCount += 1;
      } else if (variant === 'verified') {
        summary.verifiedCount += 1;
      }
    }

    return summary;
  }
};

// Export tiện lợi các hàm độc lập nếu cần import trực tiếp
export const getProjectBadgeVariant = projectBadgeService.getProjectBadgeVariant.bind(projectBadgeService);
export const getBadgeVisualConfig = projectBadgeService.getBadgeVisualConfig.bind(projectBadgeService);
export const countCandidateProjectBadges = projectBadgeService.countCandidateProjectBadges.bind(projectBadgeService);
