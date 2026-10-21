# 03 — Project Fit Explainer (Tuyển chọn & Xếp hạng Dự án theo JD)

**What to build:**
AI đối chiếu các dự án trong kho với JD văn bản dán vào, tính % tương thích, hiển thị drawer đối chiếu minh bạch các từ khóa trùng khớp/thiếu để ứng viên tích chọn đưa vào CV.

**Blocked by:** None — can start immediately.

**Status:** completed

## Acceptance Criteria
- [x] Module `projectFitService.evaluateProjectFit(projects, jdText)` tính điểm và căn cứ đối chiếu (`projectFitService.test.ts` - 3/3 passed).
- [x] Giao diện Drawer/Modal Project Fit Explainer (`ProjectFitExplainerModal.tsx`) hiển thị bảng so sánh xếp hạng, từ khóa trùng khớp/thiếu.
- [x] Cho phép ứng viên tích chọn hoặc bỏ chọn dự án trước khi đưa vào CV.
