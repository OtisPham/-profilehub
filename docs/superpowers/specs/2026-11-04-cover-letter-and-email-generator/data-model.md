# Data Model: Cover Letter & Application Email Generator

> **Feature Directory:** `docs/superpowers/specs/2026-11-04-cover-letter-and-email-generator/`  
> **Type Definitions:** `profilehub/src/types/coverLetter.types.ts`  

---

## 1. Entities & Types

### `CoverLetterTone`
```typescript
export type CoverLetterTone = 'professional' | 'startup' | 'technical';
```

### `CoverLetterDraft`
Bản ghi thư ứng tuyển và email đính kèm hoàn chỉnh:
```typescript
export interface CoverLetterDraft {
  id: string;
  applicationId?: string; // Liên kết với đơn nộp trên Kanban
  companyName: string;
  roleTitle: string;
  recipientName?: string; // Tên HR / Tech Lead nếu biết
  tone: CoverLetterTone;
  
  // Phần Thư Ứng Tuyển A4 (Formal Cover Letter)
  letter: {
    salutation: string;
    hookParagraph: string;
    projectHighlightParagraph: string;
    companyFitParagraph: string;
    callToActionParagraph: string;
    signOff: string;
    fullMarkdown: string;
  };

  // Phần Email gửi kèm CV (Short Email Pitch)
  email: {
    subjectLine: string;
    bodyText: string;
    attachmentsList: string[];
  };

  // Metadata
  highlightedProjects: {
    projectId?: string;
    projectTitle: string;
    keyMetric?: string;
    technologies: string[];
  }[];
  createdAt: string;
  updatedAt: string;
}
```

### `GenerateCoverLetterInput`
Đầu vào để sinh thư ứng tuyển:
```typescript
export interface GenerateCoverLetterInput {
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  jobDescription?: string;
  recipientName?: string;
  tone?: CoverLetterTone;
  
  // Thông tin ứng viên trích xuất từ CV/Profile
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateUniversity?: string;
  
  // Dự án tiêu biểu để đưa vào thư
  projects?: {
    id?: string;
    projectName: string;
    description: string;
    bullets?: string[];
    technologies: string[];
    verificationCode?: string;
  }[];
}
```

---

## 2. Invariants & Rules
1. **Không bịa đặt dự án:** Chỉ trích xuất từ danh sách dự án do ứng viên cung cấp hoặc từ bản CV đang liên kết.
2. **Khớp nối thông minh:** Tự động ưu tiên dự án có công nghệ khớp với vị trí ứng tuyển nhất lên đoạn 2 của bức thư.
3. **Độ dài chuẩn mực:** Cover Letter dài từ 250–400 từ (vừa vặn 1 trang A4 chuẩn format). Email dưới 150 từ.
4. **Offline Zero-Token Resilience:** Nếu không có kết nối internet hoặc API AI bận, Rule Engine cục bộ tự động sinh bản thư hoàn chỉnh với văn phong chuẩn mực không bị gián đoạn.
