# ĐẶC TẢ TÍNH NĂNG MỚI: SỔ TAY GHI CHÚ & QUẢN LÝ LỊCH PHỎNG VẤN CHỦ ĐỘNG
> **Tên tính năng:** Personal Interview Tracker & Smart Coach  
> **Mã tính năng:** `FEAT-STUDENT-INTERVIEW-LOG`  
> **Đối tượng sử dụng:** Ứng viên (Sinh viên / Fresher / Developer đi tìm việc)  
> **Vị trí lưu trữ:** `profilehub/docs/product/tinhnangmoi.md`  
> **Thời điểm đề xuất:** 29/10/2026  
> **Chiến lược sản phẩm:** Giải quyết bài toán Cold-Start (Con gà & Quả trứng) trong mạng lưới tuyển dụng hai chiều.

---

## 1. BỐI CẢNH & BÀI TOÁN SẢN PHẨM (PROBLEM STATEMENT)

### 1.1. Rào cản thực tế từ phía Nhà Tuyển Dụng (HR Cold-Start)
* Khi nền tảng mới ra mắt, các doanh nghiệp và HR lớn (FPT, VNG, Shopee, MoMo...) chưa biết tới hoặc chưa có niềm tin để vào đăng ký tài khoản và thao tác đặt lịch phỏng vấn trực tiếp trên hệ thống. Họ đã có sẵn quy trình email và phần mềm ATS riêng.
* Nếu chỉ thiết kế widget phỏng vấn theo hướng "chờ đợi một chiều từ HR", màn hình Dashboard của ứng viên sẽ **mãi mãi ở trạng thái trống trơn (Empty State)**, khiến tính năng phỏng vấn và luyện AI bị lãng phí.

### 1.2. Nhu cầu thực tế của Ứng viên (Single-player Utility)
* Ứng viên rải CV ở khắp mọi kênh: TopCV, ITviec, LinkedIn, Facebook Groups, hoặc qua người quen giới thiệu.
* Khi HR gọi điện hoặc gửi email mời phỏng vấn, ứng viên hiện đang phải:
  * Ghi chú tạm bợ vào Google Calendar, Apple Notes, file Excel hoặc sổ tay.
  * Thường xuyên bị quên giờ, quên link họp Google Meet/Zoom, hoặc **quên mất mình đã nộp bản CV nào cho công ty đó và trong CV mình đã viết những gì**.

👉 **Giải pháp đột phá:** Cho phép ứng viên **TỰ GHI CHÚ VÀ LÊN LỊCH PHỎNG VẤN CHO CHÍNH MÌNH**. Dù nền tảng chưa có 1 nhà tuyển dụng nào, ProfileHub vẫn trở thành một cuốn **"Sổ tay trợ lý phỏng vấn cá nhân"** mà ứng viên mở ra mỗi ngày.

---

## 2. THIẾT KẾ TRẢI NGHIỆM NGƯỜI DÙNG (UX SPECIFICATION)

### 2.1. Điểm chạm giao diện (UI Touchpoints)
* **Vị trí 1 (Dashboard - Tiêu điểm hôm nay):** Thêm nút bấm nổi bật:  
  👉 **`[ + Thêm Lịch Phỏng Vấn Mới ]`** (Màu chàm / Indigo).
* **Vị trí 2 (Quản lý CV / Việc làm):** Nút nhanh "Lên lịch phỏng vấn cho công việc này".

### 2.2. Hộp thoại nhập liệu (Add Interview Modal)
Hộp thoại được thiết kế tinh gọn gồm các trường thông tin thực chiến:

1. **Tên Công Ty:** Ô nhập text (VD: *FPT Software*, *VNG Corporation*, *Momo Fintech*).
2. **Vị trí ứng tuyển:** (VD: *Frontend ReactJS Developer*, *Node.js Intern*).
3. **Thời gian phỏng vấn:** Bộ chọn Ngày & Giờ (Date & Time Picker).
4. **Hình thức phỏng vấn:**
   * 🌐 *Trực tuyến (Online):* Ô dán link họp (Google Meet / Zoom / Microsoft Teams).
   * 🏢 *Trực tiếp (Offline):* Ô nhập địa chỉ văn phòng công ty.
5. **Vòng phỏng vấn (Interview Stage):** Dropdown chọn:
   * *Vòng 1: HR Screening (Trao đổi sơ bộ & Văn hóa)*
   * *Vòng 2: Technical Interview (Phỏng vấn kỹ thuật & Live Coding)*
   * *Vòng 3: Manager / Final Interview (Phỏng vấn Giám đốc & Thỏa thuận Offer)*
6. **Bản CV gắn liền (Linked CV):**
   * Cho phép ứng viên chọn 1 bản CV trong **Kho CV** của mình (giúp mở ra xem lại ngay lập tức trước giờ G xem mình đã ghi những dự án gì).
7. **Ghi chú riêng tư (Candidate Notes):**
   * Ô text tự do (VD: *"HR nhắc mang theo laptop có đồ án chạy thật"*, *"Cần đọc kỹ lại kiến trúc Microservices và Redis Cache"*).

---

## 3. CHUỖI GIÁ TRỊ TÍCH HỢP TỰ ĐỘNG (THE SMART ECOSYSTEM)

Khi ứng viên tự thêm một lịch phỏng vấn, hệ thống kích hoạt tự động 4 giá trị vượt trội:

```
[Ứng viên tự thêm lịch FPT] 
       ├──► 1. Đếm ngược: "Còn 2 ngày nữa đến buổi phỏng vấn Technical"
       ├──► 2. Mở đúng bản CV đã nộp để ôn bài (Tránh "chém gió" lệch CV)
       ├──► 3. Nút 1-chạm: [🎙️ Luyện Phỏng Vấn AI Cho Job Này]
       └──► 4. Nút 1-chạm: [🛡️ Mở Bộ Câu Hỏi Bẫy Đồ Án Kỹ Thuật]
```

1. **Thẻ đếm ngược thông minh (Countdown Card):**  
   Hiển thị trạng thái khẩn cấp: *"Sắp diễn ra lúc 09:30 AM ngày mai"*.
2. **Nút 1-chạm ôn bài CV:**  
   Bấm vào là mở đúng bản CV đã gửi cho công ty đó, giúp ứng viên không bao giờ bị "lệch tủ" khi trả lời câu hỏi kinh nghiệm.
3. **Kích hoạt phòng luyện phỏng vấn AI may đo:**  
   Bấm nút `[ 🎙️ Luyện Phỏng Vấn AI ]`, hệ thống tự động truyền tên công ty + vị trí + tech stack trong bản CV đó vào **AI Mock Interviewer** để tạo buổi phỏng vấn thử sát thực tế nhất.
4. **Mở bộ câu hỏi bẫy kỹ thuật:**  
   Kết nối trực tiếp với `ProjectDefenseModal` để ứng viên ôn lại các lý do chọn công nghệ (Trade-offs) và câu chuyện gỡ lỗi sự cố (Debugging story).

---

## 4. CƠ CHẾ ĐỒNG HÓA KHI CÓ NHÀ TUYỂN DỤNG THẬT (FUTURE-PROOF COMPATIBILITY)

Hệ thống hỗ trợ 2 nguồn lịch phỏng vấn song song không bị xung đột nhờ hệ thống nhãn (Badges):

| Tiêu chí | Lịch do Ứng viên tự ghi chú (Self-scheduled) | Lịch từ Doanh nghiệp đối tác (Official Recruiter) |
| :--- | :--- | :--- |
| **Nguồn gốc** | Ứng viên nộp việc từ LinkedIn, TopCV, Email ngoài. | Nhà tuyển dụng thao tác trực tiếp trên ProfileHub. |
| **Nhãn hiển thị** | 🏷️ `Tự ghi chú` (Màu xám/xanh slate) | 🏷️ `Chính thức từ Doanh nghiệp` (Màu tím Verified) |
| **Thao tác** | Sửa, Xóa, Cập nhật trạng thái tự do. | Nút "Xác nhận tham gia" hoặc "Yêu cầu đổi giờ". |
| **Đồng bộ** | Lưu cục bộ / Supabase cá nhân. | Đồng bộ hai chiều sang bảng Pipeline của Nhà tuyển dụng. |

---

## 5. THIẾT KẾ CƠ SỞ DỮ LIỆU ĐỀ XUẤT (SCHEMA)

```typescript
export interface CandidateSelfInterviewItem {
  id: string;
  user_id: string;
  company_name: string;
  role_title: string;
  interview_date: string; // YYYY-MM-DD
  interview_time: string; // HH:mm
  format: 'online' | 'offline';
  meeting_link?: string;
  location_address?: string;
  stage: 'hr_screen' | 'technical' | 'culture_final' | 'other';
  linked_cv_id?: string;
  linked_cv_title?: string;
  personal_notes?: string;
  status: 'upcoming' | 'completed' | 'passed' | 'rejected' | 'cancelled';
  source: 'self_logged' | 'recruiter_invited';
  created_at: string;
  updated_at: string;
}
```

---

## 6. KẾ HOẠCH TRIỂN KHAI KỸ THUẬT (ACTION PLAN)

1. **Bước 1 (Service Layer):** Xây dựng `selfInterviewService.ts` quản lý CRUD lịch phỏng vấn cá nhân (lưu cache localStorage kết hợp Supabase Cloud).
2. **Bước 2 (UI Component):** Tạo component `AddSelfInterviewModal.tsx` với form nhập liệu tinh gọn và giao diện hiện đại.
3. **Bước 3 (Dashboard Integration):** Đặt nút `[ + Thêm lịch phỏng vấn ]` tại khu vực Tiêu điểm Action Center của `Dashboard.tsx`.
4. **Bước 4 (Ecosystem Bridge):** Liên kết lịch tự tạo với nút mở `AiMockInterviewModal` và `CvQuickViewModal`.
