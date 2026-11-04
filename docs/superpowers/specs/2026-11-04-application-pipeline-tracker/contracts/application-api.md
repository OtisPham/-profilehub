# Interface Contract: Application Tracker Service

## Service Seam Contract: `applicationTrackerService`

### 1. `getApplications(userId?: string): CandidateApplicationItem[]`
* **Mục đích:** Lấy toàn bộ danh sách đơn ứng tuyển của người dùng.
* **Đầu vào:** `userId` (tùy chọn, mặc định lấy user đang đăng nhập hoặc khách).
* **Đầu ra:** Mảng các đối tượng `CandidateApplicationItem`, sắp xếp theo thời gian cập nhật mới nhất.

### 2. `createApplication(data: Omit<CandidateApplicationItem, 'id' | 'updatedAt'>): CandidateApplicationItem`
* **Mục đích:** Tạo mới một đơn ứng tuyển và lưu trữ an toàn.
* **Đầu vào:** Thông tin đơn ứng tuyển (Công ty, vị trí, nguồn, CV gắn liền...).
* **Đầu ra:** Bản ghi đơn ứng tuyển vừa tạo kèm ID và timestamp.
* **Sự kiện kèm theo:** Phát tín hiệu `storage` và `application_pipeline_updated`.

### 3. `updateStage(id: string, stage: ApplicationStage): boolean`
* **Mục đích:** Cập nhật giai đoạn tuyển dụng (dùng khi kéo thẻ Kanban).
* **Đầu vào:** `id` của đơn và `stage` đích.
* **Đầu ra:** `true` nếu thành công, `false` nếu không tìm thấy ID.

### 4. `updateApplication(id: string, patch: Partial<CandidateApplicationItem>): boolean`
* **Mục đích:** Cập nhật bất kỳ trường thông tin nào (mức lương, ghi chú, lịch phỏng vấn...).
* **Đầu vào:** `id` và đối tượng thay đổi.
* **Đầu ra:** `true` nếu cập nhật thành công.

### 5. `deleteApplication(id: string): boolean`
* **Mục đích:** Xóa đơn ứng tuyển khỏi bảng theo dõi.
* **Đầu ra:** `true` nếu xóa thành công.

### 6. `getAnalytics(userId?: string)`
* **Mục đích:** Tính toán các chỉ số thống kê phễu tuyển dụng.
* **Đầu ra:**
  ```typescript
  {
    total: number;        // Tổng số đơn đã nộp
    active: number;       // Số đơn đang trong quá trình (applied, screening, assessment, interview)
    interviews: number;   // Số công ty đã bước vào phỏng vấn
    offers: number;       // Số lời mời nhận việc
    responseRate: number; // Tỷ lệ có phản hồi (%) = (screening + assessment + interview + offer) / total * 100
  }
  ```
