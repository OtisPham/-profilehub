/**
 * application.types.ts
 * Khai báo Schema Types & Interfaces cho Hệ Thống Theo Dõi Tiến Trình Ứng Tuyển (Application Pipeline Tracker)
 * Tuân thủ TypeScript Strict Mode (Zero 'any')
 */

export type ApplicationStage = 
  | 'applied'      // Đã nộp hồ sơ
  | 'screening'    // HR liên hệ / Phỏng vấn sơ bộ
  | 'assessment'   // Bài test chuyên môn / Take-home test
  | 'interview'    // Phỏng vấn vòng kỹ thuật / Phỏng vấn Giám đốc
  | 'offer'        // Nhận thư mời nhận việc (Offer)
  | 'rejected';    // Không trúng tuyển / Ứng viên từ chối

export type ApplicationSource = 
  | 'profilehub'
  | 'topcv'
  | 'itviec'
  | 'linkedin'
  | 'referral'
  | 'other';

export interface CandidateApplicationItem {
  id: string;
  userId: string;
  companyName: string;
  companyLogo?: string;
  roleTitle: string;
  salaryExpectation?: string;
  jobLocation?: string;
  applicationSource: ApplicationSource;
  linkedCvId?: string;
  linkedCvTitle?: string;
  stage: ApplicationStage;
  appliedDate: string; // Định dạng YYYY-MM-DD
  interviewDate?: string; // Định dạng YYYY-MM-DD HH:mm (nếu có)
  jobDescriptionUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationAnalyticsData {
  total: number;
  active: number;
  interviews: number;
  offers: number;
  responseRate: number; // Phần trăm (%)
}

export interface StageColumnConfig {
  key: ApplicationStage;
  label: string;
  description: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
}
