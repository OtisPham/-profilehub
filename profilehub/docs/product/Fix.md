# 🛠️ Báo Cáo Phản Hồi Người Dùng Thực Tế & Kế Hoạch Sửa Lỗi Chi Tiết (Fix.md)

> **Tài liệu tham chiếu:** Tổng hợp phản ánh từ ứng viên dùng thử thực tế (Candidate Beta Testing Feedback) & Đặc tả kỹ thuật sửa lỗi (Bug & UX Improvement Specification).  
> **Thư mục lưu trữ:** `profilehub/docs/product/Fix.md`  
> **Trạng thái:** Danh mục nhiệm vụ sửa lỗi chính thức (Active Bug-Fix Backlog).

---

## 📋 1. Tổng Hợp 9 Vấn Đề Người Dùng Thực Tế Phản Ánh

Qua đợt thử nghiệm thực tế với ứng viên bên ngoài, hệ thống ghi nhận **9 điểm nghẽn và lỗi trực quan** cần được chuẩn hóa gấp:

| STT | Mã lỗi | Phân loại | Tóm tắt phản ánh từ ứng viên | Mức độ ưu tiên |
| :---: | :---: | :--- | :--- | :---: |
| **01** | `BUG-01` | **Luồng nghiệp vụ** | Mục "Cơ hội việc làm" chưa có việc thật, click vào gây cụt hứng $\rightarrow$ Cần ẩn xuống. | **P0** (Làm ngay) |
| **02** | `BUG-02` | **Giao diện soạn thảo** | Quá nhiều icon tính năng trùng lặp trên thanh ngang khi viết CV thủ công $\rightarrow$ Rối mắt. | **P0** (Làm ngay) |
| **03** | `BUG-03` | **Bảo mật & Dữ liệu** | Hiện tượng đăng nhập vào vẫn thấy CV của phiên khách hoặc khách thấy CV tài khoản khác. | **P0** (Làm ngay) |
| **04** | `BUG-04` | **Thuật ngữ & Giao diện** | Bảng bên phải để "Đánh giá theo STAR" khó hiểu $\rightarrow$ Đổi tên thành **AI Copilot**. | **P1** |
| **05** | `BUG-05` | **Luồng Xác thực (Auth Gate)**| Bấm nút "Lưu" phải bắt buộc đăng nhập để lưu đúng tài khoản, tránh mất dữ liệu. | **P0** (Làm ngay) |
| **06** | `BUG-06` | **Mẫu thiết kế (Templates)** | Quảng cáo 6 mẫu nhưng thực chất chỉ có 2 kiểu (1 cột và 2 cột) $\rightarrow$ Cần làm phong phú mẫu thật. | **P1** |
| **07** | `BUG-07` | **Lỗi hiển thị (Contrast Bug)** | Ô chọn (Dropdown) dự án / CV trong modal phỏng vấn bị lỗi màu đen trên nền đen/trắng, không thấy chữ. | **P0** (Làm ngay) |
| **08** | `BUG-08` | **Tâm lý & Giới hạn AI** | Ẩn số "20/20 lượt AI" (gây áp lực); chỉ hiện modal nạp gói khi hết; tắt màn mờ sau khi đăng nhập lưu. | **P1** |
| **09** | `BUG-09` | **Xuất in PDF (Print Fidelity)** | Khi bấm in/xuất PDF, giao diện in bị lệch chuẩn, không ra đúng mẫu CV đã chọn trên web. | **P0** (Làm ngay) |

---

## 🔍 2. Đặc Tả Chi Tiết Từng Lỗi & Phương Án Xử Lý Kỹ Thuật

---

### 1. `BUG-01`: Ẩn phân hệ "Cơ Hội Việc Làm" chưa phát triển

* **Hiện tượng lỗi:**
  * Trên `Sidebar.tsx` và `Dashboard.tsx` có mục **"Việc Làm & Tuyển Dụng"** (`/student/jobs`).
  * Tuy nhiên, vì hệ thống đang tập trung vào giá trị cốt lõi (Hồ sơ, Kho đồ án Proof-of-Work, CV Studio, War Room) và chưa mở cổng tuyển dụng thực tế cho nhiều doanh nghiệp, ứng viên bấm vào thấy trang trống hoặc tin mẫu, gây cảm giác nền tảng "chưa xong".
* **Nguyên nhân:** Đưa tính năng Job Board ra thanh menu chính quá sớm khi nguồn việc chưa sẵn sàng.
* **Phương án sửa (Proposed Fix):**
  1. Ẩn menu `Việc Làm & Tuyển Dụng` khỏi thanh `Sidebar.tsx` của ứng viên.
  2. Tại Dashboard, chuyển nút *"Khám phá việc làm"* thành nhãn badge: *"Cơ hội việc làm (Sắp ra mắt)"* hoặc tạm ẩn đi, tập trung 100% sự chú ý của ứng viên vào **Tạo CV Khớp JD** và **Kho Đồ Án**.

---

### 2. `BUG-02`: Tinh giản thanh công cụ khi viết CV thủ công (Dọn dẹp icon trùng lặp)

* **Hiện tượng lỗi:**
  * Khi ứng viên đang tự tay gõ văn bản trong `CVBuilder.tsx`, thanh công cụ ngang (Canvas Toolbar) nhồi nhét hơn 12 icon: *Mắt thần ATS, ⭐ STAR Coach, 🛡️ Phòng thủ đồ án, Khảo sát lương, Phỏng vấn AI, Quality check, Tối ưu toàn CV, Thu gọn...*
  * Nhiều nút cùng chung một mục đích kiểm tra chất lượng CV nhưng bị phân mảnh thành 3–4 nút khác nhau.
  * Hai nút *Khảo Sát Lương* và *Phỏng Vấn AI* hoàn toàn không phục vụ việc viết CV nhưng vẫn nằm chình ình trên thanh vẽ.
* **Nguyên nhân:** Thiếu phân nhóm tính năng theo ngữ cảnh (Contextual Grouping); gom cả tính năng trước phỏng vấn vào lúc soạn thảo chữ.
* **Phương án sửa (Proposed Fix):**
  1. **Xóa vĩnh viễn** 2 nút `Khảo Sát Lương` và `Phỏng Vấn AI` khỏi thanh vẽ CV (2 tính năng này đã có vị trí chuẩn tại Trạm tác chiến War Room ở Dashboard).
  2. **Gom các nút phân tích ATS/Lỗi/STAR** về một nút trạng thái duy nhất:  
     👉 **`[🛡️ Chuẩn ATS: 85%]`** (Click vào sẽ tự động mở bảng AI Copilot bên phải).
  3. Thanh ngang chỉ giữ đúng các chức năng định dạng văn bản: **Chọn Mẫu • Phông chữ & Màu • Bố cục 1/2 cột • Thứ tự mục • Kéo từ hồ sơ**.

---

### 3. `BUG-03`: Tách biệt tuyệt đối dữ liệu giữa Khách vãng lai và Tài khoản đăng nhập

* **Hiện tượng lỗi:**
  * Khi người dùng chưa đăng nhập (Guest) thử tạo CV, dữ liệu lưu tạm vào `localStorage`.
  * Khi một ứng viên thật đăng nhập bằng tài khoản cá nhân, họ bất ngờ thấy lại các bản CV nháp của khách trước đó, hoặc khi đăng xuất ra vẫn thấy CV của người vừa đăng nhập.
* **Nguyên nhân:** `cvService.ts` sử dụng chung một key lưu trữ `profilehub_candidate_cvs` hoặc fallback không gán chặt chẽ theo `user.id`. Dữ liệu bộ nhớ đệm (Cache) bị rò rỉ chéo phiên (Cross-session leakage).
* **Phương án sửa (Proposed Fix):**
  1. **Phân vùng bộ nhớ lưu trữ:**
     * Khách vãng lai: Lưu vào `profilehub_guest_cv_draft` (chỉ 1 bản nháp tạm, tự xóa khi đăng xuất hoặc hết phiên).
     * Người dùng đăng nhập: Lưu vào `profilehub_user_cvs_${userId}` và đồng bộ lên Supabase Cloud database.
  2. **Làm sạch khi chuyển trạng thái (Auth State Switch):** Khi người dùng Đăng xuất (Logout) hoặc Đăng nhập tài khoản mới, hệ thống phải purge (dọn sạch) state trong React Context, đảm bảo tài khoản A không bao giờ nhìn thấy CV của tài khoản B hay của khách vãng lai.

---

### 4. `BUG-04`: Xóa mục "Đánh giá theo STAR" bên phải $\rightarrow$ Quy chuẩn thành "AI Copilot"

* **Hiện tượng lỗi:**
  * Bảng hỗ trợ bên phải của `CVBuilder` đang đặt tên tab là *"⭐ STAR Coach"* hoặc *"Đánh giá CV theo STAR"*.
  * Nhiều sinh viên/ứng viên ngoài ngành không hiểu thuật ngữ "STAR" (Situation - Task - Action - Result) là gì, cảm thấy khó hiểu và ngại sử dụng.
* **Nguyên nhân:** Dùng thuật ngữ kỹ thuật chuyên sâu làm nhãn giao diện cấp 1 (Level-1 UI Label).
* **Phương án sửa (Proposed Fix):**
  1. Đổi tên toàn bộ bảng điều khiển bên phải thành: **🤖 AI Copilot (Trợ Lý Soạn Thảo CV)**.
  2. Bên trong AI Copilot, giữ 3 tab chức năng bằng ngôn ngữ đại chúng dễ hiểu:
     * **Tab 1: Kiểm Tra Lỗi & ATS** (Chỉ ra lỗi chính tả, từ khóa thiếu, định dạng sai).
     * **Tab 2: Nâng Cấp Câu Chữ (Action Verbs)** (Tự động viết lại câu văn chuyên nghiệp có số liệu đo lường — ẩn chữ STAR vào phần gợi ý của AI).
     * **Tab 3: Gợi Ý Phỏng Vấn Đồ Án** (Bộ câu hỏi phản biện kỹ thuật).

---

### 5. `BUG-05`: Bắt buộc Đăng nhập khi bấm [Lưu] để lưu đúng tài khoản Cloud

* **Hiện tượng lỗi:**
  * Ứng viên chưa đăng nhập ngồi viết CV cả tiếng đồng hồ, bấm "Lưu & Đồng bộ" thì hệ thống chỉ hiện thông báo nhỏ *"Đã lưu trên máy"* hoặc hiện popup đóng lại được.
  * Khi họ xóa cookie hoặc đổi máy, toàn bộ CV bị mất $\rightarrow$ Gây ức chế nghiêm trọng.
* **Nguyên nhân:** Thiếu cổng chặn xác thực (Auth Gate) bắt buộc tại thời điểm thực hiện hành vi chuyển đổi quan trọng (Save Milestone).
* **Phương án sửa (Proposed Fix):**
  1. Khi người dùng bấm **[Lưu]** hoặc **[Lưu & Đồng bộ]**:
     * **Nếu đã đăng nhập:** Tiến hành lưu vào database Cloud, cập nhật `lastSavedTime` và đóng thông báo nhẹ nhàng.
     * **Nếu CHƯA đăng nhập:** Lập tức bật **Modal Bắt Buộc Đăng Nhập / Đăng Ký (Auth Gate Modal)** với thông điệp rõ ràng:
       > *"🔒 Đăng nhập để lưu vĩnh viễn bản CV này vào tài khoản của bạn. Không lo mất dữ liệu khi đổi máy tính!"*
  2. Sau khi người dùng đăng nhập thành công qua Google / GitHub / Email, hệ thống tự động lấy bản CV nháp vừa soạn lưu thẳng vào tài khoản của họ và đưa họ trở lại đúng màn hình đang viết dở.

---

### 6. `BUG-06`: Đa dạng hóa thực chất 6 mẫu CV (Không chỉ là 1 cột và 2 cột)

* **Hiện tượng lỗi:**
  * Modal chọn mẫu hiển thị 6 tên gọi khác nhau (`Classic`, `Tech Specialist`, `TopCV Modern`, `Compact ATS`, `Minimalist`, `Executive`).
  * Nhưng khi mở ra xem, thực chất chỉ có 2 kiểu cấu trúc: một kiểu chia 2 cột dọc và một kiểu 1 cột từ trên xuống, chỉ khác nhau màu sắc tiêu đề $\rightarrow$ Người dùng cảm thấy bị lừa hoặc nghèo nàn mẫu.
* **Nguyên nhân:** Tái sử dụng chung một layout template renderer, chưa thiết kế các phong cách bố cục đặc thù.
* **Phương án sửa (Proposed Fix):**
  Thiết kế lại 6 mẫu với cấu trúc hình khối và nhận diện hoàn toàn khác biệt (tham khảo Canva, Resume.io, Novoresume):
  1. **Mẫu 1: Modern Top-Banner (Phong cách TopCV Pro):** Khối Header màu đậm trải ngang toàn màn hình trên cùng, Avatar lớn bo tròn, thông tin cá nhân nổi bật, thân chia 2 cột bất đối xứng (35% - 65%).
  2. **Mẫu 2: Minimalist Harvard (Phong cách Học thuật / Tài chính):** 1 cột thuần túy, font Serif (Lora), đường kẻ ngang hairline 0.5px tinh tế, căn lề lùi đầu dòng chuẩn mực Ivy League.
  3. **Mẫu 3: Tech Developer Terminal (Dành riêng cho IT):** Có khối hiển thị Tech Stack dạng thẻ tag bo góc, hiển thị link GitHub/Commit rõ ràng, chia khối đồ án thành dạng Bento Grid nhỏ.
  4. **Mẫu 4: Timeline Milestone (Trục thời gian dọc):** Có một trục đường sinh kẻ dọc nối các năm học tập và làm việc bằng các chấm tròn (Milestone dots), rất phù hợp cho ứng viên có quá trình làm việc liên tục.
  5. **Mẫu 5: Left Solid Sidebar (Phong cách Châu Âu):** Cột trái có màu nền đồng nhất từ đầu đến chân trang (xanh Navy hoặc xám chì), chứa toàn bộ Liên hệ, Kỹ năng, Ngoại ngữ; cột phải nền trắng tinh tế chứa Kinh nghiệm và Đồ án.
  6. **Mẫu 6: Compact 1-Page ATS (Tối ưu tuyệt đối cho sinh viên):** Tối ưu hóa padding/margin siêu gọn gàng, bố cục 2 cột cân xứng 50-50 ở phần kỹ năng, đảm bảo nhét vừa vặn 3 đồ án trong đúng 1 trang A4 duy nhất.

---

### 7. `BUG-07`: Lỗi màu nền/chữ trong Dropdown chọn Dự án / CV ở Modal Phỏng vấn

* **Hiện tượng lỗi:**
  * Khi mở modal thêm lịch phỏng vấn War Room (`InterviewWarRoomModal.tsx`), tại ô chọn (Select Dropdown) *"Chọn bản CV đã nộp"* hoặc *"Số lượng đồ án"*:
  * Chữ bên trong danh sách sổ xuống bị lỗi màu: chữ trắng trên nền trắng (hoặc chữ đen trên nền xám tối trong Dark mode), khiến người dùng không thể đọc được nội dung để chọn.
* **Nguyên nhân:**
  * Thẻ HTML `<select>` trong Tailwind CSS chỉ được set class cho thẻ cha (`bg-white dark:bg-[#111728] text-slate-900 dark:text-white`), nhưng các thẻ con `<option>` lại bị trình duyệt (Chrome/Windows) tự áp màu mặc định của hệ điều hành, dẫn đến mất độ tương phản (Color Contrast Failure).
* **Phương án sửa (Proposed Fix):**
  1. Cố định màu chữ và màu nền trực tiếp cho cả thẻ `<select>` lẫn từng thẻ `<option>`:
     ```tsx
     <select className="w-full px-3.5 py-2.5 bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl ...">
       {availableCvs.map(cv => (
         <option 
           key={cv.id} 
           value={cv.id} 
           className="bg-white dark:bg-[#161f36] text-slate-900 dark:text-slate-100 py-1.5"
         >
           {cv.title} ({cv.targetRole})
         </option>
       ))}
     </select>
     ```
  2. Bổ sung CSS toàn cục trong `index.css`:
     ```css
     select option {
       background-color: var(--select-bg, #ffffff);
       color: var(--select-text, #0f172a);
     }
     .dark select option {
       background-color: #161f36 !important;
       color: #f8fafc !important;
     }
     ```

---

### 8. `BUG-08`: Ẩn con số "20/20 lượt AI"; chỉ hiện Modal Nạp Gói khi hết; tắt màn mờ sau khi lưu

* **Hiện tượng lỗi:**
  * Trên thanh tiêu đề `CVBuilder.tsx` luôn đập vào mắt người dùng một huy hiệu: `Còn: 20/20 lượt AI`. Người dùng cảm thấy bị gò bó, áp lực tâm lý như sắp bị thu phí.
  * Khi bấm "Lưu & Đồng bộ" sau khi đăng nhập xong, lớp màn đen mờ (Backdrop overlay) không tự động tắt đi, làm giao diện bị mờ và đơ chuột.
* **Nguyên nhân:**
  * Badge quota được render mặc định ở trạng thái tĩnh.
  * State `showGuestSyncModal` hoặc cờ `isSaving` không được reset về `false` đúng cách sau khi hàm `handleSaveCV()` thực thi xong.
* **Phương án sửa (Proposed Fix):**
  1. **Ẩn hoàn toàn con số hạn mức AI:** Xóa bỏ khối hiển thị `Còn: 20/20 lượt AI` trên thanh header. Người dùng được trải nghiệm thoải mái tự nhiên.
  2. **Chỉ kích hoạt Modal khi chạm đáy (`remainingCredits <= 0`):** Khi người dùng gọi chức năng AI mà hạn mức bằng 0, lúc này mới bật **Modal Nạp Lượt AI / Nâng Cấp Gói** với thông điệp:
     > *"⚡ Bạn đã sử dụng hết 20 lượt AI miễn phí trong ngày hôm nay. Nâng cấp gói Pro hoặc quay lại vào ngày mai!"*
  3. **Khắc phục lỗi màn mờ (Dimmed Overlay):**
     * Trong `handleSaveCV()`, đảm bảo sau khi lưu thành công:
       ```typescript
       setShowGuestSyncModal(false);
       setIsSaving(false);
       ```
     * Đảm bảo không còn bất kỳ backdrop nào giữ thuộc tính `fixed inset-0 bg-black/50` trên DOM.

---

### 9. `BUG-09`: Khắc phục triệt để lỗi khi bấm In / Xuất PDF (Print Layout Fidelity)

* **Hiện tượng lỗi:**
  * Khi người dùng bấm nút **[Xuất PDF]** (hoặc `Ctrl + P`), giao diện in của trình duyệt hiện ra bị các lỗi:
    * Bị dính thanh Header, thanh Footer hoặc thanh AI Copilot vào trang in.
    * Một đoạn văn bản đồ án bị chém đôi (nửa trên nằm trang 1, nửa dưới rớt xuống trang 2).
    * Màu sắc tiêu đề, đường viền hoặc phông chữ bị bay màu (trắng bệch do trình duyệt tắt tính năng in màu nền).
* **Nguyên nhân:** Quy tắc `@media print` trong CSS chưa đủ chặt chẽ, chưa áp dụng thuộc tính chống rách khối (`break-inside: avoid`).
* **Phương án sửa (Proposed Fix):**
  Cập nhật quy tắc `@media print` chuẩn hóa trong `CVBuilder.tsx`:
  ```css
  @media print {
    /* 1. Thiết lập khổ in A4 chuẩn xác */
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    
    /* 2. Ép buộc in 100% màu sắc và hình nền */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    /* 3. Ẩn toàn bộ giao diện web, chỉ hiển thị đúng khung CV */
    body * {
      visibility: hidden !important;
    }
    #cv-preview-a4, #cv-preview-a4 * {
      visibility: visible !important;
    }
    #cv-preview-a4 {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
      background: #ffffff !important;
    }

    /* 4. Chống cắt ngang dòng chữ giữa 2 trang */
    .cv-section-block, .cv-item-block, tr, li {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
  }
  ```

---

## 📅 3. Kế Hoạch Phân Nhiệm Sửa Lỗi (Action Checklist)

| Thứ tự | Tệp mã nguồn cần sửa | Nội dung công việc cụ thể | Trạng thái |
| :---: | :--- | :--- | :---: |
| **01** | `src/components/layout/Sidebar.tsx` | Ẩn menu "Việc Làm & Tuyển Dụng" (`/student/jobs`); thêm menu "Kho Đồ Án". | ⏳ Sẵn sàng sửa |
| **02** | `src/pages/student/CVBuilder.tsx` | Gỡ bỏ nút Khảo sát lương & Phỏng vấn AI; gom icon kiểm tra ATS/Lỗi/STAR. | ⏳ Sẵn sàng sửa |
| **03** | `src/pages/student/CVBuilder.tsx` | Đổi tên panel bên phải thành **AI Copilot**; loại bỏ thuật ngữ STAR gây rối. | ⏳ Sẵn sàng sửa |
| **04** | `src/pages/student/CVBuilder.tsx` | Ẩn badge `Còn 20/20 lượt AI`; chỉ bật modal nạp khi quota = 0; fix lỗi màn mờ khi lưu. | ⏳ Sẵn sàng sửa |
| **05** | `src/pages/student/CVBuilder.tsx` | Chuẩn hóa `@media print` cho nút Xuất PDF in đẹp từng pixel. | ⏳ Sẵn sàng sửa |
| **06** | `src/services/cvService.ts` | Cô lập key lưu trữ của Khách và User; bắt buộc đăng nhập khi bấm Lưu CV. | ⏳ Sẵn sàng sửa |
| **07** | `InterviewWarRoomModal.tsx` | Fix màu chữ và màu nền cho thẻ `<select>` và `<option>` chọn dự án / CV. | ⏳ Sẵn sàng sửa |
| **08** | `src/components/cv/CVTemplates.tsx` | Thiết kế thêm các phong cách layout độc đáo (Top Banner, Terminal, Timeline). | ⏳ Sẵn sàng sửa |

---

> 🎯 **Mục tiêu hoàn thành:**  
> Sau khi xử lý dứt điểm 9 vấn đề này, ProfileHub sẽ hoàn toàn sạch lỗi hiển thị, bảo mật dữ liệu an toàn cho từng ứng viên, giao diện viết CV thoáng đãng và bản in PDF đạt chuẩn xuất sắc như một ấn phẩm đồ họa chuyên nghiệp.
