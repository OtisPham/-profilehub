# 🛠️ Bản Đánh Giá Toàn Diện & Kế Hoạch Tối Ưu Hệ Thống (Fix.md)

> **Tài liệu tham chiếu:** Đánh giá sản phẩm toàn diện (Product & UX Audit) & Kế hoạch hành động đưa ProfileHub về chuẩn quen mắt, tinh gọn, tiện dụng cho ứng viên.  
> **Thư mục lưu trữ:** `profilehub/docs/product/Fix.md`  
> **Trạng thái:** Kế hoạch thực thi chính thức (Active Master Fix Plan).

---

## 🏆 1. Đánh Giá Vị Thế Thị Trường: ProfileHub Đang Ở Đâu?

Khi đặt cạnh các đối thủ lớn tại Việt Nam hiện nay:

| Nền tảng | Bản chất mô hình | Điểm mạnh | Điểm yếu chí mạng | So sánh với ProfileHub |
| :--- | :--- | :--- | :--- | :--- |
| **TopCV** | Sàn việc làm & Mẫu CV mẫu | Kho mẫu phong phú, nhiều tin tuyển dụng. | CV chỉ là **tự khai suông (Self-claim)**; dễ gian lận nhồi từ khóa (Keyword-stuffing); không có bảo chứng năng lực. | **ProfileHub vượt trội:** Đánh giá ứng viên bằng **Proof-of-Work (JEV)** có link GitHub, Live Demo và Giảng viên duyệt thật. |
| **ITviec** | Sàn việc làm chuyên IT | Uy tín trong giới Tech, mức lương minh bạch. | Thuần túy là Job Board; không có công cụ giúp ứng viên luyện phỏng vấn hay may đo CV chuyên sâu. | **ProfileHub vượt trội:** Có **Interview War Room** tự chuẩn bị đề thi thử và bẫy phản biện đồ án theo từng công ty. |
| **Canva / CakeResume** | Công cụ thiết kế trực quan | Kéo thả đồ họa tự do, thẩm mỹ cao. | Thiếu hoàn toàn "trí tuệ ngành IT"; không biết chuẩn ATS A4, không có Bareme STAR, không có kiểm tra lỗi. | **ProfileHub vượt trội:** Có **Visual Editor chuẩn ATS A4**, tính toán tỷ lệ tràn trang (Page Budget) và AI Copilot tối ưu câu chữ STAR. |

👉 **Kết luận định vị:** ProfileHub đã chọn trúng **"Long mạch"** còn bỏ ngỏ của thị trường: **Bảo chứng năng lực thực tế (Proof-of-Work)** kết hợp **Trạm tác chiến phỏng vấn thông minh (Interview War Room)**.

---

## ✨ 2. Năm Điểm Mạnh Xuất Sắc Của Website Hiện Tại

1. **Ý tưởng JEV (Job Evidence Verification):**  
   Xóa bỏ tình trạng ứng viên "nói miệng", thay thế bằng đồ án chạy thật, mã nguồn GitHub và huy hiệu Giảng viên bảo chứng (Verified Badge). Giải quyết tận gốc nỗi lo lớn nhất của nhà tuyển dụng khi tuyển sinh viên/Junior.
2. **Trạm Tác Chiến Phỏng Vấn (Interview War Room):**  
   Tính năng độc bản: Ứng viên tự note lịch hẹn phỏng vấn (từ bất kỳ đâu), hệ thống tự động dựng phòng luyện phỏng vấn AI bám sát đúng công ty đó và mở đúng bản CV đã nộp để ôn bài.
3. **Bộ Câu Hỏi Bẫy Đồ Án (Project Defense Traps):**  
   Tập dượt trước các câu hỏi xoáy kỹ thuật (*"Tại sao chọn MySQL thay vì MongoDB?", "Kiến trúc xử lý thế nào khi nghẽn mạng?"*), giúp ứng viên tự tin đối mặt với Tech Lead.
4. **Kiểm Soát Trang In Chuẩn ATS (Page Budget Service):**  
   Đo lường thời gian thực tỷ lệ lấp đầy trang in A4, có nút 1-chạm tự động thu gọn (Auto-condense) tránh tràn sang trang thứ 2 rách chữ.
5. **Nền Tảng Kỹ Thuật Rất Ổn Định:**  
   Chạy trên React 19 + TypeScript, toàn bộ **91/91 unit tests xanh 100%**, thời gian build Vite chỉ 13 giây, không lỗi runtime.

---

## ⚠️ 3. Ba Điểm Nghẽn Lớn Nhất Cần Xử Lý Ngay

1. **🔴 Điểm nghẽn 1: Hội chứng "Bội thực nút AI" (AI Button Fatigue):**  
   Website có quá nhiều tính năng hay và đang "khoe" hết ra cùng một lúc. Thanh công cụ CV Canvas nhồi hơn 12 nút; Dashboard có 4 nút nhỏ nằm ngang làm phân tán sự tập trung.
2. **🔴 Điểm nghẽn 2: Tính năng "Khảo sát lương" còn mang tính thuật toán giả định:**  
   Bảng lương hiện tại gán cứng theo công thức toán học (`BASE_SALARY_TABLE`). Cần chuyển sang dữ liệu cào thực tế từ **VietSalary (CareerViet)** và **ITviec** định kỳ 1 lần/tháng để đạt 100% uy tín.
3. **🔴 Điểm nghẽn 3: Đồ án (Proof-of-Work) bị ẩn khỏi Sidebar:**  
   Kho Đồ Án là linh hồn của ProfileHub nhưng trên thanh menu bên trái (`Sidebar.tsx`) lại không có mục này, khiến ứng viên muốn xem đồ án phải mò vào trang cá nhân.

---

## 📊 4. Bảng Điểm Đánh Giá Từng Màn Hình

| Màn hình | Điểm | Điểm mạnh | Vấn đề tồn đọng | Hướng giải quyết |
| :--- | :---: | :--- | :--- | :--- |
| **Landing Page (`/`)** | **8.5 / 10** | Hiện đại, thông điệp rõ ràng, nêu bật giá trị Proof-of-Work. | Chưa có video demo ngắn hoặc ảnh động thao tác. | Bổ sung video/gif 30s trực quan ở hero banner. |
| **Dashboard (`/dashboard`)** | **8.0 / 10** | War Room xuất sắc, thẻ chỉ số nhịp đập tuyển dụng đầy đủ. | Header có 4 nút nhỏ nằm ngang; Heatmap chiếm chỗ. | Gom Header về **1 nút Hero CTA**: `[+ Tạo CV Khớp JD]`. |
| **Quản Lý CV (`/cv-management`)** | **8.0 / 10** | Lưới thẻ CV trực quan, lọc đa ngành, nhân bản 1-chạm. | Widget Heatmap chắn ngang tầm mắt; nút 100 CV mẫu lộ thiên. | Đẩy danh sách CV lên đầu trang; giấu nút mẫu vào cài đặt. |
| **Soạn Thảo CV (`/cv-builder`)** | **7.5 / 10** | Bút sửa trực tiếp inline, tính toán tràn trang Page Budget A4 tốt. | Thanh toolbar nhồi hơn 12 nút (cả Phỏng vấn AI, Khảo sát lương). | Quy hoạch về 3 lớp: Top bar, Format bar, và Copilot side-panel. |
| **Kho Đồ Án (`/my-projects`)** | **7.5 / 10** | Giao diện nộp GitHub và nhận chứng thực Giảng viên tốt. | Bị ẩn khỏi menu Sidebar chính. | Đưa mục **"Kho Đồ Án"** ra menu Sidebar ngay dưới Profile. |

---

## 🔍 5. Chi Tiết Kế Hoạch Fix Từng Màn Hình

---

### Khu vực 1: Trình Soạn Thảo CV Canvas (`CVBuilder.tsx`)
* **Hành động:**
  1. Xóa bỏ hẳn 2 nút `Khảo Sát Lương` và `Phỏng Vấn AI` khỏi thanh ngang CV Canvas. (Các tính năng này kích hoạt đúng ngữ cảnh tại War Room).
  2. Gom thanh công cụ theo mô hình chuẩn Canva / Google Docs:
     * **Top Bar (Hệ thống):** Tên bản CV (click sửa nhanh) • Trạng thái lưu • Undo/Redo • **[Xem trước]** • **[Xuất PDF]** • **[Chia sẻ/QR]**.
     * **Canvas Sub-toolbar (Định dạng A4):** Chọn Mẫu CV • Giao diện & Font • Bố cục 1/2 cột • Thứ tự & Ngắt trang • Kéo từ hồ sơ • Page Budget Pill.
     * **Copilot Side-Panel (Trí tuệ AI bên phải):** Giữ 3 tab sạch sẽ: *[Tab 1: Soi lỗi ATS]* • *[Tab 2: Cố vấn STAR]* • *[Tab 3: Bẫy phản biện đồ án]*.

---

### Khu vực 2: Bảng Điều Khiển Trung Tâm (`Dashboard.tsx`)
* **Hành động:**
  1. **1 Nút CTA Hero Duy Nhất:** Thay vì 4 nút nhỏ, đặt 1 nút to nổi bật nhất:  
     👉 **`[+ Tạo CV May Đo Theo JD]`** (Gradient Indigo/Blue).
  2. **Đưa Smart QR Code lên làm Danh thiếp số:** Đặt nút `[Mã QR]` và `[Copy Link Showcase]` ngay cạnh Avatar của ứng viên ở đầu trang.
  3. **Đơn giản hóa Heatmap:** Thu gọn thành 1 dòng tóm tắt (*"🔥 18 lượt nhà tuyển dụng đã xem hồ sơ của bạn tuần này"*), chỉ mở rộng khi người dùng bấm vào xem chi tiết.

---

### Khu vực 3: Thanh Điều Hướng Bên Trái (`Sidebar.tsx`)
* **Hành động:** Bổ sung mục **"Kho Đồ Án"** (`/my-projects`) trực tiếp vào menu ứng viên, tạo thành cấu trúc 5 mục chuẩn quen mắt:
  1. 📊 **Dashboard** (`/dashboard`)
  2. 👤 **Hồ Sơ Cá Nhân** (`/profile`)
  3. 📂 **Kho Đồ Án (Proof-of-Work)** (`/my-projects`) — **[BỔ SUNG MỚI]**
  4. 📄 **Quản Lý CV** (`/cv-management`)
  5. 💼 **Việc Làm & Ứng Tuyển** (`/student/jobs`)

---

### Khu vực 4: Trang Quản Lý CV (`CVManagementPage.tsx`)
* **Hành động:**
  1. Đẩy danh sách thẻ CV lên vị trí ưu tiên số 1 ngay dưới thanh tìm kiếm.
  2. Đưa `CvHeatmapWidget` xuống khu vực phụ hoặc tab riêng.
  3. Ẩn nút nạp 100 CV mẫu kiểm thử vào menu nâng cao, tránh làm ứng viên thật bối rối.

---

## 🚀 6. Bảng Phân Nhiệm Triển Khai (Action Items Tracker)

| Mã Task | Tệp mã nguồn | Nội dung thực hiện cụ thể | Mức ưu tiên | Trạng thái |
| :---: | :--- | :--- | :---: | :---: |
| **FIX-01** | `src/components/layout/Sidebar.tsx` | Thêm menu **"Kho Đồ Án"** (`/my-projects`, icon `FolderKanban`) vào menu Ứng viên chuẩn 5 mục. | **P0** | ✅ **Đã Hoàn Thành 100%** |
| **FIX-02** | `src/pages/student/CVBuilder.tsx` | Gỡ bỏ 2 nút `Khảo Sát Lương` và `Phỏng Vấn AI` khỏi thanh ngang CV Canvas; dọn dẹp các nút trùng lặp đã có trên Copilot Side-Panel. | **P0** | ✅ **Đã Hoàn Thành 100%** |
| **FIX-03** | `src/pages/student/CVManagementPage.tsx` | Đẩy lưới thẻ CV lên đầu trang; chuyển `CvHeatmapWidget` xuống dưới; ẩn nút nạp 100 CV mẫu vào modal phụ. | **P1** | ✅ **Đã Hoàn Thành 100%** |
| **FIX-04** | `src/pages/student/Dashboard.tsx` | Tối ưu Header về 1 nút Hero CTA; đưa Smart QR Code lên khối Profile Summary đầu trang; tóm tắt Heatmap thành 1 dòng. | **P1** | ✅ **Đã Hoàn Thành 100%** |
| **FIX-05** | `server/python/salary_crawler/` | Xây dựng Python Crawler thu thập bảng lương thực tế từ **VietSalary (CareerViet)** định kỳ 1 lần/tháng (theo `real_market_salary_spec.md`). | **P1** | ✅ **Đã Hoàn Thành 100%** |

---

> 🎯 **Cam kết chất lượng:**  
> Sau khi hoàn thành bản kế hoạch `Fix.md` này, ProfileHub sẽ đạt sự cân bằng hoàn hảo: **Bên ngoài tinh gọn, quen mắt, dễ dùng như Canva/TopCV — Bên trong sở hữu sức mạnh chiều sâu của Proof-of-Work và Trạm tác chiến phỏng vấn War Room**.
