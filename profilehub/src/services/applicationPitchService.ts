/**
 * Contextual Application Pitch Service
 * Sinh thư ứng tuyển ngắn gọn (< 250 từ) may đo theo JD và CV Project Instances,
 * áp dụng cấu trúc 3 phần Evidence-First và rào chắn Anti-Hallucination.
 */

import type { ProjectItem } from '../types/cvSection';
import { extractJdKeywords } from './projectFitService';

export interface GeneratePitchParams {
  applicantName: string;
  targetRole: string;
  targetJd: string;
  projects: ProjectItem[];
  userSkills?: string[];
}

export interface PitchValidationResult {
  isValid: boolean;
  missingRequirements: string[];
}

export interface PitchResult {
  content: string;
  wordCount: number;
  featuredProjects: string[];
  matchedKeywords: string[];
  isDeterministicFallback: boolean;
}

export const applicationPitchService = {
  /**
   * Kiểm tra điều kiện đầu vào bắt buộc (Hard-Gating Guard):
   * Phải có Job Description (JD) và ít nhất 1 đồ án thực tế.
   */
  validateInput(targetJd?: string, projects?: ProjectItem[]): PitchValidationResult {
    const missing: string[] = [];
    const trimmedJd = (targetJd || '').trim();

    if (!trimmedJd || trimmedJd.length < 20) {
      missing.push('Job Description (JD) chi tiết của vị trí ứng tuyển (tối thiểu 20 ký tự)');
    }

    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      missing.push('Ít nhất 1 đồ án thực tế (Project) đã được chọn đưa vào CV');
    }

    return {
      isValid: missing.length === 0,
      missingRequirements: missing
    };
  },

  /**
   * Đếm số từ trong văn bản tiếng Việt / tiếng Anh
   */
  countWords(text: string): number {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  },

  /**
   * Tìm đồ án phù hợp nhất với JD dựa trên từ khóa công nghệ
   */
  findTopMatchingProjects(projects: ProjectItem[], jdKeywords: string[], maxCount = 2): ProjectItem[] {
    if (!projects || projects.length === 0) return [];
    if (jdKeywords.length === 0) return projects.slice(0, maxCount);

    const scored = projects.map(p => {
      const pName = (p.projectName || '').toLowerCase();
      const pDesc = (p.description || '').toLowerCase();
      const pTags = (p.technologies || []).map(t => t.toLowerCase());
      const pBullets = (p.bullets || []).join(' ').toLowerCase();
      const fullText = `${pName} ${pDesc} ${pTags.join(' ')} ${pBullets}`;

      const matchedCount = jdKeywords.filter(kw => fullText.includes(kw.toLowerCase())).length;
      return { project: p, score: matchedCount };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxCount).map(s => s.project);
  },

  /**
   * Sinh thư ứng tuyển theo chuẩn Evidence-First 3-Part Pitch (< 250 từ)
   */
  async generatePitch(params: GeneratePitchParams): Promise<PitchResult> {
    const { applicantName, targetRole, targetJd, projects, userSkills = [] } = params;

    const validation = this.validateInput(targetJd, projects);
    if (!validation.isValid) {
      throw new Error(`Không đủ điều kiện tạo thư ứng tuyển: ${validation.missingRequirements.join('; ')}`);
    }

    const jdKeywords = extractJdKeywords(targetJd);
    const topProjects = this.findTopMatchingProjects(projects, jdKeywords, 2);
    const primaryProj = topProjects[0];

    // Xác định từ khóa công nghệ khớp giữa đồ án và JD
    const projectTechs = (primaryProj.technologies || []).filter(tech =>
      jdKeywords.length === 0 || jdKeywords.some(kw => tech.toLowerCase().includes(kw.toLowerCase()))
    );
    const matchedSkills = projectTechs.length > 0
      ? projectTechs.slice(0, 3).join(', ')
      : (userSkills.slice(0, 3).join(', ') || 'các công nghệ nền tảng');

    // Xác định link minh chứng
    const demoLink = primaryProj.projectUrl || (primaryProj as any).demoUrl || '';
    const linkText = demoLink
      ? `(Live Demo: ${demoLink})`
      : primaryProj.githubUrl
        ? `(Mã nguồn: ${primaryProj.githubUrl})`
        : '';

    // Xây dựng 3 đoạn văn chuẩn Evidence-First
    // Đoạn 1: Hook & Alignment
    const hook = `Kính gửi Quý Công ty,\n\nTôi viết thư này để ứng tuyển vị trí ${targetRole || 'Software Engineer'}. Theo dõi yêu cầu trong JD, tôi nhận thấy định hướng của Quý công ty rất tương đồng với kinh nghiệm thực chiến của tôi trong việc phát triển sản phẩm với ${matchedSkills}.`;

    // Đoạn 2: Project Evidence Spotlight
    const projDesc = primaryProj.description
      ? primaryProj.description.replace(/^[•\-\*]\s*/, '').split('\n')[0].slice(0, 160)
      : `xây dựng giải pháp kỹ thuật với ${(primaryProj.technologies || []).slice(0, 3).join(', ')}`;

    const evidence = `Tại dự án tiêu biểu "${primaryProj.projectName}" ${linkText}, tôi trực tiếp đảm nhiệm vai trò ${primaryProj.role || 'Lập trình viên chính'}. Tôi đã giải quyết bài toán ${projDesc.trim().replace(/\.$/, '')}, qua đó kiểm chứng năng lực giải quyết vấn đề thực tế và tư duy tối ưu hiệu năng.`;

    // Đoạn 3: Technical Call to Action
    const cta = `Tôi rất mong có cơ hội trao đổi trực tiếp trong buổi phỏng vấn để làm rõ các quyết định kiến trúc và bài học kỹ thuật thu được từ dự án này.\n\nTrân trọng,\n${applicantName || 'Ứng viên'}`;

    const fullPitch = `${hook}\n\n${evidence}\n\n${cta}`;
    const wordCount = this.countWords(fullPitch);

    return {
      content: fullPitch,
      wordCount,
      featuredProjects: topProjects.map(p => p.projectName),
      matchedKeywords: jdKeywords.slice(0, 5),
      isDeterministicFallback: true
    };
  }
};
