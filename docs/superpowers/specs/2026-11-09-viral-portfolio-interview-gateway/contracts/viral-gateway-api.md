# Giao Ước API & UI: Cổng Lan Tỏa Hồ Sơ & Mời Phỏng Vấn Trực Tiếp
> **Mã đặc tả:** `SPEC-20261109-VIRAL-GATEWAY`  

---

## 1. Giao Thức Hàm Nghiệp Vụ (Service Protocol)

### 1.1 `submitInboundInterviewInvite`
```typescript
function submitInboundInterviewInvite(invite: {
  verification_code: string;
  student_id: string;
  student_name: string;
  recruiter_id?: string;
  company_name: string;
  recruiter_email: string;
  role_title: string;
  proposed_date: string;
  proposed_time: string;
  meeting_link?: string;
  message?: string;
}): boolean;
```
- **Xử lý:**
  1. Thêm bản ghi vào pipeline thông qua `addToSharedPipeline`.
  2. Bắn thông điệp `INTERVIEW_SCHEDULED` qua `broadcastPipelineEvent`.
  3. Kích hoạt native notification đẩy thông báo đến trình duyệt của sinh viên.

---

## 2. Giao Ước Thành Phần Giao Diện (UI Contracts)

### 2.1 Nút & Modal Mời Phỏng Vấn Trực Tiếp (`DirectInterviewInviteModal.tsx`)
- Đặt cạnh nút **Trải Nghiệm Live Demo** trên `PublicVerificationView.tsx`:
  `[ 🏢 Mời Phỏng Vấn Trực Tiếp ]` với style gradient tím nổi bật (`from-purple-600 to-indigo-600`).
- Mở modal cho phép nhập thông tin công ty, ngày hẹn, link Google Meet và lời nhắn.
- Nút xác nhận gửi với hiệu ứng loading và toast thông báo thành công: *"Đã gửi lời mời phỏng vấn đến sinh viên!"*.

### 2.2 Widget Lan Tỏa Bài Viết (`ViralShareBadgeModal.tsx`)
- Nút `[ 🔗 Lan Tỏa & Khoe Đồ Án ]`:
  - Cung cấp nút chia sẻ nhanh lên LinkedIn với template bài viết chuyên nghiệp.
  - Cung cấp mã Markdown Badge để copy vào GitHub `README.md`.
  - Nút sao chép đường link rút gọn tra cứu chứng chỉ.
