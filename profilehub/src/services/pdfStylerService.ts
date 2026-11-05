/**
 * Multi-Theme PDF Styler & Professional Resume Export Service
 * Quản trị cấu hình in ấn, tính toán ngân sách trang in A4 và cung cấp lớp kiểu dáng mật độ dòng.
 * File: src/services/pdfStylerService.ts
 */

import type {
  PrintDensity,
  FontId,
  FontOptionItem,
  ColorPaletteItem,
  VisualTemplateItem,
  PdfStylerOptions,
  PageBudgetMetric
} from '../types/pdfStyler.types';
import type { CVTemplateType } from '../components/cv/CVTemplates';

export const PDF_STYLER_STORAGE_KEY = 'profilehub_pdf_styler_prefs_v1';

/**
 * Cấu hình mặc định an toàn cho trình xuất PDF
 */
export const DEFAULT_STYLER_OPTIONS: PdfStylerOptions = {
  templateId: 'classic',
  primaryColor: '#1e3a8a',
  fontId: 'inter',
  density: 'normal',
  showQrCode: true,
  hideAvatar: false,
  showEvidenceBadges: true
};

/**
 * Danh mục 6 mẫu template CV với hình ảnh minh họa và nhãn phong cách
 */
export const VISUAL_TEMPLATES: VisualTemplateItem[] = [
  {
    id: 'classic',
    name: 'Modern Top-Banner',
    subtitle: 'TopCV Pro Style',
    desc: 'Khối header màu trải ngang, thân 2 cột bất đối xứng cân bằng hoàn hảo',
    badge: 'Phổ biến nhất',
    badgeColor: 'blue',
    layoutType: 'top_banner'
  },
  {
    id: 'minimal',
    name: 'Minimalist Harvard',
    subtitle: 'Ivy League Academic',
    desc: '1 cột tối giản học thuật, font Lora Serif, đường kẻ ngang hairline 0.5px thanh lịch',
    badge: 'Học thuật & Đa quốc gia',
    badgeColor: 'amber',
    layoutType: '1_column'
  },
  {
    id: 'tech',
    name: 'Tech Developer Terminal',
    subtitle: 'Bento Grid & Git Stack',
    desc: 'Dành riêng cho Lập trình viên với Bento Card, tag công nghệ và liên kết Demo',
    badge: 'IT & Software Engineer',
    badgeColor: 'purple',
    layoutType: '2_column_split'
  },
  {
    id: 'executive',
    name: 'Timeline Milestone',
    subtitle: 'Chuyên gia & Quản lý',
    desc: 'Trục thời gian kẻ dọc nối các mốc dự án, rõ ràng và mạch lạc',
    badge: 'Kinh nghiệm dày dặn',
    badgeColor: 'slate',
    layoutType: 'timeline'
  },
  {
    id: 'pro_split',
    name: 'Left Solid Sidebar',
    subtitle: 'European Clean Split',
    desc: 'Cột trái nền đặc màu Châu Âu, cột phải nền trắng tinh tế',
    badge: 'Châu Âu & Hiện đại',
    badgeColor: 'indigo',
    layoutType: '2_column_split'
  },
  {
    id: 'compact_ats',
    name: 'Compact 1-Page ATS',
    subtitle: 'ATS Machine Scanner',
    desc: 'Tối ưu 100% cho thuật toán lọc CV tự động, độ tương phản cao, kỹ năng 50-50',
    badge: 'Chuẩn ATS 100%',
    badgeColor: 'emerald',
    layoutType: '1_column'
  }
];

/**
 * Bảng màu chủ đạo tuyển chọn cho ngành công nghệ
 */
export const STYLER_COLOR_PALETTES: ColorPaletteItem[] = [
  { id: 'navy', name: 'Tech Navy', hex: '#1e3a8a', badgeLabel: 'Chuyên nghiệp' },
  { id: 'indigo', name: 'Tech Indigo', hex: '#4f46e5', badgeLabel: 'Công nghệ cao' },
  { id: 'emerald', name: 'Emerald Green', hex: '#047857', badgeLabel: 'Tươi mới' },
  { id: 'charcoal', name: 'Charcoal Slate', hex: '#334155', badgeLabel: 'Tối giản sang trọng' },
  { id: 'dark_terminal', name: 'Dark Terminal', hex: '#0f172a', badgeLabel: 'Hacker Dev' },
  { id: 'ruby', name: 'Ruby Wine', hex: '#991b1b', badgeLabel: 'Quyết đoán' }
];

/**
 * Bộ phông chữ chuẩn in ấn và hiển thị tiếng Việt
 */
export const STYLER_FONT_OPTIONS: FontOptionItem[] = [
  { id: 'be-vietnam-pro', name: 'Be Vietnam Pro', desc: 'Chuẩn Tiếng Việt 100%', fontFamily: "'Be Vietnam Pro', sans-serif" },
  { id: 'inter', name: 'Inter', desc: 'Hiện đại & Sắc nét', fontFamily: "'Inter', sans-serif" },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', desc: 'Năng động & Trẻ trung', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  { id: 'lora', name: 'Lora (Serif)', desc: 'Học thuật & Cổ điển', fontFamily: "'Lora', serif" },
  { id: 'roboto', name: 'Roboto', desc: 'Tiêu chuẩn Google', fontFamily: "'Roboto', sans-serif" }
];

/**
 * Helper lấy Storage an toàn trong môi trường Web & Node/Test
 */
function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  return null;
}

/**
 * Đọc cấu hình in ấn từ LocalStorage với fallback an toàn
 */
export function getStoredStylerPreferences(fallbackDefaults?: Partial<PdfStylerOptions>): PdfStylerOptions {
  try {
    const storage = getStorage();
    if (!storage) {
      return { ...DEFAULT_STYLER_OPTIONS, ...fallbackDefaults };
    }

    const raw = storage.getItem(PDF_STYLER_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STYLER_OPTIONS, ...fallbackDefaults };
    }

    const parsed = JSON.parse(raw);
    return {
      templateId: parsed.templateId || fallbackDefaults?.templateId || DEFAULT_STYLER_OPTIONS.templateId,
      primaryColor: parsed.primaryColor || fallbackDefaults?.primaryColor || DEFAULT_STYLER_OPTIONS.primaryColor,
      fontId: parsed.fontId || fallbackDefaults?.fontId || DEFAULT_STYLER_OPTIONS.fontId,
      density: parsed.density || fallbackDefaults?.density || DEFAULT_STYLER_OPTIONS.density,
      showQrCode: typeof parsed.showQrCode === 'boolean' ? parsed.showQrCode : DEFAULT_STYLER_OPTIONS.showQrCode,
      hideAvatar: typeof parsed.hideAvatar === 'boolean' ? parsed.hideAvatar : DEFAULT_STYLER_OPTIONS.hideAvatar,
      showEvidenceBadges: typeof parsed.showEvidenceBadges === 'boolean' ? parsed.showEvidenceBadges : DEFAULT_STYLER_OPTIONS.showEvidenceBadges
    };
  } catch (e) {
    console.warn('Lỗi khi đọc cấu hình PDF Styler từ LocalStorage:', e);
    return { ...DEFAULT_STYLER_OPTIONS, ...fallbackDefaults };
  }
}

/**
 * Lưu cấu hình in ấn vào LocalStorage
 */
export function saveStylerPreferences(options: PdfStylerOptions): void {
  try {
    const storage = getStorage();
    if (storage) {
      storage.setItem(PDF_STYLER_STORAGE_KEY, JSON.stringify(options));
    }
  } catch (e) {
    console.warn('Lỗi khi lưu cấu hình PDF Styler vào LocalStorage:', e);
  }
}

/**
 * Chiều cao chuẩn của một trang A4 tính theo pixel ở 96 DPI (297mm * 96 / 25.4 ≈ 1122.5px)
 */
export const STANDARD_A4_HEIGHT_PX = 1122;

/**
 * Tính toán ngân sách trang A4 dựa trên chiều cao thực tế của nội dung
 */
export function calculatePageBudget(
  contentHeightPx: number,
  a4BaseHeightPx: number = STANDARD_A4_HEIGHT_PX
): PageBudgetMetric {
  if (contentHeightPx <= 0) {
    return {
      ratioPercent: 0,
      isSinglePage: true,
      isWarning: false,
      isMultiPage: false,
      statusMessage: '🟢 Chưa có nội dung',
      badgeColor: 'emerald'
    };
  }

  const ratioPercent = Math.round((contentHeightPx / a4BaseHeightPx) * 100);

  if (ratioPercent <= 100) {
    return {
      ratioPercent,
      isSinglePage: true,
      isWarning: false,
      isMultiPage: false,
      statusMessage: `🟢 Vừa khít 1 trang A4 hoàn hảo (${ratioPercent}%)`,
      badgeColor: 'emerald'
    };
  }

  if (ratioPercent <= 115) {
    return {
      ratioPercent,
      isSinglePage: false,
      isWarning: true,
      isMultiPage: false,
      statusMessage: `🟡 Chớm tràn 1-2 dòng sang trang 2 (${ratioPercent}%). Gợi ý: Chọn mật độ "Gọn gàng" để vừa trọn 1 trang!`,
      badgeColor: 'amber'
    };
  }

  return {
    ratioPercent,
    isSinglePage: false,
    isWarning: false,
    isMultiPage: true,
    statusMessage: `🔴 Hồ sơ 2 trang (${ratioPercent}%). Nội dung đầy đặn, chia đều 2 trang in.`,
    badgeColor: 'rose'
  };
}

/**
 * Cung cấp thông số CSS tùy chỉnh khoảng cách và cỡ chữ theo mật độ in ấn
 */
export function getDensityStyles(density: PrintDensity): {
  fontSizeScale: string;
  lineHeight: string;
  sectionGap: string;
  itemGap: string;
  pagePadding: string;
} {
  switch (density) {
    case 'compact':
      return {
        fontSizeScale: '0.92',
        lineHeight: '1.3',
        sectionGap: '10px',
        itemGap: '6px',
        pagePadding: '6mm 8mm'
      };
    case 'relaxed':
      return {
        fontSizeScale: '1.05',
        lineHeight: '1.6',
        sectionGap: '20px',
        itemGap: '12px',
        pagePadding: '10mm 12mm'
      };
    case 'normal':
    default:
      return {
        fontSizeScale: '1.0',
        lineHeight: '1.45',
        sectionGap: '15px',
        itemGap: '9px',
        pagePadding: '8mm 10mm'
      };
  }
}

export const pdfStylerService = {
  getStoredStylerPreferences,
  saveStylerPreferences,
  calculatePageBudget,
  getDensityStyles,
  VISUAL_TEMPLATES,
  STYLER_COLOR_PALETTES,
  STYLER_FONT_OPTIONS,
  DEFAULT_STYLER_OPTIONS,
  STANDARD_A4_HEIGHT_PX
};
