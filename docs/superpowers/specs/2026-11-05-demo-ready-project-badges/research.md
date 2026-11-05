# Nghiên Cứu Kỹ Thuật: Chuyển Đổi & Nâng Cấp Huy Hiệu Đồ Án "Demo Ready" (Option B - Phân Cấp Thông Minh)
> **Mã tài liệu:** `RESEARCH-20261105-DEMO-READY-BADGES`  
> **Tính năng:** Smart Project Badges: "Demo Ready" vs "Verified Codebase"  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Bối Cảnh & Vấn Đề Kỹ Thuật

### 1.1. Rào Cản Tâm Lý Của Tag "Verified"
* Hiện tại trong ProfileHub, đồ án sinh viên chỉ có một loại huy hiệu là `🛡️ Verified` khi thỏa mãn `is_verified === true` hoặc `verification_status === 'verified'`.
* **Hạn chế 1 (Cold-Start):** Nhiều sinh viên tự học hoặc làm đồ án cá nhân/mã nguồn mở đã deploy chạy mượt mà trên Vercel/Netlify, nhưng chưa có Giảng viên xác thực nên bị gán nhãn `Unverified` hoặc không có badge. Điều này làm giảm động lực khoe dự án.
* **Hạn chế 2 (Góc nhìn Tuyển dụng):** Các Tech Lead và HR quan tâm lớn nhất đến câu hỏi: *"Sản phẩm này có chạy thật không? Có bấm vào trải nghiệm được ngay không?"*. Chữ `Verified` mang tính thủ tục hành chính, trong khi **`🟢 Demo Ready`** là một lời kêu gọi hành động (Call-to-Action) trực diện, kích thích nhà tuyển dụng nhấp chuột trải nghiệm sản phẩm.

---

## 2. Quyết Định Thiết Kế & Kiến Trúc (Design Decisions - Option B)

### Quyết định 1: Hệ Thống Phân Cấp Huy Hiệu Thông Minh (Smart Badges Taxonomy)
* **Lựa chọn:** Thiết lập 3 biến thể huy hiệu phân cấp rõ ràng dựa trên dữ liệu thực tế của đồ án:
  1. **`🚀 Demo Ready` (Sẵn sàng trải nghiệm):**
     - **Điều kiện:** Đồ án có `demo_url` hợp lệ (truy cập được qua web/mobile demo) nhưng chưa có chữ ký bảo chứng học thuật.
     - **Màu sắc & Icon:** Nền xanh emerald nhạt (`#ecfdf5`), viền `#a7f3d0`, chữ `#059669`, icon `PlayCircle` hoặc `Sparkles`.
     - **Tương tác:** Có thể click trực tiếp để mở Live Demo trong tab mới.
  2. **`🛡️ Verified Codebase` (Đã bảo chứng mã nguồn):**
     - **Điều kiện:** Đồ án có mã bảo chứng HMAC-SHA256 hoặc được Giảng viên xác nhận, nhưng tạm thời chưa có link Live Demo chạy thực tế (ví dụ: đồ án backend API, CLI tool, hoặc đồ án bảo mật NDA).
     - **Màu sắc & Icon:** Nền tím nhạt (`#f5f3ff`), viền `#ddd6fe`, chữ `#6d28d9`, icon `ShieldCheck`.
  3. **`✨ Full Verified & Demo Ready` (Bảo chứng toàn diện):**
     - **Điều kiện:** Đồ án thỏa mãn **CẢ 2** điều kiện (Vừa có Live Demo chạy thật, vừa có mã bảo chứng HMAC/Giảng viên).
     - **Màu sắc & Icon:** Nền gradient ngọc bích - chàm tinh tế, viền `#6ee7b7`, icon `ShieldCheck` + `ExternalLink`.
  4. **`Chưa có demo` (In Progress):**
     - Không hiển thị badge hoặc hiển thị nhãn phụ `Đang phát triển`.

---

### Quyết định 2: Tương Tác 1-Click Trải Nghiệm Ngay Trên Huy Hiệu
* **Lựa chọn:** Biến huy hiệu `🚀 Demo Ready` thành một phần tử có thể tương tác (Interactive Pill):
  - Khi hover vào huy hiệu: Hiển thị tooltip *"Bấm để xem sản phẩm đang chạy thực tế (Live Demo)"*.
  - Khi click vào huy hiệu (nếu có `demo_url`): Tự động mở tab mới tới đường dẫn `demo_url`.
* **Lý do lựa chọn:** Rút ngắn thao tác của Nhà tuyển dụng từ 2 bước (đọc thẻ $\to$ tìm nút Live Demo) xuống còn 1 bước duy nhất ngay tại góc tiêu đề đồ án.

---

### Quyết định 3: Tối Ưu Hóa Bộ Lọc Nhà Tuyển Dụng (`CandidateSearch.tsx`)
* **Lựa chọn:** Cập nhật bộ lọc và thẻ ứng viên trong Kho Tìm Ứng Viên:
  - Thay vì chỉ hiển thị `X Verified`, thẻ ứng viên hiển thị rõ:
    * `🚀 X Demo Ready` (Số đồ án có demo chạy thật).
    * `🛡️ Y Verified` (Số đồ án đã bảo chứng).
  - Nút lọc nhanh:
    * Chế độ 1: `[ 🚀 Có Đồ Án Demo Ready (Chạy Thật) ]` (Mặc định được khuyến khích).
    * Chế độ 2: `[ 🛡️ Có Đồ Án Verified ]`.
* **Lý do lựa chọn:** Giúp nhà tuyển dụng lọc đúng những ứng viên "nói được làm được", có sản phẩm sống để tương tác ngay trong buổi phỏng vấn.

---

### Quyết định 4: Bảo Toàn Tính Tương Thích Ngược 100% (Backward Compatibility)
* **Lựa chọn:**
  - Giữ nguyên các trường CSDL `is_verified` và `verification_status` trong `projects` và `types/database.ts`.
  - Không phá vỡ bất kỳ test suite nào trong 42 test files hiện tại.
  - Xây dựng helper function thuần túy:
    ```typescript
    export function getProjectBadgeVariant(project: {
      is_verified?: boolean;
      verification_status?: string;
      demo_url?: string;
    }): 'full' | 'demo-ready' | 'verified' | 'none';
    ```
* **Lý do lựa chọn:** Đảm bảo toàn bộ 200 unit tests tiếp tục Pass 100%, không phát sinh lỗi kiểu TypeScript hay migration rủi ro.

---

## 3. Ma Trận Đánh Giá Tác Động

| Khu vực | Trước khi cập nhật | Sau khi cập nhật Phương Án B |
| :--- | :--- | :--- |
| **`VerifiedBadge.tsx`** | Chỉ hiển thị chữ `Verified` và icon khiên xanh | Hỗ trợ 3 biến thể: `Demo Ready`, `Verified Code`, `Full Verified & Demo Ready` |
| **`MyProjects.tsx`** | Thẻ đồ án chỉ hiện icon khiên | Hiện huy hiệu `🚀 Demo Ready` hoặc `✨ Verified & Demo Ready`, click mở demo |
| **`CandidateSearch.tsx`** | `X Verified` | `🚀 X Demo Ready • 🛡️ Y Verified` |
| **`jobStudioService.ts`** | Tính điểm đồ án Verified | Tính điểm ưu tiên cho cả đồ án `Demo Ready` và `Verified` |
