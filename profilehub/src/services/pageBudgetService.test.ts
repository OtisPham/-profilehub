import { describe, it, expect } from 'vitest';
import { pageBudgetService } from './pageBudgetService';
import type { CVSection } from '../types/cvSection';

describe('Ticket 05 (Page-Budget Guard & Auto-Condense Seam)', () => {
  const mockSections: CVSection[] = [
    {
      id: 'sec_obj',
      type: 'objective',
      title: 'Mục Tiêu',
      order_index: 0,
      is_visible: true,
      content: 'Lập trình viên đam mê công nghệ phần mềm và hệ sinh thái React, TypeScript.',
      settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' }
    },
    {
      id: 'sec_proj',
      type: 'projects',
      title: 'Dự Án',
      order_index: 1,
      is_visible: true,
      settings: { showTitle: true, showDivider: true, spacing: 'normal', titleStyle: 'bold', titleCase: 'uppercase' },
      items: [
        {
          id: 'p1',
          projectName: 'Hệ thống Quản lý Bán hàng',
          role: 'Fullstack Dev',
          startDate: '2025',
          endDate: '2026',
          description: 'Trách nhiệm của em là đã hoàn thành việc xây dựng module giỏ hàng và thanh toán rất cẩn thận.',
          technologies: ['React', 'Node.js']
        }
      ]
    }
  ];

  it('TC-BUDGET-01: Tính toán chính xác tỷ lệ lấp đầy trang A4 (Page Budget)', () => {
    const metrics = pageBudgetService.calculatePageBudget(mockSections, { fullName: 'Nguyễn Văn A' }, 'standard');

    expect(metrics.usableSinglePageHeightPx).toBeGreaterThan(900);
    expect(metrics.firstPageFillPercent).toBeGreaterThan(0);
    expect(metrics.firstPageFillPercent).toBeLessThanOrEqual(100);
    expect(['optimal', 'warning', 'overflow']).toContain(metrics.status);
  });

  it('TC-BUDGET-02: 1-Click AI Auto-Condense rút gọn từ ngữ rườm rà nhưng bảo toàn 100% từ khóa công nghệ', () => {
    const { sections: condensedSections, charactersSaved } = pageBudgetService.autoCondenseCvContent(mockSections);

    expect(charactersSaved).toBeGreaterThan(0);
    const projSection = condensedSections.find(s => s.type === 'projects');
    const firstItem = (projSection?.items as any[])[0];

    // Từ ngữ rườm rà "Trách nhiệm của em là đã hoàn thành việc" bị rút ngắn
    expect(firstItem.description).not.toContain('Trách nhiệm của em là đã hoàn thành việc');
    // Từ khóa công nghệ cốt lõi và ý nghĩa phải được bảo toàn
    expect(firstItem.description).toContain('giỏ hàng');
    expect(firstItem.description).toContain('thanh toán');
  });

  it('TC-BUDGET-03: Chuyển đổi linh hoạt giữa mật độ giãn dòng (compact, standard, relaxed)', () => {
    const compactMetrics = pageBudgetService.calculatePageBudget(mockSections, {}, 'compact');
    const relaxedMetrics = pageBudgetService.calculatePageBudget(mockSections, {}, 'relaxed');

    // Mật độ compact phải tiêu tốn ít chiều cao hơn relaxed
    expect(compactMetrics.totalRenderHeightPx).toBeLessThan(relaxedMetrics.totalRenderHeightPx);
  });
});
