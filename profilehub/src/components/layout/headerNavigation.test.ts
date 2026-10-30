import { describe, it, expect } from 'vitest';
import { getHeaderNavLinks, getPendingInterviewNotificationCount } from './headerNavigation';
import type { CandidatePipelineItem } from '../../types/database';

describe('HeaderBar Navigation Logic & Role Contracts', () => {
  it('TC-HEADER-01: Sinh viên / Ứng viên nhận được bộ liên kết điều hướng tinh gọn (Quản Lý CV & Kho Đồ Án)', () => {
    const studentLinks = getHeaderNavLinks('student');
    const paths = studentLinks.map(l => l.path);

    expect(paths).toContain('/cv-management');
    expect(paths).toContain('/my-projects');
    expect(paths).not.toContain('/student/jobs');
    expect(paths).not.toContain('#tools');
  });

  it('TC-HEADER-02: Nhà tuyển dụng (Recruiter) nhận được bộ liên kết quản trị tuyển dụng', () => {
    const recruiterLinks = getHeaderNavLinks('recruiter');
    const paths = recruiterLinks.map(l => l.path);

    expect(paths).toContain('/recruiter/dashboard');
    expect(paths).toContain('/recruiter/jobs');
    expect(paths).toContain('/recruiter/candidates');
    expect(paths).toContain('/recruiter/pipeline');
  });

  it('TC-HEADER-03: Tính toán chính xác số lượng lời mời phỏng vấn pending từ pipeline', () => {
    const mockPipeline: Partial<CandidatePipelineItem>[] = [
      { id: '1', stage: 'interview', interview_date: '2026-10-30', interview_status: 'pending_student' },
      { id: '2', stage: 'interview', interview_date: '2026-10-30', interview_status: 'confirmed' },
      { id: '3', stage: 'shortlisted', interview_status: 'pending_student' },
      { id: '4', stage: 'hired' },
    ];

    const pendingCount = getPendingInterviewNotificationCount(mockPipeline as CandidatePipelineItem[]);
    // Chỉ có mục 'interview' và interview_status !== 'confirmed' là cần thông báo
    expect(pendingCount).toBe(1);
  });

  it('TC-HEADER-04: Xử lý an toàn khi danh sách pipeline rỗng hoặc không hợp lệ', () => {
    expect(getPendingInterviewNotificationCount(null)).toBe(0);
    expect(getPendingInterviewNotificationCount([])).toBe(0);
  });
});
