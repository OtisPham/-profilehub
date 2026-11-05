# Giao Ước Giao Tiếp & Hợp Đồng Kỹ Thuật: Xác Thực MST Doanh Nghiệp (API Contracts)
> **Mã tài liệu:** `CONTRACT-20261105-ENTERPRISE-TAX-VERIFICATION`  
> **Vị trí lưu:** [`docs/superpowers/specs/2026-11-05-enterprise-tax-code-verification/contracts/enterprise-tax-verification-api.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/specs/2026-11-05-enterprise-tax-code-verification/contracts/enterprise-tax-verification-api.md)

---

## 1. Hợp Đồng Dịch Vụ Phía Client (`taxVerificationService.ts`)

```typescript
export interface ITaxVerificationService {
  /**
   * 1. Kiểm tra định dạng & Checksum số kiểm tra của MST Việt Nam (0ms)
   */
  validateVietnameseTaxCode(taxCode: string): TaxValidationResult;

  /**
   * 2. Tra cứu cơ sở dữ liệu doanh nghiệp (Sandbox -> VietQR API -> Cache)
   */
  lookupTaxRegistry(taxCode: string, companyName?: string): Promise<TaxLookupResult>;

  /**
   * 3. Tính điểm tương đồng giữa tên khai báo và tên pháp lý trên ĐKKD (0 - 100%)
   */
  computeCompanyNameSimilarity(inputName: string, legalName: string, internationalName?: string): number;

  /**
   * 4. Thực hiện xác thực toàn diện & Cập nhật trạng thái Tích Xanh cho Nhà tuyển dụng
   */
  verifyAndSaveRecruiterTax(
    recruiterId: string, 
    taxCode: string, 
    companyName: string
  ): Promise<{
    success: boolean;
    isVerified: boolean;
    taxLookup?: TaxLookupResult;
    error?: string;
  }>;

  /**
   * 5. Kiểm tra nhanh doanh nghiệp có đạt Tích Xanh hay không
   */
  isEnterpriseVerified(recruiterId?: string): boolean;
}
```

---

## 2. Hợp Đồng API Backend Endpoint (`/api/recruiter/verify-tax`)

### Yêu Cầu Bảo Mật
- Áp dụng Middleware `requireRole(['recruiter', 'admin'])`.
- Header bắt buộc: `Authorization: Bearer <jwt_token>`.

### Request Specification
```http
POST /api/recruiter/verify-tax HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{
  "tax_code": "0305011749",
  "company_name": "VNG Corporation"
}
```

### Response Specifications

#### Trường Hợp 1: Xác Thực Thành Công (200 OK)
```json
{
  "success": true,
  "is_tax_verified": true,
  "data": {
    "tax_code": "0305011749",
    "legal_name": "CÔNG TY CỔ PHẦN VNG",
    "registered_address": "Z06 Đường số 13, Khu chế xuất Tân Thuận, Phường Tân Thuận Đông, Quận 7, TP Hồ Chí Minh",
    "status": "Đang hoạt động",
    "match_score": 95,
    "verified_at": "2026-11-05T10:15:00.000Z"
  }
}
```

#### Trường Hợp 2: Sai Định Dạng Hoặc Lỗi Check Digit (400 Bad Request)
```json
{
  "success": false,
  "error_code": "INVALID_TAX_CODE_FORMAT",
  "message": "Mã số thuế không hợp lệ. Số kiểm tra (Check digit) không khớp với quy chuẩn Bộ Tài chính."
}
```

#### Trường Hợp 3: Tên Khai Báo Không Khớp Với Tên Pháp Nhân (422 Unprocessable Entity)
```json
{
  "success": false,
  "error_code": "COMPANY_NAME_MISMATCH",
  "message": "Tên doanh nghiệp 'Công Ty ABC' không trùng khớp với tên pháp nhân 'CÔNG TY CỔ PHẦN VNG' đăng ký với cơ quan thuế (Độ tương thích: 10% < 60%)."
}
```

---

## 3. Hợp Đồng Giao Diện Người Dùng (UI Contracts)

### Component 1: `RecruiterProfile.tsx` (Trang Thiết Lập Hồ Sơ Doanh Nghiệp)
* **Ô nhập dữ liệu:** Ô nhập `Mã Số Thuế Doanh Nghiệp (MST)` có placeholder `Nhập 10 hoặc 13 chữ số (VD: 0305011749)`.
* **Nút bấm:** `[ 🛡️ Xác Thực Mã Số Thuế ]` kèm trạng thái loading xoay tròn.
* **Khu vực hiển thị kết quả:**
  * Nếu thành công: Huy hiệu `🛡️ Doanh Nghiệp Đã Xác Thực (Verified Enterprise)` màu xanh lục sáng, hiển thị Tên pháp nhân ĐKKD và Địa chỉ trụ sở.
  * Nếu tên thay đổi: Cảnh báo `⚠️ Tên công ty đã thay đổi. Vui lòng bấm xác thực lại MST để duy trì Tích Xanh`.

### Component 2: `StudentJobs.tsx` (Danh Sách Việc Làm Cho Sinh Viên)
* **Thẻ việc làm (Job Card):**
  * Hiển thị biểu tượng `🛡️ Tích Xanh` bên cạnh tên công ty nếu `is_tax_verified === true`.
* **Bộ lọc nhanh (Quick Filter Button):**
  * Thêm nút bấm: `[ 🛡️ Chỉ xem công ty có Tích Xanh ]` giúp sinh viên lọc bỏ toàn bộ các công ty chưa được xác thực.

### Component 3: `RecruiterCompanyModal.tsx` (Modal Chi Tiết Doanh Nghiệp)
* Bổ sung mục **"Xác Thực Pháp Lý Doanh Nghiệp (Enterprise Legal Verification)"**:
  * Mã số thuế: `0305011749` (có nút sao chép nhanh).
  * Tên pháp nhân: `CÔNG TY CỔ PHẦN VNG`.
  * Địa chỉ đăng ký kinh doanh: `Z06 Đường số 13, KCX Tân Thuận, TP.HCM`.
  * Huy hiệu bảo chứng: `Đã xác thực qua Tổng Cục Thuế & ProfileHub Trust Gateway`.
