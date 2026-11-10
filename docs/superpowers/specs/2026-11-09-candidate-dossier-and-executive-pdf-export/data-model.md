# Data Model: Hồ Sơ Đánh Giá Ứng Viên Điều Hành & Xuất Báo Cáo PDF (Executive Dossier & PDF Export)

> **Feature Directory:** `docs/superpowers/specs/2026-11-09-candidate-dossier-and-executive-pdf-export/`  
> **Target Schema:** `src/types/database.ts`  
> **Status:** SPECIFIED  

---

## 1. Entities & Interfaces

### 1.1 `DossierScorecardSummary`
Tóm tắt bảng điểm phỏng vấn chuẩn hóa:
```typescript
export interface DossierScorecardSummary {
  consensusScore: number; // 0 - 100
  recommendation: 'strong_hire' | 'hire' | 'neutral' | 'no_hire';
  totalInterviews: number;
  averageCriteria: {
    architecture: number; // 1 - 5
    codeDefense: number;  // 1 - 5
    debugging: number;    // 1 - 5
    communication: number;// 1 - 5
    cultureFit: number;   // 1 - 5
  };
  interviews: Array<{
    interviewerName: string;
    interviewerRole: string;
    overallScore: number;
    recommendation: string;
    strengths: string;
    improvementAreas: string;
    submittedAt: string;
  }>;
}
```

### 1.2 `DossierChallengeSummary`
Tóm tắt kết quả thử thách kỹ thuật gắn đồ án:
```typescript
export interface DossierChallengeSummary {
  title: string;
  deadlineHours: number;
  status: 'issued' | 'submitted' | 'evaluated' | 'expired';
  pullRequestUrl?: string;
  demoUrl?: string;
  solutionNotes?: string;
  evaluationScore?: number; // 0 - 100
  evaluationFeedback?: string;
  submittedAt?: string;
}
```

### 1.3 `DossierProjectHighlight`
Tóm tắt đồ án nổi bật đã được Giảng viên bảo chứng:
```typescript
export interface DossierProjectHighlight {
  id: string;
  title: string;
  description?: string;
  githubUrl?: string;
  demoUrl?: string;
  isVerified: boolean;
  score?: string;
  instructor?: string;
}
```

### 1.4 `ExecutiveEvaluationDossier`
Đối tượng đầy đủ của bản báo cáo trình Giám đốc:
```typescript
export interface ExecutiveEvaluationDossier {
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  university?: string;
  gpa?: string;
  email?: string;
  phone?: string;
  appliedDate: string;
  isBlindMode: boolean;
  jobTitle: string;
  companyName: string;
  
  // Tổng hợp dữ liệu
  scorecardSummary: DossierScorecardSummary;
  challengeSummary?: DossierChallengeSummary;
  verifiedProjects: DossierProjectHighlight[];
  privateNotes?: string;
  
  // Đánh giá chiến lược điều hành
  executiveRecommendation: 'STRONG_HIRE' | 'HIRE' | 'CONSIDER' | 'DECLINE';
  keyStrengths: string[];
  keyRisks: string[];
  recommendedSalaryRange?: string;
  generatedAt: string;
}
```

### 1.5 `JobTemplateItem`
Ngân hàng mẫu JD chuẩn ngành:
```typescript
export interface JobTemplateItem {
  id: string;
  title: string;
  department: string;
  experienceLevel: 'intern' | 'fresher' | 'junior' | 'middle' | 'senior';
  workplaceType: 'on-site' | 'hybrid' | 'remote';
  salaryMin: number;
  salaryMax: number;
  currency: 'VND' | 'USD';
  requiredSkills: string[];
  description: string;
  highlightBenefit: string;
}
```
