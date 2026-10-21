/**
 * Page-Budget Guard & Auto-Condense Service
 * Đo lường dung lượng trang in ấn A4, cảnh báo tràn trang và hỗ trợ 1-Click Auto-Condense
 */

import type { CVSection, CVSectionType, ProjectItem } from '../types/cvSection';

export interface PageBudgetMetrics {
  totalRenderHeightPx: number;
  usableSinglePageHeightPx: number;
  pageCount: number;
  firstPageFillPercent: number; // 0 - 100+ %
  status: 'optimal' | 'warning' | 'overflow';
  statusText: string;
}

export const pageBudgetService = {
  /**
   * Tính toán tỷ lệ lấp đầy trang A4 dựa trên cấu trúc các mục và mật độ hiển thị
   */
  calculatePageBudget(
    sections: CVSection[],
    _personalInfo: any,
    spacingDensity: 'compact' | 'standard' | 'relaxed' = 'standard'
  ): PageBudgetMetrics {
    const A4_HEIGHT_PX = 1122.5;
    const paddingV = spacingDensity === 'compact' ? 52 : spacingDensity === 'relaxed' ? 106 : 80;
    const usableHeight = A4_HEIGHT_PX - paddingV - 20;

    // Header height estimate
    let totalHeight = spacingDensity === 'compact' ? 110 : spacingDensity === 'relaxed' ? 150 : 130;

    const visibleSections = (sections || []).filter(s => s.is_visible);

    visibleSections.forEach(sec => {
      // Section header height
      totalHeight += spacingDensity === 'compact' ? 26 : spacingDensity === 'relaxed' ? 36 : 30;

      if (sec.type === 'objective') {
        const lines = (sec.content || '').split('\n').length;
        const lineH = spacingDensity === 'compact' ? 16 : spacingDensity === 'relaxed' ? 22 : 18;
        totalHeight += Math.max(1, lines) * lineH + 10;
      } else if (sec.items && Array.isArray(sec.items)) {
        sec.items.forEach((item: any) => {
          totalHeight += this.estimateItemHeight(item, sec.type, spacingDensity);
        });
      }
    });

    const fillRatio = totalHeight / usableHeight;
    const firstPageFillPercent = Math.min(200, Math.round(fillRatio * 100));
    const pageCount = Math.max(1, Math.ceil(totalHeight / usableHeight));

    let status: 'optimal' | 'warning' | 'overflow' = 'optimal';
    let statusText = `${firstPageFillPercent}% Trang 1`;

    if (firstPageFillPercent <= 90) {
      status = 'optimal';
      statusText = `${firstPageFillPercent}% A4 — Cực chuẩn 1 trang`;
    } else if (firstPageFillPercent <= 100) {
      status = 'warning';
      statusText = `${firstPageFillPercent}% A4 — Gần đầy trang 1`;
    } else {
      status = 'overflow';
      statusText = `${firstPageFillPercent}% — Tràn sang trang ${pageCount}`;
    }

    return {
      totalRenderHeightPx: Math.round(totalHeight),
      usableSinglePageHeightPx: Math.round(usableHeight),
      pageCount,
      firstPageFillPercent,
      status,
      statusText
    };
  },

  /**
   * Ước lượng chiều cao của 1 mục con
   */
  estimateItemHeight(item: any, type: CVSectionType, density: 'compact' | 'standard' | 'relaxed'): number {
    const factor = density === 'compact' ? 0.85 : density === 'relaxed' ? 1.2 : 1.0;

    if (type === 'projects') {
      const descLen = (item.description || '').length;
      return Math.round((56 + Math.ceil(descLen / 70) * 16) * factor);
    }
    if (type === 'work_experience' || type === 'education') {
      const descLen = (item.description || '').length;
      return Math.round((50 + Math.ceil(descLen / 75) * 16) * factor);
    }
    if (type === 'skills') {
      const skillCount = (item.skills || []).length;
      return Math.round((30 + Math.ceil(skillCount / 3) * 20) * factor);
    }
    return Math.round(44 * factor);
  },

  /**
   * 1-Click AI Auto-Condense: Tự động loại bỏ từ ngữ rườm rà, bảo toàn 100% từ khóa và số liệu
   */
  autoCondenseCvContent(sections: CVSection[]): { sections: CVSection[]; charactersSaved: number } {
    let charactersSaved = 0;

    // Common Vietnamese wordy phrases and redundancies
    const fillerPatterns: [RegExp, string][] = [
      [/trách nhiệm của em là đã hoàn thành việc\s+/gi, ''],
      [/trách nhiệm của em là\s+/gi, ''],
      [/được giao nhiệm vụ\s+/gi, ''],
      [/đã hoàn thành việc\s+/gi, ''],
      [/có tham gia vào quá trình\s+/gi, 'Tham gia '],
      [/chịu trách nhiệm thực hiện\s+/gi, 'Thực hiện '],
      [/rất cẩn thận/gi, ''],
      [/rất chi tiết/gi, '']
    ];

    const condenseString = (str: string): string => {
      if (!str) return str;
      let res = str;
      fillerPatterns.forEach(([pattern, replacement]) => {
        const before = res.length;
        res = res.replace(pattern, replacement);
        charactersSaved += (before - res.length);
      });
      return res.trim();
    };

    const newSections: CVSection[] = sections.map(sec => {
      if (sec.type === 'objective' && sec.content) {
        return {
          ...sec,
          content: condenseString(sec.content)
        };
      }

      if (sec.type === 'projects' && sec.items) {
        const updatedItems = (sec.items as ProjectItem[]).map(item => ({
          ...item,
          description: condenseString(item.description),
          bullets: item.bullets ? item.bullets.map(b => condenseString(b)) : undefined
        }));
        return {
          ...sec,
          items: updatedItems
        };
      }

      return sec;
    });

    return {
      sections: newSections,
      charactersSaved
    };
  }
};
