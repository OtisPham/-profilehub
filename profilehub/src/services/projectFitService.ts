/**
 * Project Fit Explainer Service
 * Tuyển chọn & Xếp hạng Dự án đối chiếu minh bạch theo JD văn bản
 */

export interface ProjectFitItem {
  projectId: string;
  projectName: string;
  role: string;
  matchScore: number; // 0 - 100%
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendationReason: string;
  project: any;
}

const COMMON_TECH_KEYWORDS = [
  'react', 'next.js', 'vue', 'angular', 'svelte', 'typescript', 'javascript',
  'node.js', 'express', 'nest.js', 'python', 'django', 'fastapi', 'flask',
  'java', 'spring', 'spring boot', 'c#', '.net', 'golang', 'go', 'rust',
  'php', 'laravel', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'git', 'graphql',
  'rest api', 'microservices', 'tailwind css', 'css', 'html', 'flutter',
  'dart', 'react native', 'swift', 'kotlin', 'kafka', 'grpc'
];

export function extractJdKeywords(jdText: string): string[] {
  if (!jdText || typeof jdText !== 'string') return [];
  const lower = jdText.toLowerCase();
  
  return COMMON_TECH_KEYWORDS.filter(kw => {
    // Exact or boundary match
    const regex = new RegExp(`\\b${kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    return regex.test(lower) || lower.includes(kw);
  });
}

export const projectFitService = {
  /**
   * Đánh giá độ tương thích giữa danh sách đồ án và Job Description
   */
  evaluateProjectFit(projects: any[], jdText: string): ProjectFitItem[] {
    if (!projects || !Array.isArray(projects)) return [];

    const jdKeywords = extractJdKeywords(jdText);

    if (jdKeywords.length === 0) {
      return projects.map((p, idx) => ({
        projectId: p.id || `proj_${idx}`,
        projectName: p.projectName || p.title || 'Dự án không tên',
        role: p.role || 'Thành viên',
        matchScore: 50,
        matchedKeywords: [],
        missingKeywords: [],
        recommendationReason: 'Chưa phát hiện từ khóa công nghệ trong JD để đối chiếu chuyên sâu. Điểm giữ ở mức cơ bản.',
        project: p
      }));
    }

    const evaluated: ProjectFitItem[] = projects.map((p, idx) => {
      const projName = p.projectName || p.title || 'Dự án không tên';
      const role = p.role || 'Developer';
      const desc = p.description || '';
      const tags = (p.tags || p.technologies || []) as string[];
      
      const fullText = `${projName} ${role} ${desc} ${tags.join(' ')}`.toLowerCase();

      const matchedKeywords = jdKeywords.filter(kw => fullText.includes(kw));
      const missingKeywords = jdKeywords.filter(kw => !fullText.includes(kw));

      // Calculate score
      const matchRatio = matchedKeywords.length / jdKeywords.length;
      let score = Math.round(matchRatio * 75);

      // Relevance bonuses
      const titleLower = projName.toLowerCase();
      const hasTitleMatch = matchedKeywords.some(kw => titleLower.includes(kw));
      if (hasTitleMatch) score += 15;

      const hasTagMatch = tags.some(t => matchedKeywords.includes(t.toLowerCase()));
      if (hasTagMatch) score += 10;

      const finalScore = Math.max(10, Math.min(99, score));

      // Explanation reason
      let reason = '';
      if (matchedKeywords.length > 0) {
        const topMatched = matchedKeywords.slice(0, 4).join(', ');
        reason = `Khớp ${matchedKeywords.length}/${jdKeywords.length} từ khóa cốt lõi (${topMatched}). Phù hợp ${finalScore}% với vị trí ứng tuyển.`;
      } else {
        reason = `Chưa tìm thấy từ khóa công nghệ trùng khớp trực tiếp với JD trong dự án này.`;
      }

      return {
        projectId: p.id || `proj_${idx}`,
        projectName: projName,
        role,
        matchScore: finalScore,
        matchedKeywords,
        missingKeywords,
        recommendationReason: reason,
        project: p
      };
    });

    // Sắp xếp giảm dần theo điểm tương thích
    return evaluated.sort((a, b) => b.matchScore - a.matchScore);
  }
};
