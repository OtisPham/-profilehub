# 01 — In-Place Reverse Sync Toggle & Non-Blocking Action Toast on Save

**What to build:**
Cung cấp khả năng đồng bộ ngược (Reverse Sync) dự án mới tạo trực tiếp trong CV về Kho Quản lý dự án (`projects`). Form thêm/sửa dự án có công tắc `[x] Lưu vào Kho Quản lý dự án của tôi` (bật mặc định). Khi bấm Lưu CV, nếu bật thì tự động lưu vào bảng `projects`. Nếu lỡ tắt hoặc có dự án mới chưa đồng bộ, hệ thống hiển thị Non-blocking Action Toast trượt nhẹ trong 5s kèm nút `[Đồng bộ ngay ↗]`. Nếu ứng viên chủ động gạt TẮT, hệ thống tôn trọng ý định và không hỏi lại.

**Blocked by:** None — can start immediately.

**Status:** completed

## Acceptance Criteria
- [x] Mở rộng kiểu dữ liệu `ProjectItem` với trường `syncToMasterProfile?: boolean` (mặc định `true`).
- [x] Giao diện form nhập dự án trong CV có công tắc/checkbox `[x] Lưu vào Kho Quản lý dự án của tôi`.
- [x] Khi bấm "Lưu CV", hệ thống quét các dự án có `syncToMasterProfile === true` và tự động lưu/upsert vào bảng `projects` trong Supabase.
- [x] Nếu có dự án mới chưa được sync và không bị chủ động tắt, hiển thị Non-blocking Toast có nút `[Đồng bộ ngay ↗]` trong 5s.
- [x] Nếu ứng viên chủ động gạt `syncToMasterProfile === false`, hệ thống tôn trọng và không hiển thị Toast nhắc nhở.
- [x] Viết Unit Test TDD kiểm chứng hành vi đồng bộ, opt-out và toast trigger (`projectReverseSync.test.ts` - 3/3 passed).
