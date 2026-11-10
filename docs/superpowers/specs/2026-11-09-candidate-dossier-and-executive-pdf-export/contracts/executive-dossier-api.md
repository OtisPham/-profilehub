# API & Service Contract: Executive Evaluation Dossier & Template Service

> **Feature Directory:** `docs/superpowers/specs/2026-11-09-candidate-dossier-and-executive-pdf-export/`  
> **Source Service:** `src/services/executiveDossierService.ts` & `src/services/jobTemplateBank.ts`  
> **Status:** SPECIFIED  

---

## 1. `executiveDossierService`

```typescript
export interface ExecutiveDossierServiceContract {
  /**
   * Tổng hợp toàn bộ dữ liệu ứng viên trong pipeline thành hồ sơ báo cáo điều hành
   */
  buildExecutiveDossier(
    candidate: CandidatePipelineItem,
    isBlind?: boolean,
    companyName?: string
  ): ExecutiveEvaluationDossier;

  /**
   * Tạo văn bản Markdown/Text tóm tắt hồ sơ để copy nhanh gửi qua Email hoặc Slack
   */
  generateExecutiveEmailSummary(dossier: ExecutiveEvaluationDossier): string;
}
```

---

## 2. `jobTemplateBank`

```typescript
export interface JobTemplateBankContract {
  /**
   * Lấy danh sách toàn bộ các mẫu JD chuẩn ngành IT & Tech
   */
  getAllTemplates(): JobTemplateItem[];

  /**
   * Lấy chi tiết một mẫu JD theo mã định danh
   */
  getTemplateById(id: string): JobTemplateItem | undefined;
}
```
