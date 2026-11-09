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
import { offerLetterService, generateSecureOfferToken } from './offerLetterService';
import { getSampleOfferParams } from './offerTemplateBank';

describe('offerLetterService', () => {
  beforeEach(() => {
    mockStorage.clear();
    vi.restoreAllMocks();
  });

  it('TC-OFFER-01: Sinh token ngẫu nhiên an toàn bắt đầu bằng off_sec_', () => {
    const token = generateSecureOfferToken();
    expect(token).toMatch(/^off_sec_[a-z0-9]{16}$/);
  });

  it('TC-OFFER-02: Tạo mới Offer thành công với trạng thái pending và đầy đủ phúc lợi', () => {
    const params = getSampleOfferParams('stu_test_1', 'Trần Bảo Long');
    const offer = offerLetterService.createOffer(params);

    expect(offer.id).toBeDefined();
    expect(offer.token).toMatch(/^off_sec_/);
    expect(offer.status).toBe('pending');
    expect(offer.candidate_name).toBe('Trần Bảo Long');
    expect(offer.benefits.length).toBeGreaterThan(0);
    expect(offer.salary_official).toBe(16000000);
    expect(offer.salary_probation).toBe(13600000);

    // Tra cứu lại bằng token
    const fetched = offerLetterService.getOfferByToken(offer.token);
    expect(fetched).not.toBeNull();
    expect(fetched?.candidate_id).toBe('stu_test_1');
  });

  it('TC-OFFER-03: Ký số điện tử chấp thuận nhận việc và cập nhật trạng thái accepted', () => {
    const params = getSampleOfferParams('stu_test_2', 'Lê Quỳnh Nga');
    const offer = offerLetterService.createOffer(params);

    const result = offerLetterService.acceptOffer(offer.token, 'Lê Quỳnh Nga');
    expect(result.success).toBe(true);
    expect(result.offer?.status).toBe('accepted');
    expect(result.offer?.digital_signature).toBe('Lê Quỳnh Nga');
    expect(result.offer?.signed_at).toBeDefined();

    // Kiểm tra không cho phép ký nếu họ tên trống
    const failResult = offerLetterService.acceptOffer(offer.token, ' ');
    expect(failResult.success).toBe(false);
  });

  it('TC-OFFER-04: Đề xuất điều chỉnh chuyển trạng thái sang negotiating và lưu ghi chú', () => {
    const params = getSampleOfferParams('stu_test_3', 'Vũ Quốc Huy');
    const offer = offerLetterService.createOffer(params);

    const result = offerLetterService.negotiateOffer(offer.token, 'Xin phép lùi ngày nhận việc sang 15/12/2026');
    expect(result.success).toBe(true);
    expect(result.offer?.status).toBe('negotiating');
    expect(result.offer?.negotiation_notes).toBe('Xin phép lùi ngày nhận việc sang 15/12/2026');
  });

  it('TC-OFFER-05: Tự động đánh dấu expired nếu ngày xem đã quá hạn deadline', () => {
    const params = getSampleOfferParams('stu_test_4', 'Đặng Thùy Dương');
    // Đặt hạn chót trong quá khứ
    params.deadlineDate = '2020-01-01';
    const offer = offerLetterService.createOffer(params);

    const fetched = offerLetterService.getOfferByToken(offer.token);
    expect(fetched?.status).toBe('expired');
  });
});
