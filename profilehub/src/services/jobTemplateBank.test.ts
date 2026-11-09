import { describe, it, expect } from 'vitest';
import { jobTemplateBank, JOB_TEMPLATE_BANK } from './jobTemplateBank';

describe('jobTemplateBank - Ngân Hàng Mẫu JD Chuẩn Ngành', () => {
  it('TC-TPL-01: Cung cấp đầy đủ 6 mẫu JD chuẩn công nghệ thực chiến', () => {
    const list = jobTemplateBank.getAllTemplates();
    expect(list.length).toBe(6);
    expect(list).toEqual(JOB_TEMPLATE_BANK);
  });

  it('TC-TPL-02: Toàn bộ mẫu JD đều có kỹ năng, mô tả và dải lương hợp lệ', () => {
    const list = jobTemplateBank.getAllTemplates();
    for (const tpl of list) {
      expect(tpl.title.trim().length).toBeGreaterThan(5);
      expect(tpl.requiredSkills.length).toBeGreaterThanOrEqual(3);
      expect(tpl.salaryMin).toBeGreaterThan(0);
      expect(tpl.salaryMax).toBeGreaterThan(tpl.salaryMin);
      expect(tpl.description).toContain('### Mô Tả Công Việc');
      expect(tpl.description).toContain('### Yêu Cầu Ứng Viên');
    }
  });

  it('TC-TPL-03: Tìm chính xác mẫu JD theo ID hoặc trả về undefined nếu không tồn tại', () => {
    const found = jobTemplateBank.getTemplateById('tpl_frontend_react');
    expect(found).toBeDefined();
    expect(found?.title).toContain('Frontend');

    const notFound = jobTemplateBank.getTemplateById('tpl_non_existent');
    expect(notFound).toBeUndefined();
  });
});
