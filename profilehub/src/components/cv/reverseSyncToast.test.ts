import { describe, it, expect, vi } from 'vitest';
import type { ProjectItem } from '../../types/cvSection';
import type { ReverseSyncDetectionResult } from '../../types/reverseSync.types';

export function detectEligibleProjectsForReverseSync(projects: ProjectItem[]): ReverseSyncDetectionResult {
  if (!Array.isArray(projects)) {
    return { hasEligibleProjects: false, eligibleProjects: [], optedOutProjects: [] };
  }

  const eligibleProjects = projects.filter(p => p.syncToMasterProfile !== false);
  const optedOutProjects = projects.filter(p => p.syncToMasterProfile === false);

  return {
    hasEligibleProjects: eligibleProjects.length > 0,
    eligibleProjects,
    optedOutProjects
  };
}

describe('ReverseSyncToast Contracts & Opt-Out Invariants (SDD Spec D)', () => {
  const sampleProjects: ProjectItem[] = [
    {
      id: 'proj-1',
      projectName: 'Website Thương Mại Điện Tử',
      role: 'Frontend Developer',
      startDate: '2025-01',
      endDate: '2025-05',
      description: 'Phát triển giao diện',
      technologies: ['React'],
      syncToMasterProfile: true
    },
    {
      id: 'proj-2',
      projectName: 'Ứng Dụng Chat Tạm Thời',
      role: 'Fullstack Dev',
      startDate: '2025-06',
      endDate: '2025-07',
      description: 'Chat realtime',
      technologies: ['Node.js'],
      syncToMasterProfile: false // Ứng viên chủ động gạt tắt
    },
    {
      id: 'proj-3',
      projectName: 'Hệ Thống Phân Tích Dữ Liệu',
      role: 'Data Engineer',
      startDate: '2025-08',
      endDate: '2025-10',
      description: 'Xử lý dữ liệu lớn',
      technologies: ['Python']
      // Không khai báo syncToMasterProfile -> mặc định opt-in
    }
  ];

  it('TC-TOAST-01: Lọc chính xác các dự án hợp lệ để hiển thị trên Toast', () => {
    const result = detectEligibleProjectsForReverseSync(sampleProjects);

    expect(result.hasEligibleProjects).toBe(true);
    expect(result.eligibleProjects.length).toBe(2);
    expect(result.eligibleProjects.map(p => p.id)).toEqual(['proj-1', 'proj-3']);
  });

  it('TC-TOAST-02: Tôn trọng tuyệt đối quyết định Opt-Out (Explicit Opt-Out Respect)', () => {
    const allOptedOutProjects: ProjectItem[] = [
      {
        id: 'proj-private-1',
        projectName: 'Đồ án bí mật 1',
        role: 'Dev',
        startDate: '2025',
        endDate: '2026',
        description: 'Bảo mật',
        technologies: ['Rust'],
        syncToMasterProfile: false
      },
      {
        id: 'proj-private-2',
        projectName: 'Đồ án bí mật 2',
        role: 'Dev',
        startDate: '2025',
        endDate: '2026',
        description: 'Bảo mật',
        technologies: ['C++'],
        syncToMasterProfile: false
      }
    ];

    const result = detectEligibleProjectsForReverseSync(allOptedOutProjects);

    // Tuyệt đối không bật Toast khi ứng viên đã chủ động từ chối
    expect(result.hasEligibleProjects).toBe(false);
    expect(result.eligibleProjects.length).toBe(0);
    expect(result.optedOutProjects.length).toBe(2);
  });

  it('TC-TOAST-03: Xử lý an toàn khi danh sách dự án rỗng', () => {
    const result = detectEligibleProjectsForReverseSync([]);
    expect(result.hasEligibleProjects).toBe(false);
    expect(result.eligibleProjects).toEqual([]);
    expect(result.optedOutProjects).toEqual([]);
  });
});
