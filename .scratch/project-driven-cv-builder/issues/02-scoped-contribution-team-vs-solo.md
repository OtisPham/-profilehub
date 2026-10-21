# 02 — Scoped Contribution (Phân tầng Đồ án Nhóm vs Cá nhân)

**What to build:**
Bóc tách mô tả dự án thành 2 tầng: Bối cảnh quy mô sản phẩm chung của nhóm (System Scope) và Trách nhiệm kỹ thuật cá nhân (Individual Ownership), phân biệt rõ dự án cá nhân và dự án nhóm.

**Blocked by:** 01 — In-Place Reverse Sync Toggle & Non-Blocking Action Toast on Save.

**Status:** completed

## Acceptance Criteria
- [x] `ProjectItem` hỗ trợ `scopeType: 'solo' | 'team'`, `teamSize?: number`, `systemContext?: string`.
- [x] Giao diện CV Builder cho phép chọn loại dự án (Cá nhân / Nhóm) và nhập bối cảnh hệ thống chung.
- [x] Render huy hiệu `[Dự án nhóm - X thành viên]` hoặc `[Dự án cá nhân]` trên CV.
- [x] Bullet points tập trung 100% vào đóng góp cá nhân (`scopedContribution.test.ts` - 3/3 passed).
