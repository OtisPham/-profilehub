import { describe, it, expect } from 'vitest';
import type { ProjectItem } from '../types/cvSection';

export function getProjectEvidenceLinks(project: Partial<ProjectItem>): {
  hasEvidence: boolean;
  demoUrl?: string;
  githubUrl?: string;
  primaryVerificationUrl?: string;
} {
  const demoUrl = project.projectUrl && project.projectUrl.startsWith('http') ? project.projectUrl : undefined;
  const githubUrl = project.githubUrl && project.githubUrl.startsWith('http') ? project.githubUrl : undefined;
  const primaryVerificationUrl = demoUrl || githubUrl;

  return {
    hasEvidence: Boolean(demoUrl || githubUrl),
    demoUrl,
    githubUrl,
    primaryVerificationUrl
  };
}

describe('Ticket 06 (Evidence Showcase & Quick-Verify QR Seam)', () => {
  it('TC-EVIDENCE-01: Trích xuất và định dạng chính xác link Live Demo và GitHub Repo', () => {
    const projectWithLinks: Partial<ProjectItem> = {
      projectName: 'Cổng Tuyển Dụng Sinh Viên',
      projectUrl: 'https://demo-recruitment.edu.vn',
      githubUrl: 'https://github.com/profilehub/recruitment-portal'
    };

    const evidence = getProjectEvidenceLinks(projectWithLinks);
    expect(evidence.hasEvidence).toBe(true);
    expect(evidence.demoUrl).toBe('https://demo-recruitment.edu.vn');
    expect(evidence.githubUrl).toBe('https://github.com/profilehub/recruitment-portal');
    expect(evidence.primaryVerificationUrl).toBe('https://demo-recruitment.edu.vn');
  });

  it('TC-EVIDENCE-02: Ưu tiên demoUrl làm URL kích hoạt mã QR Quick-Verify thực tế', () => {
    const githubOnlyProject: Partial<ProjectItem> = {
      projectName: 'Công cụ CLI Tự Động Hóa',
      githubUrl: 'https://github.com/profilehub/cli-tool'
    };

    const evidence = getProjectEvidenceLinks(githubOnlyProject);
    expect(evidence.hasEvidence).toBe(true);
    expect(evidence.demoUrl).toBeUndefined();
    expect(evidence.primaryVerificationUrl).toBe('https://github.com/profilehub/cli-tool');
  });

  it('TC-EVIDENCE-03: Xử lý an toàn khi không có link hoặc link không hợp lệ', () => {
    const invalidProject: Partial<ProjectItem> = {
      projectName: 'Đồ án nội bộ',
      projectUrl: 'javascript:alert(1)',
      githubUrl: ''
    };

    const evidence = getProjectEvidenceLinks(invalidProject);
    expect(evidence.hasEvidence).toBe(false);
    expect(evidence.demoUrl).toBeUndefined();
    expect(evidence.primaryVerificationUrl).toBeUndefined();
  });
});
