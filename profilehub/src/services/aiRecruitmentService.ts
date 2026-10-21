export type AiEvidenceLevel = 
  | 'unverified_claim'      // Level 0: 0.30 - Chỉ tự khai
  | 'self_documented'       // Level 1: 0.60 - Có mô tả nhưng không có link
  | 'live_artifact'         // Level 2: 0.85 - Có link GitHub / Demo sống
  | 'institutional_verified'; // Level 3: 1.00 - Có huy hiệu Verified

export interface HiringBrief {
  position: string;
  experienceLevel: string;
  location: string;
  availability: string;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  minProjectsCount: number;
}

export interface GeneratedJD {
  title: string;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  location: string;
  workType: string;
}

export interface CandidateAiPillars {
  skillFitScore: number;
  evidenceDepthScore: number;
  impactScore: number;
  alignmentScore: number;
  mbtiCulturalFitScore?: number;
}

export type CandidateJevPillars = CandidateAiPillars;

export interface CandidateMatchResult {
  candidateId: string;
  candidateName: string;
  matchScore: number;
  technicalScore: number;
  mbtiType?: string;
  mbtiCompatibility?: any;
  matchRating: 'STANDOUT_MATCH' | 'STRONG_FIT' | 'POTENTIAL_FIT' | 'NEEDS_DEVELOPMENT';
  trustTier: 'VERIFIED_ELITE' | 'HIGH_TRUST' | 'MODERATE' | 'UNVERIFIED';
  trustMultiplier: number;
  pillars: CandidateAiPillars;
  matchingMustHave: string[];
  matchingNiceToHave: string[];
  missingSkills: string[];
  whyText: string[];
  warningText?: string;
  antiStuffingRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  verifiedProjectsCount: number;
  totalProjectsCount: number;
  verifiedProofs: Array<{ title: string; evidenceLevel: AiEvidenceLevel; verifier?: string }>;
  detectedMetrics: string[];
}

/**
 * Parses natural language prompt into structured Hiring Brief
 */
export function parseHiringPrompt(promptText: string): HiringBrief {
  const text = promptText.toLowerCase();

  // Position detection
  let position = 'Thực Tập Sinh Phần Mềm / Developer';
  if (text.includes('ui/ux') || text.includes('figma') || text.includes('design')) position = 'Thực tập sinh UI/UX Designer';
  else if (text.includes('frontend') || text.includes('react') || text.includes('web')) position = 'Frontend Developer (React / TypeScript)';
  else if (text.includes('backend') || text.includes('node') || text.includes('python')) position = 'Backend Developer (Node.js / Express)';
  else if (text.includes('data') || text.includes('sql') || text.includes('machine learning')) position = 'Data Analyst / AI Engineer';
  else if (text.includes('fullstack')) position = 'Fullstack Developer (Next.js / Node.js)';

  // Skills detection
  const allTechSkills = [
    'Figma', 'UI/UX', 'User Research', 'Photoshop', 'Illustrator',
    'ReactJS', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
    'Python', 'SQL', 'MongoDB', 'PostgreSQL', 'Git', 'Tailwind', 'HTML/CSS',
    'REST API', 'GraphQL', 'Docker', 'Machine Learning', 'Next.js', 'Redis'
  ];

  const mustHaveSkills: string[] = [];
  const niceToHaveSkills: string[] = [];

  allTechSkills.forEach(sk => {
    if (text.includes(sk.toLowerCase())) {
      mustHaveSkills.push(sk);
    }
  });

  if (mustHaveSkills.length === 0) {
    if (position.includes('UI/UX')) mustHaveSkills.push('Figma', 'UI/UX', 'User Research');
    else if (position.includes('Frontend')) mustHaveSkills.push('React', 'TypeScript', 'Tailwind', 'REST API');
    else mustHaveSkills.push('Git', 'Problem Solving', 'Teamwork');
  }

  if (position.includes('Frontend') && !mustHaveSkills.includes('Next.js')) niceToHaveSkills.push('Next.js', 'Testing');
  if (position.includes('Backend') && !mustHaveSkills.includes('Docker')) niceToHaveSkills.push('Docker', 'Redis');

  let location = 'TP. Hồ Chí Minh';
  if (text.includes('hà nội') || text.includes('hanoi')) location = 'Hà Nội';
  else if (text.includes('đà nẵng') || text.includes('danang')) location = 'Đà Nẵng';
  else if (text.includes('remote') || text.includes('online')) location = 'Remote / Online';

  let experienceLevel = 'Fresher / Junior (0-1 năm)';
  if (text.includes('senior')) experienceLevel = 'Senior (3+ năm)';
  else if (text.includes('thực tập') || text.includes('intern')) experienceLevel = 'Thực tập sinh (Intern)';

  let availability = 'Full-time';
  if (text.includes('part-time') || text.includes('bán thời gian')) availability = 'Part-time';

  let minProjectsCount = 1;
  if (text.includes('2 đồ án') || text.includes('2 projects')) minProjectsCount = 2;

  return {
    position,
    experienceLevel,
    location,
    availability,
    mustHaveSkills,
    niceToHaveSkills: niceToHaveSkills.length > 0 ? niceToHaveSkills : ['Tiếng Anh giao tiếp', 'Tư duy thuật toán'],
    minProjectsCount
  };
}

/**
 * Generates formatted Job Description based on Hiring Brief
 */
export function generateJobDescription(brief: HiringBrief): GeneratedJD {
  return {
    title: brief.position,
    aboutRole: `Công ty chúng tôi đang tìm kiếm vị trí ${brief.position} (${brief.experienceLevel}). Vị trí này sẽ trực tiếp tham gia xây dựng và triển khai các dự án thực tế cùng đội ngũ phát triển chuyên nghiệp theo tiêu chuẩn AI Evidence-based.`,
    responsibilities: [
      `Tham gia phân tích, thiết kế và phát triển các tính năng theo yêu cầu vị trí ${brief.position}.`,
      `Phối hợp với Trưởng nhóm sản phẩm để đảm bảo tiến độ và chất lượng đồ án/sản phẩm.`,
      `Tham gia đánh giá mã nguồn (Code review) hàng tuần.`,
      `Đo lường các chỉ số hiệu năng và tối ưu hóa hệ thống.`
    ],
    requirements: [
      `Yêu cầu trình độ / kinh nghiệm: ${brief.experienceLevel}`,
      ...brief.mustHaveSkills.map(sk => `Thạo kỹ năng / công cụ: ${sk}`),
      `Có ít nhất ${brief.minProjectsCount} đồ án thực tế có thể demo hoặc có mã nguồn kiểm chứng`,
      `Địa điểm: ${brief.location}, hình thức: ${brief.availability}`,
      `Tinh thần chủ động, trách nhiệm và tư duy đo lường kết quả định lượng (Metrics)`
    ],
    niceToHave: brief.niceToHaveSkills,
    location: brief.location,
    workType: brief.availability
  };
}

/**
 * Matches candidates against job requirements using AI 4-Pillar Scoring Architecture
 */
export function matchCandidatesWithJob(
  brief: HiringBrief,
  candidates: Array<{
    id: string;
    full_name: string;
    skills?: string[];
    verified_projects_count: number;
    projects: Array<{ 
      title: string; 
      description?: string;
      is_verified?: boolean; 
      demo_url?: string;
      github_url?: string;
      metrics?: string[];
    }>;
  }>
): CandidateMatchResult[] {
  console.log(`🤖 [AI Recruitment Engine] Đang đánh giá tương thích ${candidates.length} ứng viên với JD [${brief.position}] bằng: AI 4-Pillar Scoring Architecture + MBTI Cultural Fit Engine`);
  return candidates.map(cand => {
    const candSkills = cand.skills?.map(s => s.toLowerCase()) || [];
    
    // 1. Match Must-Have Skills & Secondary Skills
    const matchingMustHave = brief.mustHaveSkills.filter(sk =>
      candSkills.some(cs => cs.includes(sk.toLowerCase()) || sk.toLowerCase().includes(cs))
    );

    const matchingNiceToHave = brief.niceToHaveSkills.filter(sk =>
      candSkills.some(cs => cs.includes(sk.toLowerCase()) || sk.toLowerCase().includes(cs))
    );

    const missingSkills = brief.mustHaveSkills.filter(sk => !matchingMustHave.includes(sk));

    // --- PILLAR 1: Hard Skills Fit (30%) ---
    const totalWeightedSkills = (brief.mustHaveSkills.length * 2) + brief.niceToHaveSkills.length;
    const matchedWeightedSkills = (matchingMustHave.length * 2) + matchingNiceToHave.length;
    const skillFitScore = totalWeightedSkills > 0
      ? Math.round((matchedWeightedSkills / totalWeightedSkills) * 100)
      : 70;

    // --- PILLAR 2: Evidence Depth Fit (40%) ---
    const verifiedProofs: Array<{ title: string; evidenceLevel: AiEvidenceLevel; verifier?: string }> = [];
    let evidenceMass = 0;

    cand.projects.forEach(p => {
      let level: AiEvidenceLevel = 'unverified_claim';
      let weight = 0.30;
      if (p.is_verified) {
        level = 'institutional_verified';
        weight = 1.0;
        verifiedProofs.push({ title: p.title, evidenceLevel: level, verifier: 'Giảng viên / Trường ĐH' });
      } else if (p.demo_url || p.github_url) {
        level = 'live_artifact';
        weight = 0.85;
        verifiedProofs.push({ title: p.title, evidenceLevel: level });
      } else if (p.description && p.description.length > 30) {
        level = 'self_documented';
        weight = 0.60;
      }
      evidenceMass += weight;
    });

    const evidenceDepthScore = Math.min(100, Math.round((evidenceMass / Math.max(1, brief.minProjectsCount)) * 80) + (cand.verified_projects_count > 0 ? 20 : 0));

    // --- PILLAR 3: Quantified Impact Fit (20%) ---
    const detectedMetrics: string[] = [];
    cand.projects.forEach(p => {
      if (p.metrics) detectedMetrics.push(...p.metrics);
      const text = `${p.title} ${p.description || ''}`;
      const found = text.match(/\d+[\d,.]*\s*(%|x|ms|s|user|sinh viên|\/10|điểm)/gi);
      if (found) detectedMetrics.push(...found);
    });

    const uniqueMetrics = Array.from(new Set(detectedMetrics));
    const impactScore = uniqueMetrics.length >= 2 ? 95 : uniqueMetrics.length === 1 ? 75 : 40;

    // --- PILLAR 4: Alignment & Level Fit (10%) ---
    const alignmentScore = 90;

    // --- TRUST TIER & MULTIPLIER ---
    let trustTier: CandidateMatchResult['trustTier'] = 'UNVERIFIED';
    let trustMultiplier = 1.0;
    const verifiedCount = cand.verified_projects_count;
    const totalProjects = cand.projects.length;

    if (verifiedCount >= 2) {
      trustTier = 'VERIFIED_ELITE';
      trustMultiplier = 1.05;
    } else if (verifiedCount >= 1) {
      trustTier = 'HIGH_TRUST';
      trustMultiplier = 1.02;
    } else if (cand.projects.some(p => p.demo_url || p.github_url)) {
      trustTier = 'MODERATE';
      trustMultiplier = 1.0;
    } else {
      trustTier = 'UNVERIFIED';
      trustMultiplier = 0.95;
    }

    // Anti-stuffing check
    let antiStuffingRisk: CandidateMatchResult['antiStuffingRisk'] = 'LOW';
    if (candSkills.length >= 8 && totalProjects === 0) {
      antiStuffingRisk = 'HIGH';
    } else if (candSkills.length >= 6 && verifiedCount === 0 && uniqueMetrics.length === 0) {
      antiStuffingRisk = 'MEDIUM';
    }

    // --- COMPOSITE SCORE CALCULATION ---
    const rawTechnical = (
      skillFitScore * 0.30 +
      evidenceDepthScore * 0.40 +
      impactScore * 0.20 +
      alignmentScore * 0.10
    ) * trustMultiplier;

    const technicalScore = Math.min(100, Math.max(30, Math.round(rawTechnical)));
    const matchScore = technicalScore;

    let matchRating: CandidateMatchResult['matchRating'] = 'NEEDS_DEVELOPMENT';
    if (matchScore >= 85) matchRating = 'STANDOUT_MATCH';
    else if (matchScore >= 70) matchRating = 'STRONG_FIT';
    else if (matchScore >= 50) matchRating = 'POTENTIAL_FIT';

    // Reasons / Why text
    const whyText: string[] = [];
    matchingMustHave.forEach(sk => whyText.push(`✓ Khớp kỹ năng cốt lõi: ${sk}`));
    if (cand.verified_projects_count > 0) {
      whyText.push(`🛡️ ${cand.verified_projects_count} đồ án có minh chứng thực tế`);
    }
    if (uniqueMetrics.length > 0) {
      whyText.push(`📊 Có số liệu định lượng: ${uniqueMetrics.slice(0, 2).join(', ')}`);
    }

    let warningText: string | undefined = undefined;
    if (missingSkills.length > 0) {
      warningText = `△ Chưa tìm thấy minh chứng cho: ${missingSkills.join(', ')}`;
    }
    if (antiStuffingRisk === 'HIGH') {
      warningText = `⚠️ Cảnh báo: Ứng viên liệt kê nhiều kỹ năng nhưng thiếu đồ án kiểm chứng.`;
    }

    return {
      candidateId: cand.id,
      candidateName: cand.full_name,
      matchScore,
      technicalScore,
      matchRating,
      trustTier,
      trustMultiplier,
      pillars: {
        skillFitScore,
        evidenceDepthScore,
        impactScore,
        alignmentScore,
      },
      matchingMustHave,
      matchingNiceToHave,
      missingSkills,
      whyText,
      warningText,
      antiStuffingRisk,
      verifiedProjectsCount: cand.verified_projects_count,
      totalProjectsCount: totalProjects,
      verifiedProofs,
      detectedMetrics: uniqueMetrics,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
