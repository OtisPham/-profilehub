# Giao Kèo & Hợp Đồng Kỹ Thuật (Contracts): Offer Service API

> **Feature:** `SPEC-20261109-PUBLIC-OFFER-PORTAL`  
> **Tài liệu:** `contracts/offer-service-api.md`

---

## 1. Service Interface: `offerLetterService`

### `createOffer(params: CreateOfferParams): OfferLetter`
- **Mục đích:** Khởi tạo và lưu một bản thư mời mới, tự động sinh mã `token` bảo mật và cập nhật trạng thái ứng viên trong Pipeline thành `offer_extended`.
- **Đầu vào:**
  ```typescript
  interface CreateOfferParams {
    candidateId: string;
    candidateName: string;
    candidateEmail?: string;
    recruiterId: string;
    companyName: string;
    companyLogo?: string;
    isCompanyVerified: boolean;
    jobTitle: string;
    department: string;
    level: string;
    workplaceType: string;
    location: string;
    salaryOfficial: number;
    salaryProbation: number;
    probationPeriodMonths?: number;
    signOnBonus?: number;
    currency?: 'VND' | 'USD';
    startDate: string;
    deadlineDate: string;
    benefits: OfferBenefitItem[];
    customMessage?: string;
  }
  ```
- **Đầu ra:** Đối tượng `OfferLetter` với `status: 'pending'` và `token: 'off_sec_...'`.

---

### `getOfferByToken(token: string): OfferLetter | null`
- **Mục đích:** Lấy thông tin thư mời từ mã token công khai mà không đòi hỏi quyền đăng nhập.
- **Xử lý tự động:** Nếu `new Date() > new Date(offer.deadlineDate)` và `status === 'pending'`, tự động cập nhật và trả về `status: 'expired'`.

---

### `acceptOffer(token: string, digitalSignature: string): { success: boolean; offer: OfferLetter }`
- **Mục đích:** Ứng viên ký nhận lời mời làm việc tại trang công khai.
- **Ràng buộc:**
  - `digitalSignature` không được để trống (phải có ít nhất 2 ký tự).
  - Thư mời không được ở trạng thái `expired` hoặc `declined`.
- **Tác vụ kéo theo:**
  - Đổi trạng thái offer sang `accepted`.
  - Lưu `signed_at` là thời điểm hiện tại.
  - Tự động gọi `pipelineSync.updateCandidateStage(offer.candidateId, 'hired')` để kéo thẻ Kanban sang cột Đã Tuyển!

---

### `negotiateOffer(token: string, notes: string): { success: boolean; offer: OfferLetter }`
- **Mục đích:** Ứng viên gửi phản hồi mong muốn điều chỉnh ngày đi làm hoặc điều khoản.
- **Tác vụ kéo theo:**
  - Đổi trạng thái sang `negotiating`.
  - Lưu nội dung `negotiation_notes`.
  - Bắn sự kiện cập nhật để HR thấy cảnh báo ngay trên thẻ Pipeline.

---

### `getSampleOfferTemplate(): CreateOfferParams`
- **Mục đích:** Cung cấp sẵn một mẫu thư mời tiêu chuẩn ngành IT với đầy đủ danh mục phúc lợi (MacBook, Bảo hiểm sức khỏe VIP, Lương tháng 13...) để HR có thể tạo nhanh trong 10 giây.
