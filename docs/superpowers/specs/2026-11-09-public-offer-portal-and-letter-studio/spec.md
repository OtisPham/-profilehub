# Đặc Tả Kỹ Thuật (Spec): Cổng Chào Đón Nhận Việc Tương Tác Công Khai & Studio Thư Mời Doanh Nghiệp (Public Interactive Offer Portal & Enterprise Offer Letter Studio)

> **Mã đặc tả:** `SPEC-20261109-PUBLIC-OFFER-PORTAL`  
> **Kế hoạch liên kết:** [`docs/superpowers/plans/2026-11-09-public-offer-portal-and-letter-studio-plan.md`](file:///C:/Users/ADMIN/Desktop/STUDY/docs/superpowers/plans/2026-11-09-public-offer-portal-and-letter-studio-plan.md)  
> **Nhánh phát triển:** `profilehub_v1`  
> **Trạng thái:** DRAFT / APPROVED FOR PLANNING  
> **Đối tượng người dùng:** Ứng viên (Public không cần đăng nhập), Nhà tuyển dụng (Recruiter/HR/Hiring Manager).

---

## 1. Mục Đích & Phạm Vi (Goals & Scope)

### Mục Đích:
- Cung cấp một trang web công khai (Public Landing Portal) tuyệt đẹp, có tính tương tác cao dành riêng cho từng ứng viên nhận được lời mời làm việc từ các công ty công nghệ sử dụng ProfileHub.
- Biến thời khắc nhận Offer trở thành một trải nghiệm vinh danh đáng nhớ (Moments of Delight), kích thích ứng viên ký nhận nhanh chóng và tự hào chia sẻ lên mạng xã hội, tạo hiệu ứng lan tỏa thương hiệu tự nhiên (Organic Viral Loop) cho cả Doanh nghiệp lẫn nền tảng ProfileHub.
- Tự động hóa việc tạo thư mời làm việc chuẩn chỉnh qua Studio trực quan phía Nhà tuyển dụng và đồng bộ tức thời với Pipeline tuyển dụng Kanban.

### Phạm Vi (Scope):
1. **Public Route `/offer/:token`:** Trang xem thư mời công khai được bảo vệ bằng token ngẫu nhiên bảo mật (NanoID/UUID).
2. **Interactive UI Elements:** Phân tích minh bạch thu nhập (Lương chính thức, Lương thử việc, Thưởng sign-on), Lưới phúc lợi biểu tượng sinh động, Đồng hồ đếm ngược thời gian chấp nhận offer.
3. **Ký số & Pháo hoa Confetti:** Ô nhập tên ký nhận điện tử, bấm xác nhận kích hoạt hiệu ứng pháo hoa chúc mừng và chuyển đổi trạng thái tức thì.
4. **Offer Letter Studio Modal:** Giao diện cho HR soạn thảo thư mời với các mẫu chuẩn hóa, cấu hình ngày làm việc, chế độ đãi ngộ, xuất bản link công khai trong 1 click.
5. **Đồng bộ trạng thái tuyển dụng:** Tự động chuyển thẻ ứng viên sang `offer_extended` khi phát hành offer và sang `hired` khi ứng viên ký chấp nhận.

---

## 2. Yêu Cầu Chức Năng (Functional Requirements)

- **FR-001 (Public Access):** Đường dẫn `/offer/:token` và `/offer/:token/preview` phải có thể truy cập tự do từ bất kỳ trình duyệt nào mà không bị chặn bởi `ProtectedRoute` hoặc bắt buộc đăng nhập tài khoản.
- **FR-002 (Offer Creation Studio):** Cung cấp modal tại `CandidatePipeline.tsx` cho phép HR nhập/chỉnh sửa thông tin Offer gồm: Tiêu đề công việc, Lương Gross/Net, Lương thử việc (%), Ngày bắt đầu làm việc, Hạn chót phản hồi (Hạn offer), Danh sách phúc lợi (MacBook, Bảo hiểm sức khỏe, Remote flex...), Lời nhắn cá nhân hóa từ Hiring Manager.
- **FR-003 (Secure Token Generator):** Mỗi thư mời khi được phát hành phải sinh ra một mã token bảo mật không đoán được (`off_sec_xxxxxxxxxxxx`), cho phép HR sao chép đường link gửi cho ứng viên.
- **FR-004 (Offer Expiration Handling):** Trang công khai phải hiển thị đồng hồ đếm ngược đến hạn chót (Deadline Countdown). Nếu quá hạn, hiển thị trạng thái "Thư mời đã hết hạn phản hồi" và hướng dẫn liên hệ lại HR.
- **FR-005 (1-Click Digital Acceptance):** Cho phép ứng viên nhập họ tên để ký xác nhận số `digital_signature` và bấm `[ 🎉 Đồng Ý Nhận Việc ]`. Khi bấm, hệ thống lưu dấu thời gian `accepted_at`, kích hoạt hiệu ứng pháo hoa chúc mừng (Confetti) và đổi trạng thái offer thành `accepted`.
- **FR-006 (Negotiation & Feedback Note):** Cho phép ứng viên gửi phản hồi đề xuất (ví dụ: muốn lùi ngày bắt đầu làm việc 1 tuần hoặc hỏi thêm về địa điểm nhận việc). Thông tin này được lưu lại với trạng thái `negotiating` và hiển thị trên Pipeline của HR.
- **FR-007 (Pipeline Kanban Auto-Sync):**
  - Khi phát hành offer: Thẻ ứng viên trên Kanban hiển thị huy hiệu `[ ✉️ Đã Gửi Offer ]`.
  - Khi ứng viên đồng ý: Thẻ ứng viên tự động chuyển cột sang `Hired (Đã Tuyển)`.
  - Khi ứng viên phản hồi thương lượng: Hiển thị tag cảnh báo `[ 💬 Đang Thương Lượng ]`.
- **FR-008 (Print & Export Clean Letter):** Hỗ trợ nút `[ 🖨️ In / Tải File Thư Mời PDF ]` tối ưu hóa CSS in ấn để in hoặc lưu trữ file tài liệu A4 trang trọng.

---

## 3. Tiêu Chuẩn Phi Chức Năng & Trải Nghiệm (Non-Functional & UX)

- **Tốc độ tải trang:** Trang `/offer/:token` phải tải tức thì (< 300ms) từ LocalStorage/Supabase Cache.
- **Responsive 100%:** Hiển thị mượt mà trên cả Smartphone (khi ứng viên mở link từ Zalo/Telegram/Email trên điện thoại) lẫn Màn hình máy tính lớn.
- **An toàn & Minh bạch dữ liệu:** Token mã hóa đủ dài để chống quét tự động (Brute-force). Không để lộ thông tin nhạy cảm của các ứng viên khác.
- **Thiết kế chuẩn Quốc Tế (High-End SaaS Taste):** Sử dụng gradient hiện đại, thẻ card kính mờ, icon trực quan, typography sắc nét, mang lại cảm giác đây là một công ty công nghệ chuyên nghiệp hàng đầu.

---

## 4. Tiêu Chuẩn Nghiệm Thu (Acceptance Criteria)

- **AC-01:** Mở cửa sổ trình duyệt ẩn danh (Incognito Mode) và truy cập `/offer/sample-token` ➔ Trang hiển thị ngay lập tức thư mời nhận việc với logo, lời chúc mừng, mức lương và danh mục phúc lợi mà không bị văng ra trang `/login`.
- **AC-02:** Nhập họ tên vào ô chữ ký và bấm `[ 🎉 Đồng Ý Nhận Việc ]` ➔ Màn hình bắn pháo hoa Confetti rực rỡ, trạng thái chuyển thành "Đã Chấp Nhận Thư Mời!", lưu trạng thái thành công.
- **AC-03:** Tại trang Pipeline Nhà Tuyển Dụng (`/recruiter/pipeline`), thẻ của ứng viên vừa chấp nhận offer tự động chuyển sang cột `Hired` với ghi chú thời gian xác nhận.
- **AC-04:** Tại trang Pipeline, bấm nút `[ ✉️ Soạn Offer ]` trên thẻ ứng viên ➔ Modal Studio mở ra, điền thông tin và bấm `[ 🚀 Phát Hành Thư Mời ]` ➔ Tạo link công khai và hiển thị nút Copy Link thành công.
- **AC-05:** Chạy `npx tsc --noEmit` đạt 0 lỗi, `npx vitest run` toàn bộ test pass 100%, `npm run build` thành công.
