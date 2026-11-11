# Đặc Tả Kỹ Thuật: Bộ Tiện Ích Siêu Tốc Độ Tuyển Dụng Dành Cho Sinh Viên & HR
# (Student & HR Convenience & Velocity Suite)
> **Mã đặc tả:** `SPEC-20261111-VELOCITY-SUITE`  
> **Nhánh Git:** `profilehub_v1`  
> **Thư mục tài liệu:** `docs/superpowers/specs/2026-11-11-student-hr-convenience-and-velocity-suite/`  
> **Tài liệu tham chiếu:** [`profilehub/docs/product/spec.md`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/docs/product/spec.md) (v3.1 Enterprise — FR-026 đến FR-032)  
> **Mục tiêu cốt lõi:** Loại bỏ triệt để ma sát thao tác chuột, rút ngắn 80% thời gian sàng lọc hồ sơ cho HR và xóa bỏ tình trạng lệch giờ/quên lịch phỏng vấn cho Sinh viên.

---

## 1. Bối Cảnh & Vấn Đề Cần Giải Quyết

1. **Gánh nặng sàng lọc thủ công của HR (Screening Fatigue):**
   - Khi vị trí tuyển dụng nhận được 30–50 hồ sơ, HR phải mở từng modal, chuyển qua lại giữa các tab trình duyệt và đọc lướt các đoạn CV dài, dẫn đến mệt mỏi và dễ bỏ sót ứng viên tiềm năng.
   - Khi từ chối hoặc giao bài test, HR phải copy-paste từng email thủ công.

2. **Khó khăn sắp xếp lịch & quên hạn chót của Sinh viên (Scheduling Friction & Missed Deadlines):**
   - Sinh viên vướng lịch học, lịch thi tại trường nên khi HR ấn định giờ phỏng vấn cố định, hai bên phải gửi 3-4 email xin đổi giờ.
   - Các bài test kỹ thuật có hạn chót 48h-72h nhưng sinh viên không có công cụ nhắc nhở trực quan, dễ bị trễ hạn nộp bài.

3. **Tâm lý căng thẳng trước giờ phỏng vấn (Pre-Interview Anxiety):**
   - Sinh viên thường bối rối trước giờ G, mất thời gian tìm lại các số liệu kỹ thuật then chốt của đồ án (Lighthouse, RPS, test coverage) để trả lời Tech Lead.

---

## 2. Danh Mục Yêu Cầu Chức Năng (Functional Requirements)

* **FR-026 (Speed Screener & Keyboard Shortcuts):** Giao diện chia đôi màn hình (Split View) duyệt hồ sơ tốc độ cao, hỗ trợ phím tắt `J`/`K` (chuyển ứng viên), `A` (chấp nhận), `T` (giao test), `R` (từ chối), `O` (mở repo/demo), phản hồi $< 50ms$.
* **FR-027 (Calendar Sync & Challenge Deadline Countdown):** Đồng bộ 1-click sự kiện phỏng vấn sang Google Calendar và file `.ics` (RFC 5545). Đồng hồ đếm ngược hạn chót nộp bài test 3 màu trực quan.
* **FR-028 (Dual-Sided Smart Slot Picker):** Cơ chế chọn khung giờ phỏng vấn tự động hai chiều kiểu Calendly. HR mở 3-5 slot rảnh $\rightarrow$ Sinh viên chọn 1 slot $\rightarrow$ Tự động sinh link Google Meet và khóa lịch cho cả hai bên.
* **FR-029 (Batch Outbound Messaging with Merge Tags):** Chọn nhiều ứng viên trên Kanban để gửi email hàng loạt có cá nhân hóa (`{candidate_name}`, `{job_title}`, `{top_project_name}`).
* **FR-030 (60s Pre-Interview Pocket Cheat-Sheet):** Flashcard bỏ túi trên di động tóm tắt 3 câu Elevator Pitch, 3 số liệu kỹ thuật đinh, 1 câu chuyện STAR giải quyết bug khó và 3 câu hỏi ngược lại nhà tuyển dụng.
* **FR-031 (Real-time Candidate Read Receipt):** Radar thông báo đẩy thời gian thực khi HR mở xem CV hoặc Live Demo đồ án của sinh viên.
* **FR-032 (10-Second Candidate AI TL;DR):** Thẻ tóm tắt 3 gạch đầu dòng năng lực đính kèm ngay trên thẻ ứng viên của Kanban.

---

## 3. Tiêu Chí Thành Công Nghiệm Thu (Success Criteria)

- **SC-001 (Độ trễ phím tắt):** Tương tác bàn phím trên Speed Screener phản hồi $\le 50ms$; nội dung CV tải trước (pre-fetched) dưới $100ms$.
- **SC-002 (Định dạng Lịch):** 100% URL Google Calendar và file `.ics` sinh ra đúng chuẩn RFC 5545, đúng múi giờ `Asia/Ho_Chi_Minh` (GMT+7).
- **SC-003 (Không xung đột lịch):** 100% lượt đặt lịch qua Smart Slot Picker ngăn chặn xung đột kép (double-booking).
- **SC-004 (Kiểm thử tự động):** 100% test cases mới pass trong test suite Vitest.
