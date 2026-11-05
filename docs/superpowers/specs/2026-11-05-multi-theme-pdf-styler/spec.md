# Đặc Tả Chức Năng: Bộ Chọn Theme & Tuỳ Biến Xuất PDF Chuyên Nghiệp (Multi-Theme PDF Styler & Professional Resume Export Studio)

> **Mã đặc tả:** `SPEC-20261105-MULTI-THEME-PDF-STYLER`  
> **Tính năng:** Multi-Theme PDF Styler, Live A4 Print Sheet Preview & Professional Resume Export Studio  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Bối Cảnh, Nhu Cầu Người Dùng & Giá Trị Sản Phẩm

### 1.1. Nỗi Đau Hiện Tại Của Ứng Viên (User Problem)
- **Thiếu màn hình chuẩn bị in (Print Studio):** Khi người dùng hoàn thiện CV trên trang `CVBuilder.tsx` và bấm nút "Xuất PDF", hệ thống hiện tại kích hoạt ngay lệnh in của trình duyệt (`window.print()`). Ứng viên không có cơ hội xem trước trang in A4 thực tế sẽ trông như thế nào, dễ gặp tình trạng tràn 1-2 dòng sang trang thứ 2 (dòng mồ côi - orphan lines).
- **Tính năng chọn mẫu CV bị "ẩn giấu":** Hệ thống đã có sẵn 6 mẫu CV thiết kế rất đẹp (`classic`, `minimal`, `tech`, `executive`, `pro_split`, `compact_ats`), nhưng chỉ được đặt trong một dropdown text nhỏ ở góc thanh công cụ. Người dùng không thấy được hình ảnh trực quan nên hiếm khi đổi mẫu.
- **Thiếu các tùy chỉnh in ấn quốc tế & bảo chứng:**
  * Nhiều công ty công nghệ đa quốc gia (Mỹ, Châu Âu, Singapore) yêu cầu hồ sơ ứng viên ẩn ảnh thẻ (Blind Hiring) để tránh thiên vị ngoại hình.
  * Ứng viên muốn chủ động bật/tắt **Mã QR Bằng chứng (Smart QR Code)** in lên góc CV để nhà tuyển dụng quét bằng điện thoại.
  * Ứng viên muốn chọn mật độ co giãn (Spacing Density: Ép 1 trang A4 gọn gàng hoặc Giãn dòng thoáng).

### 1.2. Mục Tiêu & Giải Pháp Của ProfileHub
Xây dựng modal **`PdfExportStylerModal.tsx`** đóng vai trò là một **Trạm Xuất Bản CV Chuyên Nghiệp (Professional Resume Export Studio)**:
1. **Xem trước A4 thời gian thực (Live 1:1 A4 Sheet Preview):** Mô phỏng tờ giấy A4 sắc nét với tỷ lệ chuẩn in ấn.
2. **Bộ sưu tập 6 Mẫu CV thẻ ảnh trực quan (Visual Template Picker):** Chọn nhanh mẫu Modern TopCV, Harvard Ivy League, Hacker Terminal, Timeline Milestone, Left Sidebar, Compact ATS.
3. **Bảng màu chủ đạo & Phông chữ chuẩn IT:** Chọn nhanh các tông màu hiện đại (Tech Navy, Dark Hacker, Emerald Green, Charcoal, Ruby) và font chữ Be Vietnam Pro, Inter, Lora...
4. **Bộ 4 công tắc in ấn chuyên nghiệp (Smart Print Switches):**
   - In mã QR Bằng chứng số (Smart QR).
   - Ẩn ảnh thẻ đại diện (Chuẩn quốc tế / ATS).
   - Bật/tắt nhãn huy hiệu `🚀 Demo Ready` và `🛡️ Verified Code`.
   - Điều chỉnh mật độ co giãn dòng để đảm bảo vừa khít 1 trang A4 hoàn hảo.
5. **Cảnh báo ngân sách trang in (Page Budget Guard):** Thông báo trạng thái xanh khi vừa trọn vẹn 1 trang, cảnh báo khi tràn trang.

---

## 2. Chân Dung Người Dùng & Kịch Bản Trải Nghiệm (User Scenarios)

### Kịch bản 1: Sinh viên IT xuất CV nộp công ty Product trong nước (Cần nổi bật Dự án & QR)
- **Hành động:** Nguyễn Văn A bấm **`[ Xuất PDF ]`** trên thanh công cụ `CVBuilder.tsx`.
- **Trải nghiệm:** Modal `PdfExportStylerModal` mở ra. Cột phải hiển thị tờ giấy in A4 mẫu. A nhấp chọn mẫu **"Tech Developer Terminal"**, chọn màu **Tech Indigo**, bật công tắc **"In Mã QR Bằng Chứng Số"**.
- **Kết quả:** Bản in preview cập nhật tức thì 0ms, hiển thị mã QR liên kết đến trang Showcase và nhãn `Demo Ready` cho các đồ án. A bấm `[ In / Tải PDF Ngay ]`, trình duyệt mở hộp thoại in sạch chuẩn A4.

### Kịch bản 2: Ứng viên nộp CV cho công ty công nghệ nước ngoài (Cần ẩn ảnh thẻ & tối giản)
- **Hành động:** Lê Thị Mai nộp đơn cho công ty công nghệ Singapore. Mai bấm **`[ Xuất PDF ]`**.
- **Trải nghiệm:** Mai chọn mẫu **"Minimalist Harvard"**, chọn phông **Lora (Serif)**, bật công tắc **"Ẩn ảnh thẻ đại diện (Chuẩn Blind Hiring quốc tế)"**.
- **Kết quả:** Ảnh đại diện tự động ẩn đi, bố cục co giãn căn lề học thuật Ivy League chuẩn 1 trang A4 không tì vết.

### Kịch bản 3: Ứng viên có nhiều đồ án bị tràn sang trang 2 (Cần ép trang)
- **Hành động:** Trần Văn Bình có 4 đồ án nên khi xem preview thấy nội dung chớm tràn 3 dòng sang trang 2.
- **Trải nghiệm:** Bình chuyển mật độ co giãn dòng từ `Chuẩn (Normal)` sang **`Gọn gàng (Compact)`**.
- **Kết quả:** Thanh Page Budget chuyển từ cảnh báo màu vàng sang màu xanh lá cây ("🟢 Vừa khít 1 trang A4"). Toàn bộ nội dung thu gọn vừa vặn trên 1 trang giấy in.

---

## 3. Yêu Cầu Chức Năng (Functional Requirements)

### FR-001: Màn Hình Trạm Xuất Bản In Ấn (Export Studio Modal)
- Khi người dùng nhấp nút **`[ Xuất PDF ]`** tại `CVBuilder.tsx`, modal `PdfExportStylerModal.tsx` xuất hiện phủ toàn màn hình với hiệu ứng làm mờ nền (backdrop blur).
- Bố cục chia 2 phân vùng rõ ràng:
  - Cột bên trái: Bảng điều khiển phong cách và tùy chọn in ấn (Style Controls - 380px).
  - Cột bên phải: Tờ giấy A4 xem trước thời gian thực (Live Print Sheet Preview).

### FR-002: Bộ Chọn Mẫu Giao Diện Thẻ Ảnh Trực Quan (Visual Template Picker)
- Hiển thị danh sách 6 mẫu CV dưới dạng các thẻ (cards) có hình ảnh thumbnail hoặc sơ đồ wireframe mô phỏng:
  1. `classic`: Modern Top-Banner (Băng rôn trên cùng, 2 cột bất đối xứng TopCV Pro).
  2. `minimal`: Minimalist Harvard (1 cột tối giản học thuật, kẻ hairline 0.5px Ivy League).
  3. `tech`: Tech Developer Terminal (IT Dev Stack thẻ tag, Bento Grid & link GitHub).
  4. `executive`: Timeline Milestone (Trục thời gian kẻ dọc, milestone dots nối kinh nghiệm).
  5. `pro_split`: Left Solid Sidebar (Sidebar trái liền khối màu Châu Âu, cột phải trắng).
  6. `compact_ats`: Compact 1-Page ATS (Siêu gọn gàng 1 trang A4, kỹ năng 50-50).
- Nhấp vào card mẫu nào, tờ A4 bên phải lập tức đổi giao diện sang mẫu đó.

### FR-003: Bộ Bảng Màu Chủ Đạo & Phông Chữ (Color & Typography Studio)
- Cung cấp 6 chip màu chủ đạo:
  * Xanh Navy Chuyên Nghiệp (`#1e3a8a`)
  * Tím Công Nghệ (Tech Indigo - `#4f46e5`)
  * Xanh Ngọc Lục Bảo (Emerald - `#047857`)
  * Xám Than Sang Trọng (Charcoal - `#334155`)
  * Đen Terminal Hacker (`#0f172a`)
  * Đỏ Ruby Quý Phái (`#991b1b`)
- Cung cấp bộ chọn phông chữ tiếng Việt chuẩn:
  * `Be Vietnam Pro` (Mặc định chuẩn tiếng Việt)
  * `Inter` (Sắc nét, hiện đại)
  * `Plus Jakarta Sans` (Năng động)
  * `Lora` (Cổ điển, học thuật)

### FR-004: Bộ Công Tắc In Ấn Chuyên Nghiệp (Smart Print Switches)
- **`Công tắc 1 (Smart QR Code):`** `[x] In Mã QR Bằng Chứng Số` — Bật/tắt in mã QR ở góc trên CV (kèm link trang Showcase công khai).
- **`Công tắc 2 (Blind Hiring Avatar):`** `[x] Ẩn Ảnh Thẻ Đại Diện` — Ẩn avatar cho các ứng viên nộp hồ sơ quốc tế.
- **`Công tắc 3 (Evidence Badges):`** `[x] Hiển Thị Huy Hiệu Demo Ready & Verified` — Cho phép hiện huy hiệu bảo chứng năng lực cạnh tên đồ án.
- **`Công tắc 4 (Spacing Density):`** Bộ 3 nút chọn mật độ khoảng cách dòng:
  * `Gọn gàng (Compact):` Cỡ chữ 9.5pt, khoảng cách dòng hẹp để tối ưu gom trọn 1 trang A4.
  * `Chuẩn (Normal):` Cỡ chữ 10.5pt, khoảng cách dòng tiêu chuẩn.
  * `Thoáng (Relaxed):` Cỡ chữ 11pt, khoảng cách dòng rộng cho hồ sơ ít mục.

### FR-005: Bộ Đo Ngân Sách Trang In (Page Budget Guard Bar)
- Tính toán chiều cao nội dung render so với chiều cao chuẩn của 1 trang A4 ($297\text{mm}$).
- Báo trạng thái trực quan:
  * 🟢 **Hoàn hảo:** Chiều cao $\le 100\%$ trang A4.
  * 🟡 **Cảnh báo tràn:** Chiều cao $> 100\%$ và $\le 115\%$ (hiển thị gợi ý: *"Nội dung chớm tràn 1-2 dòng, bấm chuyển sang chế độ Compact để vừa trọn 1 trang!"*).
  * 🔴 **Hồ sơ 2 trang:** Chiều cao $> 115\%$.

### FR-006: Cơ Chế In & Xuất PDF Sạch Sẽ (Clean Print Trigger)
- Khi bấm nút **`[ 🖨️ In / Tải PDF Chuẩn Kích Thước A4 ]`**:
  * Áp dụng chính xác template, bảng màu, phông chữ và các công tắc đã chọn.
  * Ẩn toàn bộ giao diện web, modal, nền xám; chỉ đưa tờ giấy A4 vào luồng in của trình duyệt với quy tắc `@media print` (`-webkit-print-color-adjust: exact`).
  * Đóng modal xem trước một cách êm ái sau khi hoàn tất.

---

## 4. Tiêu Chí Nghiệm Thu & Đo Lường (Success Criteria)

- **SC-001 (Tốc độ phản hồi tức thì):** Thao tác chuyển đổi qua lại giữa 6 mẫu giao diện và đổi màu sắc trên modal phản hồi trong thời gian dưới **50ms**, không giật lag.
- **SC-002 (Độ chính xác bản in):** Bản PDF xuất ra chuẩn tỷ lệ A4 Portrait ($210\text{mm} \times 297\text{mm}$), màu in chuẩn xác 100% so với bản preview trên màn hình.
- **SC-003 (Tương thích tính năng bảo chứng):** Mã QR thông minh khi in ra quét được bằng camera điện thoại thật dẫn thẳng về trang Showcase công khai của ứng viên.
- **SC-004 (Không ảnh hưởng kiểm thử hiện có):** Bảo toàn 100% 237 unit tests hiện tại của dự án; bổ sung thêm test suite mới bao phủ toàn bộ logic tùy biến PDF.

---

## 5. Giới Hạn & Ràng Buộc (Scope & Constraints)

- **Không dùng thư viện nặng chuyển đổi HTML sang Canvas/PDF phía client (như `html2canvas` hay `jspdf` cồng kềnh):** Sử dụng chuẩn in bản địa của trình duyệt (`window.print` kết hợp `@media print`), đảm bảo văn bản trong file PDF xuất ra là **text có thể bôi đen, tìm kiếm (searchable) và thân thiện tuyệt đối với các bộ đọc tự động ATS**, dung lượng file PDF siêu nhẹ (dưới 500KB).
- **Trạng thái lưu trữ:** Tự động ghi nhớ tùy chọn template/màu sắc yêu thích của người dùng vào `localStorage` để các lần xuất sau không phải chọn lại từ đầu.
