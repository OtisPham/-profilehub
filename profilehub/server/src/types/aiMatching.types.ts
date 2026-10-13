/**
 * 🚀 AI CV-JD MATCHING FRAMEWORK v1.0 - TYPES DEFINITION
 */
export type AiEvidenceLevel = 
  | 'unverified_claim'      // Level 0: 0.5 pts - Chỉ tự khai trong mục Skills
  | 'self_documented'       // Level 1: 1.5 pts - Project no metric
  | 'live_artifact'         // Level 2: 2.0 - 3.0 pts - Experience (2.0) / Project with metric (3.0)
  | 'institutional_verified'; // Level 3: 3.0 pts - Verified by institution

export type RequirementType = 
  | 'SKILL' 
  | 'CERTIFICATION' 
  | 'EDUCATION' 
  | 'LICENSE' 
  | 'LANGUAGE' 
  | 'YOE' 
  | 'CUSTOM';

export type LogicalGroupType = 'SINGLE' | 'ANY' | 'ALL' | 'AT_LEAST_N';

export interface AiProjectInput {
  id: string;
  title: string;
  description?: string;
  technologies?: string[];
  tags?: string[];
  metrics?: string[];
  github_url?: string;
  demo_url?: string;
  is_verified?: boolean;
  verifier_name?: string;
  role?: string;
  start_date?: string;
  end_date?: string;
}

export interface AiCertificateInput {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  credential_url?: string;
  is_verified?: boolean;
}

export interface AiExperienceInput {
  id: string;
  company: string;
  role: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  technologies?: string[];
  metrics?: string[];
}

export interface AiCandidateProfile {
  target_role?: string;
  career_summary?: string;
  skills: string[];
  projects: AiProjectInput[];
  experiences?: AiExperienceInput[];
  certificates?: AiCertificateInput[];
  experience_level?: 'intern' | 'fresher' | 'junior' | 'mid' | 'senior';
  years_of_experience?: number;
}

export interface AiJobDescriptionInput {
  title?: string;
  level?: 'intern' | 'fresher' | 'junior' | 'mid' | 'senior';
  raw_jd_text: string;
  required_skills?: string[];
  preferred_skills?: string[];
  min_years_experience?: number;
  critical_skills?: string[];
}

export interface AiSkillFitPillar {
  score: number; // S_fit (0..100)
  r_fit: number; // Required fit
  p_fit: number; // Preferred fit
  matched_core: string[];
  missing_core: string[];
  matched_secondary: string[];
  missing_secondary: string[];
  semantic_matches: Array<{ jd_skill: string; candidate_skill: string; similarity: number }>;
}

export interface AiProjectEvidenceDetail {
  id: string;
  title: string;
  evidence_level: AiEvidenceLevel;
  evidence_weight: number;
  matched_jd_requirements: string[];
  relevance_score: number;
  has_metrics: boolean;
  is_verified: boolean;
  is_relevant?: boolean;
}

export interface AiEvidenceDepthPillar {
  score: number; // 0..100
  top_contributing_projects: AiProjectEvidenceDetail[];
  total_evidence_mass: number;
  relevant_project_count?: number;
  verified_relevant_count?: number;
  total_candidate_projects?: number;
}

export interface AiImpactComplexityPillar {
  score: number; // 0..100
  detected_metrics_count: number;
  metric_examples: string[];
  feedback: string;
}

export interface AiAlignmentPillar {
  score: number; // 0..100
  level_match: boolean;
  target_role_match: boolean;
  note: string;
}

export interface AiRemediationRoadmap {
  suggested_project_title: string;
  project_objective: string;
  recommended_tech_stack: string[];
  target_metrics: string;
  estimated_effort_weeks: number;
}

export interface AiGapItem {
  skill_or_topic: string;
  importance: 'CRITICAL' | 'IMPORTANT' | 'NICE_TO_HAVE';
  current_evidence_level: AiEvidenceLevel;
  gap_description: string;
  remediation_roadmap: AiRemediationRoadmap;
}

export interface RulebookBreakdown {
  skills: number;       // S_fit
  experience: number;   // YOE_fit
  requirements: number; // Coverage
  projects: number;
  keywords: number;     // Core Alignment
  education: number;
}

export interface RulebookCriticalGap {
  requirement: string;
  candidateValue: string;
  severity: 'high' | 'medium' | 'low';
}

export interface RulebookGapAnalysis {
  matchedSkills: string[];
  missingSkills: string[];
  criticalGaps: RulebookCriticalGap[];
}

export interface AuditMetadataV61 {
  version: '6.1';
  cvHash: string;
  jdHash: string;
  ontologyVersion: string;
  rulebookVersion: string;
  scoringVersion: string;
  llmSnapshotId?: string;
  needsHumanReview: boolean;
}

export interface RulebookV61ScoreBreakdown {
  s_fit: number;           // 50% Độ sâu kỹ năng (0.8*R_fit + 0.2*P_fit)
  r_fit: number;           // Required fit
  p_fit: number;           // Preferred fit
  coverage: number;        // 25% Độ rộng (PassedGroups / TotalGroups * 100)
  yoe_fit: number;         // 20% Độ chín YOE (Interval Union)
  core_alignment: number;  // 5% Core Alignment (Top 3 candidate skills match Required)
  raw_score: number;       // 0.50*S_fit + 0.25*Coverage + 0.20*YOE_fit + 0.05*CoreAlignment
  final_score: number;     // Sau khi qua Hard Gates & Rounding 0.1
  gates_triggered: string[];
}

export type CandidateLevel = 'intern' | 'fresher' | 'junior' | 'mid' | 'senior' | 'lead';

export interface GateCheckResult {
  passed: boolean;
  status: 'Pass' | 'Reject';
  failedReasons: string[];
  mustHaveSkillsPassed: boolean;
  certificationsPassed: boolean;
  languagePassed: boolean;
  minExperiencePassed: boolean;
  workAuthorizationPassed: boolean;
  details: {
    missingMustHaveSkills: string[];
    missingCertifications: string[];
    missingLanguages: string[];
    experienceGapYears?: number;
  };
}

export interface FrameworkVariables {
  css: number; // Critical Skill Score (0-100)
  css_status: 'Reject' | 'Critical Gap' | 'Partial Match' | 'Strong Match' | 'Excellent Match';
  skill_modifier: number; // 0, 0.30, 0.60, 0.85, 1.00
  raw_score: number; // Raw Score before Modifier
  sms: number; // Skill Match Score (0-100)
  ers: number; // Experience Relevance Score (0-100)
  ers_breakdown: {
    industry_match: number;
    role_match: number;
    domain_match: number;
  };
  is: number;  // Impact Score (0-100)
  cs: number;  // Credibility Score (0-100)
  cs_level: 1 | 2 | 3 | 4 | 5;
  gps: number; // Growth Potential Score (0-100)
  cms: number; // Complexity Score (0-100)
  ls?: number; // Leadership Score (0-100)
  detected_level: CandidateLevel;
  applied_formula: string;
}

export interface AiMatchResult {
  overall_score: number; // FinalScore = Raw Score * Modifier (0..100)
  match_rating: 'STANDOUT_MATCH' | 'STRONG_FIT' | 'POTENTIAL_FIT' | 'NEEDS_DEVELOPMENT';
  rulebook_level?: 'Excellent Match' | 'Strong Match' | 'Qualified Match' | 'Potential Match' | 'Weak Match' | 'Poor Match' | 'Reject';
  framework_version?: 'v2.0';
  rulebook_breakdown?: RulebookBreakdown;
  rulebook_gap_analysis?: RulebookGapAnalysis;
  v61_breakdown?: RulebookV61ScoreBreakdown;
  framework_variables?: FrameworkVariables;
  gate_check?: GateCheckResult;
  audit_metadata?: AuditMetadataV61;
  trust_index: {
    verified_project_count: number;
    total_project_count: number;
    verification_ratio: number; // 0..1
    trust_tier: 'VERIFIED_ELITE' | 'HIGH_TRUST' | 'MODERATE' | 'UNVERIFIED';
    multiplier: number;
  };
  pillars: {
    skill_fit: AiSkillFitPillar;
    evidence_depth: AiEvidenceDepthPillar;
    impact_complexity: AiImpactComplexityPillar;
    alignment_level: AiAlignmentPillar;
  };
  gap_analysis: AiGapItem[];
  cv_coaching_tips: string[];
  executive_summary: string;
}

// Backward-compatible type aliases
export type JevEvidenceLevel = AiEvidenceLevel;
export type JevProjectInput = AiProjectInput;
export type JevCertificateInput = AiCertificateInput;
export type JevExperienceInput = AiExperienceInput;
export type JevCandidateProfile = AiCandidateProfile;
export type JevJobDescriptionInput = AiJobDescriptionInput;
export type JevSkillFitPillar = AiSkillFitPillar;
export type JevProjectEvidenceDetail = AiProjectEvidenceDetail;
export type JevEvidenceDepthPillar = AiEvidenceDepthPillar;
export type JevImpactComplexityPillar = AiImpactComplexityPillar;
export type JevAlignmentPillar = AiAlignmentPillar;
export type JevRemediationRoadmap = AiRemediationRoadmap;
export type JevGapItem = AiGapItem;
export type JevMatchResult = AiMatchResult;
