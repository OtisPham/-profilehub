# Data Model: Application Pipeline Tracker

## Entities & Schemas

### 1. `CandidateApplicationItem` (Đơn Ứng Tuyển)
Đối tượng đại diện cho một hồ sơ ứng tuyển của sinh viên gửi tới một doanh nghiệp.

| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :---: | :---: | :--- |
| `id` | `string` | Có | Tự sinh (`app_xxx`) | Định danh duy nhất của đơn ứng tuyển. |
| `userId` | `string` | Có | - | Định danh ứng viên sở hữu đơn. |
| `companyName` | `string` | Có | - | Tên công ty ứng tuyển (VD: VNG, FPT, MoMo). |
| `companyLogo` | `string` | Không | `undefined` | Đường dẫn ảnh đại diện/logo công ty. |
| `roleTitle` | `string` | Có | - | Vị trí công việc (VD: Frontend React Fresher). |
| `salaryExpectation` | `string` | Không | `undefined` | Mức lương kỳ vọng hoặc thỏa thuận. |
| `jobLocation` | `string` | Không | `Toàn quốc` | Địa điểm làm việc (Hà Nội, TP.HCM, Remote). |
| `applicationSource` | `string` | Có | `'profilehub'` | Nguồn ứng tuyển (`'profilehub'`, `'topcv'`, `'itviec'`, `'linkedin'`, `'referral'`, `'other'`). |
| `linkedCvId` | `string` | Không | `undefined` | ID bản CV trong kho đã nộp cho công ty này. |
| `linkedCvTitle` | `string` | Không | `undefined` | Tiêu đề bản CV hiển thị trực quan. |
| `stage` | `ApplicationStage` | Có | `'applied'` | Trạng thái hiện tại trong phễu tuyển dụng. |
| `appliedDate` | `string` | Có | Ngày hiện tại | Ngày gửi đơn (Định dạng: `YYYY-MM-DD`). |
| `interviewDate` | `string` | Không | `undefined` | Lịch hẹn phỏng vấn (Định dạng: `YYYY-MM-DD HH:mm`). |
| `jobDescriptionUrl` | `string` | Không | `undefined` | Đường dẫn tới tin tuyển dụng gốc. |
| `notes` | `string` | Không | `undefined` | Ghi chú cá nhân của ứng viên. |
| `updatedAt` | `string` | Có | ISO Timestamp | Thời điểm cập nhật cuối cùng. |

### 2. `ApplicationStage` (Các Giai Đoạn Tuyển Dụng)
```typescript
export type ApplicationStage = 
  | 'applied'      // Đã nộp hồ sơ
  | 'screening'    // HR liên hệ / Phỏng vấn sơ bộ
  | 'assessment'   // Bài test chuyên môn / Live coding
  | 'interview'    // Phỏng vấn vòng kỹ thuật / Phỏng vấn vòng cuối
  | 'offer'        // Nhận thư mời làm việc (Offer)
  | 'rejected';    // Không trúng tuyển / Từ chối offer
```

### 3. Vòng Đời & Quy Tắc Trạng Thái (State Transitions)
- Trạng thái khởi tạo mặc định là `applied`.
- Người dùng có thể tự do chuyển đổi giữa các trạng thái thông qua thao tác kéo thả hoặc nút bấm chuyển bước.
- Khi chuyển sang `interview`, nếu người dùng nhập ngày giờ, hệ thống kích hoạt đồng bộ lịch vào `selfInterviewService`.
