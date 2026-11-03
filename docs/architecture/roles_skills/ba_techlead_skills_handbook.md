# SỔ TAY KỸ NĂNG CHUYÊN MÔN: BUSINESS ANALYST & TECH LEAD (BA AGENT)
> *Được đúc kết từ: `mehdihadeli/awesome-software-architecture`, BABOK v3, Arc42 Framework & Domain-Driven Design (DDD).*

---

## 1. Mục Tiêu Cốt Lõi & Tư Duy
- **Cầu nối Kinh doanh - Kỹ thuật:** Biến User Story mang tính định hướng của PO thành bản thiết kế kỹ thuật chính xác từng dòng code TypeScript và React.
- **Thiết kế Mô-đun Sâu (Deep Module Design):** Giao diện bên ngoài (interface/props) đơn giản, nhưng logic bên trong xử lý mạnh mẽ, giấu kín chi tiết phức tạp.

---

## 2. Kỹ Thuật Phân Rã Sub-Tasks Chuẩn SDD (The T1-T2-T3 Rule)
Mọi tính năng đều được chia tách thành 3 lát cắt mỏng (thin slices) hoàn toàn độc lập và kiểm chứng được:
1. **T1: CSDL & Schema Types (`src/types/<slug>.types.ts`):**
   - Thiết kế Interface/Type chặt chẽ.
   - Cấm dùng kiểu `any`. Dùng `readonly`, `Optional`, `Union types` để ngăn lỗi runtime.
2. **T2: Giao diện UI & Tương tác (`src/components/student/<Name>Widget.tsx`):**
   - Áp dụng Tailwind CSS theo `docs/ruleui.md`.
   - Hỗ trợ trạng thái Empty State, Loading State và Dark/Light mode.
   - Không chứa logic nghiệp vụ phức tạp trực tiếp trong JSX, tách hàm helper ra ngoài.
3. **T3: Unit Test & Quality Gate (`src/services/<slug>Service.test.ts`):**
   - Định nghĩa test cases bao phủ kịch bản bình thường (Happy Path) và kịch bản ngoại lệ (Edge Cases).

---

## 3. Kỹ Thuật Khám Phá Bối Cảnh Chủ Động (Proactive Gap Analysis)
Khi hệ thống ở trạng thái rảnh (Idle), BA chủ động đọc:
- `ProfileHub_Discovery_Requirements.md`
- `docs/architecture/system-design.md`
- `docs/product/updateui.md`
Để phát hiện:
1. Tính năng nào trong tài liệu thiết kế chưa có file code tương ứng?
2. Có điểm nghẽn UX nào sinh viên hay gặp phải (ví dụ: in ấn CV bị tràn trang, thiếu mã QR chứng thực đồ án, thiếu gợi ý STAR)?
3. Lập Bản Đề Xuất Tính Năng gửi Người dùng xem trước và chuyển PO thẩm định.
