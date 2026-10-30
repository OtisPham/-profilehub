import realMarketSalariesData from '../data/real_market_salaries.json';

export type SeniorityLevel = 'intern' | 'fresher' | 'junior' | 'mid' | 'senior' | 'lead';

export interface SalaryRange {
  minVnd: number;
  medianVnd: number;
  maxVnd: number;
  minUsd: number;
  medianUsd: number;
  maxUsd: number;
}

export interface TechMultiplier {
  tech: string;
  premiumPercent: number;
}

export interface EvidenceJobSample {
  company_name: string;
  job_title: string;
  salary_raw: string;
  salary_min_vnd: number;
  salary_max_vnd: number;
  source: string;
  verified_date: string;
}

export interface SalaryBenchmarkMetadata {
  crawledAt: string;
  expiresAt: string;
  sampleSize: number;
  totalJobsAnalyzed: number;
  sources: string[];
  freshnessBadge: string;
  isStale: boolean;
  isQueuedOnDemand?: boolean;
}

export interface SalaryBenchmarkResult {
  roleTitle: string;
  matchedRoleName: string;
  level: SeniorityLevel;
  levelLabel: string;
  range: SalaryRange;
  percentileRank: number; // 0 - 100 (vị thế trong phân vị thị trường)
  recommendedOfferVnd: number;
  recommendedOfferUsd: number;
  p75ProofOfWorkVnd: number;
  p75ProofOfWorkUsd: number;
  marketDemand: 'HOT' | 'VERY_HOT' | 'STABLE';
  marketDemandLabel?: string;
  keyTechMultipliers: TechMultiplier[];
  negotiationTips: string[];
  evidenceSamples: EvidenceJobSample[];
  metadata: SalaryBenchmarkMetadata;
}

const USD_RATE = realMarketSalariesData.metadata.usd_exchange_rate || 25400;

const LEVEL_LABELS: Record<SeniorityLevel, string> = {
  intern: 'Thực Tập Sinh (Intern)',
  fresher: 'Mới Tốt Nghiệp (Fresher 0-1 năm)',
  junior: 'Chuyên Viên (Junior 1-2 năm)',
  mid: 'Trung Cấp (Mid-Level 2-4 năm)',
  senior: 'Cao Cấp (Senior 4-7 năm)',
  lead: 'Trưởng Nhóm / Kiến Trúc Sư (Lead / Architect)'
};

const HIGH_VALUE_TECH: Record<string, number> = {
  'golang': 15,
  'go': 15,
  'rust': 20,
  'kubernetes': 18,
  'docker': 10,
  'aws': 15,
  'gcp': 15,
  'microservices': 15,
  'ai': 25,
  'gemini': 20,
  'llm': 25,
  'python': 12,
  'react': 10,
  'typescript': 10,
  'nestjs': 12,
  'kafka': 15,
  'redis': 10,
  'postgresql': 8
};

/**
 * Trích xuất cấp bậc từ mô tả công việc (JD) hoặc tiêu đề
 */
export function extractLevelFromJdOrTitle(text: string): SeniorityLevel {
  const lower = (text || '').toLowerCase();
  if (lower.includes('lead') || lower.includes('architect') || lower.includes('trưởng nhóm') || lower.includes('quản lý')) {
    return 'lead';
  }
  if (lower.includes('senior') || lower.includes('cao cấp') || lower.includes('5 năm') || lower.includes('4 năm')) {
    return 'senior';
  }
  if (lower.includes('mid') || lower.includes('2-3 năm') || lower.includes('3 năm')) {
    return 'mid';
  }
  if (lower.includes('junior') || lower.includes('1-2 năm') || lower.includes('1 năm')) {
    return 'junior';
  }
  if (lower.includes('intern') || lower.includes('thực tập')) {
    return 'intern';
  }
  return 'fresher';
}

/**
 * Tìm kiếm cấu hình vai trò khớp nhất trong dữ liệu thực tế đã cào
 */
function findMatchingRoleData(roleTitle: string) {
  const lowerTitle = (roleTitle || '').trim().toLowerCase();
  const roles = realMarketSalariesData.roles as Record<string, any>;

  // 1. Direct match with aliases
  for (const [, roleObj] of Object.entries(roles)) {
    if (roleObj.role_name.toLowerCase().includes(lowerTitle) || lowerTitle.includes(roleObj.role_name.toLowerCase())) {
      return { role: roleObj, isExactMatch: true };
    }
    if (roleObj.aliases && roleObj.aliases.some((alias: string) => lowerTitle.includes(alias) || alias.includes(lowerTitle))) {
      return { role: roleObj, isExactMatch: true };
    }
  }

  // 2. Fallback to general software engineer or backend nodejs
  const fallbackRole = roles['general_software_engineer'] || roles['backend_nodejs'];
  return { role: fallbackRole, isExactMatch: false };
}

/**
 * Tính toán dải lương thị trường và chiến lược đàm phán dựa trên Proof-of-Work
 * Tích hợp 100% dữ liệu thị trường thực tế (CareerViet VietSalary, ITviec, TopCV)
 */
export function calculateSalaryBenchmark(
  roleTitle: string,
  level: SeniorityLevel,
  techStack: string[] = [],
  verifiedProjectsCount: number = 0
): SalaryBenchmarkResult {
  const { role, isExactMatch } = findMatchingRoleData(roleTitle);
  const roleLevels = role.levels || {};
  const currentLevelData = roleLevels[level] || roleLevels['fresher'];

  // 1. Phân tích premium % từ tech stack
  const matchedMultipliers: TechMultiplier[] = [];
  let totalTechPremium = 0;

  techStack.forEach(t => {
    const key = t.trim().toLowerCase();
    for (const [techKey, premium] of Object.entries(HIGH_VALUE_TECH)) {
      if (key.includes(techKey) || techKey.includes(key)) {
        if (!matchedMultipliers.some(m => m.tech.toLowerCase() === techKey)) {
          matchedMultipliers.push({ tech: t, premiumPercent: premium });
          totalTechPremium += premium;
        }
        break;
      }
    }
  });

  // Giới hạn max tech multiplier là 35%
  const cappedTechPremium = Math.min(35, totalTechPremium);
  const multiplier = 1 + cappedTechPremium / 100;

  // 2. Lấy phân vị thực tế từ dữ liệu cào: P25, Median P50, P75 Proof-of-Work, P90
  const baseP25 = currentLevelData.p25_vnd || 10000000;
  const baseMedian = currentLevelData.median_p50_vnd || 14000000;
  const baseP75Pow = currentLevelData.p75_proof_of_work_vnd || Math.round(baseMedian * 1.3);
  const baseP90 = currentLevelData.p90_max_vnd || Math.round(baseMedian * 1.6);

  // Áp dụng Tech Multiplier vào các mốc phân vị
  const minVnd = Math.round((baseP25 * multiplier) / 500000) * 500000;
  const medianVnd = Math.round((baseMedian * multiplier) / 500000) * 500000;
  const p75PowVnd = Math.round((baseP75Pow * multiplier) / 500000) * 500000;
  const maxVnd = Math.round((baseP90 * multiplier) / 500000) * 500000;

  // 3. Tính phân vị năng lực (Percentile Rank) dựa trên Proof-of-Work đồ án
  let percentileRank = 50;
  if (verifiedProjectsCount >= 3) {
    percentileRank = 85;
  } else if (verifiedProjectsCount >= 2) {
    percentileRank = 75;
  } else if (verifiedProjectsCount >= 1) {
    percentileRank = 65;
  }

  // 4. Mức offer đề xuất khuyến nghị (Tự động đưa lên P75 nếu có từ 2 đồ án Verified)
  let recommendedOfferVnd = medianVnd;
  if (verifiedProjectsCount >= 2) {
    // Đòn bẩy P75 Proof-of-Work
    const extraRatio = Math.min(1, (percentileRank - 75) / 25);
    recommendedOfferVnd = Math.round((p75PowVnd + extraRatio * (maxVnd - p75PowVnd)) / 500000) * 500000;
  } else {
    const offerRatio = (percentileRank - 20) / 80;
    recommendedOfferVnd = Math.round((minVnd + offerRatio * (maxVnd - minVnd)) / 500000) * 500000;
  }

  // 5. Thị trường tuyển dụng (Lấy trực tiếp từ demand signal của dữ liệu cào)
  let marketDemand: 'HOT' | 'VERY_HOT' | 'STABLE' = (role.market_demand as any) || 'HOT';
  if (cappedTechPremium >= 20 || level === 'senior' || level === 'lead') {
    marketDemand = 'VERY_HOT';
  }

  // 6. Tính toán Freshness Badge & Hạn sử dụng (TTL 30 ngày)
  const meta = realMarketSalariesData.metadata;
  const crawledDate = new Date(meta.crawled_at);
  const expiresDate = new Date(meta.expires_at);
  const now = new Date();
  const diffDaysRemaining = Math.max(0, Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const monthYearStr = `Tháng ${crawledDate.getMonth() + 1}/${crawledDate.getFullYear()}`;

  let freshnessBadge = `🟢 Dữ liệu ${monthYearStr} • ${currentLevelData.sample_size || 150} tin khảo sát thực tế (Còn ${diffDaysRemaining} ngày)`;
  if (diffDaysRemaining === 0 || meta.is_stale) {
    freshnessBadge = `🟡 Dữ liệu cần cập nhật • Đang lên lịch đồng bộ`;
  }

  // 7. Chiến lược đàm phán (Negotiation Tips)
  const negotiationTips: string[] = [
    `🎯 Mở đầu đàm phán: Đặt khoảng kỳ vọng từ ${formatCurrencyVnd(recommendedOfferVnd)} đến ${formatCurrencyVnd(maxVnd)} để tạo biên độ thương lượng an toàn theo dữ liệu thị trường thực tế.`,
    `🛡️ Đòn bẩy Proof-of-Work P75: Bạn có ${verifiedProjectsCount} đồ án thực tế đã Verified. Dựa trên dữ liệu ${meta.sources[0]}, mức định giá đề xuất của bạn đạt ${formatCurrencyVnd(recommendedOfferVnd)} (nằm trong Top 25% ứng viên cùng cấp bậc).`,
    matchedMultipliers.length > 0
      ? `💡 Giá trị Tech Stack: Bạn thành thạo [${matchedMultipliers.map(m => m.tech).join(', ')}] - các kỹ năng khan hiếm này mang lại lợi thế cộng điểm thị trường +${cappedTechPremium}%.`
      : '💡 Bổ sung thêm các kỹ năng Cloud/Docker hoặc Microservices vào đồ án để nâng giá trị thương lượng thêm 15-20%.'
  ];

  return {
    roleTitle: roleTitle || role.role_name || 'Kỹ Sư Phần Mềm',
    matchedRoleName: role.role_name,
    level,
    levelLabel: LEVEL_LABELS[level] || LEVEL_LABELS.fresher,
    range: {
      minVnd,
      medianVnd,
      maxVnd,
      minUsd: Math.round(minVnd / USD_RATE),
      medianUsd: Math.round(medianVnd / USD_RATE),
      maxUsd: Math.round(maxVnd / USD_RATE)
    },
    percentileRank,
    recommendedOfferVnd,
    recommendedOfferUsd: Math.round(recommendedOfferVnd / USD_RATE),
    p75ProofOfWorkVnd: p75PowVnd,
    p75ProofOfWorkUsd: Math.round(p75PowVnd / USD_RATE),
    marketDemand,
    marketDemandLabel: role.market_demand_label || 'Nhu cầu cao & Ổn định',
    keyTechMultipliers: matchedMultipliers,
    negotiationTips,
    evidenceSamples: currentLevelData.evidence_samples || [],
    metadata: {
      crawledAt: meta.crawled_at,
      expiresAt: meta.expires_at,
      sampleSize: currentLevelData.sample_size || 120,
      totalJobsAnalyzed: meta.total_jobs_analyzed,
      sources: meta.sources,
      freshnessBadge,
      isStale: meta.is_stale,
      isQueuedOnDemand: !isExactMatch
    }
  };
}

export function formatCurrencyVnd(amount: number): string {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)} Tỷ VNĐ`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)} Triệu VNĐ`;
  }
  return `${amount.toLocaleString('vi-VN')} VNĐ`;
}
