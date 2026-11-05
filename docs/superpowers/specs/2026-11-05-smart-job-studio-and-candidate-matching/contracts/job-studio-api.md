# Giao Ước Kỹ Thuật: Smart Job Studio & Candidate Match Engine API
> **Mã tài liệu:** `CONTRACT-20261105-SMART-JOB-STUDIO`  
> **Tính năng:** Smart Job Studio, Standardized Job Posting, Automated Skill Tagging & Instant Candidate Matching  
> **Dự án:** ProfileHub - Nền tảng Hồ sơ Nghề nghiệp Dựa trên Bằng chứng  
> **Nhánh Git:** `profilehub_v1`  
> **Ngày lập:** 05/11/2026  

---

## 1. Giao Thức Dịch Vụ Cốt Lõi (`jobStudioService.ts`)

Vị trí: [`src/services/jobStudioService.ts`](file:///C:/Users/ADMIN/Desktop/STUDY/profilehub/src/services/jobStudioService.ts)

### 1.1. `extractSkillsFromText(jdText: string): SkillExtractionResult`
Trích xuất danh sách kỹ năng công nghệ chuẩn hóa từ đoạn văn bản JD bất kỳ.
* **Đầu vào (Input):**
  - `jdText`: Chuỗi văn bản mô tả công việc thô (Plain text hoặc Markdown).
* **Đầu ra (Output):**
  ```typescript
  export interface ExtractedSkillCategory {
    category: 'languages_frameworks' | 'database_cloud' | 'tools_methods' | 'other';
    categoryLabel: string;
    skills: string[];
  }

  export interface SkillExtractionResult {
    allSkills: string[];
    categorized: ExtractedSkillCategory[];
    rawCount: number;
  }
  ```
* **Quy tắc xử lý:**
  - Chuyển văn bản về chuẩn không phân biệt hoa thường và quét ranh giới từ `\b`.
  - Khử trùng lặp (Deduplication) và chuẩn hóa tên công nghệ theo từ điển Canonical (ví dụ: `reactjs` $\to$ `ReactJS`).
  - Phân loại chính xác vào các nhóm kỹ năng tương ứng.

---

### 1.2. `formatSalaryRange(options: SalaryFormatOptions): string`
Định dạng dải lương thân thiện và chuẩn hóa cho giao diện người dùng.
* **Đầu vào (Input):**
  ```typescript
  export interface SalaryFormatOptions {
    salary_min?: number;
    salary_max?: number;
    currency?: 'VND' | 'USD';
    is_negotiable?: boolean;
  }
  ```
* **Đầu ra (Output):** Chuỗi định dạng hiển thị, ví dụ:
  - `is_negotiable: true` $\to$ `"Thỏa thuận"`
  - `salary_min: 8000000, salary_max: 15000000, currency: 'VND'` $\to$ `"8 - 15 Triệu VNĐ"`
  - `salary_min: 15000000, currency: 'VND'` $\to$ `"Từ 15 Triệu VNĐ"`
  - `salary_max: 20000000, currency: 'VND'` $\to$ `"Lên đến 20 Triệu VNĐ"`
  - `salary_min: 500, salary_max: 1000, currency: 'USD'` $\to$ `"$500 - $1,000 USD"`
  - Không có dữ liệu $\to$ `"Thỏa thuận"`

---

### 1.3. `calculateCandidateJobMatch(jobSkills: string[], candidate: CandidateProfileInput): CandidateMatchSummary`
Tính toán độ tương đồng giữa yêu cầu kỹ năng của tin tuyển dụng và hồ sơ ứng viên.
* **Đầu vào (Input):**
  - `jobSkills`: Mảng các kỹ năng yêu cầu trong JD.
  - `candidate`: Dữ liệu ứng viên (kỹ năng cá nhân, danh sách đồ án, số đồ án Verified).
* **Đầu ra (Output):**
  ```typescript
  export interface CandidateMatchSummary {
    candidateId: string;
    candidateName: string;
    university?: string;
    gpa?: string;
    matchScore: number; // 0 đến 100
    matchedSkills: string[];
    missingSkills: string[];
    verifiedProjectsCount: number;
    isOpenToWork: boolean;
  }
  ```
* **Quy tắc chấm điểm:**
  - $\text{SkillScore} = \frac{|\text{MatchedSkills}|}{|\text{RequiredSkills}|} \times 70$
  - $\text{ProjectScore} = \min(3, \text{VerifiedProjectsCount}) \times 10$
  - $\text{TotalMatchScore} = \min(100, \text{SkillScore} + \text{ProjectScore})$

---

### 1.4. `findMatchingCandidatesForJob(job: JobPost, candidates: CandidateProfileInput[], recruiterCompanyName?: string): JobCandidateMatchResult`
Tìm kiếm và lọc toàn bộ ứng viên trong Talent Pool phù hợp với bài đăng tuyển dụng, tự động loại trừ ứng viên ẩn danh/chặn công ty.
* **Đầu vào (Input):**
  - `job`: Bài đăng tuyển dụng hiện tại.
  - `candidates`: Danh sách ứng viên trong hệ thống.
  - `recruiterCompanyName`: Tên công ty của nhà tuyển dụng (để áp dụng chính sách Blacklist).
* **Đầu ra (Output):**
  ```typescript
  export interface JobCandidateMatchResult {
    jobId: string;
    totalEligibleCandidates: number; // Số lượng ứng viên có matchScore >= 50%
    topMatches: CandidateMatchSummary[];
  }
  ```

---

### 1.5. `inheritTaxVerification(job: Partial<JobPost>, recruiterProfile: RecruiterCompanyProfile): Partial<JobPost>`
Tự động gán thông tin Tích Xanh và Mã số thuế từ hồ sơ pháp nhân của nhà tuyển dụng vào bài đăng tuyển dụng.
* **Đầu vào (Input):**
  - `job`: Dữ liệu bài đăng đang tạo hoặc cập nhật.
  - `recruiterProfile`: Hồ sơ công ty của Recruiter.
* **Đầu ra (Output):** Dữ liệu bài đăng với `is_tax_verified`, `tax_verification_tier`, `tax_code` được kế thừa chính xác.

---

## 2. Giao Ước API REST Phía Máy Chủ (Server Endpoint Contracts)

### 2.1. `POST /api/jobs/extract-skills`
* **Mô tả:** Trích xuất kỹ năng từ văn bản JD.
* **Headers:** `Content-Type: application/json`
* **Body:**
  ```json
  {
    "description": "Cần tuyển Thực tập sinh ReactJS, thành thạo TypeScript, Node.js, sử dụng PostgreSQL, Docker và Figma."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "allSkills": ["ReactJS", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Figma"],
    "categorized": [
      {
        "category": "languages_frameworks",
        "categoryLabel": "Ngôn ngữ & Framework cốt lõi",
        "skills": ["ReactJS", "TypeScript", "Node.js"]
      },
      {
        "category": "database_cloud",
        "categoryLabel": "Cơ sở dữ liệu & Đám mây",
        "skills": ["PostgreSQL", "Docker"]
      },
      {
        "category": "tools_methods",
        "categoryLabel": "Công cụ & Phương pháp luận",
        "skills": ["Figma"]
      }
    ],
    "rawCount": 6
  }
  ```

### 2.2. `GET /api/jobs/:id/candidate-matches`
* **Mô tả:** Lấy danh sách ứng viên phù hợp với tin đăng tuyển dụng (yêu cầu quyền Recruiter).
* **Response (200 OK):**
  ```json
  {
    "jobId": "j1",
    "totalEligibleCandidates": 8,
    "topMatches": [
      {
        "candidateId": "stu_01",
        "candidateName": "Trần Thị B",
        "university": "Đại Học Bách Khoa",
        "matchScore": 92,
        "matchedSkills": ["ReactJS", "TypeScript", "Node.js"],
        "missingSkills": ["Docker"],
        "verifiedProjectsCount": 2,
        "isOpenToWork": true
      }
    ]
  }
  ```

---

## 3. Giao Ước Thành Phần Giao Diện (UI Component Contracts)

### 3.1. Hộp Thoại Tạo / Sửa Tin Tuyển Dụng (`JobManagement.tsx`)
1. **Khối Thông Tin Lương & Hình Thức:**
   - Trường nhập `salary_min` & `salary_max` (Number input) + Dropdown chọn `currency` (`VND` / `USD`).
   - Checkbox `[x] Lương Thỏa Thuận` (khi tích, disable 2 ô min/max).
   - Dropdown chọn `workplace_type`: `🏢 On-site`, `🌐 Hybrid`, `🏠 Remote`.
   - Dropdown chọn `experience_level`: `🌱 Intern`, `🚀 Fresher`, `⚡ Junior`, `💼 Middle`, `🏆 Senior`.
   - Date picker chọn `deadline_date`.
2. **Nút Bóc Tách Kỹ Năng Tự Động:**
   - Nút `[ ✨ AI Bóc Tách Kỹ Năng ]` đặt ngay cạnh ô nhập Kỹ năng.
   - Khi bấm, đọc nội dung trong ô `Mô tả công việc (Description)`, gọi `extractSkillsFromText` và điền tự động các tag trích xuất được vào ô kỹ năng.
3. **Thẻ Tin Đăng Trong Bảng:**
   - Hiển thị badge dải lương, hình thức làm việc, cấp bậc.
   - Hiển thị chip số lượng ứng viên tiềm năng: `[ 👥 8 ứng viên phù hợp ]` (Bấm vào chuyển sang `CandidateSearch` với bộ lọc tương ứng).
   - Hiển thị Huy hiệu Tích Xanh doanh nghiệp nếu tài khoản đã xác thực MST.

### 3.2. Thẻ Công Việc Dành Cho Sinh Viên (`StudentJobs.tsx`)
1. **Huy hiệu Dải Lương Nổi Bật:**
   - Hiển thị `10 - 15 Triệu VNĐ` hoặc `Thỏa thuận` với màu sắc trực quan (màu xanh ngọc / tím).
2. **Tag Cấp Bậc & Hình Thức:**
   - Tag cấp bậc: `🌱 Thực tập sinh`, `🚀 Mới tốt nghiệp`, `⚡ Junior`.
   - Tag hình thức: `🏢 On-site`, `🌐 Hybrid`, `🏠 Remote`.
3. **Huy hiệu Độ Phù Hợp Cá Nhân:**
   - Nếu sinh viên đã có kỹ năng trong Master Profile, hiển thị chip:
     `[ 🎯 85% Phù hợp với bạn ]` với màu xanh lá cây hoặc chàm.
