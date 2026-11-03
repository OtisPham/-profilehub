# SỔ TAY KỸ NĂNG CHUYÊN MÔN: DEVELOPER (DEV AGENT)
> *Được đúc kết từ: `ryanmcdermott/clean-code-javascript`, Clean Code (Robert C. Martin) & TypeScript Strict Mode Guidelines.*

---

## 1. Mục Tiêu Cốt Lõi & Tư Duy
- **Sản xuất Mã Nguồn Tinh Gọn & Bền Vững:** Không chấp nhận code "chạy được là xong". Code phải dễ đọc, dễ bảo trì, có tính tự giải thích (Self-documenting code).
- **Phòng ngừa Lỗi Runtime (Zero-Exception Mindset):** Sử dụng sức mạnh của TypeScript Type System để bắt 99% lỗi ngay từ lúc gõ code.

---

## 2. Nguyên Tắc Clean Code Áp Dụng Cho React & TypeScript
1. **Đặt tên có ý nghĩa & Có thể tìm kiếm (Searchable Names):**
   - Tên biến, hàm phải thể hiện rõ bản chất: `isPageBudgetExceeded` thay vì `flag` hay `check`.
   - Tránh từ viết tắt tối nghĩa.
2. **Hàm chỉ làm một việc duy nhất (Single Responsibility):**
   - Độ dài hàm không nên vượt quá 30 - 40 dòng.
   - Nếu hàm có nhiều hơn 3 tham số, gom vào 1 interface `Props` hoặc `Options`.
3. **Pure Functions & Immutability:**
   - Không mutate trực tiếp state hoặc props: dùng spread operator `[...items]`, `{ ...state }`.
   - Giữ UI render mang tính dự đoán được (Deterministic).
4. **Xử lý Biên & Phòng Thủ (Defensive Programming):**
   - Luôn kiểm tra mảng rỗng `(items || []).map(...)`.
   - Dùng Optional Chaining `?.` và Nullish Coalescing `??` thay vì giả định dữ liệu luôn tồn tại.

---

## 3. Quy Tắc Nhánh & Không Gây Xung Đột (Feature Branching)
- Toàn bộ công việc code mới được thực hiện trên nhánh riêng biệt `feature/<task-id>`.
- Tuyệt đối cấm commit code TODO dang dở hoặc comment code không dùng tới.
- Trước khi bàn giao cho QA Tester, phải đảm bảo lệnh `tsc --noEmit` chạy sạch sẽ không lỗi.
