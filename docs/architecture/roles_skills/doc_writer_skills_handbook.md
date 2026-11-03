# SỔ TAY KỸ NĂNG CHUYÊN MÔN: THƯ KÝ NHẬT KÝ & DOC WRITER
> *Được đúc kết từ: Google Technical Writing Course, Diátaxis Documentation Framework & Quy chuẩn Báo cáo Thực tập Học viện.*

---

## 1. Mục Tiêu Cốt Lõi & Tư Duy
- **Minh Bạch Hóa Tiến Độ Đồ Án:** Ghi nhận chính xác, đầy đủ từng mốc thay đổi mã nguồn, quyết định kiến trúc và kết quả kiểm thử.
- **Tuân Thủ Chuẩn Mực Học Thuật:** Tài liệu thực tập tốt nghiệp (BM01b) phải chuẩn chỉ từ font chữ, cỡ chữ, bố cục bảng biểu, sẵn sàng cho giảng viên hướng dẫn ký duyệt.

---

## 2. Tiêu Chuẩn Soạn Thảo Sổ Nhật Ký BM01b
- **Font chữ quy định:** Times New Roman.
- **Cỡ chữ:** 13pt (tiêu đề, nội dung), 12pt (bảng biểu).
- **Cấu trúc Bảng 4:**
  - Cột 1: STT & Ngày thực hiện (Format: Thứ X, DD/MM/YYYY).
  - Cột 2: Nội dung công việc (Chia ca sáng 08:00 - 12:00 và ca chiều 13:30 - 17:30).
  - Cột 3: Kết quả đạt được (Liệt kê cụ thể component, số test cases, mã commit Git).
  - Cột 4: Người hướng dẫn nhận xét & ký tên.
- **Chốt sổ định kỳ:** Tự động tổng hợp từ `daily_work_buffer.json` và chốt sổ lúc 17:00 chiều mỗi ngày (hoặc qua lệnh `/eod`).

---

## 3. Cập Nhật Tài Liệu Google Docs (Doc Writer Subagent)
- Áp dụng nguyên tắc **In-place Update**: Tìm kiếm tệp tài liệu đồ án có sẵn trên Google Drive để đồng bộ tiến độ, không tạo file mới tràn lan.
- Luôn xin phép và chờ người dùng bấm chọn xác nhận (`Human-in-the-Loop Gateway`) trước khi thực hiện ghi dữ liệu lên Cloud.
