import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cvService } from './cvService';

// Mock apiClient để kiểm tra cả 2 kịch bản: API thành công & API lỗi (Fallback)
vi.mock('../api/axiosClient', () => ({
  apiClient: {
    post: vi.fn()
  }
}));

// Mock supabase calls
vi.mock('./supabase', () => {
  const queryBuilder: any = {
    select: vi.fn(() => queryBuilder),
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    upsert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    update: vi.fn(() => queryBuilder),
    delete: vi.fn(() => queryBuilder),
    eq: vi.fn(() => queryBuilder),
    order: vi.fn(() => queryBuilder),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
    then: vi.fn((resolve) => Promise.resolve({ data: null, error: null }).then(resolve)),
    catch: vi.fn((reject) => Promise.resolve({ data: null, error: null }).catch(reject))
  };
  return {
    supabase: {
      from: vi.fn(() => queryBuilder)
    }
  };
});

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

describe('Tầng 3 (AI CV Generation & Quota Guardrail Seam)', () => {
  const testUserId = 'student-test-777';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('TC-GEN-01: generateTailoredCVFromJD tạo bản CV riêng biệt gắn với JD và giữ nguyên hồ sơ gốc', async () => {
    // Giả lập dữ liệu nguồn của sinh viên
    vi.spyOn(cvService, 'fetchStudentCVSourceData').mockResolvedValue({
      profile: {
        id: testUserId,
        full_name: 'Trần Thị B',
        major: 'Kỹ Thuật Phần Mềm',
        university: 'Đại Học Quốc Gia',
        skills: ['React', 'TypeScript', 'TailwindCSS'],
        bio: 'Sinh viên năm cuối ngành phần mềm'
      },
      projects: [
        {
          id: 'p1',
          title: 'Hệ thống Quản lý Đồ án Tốt nghiệp',
          role: 'Frontend Lead',
          tags: ['React', 'TypeScript']
        }
      ],
      certificates: [],
      achievements: []
    });

    const jdText = 'Tuyển Dụng Frontend React Developer. Yêu cầu thành thạo React, TypeScript.';
    const result = await cvService.generateTailoredCVFromJD({
      jdText,
      targetRole: 'Frontend React Developer',
      companyName: 'TechCorp Vietnam',
      userId: testUserId,
      userEmail: 'tranthib@example.com'
    });

    expect(result.cv).toBeDefined();
    expect(result.cv.targetRole).toBe('Frontend React Developer');
    expect(result.cv.title).toContain('TechCorp Vietnam');
    expect(result.cv.data.personalInfo.fullName).toBe('Trần Thị B');

    // Đảm bảo bản CV mới đã được lưu vào danh sách quản lý
    const allCvs = cvService.getAllCVs(testUserId);
    expect(allCvs.some(c => c.id === result.cv.id)).toBe(true);
    expect(cvService.getActiveCVId(testUserId)).toBe(result.cv.id);
  });

  it('TC-GEN-02: Cơ chế Fallback an toàn (buildLocalTailoredCvFallback) khi API AI timeout hoặc gặp sự cố', async () => {
    const { apiClient } = await import('../api/axiosClient');
    // Giả lập API backend throw error (500 hoặc Network error)
    (apiClient.post as any).mockRejectedValue(new Error('Network timeout'));

    vi.spyOn(cvService, 'fetchStudentCVSourceData').mockResolvedValue({
      profile: {
        id: testUserId,
        full_name: 'Lê Văn C',
        major: 'Khoa học Máy tính',
        skills: ['Node.js', 'Express', 'PostgreSQL'],
        bio: 'Lập trình viên backend'
      },
      projects: [],
      certificates: [],
      achievements: []
    });

    const jdText = 'Tuyển dụng Backend Node.js Developer';
    const result = await cvService.generateTailoredCVFromJD({
      jdText,
      targetRole: 'Backend Node.js Developer',
      companyName: 'Momo Fintech',
      userId: testUserId
    });

    // Hệ thống không bị crash, fallback tự động sinh CV với đầy đủ section
    expect(result.cv).toBeDefined();
    expect(result.cv.data.sections.length).toBeGreaterThan(0);
    expect(result.cv.targetRole).toBe('Backend Node.js Developer');
  });

  it('TC-GEN-03: Quota Guardrail kiểm soát chính xác 20 lượt/ngày và không bao giờ âm', () => {
    // Ban đầu người dùng có 20 lượt
    const initialQuota = cvService.getAiQuota(testUserId);
    expect(initialQuota.dailyLimit).toBe(20);
    expect(initialQuota.usedToday).toBe(0);
    expect(initialQuota.remaining).toBe(20);

    // Trừ 1 credit
    const remainingAfter1 = cvService.deductAiCredit(testUserId);
    expect(remainingAfter1).toBe(19);

    // Dùng hết sạch 20 lượt
    for (let i = 0; i < 25; i++) {
      cvService.deductAiCredit(testUserId);
    }

    const exhaustedQuota = cvService.getAiQuota(testUserId);
    expect(exhaustedQuota.usedToday).toBeGreaterThanOrEqual(20);
    // Hạn mức còn lại tuyệt đối không bị âm
    expect(exhaustedQuota.remaining).toBe(0);
  });

  it('TC-GEN-04: Quota tự động reset khi sang ngày mới', () => {
    const quotaKey = `profilehub_ai_quota_${testUserId}`;
    // Giả lập dữ liệu ngày hôm qua đã dùng hết 20 lượt
    const yesterdayQuota = {
      dailyLimit: 20,
      usedToday: 20,
      remaining: 0,
      resetDate: '2026-01-01'
    };
    localStorage.setItem(quotaKey, JSON.stringify(yesterdayQuota));

    // Khi gọi getAiQuota hôm nay, hệ thống phải tự động reset về 20 lượt mới
    const todayQuota = cvService.getAiQuota(testUserId);
    expect(todayQuota.usedToday).toBe(0);
    expect(todayQuota.remaining).toBe(20);
    expect(todayQuota.resetDate).toBe(new Date().toISOString().slice(0, 10));
  });
});
