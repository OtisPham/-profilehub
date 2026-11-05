/**
 * Các biến thể của huy hiệu đồ án thông minh
 * - 'full': Đồ án xuất sắc vừa có mã nguồn xác thực vừa có link demo chạy thật
 * - 'demo-ready': Đồ án có link chạy thật (Vercel, Netlify, Render...) sẵn sàng trải nghiệm
 * - 'verified': Đồ án có mã nguồn bảo mật/chữ ký số/giảng viên chứng nhận (nhưng không có live web demo)
 * - 'none': Không hiển thị huy hiệu
 */
export type ProjectBadgeVariant = 'full' | 'demo-ready' | 'verified' | 'none';

/**
 * Cấu hình hiển thị trực quan chuẩn hóa cho từng biến thể huy hiệu
 */
export interface BadgeVisualConfig {
  variant: ProjectBadgeVariant;
  label: string;
  tooltip: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconType: 'sparkles' | 'rocket' | 'shield';
}

/**
 * Thuộc tính của component VerifiedBadge (Hỗ trợ tương thích ngược đầy đủ)
 */
export interface VerifiedBadgeProps {
  variant?: ProjectBadgeVariant;
  demoUrl?: string;
  evidenceName?: string;
  verifiedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean; // Cho phép click mở link demo ngay trên badge
  className?: string;
}

/**
 * Dữ liệu đầu vào tối thiểu để hàm đánh giá xác định biến thể huy hiệu
 */
export interface ProjectBadgeEvaluationInput {
  id?: string;
  title?: string;
  is_verified?: boolean;
  verification_status?: string;
  demo_url?: string;
}

/**
 * Thống kê tổng hợp số lượng đồ án theo từng loại huy hiệu của một ứng viên
 */
export interface CandidateBadgeSummary {
  demoReadyCount: number; // Tổng số đồ án có demo chạy thật (bao gồm cả 'demo-ready' và 'full')
  verifiedCount: number;  // Tổng số đồ án có bảo chứng mã nguồn (bao gồm cả 'verified' và 'full')
  fullCount: number;      // Số đồ án đạt cả 2 tiêu chí
  totalCount: number;     // Tổng số đồ án có ít nhất 1 loại huy hiệu
}
