# Hướng Dẫn Nghiệm Thu Nhanh: 1-Click Evidence Apply & Pipeline Sync (Quickstart)
> **Mã tài liệu:** `QUICKSTART-20261105-ONE-CLICK-EVIDENCE-APPLY-PIPELINE-SYNC`  
> **Tính năng:** 1-Click Evidence-Based Apply & Real-Time Two-Way Hiring Pipeline Sync  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Môi Trường & Điều Kiện Tiên Quyết
* Node.js $\ge 18.0.0$, npm $\ge 9.0.0$.
* Nhánh Git: `profilehub_v1`.

---

## 2. Kịch Bản Nghiệm Thu 1: Kiểm Thử Đơn Vị Tự Động (Unit Testing)

Chạy lệnh kiểm thử tự động:
```powershell
npx vitest run src/services/jobApplicationService.test.ts
```

### Tiêu chuẩn kiểm thử bắt buộc (Pass 100%):
1. **Nộp đơn ứng tuyển (`submitApplication`):**
   - Tạo bản ghi đơn ứng tuyển với đầy đủ thông tin đồ án đính kèm và bản chụp snapshot CV.
   - Ngăn chặn nộp đơn trùng lặp vào cùng 1 tin tuyển dụng.
2. **Kiểm tra trạng thái (`hasStudentAppliedToJob`):**
   - Trả về `true` nếu sinh viên đã nộp đơn vào job đó, `false` nếu chưa.
3. **Đồng bộ hai chiều (`syncPipelineStageToStudent`):**
   - Khi Recruiter đổi stage sang `interview`, tự động sinh thông báo có ngày giờ, link họp và cập nhật bảng cá nhân của sinh viên.
4. **Quản lý thông báo sinh viên (`getStudentNotifications` & `markNotificationAsRead`):**
   - Lấy đúng danh sách thông báo và đánh dấu đã đọc chuẩn xác.

---

## 3. Kịch Bản Nghiệm Thu 2: Luồng Ứng Tuyển Phía Sinh Viên (`StudentJobs.tsx`)

1. Đăng nhập tài khoản Sinh viên (`test@student.com`) và truy cập `/student/jobs`.
2. Quan sát thẻ việc làm:
   - Hiển thị điểm phù hợp cá nhân (ví dụ: `88% Phù hợp`).
   - Nút hành động hiển thị rõ ràng: **`[ 🚀 Ứng Tuyển Ngay ]`**.
3. Nhấp vào nút ứng tuyển:
   - Mở modal **`ApplyWithEvidenceModal`**.
   - Chọn bản CV may đo tương ứng.
   - Chọn 1 - 2 đồ án tiêu biểu có huy hiệu **`🚀 Demo Ready`** và **`🛡️ Verified Code`**.
   - Xem trước đoạn thư giới thiệu và bấm **`[ Xác Nhận Nộp Đơn 🚀 ]`**.
4. Sau khi nộp thành công:
   - Nút trên Job Card tự động chuyển thành **`[ ✅ Đã Nộp Hồ Sơ ]`** (không cho nộp trùng).
   - Chuyển sang tab **"Tiến Trình Ứng Tuyển (Kanban)"**: Thấy ngay thẻ ứng tuyển nằm ở cột `Đã nộp`.

---

## 4. Kịch Bản Nghiệm Thu 3: Luồng Duyệt Hồ Sơ Phía Nhà Tuyển Dụng (`CandidatePipeline.tsx`)

1. Đăng nhập tài khoản Nhà tuyển dụng và truy cập `/recruiter/pipeline`.
2. Quan sát cột **`Ứng viên mới` (`discovered`)**:
   - Thấy hồ sơ của sinh viên vừa nộp xuất hiện ở đầu cột.
   - Thẻ hiển thị rõ các đồ án đính kèm kèm huy hiệu **`🚀 Demo Ready`**.
   - Nhà tuyển dụng nhấp trực tiếp vào huy hiệu `Demo Ready` ➔ Mở ngay tab mới tới Live Demo của sản phẩm để trải nghiệm.
3. Nhà tuyển dụng kéo thẻ sang cột **`Phỏng Vấn`** và đặt lịch hẹn (Google Meet).

---

## 5. Kịch Bản Nghiệm Thu 4: Nhận Thông Báo Thời Gian Thực

1. Quay trở lại tài khoản Sinh viên.
2. Quan sát biểu tượng **Chuông Thông Báo** trên `HeaderBar.tsx`:
   - Hiển thị chấm đỏ thông báo mới.
   - Bấm vào chuông: Hiển thị thông báo *"Công ty [Tên công ty] đã mời bạn tham gia phỏng vấn vị trí [Job Title] vào ngày [Date] lúc [Time] kèm link Google Meet!"*.
3. Mở tab Kanban cá nhân: Thẻ đã tự động di chuyển sang cột `Phỏng Vấn`!

---

## 6. Lệnh Kiểm Tra Cổng Chất Lượng (Quality Gates)

```powershell
# 1. Chạy toàn bộ test suites
npm test -- --run

# 2. Kiểm tra TypeScript Strict
npx tsc --noEmit

# 3. Đóng gói Production
npm run build
```
* Tiêu chuẩn nghiệm thu: **100% Tests Pass**, **0 Lỗi TypeScript**, **Build Success**.
