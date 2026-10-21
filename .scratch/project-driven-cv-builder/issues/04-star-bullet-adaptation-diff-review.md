# 04 — STAR Bullet Adaptation & Diff Review Modal

**What to build:**
AI cấu trúc lại câu mô tả dự án thành các gạch đầu dòng chuẩn STAR có số liệu định lượng, mở modal Diff Review so sánh song song câu gốc vs câu AI đề xuất để ứng viên duyệt hoặc sửa từng dòng, tuân thủ Anti-Hallucination Guard.

**Blocked by:** 02 — Scoped Contribution, 03 — Project Fit Explainer.

**Status:** completed

## Acceptance Criteria
- [x] Hàm `adaptProjectBulletsWithStar` sinh câu văn chuẩn STAR có số liệu định lượng (`starBulletService.test.ts` - 3/3 passed).
- [x] Tuân thủ Anti-Hallucination Guard: không tự bịa đặt thư viện/công nghệ chưa có.
- [x] Modal Diff Review (`StarDiffReviewModal.tsx`) hiển thị song song cho phép bấm [Chấp nhận], [Từ chối], [Sửa] từng dòng.
