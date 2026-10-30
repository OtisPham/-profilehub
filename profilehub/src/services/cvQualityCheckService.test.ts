import { describe, it, expect } from 'vitest';
import { evaluateCVQuality, CVQualityCheckInput } from './cvQualityCheckService';

const defaultSettings = {
  showTitle: true,
  showDivider: true,
  spacing: 'normal' as const,
  titleStyle: 'bold' as const,
  titleCase: 'uppercase' as const
};

describe('Feature 9: Basic Quality Check Rule Engine (cvQualityCheckService)', () => {
  const completeCV: CVQualityCheckInput = {
    title: 'Frontend Developer CV',
    targetRole: 'Frontend Developer',
    personalInfo: {
      fullName: 'Nguyễn Văn A',
      email: 'nguyenvana@gmail.com',
      phone: '0912345678',
      location: 'Hồ Chí Minh',
      jobTitle: 'Frontend Developer',
      visibleFields: {
        phone: true,
        email: true,
        facebook: true,
        linkedin: true,
        website: true,
        location: true,
        avatarUrl: true
      }
    },
    sections: [
      {
        id: 'sec-edu',
        type: 'education',
        title: 'Học vấn',
        order_index: 0,
        is_visible: true,
        settings: defaultSettings,
        items: [
          {
            id: 'edu-1',
            institution: 'Đại học Khoa học Tự nhiên',
            major: 'Kỹ thuật phần mềm',
            startDate: '2022',
            endDate: '2026',
            bullets: ['Chuyên ngành Kỹ thuật Phần mềm, định hướng Phát triển Ứng dụng Web']
          }
        ]
      },
      {
        id: 'sec-skills',
        type: 'skills',
        title: 'Kỹ năng chuyên môn',
        order_index: 1,
        is_visible: true,
        settings: defaultSettings,
        items: [
          {
            id: 'sk-1',
            title: 'Frontend & Cloud',
            subtitle: 'React, TypeScript, Tailwind CSS, Next.js, Git',
            skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Git']
          }
        ]
      },
      {
        id: 'sec-projects',
        type: 'projects',
        title: 'Dự án thực tế',
        order_index: 2,
        is_visible: true,
        settings: defaultSettings,
        items: [
          {
            id: 'proj-1',
            projectName: 'ProfileHub Platform',
            role: 'Lead Developer',
            startDate: '2026',
            endDate: '2026',
            bullets: [
              'Xây dựng hệ thống quản lý hồ sơ và xác thực đồ án cho sinh viên đại học',
              'Tối ưu thời gian phản hồi API giảm 35% nhờ áp dụng caching và indexed queries'
            ]
          }
        ]
      }
    ]
  };

  it('TC-QC-01: Bản CV chuẩn đầy đủ thông tin đạt 100 điểm và passed = true', () => {
    const result = evaluateCVQuality(completeCV, 85); // 85% A4 budget
    expect(result.passed).toBe(true);
    expect(result.errorsCount).toBe(0);
    expect(result.score).toBe(100);
    expect(result.metrics.skillsCount).toBeGreaterThanOrEqual(5);
    expect(result.metrics.projectsCount).toBe(1);
  });

  it('TC-QC-02: Báo lỗi khi thiếu Email hoặc Email không hợp lệ', () => {
    const brokenEmailCV: CVQualityCheckInput = {
      ...completeCV,
      personalInfo: {
        ...completeCV.personalInfo,
        email: ''
      }
    };
    const result = evaluateCVQuality(brokenEmailCV, 85);
    expect(result.passed).toBe(false);
    expect(result.errorsCount).toBeGreaterThan(0);
    expect(result.issues.some(i => i.rule === 'MISSING_EMAIL')).toBe(true);
  });

  it('TC-QC-03: Báo lỗi khi thiếu mục Học vấn, Kỹ năng hoặc Dự án', () => {
    const emptySectionsCV: CVQualityCheckInput = {
      ...completeCV,
      sections: []
    };
    const result = evaluateCVQuality(emptySectionsCV, 30);
    expect(result.passed).toBe(false);
    expect(result.issues.some(i => i.rule === 'MISSING_EDUCATION')).toBe(true);
    expect(result.issues.some(i => i.rule === 'MISSING_SKILLS')).toBe(true);
    expect(result.issues.some(i => i.rule === 'MISSING_PROJECTS_EXPERIENCE')).toBe(true);
    expect(result.score).toBeLessThanOrEqual(55);
  });

  it('TC-QC-04: Cảnh báo khi có gạch đầu dòng quá dài (> 200 ký tự)', () => {
    const longBulletCV: CVQualityCheckInput = {
      ...completeCV,
      sections: [
        ...completeCV.sections,
        {
          id: 'sec-exp',
          type: 'work_experience',
          title: 'Kinh nghiệm',
          order_index: 3,
          is_visible: true,
          settings: defaultSettings,
          items: [
            {
              id: 'exp-1',
              company: 'Công ty Công nghệ ABC',
              position: 'Thực tập sinh',
              startDate: '2025',
              endDate: '2026',
              bullets: [
                'Đây là một câu mô tả cực kỳ dài dòng vượt quá giới hạn hai trăm ký tự nhằm mục đích kiểm tra xem bộ luật kiểm tra chất lượng CV có bắt đúng lỗi câu quá dài hay không để nhắc nhở ứng viên rút gọn lại cho chuẩn ATS.'
              ]
            }
          ]
        }
      ]
    };
    const result = evaluateCVQuality(longBulletCV, 90);
    expect(result.warningsCount).toBeGreaterThan(0);
    expect(result.issues.some(i => i.rule === 'OVERLONG_BULLET')).toBe(true);
  });

  it('TC-QC-05: Báo lỗi khi dung lượng CV tràn trang A4 (> 105%)', () => {
    const overflowResult = evaluateCVQuality(completeCV, 115); // 115% of A4
    expect(overflowResult.passed).toBe(false);
    expect(overflowResult.issues.some(i => i.rule === 'PAGE_OVERFLOW')).toBe(true);
  });
});
