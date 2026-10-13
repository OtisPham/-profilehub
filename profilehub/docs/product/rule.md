ANTIGRAVITY RULEBOOK V6.1
Enterprise Deterministic Matching Engine
1. Core Principles
1.1 AI Has No Authority

AI chỉ được phép:

Plain Text
Extract
Classify
Structure
Suggest Signals
Hiện thị thêm dòng

AI không được phép:

Plain Text
Score
Rank
Determine YOE
Pass Requirements
Decide Final Match
Hiện thị thêm dòng

Backend sở hữu hoàn toàn:

Plain Text
Identity
Evidence
Ontology
Scoring
Ranking
Requirement Evaluation
Hiện thị thêm dòng
2. Deterministic Pipeline
Plain Text
[1] CV / JD Normalization
↓
[2] AI Extraction
↓
[3] Payload Validation
↓
[4] Citation Engine
↓
[5] Ontology Resolver
↓
[6] Evidence Engine
↓
[7] Requirement Engine
↓
[8] YOE Engine
↓
[9] Scoring Engine
↓
[10] Hard Gates Engine
↓
[11] Audit Metadata
↓
[12] Final Output
Hiện thị thêm dòng
3. Citation Engine
Rule

AI trả về:

JSON
{
"sourceId": "EXP_001",
"spanStart": 125,
"spanEnd": 280
}
Hiện thị thêm dòng

Backend mới là bên lấy text.

Python
def validate_span(span_start, span_end, text_length):
return (
0 <= span_start
and span_start < span_end
and span_end <= text_length
)
`
Hiện thị thêm dòng
Invalid Citation

Reject nếu:

Plain Text
Invalid SourceID
Invalid Span
Too Small Span
Unknown Source
Hiện thị thêm dòng
Minimum Evidence Span
Plain Text
>= 2 tokens
Hiện thị thêm dòng

Không dùng:

Plain Text
>= 3 chars
Hiện thị thêm dòng
4. Ontology Resolver
Known Mapping

Nếu tồn tại trong Graph DB:

Plain Text
JD Skill
↔
CV Skill
Hiện thị thêm dòng

=> dùng score của DB.

Ví dụ:

Plain Text
Node.js ↔ Node
= 1.0
Hiện thị thêm dòng
Unknown Mapping

Dùng AI score.

Đồng thời:

Plain Text
needsHumanReview = true
Hiện thị thêm dòng
5. Evidence Engine
Base Score
Source	ScoreProject with metric	3.0
Experience	2.0
Project no metric	1.5
Certification	1.0
Skill Section	0.5
Quantified Metric Validation

Regex:

Python
metric_pattern = (
r'(\d+(\.\d+)?%)|'
r'(\b\d+x\b)|'
r'(\$\d+[KMB]?)|'
r'(\b\d+\susers\b)'
)
 
Hiện thị thêm dòng
Plausibility Validation

Reject:

Plain Text
999999999999%
``
Hiện thị thêm dòng

Reject:

Plain Text
1000000000000 users
Hiện thị thêm dòng

Nếu vượt ngưỡng hợp lý.

Deduplicate Source
Python
score[sourceId] = max(score)
Hiện thị thêm dòng
6. Skill Spam Protection

Normalize:

Plain Text
Python
python
PYTHON
Hiện thị thêm dòng

↓

Plain Text
PYTHON
Hiện thị thêm dòng

Cap:

Python
same_skill_max_count = 1
Hiện thị thêm dòng

Không cho:

Plain Text
Python
Python
Python
Python
Hiện thị thêm dòng

tăng điểm.

7. Project Clone Protection

Sinh:

Python
semantic_hash(project)
Hiện thị thêm dòng

Nếu similarity:

Plain Text
> 95%
Hiện thị thêm dòng

coi như cùng project.

8. Requirement Engine
Requirement Types
Plain Text
SKILL
CERTIFICATION
EDUCATION
LICENSE
LANGUAGE
YOE
CUSTOM
Hiện thị thêm dòng
Requirement Result
JSON
{
"requirementSatisfied": true,
"semanticScore": 0.92,
"evidenceScore": 3.0
}
Hiện thị thêm dòng
9. Logical Groups

Supported:

Plain Text
SINGLE
ANY
ALL
AT_LEAST_N
 
Hiện thị thêm dòng
Coverage
Plain Text
Coverage =
PassedGroups
/
TotalGroups
× 100
Hiện thị thêm dòng
10. YOE Engine
Relevant Experience

Một experience được tính relevant nếu:

Plain Text
Role matches ontology
Hiện thị thêm dòng

OR

Plain Text
Contains:
1 Critical Skill
Hiện thị thêm dòng

OR

Plain Text
Contains:
2 Required Skills
Hiện thị thêm dòng
Interval Union
Python
merge_overlapping_intervals()
Hiện thị thêm dòng

bắt buộc dùng.

Không cộng chồng thời gian.

YOE Score
Python
YOE_fit = min(
relevant_years / required_years,
1.0
) * 100
Hiện thị thêm dòng

Ví dụ:

Plain Text
Required = 3 years
 
Candidate = 1 year
 
YOE = 33.3
Hiện thị thêm dòng
11. Skill Fit
Required
Python
R_fit =
(
sum(required semantic scores)
/
total required skills
) * 100
Hiện thị thêm dòng
Preferred
Python
P_fit =
(
sum(preferred semantic scores)
/
total preferred skills
) * 100
Hiện thị thêm dòng
Final

Nếu Preferred tồn tại:

Python
S_fit =
0.8 * R_fit
+
0.2 * P_fit
Hiện thị thêm dòng

Ngược lại:

Python
S_fit = R_fit
Hiện thị thêm dòng
12. Core Alignment
Definition

Top 3 strongest candidate skills:

Plain Text
Highest Evidence
+
Highest Semantic
Hiện thị thêm dòng

Bonus:

Plain Text
Match Required Skills
Hiện thị thêm dòng

Score:

Python
CoreAlignment =
MatchedCoreSkills
/
3
*
100
Hiện thị thêm dòng

Cap:

Plain Text
100
Hiện thị thêm dòng
13. Raw Score
Python
RawScore =
(
0.50 * S_fit
+
0.25 * Coverage
+
0.20 * YOE_fit
+
0.05 * CoreAlignment
)
Hiện thị thêm dòng
14. Hard Gates
Gate 1

No Critical Pass

Python
if criticalPassed == 0:
RawScore = min(RawScore, 10)
Hiện thị thêm dòng
Gate 2

Coverage Zero

Python
if Coverage == 0:
RawScore = min(RawScore, 15)
Hiện thị thêm dòng
Gate 3

Weak Skill Match

Python
if S_fit < 20:
RawScore = min(RawScore, 25)
Hiện thị thêm dòng
Gate 4

Domain Mismatch

Python
if S_fit == 0 and Coverage == 0:
RawScore = 0
Hiện thị thêm dòng

Ví dụ:

Plain Text
Java Developer
→ Marketing Executive
Hiện thị thêm dòng

↓

Plain Text
FinalScore = 0
Hiện thị thêm dòng
15. Final Score
Python
FinalScore =
Decimal(RawScore)
.quantize(
Decimal("0.1"),
rounding=ROUND_HALF_UP
)
Hiện thị thêm dòng
16. Audit Metadata
JSON
{
"auditMetadata": {
"version": "6.1",
"cvHash": "...",
"jdHash": "...",
"ontologyVersion": "...",
"rulebookVersion": "...",
"scoringVersion": "...",
"llmSnapshotId": "...",
"needsHumanReview": false
}
}
Hiện thị thêm dòng
17. Expected Results
Case	ExpectedJava → Marketing	0-5%
QA → Backend	15-35%
Junior Backend → Senior Backend	50-75%
Strong Match	80-95%
Near Perfect Match	95-100%