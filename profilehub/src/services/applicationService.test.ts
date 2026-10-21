import { describe, it, expect, beforeEach, vi } from 'vitest';
import { applicationService } from './applicationService';

// Mock localStorage cho Node/Vitest test environment
class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
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

describe('Tầng Dịch Vụ: Student Application Hub & Tracking Seam', () => {
  const mockStudentId = 'std_test_001';

  beforeEach(() => {
    mockStorage.clear();
  });

  it('TC-APP-01: Tạo hồ sơ ứng tuyển bảo toàn snapshot CV và JD', () => {
    const cvSnapshot = {
      title: 'CV Backend Node.js v3',
      targetRole: 'Backend Developer',
      sections: [{ type: 'experience', items: [{ role: 'Node.js Dev' }] }]
    };

    const app = applicationService.createApplication({
      studentId: mockStudentId,
      companyName: 'Shopee Vietnam',
      position: 'Backend Software Engineer',
      jobDescription: 'Yêu cầu tối thiểu 1 năm kinh nghiệm Node.js, PostgreSQL, Docker',
      jobUrl: 'https://careers.shopee.vn/job/12345',
      source: 'LinkedIn',
      status: 'applied',
      appliedDate: '2026-10-21',
      priority: 'high',
      cvId: 'cv_backend_v3',
      cvTitle: 'CV Backend Node.js v3',
      cvSnapshot
    }, 'Ứng tuyển qua LinkedIn');

    expect(app.id).toBeDefined();
    expect(app.companyName).toBe('Shopee Vietnam');
    expect(app.status).toBe('applied');
    expect(app.cvSnapshot).toEqual(cvSnapshot);
    expect(app.statusHistory.length).toBe(1);
    expect(app.statusHistory[0].toStatus).toBe('applied');

    // Kiểm tra danh sách trả về
    const list = applicationService.getApplications(mockStudentId);
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(app.id);
  });

  it('TC-APP-02: Cập nhật trạng thái kèm theo bản ghi Status History bất biến', () => {
    const app = applicationService.createApplication({
      studentId: mockStudentId,
      companyName: 'VNG Corporation',
      position: 'Frontend React Engineer',
      status: 'saved',
    });

    const updated = applicationService.updateStatus(
      app.id,
      'applied',
      'Đã hoàn thiện CV và nộp hồ sơ qua website công ty',
      'kanban',
      mockStudentId
    );

    expect(updated).not.toBeNull();
    expect(updated!.status).toBe('applied');
    expect(updated!.statusHistory.length).toBe(2);
    expect(updated!.statusHistory[0].fromStatus).toBe('saved');
    expect(updated!.statusHistory[0].toStatus).toBe('applied');
    expect(updated!.statusHistory[0].note).toContain('Đã hoàn thiện CV');
  });

  it('TC-APP-03: Thêm lịch phỏng vấn và tự động thăng cấp trạng thái ứng tuyển', () => {
    const app = applicationService.createApplication({
      studentId: mockStudentId,
      companyName: 'FPT Software',
      position: 'Java Fullstack Engineer',
      status: 'applied',
    });

    const scheduled = applicationService.addInterview(app.id, {
      roundType: 'technical',
      interviewDate: '2026-10-25',
      interviewTime: '14:30',
      format: 'online',
      meetingLink: 'https://meet.google.com/abc-xyz-123',
      interviewer: 'Tech Lead Mr. Long',
      status: 'scheduled'
    }, mockStudentId);

    expect(scheduled).not.toBeNull();
    expect(scheduled!.status).toBe('tech_interview');
    expect(scheduled!.interviews.length).toBe(1);
    expect(scheduled!.interviews[0].meetingLink).toBe('https://meet.google.com/abc-xyz-123');
    expect(scheduled!.statusHistory[0].toStatus).toBe('tech_interview');
  });

  it('TC-APP-04: Lưu trữ (Archive) và lọc hồ sơ khỏi danh sách mặc định', () => {
    const app = applicationService.createApplication({
      studentId: mockStudentId,
      companyName: 'Grab Vietnam',
      position: 'DevOps Engineer',
      status: 'rejected',
    });

    const archived = applicationService.toggleArchive(app.id, mockStudentId);
    expect(archived!.isArchived).toBe(true);

    const activeList = applicationService.getApplications(mockStudentId, false);
    expect(activeList.length).toBe(0);

    const allList = applicationService.getApplications(mockStudentId, true);
    expect(allList.length).toBe(1);
    expect(allList[0].isArchived).toBe(true);
  });

  it('TC-APP-05: Cập nhật ghi chú phỏng vấn chuyên sâu (Interview Notes)', () => {
    const app = applicationService.createApplication({
      studentId: mockStudentId,
      companyName: 'Tiki',
      position: 'Backend Developer',
      status: 'applied',
    });

    const appWithInterview = applicationService.addInterview(app.id, {
      roundType: 'technical',
      interviewDate: '2026-10-24',
      format: 'online',
      status: 'scheduled'
    }, mockStudentId);

    const interviewId = appWithInterview!.interviews[0].id;

    const updatedWithNotes = applicationService.updateInterviewNotes(
      app.id,
      interviewId,
      {
        questions: ['Giải thích Event Loop trong Node.js?', 'Làm sao để tối ưu truy vấn PostgreSQL?'],
        myAnswers: 'Đã giải thích rõ Call Stack, Node APIs, Callback Queue và Microtask Queue.',
        feedback: 'Tech Lead đánh giá cao phần giải thích Event Loop.',
        selfReview: 'Cần ôn thêm phần Redis Cache Invalidation.',
        nextSteps: 'Chuẩn bị cho vòng Final với CTO.'
      },
      mockStudentId
    );

    expect(updatedWithNotes).not.toBeNull();
    const interview = updatedWithNotes!.interviews.find(i => i.id === interviewId);
    expect(interview?.notes?.questions?.length).toBe(2);
    expect(interview?.notes?.selfReview).toContain('Redis Cache Invalidation');
  });

  it('TC-APP-06: Tính toán chỉ số Analytics chính xác', () => {
    applicationService.createApplication({
      studentId: mockStudentId,
      companyName: 'Company A',
      position: 'Dev',
      status: 'applied',
    });

    applicationService.createApplication({
      studentId: mockStudentId,
      companyName: 'Company B',
      position: 'Dev',
      status: 'tech_interview',
    });

    applicationService.createApplication({
      studentId: mockStudentId,
      companyName: 'Company C',
      position: 'Dev',
      status: 'offer',
    });

    applicationService.createApplication({
      studentId: mockStudentId,
      companyName: 'Company D',
      position: 'Dev',
      status: 'rejected',
    });

    const analytics = applicationService.computeAnalytics(mockStudentId);

    expect(analytics.total).toBe(4);
    expect(analytics.applied).toBe(1);
    expect(analytics.interviewing).toBe(1);
    expect(analytics.offers).toBe(1);
    expect(analytics.rejected).toBe(1);
    // Total applied or beyond: 1 + 1 + 1 + 1 = 4. Reached interview: 1 (interview) + 1 (offer) = 2 -> 50%
    expect(analytics.interviewRate).toBe(50);
    // Offer rate: 1/4 = 25%
    expect(analytics.offerRate).toBe(25);
  });
});
