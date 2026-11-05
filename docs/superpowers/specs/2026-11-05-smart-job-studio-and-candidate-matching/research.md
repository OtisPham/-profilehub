# Nghiên Cứu Kỹ Thuật: Chuẩn Hóa Đăng Tin Tuyển Dụng & Bóc Tách Kỹ Năng Tự Động (Smart Job Studio)
> **Mã tài liệu:** `RESEARCH-20261105-SMART-JOB-STUDIO`  
> **Tính năng:** Smart Job Studio, Standardized Job Posting, Automated Skill Tagging & Instant Candidate Matching  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Bối Cảnh & Vấn Đề Kỹ Thuật

Hiện tại trên hệ thống ProfileHub:
1. **Bài đăng tuyển dụng còn quá sơ sài:** `JobPost` chỉ có các trường cơ bản (`title`, `department`, `location`, `description`, `required_skills`). Thiếu các tiêu chí chuẩn mực của tin tuyển dụng công nghệ thực tế:
   - Dải lương (`salary_min`, `salary_max`, `currency`, `is_negotiable`).
   - Cấp bậc kinh nghiệm (`experience_level`: `intern`, `fresher`, `junior`, `middle`, `senior`).
   - Hình thức làm việc (`workplace_type`: `on-site`, `hybrid`, `remote`).
   - Hạn chót nộp đơn (`deadline_date`).
2. **Thiếu kế thừa Tích Xanh Pháp Nhân (Tax Verification):** Doanh nghiệp đã được cấp Tích Xanh ở màn hình `RecruiterProfile.tsx`, nhưng bài đăng tuyển dụng chưa tự động kế thừa đầy đủ huy hiệu bảo chứng (`is_tax_verified`, `tax_verification_tier`, `tax_code`).
3. **Nhà tuyển dụng tốn thời gian gõ thủ công từng tag kỹ năng:** Khi copy-paste một JD dài từ file Word/PDF, HR phải tự lọc và gõ từng tag. Nếu gõ sai chính tả (`ReactJs`, `react.js`), hệ thống sẽ khó bắt cặp chính xác với sinh viên.
4. **Chưa có cơ chế Bắt Cặp Ứng Viên 2 Chiều Tức Thì (Instant Candidate Match):**
   - Phía Nhà tuyển dụng: Không biết có bao nhiêu ứng viên trong Talent Pool phù hợp với tin đăng vừa tạo.
   - Phía Sinh viên: Vào trang việc làm nhưng không biết vị trí nào khớp với năng lực của mình, dẫn đến nộp đơn rải rác hoặc tự ti không dám ứng tuyển.

---

## 2. Quyết Định Thiết Kế & Phân Tích Đánh Giá (Design Decisions)

### Quyết định 1: Chuẩn hóa Cấu trúc Dải Lương & Hiển thị Định dạng Tiền tệ
* **Lựa chọn:** Cấu trúc dữ liệu số hóa kết hợp cờ Thỏa thuận:
  ```typescript
  salary_min?: number;      // e.g. 8000000
  salary_max?: number;      // e.g. 15000000
  currency?: 'VND' | 'USD'; // Mặc định 'VND'
  is_negotiable?: boolean;  // true -> Hiển thị "Thỏa thuận"
  ```
* **Hàm định dạng chuẩn hóa (`formatSalaryRange`):**
  - Nếu `is_negotiable = true` hoặc không có cả min và max: `"Thỏa thuận"` / `"Cạnh tranh"`.
  - Nếu có cả min và max (VND):
    - Dưới 1 triệu: hiển thị chi tiết nghìn đồng (ví dụ: `800K - 1.2M VNĐ`).
    - Từ 1 triệu trở lên: chuyển đổi sang đơn vị Triệu (`8 - 15 Triệu VNĐ`).
  - Nếu có cả min và max (USD): `$800 - $1,500 USD`.
  - Nếu chỉ có min: `Từ 10 Triệu VNĐ`.
  - Nếu chỉ có max: `Lên đến 20 Triệu VNĐ`.
* **Lý do lựa chọn:** Lưu trữ dạng số nguyên cho phép truy vấn SQL khoảng lọc (`WHERE salary_min >= ? AND salary_max <= ?`), trong khi hàm format đảm bảo giao diện hiển thị gọn gàng, thân thiện với người Việt.
* **Giải pháp thay thế đã loại bỏ:** Lưu chuỗi tự do (free-text string như `"10-15tr"`). Loại bỏ vì không thể lọc theo mức lương, không thể quy đổi tỉ giá và dễ nhập liệu sai lệch.

---

### Quyết định 2: Chuẩn hóa Cấp Bậc (Experience Level) & Hình Thức (Workplace Type)
* **Lựa chọn:**
  ```typescript
  export type ExperienceLevel = 'intern' | 'fresher' | 'junior' | 'middle' | 'senior';
  export type WorkplaceType = 'on-site' | 'hybrid' | 'remote';
  ```
* **Bản đồ nhãn tiếng Việt & Icon đại diện:**
  - `intern`: `🌱 Thực tập sinh (Intern)`
  - `fresher`: `🚀 Mới tốt nghiệp (Fresher)`
  - `junior`: `⚡ Khởi đầu (Junior 1-2 năm)`
  - `middle`: `💼 Trung cấp (Middle 2-4 năm)`
  - `senior`: `🏆 Cao cấp (Senior 4+ năm)`
  - `on-site`: `🏢 Tại văn phòng (On-site)`
  - `hybrid`: `🌐 Linh hoạt (Hybrid)`
  - `remote`: `🏠 Từ xa (Remote)`
* **Lý do lựa chọn:** Đáp ứng đúng phân khúc mục tiêu của ProfileHub (tập trung mạnh vào Intern/Fresher/Junior nhưng vẫn mở rộng được cho Middle/Senior).

---

### Quyết định 3: Bộ Bóc Tách Kỹ Năng Tự Động 1-Click (Automated Skill Extraction Engine)
* **Lựa chọn:** Xây dựng cơ chế kép (Dual-Mode Extraction Engine):
  1. **Tầng 1: Từ điển Quy tắc Regex Siêu tốc (Deterministic Fast Keyword Taxonomy - 0ms):**
     - Xây dựng từ điển 120+ công nghệ IT thực chiến, phân nhóm:
       * *Frontend:* React, TypeScript, JavaScript, Vue.js, Angular, Next.js, HTML5, CSS3, Tailwind CSS, Redux, Sass.
       * *Backend:* Node.js, Express, NestJS, Python, Django, FastAPI, Java, Spring Boot, C#, .NET, Go (Golang), PHP, Laravel.
       * *Database:* PostgreSQL, MySQL, MongoDB, Redis, SQLite, Supabase, Firebase.
       * *DevOps & Cloud:* Docker, Kubernetes, AWS, Google Cloud, Azure, CI/CD, Git, GitHub Actions, Linux, Nginx.
       * *Mobile:* Flutter, React Native, Swift, Kotlin, iOS, Android.
       * *Data & AI:* Machine Learning, Deep Learning, PyTorch, TensorFlow, OpenCV, Pandas, NumPy, NLP.
       * *Design & Testing:* Figma, UI/UX, Jest, Vitest, Cypress, Selenium, Postman, Agile/Scrum.
     - Xử lý Biệt danh (Alias Normalization):
       - `react.js`, `reactjs`, `react` $\to$ `ReactJS`
       - `node`, `nodejs`, `node.js` $\to$ `Node.js`
       - `ts`, `typescript` $\to$ `TypeScript`
       - `tailwind`, `tailwindcss` $\to$ `Tailwind CSS`
       - `postgres`, `postgresql` $\to$ `PostgreSQL`
       - `k8s`, `kubernetes` $\to$ `Kubernetes`
       - `golang`, `go` $\to$ `Golang`
     - Bóc tách theo ranh giới từ `\b` tránh false positive (ví dụ từ `go` trong "good" không bị nhận nhầm thành Golang).
  2. **Tầng 2: Gợi ý phân loại thông minh (Categorized Output):**
     - Phân loại kỹ năng thành 4 nhóm trực quan: `Ngôn ngữ & Framework cốt lõi`, `Cơ sở dữ liệu & Đám mây`, `Công cụ & Phương pháp luận`, `Kỹ năng bổ trợ`.
     - Cho phép Recruiter bấm chọn/bỏ chọn từng tag trước khi lưu vào form.
* **Lý do lựa chọn:**
  - Tốc độ phản hồi tức thì 0ms, không phụ thuộc mạng.
  - Zero-cost: Không tiêu tốn token OpenAI/Gemini cho thao tác thường nhật.
  - Bộ kiểm thử Vitest kiểm chứng tự động 100% không sợ suy giảm chất lượng.

---

### Quyết định 4: Thuật Toán Bắt Cặp Ứng Viên 2 Chiều Tức Thì (Instant Reverse Match Scoring)
* **Lựa chọn:** Hàm tính toán mức độ phù hợp $MatchScore \in [0, 100]$:
  $$\text{MatchScore} = \min\left(100, \left( \frac{|\text{MatchedSkills}|}{|\text{RequiredSkills}|} \times 70 \right) + \left( \min(3, \text{VerifiedProjects}) \times 10 \right)\right)$$
  - **Trọng số Kỹ năng (70%):** Tỷ lệ phần trăm các kỹ năng trong JD mà Ứng viên sở hữu (tổng hợp từ `skills` của hồ sơ sinh viên và công nghệ gắn với các đồ án của sinh viên).
  - **Trọng số Bằng chứng Thực tế (30%):** Mỗi đồ án đã được xác thực (`is_verified` hoặc `verification_status === 'verified'`) cộng 10 điểm (tối đa 30 điểm cho 3 đồ án).
* **Ứng dụng 2 chiều:**
  - **Chiều 1 (Recruiter View):** Trên mỗi thẻ bài đăng tuyển dụng trong `JobManagement.tsx`, hiển thị:
    `[ 👥 6 ứng viên tiềm năng ]` (với $MatchScore \ge 50\%$). Bấm vào chuyển hướng trực tiếp sang `CandidateSearch.tsx?jobId={job.id}` với danh sách ứng viên sắp xếp theo độ phù hợp từ cao xuống thấp.
  - **Chiều 2 (Student View):** Trên mỗi thẻ việc làm trong `StudentJobs.tsx`, hiển thị:
    `[ 🎯 85% Phù hợp với bạn ]` dựa trên Master Profile của chính sinh viên đang đăng nhập. Đổi màu huy hiệu trực quan:
    - $\ge 80\%$: Xanh lục đậm (`#15803d`, nền xanh nhạt) kèm biểu tượng `Sparkles`.
    - $50\% - 79\%$: Xanh lam / Chàm (`#4338ca`).
    - $< 50\%$: Xám trung tính (`#64748b`).
* **Bảo vệ quyền riêng tư (Privacy Compliance):**
  - Tự động loại trừ các sinh viên đã tắt `is_open_to_work = false`.
  - Tự động loại trừ các sinh viên đã đưa tên công ty của Recruiter vào `blocked_companies` thông qua `candidatePrivacyService.isCandidateVisibleToCompany()`.

---

### Quyết định 5: Kế Thừa Tự Động Tích Xanh & Mã Số Thuế Khi Đăng Tin
* **Lựa chọn:** Khi Nhà tuyển dụng tạo mới hoặc chỉnh sửa bài đăng:
  - Hệ thống tự động tra cứu hồ sơ doanh nghiệp của Recruiter (`getRecruiterCompanyProfile(recruiter_id)`).
  - Tự động gán các trường:
    * `is_tax_verified = recruiterProfile.isTaxVerified || false`
    * `tax_verification_tier = recruiterProfile.taxVerificationTier || 'unverified'`
    * `tax_code = recruiterProfile.taxCode || ''`
* **Lý do lựa chọn:** Đảm bảo tính nhất quán giữa hồ sơ pháp nhân và các bài đăng tuyển dụng, ngăn chặn việc công ty chưa xác thực lại mượn danh tích xanh khi đăng việc.

---

## 3. Tổng Kết & Ma Trận Phê Duyệt

| Tiêu chuẩn | Hiện trạng | Sau khi triển khai Smart Job Studio |
| :--- | :--- | :--- |
| **Dải lương** | Không có (chỉ mô tả text tự do) | Có `salary_min`, `salary_max`, `currency`, `is_negotiable`, format chuẩn VNĐ/USD |
| **Cấp bậc** | Không có | Có `experience_level` (`intern`, `fresher`, `junior`, `middle`, `senior`) |
| **Hình thức** | Gộp chung trong `location` | Phân tách `workplace_type` (`on-site`, `hybrid`, `remote`) rõ ràng |
| **Bóc tách kỹ năng** | Gõ tay 100% | Nút **[ ✨ AI Bóc Tách Kỹ Năng ]** 1-click trích xuất và chuẩn hóa tự động |
| **Bắt cặp ứng viên** | Không có số liệu | Hiển thị số lượng ứng viên tiềm năng (Recruiter) & % Phù hợp thời gian thực (Student) |
| **Tích Xanh pháp nhân** | Chưa đồng bộ sang JobPost | Tự động kế thừa Tích Xanh & Hạng Kim Cương/Bạc từ MST đã xác thực |
