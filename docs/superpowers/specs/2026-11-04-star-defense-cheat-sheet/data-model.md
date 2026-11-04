# Data Model: STAR Defense Cheat-Sheet & Metric Justification

## Entities & Schemas

### 1. `MetricBasisInfo` (Cơ Sở Số Liệu & Công Cụ Đo Đạc)
Chi tiết kỹ thuật về cách con số định lượng trong câu bullet point được đo đạc và tái hiện.

| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `metricText` | `string` | Có | Con số hoặc cụm từ định lượng trích xuất được (VD: "40%", "150ms", "5000 users"). |
| `measurementTool` | `string` | Có | Công cụ dùng để đo (VD: "Chrome DevTools Network Tab & Performance Profiler", "PostgreSQL EXPLAIN ANALYZE", "Lighthouse CI"). |
| `beforeMetric` | `string` | Có | Trạng thái/con số trước khi tối ưu (VD: "Thời gian tải trang ban đầu ~2.8s với TTFB 850ms"). |
| `afterMetric` | `string` | Có | Trạng thái/con số sau khi tối ưu (VD: "Thời gian tải trang giảm còn ~1.6s, điểm Lighthouse tăng từ 62 lên 94"). |
| `reproductionMethod` | `string` | Có | Các bước tái hiện đo đạc nếu Tech Lead yêu cầu live-demo hoặc giải thích chi tiết. |

---

### 2. `TrapQuestionItem` (Câu Hỏi Bẫy Của Phỏng Vấn Viên)
Câu hỏi đào sâu kỹ thuật mà Tech Lead / Senior Developer thường xoáy vào đối với câu chữ hoặc công nghệ này.

| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `string` | Có | Mã định danh câu hỏi bẫy. |
| `question` | `string` | Có | Nội dung câu hỏi vặn vẹo (VD: "Tại sao em chọn Redis cache mà không dùng In-memory cache cục bộ?"). |
| `interviewerIntent` | `string` | Có | Ý đồ thật sự của người phỏng vấn (Họ đang test điều gì: trade-off, kiến trúc, hay tính trung thực). |
| `modelAnswer` | `string` | Có | Kịch bản trả lời mẫu 30 giây gãy gọn, chuẩn kỹ thuật. |
| `pitfallToAvoid` | `string` | Có | Sai lầm chết người cần tránh (VD: "Đừng nói 'em thấy trên mạng làm vậy' hoặc bịa số lượng server"). |

---

### 3. `RedFlagWarning` (Cảnh Báo Từ Ngữ Nhạy Cảm / Buzzwords)
Phát hiện các từ ngữ "đao to búa lớn" dễ biến ứng viên thành mục tiêu bị soi xét khắt khe.

| Trường dữ liệu | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `term` | `string` | Có | Từ khóa nhạy cảm phát hiện được (VD: "Microservices", "99.99% Uptime", "AI-powered"). |
| `riskLevel` | `'low' \| 'medium' \| 'high'` | Có | Mức độ rủi ro khi đưa vào CV sinh viên/junior. |
| `reason` | `string` | Có | Lý do tại sao từ này gây bất lợi nếu không giải trình sâu được. |
| `suggestedReplacement` | `string` | Có | Cụm từ thay thế an toàn, khiêm tốn nhưng vẫn chuẩn kỹ thuật (VD: "Module hóa hướng dịch vụ", "Kiến trúc Monolith phân tầng"). |

---

### 4. `StarDefenseItem` (Đối Tượng Phao Cứu Sinh Cho 1 Câu Bullet)
Thực thể chính chứa toàn bộ tài liệu giải trình cho 1 dòng bullet point cụ thể.

```typescript
export interface StarDefenseItem {
  id: string; // ID câu hoặc hash nội dung
  bulletText: string; // Nội dung câu bullet gốc
  projectId?: string;
  projectName?: string;
  detectedTechs: string[]; // Các công nghệ phát hiện trong câu (VD: ['React', 'Redis'])
  metricBasis?: MetricBasisInfo;
  trapQuestions: TrapQuestionItem[];
  redFlags: RedFlagWarning[];
  candidateNotes?: string; // Ghi chú cá nhân của ứng viên để bổ sung luận điểm riêng
  updatedAt: string;
}
```

---

### 5. `ProjectDefenseOverview` (Tổng Hợp Phao Cứu Sinh Toàn Đồ Án)
```typescript
export interface ProjectDefenseOverview {
  projectId: string;
  projectName: string;
  defenseItems: StarDefenseItem[];
  overallReadinessScore: number; // 0 - 100%
  highRiskCount: number;
  totalTrapQuestions: number;
}
```
