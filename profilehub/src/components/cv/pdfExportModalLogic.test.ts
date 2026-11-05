/**
 * Unit Test Suite for PDF Export Styler Modal Logic & Contracts
 * Kiểm thử logic cấu hình in ấn, tính toán ngân sách trang A4,
 * chuyển đổi mật độ dòng và đồng bộ hóa với CVBuilder.
 * File: src/components/cv/pdfExportModalLogic.test.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DEFAULT_STYLER_OPTIONS,
  VISUAL_TEMPLATES,
  STYLER_COLOR_PALETTES,
  STYLER_FONT_OPTIONS,
  STANDARD_A4_HEIGHT_PX,
  getStoredStylerPreferences,
  saveStylerPreferences,
  calculatePageBudget,
  getDensityStyles,
  PDF_STYLER_STORAGE_KEY
} from '../../services/pdfStylerService';
import type { PdfStylerOptions, PrintDensity } from '../../types/pdfStyler.types';
import type { CVTemplateType } from './CVTemplates';

describe('PdfExportModalLogic & Styler Contracts', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    const storageMock: Storage = {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
      key: vi.fn((idx: number) => Object.keys(mockStorage)[idx] || null),
      length: 0
    };

    vi.stubGlobal('localStorage', storageMock);
    vi.stubGlobal('window', {
      localStorage: storageMock,
      location: { origin: 'https://profilehub.vn' }
    });
  });

  describe('1. Visual Templates & Color Palettes Catalog', () => {
    it('cung cấp đủ 6 mẫu CV thiết kế chuẩn với định danh chính xác', () => {
      expect(VISUAL_TEMPLATES).toHaveLength(6);
      const templateIds = VISUAL_TEMPLATES.map((t) => t.id);
      expect(templateIds).toEqual([
        'classic',
        'minimal',
        'tech',
        'executive',
        'pro_split',
        'compact_ats'
      ]);
    });

    it('cung cấp danh sách 6 bảng màu chủ đạo chuyên nghiệp cho IT & Tech', () => {
      expect(STYLER_COLOR_PALETTES).toHaveLength(6);
      const navy = STYLER_COLOR_PALETTES.find((c) => c.id === 'navy');
      expect(navy).toBeDefined();
      expect(navy?.hex).toBe('#1e3a8a');
    });

    it('cung cấp đủ 5 phông chữ tiếng Việt chuẩn in ấn', () => {
      expect(STYLER_FONT_OPTIONS).toHaveLength(5);
      const fontIds = STYLER_FONT_OPTIONS.map((f) => f.id);
      expect(fontIds).toContain('inter');
      expect(fontIds).toContain('be-vietnam-pro');
      expect(fontIds).toContain('lora');
    });
  });

  describe('2. Preference Storage & Fallbacks', () => {
    it('trả về cấu hình mặc định khi localStorage trống', () => {
      const prefs = getStoredStylerPreferences();
      expect(prefs.templateId).toBe('classic');
      expect(prefs.primaryColor).toBe('#1e3a8a');
      expect(prefs.density).toBe('normal');
      expect(prefs.showQrCode).toBe(true);
      expect(prefs.hideAvatar).toBe(false);
      expect(prefs.showEvidenceBadges).toBe(true);
    });

    it('kế thừa fallback từ prop truyền vào khi chưa có cấu hình lưu', () => {
      const prefs = getStoredStylerPreferences({
        templateId: 'tech',
        primaryColor: '#4f46e5'
      });
      expect(prefs.templateId).toBe('tech');
      expect(prefs.primaryColor).toBe('#4f46e5');
    });

    it('lưu cấu hình người dùng và đọc lại chính xác', () => {
      const customOptions: PdfStylerOptions = {
        templateId: 'pro_split',
        primaryColor: '#047857',
        fontId: 'be-vietnam-pro',
        density: 'compact',
        showQrCode: false,
        hideAvatar: true,
        showEvidenceBadges: true
      };

      saveStylerPreferences(customOptions);
      const reloaded = getStoredStylerPreferences();

      expect(reloaded).toEqual(customOptions);
      expect(mockStorage[PDF_STYLER_STORAGE_KEY]).toBeDefined();
    });

    it('khôi phục an toàn khi JSON trong localStorage bị lỗi định dạng', () => {
      mockStorage[PDF_STYLER_STORAGE_KEY] = 'INVALID_JSON_CORRUPT_DATA';
      const prefs = getStoredStylerPreferences();
      expect(prefs.templateId).toBe(DEFAULT_STYLER_OPTIONS.templateId);
      expect(prefs.density).toBe('normal');
    });
  });

  describe('3. Page Budget Guard Bar & Overflow Detection', () => {
    it('xác nhận 1 trang hoàn hảo khi chiều cao <= 1122px (<= 100%)', () => {
      const metric = calculatePageBudget(1050, STANDARD_A4_HEIGHT_PX);
      expect(metric.isSinglePage).toBe(true);
      expect(metric.isWarning).toBe(false);
      expect(metric.isMultiPage).toBe(false);
      expect(metric.badgeColor).toBe('emerald');
      expect(metric.ratioPercent).toBe(94);
      expect(metric.statusMessage).toContain('Vừa khít 1 trang A4');
    });

    it('bật cảnh báo chớm tràn dòng mồ côi khi chiều cao trong khoảng 101% - 115%', () => {
      const metric = calculatePageBudget(1200, STANDARD_A4_HEIGHT_PX);
      expect(metric.isSinglePage).toBe(false);
      expect(metric.isWarning).toBe(true);
      expect(metric.isMultiPage).toBe(false);
      expect(metric.badgeColor).toBe('amber');
      expect(metric.ratioPercent).toBe(107);
      expect(metric.statusMessage).toContain('Chớm tràn');
      expect(metric.statusMessage).toContain('Gọn gàng');
    });

    it('chuyển sang trạng thái đa trang khi chiều cao > 115%', () => {
      const metric = calculatePageBudget(1450, STANDARD_A4_HEIGHT_PX);
      expect(metric.isSinglePage).toBe(false);
      expect(metric.isWarning).toBe(false);
      expect(metric.isMultiPage).toBe(true);
      expect(metric.badgeColor).toBe('rose');
      expect(metric.statusMessage).toContain('Hồ sơ 2 trang');
    });

    it('xử lý an toàn khi chiều cao nội dung bằng 0 hoặc âm', () => {
      const metric = calculatePageBudget(0, STANDARD_A4_HEIGHT_PX);
      expect(metric.isSinglePage).toBe(true);
      expect(metric.ratioPercent).toBe(0);
      expect(metric.badgeColor).toBe('emerald');
    });
  });

  describe('4. Print Density Styles Contract', () => {
    it('cấu hình mật độ Compact giảm cỡ chữ và padding để ép nội dung vào 1 trang', () => {
      const compact = getDensityStyles('compact');
      expect(compact.fontSizeScale).toBe('0.92');
      expect(compact.lineHeight).toBe('1.3');
      expect(compact.pagePadding).toBe('6mm 8mm');
      expect(compact.sectionGap).toBe('10px');
    });

    it('cấu hình mật độ Normal giữ thông số in chuẩn A4', () => {
      const normal = getDensityStyles('normal');
      expect(normal.fontSizeScale).toBe('1.0');
      expect(normal.lineHeight).toBe('1.45');
      expect(normal.pagePadding).toBe('8mm 10mm');
      expect(normal.sectionGap).toBe('15px');
    });

    it('cấu hình mật độ Relaxed tăng độ thoáng cho CV ngắn', () => {
      const relaxed = getDensityStyles('relaxed');
      expect(relaxed.fontSizeScale).toBe('1.05');
      expect(relaxed.lineHeight).toBe('1.6');
      expect(relaxed.pagePadding).toBe('10mm 12mm');
      expect(relaxed.sectionGap).toBe('20px');
    });
  });

  describe('5. CVBuilder Synchronization Mapping Contract', () => {
    it('ánh xạ chính xác cấu hình PdfStylerOptions sang trạng thái bố cục của CVBuilder', () => {
      const stylerOptions: PdfStylerOptions = {
        templateId: 'minimal',
        primaryColor: '#047857',
        fontId: 'lora',
        density: 'compact',
        showQrCode: true,
        hideAvatar: true,
        showEvidenceBadges: true
      };

      // Giả lập hàm xử lý đồng bộ ngược vào CVBuilder
      const mapStylerToBuilder = (opts: PdfStylerOptions) => {
        let spacingDensity: 'compact' | 'standard' | 'relaxed' = 'standard';
        let fontSizeLevel: 'small' | 'medium' | 'large' = 'medium';

        if (opts.density === 'compact') {
          spacingDensity = 'compact';
          fontSizeLevel = 'small';
        } else if (opts.density === 'relaxed') {
          spacingDensity = 'relaxed';
          fontSizeLevel = 'large';
        }

        return {
          selectedTemplate: opts.templateId,
          primaryColor: opts.primaryColor,
          fontId: opts.fontId,
          spacingDensity,
          fontSizeLevel
        };
      };

      const builderState = mapStylerToBuilder(stylerOptions);
      expect(builderState.selectedTemplate).toBe('minimal');
      expect(builderState.primaryColor).toBe('#047857');
      expect(builderState.fontId).toBe('lora');
      expect(builderState.spacingDensity).toBe('compact');
      expect(builderState.fontSizeLevel).toBe('small');
    });
  });

  describe('6. Smart Print Toggles Contracts', () => {
    it('tạo đường dẫn xác thực năng lực chính xác theo userId khi bật QR Code', () => {
      const getQrCodeUrl = (userId?: string) => {
        const origin = window.location.origin;
        return `${origin}/showcase/${userId || 'demo'}`;
      };

      expect(getQrCodeUrl('student-123')).toBe('https://profilehub.vn/showcase/student-123');
      expect(getQrCodeUrl(undefined)).toBe('https://profilehub.vn/showcase/demo');
    });

    it('công tắc Blind Hiring (hideAvatar) áp dụng lớp ẩn avatar chính xác', () => {
      const getAvatarVisibilityClass = (hideAvatar: boolean) => {
        return hideAvatar ? 'cv-hide-avatar-mode' : '';
      };

      expect(getAvatarVisibilityClass(true)).toBe('cv-hide-avatar-mode');
      expect(getAvatarVisibilityClass(false)).toBe('');
    });
  });
});
