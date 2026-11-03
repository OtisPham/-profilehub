# SỔ TAY KỸ NĂNG CHUYÊN MÔN: DEVELOPER (DEV AGENT)
> *Được đúc kết từ: `alan2207/bulletproof-react` (Enterprise React Blueprint), `goldbergyoni/nodebestpractices`, `ryanmcdermott/clean-code-javascript` & TypeScript Strict Mode Guidelines.*

---

## 1. Mục Tiêu Cốt Lõi & Tư Duy Doanh Nghiệp (Enterprise Mindset)
- **Chuẩn Mực Bulletproof React:** Không chỉ viết component rời rạc. Mỗi module phải được đóng gói khép kín (Encapsulated Feature), sẵn sàng chịu tải và mở rộng mà không phụ thuộc chéo hỗn loạn.
- **Phòng Ngừa Lỗi Runtime Tuyệt Đối (Zero-Exception & Error Boundaries):**
  - Mọi dữ liệu ngoại vi (LocalStorage, JSON parse, API response) bắt buộc phải kiểm tra biên độ hoặc schema validation.
  - Sử dụng React ErrorBoundary để bảo vệ UI, không bao giờ để xảy ra hiện tượng "trắng trang" (White Screen of Death).

---

## 2. Tiêu Chuẩn Kiến Trúc Feature-Based (`bulletproof-react`)
Mỗi tính năng lớn phải được tổ chức theo cấu trúc chuyên nghiệp:
- `components/`: Chứa các thành phần UI dùng riêng cho feature đó.
- `hooks/`: Custom hooks đóng gói logic trạng thái.
- `types/`: Type definitions & Schemas của feature.
- `services/` hoặc `api/`: Các hàm gọi API/xử lý nghiệp vụ.
- `index.ts`: File cổng xuất khẩu duy nhất (Public API) cho các module khác import vào.

---

## 3. Nguyên Tắc Clean Code Áp Dụng Cho React & TypeScript
1. **Searchable & Descriptive Names:**
   - Tên biến, hàm phải thể hiện rõ bản chất: `isPageBudgetExceeded`, `useReverseSyncState` thay vì `flag` hay `check`.
2. **Single Responsibility & Pure Functions:**
   - Độ dài hàm không nên vượt quá 35 - 40 dòng. Tách các helper tính toán ra khỏi JSX.
   - Không mutate trực tiếp state hoặc props: dùng spread operator `[...items]`, `{ ...state }`.
3. **Defensive Programming & Null-Safety:**
   - Luôn phòng vệ mảng rỗng: `(items || []).map(...)`.
   - Luôn sử dụng Optional Chaining `?.` và Nullish Coalescing `??`.
4. **Accessible & Responsive UI (WCAG 2.1 AA):**
   - Đảm bảo đầy đủ `aria-label`, trạng thái `focus:ring-2`, tương thích hoàn hảo trên cả Mobile, Tablet và Desktop.

---

## 4. Quy Tắc Nhánh & Quality Gate Trước Bàn Giao
- Toàn bộ công việc code mới được thực hiện trên nhánh riêng biệt `feature/<task-id>`.
- Tuyệt đối cấm commit code TODO dang dở hoặc comment code rác.
- Trước khi bàn giao cho QA Tester, phải đảm bảo lệnh `tsc --noEmit && vite build` chạy sạch sẽ 100% không cảnh báo.
