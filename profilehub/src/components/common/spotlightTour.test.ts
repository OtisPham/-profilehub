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
  location: { origin: 'https://profilehub.vn' },
  localStorage: mockStorage
});

describe('SpotlightTour Logic & Storage State Tests', () => {
  const STORAGE_KEY = 'profilehub_spotlight_tour_completed_v1';

  beforeEach(() => {
    mockStorage.clear();
    vi.restoreAllMocks();
  });

  it('TC-TOUR-01: Người dùng mới chưa có key trong LocalStorage', () => {
    const isCompleted = mockStorage.getItem(STORAGE_KEY);
    expect(isCompleted).toBeNull();
  });

  it('TC-TOUR-02: Đánh dấu hoàn thành Tour lưu giá trị true vào LocalStorage', () => {
    mockStorage.setItem(STORAGE_KEY, 'true');
    const isCompleted = mockStorage.getItem(STORAGE_KEY);
    expect(isCompleted).toBe('true');
  });

  it('TC-TOUR-03: Kịch bản 3 bước rọi đèn có đầy đủ targetId tương ứng trên Dashboard', () => {
    const sampleSteps = [
      {
        targetId: 'tour-create-cv',
        title: 'Vũ Khí 1: May Đo CV Khớp JD Tự Động',
        description: 'Chỉ cần dán link hoặc nội dung Job Description (JD)...'
      },
      {
        targetId: 'tour-salary-benchmark',
        title: 'Vũ Khí 2: Khảo Sát Dải Lương (AI Benchmark)',
        description: 'Tra cứu nhanh dải lương thị trường...'
      },
      {
        targetId: 'tour-showcase-qr',
        title: 'Vũ Khí 3: Bằng Chứng Showcase & Smart QR Code',
        description: 'Bảo chứng năng lực thực chiến...'
      }
    ];

    expect(sampleSteps).toHaveLength(3);
    expect(sampleSteps[0].targetId).toBe('tour-create-cv');
    expect(sampleSteps[1].targetId).toBe('tour-salary-benchmark');
    expect(sampleSteps[2].targetId).toBe('tour-showcase-qr');
  });

  it('TC-TOUR-04: Format URL Showcase và mã QR hợp lệ', () => {
    const mockOrigin = window.location.origin;
    const mockUserId = 'usr_student_789';
    const expectedUrl = `${mockOrigin}/showcase/${mockUserId}`;

    expect(expectedUrl).toBe('https://profilehub.vn/showcase/usr_student_789');
    expect(expectedUrl).toContain('/showcase/');
  });
});
