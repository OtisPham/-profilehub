export type UserRole = 'student' | 'recruiter';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  created_at?: string;
}

export interface StudentProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  major?: string;
  university?: string;
  gpa?: string;
  skills?: string[];
  username?: string;
  qr_code_url?: string;
  github_url?: string;
  is_open_to_work?: boolean;
  blocked_companies?: string[];
  updated_at?: string;
}

export interface Project {
  id: string;
  student_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  demo_url?: string;
  github_url?: string;
  figma_url?: string;
  doc_url?: string;
  project_type?: string;
  score?: string;
  is_verified?: boolean;
  role?: string;
  team_size?: string;
  instructor?: string;
  tags?: string[];
  image_url?: string;
  verification_status?: VerificationStatus;
  verified_by?: string;
  teacher_feedback?: string;
  verified_at?: string;
  verification_code?: string;
  verification_hash?: string;
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  created_at?: string;
}

export interface ProjectSkill {
  project_id: string;
  skill_id: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  title: string;
  issuer: string;
  category?: string;
  date_awarded?: string;
  rank?: string;
  description?: string;
  is_featured?: boolean;
  image_url?: string;
  created_at?: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  category: string;
  level?: string;
  date_awarded?: string;
  description?: string;
  is_featured?: boolean;
  verified?: boolean;
  image_url?: string;
  created_at?: string;
}

export interface GeneratedCV {
  id: string;
  student_id: string;
  target_job_title: string;
  target_jd_text: string;
  match_score: number;
  summary_text?: string;
  selected_projects?: string[];
  selected_certificates?: string[];
  selected_skills?: string[];
  created_at?: string;
}

export interface RecruiterProfile {
  id: string;
  recruiter_name?: string;
  company_name?: string;
  industry?: string;
  company_size?: string;
  company_address?: string;
  website?: string;
  phone?: string;
  company_bio?: string;
  tax_code?: string;
  is_tax_verified?: boolean;
  tax_legal_name?: string;
  tax_registered_address?: string;
  tax_verification_status?: 'unverified' | 'pending' | 'verified' | 'rejected' | 'reverification_required';
  tax_verification_tier?: 'full' | 'silver' | 'unverified';
  tax_verified_at?: string;
  work_email?: string;
  is_work_email_verified?: boolean;
  updated_at?: string;
}

export type PipelineStage = 'discovered' | 'shortlisted' | 'contacted' | 'interview' | 'hired';

export type ExperienceLevel = 'intern' | 'fresher' | 'junior' | 'middle' | 'senior';
export type WorkplaceType = 'on-site' | 'hybrid' | 'remote';
export type SalaryCurrency = 'VND' | 'USD';

export interface JobPost {
  id: string;
  recruiter_id: string;
  company_name?: string;
  title: string;
  department?: string;
  location?: string;
  workplace_type?: WorkplaceType;
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  currency?: SalaryCurrency;
  is_negotiable?: boolean;
  deadline_date?: string;
  required_skills?: string[];
  description?: string;
  status?: 'active' | 'closed';
  is_tax_verified?: boolean;
  tax_verification_tier?: 'full' | 'silver' | 'unverified';
  tax_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SavedCandidate {
  id: string;
  recruiter_id: string;
  student_id: string;
  folder_name: string;
  created_at?: string;
  student?: StudentProfile;
}

export interface CandidatePipelineItem {
  id: string;
  recruiter_id: string;
  student_id: string;
  job_id?: string;
  stage: PipelineStage;
  private_notes?: string;
  interview_date?: string;
  interview_time?: string;
  meeting_link?: string;
  interview_location?: string;
  interview_status?: 'pending_student' | 'confirmed' | 'completed' | 'cancelled' | 'scheduled' | 'reschedule_requested';
  suggested_interview_date?: string;
  suggested_interview_time?: string;
  student_reschedule_reason?: string;
  created_at?: string;
  updated_at?: string;
  student?: StudentProfile;
  job?: JobPost;
  take_home_challenge?: TakeHomeChallenge;
  scorecards?: InterviewScorecard[];
  interview_slots?: InterviewSlot[];
  selected_slot_id?: string;
  pre_interview_cheatsheet?: PreInterviewCheatSheet;
  ai_tldr?: CandidateAiTLDR;
  blind_anonymous_id?: string;
}

export interface InterviewFeedback {
  id: string;
  recruiter_id: string;
  recruiter_name?: string;
  company_name?: string;
  student_id: string;
  job_id?: string;
  technical_score: number;
  soft_skills_score: number;
  recruiter_comment: string;
  blind_spots: string[];
  created_at?: string;
}

export interface InboundInterviewInvite {
  id: string;
  verification_code: string;
  student_id: string;
  student_name: string;
  recruiter_id?: string;
  company_name: string;
  recruiter_email: string;
  role_title: string;
  proposed_date: string;
  proposed_time: string;
  meeting_link?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

// ========================================================
// Chẩn Đoán Skill-Gap & Trợ Lý Nâng Cấp Đồ Án (SPEC-20261109-SKILL-GAP-UPGRADER)
// ========================================================
export type SkillCriticality = 'critical' | 'recommended' | 'optional';
export type SkillCategory = 'backend' | 'frontend' | 'database' | 'devops' | 'testing' | 'other';
export type RecipeStatus = 'not_started' | 'in_progress' | 'completed';
export type HealthTier = 'A+ Production-Ready' | 'B Solid Junior' | 'C Needs Refactor';

export interface MatchedSkillItem {
  name: string;
  source: 'cv' | 'project';
  projectTitle?: string;
}

export interface MissingSkillItem {
  name: string;
  criticality: SkillCriticality;
  category: SkillCategory;
  reason: string;
}

export interface ProjectUpgradeRecipe {
  id: string;
  targetSkill: string;
  title: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  stepByStepGuide: string[];
  codeSnippet: string;
  acceptanceCriteria: string[];
  status: RecipeStatus;
  completedAt?: string;
}

export interface SkillGapReport {
  id: string;
  studentId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  readinessScore: number; // 0 - 100
  matchedSkills: MatchedSkillItem[];
  missingSkills: MissingSkillItem[];
  upgradeRecipes: ProjectUpgradeRecipe[];
  generatedAt: string;
}

export interface CodeHealthCheckSummary {
  hasReadme: boolean;
  hasGitignore: boolean;
  hasTests: boolean;
  noLeakedEnv: boolean;
  hasCiCd: boolean;
  commitCadence: 'high' | 'moderate' | 'low';
}

export interface CodeHealthReport {
  id: string;
  projectId: string;
  projectTitle: string;
  githubUrl: string;
  overallScore: number; // 0 - 100
  tier: HealthTier;
  checks: CodeHealthCheckSummary;
  badgesEarned: string[];
  recommendations: string[];
  analyzedAt: string;
}

// ========================================================
// Thử Thách Kỹ Thuật & Bảng Chấm Điểm Phỏng Vấn (SPEC-20261109-CHALLENGE-SCORECARD)
// ========================================================
export type ChallengeStatus = 'issued' | 'submitted' | 'evaluated' | 'expired';

export interface ChallengeSubmission {
  pullRequestUrl: string;
  demoUrl?: string;
  solutionNotes: string;
  submittedAt: string;
}

export interface ChallengeEvaluation {
  score: number; // 0 - 100
  feedback: string;
  evaluatedBy: string;
  evaluatedAt: string;
}

export interface TakeHomeChallenge {
  id: string;
  candidatePipelineId: string;
  recruiterId: string;
  studentId: string;
  jobId: string;
  title: string;
  description: string;
  requirements: string[];
  deadlineHours: number; // 48, 72, 120
  deadlineDate: string; // ISO string
  status: ChallengeStatus;
  submission?: ChallengeSubmission;
  evaluation?: ChallengeEvaluation;
  createdAt: string;
}

export type ScorecardRecommendation = 'strong_hire' | 'hire' | 'neutral' | 'no_hire';

export interface ScorecardCriteriaScores {
  architecture: number; // 1 - 5 sao
  codeDefense: number;  // 1 - 5 sao
  debugging: number;    // 1 - 5 sao
  communication: number;// 1 - 5 sao
  cultureFit: number;   // 1 - 5 sao
}

export interface InterviewScorecard {
  id: string;
  candidatePipelineId: string;
  interviewerId: string;
  interviewerName: string;
  interviewerRole: string; // 'Tech Lead' | 'HR Specialist' | 'Engineering Manager'
  scores: ScorecardCriteriaScores;
  overallScore: number; // 0 - 100
  recommendation: ScorecardRecommendation;
  strengths: string;
  improvementAreas: string;
  submittedAt: string;
}

// ========================================================
// Hồ Sơ Đánh Giá Phỏng Vấn Chuyên Sâu & Xuất Báo Cáo PDF (SPEC-20261109-EXECUTIVE-DOSSIER-PDF)
// ========================================================
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

// ==========================================
// 8. PUBLIC OFFER PORTAL & ENTERPRISE OFFER LETTER STUDIO
// SPEC-20261109-PUBLIC-OFFER-PORTAL
// ==========================================

export type OfferStatus = 
  | 'draft'        // Đang soạn thảo
  | 'pending'      // Đã phát hành, chờ ứng viên phản hồi
  | 'accepted'     // Ứng viên đã ký chấp thuận nhận việc
  | 'negotiating'  // Ứng viên gửi đề xuất điều chỉnh ngày/lương
  | 'declined'     // Ứng viên từ chối
  | 'expired';     // Thư mời đã quá thời hạn phản hồi

export interface OfferBenefitItem {
  id: string;
  category: 'hardware' | 'health' | 'culture' | 'finance' | 'learning';
  icon: string;        // Emoji/Icon: '💻', '🏥', '🏖️', '📈', '🎓'
  title: string;       // Tiêu đề phúc lợi (VD: "Cấp MacBook Pro M3")
  description: string; // Chi tiết phúc lợi
}

export interface OfferLetter {
  id: string;
  token: string;
  candidate_id: string;
  candidate_name: string;
  candidate_email?: string;
  recruiter_id: string;
  company_name: string;
  company_logo?: string;
  is_company_verified: boolean;
  job_title: string;
  department: string;
  level: string;
  workplace_type: string;
  location: string;
  salary_official: number;
  salary_probation: number;
  probation_period_months: number;
  sign_on_bonus?: number;
  currency: 'VND' | 'USD';
  start_date: string;
  deadline_date: string;
  benefits: OfferBenefitItem[];
  custom_message?: string;
  status: OfferStatus;
  digital_signature?: string;
  signed_at?: string;
  negotiation_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOfferParams {
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  recruiterId: string;
  companyName: string;
  companyLogo?: string;
  isCompanyVerified: boolean;
  jobTitle: string;
  department: string;
  level: string;
  workplaceType: string;
  location: string;
  salaryOfficial: number;
  salaryProbation: number;
  probationPeriodMonths?: number;
  signOnBonus?: number;
  currency?: 'VND' | 'USD';
  startDate: string;
  deadlineDate: string;
  benefits: OfferBenefitItem[];
  customMessage?: string;
}

// ==========================================
// 9. SOCIAL CAREER COMMUNITY FEED
// SPEC-20261109-SOCIAL-CAREER-FEED
// ==========================================

export type PostType = 
  | 'job_hiring'          // Bài đăng tuyển dụng của Doanh nghiệp
  | 'project_showcase'     // Bài khoe đồ án có bảo chứng của Ứng viên
  | 'offer_celebration'    // Bài chúc mừng nhận việc thành công
  | 'tech_discussion';     // Bài chia sẻ tips, kinh nghiệm phỏng vấn, hỏi đáp IT

export type FeedFilter = 'all' | 'job_hiring' | 'project_showcase' | 'tech_discussion' | 'saved';

export interface PostComment {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  author_role: string;
  content: string;
  created_at: string;
}

export interface SocialPost {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  author_role: 'student' | 'recruiter' | 'instructor';
  author_headline?: string;
  is_author_verified: boolean;
  post_type: PostType;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  is_saved?: boolean;
  comments: PostComment[];

  // Ngữ cảnh đặc thù tuyển dụng
  job_salary_range?: string;
  job_location?: string;
  job_id?: string;
  company_name?: string;

  // Ngữ cảnh đặc thù đồ án bảo chứng
  project_demo_url?: string;
  project_github_url?: string;
  project_score?: string;
  project_id?: string;

  // Ngữ cảnh vinh danh nhận việc
  offer_company_name?: string;
  offer_position?: string;
}

export interface CreatePostParams {
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: 'student' | 'recruiter' | 'instructor';
  authorHeadline?: string;
  isAuthorVerified?: boolean;
  postType: PostType;
  title: string;
  content: string;
  tags?: string[];
  jobSalaryRange?: string;
  jobLocation?: string;
  jobId?: string;
  companyName?: string;
  projectDemoUrl?: string;
  projectGithubUrl?: string;
  projectScore?: string;
  offerCompanyName?: string;
  offerPosition?: string;
}

// ==========================================
// Phân Hệ Siêu Tốc Độ Tuyển Dụng & Tiện Ích Hai Chiều (Velocity Suite)
// ==========================================

export interface InterviewSlot {
  id: string;
  candidatePipelineId: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  status: 'available' | 'booked';
  meetUrl?: string;
  bookedAt?: string;
}

export interface PreInterviewCheatSheet {
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  elevatorPitch: string;
  killerMetrics: Array<{
    label: string;
    value: string;
    source: 'lighthouse' | 'rps' | 'coverage' | 'db_index' | 'custom';
  }>;
  starStory: {
    situationTask: string;
    actionTaken: string;
    quantifiedResult: string;
  };
  questionsToAsk: string[];
  cachedAt: string;
}

export interface CandidateAiTLDR {
  candidateId: string;
  technicalCore: string;
  keyProofProject: string;
  screeningAttention: string;
  matchScore: number;
}

export interface BatchEmailTemplate {
  id: string;
  title: string;
  subject: string;
  body: string;
  category: 'interview_invite' | 'challenge_issue' | 'offer_letter' | 'rejection_courtesy';
}

export interface ReadReceiptEvent {
  id: string;
  studentId: string;
  candidatePipelineId?: string;
  targetType: 'cv' | 'live_demo' | 'github_repo' | 'verify_page';
  durationSeconds: number;
  timestamp: string;
  anonymousLabel: string;
}

// OAuth Resilience & Auto-Provisioning Models (FR-033)
export interface OAuthRawMetadata {
  full_name?: string;
  name?: string;
  avatar_url?: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
  provider_id?: string;
  [key: string]: any;
}

export interface OAuthDiagnosticInfo {
  isError: boolean;
  errorCode?: string;
  errorDescription?: string;
  solutionHint?: string;
  canFallbackToDemo: boolean;
}

export interface ProvisioningResult {
  success: boolean;
  isNewUser: boolean;
  role: UserRole;
  destinationUrl: string;
  error?: string;
}





