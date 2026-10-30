import { describe, it, expect } from 'vitest';
import { generateAtsPlainText, auditAtsParseability } from './atsParserEyeService';
import type { CVSection, PersonalInfoData } from '../types/cvSection';

describe('Tầng Kiểm Toán ATS Parser Eye-View Seam', () => {
  const mockPersonalInfo: PersonalInfoData = {
    fullName: 'Trần Văn Nam',
    jobTitle: 'Frontend Engineer',
    email: 'nam.tran@example.com',
    phone: '0912345678',
    location: 'TP. Hồ Chí Minh',
    github: 'https://github.com/namtran',
    linkedin: 'https://linkedin.com/in/namtran',
    visibleFields: {
      phone: true,
      email: true,
      facebook: false,
      linkedin: true,
      github: true,
      website: false,
      location: true,
      avatarUrl: false
    }
  };

  const defaultSettings = {
    showTitle: true,
    showDivider: true,
    spacing: 'normal' as const,
    titleStyle: 'bold' as const,
    titleCase: 'uppercase' as const
  };

  const mockSections: CVSection[] = [
    {
      id: 'sec-1',
      type: 'work_experience',
      title: 'KINH NGHIỆM LÀM VIỆC',
      order_index: 0,
      is_visible: true,
      settings: defaultSettings,
      items: [
        {
          id: 'exp-1',
          company: 'VNG Corporation',
          position: 'Frontend Developer',
          period: '2023 - 2024',
          description: 'Phát triển giao diện người dùng bằng React, TypeScript và Tailwind CSS.'
        }
      ]
    },
    {
      id: 'sec-2',
      type: 'projects',
      title: 'DỰ ÁN NỔI BẬT',
      order_index: 1,
      is_visible: true,
      settings: defaultSettings,
      items: [
        {
          id: 'proj-1',
          title: 'E-Commerce Platform',
          role: 'Fullstack Dev',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
          description: 'Hệ thống thương mại điện tử phục vụ 10,000 người dùng hàng ngày.'
        }
      ]
    },
    {
      id: 'sec-3',
      type: 'skills',
      title: 'KỸ NĂNG CHUYÊN MÔN',
      order_index: 2,
      is_visible: true,
      settings: defaultSettings,
      items: [
        {
          id: 'sk-1',
          category: 'Frontend',
          skills: ['React', 'TypeScript', 'Tailwind CSS']
        }
      ]
    }
  ];

  it('TC-ATS-01: generateAtsPlainText sinh chuỗi văn bản phân cấp có cấu trúc rõ ràng', () => {
    const text = generateAtsPlainText(mockSections, mockPersonalInfo);

    expect(text).toContain('TRẦN VĂN NAM');
    expect(text).toContain('FRONTEND ENGINEER');
    expect(text).toContain('nam.tran@example.com');
    expect(text).toContain('0912345678');
    expect(text).toContain('KINH NGHIỆM LÀM VIỆC');
    expect(text).toContain('DỰ ÁN NỔI BẬT');
    expect(text).toContain('VNG Corporation');
    expect(text).toContain('E-Commerce Platform');
  });

  it('TC-ATS-02: auditAtsParseability phát hiện rủi ro 2 cột trên template đa cột', () => {
    const auditClassic = auditAtsParseability(mockSections, mockPersonalInfo, 'classic');
    expect(auditClassic.hasTwoColumnRisk).toBe(true);
    expect(auditClassic.recommendedTemplate).toBe('minimal');
    expect(auditClassic.warnings.some(w => w.id === 'warn_two_column_risk')).toBe(true);

    const auditMinimal = auditAtsParseability(mockSections, mockPersonalInfo, 'minimal');
    expect(auditMinimal.hasTwoColumnRisk).toBe(false);
    expect(auditMinimal.recommendedTemplate).toBeUndefined();
    expect(auditMinimal.parseabilityScore).toBeGreaterThanOrEqual(90);
    expect(auditMinimal.rating).toBe('EXCELLENT');
  });

  it('TC-ATS-03: Trích xuất chính xác các từ khóa kỹ thuật (Keywords) từ nội dung', () => {
    const audit = auditAtsParseability(mockSections, mockPersonalInfo, 'minimal');

    expect(audit.extractedKeywords).toContain('React');
    expect(audit.extractedKeywords).toContain('TypeScript');
    expect(audit.extractedKeywords).toContain('Node.js');
    expect(audit.extractedKeywords).toContain('PostgreSQL');
    expect(audit.extractedKeywords).toContain('Docker');
    expect(audit.extractedKeywords.length).toBeGreaterThanOrEqual(5);
  });

  it('TC-ATS-04: Cảnh báo khi thiếu thông tin quan trọng hoặc email sai chuẩn', () => {
    const badInfo: PersonalInfoData = {
      fullName: '',
      jobTitle: '',
      location: '',
      email: 'invalid-email',
      phone: '',
      visibleFields: {
        phone: true,
        email: true,
        facebook: false,
        linkedin: false,
        website: false,
        location: false,
        avatarUrl: false
      }
    };

    const audit = auditAtsParseability(mockSections, badInfo, 'minimal');
    expect(audit.parseabilityScore).toBeLessThan(75);
    expect(audit.warnings.some(w => w.id === 'warn_missing_name')).toBe(true);
    expect(audit.warnings.some(w => w.id === 'warn_invalid_email')).toBe(true);
  });
});
