export type AiEvidenceLevel = 
  | 'unverified_claim'      // Level 0: 0.30 - Chỉ tự khai
  | 'self_documented'       // Level 1: 0.60 - Có mô tả nhưng không có link
  | 'live_artifact'         // Level 2: 0.85 - Có link GitHub / Demo sống
  | 'institutional_verified'; // Level 3: 1.00 - Có huy hiệu Verified

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
}

export interface AiCertificateInput {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  credential_url?: string;
  is_verified?: boolean;
}

export interface AiCandidateProfile {
  target_role?: string;
  career_summary?: string;
  skills: string[];
  projects: AiProjectInput[];
  certificates?: AiCertificateInput[];
  experience_level?: 'intern' | 'fresher' | 'junior' | 'mid';
}

export interface AiJobDescriptionInput {
  title?: string;
  level?: 'intern' | 'fresher' | 'junior' | 'mid' | 'senior' | 'lead';
  raw_jd_text: string;
  required_skills?: string[];
  preferred_skills?: string[];
  critical_skills?: string[];
  min_years_experience?: number;
}

export interface AiSkillFitPillar {
  score: number;
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
  score: number;
  top_contributing_projects: AiProjectEvidenceDetail[];
  total_evidence_mass: number;
  relevant_project_count?: number;
  verified_relevant_count?: number;
  total_candidate_projects?: number;
}

export interface AiImpactComplexityPillar {
  score: number;
  detected_metrics_count: number;
  metric_examples: string[];
  feedback: string;
}

export interface AiAlignmentPillar {
  score: number;
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
  skills: number;       // 35%
  experience: number;   // 20%
  requirements: number; // 20%
  projects: number;     // 10%
  keywords: number;     // 10%
  education: number;    // 5%
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
  overall_score: number;
  match_rating: 'STANDOUT_MATCH' | 'STRONG_FIT' | 'POTENTIAL_FIT' | 'NEEDS_DEVELOPMENT';
  rulebook_level?: 'Excellent Match' | 'Strong Match' | 'Qualified Match' | 'Potential Match' | 'Weak Match' | 'Poor Match' | 'Reject';
  framework_version?: 'v2.0';
  rulebook_breakdown?: RulebookBreakdown;
  rulebook_gap_analysis?: RulebookGapAnalysis;
  framework_variables?: FrameworkVariables;
  gate_check?: GateCheckResult;
  trust_index: {
    verified_project_count: number;
    total_project_count: number;
    verification_ratio: number;
    trust_tier: 'VERIFIED_ELITE' | 'HIGH_TRUST' | 'MODERATE' | 'UNVERIFIED';
    multiplier: number;
  };
  pillars: {
    skill_fit: AiSkillFitPillar;
    evidence_depth: AiEvidenceDepthPillar;
    impact_complexity: AiImpactComplexityPillar;
    alignment_level: AiAlignmentPillar;
  };
  mbti_compatibility?: {
    mbti_type: string;
    cultural_fit_score: number;
    role_alignment_title: string;
    workplace_synergy: string;
    cultural_strengths: string[];
  };
  gap_analysis: AiGapItem[];
  cv_coaching_tips: string[];
  executive_summary: string;
}

export interface ProjectMatchDetail {
  id: string;
  title: string;
  isVerified: boolean;
  matchedSkills: string[];
  relevanceScore: number;
}

export interface PortfolioMatchResult {
  overallScore: number;
  matchRating: 'Excellent' | 'Good' | 'Moderate' | 'Needs Improvement';
  rulebookLevel?: 'Excellent Match' | 'Strong Match' | 'Qualified Match' | 'Potential Match' | 'Weak Match' | 'Poor Match' | 'Reject' | 'Good Match' | 'Moderate Match' | 'Low Match';
  rulebookBreakdown?: RulebookBreakdown;
  rulebookGapAnalysis?: RulebookGapAnalysis;
  mbtiCompatibility?: {
    mbtiType: string;
    culturalFitScore: number;
    roleAlignmentTitle: string;
    workplaceSynergy: string;
    culturalStrengths: string[];
  };
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  projectMatches: ProjectMatchDetail[];
  recommendedProjectIdea: {
    title: string;
    description: string;
    keyTechStack: string[];
    expectedImpact: string;
  };
  optimizationTips: string[];
  aiResult?: AiMatchResult;
  jevResult?: AiMatchResult; // Alias
}

export interface PresetJobRole {
  id: string;
  title: string;
  category: string;
  defaultJd: string;
  requiredSkills: string[];
}

// Backward compatibility type aliases
export type JevEvidenceLevel = AiEvidenceLevel;
export type JevProjectInput = AiProjectInput;
export type JevCertificateInput = AiCertificateInput;
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
