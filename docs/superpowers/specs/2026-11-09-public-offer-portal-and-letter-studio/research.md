# Nghiên Cứu Kỹ Thuật (Research): Public Interactive Offer Portal & Offer Letter Studio

> **Feature:** `SPEC-20261109-PUBLIC-OFFER-PORTAL`  
> **Tài liệu:** `research.md`

---

## 1. Quyết Định Kiến Trúc Tuyến Đường Công Khai (Public Route Architecture)

- **Vấn đề:** Ứng viên nhận được thư mời qua tin nhắn hoặc email, thường mở trực tiếp trên điện thoại hoặc trình duyệt chưa đăng nhập tài khoản ProfileHub. Nếu bắt buộc đăng nhập sẽ gây ra tỷ lệ rơi rớt (Drop-off rate) và ức chế trải nghiệm người dùng.
- **Quyết định:**
  - Định tuyến công khai: Đặt Route `/offer/:token` **nằm ngoài** component bọc `ProtectedRoute` trong [`src/App.tsx`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/App.tsx) (tương tự như `/showcase/:id` và `/verify/:code`).
  - Sử dụng Token ngẫu nhiên an toàn (`off_sec_` + 16 ký tự an toàn) thay vì số thứ tự ID đơn giản để chống việc dò quét các thư mời khác.
- **Phương án thay thế đã cân nhắc:**
  - *Bắt buộc đăng nhập tài khoản Ứng viên:* Bị loại vì nhiều ứng viên nộp hồ sơ qua link tuyển dụng ngoài hoặc chưa kịp kích hoạt tài khoản.

---

## 2. Quyết Định Hiệu Ứng Vinh Danh & Chữ Ký Số (Delight & Digital Sign-off)

- **Vấn đề:** Cần tạo cảm giác trang trọng, hân hoan khi ứng viên đồng ý gia nhập, đồng thời có bằng chứng xác nhận số (Audit Trail).
- **Quyết định:**
  - Tích hợp hiệu ứng pháo hoa nhẹ nhàng bằng CSS/HTML5 Canvas Confetti không cần cài thêm thư viện nặng bên ngoài, hoặc sử dụng micro-canvas script siêu nhẹ đảm bảo load trang nhanh < 50ms.
  - Lưu trữ: `digital_signature` (Họ tên ứng viên gõ vào), `signed_at` (Dấu thời gian ISO), `ip_placeholder` hoặc browser user agent (Audit metadata).
- **Phương án thay thế đã cân nhắc:**
  - *Sử dụng DocuSign / Adobe Sign API:* Quá cồng kềnh, chi phí đắt đỏ và không cần thiết cho giai đoạn thư mời nhận việc ban đầu (Pre-onboarding).

---

## 3. Quyết Định Lưu Trữ & Đồng Bộ Dữ Liệu Hai Chiều (Data Persistence & Two-Way Sync)

- **Vấn đề:** Dữ liệu cần đồng bộ mượt mà giữa thao tác của ứng viên tại trang công khai (`/offer/:token`) và giao diện của HR tại trang quản lý (`/recruiter/pipeline`).
- **Quyết định:**
  - Thiết kế `offerLetterService.ts` quản lý state tập trung tại `profilehub_offers` trong LocalStorage với fallback sang Supabase khi có kết nối cloud.
  - Cung cấp cơ chế thông báo đồng bộ sự kiện (Storage Event Listener / Custom Dispatcher) để khi ứng viên bấm nhận việc ở tab khác, thẻ Kanban bên phía HR tự động chuyển sang cột `Hired` mà không cần reload trang.
- **Phương án thay thế đã cân nhắc:**
  - *Polling liên tục mỗi 2 giây:* Gây lãng phí tài nguyên CPU và pin điện thoại. Storage Event Listener là giải pháp zero-overhead tối ưu.
