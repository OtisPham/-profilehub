export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  RECRUITER: 'recruiter',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const PIPELINE_STAGES = {
  DISCOVERED: 'discovered',
  SHORTLISTED: 'shortlisted',
  CONTACTED: 'contacted',
  INTERVIEW: 'interview',
  HIRED: 'hired',
} as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[keyof typeof PIPELINE_STAGES];

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export type VerificationStatus = (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

export const PROJECT_TYPES = {
  COURSE_PROJECT: 'Course Project',
  CAPSTONE: 'Capstone',
  RESEARCH: 'Research',
  SIDE_PROJECT: 'Side Project',
} as const;

export const THEME_ROLE_COLORS = {
  STUDENT: {
    primary: '#1e3a8a',
    accent: '#3b82f6',
    soft: '#eff6ff',
    border: '#f59e0b',
    label: '👨‍🎓 SINH VIÊN',
  },
  TEACHER: {
    primary: '#047857',
    accent: '#10b981',
    soft: '#ecfdf5',
    border: '#34d399',
    label: '👨‍🏫 GIẢNG VIÊN',
  },
  RECRUITER: {
    primary: '#6d28d9',
    accent: '#8b5cf6',
    soft: '#f5f3ff',
    border: '#c084fc',
    label: '🏢 NHÀ TUYỂN DỤNG',
  },
} as const;
