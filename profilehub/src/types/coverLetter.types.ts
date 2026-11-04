/**
 * coverLetter.types.ts
 * Khai báo Schema Types & Enums cho Bộ Hồ Sơ Ứng Tuyển Toàn Diện (Cover Letter & Outbound Email)
 * Chuẩn: TypeScript Strict Mode (0 any, 100% type-safety)
 */

export type CoverLetterTone = 'professional' | 'startup' | 'technical';

export interface CoverLetterHighlightedProject {
  projectId?: string;
  projectTitle: string;
  keyMetric?: string;
  technologies: string[];
  verificationCode?: string;
}

export interface CoverLetterSectionContent {
  salutation: string;
  hookParagraph: string;
  projectHighlightParagraph: string;
  companyFitParagraph: string;
  callToActionParagraph: string;
  signOff: string;
  fullMarkdown: string;
}

export interface OutboundEmailContent {
  subjectLine: string;
  bodyText: string;
  attachmentsList: string[];
}

export interface CoverLetterDraft {
  id: string;
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  recipientName?: string;
  tone: CoverLetterTone;
  letter: CoverLetterSectionContent;
  email: OutboundEmailContent;
  highlightedProjects: CoverLetterHighlightedProject[];
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetterCandidateProject {
  id?: string;
  projectName: string;
  description: string;
  bullets?: string[];
  technologies: string[];
  verificationCode?: string;
}

export interface GenerateCoverLetterInput {
  applicationId?: string;
  companyName: string;
  roleTitle: string;
  jobDescription?: string;
  recipientName?: string;
  tone?: CoverLetterTone;
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateUniversity?: string;
  projects?: CoverLetterCandidateProject[];
}
