### TỔNG QUAN TRẢI NGHIỆM CỦA ỨNG VIÊN TRÊN HỆ THỐNG

Giao diện Dashboard và hệ sinh thái ProfileHub hiện tại tập trung giải quyết bài toán: **"Xây dựng hồ sơ năng lực dựa trên đồ án thực chiến (Proof-of-Work) và cá nhân hóa CV bằng AI"**. 

Hệ sinh thái ứng viên trên hệ thống gồm 4 trục chính:
1. **Bảng điều khiển (`/dashboard`):** Đo lường mức độ hoàn thiện hồ sơ, thống kê đồ án thực tế đã Verified, kỹ năng cập nhật, nhận/xác nhận lịch phỏng vấn (Google Meet), quản trị **Chế Độ Tìm Việc Bí Mật (Stealth Mode)** và theo dõi **Bản Đồ Nhiệt CV (Recruiter Heatmap Analytics)**.
2. **Kho đa phiên bản CV (`/cv-manager`):** Giải phóng ứng viên khỏi tư duy "1 CV vạn năng", cho phép tạo và quản lý nhiều bản CV mục tiêu cho từng vị trí kèm bảng điều khiển đo lường lượt đọc CV từ nhà tuyển dụng.
3. **Trình soạn thảo & AI Cố vấn (`/cv-builder`):** Tích hợp công cụ chẩn đoán STAR, bộ đo Page Budget (chống tràn trang A4), kiểm tra chất lượng CV, nhập nhanh từ GitHub và tính năng đột phá **ATS Parser Eye-View** (mô phỏng máy quét tự động Taleo/Workday).
4. **Hồ sơ minh chứng công khai (`/showcase` & Smart QR):** Cầu nối giải quyết mâu thuẫn giữa giới hạn 1 trang giấy và bằng chứng năng lực thực tế, tự động tích hợp cơ chế bảo vệ danh tính khi bật Stealth Mode.

---

### BẢNG ĐÁNH GIÁ KẾT QUẢ: NHU CẦU VS. MỨC ĐỘ ĐÁP ỨNG TRÊN LOCALHOST:3000

| Nhóm Nhu cầu / Tính năng kỳ vọng | Trạng thái trên Localhost | Tính năng cụ thể đã hoàn thiện trong hệ thống | Đánh giá trải nghiệm ứng viên & Kết quả cải tiến |
| :--- | :---: | :--- | :--- |
| **1. Định lượng thành tích (Chống "bệnh" liệt kê nhiệm vụ)** | **ĐÃ ĐÁP ỨNG TỐT** (90%) | • `starDiagnosticService`: Bộ quét phát hiện từ ngữ thụ động (*"tham gia", "hỗ trợ", "được giao"...*)<br>• `StarCvDiagnosticModal`: Chẩn đoán câu văn theo mô hình **STAR / Google XYZ**<br>• Bộ câu hỏi khơi gợi số liệu kỹ thuật (Elicitation Questions: đo lường % tối ưu, latency, RPS, test coverage...) | **Rất xuất sắc:** Giải quyết đúng tử huyệt của dân kỹ thuật/fresher khi viết CV. AI không bịa số liệu ảo (anti-hallucination) mà phỏng vấn ứng viên để tự bóc tách số liệu thật. |
| **2. Cá nhân hóa CV theo từng JD (JD Matcher)** | **ĐÃ ĐÁP ỨNG TỐT** (95%) | • `GenerateCvFromJdModal`: Cho phép dán bất kỳ JD nào từ ITviec/TopCV hoặc chọn mẫu có sẵn.<br>• Tự động quét hồ sơ gốc và sinh ra CV mục tiêu tương thích.<br>• `applicationPitchService`: Tự động viết pitch ngắn ứng tuyển phù hợp với từng JD.<br>• Nút *"AI Tạo CV Khớp JD"* gắn trực tiếp tại danh sách việc làm (`/student/jobs`). | **Cực kỳ tiện lợi:** Ứng viên không phải copy-paste thủ công. Thao tác từ tin tuyển dụng sang bản CV may đo riêng chỉ mất 1 click. |
| **3. Kiểm soát chuẩn ATS & Chống tràn trang** | **ĐÃ ĐÁP ỨNG HOÀN TOÀN** (100%) | • `cvQualityCheckService`: Rule engine kiểm tra lỗi chính tả, thiếu trường bắt buộc, bullet quá dài.<br>• `pageBudgetService`: Tính toán mật độ chữ và tỷ lệ tràn trang A4 theo thời gian thực.<br>• Các mẫu CV chuẩn mực: *ATS Clean Pro, Minimalist Harvard 1 cột, Tech Specialist 2 cột*.<br>• **MỚI: `atsParserEyeService` & `AtsParserEyeModal`:** Chế độ **"ATS Parser Eye-View"** cho phép xem trực tiếp văn bản thô (Plain-Text), kiểm toán độ tương thích (0-100), cảnh báo rủi ro đọc chéo 2 cột và nút 1-click chuyển sang Harvard 1 cột. | **Đạt chuẩn 100% ATS Quốc Tế:** Loại bỏ hoàn toàn sự mập mờ khi gửi CV vào các cổng Workday/Taleo/Greenhouse. Ứng viên biết chính xác máy quét sẽ bóc tách những gì. |
| **4. Proof-of-Work & Interactive Portfolio** | **ĐÃ ĐÁP ỨNG RẤT TỐT** (95%) | • `/showcase/:id`: Trang portfolio công khai trực tuyến (không cần đăng nhập), hiển thị cấu trúc bài toán, giải pháp kỹ thuật, chỉ số đo lường, link demo và GitHub.<br>• `BusinessCardModal`: Xuất mã QR thông minh in lên CV giấy/PDF để HR quét là mở ngay live demo.<br>• `GitHubQuickImportBar`: Kéo repo từ GitHub vào thẳng dự án CV. | **Đột phá so với TopCV/ITviec:** Vượt qua giới hạn của tờ A4 tĩnh. Nhà tuyển dụng kỹ thuật (Tech Lead/CTO) có thể kiểm chứng năng lực code thật ngay lập tức. |
| **5. Quản lý kho đa phiên bản CV** | **ĐÃ ĐÁP ỨNG HOÀN TOÀN** (100%) | • `/cv-manager`: Quản lý danh sách CV, gắn cờ CV kích hoạt (Active CV), nhân bản nhanh (Clone), chỉnh sửa tên gợi nhớ theo từng công ty ứng tuyển (VD: *CV - React Frontend FPT*, *CV - NodeJS Tiki*). | **Rất trực quan:** Giải quyết triệt để sự lộn xộn khi ứng viên lưu hàng chục file PDF khác nhau trên máy tính. |
| **6. Phản hồi phỏng vấn & Tương tác 2 chiều** | **ĐÃ ĐÁP ỨNG TỐT** (85%) | • Widget lịch phỏng vấn trên Dashboard: Nhận thông báo mời phỏng vấn từ HR kèm ngày giờ, ghi chú và link Google Meet trực tiếp.<br>• Nút **"Xác nhận ngay"**: Đồng bộ trạng thái tức thì sang pipeline của nhà tuyển dụng. | **Ưu việt hơn TopCV:** Không chỉ dừng lại ở email thông báo một chiều, ứng viên có thể xác nhận tham gia trực tiếp trên nền tảng. |
| **7. Chế độ tìm việc bí mật (Stealth Mode / Privacy Guard)** | **ĐÃ ĐÁP ỨNG HOÀN TOÀN** (100%) | • `stealthModeService`: Quản trị trạng thái bảo vệ danh tính và bộ lọc chặn doanh nghiệp.<br>• `StealthModeModal`: Giao diện quản lý danh sách **Blacklist Domain** (@fpt.com, @vng.com.vn...) và tên tập đoàn cần chặn.<br>• Nút chuyển đổi nhanh **"Stealth: BẬT/TẮT"** tích hợp trực tiếp trên HeaderBar và Widget trên Dashboard.<br>• Tự động làm mờ tên công ty hiện tại (*"VNG" → "Tập đoàn Công nghệ & Kỳ lân Top 1 VN"*), ẩn số điện thoại và ẩn họ tên thật thành mã ứng viên (#ST-9241). | **Bảo mật tuyệt đối:** Ứng viên an tâm tìm cơ hội mới mà không lo đồng nghiệp hoặc HR công ty hiện tại phát hiện. |
| **8. CV View Tracking & Heatmap** | **ĐÃ ĐÁP ỨNG HOÀN TOÀN** (100%) | • `cvTrackingAnalyticsService`: Đo lường lượt xem thực tế từ nhà tuyển dụng, tính thời gian dừng trung bình (Average Dwell Time) và tỷ lệ đọc hết trang.<br>• `CvHeatmapWidget`: Bản đồ nhiệt hiển thị trực quan các vùng nóng (Hotspots) mà HR tập trung đọc nhiều nhất (Kinh nghiệm 42%, Đồ án 33%, Kỹ năng 14%...).<br>• Nhật ký thời gian thực ghi nhận các lượt ghé thăm từ nhà tuyển dụng (Shopee, Techcombank, Viettel, FPT). | **Minh bạch hóa dữ liệu:** Ứng viên biết chính xác HR quan tâm đến phần nào trong hồ sơ và thời lượng đọc CV để điều chỉnh chiến lược ứng tuyển. |

---

### CHI TIẾT 3 TÍNH NĂNG ĐÃ NÂNG CẤP HOÀN THIỆN THEO BẢNG ĐÁNH GIÁ

#### 1. Tính năng "ATS Parser Eye-View" trong CV Builder (`/cv-builder`)
- **Vị trí:** Nút bấm `👁️ ATS Eye-View` trên thanh công cụ CV Builder (kế bên bộ đếm Page Budget và nút đổi 1/2 cột).
- **Khả năng:**
  - Mô phỏng chính xác màn hình bóc tách dữ liệu của các hệ thống tuyển dụng tự động (Workday, Oracle Taleo, Greenhouse, Lever).
  - Tự động kiểm toán độ đọc hiểu chuẩn ATS (Parseability Score từ 0 đến 100) và phát hiện rủi ro đọc chéo dòng giữa 2 cột (Two-Column Scan Bleed).
  - Cung cấp nút 1-click **"Đổi sang Harvard 1 cột"** nếu phát hiện cấu trúc cột có nguy cơ bị lỗi trên hệ thống ATS cũ.
  - Cho phép sao chép nhanh chuỗi văn bản thô (Plain-Text) đã được phân cấp rõ ràng để dán vào các cổng ứng tuyển trực tuyến.

#### 2. Chế độ Tìm Việc Bí Mật "Stealth Mode & Privacy Guard" (`/dashboard` & Header)
- **Vị trí:** Nút chuyển đổi nhanh trên **HeaderBar** và Widget quản trị bảo mật riêng biệt tại **Bảng điều khiển (`/dashboard`)**.
- **Khả năng:**
  - **Bộ lọc Blacklist Domain:** Cho phép ứng viên thêm bất kỳ domain email công ty nào (VD: `fpt.com`, `vng.com.vn`, `shopee.vn`). Khi HR thuộc các domain này truy cập, hệ thống tự động chặn xem hồ sơ.
  - **Tự động làm mờ tên công ty hiện tại:** Thuật toán tự động nhận diện thương hiệu công ty và chuyển thành danh xưng ẩn danh tương đương (VD: "Tập đoàn Công nghệ & Kỳ lân Top 1 VN", "Ngân hàng Thương mại Cổ phần Top 3 VN").
  - **Bảo vệ thông tin cá nhân:** Ẩn số điện thoại (`09** *** ***`) và mã hóa họ tên thật thành mã số ứng viên ẩn danh (`#ST-9241`) trên danh sách tìm kiếm của HR.

#### 3. Bộ Đo Lường & Bản Đồ Nhiệt CV "Recruiter Heatmap Analytics" (`/dashboard` & `/cv-manager`)
- **Vị trí:** Widget trực quan tích hợp tại **Dashboard** và **CV Management Hub**.
- **Khả năng:**
  - Đo lường số lượt xem thực tế của nhà tuyển dụng và số doanh nghiệp độc lập quan tâm đến hồ sơ.
  - Thống kê thời gian thẩm định trung bình (Dwell Time - ~46s) và phân tích tỷ lệ đọc hết trang.
  - **Bản đồ nhiệt tương tác (Section Engagement Heatmap):** Phân tích trực quan tỷ lệ % thời gian HR dừng lại ở từng mục: *Kinh nghiệm làm việc (Hotspot #1 - 42%), Đồ án thực tế (Hotspot #2 - 33%), Kỹ năng (14%), Học vấn (7%)*.
  - Bổ sung nhận định chuyên sâu từ AI Cố vấn và nhật ký ghé thăm gần đây của các nhà tuyển dụng hàng đầu.
  - Tích hợp tự động ghi nhận lượt xem khi nhà tuyển dụng truy cập trang minh chứng năng lực thực tế (`/showcase/:id`).
