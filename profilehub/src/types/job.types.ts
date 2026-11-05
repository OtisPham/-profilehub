/**
 * Định nghĩa kiểu dữ liệu chuẩn hóa cho Smart Job Studio & Bắt cặp ứng viên
 * Feature: Smart Job Studio & Automated Skill Tagging
 * File: src/types/job.types.ts
 */

export type ExperienceLevel = 'intern' | 'fresher' | 'junior' | 'middle' | 'senior';

export type WorkplaceType = 'on-site' | 'hybrid' | 'remote';

export type SalaryCurrency = 'VND' | 'USD';

export type JobStatus = 'active' | 'closed';

export type TaxVerificationTier = 'full' | 'silver' | 'unverified';

/**
 * Bài đăng tuyển dụng chuẩn hóa (Standardized Job Post)
 */
export interface JobPost {
  id: string;
  recruiter_id: string;
  title: string;
  department?: string;
  location?: string;
  workplace_type?: WorkplaceType;
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  currency?: SalaryCurrency;
  is_negotiable?: boolean;
  deadline_date?: string; // Định dạng YYYY-MM-DD
  required_skills?: string[];
  description?: string;
  status?: JobStatus;
  is_tax_verified?: boolean;
  tax_verification_tier?: TaxVerificationTier;
  tax_code?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Phân loại nhóm kỹ năng trích xuất từ JD
 */
export type SkillCategory = 'languages_frameworks' | 'database_cloud' | 'tools_methods' | 'other';

export interface ExtractedSkillCategory {
  category: SkillCategory;
  categoryLabel: string;
  skills: string[];
}

export interface SkillExtractionResult {
  allSkills: string[];
  categorized: ExtractedSkillCategory[];
  rawCount: number;
}

/**
 * Cấu hình định dạng lương hiển thị
 */
export interface SalaryFormatOptions {
  salary_min?: number;
  salary_max?: number;
  currency?: SalaryCurrency;
  is_negotiable?: boolean;
}

/**
 * Đầu vào ứng viên dùng để đối soát độ tương đồng (Candidate Matching Input)
 */
export interface CandidateProfileInput {
  id: string;
  full_name: string;
  university?: string;
  major?: string;
  gpa?: string;
  skills?: string[];
  is_open_to_work?: boolean;
  blocked_companies?: string[];
  verified_projects_count?: number;
  projects?: Array<{
    id?: string;
    title: string;
    description?: string;
    tags?: string[];
    is_verified?: boolean;
    verification_status?: string;
  }>;
}

/**
 * Tóm tắt kết quả khớp ứng viên
 */
export interface CandidateMatchSummary {
  candidateId: string;
  candidateName: string;
  university?: string;
  gpa?: string;
  matchScore: number; // 0 đến 100
  matchedSkills: string[];
  missingSkills: string[];
  verifiedProjectsCount: number;
  isOpenToWork: boolean;
}

/**
 * Kết quả bắt cặp ứng viên của tin tuyển dụng
 */
export interface JobCandidateMatchResult {
  jobId: string;
  totalEligibleCandidates: number; // Số ứng viên matchScore >= 50%
  topMatches: CandidateMatchSummary[];
}
