# 06 — Evidence Showcase (Interactive Pills & Smart Quick-Verify QR)

**What to build:**
Render các huy hiệu liên kết trực tiếp Live Demo / GitHub Repo chuẩn ATS trên PDF/Web. Tích hợp mã QR thu nhỏ tự động trên bản in giấy A4 để nhà tuyển dụng quét camera điện thoại mở trang xem demo thực tế.

**Blocked by:** 04 — STAR Bullet Adaptation & Diff Review Modal.

**Status:** completed

## Acceptance Criteria
- [x] Render Interactive Evidence Pills dạng hyperlink chuẩn ATS trên PDF xuất ra (`evidenceShowcase.test.ts` - 3/3 passed).
- [x] Render mã QR thu nhỏ trên bản in A4 dẫn đến trang demo/mã nguồn qua `QRCodeSVG`.
- [x] Link bấm được trên trình đọc PDF không bị lỗi, lọc an toàn `javascript:` pseudo-protocols.
