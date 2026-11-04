# Interface Contract: STAR Defense Service

## Service Seam Contract: `starDefenseService`

### 1. `generateBulletDefense(bulletText: string, context?: { projectName?: string; technologies?: string[] }): StarDefenseItem`
* **Mục đích:** Phân tích một dòng câu bullet bất kỳ (dự án, kinh nghiệm) và sinh bộ phao cứu sinh giải trình toàn diện: cơ sở số liệu, top câu hỏi bẫy, kịch bản trả lời mẫu 30s và cảnh báo buzzwords.
* **Đầu vào:**
  - `bulletText`: Chuỗi nội dung câu bullet trên CV.
  - `context`: (Tùy chọn) Tên dự án và danh sách công nghệ liên quan.
* **Đầu ra:** Đối tượng `StarDefenseItem` hoàn chỉnh.
* **Đặc tính:** Chạy 100% Client-side, tức thì (< 30ms), không cần internet.

---

### 2. `generateProjectDefenseOverview(project: ProjectItem): ProjectDefenseOverview`
* **Mục đích:** Phân tích toàn bộ các gạch đầu dòng (bullets) của một đồ án để tạo bản tổng hợp Cheat-Sheet phòng thủ.
* **Đầu vào:** Đối tượng `ProjectItem` từ CV.
* **Đầu ra:** `ProjectDefenseOverview` gồm danh sách `StarDefenseItem` của từng dòng, điểm sẵn sàng bảo vệ (`overallReadinessScore`) và tổng số câu hỏi bẫy.

---

### 3. `saveCandidateDefenseNote(bulletId: string, noteText: string, userId?: string): void`
* **Mục đích:** Lưu trữ ghi chú cá nhân hóa của ứng viên (những luận điểm riêng họ muốn bổ sung) vào `localStorage`.
* **Đầu vào:** `bulletId`, nội dung ghi chú `noteText`, `userId`.
* **Lưu trữ:** Key `profilehub_star_defense_notes_${userId}`.

---

### 4. `getCandidateDefenseNotes(userId?: string): Record<string, string>`
* **Mục đích:** Lấy toàn bộ bản ghi nhớ giải trình cá nhân của ứng viên.
* **Đầu ra:** Object map từ `bulletId` $\to$ ghi chú cá nhân.

---

### 5. `exportDefenseCheatSheetMarkdown(items: StarDefenseItem[], title?: string): string`
* **Mục đích:** Chuyển đổi toàn bộ phao cứu sinh thành văn bản Markdown chuẩn mực để ứng viên có thể copy sang Notion, in ra giấy hoặc đọc trên điện thoại trước giờ phỏng vấn.
* **Đầu ra:** Chuỗi Markdown có cấu trúc đầy đủ bảng biểu, bullet points và lời khuyên phòng thủ.
