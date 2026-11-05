/**
 * Unit Test Suite for Smart CV Parser Engine
 * File: src/services/cvParserService.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  parseContactAndEducation,
  parseSkills,
  extractUrls,
  parseProjects,
  parseCertificates,
  calculateConfidenceScore,
  parseCvText,
  parseCvFile,
  populateProfileWithParsedData
} from './cvParserService';
import { supabase } from './supabase';

// Mock Supabase client
vi.mock('./supabase', () => {
  return {
    supabase: {
      from: vi.fn()
    }
  };
});

describe('cvParserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleCvText = `
CURRICULUM VITAE
NGUYỄN VĂN AN
Vị trí ứng tuyển: Frontend Developer
Email: an.nguyen.dev@gmail.com | Phone: 0908 123 456
Địa chỉ: TP. Hồ Chí Minh

GIỚI THIỆU BẢN THÂN
Lập trình viên Frontend giàu nhiệt huyết với 1 năm kinh nghiệm làm việc với React và TypeScript.

HỌC VẤN
Trường Đại học Bách Khoa - ĐHQG TP.HCM
Chuyên ngành: Kỹ thuật phần mềm
GPA: 3.65/4.0
Niên khóa: 2021 - 2025

KỸ NĂNG CHUYÊN MÔN
- Frontend: ReactJS, TypeScript, Tailwind CSS, Next.js, Redux
- Backend & DB: Node.js, PostgreSQL, Docker, Git
- Công cụ: Figma, Postman, Vitest

DỰ ÁN TIÊU BIỂU
1. ProfileHub - Nền Tảng Bằng Chứng Năng Lực
Vai trò: Tech Lead / Frontend Engineer
Mô tả: Nền tảng tuyển dụng sinh viên IT dựa trên bằng chứng và bảo chứng năng lực thực chiến.
Mã nguồn: https://github.com/profilehub/frontend
Sản phẩm thực tế: https://profilehub-demo.vercel.app

2. E-Commerce Platform
Vai trò: Fullstack Developer
Mô tả: Hệ thống thương mại điện tử với tính năng thanh toán VNPay và giỏ hàng thời gian thực.
Mã nguồn: https://github.com/annguyen/shop-online
Live Demo: https://shop-online.netlify.app

CHỨNG CHỈ & GIẢI THƯỞNG
- AWS Certified Cloud Practitioner (2024)
- IELTS 7.0 (2023)
- Giải Nhì Cuộc Thi Lập Trình Hackathon Sinh Viên
`;

  it('1. Bóc tách email chuẩn xác từ CV', () => {
    const { personalInfo } = parseContactAndEducation(sampleCvText);
    expect(personalInfo.email).toBe('an.nguyen.dev@gmail.com');
  });

  it('2. Bóc tách số điện thoại VN và chuẩn hóa khoảng trắng', () => {
    const { personalInfo } = parseContactAndEducation(sampleCvText);
    expect(personalInfo.phone).toBe('0908123456');
  });

  it('3. Bóc tách họ tên từ phần đầu văn bản (bỏ qua tiêu đề CV)', () => {
    const { personalInfo } = parseContactAndEducation(sampleCvText);
    expect(personalInfo.fullName).toBe('NGUYỄN VĂN AN');
  });

  it('4. Bóc tách họ tên khi có nhãn chỉ định "Họ và tên: Lê Thị Mai"', () => {
    const text = 'Họ và tên: Lê Thị Mai\nEmail: mai@gmail.com';
    const { personalInfo } = parseContactAndEducation(text);
    expect(personalInfo.fullName).toBe('Lê Thị Mai');
  });

  it('5. Bóc tách vị trí ứng tuyển mục tiêu', () => {
    const { personalInfo } = parseContactAndEducation(sampleCvText);
    expect(personalInfo.targetRole).toBe('Frontend Developer');
  });

  it('6. Bóc tách địa điểm / thành phố cư trú', () => {
    const { personalInfo } = parseContactAndEducation(sampleCvText);
    expect(personalInfo.location).toBe('TP. Hồ Chí Minh');
  });

  it('7. Bóc tách Trường Đại học chính xác', () => {
    const { education } = parseContactAndEducation(sampleCvText);
    expect(education.university).toContain('Bách Khoa');
  });

  it('8. Bóc tách Chuyên ngành đào tạo', () => {
    const { education } = parseContactAndEducation(sampleCvText);
    expect(education.major).toBe('Kỹ thuật phần mềm');
  });

  it('9. Bóc tách điểm GPA thang 4 và thang 10', () => {
    const { education: edu1 } = parseContactAndEducation(sampleCvText);
    expect(edu1.gpa).toBe('3.65/4.0');

    const textScale10 = 'Đại học FPT\nĐiểm trung bình: 8.5/10';
    const { education: edu2 } = parseContactAndEducation(textScale10);
    expect(edu2.gpa).toBe('8.5/10');
  });

  it('10. Bóc tách năm tốt nghiệp', () => {
    const { education } = parseContactAndEducation(sampleCvText);
    expect(education.graduationYear).toBe('2025');
  });

  it('11. Bóc tách kỹ năng chuẩn hóa qua TECH_DICTIONARY', () => {
    const skills = parseSkills(sampleCvText);
    expect(skills).toContain('ReactJS');
    expect(skills).toContain('TypeScript');
    expect(skills).toContain('Tailwind CSS');
    expect(skills).toContain('Next.js');
    expect(skills).toContain('PostgreSQL');
    expect(skills).toContain('Docker');
    expect(skills).toContain('Git');
  });

  it('12. Trích xuất GitHub URL và Live Demo URL từ đoạn văn bản', () => {
    const text = 'Repo: https://github.com/myteam/awesome-app and Demo at https://awesome-app.vercel.app';
    const { github_url, demo_url } = extractUrls(text);
    expect(github_url).toBe('https://github.com/myteam/awesome-app');
    expect(demo_url).toBe('https://awesome-app.vercel.app');
  });

  it('13. Bóc tách danh sách đồ án thực tế kèm link GitHub và Demo', () => {
    const projects = parseProjects(sampleCvText);
    expect(projects.length).toBeGreaterThanOrEqual(2);

    const p1 = projects[0];
    expect(p1.title).toContain('ProfileHub');
    expect(p1.role).toBe('Tech Lead / Frontend Engineer');
    expect(p1.github_url).toBe('https://github.com/profilehub/frontend');
    expect(p1.demo_url).toBe('https://profilehub-demo.vercel.app');
    expect(p1.tags).toBeDefined();

    const p2 = projects[1];
    expect(p2.title).toContain('E-Commerce Platform');
    expect(p2.demo_url).toBe('https://shop-online.netlify.app');
  });

  it('14. Bóc tách chứng chỉ và tổ chức cấp', () => {
    const certs = parseCertificates(sampleCvText);
    expect(certs.length).toBeGreaterThanOrEqual(2);
    const awsCert = certs.find(c => c.issuer === 'AWS');
    expect(awsCert).toBeDefined();
    expect(awsCert?.title).toContain('AWS Certified Cloud Practitioner');
  });

  it('15. Tính điểm độ tin cậy confidenceScore hợp lý', () => {
    const parsed = parseCvText(sampleCvText);
    expect(parsed.confidenceScore).toBeGreaterThanOrEqual(80);
    expect(parsed.rawTextLength).toBe(sampleCvText.length);
  });

  it('16. Xử lý an toàn khi văn bản CV trống hoặc null', () => {
    const emptyParsed = parseCvText('');
    expect(emptyParsed.skills).toEqual([]);
    expect(emptyParsed.projects).toEqual([]);
    expect(emptyParsed.confidenceScore).toBe(0);
  });

  it('17. populateProfileWithParsedData ở chế độ "merge" chỉ cập nhật trường còn trống', async () => {
    const mockExistingProfile = {
      id: 'student-123',
      full_name: 'Nguyễn Văn Đã Có',
      university: '',
      major: '',
      skills: ['HTML5', 'CSS3']
    };

    const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    (supabase.from as any).mockImplementation((tableName: string) => {
      if (tableName === 'student_profiles') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: vi.fn().mockResolvedValue({ data: mockExistingProfile })
            })
          }),
          update: mockUpdate,
          insert: mockInsert
        };
      }
      if (tableName === 'projects' || tableName === 'certificates') {
        return {
          select: () => ({
            eq: vi.fn().mockResolvedValue({ data: [] })
          }),
          insert: vi.fn().mockResolvedValue({ error: null })
        };
      }
      return { select: vi.fn() };
    });

    const parsedData = parseCvText(sampleCvText);
    const result = await populateProfileWithParsedData(
      parsedData,
      {
        mode: 'merge',
        includeProjects: true,
        includeCertificates: true
      },
      'student-123'
    );

    expect(result.success).toBe(true);
    expect(result.createdProjectsCount).toBeGreaterThanOrEqual(2);
    // Trong chế độ merge, full_name đã có sẵn nên không được đè
    expect(result.updatedProfileFields).not.toContain('Họ và tên');
    // Trường ĐH đang trống nên được điền
    expect(result.updatedProfileFields).toContain('Trường Đại học');
    expect(result.updatedProfileFields).toContain('Kỹ năng');
  });

  it('18. populateProfileWithParsedData ở chế độ "overwrite" thay thế toàn bộ thông tin', async () => {
    const mockExistingProfile = {
      id: 'student-123',
      full_name: 'Nguyễn Cũ',
      university: 'Trường Cũ',
      major: 'Ngành Cũ',
      skills: ['PHP']
    };

    const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });

    (supabase.from as any).mockImplementation((tableName: string) => {
      if (tableName === 'student_profiles') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: vi.fn().mockResolvedValue({ data: mockExistingProfile })
            })
          }),
          update: mockUpdate
        };
      }
      if (tableName === 'projects' || tableName === 'certificates') {
        return {
          select: () => ({
            eq: vi.fn().mockResolvedValue({ data: [] })
          }),
          insert: vi.fn().mockResolvedValue({ error: null })
        };
      }
      return { select: vi.fn() };
    });

    const parsedData = parseCvText(sampleCvText);
    const result = await populateProfileWithParsedData(
      parsedData,
      {
        mode: 'overwrite',
        includeProjects: false,
        includeCertificates: false
      },
      'student-123'
    );

    expect(result.success).toBe(true);
    expect(result.updatedProfileFields).toContain('Họ và tên');
    expect(result.updatedProfileFields).toContain('Trường Đại học');
    expect(result.updatedProfileFields).toContain('Chuyên ngành');
  });

  it('19. Đọc và bóc tách tệp CV text thông qua parseCvFile', async () => {
    const file = new File([sampleCvText], 'my-cv.txt', { type: 'text/plain' });
    const parsed = await parseCvFile(file);
    expect(parsed.personalInfo.email).toBe('an.nguyen.dev@gmail.com');
    expect(parsed.skills).toContain('ReactJS');
    expect(parsed.confidenceScore).toBeGreaterThanOrEqual(80);
  });
});
