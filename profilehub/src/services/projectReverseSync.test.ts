import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cvService } from './cvService';
import type { ProjectItem } from '../types/cvSection';

// Mock Supabase
const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mockInsert,
      upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis()
    }))
  }
}));

describe('Ticket 01 (Reverse Sync Seam): syncCvProjectsToMaster', () => {
  const testUserId = 'student-reverse-sync-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC-SYNC-01: Tự động đồng bộ các dự án có syncToMasterProfile !== false vào bảng projects', async () => {
    const cvProjects: ProjectItem[] = [
      {
        id: 'proj-new-1',
        projectName: 'Hệ thống Quản lý Bệnh viện',
        role: 'Full-stack Developer',
        startDate: '2025',
        endDate: '2026',
        description: 'Phát triển module đặt khám trực tuyến',
        technologies: ['React', 'Node.js', 'PostgreSQL'],
        projectUrl: 'https://demo-hospital.dev',
        githubUrl: 'https://github.com/test/hospital',
        syncToMasterProfile: true
      },
      {
        id: 'proj-default-optin',
        projectName: 'Ứng dụng Chat Realtime',
        role: 'Backend Engineer',
        startDate: '2025',
        endDate: '2026',
        description: 'Xây dựng websocket server',
        technologies: ['Node.js', 'Socket.io'],
        // Không truyền syncToMasterProfile -> mặc định coi là true
      }
    ];

    const result = await cvService.syncCvProjectsToMaster(cvProjects, testUserId);

    expect(result.syncedProjects.length).toBe(2);
    expect(result.optedOutCount).toBe(0);
    expect(mockInsert).toHaveBeenCalledTimes(2);

    // Kiểm tra payload lưu xuống bảng projects
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      student_id: testUserId,
      title: 'Hệ thống Quản lý Bệnh viện',
      role: 'Full-stack Developer',
      demo_url: 'https://demo-hospital.dev',
      github_url: 'https://github.com/test/hospital',
      tags: ['React', 'Node.js', 'PostgreSQL']
    }));
  });

  it('TC-SYNC-02: Tôn trọng Explicit Opt-Out khi ứng viên chủ động gạt tắt (syncToMasterProfile === false)', async () => {
    const cvProjects: ProjectItem[] = [
      {
        id: 'proj-opted-out',
        projectName: 'Dự án Thử nghiệm Test Giao diện',
        role: 'Frontend Dev',
        startDate: '2025',
        endDate: '2026',
        description: 'Dự án nháp chỉ dùng tạm cho CV này',
        technologies: ['HTML', 'CSS'],
        syncToMasterProfile: false // Ứng viên chủ động gạt TẮT
      }
    ];

    const result = await cvService.syncCvProjectsToMaster(cvProjects, testUserId);

    expect(result.syncedProjects.length).toBe(0);
    expect(result.optedOutCount).toBe(1);
    // Tuyệt đối không gọi insert vào database
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('TC-SYNC-03: Trả về kết quả rỗng nếu không có userId (khách vãng lai)', async () => {
    const cvProjects: ProjectItem[] = [
      {
        id: 'proj-guest',
        projectName: 'Dự án Khách',
        role: 'Dev',
        startDate: '2025',
        endDate: '2026',
        description: 'Mô tả',
        technologies: ['React']
      }
    ];

    const result = await cvService.syncCvProjectsToMaster(cvProjects, undefined);

    expect(result.syncedProjects).toEqual([]);
    expect(mockInsert).not.toHaveBeenCalled();
  });
});
