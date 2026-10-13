CV-JD Matching Framework v2.0
Skill-Gated Matching Model
MỤC TIÊU
Framework v2.0 được thiết kế để giải quyết nhược điểm của v1:

❌ Ứng viên khác ngành vẫn đạt điểm khá cao.

❌ Hard Skills chỉ là một biến cộng điểm.

❌ Khó phân biệt ứng viên phù hợp và ứng viên chỉ có CV đẹp.

Framework v2 áp dụng:

Gate Check
Critical Skill Validation
Raw Score Calculation
Skill Modifier
Final Match Score
STEP 1 - GATE CHECK
Nếu không đáp ứng điều kiện bắt buộc:

Final Score = 0
Status = Reject
Kiểm tra
Must-Have Skills
Ví dụ:

React
TypeScript
SAP FI
Required Certifications
Ví dụ:

PMP
AWS Solution Architect
Language Requirement
Ví dụ:

English B2
Japanese N2
Required Experience
Ví dụ:

Tối thiểu 2 năm
STEP 2 - CRITICAL SKILL SCORE (CSS)
Mục tiêu
Đánh giá các kỹ năng cốt lõi của JD.

Đây là biến quan trọng nhất trong toàn bộ framework.

Công thức
CSS

=

(Số Critical Skills Khớp
÷
Tổng Critical Skills)

× 100
Ví dụ
JD Frontend

Critical Skills:

React
TypeScript
HTML
CSS
CV:

React
HTML
CSS

=

2 / 4 × 100

=

50


---

## CSS Threshold

### Dưới 20%

```text
Reject
20% - 40%
Critical Gap
40% - 60%
Partial Match
60% - 80%
Strong Match
Trên 80%
Excellent Match
STEP 3 - CORE VARIABLES
Tất cả chuẩn hóa về:

0 - 100
1. SMS - Skill Match Score
Ý nghĩa
Đánh giá toàn bộ kỹ năng.

Bao gồm:

Core Skills
Supporting Skills
Tools
Frameworks
Công thức
SMS

=

Matched Skills
÷
Total Required Skills

×100
2. ERS - Experience Relevance Score
Ý nghĩa
Đánh giá mức độ liên quan.

Công thức
ERS

=

(
Industry Match × 40%
+
Role Match × 40%
+
Domain Match × 20%
)
Industry Match
Ví dụ:

Ecommerce ↔ Ecommerce
100

Role Match
Ví dụ:

Frontend ↔ Frontend
100

Domain Match
Ví dụ:

Fintech
SaaS
Healthcare
Logistics
3. IS - Impact Score
Ý nghĩa
Ứng viên tạo ra giá trị gì.

Các dạng impact:

Revenue Increase
Cost Reduction
Efficiency Improvement
Automation
Process Optimization
4. CS - Credibility Score
Ý nghĩa
Mức độ tin cậy của CV.

Level 1
Claim Only

20 điểm

Level 2
Claim + Context

40 điểm

Level 3
Claim + Scale

60 điểm

Level 4
Claim + Metrics

80 điểm

Level 5
Verified Evidence

95-100 điểm

Ví dụ:

GitHub
Portfolio
Website
Demo
Publication
5. GPS - Growth Potential Score
Ý nghĩa
Tiềm năng phát triển.

Đánh giá:

Self Learning
Projects
Certifications
Career Progression
6. CMS - Complexity Score
Ý nghĩa
Độ khó công việc đã thực hiện.

Đánh giá:

Scale
Stakeholders
Technical Complexity
Business Complexity
STEP 4 - RAW SCORE
Fresher
Raw Score

=

(SMS × 0.30)

+

(GPS × 0.30)

+

(CS × 0.20)

+

(ERS × 0.10)

+

(IS × 0.10)
Junior
Raw Score

=

(SMS × 0.30)

+

(ERS × 0.25)

+

(IS × 0.20)

+

(CS × 0.15)

+

(GPS × 0.10)
Mid
Raw Score

=

(SMS × 0.25)

+

(ERS × 0.25)

+

(IS × 0.25)

+

(CS × 0.15)

+

(CMS × 0.10)
Senior
Raw Score

=

(ERS × 0.30)

+

(IS × 0.30)

+

(CMS × 0.20)

+

(CS × 0.10)

+

(SMS × 0.10)
STEP 5 - SKILL MODIFIER
Đây là phần mới của V2.

Sau khi tính Raw Score.

Điểm cuối cùng sẽ được điều chỉnh theo CSS.

CSS < 20
Final Score = 0

Status = Reject
CSS 20-39
Modifier = 0.30
CSS 40-59
Modifier = 0.60
CSS 60-79
Modifier = 0.85
CSS 80-100
Modifier = 1.00
FINAL FORMULA
Final Score

=

Raw Score × Modifier
VÍ DỤ 1
Frontend Developer

CV = Marketing Candidate

SMS = 0

ERS = 10

GPS = 80

CS = 95

IS = 70

CSS = 0

Result

Reject
VÍ DỤ 2
Frontend Intern

CSS = 50

SMS = 55

ERS = 60

GPS = 80

CS = 85

IS = 40

Raw Score

=

55×0.3 + 80×0.3 + 85×0.2 + 60×0.1 + 40×0.1

=

67.5

Modifier

=

0.6

Final Score

=

67.5 × 0.6

=

40.5


---

# SCORE INTERPRETATION

## 90 - 100

Excellent Match

---

## 80 - 89

Strong Match

---

## 70 - 79

Qualified Match

---

## 60 - 69

Potential Match

---

## 40 - 59

Weak Match

---

## <40

Poor Match

---

# TRIẾT LÝ V2

Để ứng viên đạt điểm cao phải thỏa mãn đồng thời:

1. Can Do
   → Skill Match

2. Have Done
   → Experience Relevance

3. Created Value
   → Impact

4. Can Prove
   → Credibility

5. Can Grow
   → Growth Potential

6. Can Handle Complexity
   → Complexity

7. Has Critical Skills
   → Critical Skill Score

