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

import { skillGapService } from './skillGapService';

describe('SkillGapService - Chẩn Đoán Khoảng Cách Kỹ Năng & Nâng Cấp Đồ Án', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  const mockStudent = {
    id: 'student_123',
    skills: ['React', 'TypeScript', 'Node.js', 'Git'],
    projects: [
      {
        id: 'proj_ecommerce',
        title: 'Sàn thương mại điện tử',
        tags: ['React', 'PostgreSQL', 'TailwindCSS']
      }
    ]
  };

  const mockJob = {
    id: 'job_456',
    title: 'Senior Backend Engineer',
    company_name: 'TechCorp Global',
    department: 'Backend Engineering',
    required_skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Vitest']
  };

  it('TC-GAP-01: Phân loại chính xác matchedSkills và missingSkills', () => {
    const report = skillGapService.diagnoseSkillGap(mockStudent, mockJob);

    expect(report.studentId).toBe('student_123');
    expect(report.jobId).toBe('job_456');

    // Matched skills phải có Node.js (từ CV) và PostgreSQL (từ project)
    const matchedNames = report.matchedSkills.map(m => m.name.toLowerCase());
    expect(matchedNames).toContain('node.js');
    expect(matchedNames).toContain('postgresql');

    // Missing skills phải có Redis, Docker, Vitest
    const missingNames = report.missingSkills.map(m => m.name.toLowerCase());
    expect(missingNames.some(n => n.includes('redis'))).toBe(true);
    expect(missingNames.some(n => n.includes('docker'))).toBe(true);

    // Readiness score ban đầu dựa trên 2/5 kỹ năng
    expect(report.readinessScore).toBeGreaterThanOrEqual(30);
    expect(report.readinessScore).toBeLessThanOrEqual(70);

    // Có ít nhất 2 recipes nâng cấp
    expect(report.upgradeRecipes.length).toBeGreaterThanOrEqual(2);
  });

  it('TC-GAP-02: Cập nhật trạng thái Recipe sang completed giúp tăng readinessScore', () => {
    const initialReport = skillGapService.diagnoseSkillGap(mockStudent, mockJob);
    const initialScore = initialReport.readinessScore;
    const targetRecipe = initialReport.upgradeRecipes[0];

    expect(targetRecipe.status).toBe('not_started');

    // Đánh dấu hoàn thành recipe
    const updatedReport = skillGapService.updateRecipeStatus(
      initialReport.id,
      targetRecipe.id,
      'completed'
    );

    expect(updatedReport).not.toBeNull();
    expect(updatedReport?.upgradeRecipes[0].status).toBe('completed');
    expect(updatedReport?.upgradeRecipes[0].completedAt).toBeDefined();

    // Điểm số phải tăng lên sau khi hoàn thành recipe
    expect(updatedReport!.readinessScore).toBeGreaterThan(initialScore);
  });

  it('TC-GAP-03: Lấy báo cáo đã lưu từ localStorage không bị mất dữ liệu', () => {
    const report = skillGapService.diagnoseSkillGap(mockStudent, mockJob);
    const fetched = skillGapService.getStoredSkillGapReport('student_123', 'job_456');

    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe(report.id);
    expect(fetched?.readinessScore).toBe(report.readinessScore);
  });
});
