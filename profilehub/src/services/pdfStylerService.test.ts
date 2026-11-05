/**
 * Unit tests for pdfStylerService
 * File: src/services/pdfStylerService.test.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStoredStylerPreferences,
  saveStylerPreferences,
  calculatePageBudget,
  getDensityStyles,
  DEFAULT_STYLER_OPTIONS,
  VISUAL_TEMPLATES,
  STYLER_COLOR_PALETTES,
  STYLER_FONT_OPTIONS,
  PDF_STYLER_STORAGE_KEY,
  STANDARD_A4_HEIGHT_PX
} from './pdfStylerService';
import type { PdfStylerOptions } from '../types/pdfStyler.types';

// Mock localStorage
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const mockStorage = new MockLocalStorage();
vi.stubGlobal('localStorage', mockStorage);
vi.stubGlobal('window', { localStorage: mockStorage });

describe('pdfStylerService', () => {
  beforeEach(() => {
    mockStorage.clear();
    vi.restoreAllMocks();
  });

  it('1. Trả về cấu hình mặc định DEFAULT_STYLER_OPTIONS khi LocalStorage trống', () => {
    const prefs = getStoredStylerPreferences();
    expect(prefs).toEqual(DEFAULT_STYLER_OPTIONS);
    expect(prefs.templateId).toBe('classic');
    expect(prefs.primaryColor).toBe('#1e3a8a');
    expect(prefs.density).toBe('normal');
    expect(prefs.showQrCode).toBe(true);
    expect(prefs.hideAvatar).toBe(false);
  });

  it('2. Lưu tùy chọn in ấn vào LocalStorage và đọc lại chuẩn xác', () => {
    const customOptions: PdfStylerOptions = {
      templateId: 'minimal',
      primaryColor: '#047857',
      fontId: 'lora',
      density: 'compact',
      showQrCode: false,
      hideAvatar: true,
      showEvidenceBadges: true
    };

    saveStylerPreferences(customOptions);

    const storedRaw = mockStorage.getItem(PDF_STYLER_STORAGE_KEY);
    expect(storedRaw).toBeTruthy();

    const retrieved = getStoredStylerPreferences();
    expect(retrieved.templateId).toBe('minimal');
    expect(retrieved.primaryColor).toBe('#047857');
    expect(retrieved.fontId).toBe('lora');
    expect(retrieved.density).toBe('compact');
    expect(retrieved.showQrCode).toBe(false);
    expect(retrieved.hideAvatar).toBe(true);
  });

  it('3. Kế thừa fallbackDefaults nếu LocalStorage chưa có', () => {
    const prefs = getStoredStylerPreferences({
      templateId: 'tech',
      primaryColor: '#4f46e5'
    });
    expect(prefs.templateId).toBe('tech');
    expect(prefs.primaryColor).toBe('#4f46e5');
    expect(prefs.density).toBe('normal');
  });

  it('4. calculatePageBudget nhận diện chính xác 1 trang A4 hoàn hảo (<= 100%)', () => {
    const metric = calculatePageBudget(1050, STANDARD_A4_HEIGHT_PX);
    expect(metric.isSinglePage).toBe(true);
    expect(metric.isWarning).toBe(false);
    expect(metric.isMultiPage).toBe(false);
    expect(metric.badgeColor).toBe('emerald');
    expect(metric.statusMessage).toContain('Vừa khít 1 trang A4');
  });

  it('5. calculatePageBudget cảnh báo chớm tràn 1-2 dòng khi chiều cao từ 101% - 115%', () => {
    // 1122 * 1.08 = ~1211px
    const metric = calculatePageBudget(1211, STANDARD_A4_HEIGHT_PX);
    expect(metric.isSinglePage).toBe(false);
    expect(metric.isWarning).toBe(true);
    expect(metric.isMultiPage).toBe(false);
    expect(metric.badgeColor).toBe('amber');
    expect(metric.statusMessage).toContain('Gợi ý: Chọn mật độ "Gọn gàng"');
  });

  it('6. calculatePageBudget phân loại hồ sơ 2 trang khi chiều cao > 115%', () => {
    // 1122 * 1.4 = ~1570px
    const metric = calculatePageBudget(1570, STANDARD_A4_HEIGHT_PX);
    expect(metric.isSinglePage).toBe(false);
    expect(metric.isWarning).toBe(false);
    expect(metric.isMultiPage).toBe(true);
    expect(metric.badgeColor).toBe('rose');
    expect(metric.statusMessage).toContain('Hồ sơ 2 trang');
  });

  it('7. getDensityStyles cung cấp cỡ chữ và khoảng cách tương ứng từng mật độ', () => {
    const compactStyles = getDensityStyles('compact');
    expect(compactStyles.fontSizeScale).toBe('0.92');
    expect(compactStyles.pagePadding).toBe('6mm 8mm');

    const normalStyles = getDensityStyles('normal');
    expect(normalStyles.fontSizeScale).toBe('1.0');
    expect(normalStyles.pagePadding).toBe('8mm 10mm');

    const relaxedStyles = getDensityStyles('relaxed');
    expect(relaxedStyles.fontSizeScale).toBe('1.05');
    expect(relaxedStyles.pagePadding).toBe('10mm 12mm');
  });

  it('8. VISUAL_TEMPLATES chứa đầy đủ 6 mẫu CV độc nhất', () => {
    expect(VISUAL_TEMPLATES.length).toBe(6);
    const ids = VISUAL_TEMPLATES.map(t => t.id);
    expect(ids).toContain('classic');
    expect(ids).toContain('minimal');
    expect(ids).toContain('tech');
    expect(ids).toContain('executive');
    expect(ids).toContain('pro_split');
    expect(ids).toContain('compact_ats');
  });

  it('9. STYLER_COLOR_PALETTES và STYLER_FONT_OPTIONS có dữ liệu hợp lệ', () => {
    expect(STYLER_COLOR_PALETTES.length).toBeGreaterThanOrEqual(5);
    STYLER_COLOR_PALETTES.forEach(c => {
      expect(c.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    expect(STYLER_FONT_OPTIONS.length).toBeGreaterThanOrEqual(4);
    STYLER_FONT_OPTIONS.forEach(f => {
      expect(f.fontFamily).toBeTruthy();
    });
  });
});
