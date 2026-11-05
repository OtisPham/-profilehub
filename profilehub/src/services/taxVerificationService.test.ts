import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  taxVerificationService, 
  validateVietnameseTaxCode, 
  computeCompanyNameSimilarity, 
  validateWorkEmailDomain, 
  generateWorkEmailOtp, 
  verifyWorkEmailOtp, 
  checkAntiSpamRateLimit, 
  recordTaxAttempt, 
  lookupTaxRegistry, 
  verifyAndSaveRecruiterTax, 
  handleCompanyInfoMutation 
} from './taxVerificationService';

// Mock localStorage cho môi trường kiểm thử
class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = value.toString(); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

const mockStorage = new LocalStorageMock();
vi.stubGlobal('localStorage', mockStorage);
vi.stubGlobal('window', {
  localStorage: mockStorage,
  dispatchEvent: vi.fn()
});

describe('Dịch Vụ Xác Thực Mã Số Thuế & Tích Xanh Doanh Nghiệp (taxVerificationService)', () => {
  beforeEach(() => {
    mockStorage.clear();
    vi.clearAllMocks();
  });

  describe('Tầng 1: Kiểm Tra Cấu Trúc & Checksum Số Kiểm Tra N10 (Thông tư 105/2020/TT-BTC)', () => {
    it('TC-TAX-01: Chấp nhận MST 10 chữ số hợp lệ và tính đúng check digit', () => {
      // VNG Corporation: 0305011749
      const vngResult = validateVietnameseTaxCode('0304132047');
      expect(vngResult.isValid).toBe(true);
      expect(vngResult.taxType).toBe('10_digit_parent');
      expect(vngResult.normalizedTaxCode).toBe('0304132047');

      // FPT Software: 0101248141
      const fptResult = validateVietnameseTaxCode('0101248141');
      expect(fptResult.isValid).toBe(true);
      expect(fptResult.taxType).toBe('10_digit_parent');

      // TechCorp Solutions: 0316892345
      const techResult = validateVietnameseTaxCode('0316892349');
      expect(techResult.isValid).toBe(true);
    });

    it('TC-TAX-02: Chấp nhận MST 13 chữ số/ký tự của chi nhánh hợp lệ', () => {
      // Chi nhánh có dấu gạch ngang
      const branchWithDash = validateVietnameseTaxCode('0304132047-001');
      expect(branchWithDash.isValid).toBe(true);
      expect(branchWithDash.taxType).toBe('13_digit_branch');

      // Chi nhánh viết liền 13 số
      const branchWithoutDash = validateVietnameseTaxCode('0304132047002');
      expect(branchWithoutDash.isValid).toBe(true);
      expect(branchWithoutDash.taxType).toBe('13_digit_branch');
    });

    it('TC-TAX-03: Từ chối MST sai Check Digit N10 (Chặn chuỗi số bịa đặt)', () => {
      // 0305011740: chữ số thứ 10 đúng phải là 9, nhập 0 là sai
      const invalidChecksum = validateVietnameseTaxCode('0305011740');
      expect(invalidChecksum.isValid).toBe(false);
      expect(invalidChecksum.error).toContain('Số kiểm tra của mã số thuế không hợp lệ');
    });

    it('TC-TAX-04: Từ chối chuỗi rác, chứa chữ cái hoặc độ dài không đúng', () => {
      expect(validateVietnameseTaxCode('').isValid).toBe(false);
      expect(validateVietnameseTaxCode('ABC1234567').isValid).toBe(false);
      expect(validateVietnameseTaxCode('12345').isValid).toBe(false);
      expect(validateVietnameseTaxCode('030413204799999').isValid).toBe(false);
    });
  });

  describe('Tầng 2: So Khớp Tên Doanh Nghiệp & Chống Mượn Danh MST', () => {
    it('TC-TAX-05: Điểm tương đồng cao giữa tên thương hiệu tự khai và tên ĐKKD', () => {
      const scoreFpt = computeCompanyNameSimilarity(
        'FPT Software',
        'CÔNG TY TNHH PHẦN MỀM FPT',
        'FPT SOFTWARE COMPANY LIMITED'
      );
      expect(scoreFpt).toBeGreaterThanOrEqual(70);

      const scoreVng = computeCompanyNameSimilarity(
        'VNG Corporation',
        'CÔNG TY CỔ PHẦN VNG',
        'VNG CORPORATION'
      );
      expect(scoreVng).toBeGreaterThanOrEqual(80);
    });

    it('TC-TAX-06: Điểm tương đồng thấp khi kẻ gian mượn danh MST của công ty khác', () => {
      const scoreMismatch = computeCompanyNameSimilarity(
        'Công Ty TNHH Lừa Đảo Đa Cấp Sao Vàng',
        'CÔNG TY CỔ PHẦN VNG',
        'VNG CORPORATION'
      );
      expect(scoreMismatch).toBeLessThan(40);
    });
  });

  describe('Tầng 3: Chống Mạo Danh Nhân Viên (Work Email Domain & OTP Verification)', () => {
    it('TC-TAX-07: Phát hiện email cá nhân công cộng (@gmail.com) và cảnh báo', () => {
      const checkGmail = validateWorkEmailDomain('tuyendung.fpt@gmail.com');
      expect(checkGmail.isWorkEmail).toBe(false);
      expect(checkGmail.domain).toBe('gmail.com');
      expect(checkGmail.warning).toBeDefined();
    });

    it('TC-TAX-08: Chấp nhận email tên miền doanh nghiệp chính chủ (@fpt.com)', () => {
      const checkFpt = validateWorkEmailDomain('hr.recruiter@fpt.com', 'fpt.com');
      expect(checkFpt.isWorkEmail).toBe(true);
      expect(checkFpt.isMatched).toBe(true);
      expect(checkFpt.domain).toBe('fpt.com');
    });

    it('TC-TAX-09: Quy trình sinh và xác minh mã OTP 6 số cho Work Email', () => {
      const recruiterId = 'test_recruiter_01';
      const otp = generateWorkEmailOtp(recruiterId, 'hr@vng.com.vn');
      expect(otp).toHaveLength(6);

      // Verify đúng mã
      expect(verifyWorkEmailOtp(recruiterId, otp)).toBe(true);

      // Verify sai mã
      expect(verifyWorkEmailOtp(recruiterId, '999999')).toBe(false);
    });
  });

  describe('Tầng 4: Cơ Chế Chống Spam & Giới Hạn Tần Suất (Rate Limiting)', () => {
    it('TC-TAX-10: Cho phép 5 lượt tra cứu và khóa khi vượt quá hạn ngạch 24h', () => {
      const recruiterId = 'spam_test_rec';

      // 5 lần thử thất bại liên tiếp (với ignoreCooldown để test quota 24h)
      for (let i = 0; i < 5; i++) {
        expect(checkAntiSpamRateLimit(recruiterId, { ignoreCooldown: true }).allowed).toBe(true);
        recordTaxAttempt(recruiterId, false);
      }

      // Lần thứ 6 bị khóa vì vượt quá hạn ngạch 5 lần/ngày
      const blocked = checkAntiSpamRateLimit(recruiterId, { ignoreCooldown: true });
      expect(blocked.allowed).toBe(false);
      expect(blocked.error).toContain('Bạn đã sử dụng hết 5 lượt tra cứu trong ngày');
    });
  });

  describe('Tầng 5: Tra Cứu Sandbox Registry & Phân Cấp Tích Xanh / Bạc', () => {
    it('TC-TAX-11: Tra cứu thành công thông tin doanh nghiệp trong Sandbox Registry', async () => {
      const result = await lookupTaxRegistry('0304132047', 'VNG Corporation');
      expect(result.legalName).toBe('CÔNG TY CỔ PHẦN VNG');
      expect(result.status).toBe('Đang hoạt động');
      expect(result.isMatchWithCompany).toBe(true);
    });

    it('TC-TAX-12: Từ chối doanh nghiệp đã ngừng hoạt động trong dữ liệu thuế', async () => {
      const result = await verifyAndSaveRecruiterTax(
        'rec_inactive_test',
        '0102030405',
        'Công Ty Test'
      );
      expect(result.success).toBe(false);
      expect(result.error).toContain('Ngừng hoạt động');
    });

    it('TC-TAX-13: Cấp Tích Xanh toàn phần (full) khi xác thực Work Email OTP', async () => {
      const recruiterId = 'rec_verified_full';
      const otp = generateWorkEmailOtp(recruiterId, 'hr@vng.com.vn');

      const result = await verifyAndSaveRecruiterTax(
        recruiterId,
        '0304132047',
        'VNG Corporation',
        'hr@vng.com.vn',
        otp
      );

      expect(result.success).toBe(true);
      expect(result.isVerified).toBe(true);
      expect(result.tier).toBe('full');
      expect(result.profile?.taxVerificationTier).toBe('full');
    });

    it('TC-TAX-14: Cấp Tích Bạc (silver) khi đăng ký bằng email cá nhân chưa có OTP', async () => {
      const recruiterId = 'rec_silver_test';
      const result = await verifyAndSaveRecruiterTax(
        recruiterId,
        '0304132047',
        'VNG Corporation',
        'recruiter.personal@gmail.com'
      );

      expect(result.success).toBe(true);
      expect(result.tier).toBe('silver');
      expect(result.profile?.taxVerificationTier).toBe('silver');
    });
  });

  describe('Tầng 6: Cơ Chế Tự Động Thu Hồi Tích Khi Đổi Thông Tin Công Ty', () => {
    it('TC-TAX-15: Đổi tên công ty tự động chuyển sang trạng thái reverification_required', () => {
      const currentProfile: any = {
        companyName: 'TechCorp Solutions Vietnam',
        taxCode: '0316892349',
        isTaxVerified: true,
        taxVerificationStatus: 'verified',
        taxVerificationTier: 'full'
      };

      // Đổi sang tên hoàn toàn khác
      const updated = handleCompanyInfoMutation(
        'rec_demote_test',
        currentProfile,
        'Công Ty Mới Khác Biệt Hoàn Toàn'
      );

      expect(updated.isTaxVerified).toBe(false);
      expect(updated.taxVerificationStatus).toBe('reverification_required');
      expect(updated.taxVerificationTier).toBe('unverified');
    });
  });
});
