# Hướng Dẫn Nghiệm Thu Nhanh: AI Mock Interview War Room (Quickstart)
> **Mã tài liệu:** `QUICKSTART-20261105-AI-MOCK-INTERVIEW-WAR-ROOM`  
> **Tính năng:** AI Mock Interview Simulator & 5-Axis Radar Skill Competency Matrix (FR-008)  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Môi Trường & Điều Kiện Tiên Quyết
* Node.js $\ge 18.0.0$, npm $\ge 9.0.0$.
* Nhánh Git: `profilehub_v1`.

---

## 2. Kịch Bản Nghiệm Thu 1: Kiểm Thử Đơn Vị Tự Động (Unit Testing)

Chạy lệnh kiểm thử tự động:
```powershell
npx vitest run src/services/aiMockInterviewService.test.ts
```

### Các tiêu chuẩn kiểm thử bắt buộc (Pass 100%):
1. **Sinh đề bài 4 chặng:** Tạo đủ 4 câu hỏi phù hợp với đồ án và công nghệ mục tiêu.
2. **Thuật toán lượng giác Radar:** Hàm `calculateRadarPolygonPoints` tạo chuỗi tọa độ SVG chính xác với mọi miền điểm 0 - 100.
3. **Đánh giá câu trả lời:** Thưởng điểm cao khi câu trả lời có số liệu định lượng (ms, RPS, %); kích hoạt câu hỏi vặn nếu thiếu bằng chứng.
4. **Tổng hợp báo cáo:** Phân loại xếp hạng tuyển dụng và tính toán trung bình 5 trục năng lực chính xác.
5. **Lưu & Đọc lịch sử:** Đảm bảo dữ liệu phiên phỏng vấn được lưu trữ và đọc an toàn không quăng lỗi.

---

## 3. Kịch Bản Nghiệm Thu 2: Trải Nghiệm Giao Diện Người Dùng (`/mock-interview`)

1. Đăng nhập tài khoản Sinh viên (`test@student.com`).
2. Nhấp vào liên kết **`🎙️ Luyện Phỏng Vấn`** trên thanh điều hướng HeaderBar (hoặc truy cập trực tiếp `/mock-interview`).
3. **Thiết lập:**
   - Chọn một đồ án trong danh sách (quan sát thấy badge `🚀 Demo Ready` hoặc `🛡️ Verified`).
   - Dán JD tuyển dụng hoặc chọn tin đăng có sẵn từ ProfileHub.
   - Bấm **`[ Bắt Đầu Phỏng Vấn ]`**.
4. **Phỏng vấn 4 chặng:**
   - Quan sát đồng hồ đếm ngược chạy theo thời gian thực.
   - Nhập câu trả lời ngắn $\to$ Quan sát AI Coach cảnh báo và Tech Lead đặt câu hỏi vặn.
   - Nhập câu trả lời có số liệu kỹ thuật $\to$ Quan sát điểm số tăng cao kèm lời khen.
5. **Báo cáo tổng kết:**
   - Quan sát **Biểu đồ Radar SVG 5 trục** mạng nhện sắc nét, đa giác hiển thị đúng các tỷ lệ điểm.
   - Quan sát xếp loại cấp bậc (`Fresher`, `Junior 1`) và dải lương khuyến nghị.
   - Bấm xem tab **Lịch sử** xác nhận phiên vừa làm đã được ghi nhận.

---

## 4. Lệnh Kiểm Tra Cổng Chất Lượng (Quality Gates)

```powershell
# 1. Chạy toàn bộ test suites
npm test -- --run

# 2. Kiểm tra TypeScript Strict
npx tsc --noEmit

# 3. Đóng gói Production
npm run build
```
* Tiêu chuẩn nghiệm thu: **100% Tests Pass**, **0 Lỗi TypeScript**, **Build Success**.
