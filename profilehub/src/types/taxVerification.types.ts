/**
 * Trạng thái xác thực Mã số thuế của doanh nghiệp
 */
export type TaxVerificationStatus = 
  | 'unverified'               // Chưa khai báo hoặc chưa xác thực
  | 'pending'                  // Đang gọi API đối chiếu
  | 'verified'                 // Đã xác thực thành công (Cấp Tích Xanh hoặc Tích Bạc)
  | 'rejected'                 // Từ chối (MST không tồn tại hoặc sai thông tin)
  | 'reverification_required'; // Cần xác thực lại (do đổi tên công ty hoặc đổi MST)

/**
 * Cấp độ huy hiệu tin cậy của doanh nghiệp
 */
export type TaxVerificationTier =
  | 'full'       // Tích Xanh Toàn Phần 🛡️: Đã khớp MST + Xác thực Email Domain công vụ (@company.com)
  | 'silver'     // Tích Bạc Tự Khai 🏷️: Đã khớp MST nhưng dùng email công cộng (@gmail.com)
  | 'unverified'; // Chưa xác thực

/**
 * Kết quả kiểm tra định dạng và checksum số kiểm tra của MST
 */
export interface TaxValidationResult {
  isValid: boolean;
  error?: string;
  normalizedTaxCode: string;
  taxType: '10_digit_parent' | '13_digit_branch' | 'invalid';
}

/**
 * Dữ liệu tra cứu doanh nghiệp từ Tax Registry API / Sandbox
 */
export interface TaxLookupResult {
  taxCode: string;
  legalName: string;
  internationalName?: string;
  shortName?: string;
  registeredAddress: string;
  status: string; // VD: "Đang hoạt động" | "Ngừng hoạt động"
  isMatchWithCompany: boolean;
  matchScore: number; // 0 đến 100%
  matchReason?: string;
  source: 'sandbox_registry' | 'vietqr_api' | 'manual_verification';
}

/**
 * Trạng thái giới hạn tần suất chống spam (Rate Limiting)
 */
export interface AntiSpamRateLimitState {
  attemptsCount: number;
  lastAttemptTimestamp: number;
  isLocked: boolean;
  lockUntilTimestamp?: number;
}

/**
 * Mở rộng thông tin Nhà tuyển dụng với các trường bảo chứng pháp lý
 */
export interface EnterpriseTaxProfile {
  taxCode?: string;
  isTaxVerified: boolean;
  taxLegalName?: string;
  taxRegisteredAddress?: string;
  taxVerificationStatus: TaxVerificationStatus;
  taxVerificationTier: TaxVerificationTier;
  taxVerifiedAt?: string;
  workEmail?: string;
  isWorkEmailVerified?: boolean;
  taxLookupPayload?: TaxLookupResult;
}
