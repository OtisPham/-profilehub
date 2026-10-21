import { describe, it, expect } from 'vitest';
import { analyzeAndTailorCV } from './aiCvService';

describe('Tầng 1 (AI Engine Seam): analyzeAndTailorCV', () => {
  const sampleProjects = [
    {
      id: 'proj-low-relevance',
      title: 'Công cụ Python Thu Thập Tin Tức Tự Động',
      description: 'Viết crawler bằng Python để cào tin tức',
      tags: ['Python', 'Scrapy']
    },
    {
      id: 'proj-high-relevance',
      title: 'Hệ thống Quản lý Bệnh viện React & TypeScript',
      description: 'Phát triển frontend SPA bằng React, TypeScript và REST API',
      tags: ['React', 'TypeScript', 'PostgreSQL']
    }
  ];

  const sampleCertificates = [
    {
      id: 'cert-1',
      title: 'Chứng chỉ Full-stack Web Developer',
      issuer: 'Coursera / Meta'
    }
  ];

  it('TC-AI-01: Khớp chính xác từ khóa JD và sinh điểm tương thích hợp lệ', async () => {
    const jdText = `
      Tuyển dụng Frontend Developer:
      - Thành thạo React, TypeScript, Tailwind CSS.
      - Có kinh nghiệm với Git, RESTful API.
    `;
    const userSkills = ['React', 'TypeScript', 'Tailwind', 'Git'];

    const result = await analyzeAndTailorCV(jdText, userSkills, sampleProjects, sampleCertificates);

    expect(result.matchScore).toBeGreaterThanOrEqual(70);
    expect(result.matchingKeywords.map(k => k.toLowerCase())).toContain('react');
    expect(result.matchingKeywords.map(k => k.toLowerCase())).toContain('typescript');
    expect(result.summaryText).toContain('React');
    expect(result.recommendedProjectIds.length).toBeGreaterThan(0);
  });

  it('TC-AI-02: Phát hiện đúng kỹ năng còn thiếu (missingKeywords) và không tự ý bịa đặt kỹ năng', async () => {
    const jdText = `
      Tuyển dụng Backend Cloud Engineer:
      - Yêu cầu kinh nghiệm Golang, Docker, Kubernetes, AWS.
    `;
    const userSkills = ['JavaScript', 'HTML', 'CSS'];

    const result = await analyzeAndTailorCV(jdText, userSkills, sampleProjects, sampleCertificates);

    // Missing keywords phải nhận diện được các công nghệ trong JD mà ứng viên không có
    const missingLower = result.missingKeywords.map(k => k.toLowerCase());
    expect(missingLower).toEqual(expect.arrayContaining(['docker', 'kubernetes', 'aws']));

    // Không được tự bịa đặt Golang hay Docker vào danh sách recommendedSkills của ứng viên
    const recommendedLower = result.recommendedSkills.map(k => k.toLowerCase());
    expect(recommendedLower).not.toContain('docker');
    expect(recommendedLower).not.toContain('kubernetes');
    expect(recommendedLower).not.toContain('aws');
  });

  it('TC-AI-03: Ưu tiên đề xuất đồ án có độ tương thích từ khóa và công nghệ với JD cao nhất lên đầu', async () => {
    const jdText = 'Tuyển dụng Lập trình viên Frontend React & TypeScript';
    const userSkills = ['React', 'TypeScript'];

    const result = await analyzeAndTailorCV(jdText, userSkills, sampleProjects, sampleCertificates);

    // Đồ án có nhiều tags và tiêu đề khớp với JD (React & TypeScript) phải được xếp ở vị trí đầu tiên
    expect(result.recommendedProjectIds[0]).toBe('proj-high-relevance');
  });

  it('TC-AI-04: Xử lý an toàn khi JD rỗng hoặc không chứa từ khóa công nghệ', async () => {
    const jdText = 'Tìm người nhiệt tình, ham học hỏi và chăm chỉ.';
    const userSkills = ['React', 'TypeScript'];

    const result = await analyzeAndTailorCV(jdText, userSkills, sampleProjects, sampleCertificates);

    expect(result.matchScore).toBeGreaterThanOrEqual(45);
    expect(result.recommendedSkills).toEqual(userSkills);
    expect(result.missingKeywords).toEqual([]);
  });
});
