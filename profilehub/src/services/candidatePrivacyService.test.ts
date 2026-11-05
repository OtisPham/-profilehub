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

// Mock Supabase
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    })),
  },
}));

import { candidatePrivacyService, CANDIDATE_PRIVACY_EVENT } from './candidatePrivacyService';

describe('Tầng Dịch Vụ Quyền Riêng Tư (candidatePrivacyService)', () => {
  const TEST_USER_ID = 'student_test_privacy_001';

  beforeEach(() => {
    mockStorage.clear();
    vi.clearAllMocks();
  });

  it('TC-PRIVACY-01: Lấy cấu hình mặc định an toàn khi chưa có dữ liệu lưu trữ', async () => {
    const settings = await candidatePrivacyService.getPrivacySettings(TEST_USER_ID);
    expect(settings.is_open_to_work).toBe(true);
    expect(settings.blocked_companies).toEqual([]);
    expect(settings.hide_contact_info_until_interview).toBe(false);
  });

  it('TC-PRIVACY-02: Bật / tắt chế độ Sẵn sàng nhận việc (Open to Work) và phát sự kiện', async () => {
    let eventFired = false;
    const handler = () => {
      eventFired = true;
    };
    window.addEventListener(CANDIDATE_PRIVACY_EVENT, handler);

    const updated = await candidatePrivacyService.toggleOpenToWork(TEST_USER_ID, false);
    expect(updated.is_open_to_work).toBe(false);

    // Kiểm tra cache localStorage
    const saved = JSON.parse(mockStorage.getItem(`profilehub_privacy_${TEST_USER_ID}`) || '{}');
    expect(saved.is_open_to_work).toBe(false);

    expect(eventFired).toBe(true);

    window.removeEventListener(CANDIDATE_PRIVACY_EVENT, handler);
  });

  it('TC-PRIVACY-03: Thêm công ty vào danh sách chặn và xử lý không trùng lặp', async () => {
    await candidatePrivacyService.addBlockedCompany(TEST_USER_ID, 'FPT Software');
    let settings = await candidatePrivacyService.getPrivacySettings(TEST_USER_ID);
    expect(settings.blocked_companies).toContain('FPT Software');

    // Thêm lại với chữ thường/hoa khác nhau không được nhân đôi
    await candidatePrivacyService.addBlockedCompany(TEST_USER_ID, 'fpt software');
    settings = await candidatePrivacyService.getPrivacySettings(TEST_USER_ID);
    expect(settings.blocked_companies).toHaveLength(1);

    // Thêm công ty thứ hai
    await candidatePrivacyService.addBlockedCompany(TEST_USER_ID, 'VNG Corporation');
    settings = await candidatePrivacyService.getPrivacySettings(TEST_USER_ID);
    expect(settings.blocked_companies).toHaveLength(2);
    expect(settings.blocked_companies).toEqual(['FPT Software', 'VNG Corporation']);
  });

  it('TC-PRIVACY-04: Xóa công ty khỏi danh sách chặn thành công', async () => {
    await candidatePrivacyService.addBlockedCompany(TEST_USER_ID, 'KMS Technology');
    await candidatePrivacyService.addBlockedCompany(TEST_USER_ID, 'Viettel');

    let settings = await candidatePrivacyService.getPrivacySettings(TEST_USER_ID);
    expect(settings.blocked_companies).toHaveLength(2);

    await candidatePrivacyService.removeBlockedCompany(TEST_USER_ID, 'kms technology');
    settings = await candidatePrivacyService.getPrivacySettings(TEST_USER_ID);
    expect(settings.blocked_companies).toEqual(['Viettel']);
  });

  it('TC-PRIVACY-05: Ứng viên tắt Open to Work phải bị ẩn khỏi toàn bộ nhà tuyển dụng', () => {
    const candidate = {
      is_open_to_work: false,
      blocked_companies: [],
    };

    const isVisible = candidatePrivacyService.isCandidateVisibleToCompany(candidate, 'Tập đoàn A');
    expect(isVisible).toBe(false);

    const isVisibleNoCompany = candidatePrivacyService.isCandidateVisibleToCompany(candidate, '');
    expect(isVisibleNoCompany).toBe(false);
  });

  it('TC-PRIVACY-06: Ứng viên chặn công ty X thì nhà tuyển dụng từ công ty X không được nhìn thấy', () => {
    const candidate = {
      is_open_to_work: true,
      blocked_companies: ['FPT Software', 'Shopee'],
    };

    // Kiểm tra khớp chính xác hoặc khớp chuỗi con
    expect(candidatePrivacyService.isCandidateVisibleToCompany(candidate, 'FPT Software')).toBe(false);
    expect(candidatePrivacyService.isCandidateVisibleToCompany(candidate, 'Shopee Vietnam')).toBe(false);
    expect(candidatePrivacyService.isCandidateVisibleToCompany(candidate, 'shopee')).toBe(false);
  });

  it('TC-PRIVACY-07: Ứng viên vẫn hiển thị bình thường với các nhà tuyển dụng hợp lệ', () => {
    const candidate = {
      is_open_to_work: true,
      blocked_companies: ['Công ty Bị Chặn'],
    };

    expect(candidatePrivacyService.isCandidateVisibleToCompany(candidate, 'Google Inc')).toBe(true);
    expect(candidatePrivacyService.isCandidateVisibleToCompany(candidate, 'Alpaca Tech')).toBe(true);
  });
});
