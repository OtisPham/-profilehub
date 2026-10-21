import { describe, it, expect } from 'vitest';
import { projectFitService, type ProjectFitItem } from './projectFitService';

describe('Ticket 03 (Project Fit Explainer Seam): evaluateProjectFit', () => {
  const mockProjects = [
    {
      id: 'p1',
      title: 'Hệ thống Quản lý Bán hàng Thương mại Điện tử',
      role: 'Frontend Developer',
      description: 'Xây dựng giao diện thương mại điện tử bằng React, Next.js và Tailwind CSS. Tối ưu SEO và web performance.',
      tags: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript']
    },
    {
      id: 'p2',
      title: 'Microservices Xử lý Dữ liệu Lớn & Kafka Pipeline',
      role: 'Backend Engineer',
      description: 'Xây dựng hệ thống streaming dữ liệu lớn với Golang, Kafka, Docker, Kubernetes và gRPC.',
      tags: ['Golang', 'Kafka', 'Docker', 'Kubernetes', 'gRPC'],
      technologies: ['Golang', 'Kafka', 'Docker', 'Kubernetes', 'gRPC']
    },
    {
      id: 'p3',
      title: 'Mobile App Quản lý Chi tiêu Cá nhân',
      role: 'Flutter Developer',
      description: 'Ứng dụng mobile Flutter và Firebase quản lý chi tiêu ngân sách sinh viên.',
      tags: ['Flutter', 'Dart', 'Firebase'],
      technologies: ['Flutter', 'Dart', 'Firebase']
    }
  ];

  it('TC-FIT-01: Xếp hạng dự án có độ khớp từ khóa cao nhất lên đầu bảng', () => {
    const jdFrontend = `
      Tuyển Dụng Senior Frontend React Developer
      Yêu cầu kỹ năng:
      - Thành thạo React, TypeScript, Next.js và Tailwind CSS
      - Có kinh nghiệm tối ưu hóa hiệu năng web
    `;

    const results: ProjectFitItem[] = projectFitService.evaluateProjectFit(mockProjects, jdFrontend);

    expect(results.length).toBe(3);
    // Dự án React p1 phải đứng đầu
    expect(results[0].projectId).toBe('p1');
    expect(results[0].matchScore).toBeGreaterThan(70);
    expect(results[0].matchedKeywords).toContain('react');
    expect(results[0].matchedKeywords).toContain('next.js');
    expect(results[0].matchedKeywords).toContain('tailwind css');

    // Dự án Backend p2 điểm phải thấp hơn đáng kể
    expect(results[0].matchScore).toBeGreaterThan(results[1].matchScore);
  });

  it('TC-FIT-02: Minh bạch hóa matchedKeywords và missingKeywords giải trình cho ứng viên', () => {
    const jdFullstack = `
      Tuyển Full-stack Web Developer
      Kỹ năng: React, Node.js, GraphQL, PostgreSQL, Docker
    `;

    const results = projectFitService.evaluateProjectFit(mockProjects, jdFullstack);
    const p1Fit = results.find(r => r.projectId === 'p1');

    expect(p1Fit).toBeDefined();
    expect(p1Fit?.matchedKeywords).toContain('react');
    // Node.js hoặc Docker chưa có trong p1 sẽ vào missingKeywords
    expect(p1Fit?.missingKeywords).toContain('node.js');
    expect(p1Fit?.recommendationReason).toBeTruthy();
  });

  it('TC-FIT-03: Xử lý an toàn khi JD rỗng hoặc không có từ khóa công nghệ', () => {
    const emptyJd = '';
    const results = projectFitService.evaluateProjectFit(mockProjects, emptyJd);

    expect(results.length).toBe(3);
    results.forEach(r => {
      expect(r.matchScore).toBeGreaterThanOrEqual(0);
      expect(r.matchScore).toBeLessThanOrEqual(100);
      expect(r.recommendationReason).toContain('Chưa phát hiện');
    });
  });
});
