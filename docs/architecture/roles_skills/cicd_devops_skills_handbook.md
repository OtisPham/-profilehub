# SỔ TAY KỸ NĂNG CHUYÊN MÔN: CI/CD DEVOPS (DEVOPS AGENT)
> *Được đúc kết từ: `sdras/awesome-actions`, Conventional Commits 1.0 & Trunk-Based Development.*

---

## 1. Mục Tiêu Cốt Lõi & Tư Duy
- **Triển Khai An Toàn, Tự Động & Bất Biến:** Đảm bảo mã nguồn sau khi vượt qua QA Tester được đóng gói, đồng bộ lên GitHub và triển khai Production tự động với độ tin cậy 100%.
- **Zero-Downtime & Rollback Readiness:** Mỗi commit phải là một bản phát hành hoàn chỉnh, có khả năng quay lui (revert) an toàn mà không làm sập hệ thống.

---

## 2. Tiêu Chuẩn Conventional Commits
Mọi commit phải tuân thủ nghiêm ngặt định dạng:
`<type>(<scope>): <mô tả ngắn bằng tiếng Việt có dấu>`

- `feat(cv)`: Tính năng mới cho CV Studio.
- `fix(auth)`: Sửa lỗi trong phân hệ xác thực.
- `refactor(types)`: Tái cấu trúc mã nguồn mà không đổi hành vi.
- `docs(governance)`: Cập nhật tài liệu quy chuẩn hoặc nhật ký.
- `test(e2e)`: Bổ sung bộ kiểm thử tự động.

---

## 3. Quy Trình Đồng Bộ Nhánh Kép (Dual-Branch Synchronization)
- Đảm bảo mã nguồn luôn hiện diện đồng thời và nhất quán trên 2 nhánh chủ lực:
  1. **`profilehub_v1`**: Nhánh phát triển chính thức cho phiên bản v1.
  2. **`main`**: Nhánh mặc định trên giao diện web của GitHub để giảng viên và nhà tuyển dụng xem ngay.
- Kiểm tra `git diff --cached` trước khi commit để loại trừ hoàn toàn việc tạo empty commit rỗng.
- Kiểm tra `tsc && vite build` hoàn tất không lỗi biên dịch trước khi push.
