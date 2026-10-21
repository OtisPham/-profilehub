import { describe, it, expect } from 'vitest';
import { applicationPitchService } from './applicationPitchService';
import type { ProjectItem } from '../types/cvSection';

describe('Tầng Dịch Vụ: Contextual Application Pitch Service (ADR 0002)', () => {
  const sampleProjects: ProjectItem[] = [
    {
      id: 'proj_ecommerce',
      projectName: 'Hệ thống E-Commerce Microservices',
      role: 'Backend Developer',
      startDate: '2025-01',
      endDate: '2025-06',
      technologies: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'Docker'],
      description: 'Thiết kế REST API xử lý 10,000 lượt đặt hàng đồng thời và cache danh mục sản phẩm.',
      projectUrl: 'https://ecommerce-demo.dev',
      githubUrl: 'https://github.com/student/ecommerce-core'
    },
    {
      id: 'proj_portfolio',
      projectName: 'Portfolio Website Cá Nhân',
      role: 'Frontend Developer',
      startDate: '2025-07',
      endDate: '2025-09',
      technologies: ['React', 'Tailwind CSS', 'Vite'],
      description: 'Xây dựng website cá nhân hiển thị đồ án và liên hệ.',
      projectUrl: 'https://my-portfolio.dev'
    }
  ];

  it('TC-PITCH-01: Hard-gating Guard chặn sinh thư khi thiếu JD hoặc thiếu Project', async () => {
    // Trường hợp 1: Thiếu hoàn toàn JD
    const checkNoJd = applicationPitchService.validateInput('', sampleProjects);
    expect(checkNoJd.isValid).toBe(false);
    expect(checkNoJd.missingRequirements[0]).toContain('Job Description (JD)');

    // Trường hợp 2: JD quá ngắn (< 20 ký tự)
    const checkShortJd = applicationPitchService.validateInput('Tuyển Dev', sampleProjects);
    expect(checkShortJd.isValid).toBe(false);

    // Trường hợp 3: Danh sách dự án rỗng
    const checkNoProjects = applicationPitchService.validateInput('Tuyển dụng lập trình viên Backend Node.js và PostgreSQL.', []);
    expect(checkNoProjects.isValid).toBe(false);
    expect(checkNoProjects.missingRequirements[0].toLowerCase()).toContain('ít nhất 1 đồ án thực tế');

    // Thử gọi generatePitch khi thiếu điều kiện phải throw Error
    await expect(applicationPitchService.generatePitch({
      applicantName: 'Nguyễn Văn A',
      targetRole: 'Backend Developer',
      targetJd: '',
      projects: sampleProjects
    })).rejects.toThrow('Không đủ điều kiện tạo thư ứng tuyển');
  });

  it('TC-PITCH-02: Đạt chuẩn cấu trúc Evidence-First 3-Part Pitch và khống chế dung lượng < 250 từ', async () => {
    const jdText = `
      Tuyển dụng Fresher / Junior Backend Developer (Node.js, PostgreSQL).
      Yêu cầu:
      - Nắm vững JavaScript, TypeScript, Node.js hoặc NestJS.
      - Thành thạo CSDL quan hệ PostgreSQL, biết viết tối ưu truy vấn.
      - Có kinh nghiệm làm việc với Redis và Docker là điểm cộng lớn.
    `;

    const result = await applicationPitchService.generatePitch({
      applicantName: 'Phạm Thái Bảo',
      targetRole: 'Backend Developer (Node.js/PostgreSQL)',
      targetJd: jdText,
      projects: sampleProjects
    });

    // 1. Kiểm tra giới hạn số từ (< 250 từ)
    expect(result.wordCount).toBeGreaterThan(50);
    expect(result.wordCount).toBeLessThan(250);

    // 2. Kiểm tra Đoạn 1: Hook & Alignment (Vị trí + Công nghệ cốt lõi)
    expect(result.content).toContain('Backend Developer (Node.js/PostgreSQL)');
    expect(result.content).toMatch(/Node\.js|NestJS|PostgreSQL/);

    // 3. Kiểm tra Đoạn 2: Project Evidence Spotlight (Nêu đích danh đồ án + link demo)
    expect(result.content).toContain('Hệ thống E-Commerce Microservices');
    expect(result.content).toContain('https://ecommerce-demo.dev');

    // 4. Kiểm tra Đoạn 3: Technical Call to Action (Trao đổi kiến trúc phỏng vấn)
    expect(result.content).toContain('quyết định kiến trúc');
    expect(result.content).toContain('Phạm Thái Bảo');
  });

  it('TC-PITCH-03: Ưu tiên chọn đồ án khớp nhất với JD thay vì lấy ngẫu nhiên', async () => {
    const reactJd = `
      Tìm kiếm Frontend React Developer có kinh nghiệm phát triển giao diện với React, Tailwind CSS và Vite.
    `;

    const result = await applicationPitchService.generatePitch({
      applicantName: 'Trần Thị B',
      targetRole: 'Frontend React Developer',
      targetJd: reactJd,
      projects: sampleProjects
    });

    // Phải ưu tiên chọn đồ án Frontend React thay vì đồ án Backend
    expect(result.featuredProjects[0]).toBe('Portfolio Website Cá Nhân');
    expect(result.content).toContain('Portfolio Website Cá Nhân');
    expect(result.content).toContain('https://my-portfolio.dev');
  });

  it('TC-PITCH-04: Đếm từ chuẩn xác cho cả tiếng Việt và ký tự đặc biệt', () => {
    expect(applicationPitchService.countWords('')).toBe(0);
    expect(applicationPitchService.countWords('   ')).toBe(0);
    expect(applicationPitchService.countWords('ProfileHub AI CV Builder')).toBe(4);
    expect(applicationPitchService.countWords('Tôi là lập trình viên Backend (Node.js / PostgreSQL).')).toBe(9);
  });
});
