# CV Builder → JD Compatibility Analysis

## 1. Mục tiêu

Kết hợp hai chức năng **Tạo CV** và **Đánh giá độ tương thích CV với JD** thành một luồng liên tục.

Nguyên tắc:

> CV sau khi được tạo và lưu từ CV Builder sẽ trở thành đầu vào trực tiếp của module JD Compatibility. Người dùng không cần upload hoặc nhập lại CV.

---

## 2. Luồng nghiệp vụ tổng thể

```text
┌──────────────────────┐
│       BẮT ĐẦU        │
└──────────┬───────────┘
           │
           ▼
┌────────────────────────────┐
│       1. TẠO CV            │
│                            │
│ - Thông tin cá nhân        │
│ - Mục tiêu nghề nghiệp     │
│ - Kinh nghiệm              │
│ - Học vấn                  │
│ - Kỹ năng                  │
│ - Dự án                    │
│ - Chứng chỉ                │
│ - Thành tích               │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│       2. LƯU CV            │
│                            │
│ Hệ thống tạo CV ID         │
│ và lưu toàn bộ dữ liệu CV  │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│    3. CHỌN / NHẬP JD       │
│                            │
│ - Chọn JD có sẵn            │
│ - Paste nội dung JD        │
│ - Upload JD                │
└────────────┬───────────────┘
             │
             │ CV ID + JD
             ▼
┌────────────────────────────┐
│    4. AI PHÂN TÍCH CV/JD   │
│                            │
│ Trích xuất và chuẩn hóa:   │
│ - Skills                   │
│ - Experience               │
│ - Education                │
│ - Requirements             │
│ - Keywords                 │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│ 5. ĐÁNH GIÁ ĐỘ TƯƠNG THÍCH │
│                            │
│ - Skill Match              │
│ - Experience Match         │
│ - Education Match          │
│ - Keyword Match            │
│ - Requirement Match        │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│      6. MATCH SCORE        │
│                            │
│         82 / 100           │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  7. PHÂN TÍCH CHI TIẾT     │
│                            │
│ ✓ Điểm mạnh                │
│ ⚠ Điểm còn thiếu           │
│ ✕ Yêu cầu chưa đáp ứng     │
│ 💡 Đề xuất cải thiện CV    │
└────────────┬───────────────┘
             │
             ▼
      ┌───────────────┐
      │ Cần sửa CV?   │
      └───────┬───────┘
          Có  │  Không
              │
      ┌───────┘ └───────────────┐
      ▼                          ▼
┌──────────────────┐    ┌──────────────────┐
│ 8. CHỈNH SỬA CV  │    │ 9. HOÀN TẤT      │
│                  │    │                  │
│ Theo đề xuất AI  │    │ - Xem kết quả    │
│                  │    │ - Xuất CV        │
│                  │    │ - Ứng tuyển      │
└────────┬─────────┘    └──────────────────┘
         │
         │ CV phiên bản mới
         ▼
┌────────────────────────────┐
│ 10. ĐÁNH GIÁ LẠI CV ↔ JD   │
│                            │
│ Sử dụng CV mới + JD cũ     │
└────────────┬───────────────┘
             │
             └──────────────► Match Score mới
```

---

# 3. Mô tả chi tiết từng bước

## Step 1 — Tạo CV

Người dùng tạo CV thông qua CV Builder.

### Dữ liệu CV

- Personal Information
- Career Objective
- Work Experience
- Education
- Technical Skills
- Soft Skills
- Projects
- Certificates
- Achievements
- Extracurricular Activities
- Leadership Experience

Người dùng có thể tạo CV thủ công hoặc sử dụng AI để hỗ trợ viết nội dung.

---

## Step 2 — Lưu CV

Sau khi hoàn tất, hệ thống lưu CV thành một bản CV cụ thể.

Ví dụ:

```text
CV ID: CV-001
User ID: USER-001
CV Name: Backend Developer CV
Version: 1
Status: Completed
```

Dữ liệu CV được lưu để các module khác có thể sử dụng.

### Quan trọng

Module JD Matching chỉ cần nhận:

```text
cv_id
```

thay vì yêu cầu người dùng upload CV lại.

---

# 4. Step 3 — Chọn hoặc nhập JD

Sau khi CV được lưu, giao diện hiển thị CTA:

> **Đánh giá độ phù hợp với JD**

Người dùng có thể:

### Option A — Chọn JD có sẵn

```text
JD Backend Developer
JD Frontend Developer
JD Business Analyst
JD Software Engineer
```

### Option B — Paste JD

Người dùng copy nội dung JD từ website tuyển dụng và paste vào hệ thống.

### Option C — Upload JD

Cho phép upload tài liệu JD nếu hệ thống hỗ trợ.

---

# 5. Step 4 — AI phân tích CV và JD

Backend lấy hai nguồn dữ liệu:

```text
CV
│
└── cv_id = CV-001
        │
        ▼
   CV Data

JD
│
└── jd_id / jd_content
        │
        ▼
   JD Data
```

AI tiến hành chuẩn hóa dữ liệu.

### CV

```text
Skills
Experience
Education
Projects
Achievements
Keywords
```

### JD

```text
Required Skills
Preferred Skills
Experience Requirements
Education Requirements
Responsibilities
Keywords
Technical Requirements
Soft Skills
```

---

# 6. Step 5 — Tính độ tương thích

Hệ thống so sánh CV với JD theo nhiều tiêu chí.

| Tiêu chí | Nội dung |
|---|---|
| Skill Match | CV có đáp ứng các kỹ năng JD yêu cầu không |
| Experience Match | Kinh nghiệm có phù hợp không |
| Education Match | Học vấn có đáp ứng không |
| Keyword Match | CV có các keyword quan trọng không |
| Requirement Match | Các yêu cầu bắt buộc đã đáp ứng chưa |
| Project Match | Dự án có liên quan đến vị trí không |
| Soft Skill Match | Kỹ năng mềm có phù hợp không |

---

# 7. Match Score

Hệ thống tổng hợp kết quả thành điểm tương thích.

Ví dụ:

```text
Overall Match: 82%

Skill Match:          90%
Experience Match:     80%
Education Match:     100%
Keyword Match:        75%
Requirement Match:    80%
Project Match:        85%
```

Có thể cấu hình trọng số tùy theo sản phẩm.

Ví dụ:

```text
Overall Score =
    Skill × 35%
  + Experience × 20%
  + Requirement × 20%
  + Keyword × 10%
  + Project × 10%
  + Education × 5%
```

---

# 8. Phân tích kết quả

Sau khi tính điểm, hệ thống không chỉ trả về một con số mà phải giải thích lý do.

## 8.1 Điểm mạnh

Ví dụ:

```text
✓ Có Node.js
✓ Có TypeScript
✓ Có REST API
✓ Có MySQL
✓ Có Docker
✓ Có 2 dự án Backend liên quan
```

## 8.2 Điểm còn thiếu

Ví dụ:

```text
⚠ Chưa thể hiện kinh nghiệm Redis
⚠ Chưa có AWS trong CV
⚠ Chưa đề cập Microservices
```

## 8.3 Yêu cầu chưa đáp ứng

Ví dụ:

```text
✕ JD yêu cầu tối thiểu 2 năm kinh nghiệm.
  CV hiện thể hiện 1 năm 4 tháng.
```

## 8.4 Đề xuất cải thiện

AI đưa ra đề xuất cụ thể:

```text
1. Bổ sung Redis nếu bạn thực sự có kinh nghiệm.
2. Làm nổi bật REST API trong phần Project.
3. Bổ sung số liệu về hiệu suất hệ thống nếu có.
4. Đưa Docker vào phần Technical Skills.
5. Điều chỉnh mô tả dự án để phù hợp với Backend Developer.
```

---

# 9. Step 8 — Cải thiện CV

Người dùng có thể bấm:

> **Cải thiện CV theo JD**

Hệ thống đưa người dùng quay lại CV Builder.

Tuy nhiên, CV Builder phải giữ nguyên:

```text
CV hiện tại
+
JD đang phân tích
+
AI Recommendations
```

Người dùng chỉnh sửa CV dựa trên các đề xuất.

---

# 10. Step 9 — Đánh giá lại

Sau khi chỉnh CV:

```text
CV Version 1
      │
      ▼
Match = 72%
      │
      ▼
AI Recommendations
      │
      ▼
User chỉnh CV
      │
      ▼
CV Version 2
      │
      ▼
Match = 86%
```

JD vẫn được giữ nguyên.

Hệ thống chỉ thay đổi phiên bản CV được dùng để đánh giá.

---

# 11. Luồng hoàn chỉnh

```text
                    ┌─────────────┐
                    │   USER      │
                    └──────┬──────┘
                           │
                           ▼
                  ┌────────────────┐
                  │   CREATE CV    │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │    SAVE CV     │
                  │    CV-001      │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │   SELECT JD    │
                  │  / INPUT JD    │
                  └───────┬────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │     AI MATCHING      │
               │                      │
               │ CV-001 + JD-001      │
               └──────────┬───────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │    MATCH SCORE       │
               │       82%            │
               └──────────┬───────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │   GAP ANALYSIS       │
               │                      │
               │ Missing Skills       │
               │ Missing Keywords     │
               │ Missing Experience   │
               └──────────┬───────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │  AI RECOMMENDATION   │
               └──────────┬───────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │     EDIT CV          │
               │     Version 2        │
               └──────────┬───────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │    RE-MATCH CV/JD    │
               └──────────┬───────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │   FINAL MATCH SCORE  │
               │       88%            │
               └──────────┬───────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │ DOWNLOAD / APPLY     │
               └──────────────────────┘
```

---

# 12. Data Flow

```text
                    CV BUILDER
                        │
                        ▼
                  ┌───────────┐
                  │    CV     │
                  │  CV-001   │
                  └─────┬─────┘
                        │
                        │
                        ▼
              ┌───────────────────┐
              │ JD MATCHING ENGINE │
              └─────────┬─────────┘
                        ▲
                        │
                        │
                  ┌─────┴─────┐
                  │    JD     │
                  │  JD-001   │
                  └───────────┘
                        │
                        ▼
                ┌──────────────┐
                │ AI ANALYSIS  │
                └──────┬───────┘
                       │
                       ▼
              ┌─────────────────┐
              │ MATCH RESULT    │
              │                 │
              │ Score           │
              │ Matched Skills  │
              │ Missing Skills  │
              │ Recommendations │
              └───────┬─────────┘
                      │
                      ▼
                 CV IMPROVEMENT
                      │
                      ▼
                  NEW VERSION
                      │
                      └──────────► RE-MATCH
```

---

# 13. Đề xuất database relationship

```text
users
  │
  └── cvs
       │
       ├── cv_versions
       │
       └── cv_sections
              │
              ▼
        compatibility_analyses
              ▲
              │
              ▼
             jobs
              │
              └── job_requirements
```

Một CV có thể được đánh giá với nhiều JD:

```text
CV-001
  │
  ├── JD-001 → Match 82%
  ├── JD-002 → Match 91%
  └── JD-003 → Match 67%
```

Một JD cũng có thể được đánh giá với nhiều phiên bản CV:

```text
JD-001
  │
  ├── CV-001 v1 → 72%
  ├── CV-001 v2 → 82%
  └── CV-001 v3 → 88%
```

---

# 14. Nguyên tắc UX quan trọng

### Không bắt người dùng nhập lại CV

Sau khi tạo CV:

```text
[ Lưu CV ]
     ↓
[ Đánh giá với JD ]
```

Không nên:

```text
Tạo CV
  ↓
Download PDF
  ↓
Upload PDF
  ↓
Đánh giá JD
```

### Giữ JD trong phiên chỉnh sửa

Nếu người dùng đang tối ưu CV cho một JD:

```text
Current CV
+
Target JD
+
AI Recommendations
```

phải được giữ xuyên suốt quá trình.

### Hỗ trợ nhiều phiên bản CV

Ví dụ:

```text
Backend Developer CV
├── Version 1
├── Version 2
└── Version 3
```

Mỗi version có thể được đánh giá lại với cùng một JD.

---

# 15. Kết quả cuối cùng của hệ thống

Luồng sản phẩm hoàn chỉnh trở thành:

```text
CREATE
  ↓
SAVE
  ↓
SELECT JD
  ↓
ANALYZE
  ↓
MATCH SCORE
  ↓
GAP ANALYSIS
  ↓
AI RECOMMENDATION
  ↓
IMPROVE CV
  ↓
RE-MATCH
  ↓
FINAL CV
  ↓
DOWNLOAD / APPLY
```

## Product Value

Thay vì chỉ cung cấp:

> "Tạo CV"

hoặc:

> "Chấm điểm CV"

hệ thống trở thành một vòng lặp:

> **Tạo CV → Đánh giá → Phát hiện thiếu → Cải thiện → Đánh giá lại → Tối ưu CV cho vị trí tuyển dụng.**

Đây là luồng chính nên được sử dụng làm **core user journey** của hệ thống.
