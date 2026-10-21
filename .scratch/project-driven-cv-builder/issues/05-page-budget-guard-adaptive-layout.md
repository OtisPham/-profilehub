# 05 — Page-Budget Guard & Adaptive Layout Switcher

**What to build:**
Thanh đo dung lượng trang A4 thời gian thực (0–100%) cảnh báo khi tràn trang. Nút 1-Click AI Auto-Condense (rút gọn 10–15% giữ nguyên từ khóa) và nút chuyển mật độ dòng compact, cho phép tự do đổi giữa 1 cột và 2 cột.

**Blocked by:** 04 — STAR Bullet Adaptation & Diff Review Modal.

**Status:** completed

## Acceptance Criteria
- [x] Hook/Calculator đo chiều cao render thực tế so với chuẩn in ấn A4 (`pageBudgetService.test.ts` - 3/3 passed).
- [x] Thanh hiển thị tỷ lệ Page Budget (Xanh / Vàng / Đỏ) trực quan trên Canvas Sub-toolbar.
- [x] Tính năng 1-Click AI Auto-Condense và Density toggle bảo toàn 100% từ khóa.
- [x] Hỗ trợ chuyển đổi luân phiên bố cục 1 cột và 2 cột không ép buộc, không mất dữ liệu.
