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

const eventTarget = new EventTarget();
vi.stubGlobal('window', {
  addEventListener: eventTarget.addEventListener.bind(eventTarget),
  removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
  dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
});

// Import after globals stubbing
import { applicationTrackerService } from './applicationTrackerService';
import { selfInterviewService } from './selfInterviewService';

describe('applicationTrackerService - Quản lý Bảng Kanban Tuyển Dụng', () => {
  const TEST_USER = 'test_user_kanban_123';

  beforeEach(() => {
    mockStorage.clear();
  });

  it('TC-APP-01: Lấy danh sách đơn nộp mặc định thành công và đầy đủ trường', () => {
    // Arrange & Act
    const list = applicationTrackerService.getApplications(TEST_USER);

    // Assert
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('companyName');
    expect(list[0]).toHaveProperty('stage');
    expect(list[0]).toHaveProperty('roleTitle');
  });

  it('TC-APP-02: Thêm mới đơn ứng tuyển gắn kết với bản CV thành công', () => {
    // Arrange
    const newAppData = {
      userId: TEST_USER,
      companyName: 'TechCorp Global',
      roleTitle: 'Senior Frontend Engineer',
      salaryExpectation: '25 - 30 Triệu',
      jobLocation: 'TP. Hồ Chí Minh',
      applicationSource: 'topcv' as const,
      linkedCvId: 'cv_custom_001',
      linkedCvTitle: 'CV Chuyên Ngành ReactJS',
      stage: 'applied' as const,
      appliedDate: '2026-11-04',
      notes: 'Đã hoàn thành nộp hồ sơ'
    };

    // Act
    const created = applicationTrackerService.createApplication(newAppData, TEST_USER);

    // Assert
    expect(created.id).toBeDefined();
    expect(created.companyName).toBe('TechCorp Global');
    expect(created.linkedCvId).toBe('cv_custom_001');

    const all = applicationTrackerService.getApplications(TEST_USER);
    expect(all.some(item => item.id === created.id)).toBe(true);
  });

  it('TC-APP-03: Chuyển đổi trạng thái (stage transition) từ applied sang assessment và offer', () => {
    // Arrange
    const list = applicationTrackerService.getApplications(TEST_USER);
    const target = list[0];

    // Act & Assert 1: Chuyển sang assessment
    const ok1 = applicationTrackerService.updateStage(target.id, 'assessment', TEST_USER);
    expect(ok1).toBe(true);

    let updated = applicationTrackerService.getApplications(TEST_USER).find(i => i.id === target.id);
    expect(updated?.stage).toBe('assessment');

    // Act & Assert 2: Chuyển sang offer
    const ok2 = applicationTrackerService.updateStage(target.id, 'offer', TEST_USER);
    expect(ok2).toBe(true);

    updated = applicationTrackerService.getApplications(TEST_USER).find(i => i.id === target.id);
    expect(updated?.stage).toBe('offer');
  });

  it('TC-APP-04: Cập nhật thông tin chi tiết (patch update) đơn ứng tuyển', () => {
    // Arrange
    const list = applicationTrackerService.getApplications(TEST_USER);
    const target = list[0];

    // Act
    const ok = applicationTrackerService.updateApplication(
      target.id, 
      {
        salaryExpectation: '35 Triệu Net',
        notes: 'Đã đàm phán xong lương với Giám đốc kỹ thuật'
      }, 
      TEST_USER
    );

    // Assert
    expect(ok).toBe(true);
    const updated = applicationTrackerService.getApplications(TEST_USER).find(i => i.id === target.id);
    expect(updated?.salaryExpectation).toBe('35 Triệu Net');
    expect(updated?.notes).toContain('Đã đàm phán xong lương');
  });

  it('TC-APP-05: Tính toán chỉ số thống kê phễu tuyển dụng (Analytics) chính xác', () => {
    // Arrange & Act
    const analytics = applicationTrackerService.getAnalytics(TEST_USER);

    // Assert
    expect(analytics.total).toBeGreaterThan(0);
    expect(analytics.active).toBeGreaterThanOrEqual(0);
    expect(analytics.responseRate).toBeGreaterThanOrEqual(0);
    expect(analytics.responseRate).toBeLessThanOrEqual(100);
  });

  it('TC-APP-06: Xóa đơn ứng tuyển khỏi danh sách thành công', () => {
    // Arrange
    const list = applicationTrackerService.getApplications(TEST_USER);
    const target = list[0];
    const originalCount = list.length;

    // Act
    const deleted = applicationTrackerService.deleteApplication(target.id, TEST_USER);

    // Assert
    expect(deleted).toBe(true);
    const remaining = applicationTrackerService.getApplications(TEST_USER);
    expect(remaining.length).toBe(originalCount - 1);
    expect(remaining.find(i => i.id === target.id)).toBeUndefined();
  });

  it('TC-APP-07: Tự động đồng bộ lịch phỏng vấn sang selfInterviewService khi chuyển sang interview', () => {
    // Arrange
    const created = applicationTrackerService.createApplication({
      userId: TEST_USER,
      companyName: 'MoMo Corporation',
      roleTitle: 'Fullstack Developer',
      applicationSource: 'linkedin',
      stage: 'screening',
      appliedDate: '2026-11-04'
    }, TEST_USER);

    // Act
    applicationTrackerService.updateApplication(created.id, {
      interviewDate: '2026-11-10 10:00'
    }, TEST_USER);
    applicationTrackerService.updateStage(created.id, 'interview', TEST_USER);

    // Assert
    const interviewSessions = selfInterviewService.getAllSessions();
    const synced = interviewSessions.find(s => s.company_name === 'MoMo Corporation');
    expect(synced).toBeDefined();
    expect(synced?.role_title).toBe('Fullstack Developer');
  });
});
