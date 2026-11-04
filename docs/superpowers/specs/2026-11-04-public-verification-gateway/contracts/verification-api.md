# Interface Contract: Verification Gateway Service

## Service Seam Contract: `verificationService`

### 1. `getVerifiedProjectByCode(code: string): Promise<PublicVerifiedProjectRecord | null>`
* **Mục đích:** Tra cứu thông tin đồ án bảo chứng công khai theo mã xác thực.
* **Đầu vào:** `code` (chuỗi văn bản, ví dụ: `"PH-VER-A8B9C2"`).
* **Đầu ra:**
  * Nếu tìm thấy và đồ án đã được xác thực: Trả về đối tượng `PublicVerifiedProjectRecord`.
  * Nếu mã không tồn tại hoặc đồ án chưa được duyệt: Trả về `null`.
* **Ràng buộc:** Không bao giờ ném lỗi ra ngoài (Safe Fallback pattern).

### 2. `computeVerificationHash(payload): Promise<string>`
* **Mục đích:** Tính toán mã băm SHA-256 xác thực tính toàn vẹn.
* **Tham số:**
  * `projectId: string`
  * `studentId: string`
  * `teacherId: string`
  * `verifiedAt: string`
* **Đầu ra:** Chuỗi Hexadecimal 64 ký tự (chữ thường).
* **Tính tương thích:** Chạy được cả trong môi trường Trình duyệt (Web Crypto `crypto.subtle`) và Node.js test runner.

### 3. `generateVerificationCode(): string`
* **Mục đích:** Sinh mã ngẫu nhiên chuẩn Base62 theo định dạng `PH-VER-XXXXXX`.
* **Đầu ra:** Chuỗi định dạng regex `^PH-VER-[A-Z0-9]{6}$`.

---

## Route Contract: Cổng Tra Cứu `/verify/:code`

* **URL Pattern:** `https://profilehub-phi.vercel.app/verify/:code`
* **Quyền truy cập:** Công khai 100% (Không yêu cầu đăng nhập, không token JWT).
* **Layout:** Standalone Public Canvas (Không có `HeaderBar` hay `Sidebar` nội bộ, chỉ có thương hiệu ProfileHub và nút điều hướng về Landing Page).
* **Trạng thái HTTP / UI:**
  * `200 OK`: Hiển thị Giấy chứng nhận số có biểu tượng Khiên vàng 🛡️, thông tin đồ án, giảng viên bảo chứng và mã băm.
  * `404 Not Found`: Hiển thị thông báo *"Mã bảo chứng không tồn tại hoặc chưa được kích hoạt"*.
