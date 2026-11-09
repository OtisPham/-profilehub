import { describe, it, expect, beforeEach, vi } from 'vitest';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const mockStorage = new LocalStorageMock();
vi.stubGlobal('localStorage', mockStorage);

vi.stubGlobal('window', {
  location: {
    origin: 'http://localhost:5173'
  }
});

import { codeHealthService } from './codeHealthService';

describe('CodeHealthService - Kiểm Định Sức Khỏe Mã Nguồn & Cấp Huy Hiệu', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  const mockProjectComplete = {
    id: 'proj_enterprise_01',
    title: 'Hệ thống Quản lý Bán hàng Đa kênh Enterprise',
    github_url: 'https://github.com/student/omnichannel-platform',
    tags: ['React', 'Node.js', 'Vitest', 'Docker', 'PostgreSQL']
  };

  const mockProjectIncomplete = {
    id: 'proj_demo_raw',
    title: 'Website giới thiệu câu lạc bộ',
    tags: ['HTML', 'CSS']
  };

  it('TC-HLTH-01: Chấm điểm đồ án chuẩn chỉ đạt hạng A+ Production-Ready và cấp huy hiệu', async () => {
    const report = await codeHealthService.analyzeCodeHealth(mockProjectComplete);

    expect(report.projectId).toBe('proj_enterprise_01');
    expect(report.overallScore).toBeGreaterThanOrEqual(85);
    expect(report.tier).toBe('A+ Production-Ready');

    // Kiểm tra các checklist tiêu chuẩn
    expect(report.checks.hasReadme).toBe(true);
    expect(report.checks.noLeakedEnv).toBe(true);
    expect(report.checks.hasTests).toBe(true);
    expect(report.checks.hasCiCd).toBe(true);

    // Kiểm tra danh sách huy hiệu
    expect(report.badgesEarned).toContain('Clean Code Verified');
    expect(report.badgesEarned).toContain('Security-Checked');
    expect(report.badgesEarned).toContain('Test-Ready');
  });

  it('TC-HLTH-02: Đồ án thiếu link GitHub bị hạ bậc và sinh khuyến nghị bổ sung', async () => {
    const report = await codeHealthService.analyzeCodeHealth(mockProjectIncomplete);

    expect(report.projectId).toBe('proj_demo_raw');
    expect(report.overallScore).toBeLessThan(60);
    expect(report.tier).toBe('C Needs Refactor');

    expect(report.recommendations.length).toBeGreaterThan(0);
    expect(report.recommendations.some(r => r.includes('GitHub'))).toBe(true);
  });

  it('TC-HLTH-03: Tạo chuỗi Markdown Badge hợp lệ dẫn về ProfileHub', async () => {
    const report = await codeHealthService.analyzeCodeHealth(mockProjectComplete);
    const badgeMarkdown = codeHealthService.getMarkdownBadge(report);

    expect(badgeMarkdown).toContain('img.shields.io/badge/Architecture-');
    expect(badgeMarkdown).toContain('Production');
  });
});
