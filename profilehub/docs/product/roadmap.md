# ProfileHub Product Roadmap & Architecture
Version: 1.0
Status: Approved for MVP Planning

---

# 1. Product Vision

## Mục tiêu

ProfileHub không phải là một AI CV Builder đơn thuần.

ProfileHub được xây dựng như một:

> Career Profile Platform

Giúp sinh viên, fresher và người mới đi làm:

- Lưu trữ hồ sơ nghề nghiệp tập trung.
- Tạo nhiều CV từ cùng một nguồn dữ liệu.
- Tối ưu CV theo vị trí ứng tuyển.
- Được AI hỗ trợ viết và cải thiện nội dung.
- Xuất CV chuẩn ATS một cách nhanh chóng.

---

# 2. Core Principles

## 2.1 Data First, AI Second

Giá trị cốt lõi không nằm ở AI.

Giá trị cốt lõi nằm ở:

- Master Profile
- Career Data
- Workflow
- Output Quality

AI chỉ là công cụ hỗ trợ.

---

## 2.2 Workflow Over Chatbot

Không xây dựng chatbot tự do.

Thay vào đó:

- Form
- Actions
- Guided Workflow

AI được đóng gói trong các tác vụ cụ thể.

---

## 2.3 Evidence First

AI không được:

- Bịa kinh nghiệm
- Bịa chứng chỉ
- Bịa kỹ năng
- Bịa thành tích
- Bịa số liệu

AI chỉ:

- Khai thác thêm thông tin
- Sắp xếp thông tin
- Viết lại nội dung
- Định dạng nội dung

Mọi dữ liệu quan trọng phải được người dùng xác nhận.

---

## 2.4 Snapshot Is Immutable

CV đã xuất hoặc đã chốt phải được lưu độc lập.

Mọi thay đổi trong Master Profile không được tự động ghi đè lên:

- CV Final
- PDF đã xuất

---

# 3. Data Architecture

## 3.1 Core Data Model

```text
Master Profile
    ↓
CV Draft
    ↓
CV Snapshot
```

---

## 3.2 Master Profile

Nguồn dữ liệu nghề nghiệp gốc.

### Bao gồm

```text
Personal Information

Education

Work Experience

Projects

Activities

Skills

Certificates

Awards

Languages
```

### Đặc điểm

- Một người dùng chỉ có một Master Profile.
- Có thể cập nhật liên tục.
- Là nguồn sinh ra nhiều CV khác nhau.

---

## 3.3 CV Draft

CV đang chỉnh sửa.

### Đặc điểm

- Liên kết với Master Profile.
- Có thể thay đổi nội dung.
- Có thể tối ưu theo JD.
- Có thể tạo nhiều Draft.

### Ví dụ

```text
Frontend Intern CV

Backend Intern CV

Data Analyst CV

Marketing Executive CV
```

---

## 3.4 CV Snapshot

Phiên bản được chốt.

### Đặc điểm

- Lưu nội dung tại thời điểm xác nhận.
- Không tự động thay đổi.
- Dùng để xuất PDF.
- Dùng để lưu lịch sử.

---

# 4. User Flows

## Flow A - Tạo CV đầu tiên

```text
Tạo Master Profile
        ↓
Nhập thông tin
        ↓
AI khai thác kinh nghiệm
        ↓
Sinh nội dung CV
        ↓
Xem trước
        ↓
Kiểm tra chất lượng
        ↓
Xuất PDF
```

---

## Flow B - Ứng tuyển theo JD

```text
Chọn Master Profile
        ↓
Nhập JD
        ↓
AI phân tích JD
        ↓
Tạo CV Draft mới
        ↓
Đề xuất thay đổi
        ↓
Người dùng xác nhận
        ↓
CV dành riêng cho JD
        ↓
Xuất PDF
```

---

## Flow C - Cập nhật hồ sơ nghề nghiệp

```text
Cập nhật Master Profile
        ↓
Hệ thống phát hiện CV liên quan
        ↓
Thông báo có thể cập nhật
        ↓
Người dùng chọn đồng bộ
        ↓
Tạo Draft mới
```

Không được ghi đè CV đã chốt.

---

# 5. MVP Scope (P0)

## Mục tiêu

Giúp một người chưa có CV:

> Tạo được CV hoàn chỉnh trong vòng 10 phút.

---

# Feature 1: Master Profile

## Chức năng

Lưu trữ toàn bộ dữ liệu nghề nghiệp.

### Bao gồm

- Personal Information
- Education
- Projects
- Activities
- Experience
- Skills
- Certificates

---

# Feature 2: Step-by-Step CV Builder

## Chức năng

Dẫn dắt người dùng hoàn thiện CV.

### Các bước

```text
Bước 1
Thông tin cá nhân

Bước 2
Học vấn

Bước 3
Kinh nghiệm

Bước 4
Dự án

Bước 5
Kỹ năng

Bước 6
Xem trước
```

---

# Feature 3: AI Experience Discovery & Writing Engine

## Mục tiêu

Biến trải nghiệm đời thường thành nội dung CV chuyên nghiệp.

---

### Discovery

AI hỏi thêm:

```text
Bạn làm vai trò gì?

Bạn chịu trách nhiệm gì?

Kết quả đạt được là gì?

Có số liệu thực tế không?
```

---

### Evidence Extraction

AI xác định:

```text
Action

Responsibility

Skill

Impact

Result
```

---

### Writing

AI sinh:

```text
CV Bullet

Achievement Statement

Project Description
```

---

# Feature 4: AI Rewrite Actions

Không sử dụng chatbot tự do.

Sử dụng các action cố định.

### Rewrite

```text
Professional hơn

Ngắn gọn hơn

Chi tiết hơn

Tập trung kết quả hơn
```

### ATS Optimization

```text
ATS Friendly

Keyword Optimization
```

### Language

```text
Dịch sang tiếng Anh

Dịch sang tiếng Việt
```

---

# Feature 5: Live Preview

## Chức năng

Xem CV theo thời gian thực.

### Layout

```text
Bên trái:
Form nhập liệu

Bên phải:
CV Preview
```

Mọi thay đổi hiển thị ngay lập tức.

---

# Feature 6: Auto Layout

## Chức năng

Tự động:

- Căn lề
- Co giãn
- Xuống dòng
- Sắp xếp section

Mục tiêu:

Không để CV bị vỡ layout.

---

# Feature 7: PDF Export

## Chức năng

Xuất PDF chuẩn ATS.

### Tiêu chí

- 1 trang ưu tiên
- Đúng định dạng
- Không lỗi font
- Dễ đọc với ATS

---

# Feature 8: AI Guardrails & Fact Verification

## Nguyên tắc

AI không được tạo dữ kiện mới.

---

### Hệ thống phải

✅ Đánh dấu nội dung AI suy luận

✅ Yêu cầu xác nhận

✅ Theo dõi nguồn dữ liệu

✅ Cảnh báo thông tin chưa rõ

---

# Feature 9: Basic Quality Check

Kiểm tra bằng Rule Engine.

### Ví dụ

```text
Thiếu Email

Thiếu Skills

Thiếu Education

CV quá dài

Bullet quá dài

Có section trống
```

Không cần AI trong giai đoạn đầu.

---

# Feature 10: Basic Version Model

Không phải giao diện Version Management.

Chỉ là nền tảng dữ liệu.

### Bao gồm

```text
Master Profile

CV Draft

CV Snapshot
```

Bắt buộc có từ P0.

---

# 6. P1 - CV Optimization

## Feature 11: JD Matching & CV Tailoring

### Chức năng

- Phân tích JD
- So khớp kỹ năng
- Gợi ý keyword
- Tạo CV riêng cho từng vị trí

---

## Feature 12: Conversational CV Editor

### Chức năng

Cho phép chỉnh sửa bằng hội thoại.

Ví dụ:

```text
Nhấn mạnh leadership.

Cho nội dung chuyên nghiệp hơn.

Viết theo văn phong Big4.
```

---

## Feature 13: Advanced CV Analysis Center

Đánh giá nhiều khía cạnh.

### CV Completeness

```text
Thiếu mục nào.
```

### Writing Quality

```text
Ngữ pháp
Độ rõ ràng
Khả năng đọc
```

### Formatting

```text
ATS Parsing
Document Structure
```

### JD Relevance

```text
Mức độ phù hợp với JD
```

### Evidence Quality

```text
Thành tích có bằng chứng hay không
```

---

## Feature 14: Multi-language Support

### Chức năng

- Việt → Anh
- Anh → Việt

### Tùy chỉnh

```text
Professional

Academic

Corporate
```

---

# 7. P2 - Career Growth Platform

## Feature 15: Advanced Version Management

### Chức năng

- Lịch sử phiên bản
- So sánh phiên bản
- Phục hồi phiên bản
- Quản lý theo công ty

---

## Feature 16: Gap Analysis

### Chức năng

Xác định:

- Thiếu kỹ năng
- Thiếu chứng chỉ
- Thiếu kinh nghiệm

so với vị trí mục tiêu.

---

## Feature 17: Career Roadmap

### Chức năng

Đề xuất:

- Khóa học
- Chứng chỉ
- Hướng phát triển

---

## Feature 18: Project Recommendation Engine

### Chức năng

Đề xuất dự án thực chiến phù hợp.

Ví dụ:

```text
Frontend:
Clone Shopee

Backend:
E-commerce API

Data:
Sales Dashboard
```

Lưu ý:

Dự án chỉ được thêm vào CV khi người dùng thực sự hoàn thành.

---

# 8. AI Cost Control Strategy

## Nguyên tắc

Không cho AI hoạt động tự do.

---

## Layer 1 - Frontend Validation

Kiểm tra:

- Độ dài
- Định dạng
- Nội dung hợp lệ

Reject sớm.

---

## Layer 2 - Backend Rule Engine

Kiểm tra:

```text
CV Related
JD Related
Career Related
```

Không hợp lệ:

```text
Viết thơ
Giải toán
Dự báo thời tiết
```

Không gọi AI.

---

## Layer 3 - LLM

Chỉ nhận request hợp lệ.

Ví dụ:

```json
{
  "action": "rewrite_professional",
  "content": "..."
}
```

---

# 9. Things NOT in MVP

Không triển khai ở P0:

❌ Chatbot tự do

❌ Mock Interview

❌ Job Search

❌ Salary Analysis

❌ Career Roadmap

❌ Gap Analysis

❌ Advanced Version Management

❌ Personality Assessment

---

# 10. Success Metrics

## North Star Metric

```text
CV Exported Successfully
```

---

## Funnel

```text
User Register
        ↓
Master Profile Created
        ↓
CV Draft Created
        ↓
CV Exported
```

---

## KPI đề xuất

```text
Profile Completion Rate

CV Creation Rate

CV Export Rate

PDF Download Rate

JD Optimization Usage
```

---

# Final Positioning

## ProfileHub không phải

- ChatGPT Wrapper
- CV Generator
- Resume AI Tool

---

## ProfileHub là

> Career Profile Platform

Nơi người dùng xây dựng, quản lý và phát triển hồ sơ nghề nghiệp lâu dài, với AI đóng vai trò trợ lý hỗ trợ thay vì là trung tâm của sản phẩm.