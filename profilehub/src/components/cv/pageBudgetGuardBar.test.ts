import { describe, it, expect } from 'vitest';
import { pageBudgetService } from '../../services/pageBudgetService';
import type { CVSection } from '../../types/cvSection';

describe('PageBudgetGuardBar & Real-Time A4 Density Contracts (SDD Spec E)', () => {
  const defaultSettings = {
    showTitle: true,
    showDivider: true,
    spacing: 'compact' as const,
    titleStyle: 'bold' as const,
    titleCase: 'capitalize' as const
  };

  const mockSections: CVSection[] = [
    {
      id: 'sec-1',
      type: 'objective',
      title: 'Mục tiêu nghề nghiệp',
      content: 'Trách nhiệm của em là đã hoàn thành việc xây dựng hệ thống phần mềm rất chi tiết và rất cẩn thận.',
      order_index: 1,
      is_visible: true,
      settings: defaultSettings
    },
    {
      id: 'sec-2',
      type: 'projects',
      title: 'Dự án nổi bật',
      order_index: 2,
      is_visible: true,
      settings: defaultSettings,
      items: [
        {
          id: 'proj-1',
          name: 'Hệ thống Quản lý Bán hàng',
          role: 'Fullstack Developer',
          startDate: '2025-01',
          endDate: '2025-06',
          description: 'Trách nhiệm của em là xây dựng toàn bộ API backend với Node.js và giao diện React.',
          bullets: [
            'Được giao nhiệm vụ tối ưu hóa truy vấn MongoDB giảm thời gian phản hồi.',
            'Có tham gia vào quá trình thiết kế UI/UX theo chuẩn responsive.'
          ]
        }
      ]
    }
  ];

  it('TC-BUDGET-01: Đo lường chính xác dung lượng trang A4 ở các mật độ khác nhau', () => {
    const compactMetrics = pageBudgetService.calculatePageBudget(mockSections, {}, 'compact');
    const standardMetrics = pageBudgetService.calculatePageBudget(mockSections, {}, 'standard');
    const relaxedMetrics = pageBudgetService.calculatePageBudget(mockSections, {}, 'relaxed');

    // Chế độ thu gọn (compact) phải có tổng chiều cao render nhỏ hơn tiêu chuẩn và thoáng
    expect(compactMetrics.totalRenderHeightPx).toBeLessThan(standardMetrics.totalRenderHeightPx);
    expect(standardMetrics.totalRenderHeightPx).toBeLessThan(relaxedMetrics.totalRenderHeightPx);

    // Mật độ hợp lý cho 1 trang mẫu phải đạt trạng thái optimal hoặc warning
    expect(['optimal', 'warning']).toContain(standardMetrics.status);
    expect(standardMetrics.pageCount).toBe(1);
  });

  it('TC-BUDGET-02: Phát hiện trạng thái overflow khi nội dung vượt quá 100% chiều cao A4', () => {
    // Tạo danh sách nhiều dự án dài gây tràn trang
    const longSections: CVSection[] = [
      ...mockSections,
      {
        id: 'sec-3',
        type: 'work_experience',
        title: 'Kinh nghiệm làm việc',
        order_index: 3,
        is_visible: true,
        settings: defaultSettings,
        items: Array.from({ length: 10 }).map((_, idx) => ({
          id: `work-${idx}`,
          company: `Công ty Công Nghệ ${idx}`,
          position: 'Lập trình viên phần mềm',
          startDate: '2023-01',
          endDate: '2024-01',
          description: 'Mô tả công việc chi tiết dài dòng nhằm kiểm thử khả năng cảnh báo tràn trang in ấn A4 của hệ thống ProfileHub.'
        }))
      }
    ];

    const metrics = pageBudgetService.calculatePageBudget(longSections, {}, 'standard');
    expect(metrics.status).toBe('overflow');
    expect(metrics.pageCount).toBeGreaterThanOrEqual(2);
    expect(metrics.firstPageFillPercent).toBeGreaterThan(100);
  });

  it('TC-BUDGET-03: AI Auto-Condense loại bỏ các cụm từ đệm rườm rà bảo toàn ý nghĩa kỹ thuật', () => {
    const result = pageBudgetService.autoCondenseCvContent(mockSections);

    expect(result.charactersSaved).toBeGreaterThan(0);

    const condensedObj = result.sections.find(s => s.type === 'objective');
    expect(condensedObj?.content).not.toContain('Trách nhiệm của em là đã hoàn thành việc');
    expect(condensedObj?.content).not.toContain('rất cẩn thận');

    const condensedProj = result.sections.find(s => s.type === 'projects');
    const firstBullet = (condensedProj?.items as any[])[0].bullets[0];
    expect(firstBullet).not.toContain('Được giao nhiệm vụ');
  });
});
