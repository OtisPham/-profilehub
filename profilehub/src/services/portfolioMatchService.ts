import type {
  PortfolioMatchResult,
  PresetJobRole,
  AiMatchResult,
  AiCandidateProfile,
  AiJobDescriptionInput,
  AiEvidenceLevel,
  AiProjectInput,
  AiProjectEvidenceDetail,
  AiCertificateInput,
  JevMatchResult,
  JevCandidateProfile,
  JevJobDescriptionInput,
  JevEvidenceLevel,
  JevProjectInput,
  JevCertificateInput,
  RulebookBreakdown,
  RulebookCriticalGap,
  RulebookGapAnalysis,
  CandidateLevel,
  GateCheckResult,
  FrameworkVariables,
} from '../types/portfolioMatch';
import { calculateMBTIJobCompatibility, getCandidateMBTI } from './mbtiService';

export const PRESET_JOB_ROLES: PresetJobRole[] = [
  {
    id: 'frontend-react',
    title: 'Frontend ReactJS Developer',
    category: 'Web Development',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'Git', 'Next.js'],
    defaultJd: `Yêu cầu công việc:
- Có ít nhất 1 năm kinh nghiệm hoặc hoàn thành các đồ án thực tế với React, TypeScript.
- Nắm vững State Management (Redux, Zustand hoặc React Context), React Hooks, Component Architecture.
- Sử dụng thành thạo HTML5, CSS3, Tailwind CSS.
- Tối ưu hiệu năng render (React.memo, useMemo, lazy loading) và Web Vitals.
- Có kinh nghiệm tích hợp RESTful APIs, Next.js và làm việc với Git.`
  },
  {
    id: 'backend-nodejs',
    title: 'Backend Node.js Developer',
    category: 'Backend & Cloud',
    requiredSkills: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'REST API'],
    defaultJd: `Yêu cầu công việc:
- Xây dựng và thiết kế RESTful APIs chất lượng cao với Node.js, Express hoặc NestJS.
- Sử dụng thành thạo CSDL quan hệ (PostgreSQL, MySQL) hoặc NoSQL (MongoDB, Redis).
- Hiểu biết về Bảo mật API, Authentication/Authorization (JWT, OAuth2).
- Có kinh nghiệm viết Unit Test, Docker containerization và tối ưu truy vấn Database.`
  },
  {
    id: 'fullstack-ts',
    title: 'Fullstack TypeScript Developer',
    category: 'Fullstack',
    requiredSkills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    defaultJd: `Yêu cầu công việc:
- Phát triển ứng dụng Web end-to-end với Next.js (App Router), React và Node.js.
- Sử dụng TypeScript cho cả Frontend và Backend, đảm bảo strict type safety.
- Tương tác với CSDL PostgreSQL, Prisma hoặc Supabase.
- Tối ưu SEO, Server-Side Rendering (SSR) và containerize ứng dụng với Docker.`
  },
  {
    id: 'mobile-react-native',
    title: 'Mobile App Developer (React Native)',
    category: 'Mobile',
    requiredSkills: ['React Native', 'Expo', 'TypeScript', 'REST API', 'Mobile UI/UX'],
    defaultJd: `Yêu cầu công việc:
- Lập trình ứng dụng di động iOS/Android bằng React Native và Expo.
- Tích hợp Native Modules, Push Notifications, Camera, Map APIs.
- Tối ưu tốc độ khởi động ứng dụng, bộ nhớ RAM và trải nghiệm mượt mà 60fps.`
  }
];

// Helper tính toán AI Matching phía client nếu offline hoặc gọi API
export async function analyzeAiPortfolioMatch(
  candidate: AiCandidateProfile,
  job: AiJobDescriptionInput
): Promise<AiMatchResult> {
  try {
    console.log('🤖 [AI Matching Engine] Đang gửi yêu cầu đánh giá tương thích JD & CV tới API /api/ai/ai-match (Model: Google Gemini 3.5 Flash / OpenRouter AI)...');
    let response = await fetch('/api/ai/ai-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate, job }),
    });

    if (!response.ok) {
      // Fallback endpoint
      response = await fetch('/api/ai/jev-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate, job }),
      });
    }

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        console.log('✅ [AI Matching Engine] Nhận kết quả đánh giá tương thích thành công từ AI Server.');
        return data.data;
      }
    }
  } catch (error) {
    console.warn('API /api/ai/ai-match unavailable, falling back to local AI Matching Engine:', error);
  }

  return computeLocalAiMatch(candidate, job);
}

// Backward compatibility alias
export const analyzeJevPortfolioMatch = analyzeAiPortfolioMatch;

const EVIDENCE_WEIGHT_MAP: Record<JevEvidenceLevel, number> = {
  institutional_verified: 1.0,
  live_artifact: 0.85,
  self_documented: 0.60,
  unverified_claim: 0.30,
};

const TECH_SYNONYMS: Record<string, string[]> = {
  'react': ['reactjs', 'react.js', 'nextjs', 'next.js', 'react native'],
  'vue': ['vuejs', 'vue.js', 'nuxt', 'nuxtjs'],
  'angular': ['angularjs', 'angular 2+'],
  'node.js': ['node', 'nodejs', 'express', 'express.js', 'nestjs', 'node js'],
  'typescript': ['ts'],
  'javascript': ['js', 'es6'],
  'python': ['django', 'fastapi', 'flask'],
  'java': ['spring', 'spring boot', 'hibernate'],
  'c#': ['.net', '.net core', 'asp.net', 'csharp'],
  'sql': ['postgresql', 'postgres', 'mysql', 'sql server', 'sqlite', 'oracle'],
  'nosql': ['mongodb', 'redis', 'firebase', 'firestore', 'dynamodb'],
  'docker': ['container', 'docker-compose', 'k8s', 'kubernetes'],
  'cloud': ['aws', 'gcp', 'azure', 'google cloud', 'amazon web services'],
  'ci/cd': ['github actions', 'gitlab ci', 'jenkins'],
  'tailwind': ['tailwindcss', 'tailwind css'],
  'testing': ['jest', 'unit test', 'cypress', 'mocha', 'vitest'],
};

export function normalizeSkill(s: string): string {
  if (!s) return '';
  const t = s.toLowerCase().trim().replace(/\s+/g, ' ');
  if (t === 'nodejs' || t === 'node.js' || t === 'node js') return 'node.js';
  if (t === 'reactjs' || t === 'react.js') return 'react';
  if (t === 'postgres' || t === 'postgresql') return 'postgresql';
  if (t === 'aws' || t === 'amazon web services') return 'aws';
  return t;
}

export function isAntiCollisionColliding(a: string, b: string): boolean {
  const normA = normalizeSkill(a);
  const normB = normalizeSkill(b);
  if (normA === normB) return false;

  // Java vs JavaScript
  if ((normA === 'java' && normB.includes('javascript')) || (normB === 'java' && normA.includes('javascript'))) {
    return true;
  }
  // C vs C++ vs C#
  const cFamily = ['c', 'c++', 'c#', 'csharp', 'cpp'];
  if (cFamily.includes(normA) && cFamily.includes(normB) && normA !== normB) {
    return true;
  }
  // Python vs Cython
  if ((normA === 'python' && normB === 'cython') || (normB === 'python' && normA === 'cython')) {
    return true;
  }

  return false;
}

function isWordMatch(text: string, keyword: string): boolean {
  if (!text || !keyword) return false;
  const t = text.toLowerCase().trim();
  const k = keyword.toLowerCase().trim();
  if (t === k) return true;
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(^|[^a-z0-9_])${escaped}([^a-z0-9_]|$)`, 'i');
  return regex.test(t);
}

function isSkillEquivalent(skillA: string, skillB: string): boolean {
  const a = normalizeSkill(skillA);
  const b = normalizeSkill(skillB);
  if (a === b) return true;
  if (!a || !b) return false;

  if (isAntiCollisionColliding(a, b)) return false;

  if (a.length >= 3 && b.length >= 3) {
    if (isWordMatch(a, b) || isWordMatch(b, a)) {
      return true;
    }
  }

  for (const [canonical, aliases] of Object.entries(TECH_SYNONYMS)) {
    const all = [canonical, ...aliases].map(normalizeSkill);
    const matchA = all.some((item) => a === item || isWordMatch(a, item));
    const matchB = all.some((item) => b === item || isWordMatch(b, item));
    if (matchA && matchB) return true;
  }
  return false;
}

export type IndustryDomainType =
  | 'web_frontend'
  | 'web_backend'
  | 'fullstack'
  | 'mobile_dev'
  | 'data_ai'
  | 'devops_cloud'
  | 'qa_testing'
  | 'ui_ux_design'
  | 'marketing_sales'
  | 'accounting_finance'
  | 'human_resources'
  | 'general_it';

const DOMAIN_KEYWORDS: Record<IndustryDomainType, { names: string[]; coreKeywords: string[] }> = {
  web_frontend: {
    names: ['frontend', 'front-end', 'react', 'vue', 'angular', 'web client'],
    coreKeywords: ['react', 'next.js', 'vue', 'angular', 'svelte', 'typescript', 'javascript', 'html', 'css', 'tailwind']
  },
  web_backend: {
    names: ['backend', 'back-end', 'nodejs', 'java', 'python', '.net', 'golang', 'api'],
    coreKeywords: ['node.js', 'express', 'nestjs', 'spring', 'spring boot', 'django', 'fastapi', 'c#', '.net', 'golang', 'sql', 'postgresql', 'mongodb', 'redis', 'microservices']
  },
  fullstack: {
    names: ['fullstack', 'full-stack', 'web developer'],
    coreKeywords: ['react', 'next.js', 'node.js', 'typescript', 'postgresql', 'docker', 'rest api', 'tailwind']
  },
  mobile_dev: {
    names: ['mobile', 'ios', 'android', 'flutter', 'react native', 'swift', 'kotlin'],
    coreKeywords: ['flutter', 'react native', 'swift', 'kotlin', 'ios', 'android', 'dart', 'expo']
  },
  data_ai: {
    names: ['data engineer', 'data scientist', 'ai engineer', 'machine learning', 'trí tuệ nhân tạo', 'dữ liệu'],
    coreKeywords: ['python', 'pytorch', 'tensorflow', 'pandas', 'spark', 'sql', 'llm', 'nlp', 'scikit-learn']
  },
  devops_cloud: {
    names: ['devops', 'cloud engineer', 'sre', 'hạ tầng', 'sysadmin'],
    coreKeywords: ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ci/cd', 'linux', 'jenkins']
  },
  qa_testing: {
    names: ['qa', 'qc', 'tester', 'kiểm thử', 'automation test'],
    coreKeywords: ['testing', 'selenium', 'cypress', 'jest', 'playwright', 'postman', 'jmeter', 'manual test']
  },
  ui_ux_design: {
    names: ['ui/ux', 'ui designer', 'ux designer', 'product designer', 'thiết kế giao diện'],
    coreKeywords: ['figma', 'ui/ux', 'wireframe', 'prototype', 'design system', 'adobe xd', 'user research']
  },
  marketing_sales: {
    names: ['marketing', 'digital marketing', 'content', 'seo', 'sales', 'kinh doanh', 'bán hàng', 'truyền thông', 'copywriter'],
    coreKeywords: ['marketing', 'seo', 'sem', 'content', 'social media', 'google ads', 'facebook ads', 'sales', 'kpi', 'crm']
  },
  accounting_finance: {
    names: ['kế toán', 'tài chính', 'kiểm toán', 'thuế', 'accountant', 'auditor'],
    coreKeywords: ['kế toán', 'báo cáo tài chính', 'thuế', 'misa', 'excel', 'hóa đơn', 'công nợ', 'kiểm toán']
  },
  human_resources: {
    names: ['nhân sự', 'tuyển dụng', 'hr', 'headhunter', 'talent acquisition', 'c&b'],
    coreKeywords: ['nhân sự', 'tuyển dụng', 'headhunter', 'phỏng vấn', 'onboarding', 'c&b', 'tiền lương']
  },
  general_it: {
    names: ['it helpdesk', 'it support', 'kỹ thuật viên', 'quản trị mạng'],
    coreKeywords: ['network', 'cisco', 'lan', 'wan', 'hardware', 'windows server', 'troubleshooting']
  }
};

function detectDomain(text: string, titleHint?: string): IndustryDomainType {
  const combined = (text + ' ' + (titleHint || '')).toLowerCase();
  let bestDomain: IndustryDomainType = 'general_it';
  let maxScore = -1;

  for (const [domain, config] of Object.entries(DOMAIN_KEYWORDS)) {
    let score = 0;
    if (titleHint) {
      const lowerTitle = titleHint.toLowerCase();
      config.names.forEach(n => {
        if (isWordMatch(lowerTitle, n)) score += 10;
      });
    }
    config.names.forEach(n => {
      if (isWordMatch(combined, n)) score += 3;
    });
    config.coreKeywords.forEach(k => {
      if (isWordMatch(combined, k)) score += 1;
    });

    if (score > maxScore) {
      maxScore = score;
      bestDomain = domain as IndustryDomainType;
    }
  }

  return maxScore > 0 ? bestDomain : 'fullstack';
}

function getDomainCompatibility(candidateDomain: IndustryDomainType, jdDomain: IndustryDomainType): number {
  if (candidateDomain === jdDomain) return 1.0;
  if (candidateDomain === 'fullstack' && (jdDomain === 'web_frontend' || jdDomain === 'web_backend')) return 0.90;
  if ((candidateDomain === 'web_frontend' || candidateDomain === 'web_backend') && jdDomain === 'fullstack') return 0.85;
  if (candidateDomain === 'web_frontend' && jdDomain === 'ui_ux_design') return 0.35;
  if (candidateDomain === 'ui_ux_design' && jdDomain === 'web_frontend') return 0.30;
  if (candidateDomain === 'web_backend' && jdDomain === 'devops_cloud') return 0.45;
  if (candidateDomain === 'web_backend' && jdDomain === 'data_ai') return 0.40;

  const techDomains: IndustryDomainType[] = ['web_frontend', 'web_backend', 'fullstack', 'mobile_dev', 'data_ai', 'devops_cloud', 'qa_testing', 'general_it'];
  const isCandidateTech = techDomains.includes(candidateDomain);
  const isJdTech = techDomains.includes(jdDomain);

  if (isCandidateTech !== isJdTech) {
    return 0.0; // 0% tuyệt đối: Lệch hoàn toàn ngành nghề (Tech vs Non-tech)
  }
  return 0.15;
}

function extractYears(text: string): number {
  if (!text) return 0;
  const match = text.toLowerCase().match(/(\d+(?:\.\d+)?)\s*(?:năm|\+?\s*years?)/i);
  return match ? parseFloat(match[1]) : 0;
}

function computeLocalAiMatch(candidate: AiCandidateProfile, job: AiJobDescriptionInput): AiMatchResult {
  console.log('🤖 [AI Matching Engine] Đang đánh giá tương thích giữa JD và CV bằng thuật toán AI: CV-JD Matching Framework v1.0');
  const normJd = job.raw_jd_text.toLowerCase();
  const candidateFullText = `${candidate.target_role || ''} ${candidate.career_summary || ''} ${(candidate.skills || []).join(' ')} ${(candidate.projects || []).map(p => `${p.title} ${p.description || ''}`).join(' ')} ${(candidate.certificates || []).map(c => `${c.title} ${c.issuer}`).join(' ')}`.toLowerCase();
  const candidateDomain = detectDomain(candidateFullText, candidate.target_role);
  const jdDomain = detectDomain(job.raw_jd_text, job.title);
  const domainCompatibility = getDomainCompatibility(candidateDomain, jdDomain);

  const techList = [
    'react', 'next.js', 'vue', 'angular', 'svelte', 'typescript', 'javascript',
    'node.js', 'express', 'nestjs', 'python', 'django', 'fastapi', 'flask',
    'java', 'spring', 'spring boot', 'c#', '.net', 'c++', 'golang', 'go', 'rust',
    'sql', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'supabase', 'firebase',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'git', 'ci/cd', 'rest api', 'graphql',
    'tailwind', 'css', 'html', 'figma', 'ui/ux', 'agile', 'scrum', 'testing', 'jest',
    'microservices', 'kafka', 'rabbitmq', 'prisma', 'linux', 'flutter', 'react native', 'swift', 'kotlin',
    'marketing', 'digital marketing', 'seo', 'sem', 'content', 'social media', 'google ads', 'sales',
    'kế toán', 'báo cáo tài chính', 'thuế', 'misa', 'excel', 'nhân sự', 'tuyển dụng'
  ];

  const jdKeywords = techList.filter((k) => isWordMatch(normJd, k));
  const reqSkills = job.required_skills && job.required_skills.length > 0
    ? job.required_skills
    : jdKeywords.slice(0, Math.ceil(jdKeywords.length * 0.6));
  const prefSkills = job.preferred_skills && job.preferred_skills.length > 0
    ? job.preferred_skills
    : jdKeywords.slice(Math.ceil(jdKeywords.length * 0.6));

  const candidateDirect = (candidate.skills || []).map(normalizeSkill);
  const candidateProjectSkills = (candidate.projects || []).flatMap((p) => [
    ...(p.technologies || []).map(normalizeSkill),
    ...(p.tags || []).map(normalizeSkill),
  ]);
  const allCandidateSkills = Array.from(new Set([...candidateDirect, ...candidateProjectSkills]));

  const matchedCore: string[] = [];
  const missingCore: string[] = [];
  reqSkills.forEach((skill) => {
    if (allCandidateSkills.some((s) => isSkillEquivalent(s, skill))) {
      matchedCore.push(skill);
    } else {
      missingCore.push(skill);
    }
  });

  const matchedSecondary: string[] = [];
  const missingSecondary: string[] = [];
  prefSkills.forEach((skill) => {
    if (allCandidateSkills.some((s) => isSkillEquivalent(s, skill))) {
      matchedSecondary.push(skill);
    } else {
      missingSecondary.push(skill);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: GATE CHECK
  // ─────────────────────────────────────────────────────────────────────────────
  const failedReasons: string[] = [];
  const missingMustHaveSkills: string[] = [];
  const missingCertifications: string[] = [];
  const missingLanguages: string[] = [];
  let experienceGapYears: number | undefined = undefined;

  let mustHaveSkillsPassed = true;
  if (domainCompatibility === 0.0) {
    mustHaveSkillsPassed = false;
    failedReasons.push(`Khác biệt hoàn toàn về lĩnh vực chuyên môn giữa [${candidateDomain}] và [${jdDomain}]`);
  }

  // Check required certifications
  let certificationsPassed = true;
  const certKeywords = ['aws certified', 'pmp', 'acca', 'cpa', 'cissp', 'cfa'];
  for (const cert of certKeywords) {
    if (normJd.includes(cert) && (normJd.includes('bắt buộc') || normJd.includes('yêu cầu chứng chỉ'))) {
      if (!candidateFullText.includes(cert)) {
        certificationsPassed = false;
        missingCertifications.push(cert.toUpperCase());
        failedReasons.push(`Thiếu chứng chỉ bắt buộc: ${cert.toUpperCase()}`);
      }
    }
  }

  // Check required languages
  let languagePassed = true;
  const langKeywords = [
    { pattern: 'tiếng nhật n2', label: 'Japanese N2' },
    { pattern: 'tiếng nhật n1', label: 'Japanese N1' },
    { pattern: 'ielts 7.', label: 'IELTS 7.0+' },
    { pattern: 'ielts 6.5', label: 'IELTS 6.5+' },
    { pattern: 'english b2', label: 'English B2' },
  ];
  for (const lang of langKeywords) {
    if (normJd.includes(lang.pattern) && (normJd.includes('bắt buộc') || normJd.includes('yêu cầu'))) {
      if (!candidateFullText.includes(lang.pattern)) {
        languagePassed = false;
        missingLanguages.push(lang.label);
        failedReasons.push(`Không đạt yêu cầu ngoại ngữ bắt buộc: ${lang.label}`);
      }
    }
  }

  // Minimum Experience Check
  const jdYears = extractYears(job.raw_jd_text);
  let candidateYears = extractYears(candidateFullText);
  if (candidateYears === 0) {
    if (candidate.experience_level === 'mid') candidateYears = 3;
    else if (candidate.experience_level === 'junior') candidateYears = 1.5;
    else if (candidate.experience_level === 'fresher') candidateYears = 1;
    else candidateYears = 0.5;
  }
  let minExperiencePassed = true;
  if (jdYears > 0 && candidateYears < jdYears && (jdYears - candidateYears >= 2)) {
    minExperiencePassed = false;
    experienceGapYears = jdYears - candidateYears;
    failedReasons.push(`Kinh nghiệm tối thiểu không đạt: Yêu cầu ${jdYears} năm, ứng viên có ~${candidateYears} năm`);
  }

  const gatePassed = mustHaveSkillsPassed && certificationsPassed && languagePassed && minExperiencePassed;
  const gateCheck: GateCheckResult = {
    passed: gatePassed,
    status: gatePassed ? 'Pass' : 'Reject',
    failedReasons,
    mustHaveSkillsPassed,
    certificationsPassed,
    languagePassed,
    minExperiencePassed,
    workAuthorizationPassed: true,
    details: {
      missingMustHaveSkills,
      missingCertifications,
      missingLanguages,
      experienceGapYears,
    },
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: DETECT LEVEL
  // ─────────────────────────────────────────────────────────────────────────────
  let detectedLevel: CandidateLevel = 'fresher';
  const isLead = ['team lead', 'tech lead', 'engineering manager', 'quản lý', 'trưởng nhóm', 'project manager', 'scrum master', 'lead developer'].some(k => candidateFullText.includes(k));
  if (isLead && candidateYears >= 4) {
    detectedLevel = 'lead';
  } else if (candidate.experience_level) {
    detectedLevel = candidate.experience_level;
  } else if (candidateYears >= 6) {
    detectedLevel = 'senior';
  } else if (candidateYears >= 3) {
    detectedLevel = 'mid';
  } else if (candidateYears >= 1) {
    detectedLevel = 'junior';
  } else if (candidateYears > 0) {
    detectedLevel = 'fresher';
  } else {
    detectedLevel = 'intern';
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: CRITICAL SKILL SCORE (CSS)
  // CSS = (Số Critical Skills Khớp ÷ Tổng Critical Skills) × 100
  // ─────────────────────────────────────────────────────────────────────────────
  const criticalSkills = job.critical_skills && job.critical_skills.length > 0
    ? job.critical_skills
    : reqSkills.slice(0, 5);

  let matchedCriticalCount = 0;
  if (criticalSkills.length > 0) {
    criticalSkills.forEach((cs) => {
      if (allCandidateSkills.some((s) => isSkillEquivalent(s, cs))) {
        matchedCriticalCount++;
      }
    });
  } else {
    matchedCriticalCount = matchedCore.length;
  }

  const totalCritical = criticalSkills.length > 0 ? criticalSkills.length : Math.max(1, reqSkills.length);
  const css = Math.min(100, Math.round((matchedCriticalCount / totalCritical) * 100));

  let cssStatus: 'Reject' | 'Critical Gap' | 'Partial Match' | 'Strong Match' | 'Excellent Match' = 'Reject';
  let skillModifier = 0.0;

  if (css < 20) {
    cssStatus = 'Reject';
    skillModifier = 0.0;
  } else if (css < 40) {
    cssStatus = 'Critical Gap';
    skillModifier = 0.30;
  } else if (css < 60) {
    cssStatus = 'Partial Match';
    skillModifier = 0.60;
  } else if (css < 80) {
    cssStatus = 'Strong Match';
    skillModifier = 0.85;
  } else {
    cssStatus = 'Excellent Match';
    skillModifier = 1.00;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: CORE VARIABLES (0-100)
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. SMS
  const sms = reqSkills.length > 0 ? Math.min(100, Math.round((matchedCore.length / reqSkills.length) * 100)) : 100;

  // 2. ERS = (Industry Match × 40%) + (Role Match × 40%) + (Domain Match × 20%)
  const industryMatch = domainCompatibility === 0.0 ? 0 : 90;
  const roleMatch = candidate.target_role && job.title && (candidate.target_role.toLowerCase().includes(job.title.toLowerCase()) || job.title.toLowerCase().includes(candidate.target_role.toLowerCase())) ? 100 : 75;
  const domainMatch = domainCompatibility === 0.0 ? 0 : 85;
  const ers = domainCompatibility === 0.0 ? 0 : Math.round((industryMatch * 0.40) + (roleMatch * 0.40) + (domainMatch * 0.20));

  // 3. IS (Impact Score)
  const detectedMetrics: string[] = [];
  (candidate.projects || []).forEach((p) => {
    if (p.metrics) detectedMetrics.push(...p.metrics);
    const m = (p.description || '').match(/\d+[\d,.]*\s*(%|x|ms|s|giây|phút|k|m|triệu|người dùng|users|students|sinh viên|\/10|điểm|\+|\bms\b)/gi);
    if (m) detectedMetrics.push(...m);
  });
  const uniqueMetrics = Array.from(new Set(detectedMetrics));
  const impactScore = uniqueMetrics.length >= 3 ? 95 : uniqueMetrics.length === 2 ? 80 : uniqueMetrics.length === 1 ? 60 : 25;

  // 4. CS (Credibility Score)
  const projectEvidence: AiProjectEvidenceDetail[] = (candidate.projects || []).map((p) => {
    const pText = `${p.title} ${p.description || ''} ${(p.technologies || []).join(' ')}`.toLowerCase();
    const matched = reqSkills.filter((rs) => pText.includes(rs.toLowerCase()) || (p.technologies || []).some(t => t.toLowerCase() === rs.toLowerCase()));
    const isRelevant = domainCompatibility > 0.0 && (matched.length > 0 || (reqSkills.length === 0 && (p.technologies || []).length > 0));
    const weight = p.is_verified ? 3.0 : (p.demo_url || p.github_url) ? 2.0 : 1.0;

    return {
      id: p.id,
      title: p.title,
      evidence_level: p.is_verified ? 'institutional_verified' : (p.demo_url || p.github_url) ? 'live_artifact' : 'self_documented',
      evidence_weight: weight,
      matched_jd_requirements: matched,
      relevance_score: isRelevant ? (p.is_verified ? 95 : 70) : 30,
      has_metrics: (p.metrics && p.metrics.length > 0) || false,
      is_verified: !!p.is_verified,
      is_relevant: isRelevant,
    };
  });

  const relevantProjects = projectEvidence.filter(p => p.is_relevant);
  const topProjects = relevantProjects.slice(0, 3);
  const relevantEvidenceMass = relevantProjects.reduce((sum, p) => sum + p.evidence_weight, 0);

  const verifiedRelevantCount = (candidate.projects || []).filter(p => p.is_verified).length;
  const hasLiveArtifacts = (candidate.projects || []).some(p => p.github_url || p.demo_url);
  let csLevel: 1 | 2 | 3 | 4 | 5 = 1;
  let cs = 20;
  if (verifiedRelevantCount > 0 || (hasLiveArtifacts && uniqueMetrics.length > 0)) {
    csLevel = 5;
    cs = verifiedRelevantCount > 0 ? 98 : 95;
  } else if (uniqueMetrics.length > 0) {
    csLevel = 4;
    cs = 80;
  } else if ((candidate.projects || []).some(p => (p.description || '').length > 60)) {
    csLevel = 3;
    cs = 60;
  } else if ((candidate.projects || []).some(p => (p.description || '').length > 20)) {
    csLevel = 2;
    cs = 40;
  }

  // 5. GPS (Growth Potential Score)
  let gps = 50;
  gps += Math.min(25, (candidate.certificates || []).length * 12);
  gps += Math.min(25, (candidate.projects || []).length * 8);
  if (/hackathon|nghiên cứu|contest|giải thưởng/i.test(candidateFullText)) gps += 10;
  gps = Math.min(100, gps);

  // 6. CMS (Complexity Score)
  let cms = 40;
  if (/microservices|distributed|high concurrency|kubernetes|k8s|kafka|ci\/cd|multi-tenant|global/i.test(candidateFullText)) {
    cms = 85;
  } else if (/state management|redux|zustand|docker|postgresql|redis|rest api|graphql|auth/i.test(candidateFullText)) {
    cms = 65;
  } else {
    cms = 30;
  }

  // 7. LS (Leadership Score)
  let ls: number | undefined = undefined;
  if (detectedLevel === 'lead') {
    let leadPts = 40;
    if (/team size|quản lý|mentoring/i.test(candidateFullText)) leadPts += 25;
    if (/hiring|tuyển dụng/i.test(candidateFullText)) leadPts += 15;
    if (/ownership|chiến lược/i.test(candidateFullText)) leadPts += 20;
    ls = Math.min(100, leadPts);
  }

  const frameworkVars: FrameworkVariables = {
    css,
    css_status: cssStatus,
    skill_modifier: skillModifier,
    raw_score: 0,
    sms,
    ers,
    ers_breakdown: {
      industry_match: industryMatch,
      role_match: roleMatch,
      domain_match: domainMatch,
    },
    is: impactScore,
    cs,
    cs_level: csLevel,
    gps,
    cms,
    ls,
    detected_level: detectedLevel,
    applied_formula: '',
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 4: RAW SCORE CALCULATION
  // ─────────────────────────────────────────────────────────────────────────────
  let rawScore = 0;
  let rawFormulaDesc = '';

  if (!gatePassed) {
    rawScore = 0;
    rawFormulaDesc = `Gate Check FAILED (${failedReasons.join('; ')}) ➔ Final Score = 0 (Status = Reject)`;
  } else {
    switch (detectedLevel) {
      case 'intern':
      case 'fresher':
        // Fresher: (SMS × 0.30) + (GPS × 0.30) + (CS × 0.20) + (ERS × 0.10) + (IS × 0.10)
        rawScore = (sms * 0.30) + (gps * 0.30) + (cs * 0.20) + (ers * 0.10) + (impactScore * 0.10);
        rawFormulaDesc = `Fresher Raw: (${sms}×0.3 + ${gps}×0.3 + ${cs}×0.2 + ${ers}×0.1 + ${impactScore}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;
      case 'junior':
        // Junior: (SMS × 0.30) + (ERS × 0.25) + (IS × 0.20) + (CS × 0.15) + (GPS × 0.10)
        rawScore = (sms * 0.30) + (ers * 0.25) + (impactScore * 0.20) + (cs * 0.15) + (gps * 0.10);
        rawFormulaDesc = `Junior Raw: (${sms}×0.3 + ${ers}×0.25 + ${impactScore}×0.2 + ${cs}×0.15 + ${gps}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;
      case 'mid':
        // Mid: (SMS × 0.25) + (ERS × 0.25) + (IS × 0.25) + (CS × 0.15) + (CMS × 0.10)
        rawScore = (sms * 0.25) + (ers * 0.25) + (impactScore * 0.25) + (cs * 0.15) + (cms * 0.10);
        rawFormulaDesc = `Mid-Level Raw: (${sms}×0.25 + ${ers}×0.25 + ${impactScore}×0.25 + ${cs}×0.15 + ${cms}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;
      case 'senior':
        // Senior: (ERS × 0.30) + (IS × 0.30) + (CMS × 0.20) + (CS × 0.10) + (SMS × 0.10)
        rawScore = (ers * 0.30) + (impactScore * 0.30) + (cms * 0.20) + (cs * 0.10) + (sms * 0.10);
        rawFormulaDesc = `Senior Raw: (${ers}×0.3 + ${impactScore}×0.3 + ${cms}×0.2 + ${cs}×0.1 + ${sms}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;
      case 'lead':
        const leadScore = ls ?? 70;
        rawScore = (impactScore * 0.30) + (leadScore * 0.25) + (ers * 0.20) + (cms * 0.15) + (cs * 0.10);
        rawFormulaDesc = `Lead/Manager Raw: (${impactScore}×0.3 + ${leadScore}×0.25 + ${ers}×0.2 + ${cms}×0.15 + ${cs}×0.1) = ${Math.round(rawScore * 10) / 10}`;
        break;
    }
    rawScore = Math.round(rawScore * 10) / 10;
  }

  frameworkVars.raw_score = rawScore;

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 5: SKILL MODIFIER & FINAL FORMULA
  // Final Score = Raw Score × Modifier
  // ─────────────────────────────────────────────────────────────────────────────
  let overall = 0;
  let formulaDesc = '';

  if (!gatePassed) {
    overall = 0;
    formulaDesc = `Gate Check FAILED (${failedReasons.join('; ')}) ➔ Final Score = 0 (Status = Reject)`;
  } else if (css < 20) {
    overall = 0;
    formulaDesc = `${rawFormulaDesc} ➔ CSS (${css}%) < 20% ➔ Modifier = 0 ➔ Final Score = 0 (Status = Reject)`;
  } else {
    overall = Math.min(100, Math.round(rawScore * skillModifier * 10) / 10);
    formulaDesc = `${rawFormulaDesc} ➔ Final Score = ${rawScore} × ${skillModifier} (CSS: ${css}% - ${cssStatus}) = ${overall}`;
  }

  frameworkVars.applied_formula = formulaDesc;

  // Match Level according to Framework v2.0:
  // 90-100: Excellent Match; 80-89: Strong Match; 70-79: Qualified Match; 60-69: Potential Match; 40-59: Weak Match; <40: Poor Match (hoặc Reject)
  let rulebookLevel: AiMatchResult['rulebook_level'] = 'Poor Match';
  if (!gatePassed || css < 20) {
    rulebookLevel = 'Reject';
  } else if (overall >= 90) {
    rulebookLevel = 'Excellent Match';
  } else if (overall >= 80) {
    rulebookLevel = 'Strong Match';
  } else if (overall >= 70) {
    rulebookLevel = 'Qualified Match';
  } else if (overall >= 60) {
    rulebookLevel = 'Potential Match';
  } else if (overall >= 40) {
    rulebookLevel = 'Weak Match';
  } else {
    rulebookLevel = 'Poor Match';
  }

  let matchRating: AiMatchResult['match_rating'] = 'NEEDS_DEVELOPMENT';
  if (overall >= 85) matchRating = 'STANDOUT_MATCH';
  else if (overall >= 70) matchRating = 'STRONG_FIT';
  else if (overall >= 50) matchRating = 'POTENTIAL_FIT';

  const criticalGaps: RulebookCriticalGap[] = [];
  if (missingCore.length > 0) {
    missingCore.slice(0, 3).forEach(m => {
      criticalGaps.push({
        requirement: `Thành thạo ${m}`,
        candidateValue: 'Chưa có minh chứng trong hồ sơ',
        severity: 'high'
      });
    });
  }

  const rulebookBreakdown: RulebookBreakdown = {
    skills: Math.round(sms),
    experience: Math.round(ers),
    requirements: Math.round(sms),
    projects: Math.round(cs),
    keywords: Math.round(gps),
    education: 85,
  };

  const rulebookGapAnalysis: RulebookGapAnalysis = {
    matchedSkills: matchedCore,
    missingSkills: missingCore,
    criticalGaps: criticalGaps
  };

  const trustMultiplier = verifiedRelevantCount >= 2 ? 1.05 : 1.0;

  return {
    overall_score: overall,
    match_rating: matchRating,
    rulebook_level: rulebookLevel,
    rulebook_breakdown: rulebookBreakdown,
    rulebook_gap_analysis: rulebookGapAnalysis,
    framework_variables: frameworkVars,
    gate_check: gateCheck,
    trust_index: {
      verified_project_count: verifiedRelevantCount,
      total_project_count: relevantProjects.length,
      verification_ratio: relevantProjects.length > 0 ? Math.round((verifiedRelevantCount / relevantProjects.length) * 100) / 100 : 0,
      trust_tier: verifiedRelevantCount >= 2 ? 'VERIFIED_ELITE' : verifiedRelevantCount >= 1 ? 'HIGH_TRUST' : 'UNVERIFIED',
      multiplier: trustMultiplier,
    },
    pillars: {
      skill_fit: {
        score: Math.round(sms),
        matched_core: domainCompatibility === 0.0 ? [] : matchedCore,
        missing_core: domainCompatibility === 0.0 ? reqSkills : missingCore,
        matched_secondary: domainCompatibility === 0.0 ? [] : matchedSecondary,
        missing_secondary: domainCompatibility === 0.0 ? prefSkills : missingSecondary,
        semantic_matches: [],
      },
      evidence_depth: {
        score: Math.round(cs),
        top_contributing_projects: topProjects,
        total_evidence_mass: relevantEvidenceMass,
        relevant_project_count: relevantProjects.length,
        verified_relevant_count: verifiedRelevantCount,
        total_candidate_projects: candidate.projects ? candidate.projects.length : 0,
      },
      impact_complexity: {
        score: Math.round(impactScore),
        detected_metrics_count: uniqueMetrics.length,
        metric_examples: uniqueMetrics.slice(0, 4),
        feedback: `Impact Score: ${impactScore}đ | Complexity Score: ${cms}đ.`,
      },
      alignment_level: {
        score: Math.round(ers),
        level_match: overall >= 60,
        target_role_match: ers >= 60,
        note: !gatePassed ? `Gate Check Reject: ${failedReasons[0]}` : `Cấp độ: ${detectedLevel.toUpperCase()} (${formulaDesc})`,
      },
    },
    gap_analysis: missingCore.map((m) => ({
      skill_or_topic: m,
      importance: 'CRITICAL',
      current_evidence_level: 'unverified_claim',
      gap_description: `Yêu cầu '${m}' chưa có minh chứng trong hồ sơ theo Framework v1.0.`,
      remediation_roadmap: {
        suggested_project_title: `Dự án thực hành ${m}`,
        project_objective: `Xây dựng ứng dụng thực tế áp dụng ${m}.`,
        recommended_tech_stack: [m, 'TypeScript'],
        target_metrics: 'Có mã nguồn GitHub và bản Demo sống.',
        estimated_effort_weeks: 1,
      },
    })),
    cv_coaching_tips: [
      ...(!gatePassed ? [`🚨 Gate Check không đạt (${failedReasons.join('; ')}). Trạng thái: Reject (Điểm = 0).`] : []),
      ...(criticalGaps.length > 0 ? [`Hồ sơ có ${criticalGaps.length} kỹ năng còn thiếu: ${criticalGaps.map(g => g.requirement).join(', ')}.`] : []),
      'Bổ sung thêm đồ án thực tế và gửi duyệt Verified Badge để tối ưu hóa Credibility Score L5 (95-100đ).'
    ],
    executive_summary: !gatePassed
      ? `Hồ sơ bị từ chối tại Gate Check (0 điểm): ${failedReasons.join('; ')}.`
      : `Độ tương thích đạt ${overall}% (${rulebookLevel}) theo CV-JD Matching Framework v1.0 [Cấp độ: ${detectedLevel.toUpperCase()}, SMS: ${sms}%, ERS: ${ers}%, IS: ${impactScore}%, CS: ${cs}%, GPS: ${gps}%, CMS: ${cms}%].`,
  };
}

export async function analyzePortfolioMatch(
  jdText: string,
  candidateSkills: string[],
  projects: JevProjectInput[],
  certificates: JevCertificateInput[] = []
): Promise<PortfolioMatchResult> {
  const candidate: JevCandidateProfile = {
    skills: candidateSkills,
    projects: projects,
    certificates: certificates,
    target_role: 'Software Developer',
  };

  const job: JevJobDescriptionInput = {
    raw_jd_text: jdText,
  };

  const jev = await analyzeJevPortfolioMatch(candidate, job);

  let legacyRating: PortfolioMatchResult['matchRating'] = 'Moderate';
  if (jev.overall_score >= 85) legacyRating = 'Excellent';
  else if (jev.overall_score >= 70) legacyRating = 'Good';
  else if (jev.overall_score < 55) legacyRating = 'Needs Improvement';

  const firstGap = jev.gap_analysis[0];
  const recommendedProjectIdea = firstGap ? {
    title: firstGap.remediation_roadmap.suggested_project_title,
    description: firstGap.remediation_roadmap.project_objective,
    keyTechStack: firstGap.remediation_roadmap.recommended_tech_stack,
    expectedImpact: firstGap.remediation_roadmap.target_metrics,
  } : {
    title: 'Enterprise Scalable Project',
    description: 'Nâng cấp kiến trúc và bổ sung kiểm thử tự động.',
    keyTechStack: ['TypeScript', 'Docker'],
    expectedImpact: 'Tăng mức độ tin cậy của nhà tuyển dụng lên 95%+.',
  };

  // MBTI Cultural Fit calculation
  const candidateMbti = getCandidateMBTI();
  let mbtiCompatibility: PortfolioMatchResult['mbtiCompatibility'] = undefined;
  if (candidateMbti && candidateMbti.mbtiType) {
    const compat = calculateMBTIJobCompatibility(candidateMbti.mbtiType, candidate.target_role || 'Developer', candidate.skills);
    mbtiCompatibility = {
      mbtiType: candidateMbti.mbtiType,
      culturalFitScore: compat.culturalFitScore,
      roleAlignmentTitle: compat.roleAlignmentTitle,
      workplaceSynergy: compat.workplaceSynergy,
      culturalStrengths: compat.culturalStrengths,
    };
    jev.mbti_compatibility = {
      mbti_type: candidateMbti.mbtiType,
      cultural_fit_score: compat.culturalFitScore,
      role_alignment_title: compat.roleAlignmentTitle,
      workplace_synergy: compat.workplaceSynergy,
      cultural_strengths: compat.culturalStrengths,
    };
  }

  return {
    overallScore: jev.overall_score,
    matchRating: legacyRating,
    rulebookLevel: jev.rulebook_level,
    rulebookBreakdown: jev.rulebook_breakdown,
    rulebookGapAnalysis: jev.rulebook_gap_analysis,
    mbtiCompatibility,
    summary: jev.executive_summary,
    matchedSkills: jev.pillars.skill_fit.matched_core.concat(jev.pillars.skill_fit.matched_secondary),
    missingSkills: jev.pillars.skill_fit.missing_core.concat(jev.pillars.skill_fit.missing_secondary),
    projectMatches: jev.pillars.evidence_depth.top_contributing_projects.map((p) => ({
      id: p.id,
      title: p.title,
      isVerified: p.is_verified,
      matchedSkills: p.matched_jd_requirements,
      relevanceScore: p.relevance_score,
    })),
    recommendedProjectIdea,
    optimizationTips: jev.cv_coaching_tips,
    aiResult: jev,
    jevResult: jev,
  };
}

export const computeLocalJev = computeLocalAiMatch;

export interface CompatibilityAnalysisHistoryItem {
  id: string;
  candidateId: string;
  candidateName: string;
  targetRole: string;
  timestamp: string;
  overallScore: number;
  pillars: {
    skillFit: number;
    evidenceDepth: number;
    impactComplexity: number;
    alignmentLevel: number;
  };
  trustTier: string;
  matchedSkillsCount: number;
  missingSkillsCount: number;
  versionLabel?: string;
}

const HISTORY_STORAGE_KEY = 'profilehub_jev_match_history';

export function saveCompatibilityMatchHistory(item: Omit<CompatibilityAnalysisHistoryItem, 'id' | 'timestamp'>): CompatibilityAnalysisHistoryItem {
  const history = getCompatibilityMatchHistory();
  const newItem: CompatibilityAnalysisHistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    versionLabel: `v${history.filter(h => h.candidateId === item.candidateId).length + 1}`
  };

  const updatedHistory = [newItem, ...history].slice(0, 30);
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.warn('Failed to save match history to localStorage:', e);
  }
  return newItem;
}

export function getCompatibilityMatchHistory(candidateId?: string): CompatibilityAnalysisHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as CompatibilityAnalysisHistoryItem[];
    if (candidateId) {
      return list.filter(item => item.candidateId === candidateId);
    }
    return list;
  } catch {
    return [];
  }
}

export function clearCompatibilityMatchHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear match history:', e);
  }
}
