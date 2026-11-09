import type { 
  SkillGapReport, 
  MatchedSkillItem, 
  MissingSkillItem, 
  RecipeStatus, 
  ProjectUpgradeRecipe,
  JobPost
} from '../types/database';
import { SKILL_METADATA_MAP, buildRecipeForSkill } from './skillGapRecipes';

const STORAGE_KEY = 'profilehub_skill_gap_reports';

export class SkillGapService {
  /**
   * Đọc danh sách tất cả báo cáo từ localStorage
   */
  private loadStoredReports(): SkillGapReport[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Lưu danh sách báo cáo vào localStorage
   */
  private saveStoredReports(reports: SkillGapReport[]): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('[SkillGapService] Không thể lưu vào localStorage:', e);
    }
  }

  /**
   * Chuẩn hóa tên kỹ năng để đối chiếu không phân biệt hoa thường và alias
   */
  private normalizeSkill(skill: string): string {
    return skill.trim().toLowerCase();
  }

  /**
   * Phân tích khoảng cách kỹ năng giữa Sinh viên và Tin tuyển dụng
   */
  public diagnoseSkillGap(
    studentProfile: {
      id?: string;
      skills?: string[];
      projects?: Array<{ id: string; title: string; tags?: string[] }>;
    },
    job: Partial<JobPost> & { id: string; title: string }
  ): SkillGapReport {
    const studentId = studentProfile.id || 'current_student';
    const jobId = job.id;

    // 1. Thu thập bộ kỹ năng hiện tại của ứng viên
    const rawSkills = studentProfile.skills || [];
    const candidateSkillsSet = new Set(rawSkills.map(s => this.normalizeSkill(s)));

    // Bản đồ kỹ năng từ các đồ án thực tế
    const projectSkillMap = new Map<string, string>(); // normalizedSkill -> projectTitle
    if (studentProfile.projects && studentProfile.projects.length > 0) {
      studentProfile.projects.forEach(p => {
        if (p.tags && Array.isArray(p.tags)) {
          p.tags.forEach(t => {
            const norm = this.normalizeSkill(t);
            candidateSkillsSet.add(norm);
            if (!projectSkillMap.has(norm)) {
              projectSkillMap.set(norm, p.title);
            }
          });
        }
      });
    }

    // 2. Xác định các kỹ năng yêu cầu của Job
    let requiredSkills: string[] = [];
    if (job.required_skills && job.required_skills.length > 0) {
      requiredSkills = [...job.required_skills];
    } else {
      // Fallback: Tự động trích xuất các từ khóa công nghệ phổ biến từ tiêu đề và phòng ban
      const contextText = `${job.title} ${job.department || ''} ${job.description || ''}`.toLowerCase();
      const detected: string[] = [];
      Object.keys(SKILL_METADATA_MAP).forEach(key => {
        if (contextText.includes(key)) {
          detected.push(SKILL_METADATA_MAP[key].canonicalName);
        }
      });
      requiredSkills = detected.length > 0 ? Array.from(new Set(detected)) : ['React', 'Node.js', 'Git', 'Docker'];
    }

    // 3. So khớp & Phân loại
    const matchedSkills: MatchedSkillItem[] = [];
    const missingSkills: MissingSkillItem[] = [];

    requiredSkills.forEach(req => {
      const normReq = this.normalizeSkill(req);
      
      // Kiểm tra xem ứng viên có kỹ năng này hoặc alias tương đương không
      let isMatched = false;
      let matchedSource: 'cv' | 'project' = 'cv';
      let matchedProjectTitle: string | undefined = undefined;

      // So khớp trực tiếp hoặc qua metadata map
      const meta = SKILL_METADATA_MAP[normReq];
      const targetCanonical = meta ? meta.canonicalName.toLowerCase() : normReq;

      for (const candSkill of candidateSkillsSet) {
        if (candSkill === normReq || candSkill.includes(normReq) || normReq.includes(candSkill) || candSkill === targetCanonical) {
          isMatched = true;
          if (projectSkillMap.has(candSkill)) {
            matchedSource = 'project';
            matchedProjectTitle = projectSkillMap.get(candSkill);
          }
          break;
        }
      }

      if (isMatched) {
        matchedSkills.push({
          name: meta ? meta.canonicalName : req,
          source: matchedSource,
          projectTitle: matchedProjectTitle
        });
      } else {
        missingSkills.push({
          name: meta ? meta.canonicalName : req,
          criticality: meta ? meta.defaultCriticality : 'critical',
          category: meta ? meta.category : 'backend',
          reason: meta ? meta.reason : `Yêu cầu trọng yếu được nêu trong bản mô tả công việc ${job.title}.`
        });
      }
    });

    // 4. Tính toán điểm sẵn sàng tuyển dụng (Readiness Score)
    const totalRequired = requiredSkills.length;
    let baseScore = totalRequired > 0 
      ? Math.round((matchedSkills.length / totalRequired) * 100)
      : 100;
    
    // Đảm bảo biên độ hiển thị thực tế
    if (missingSkills.length > 0 && baseScore > 90) {
      baseScore = 85;
    } else if (matchedSkills.length > 0 && baseScore < 20) {
      baseScore = 25;
    }

    // 5. Sinh công thức nâng cấp mã nguồn (Recipes) cho các kỹ năng thiếu (tối đa 3 recipes hàng đầu)
    const upgradeRecipes: ProjectUpgradeRecipe[] = [];
    missingSkills.slice(0, 3).forEach(ms => {
      const recipe = buildRecipeForSkill(ms.name);
      if (recipe) {
        upgradeRecipes.push(recipe);
      }
    });

    // 6. Kiểm tra xem đã có báo cáo lưu trước đó chưa để giữ lại tiến độ hoàn thành recipe
    const existingReports = this.loadStoredReports();
    const existingIndex = existingReports.findIndex(
      r => r.studentId === studentId && r.jobId === jobId
    );

    if (existingIndex >= 0) {
      const existing = existingReports[existingIndex];
      // Khôi phục trạng thái các recipe đã hoàn thành
      upgradeRecipes.forEach(newRec => {
        const found = existing.upgradeRecipes.find(r => r.targetSkill === newRec.targetSkill);
        if (found && found.status === 'completed') {
          newRec.status = 'completed';
          newRec.completedAt = found.completedAt;
        }
      });
      // Tính lại điểm sau khi cộng điểm hoàn thành recipe
      const completedCount = upgradeRecipes.filter(r => r.status === 'completed').length;
      if (completedCount > 0 && upgradeRecipes.length > 0) {
        const bonus = Math.round(((100 - baseScore) * completedCount) / upgradeRecipes.length);
        baseScore = Math.min(100, baseScore + bonus);
      }
    }

    const report: SkillGapReport = {
      id: `gap_rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      jobId,
      jobTitle: job.title,
      companyName: (job as any).company_name || 'Doanh Nghiệp Tuyển Dụng',
      readinessScore: baseScore,
      matchedSkills,
      missingSkills,
      upgradeRecipes,
      generatedAt: new Date().toISOString()
    };

    // 7. Lưu lại báo cáo mới nhất
    if (existingIndex >= 0) {
      existingReports[existingIndex] = report;
    } else {
      existingReports.unshift(report);
    }
    this.saveStoredReports(existingReports);

    return report;
  }

  /**
   * Lấy báo cáo đã lưu gần nhất của một cặp (studentId, jobId)
   */
  public getStoredSkillGapReport(studentId: string, jobId: string): SkillGapReport | null {
    const reports = this.loadStoredReports();
    return reports.find(r => r.studentId === studentId && r.jobId === jobId) || null;
  }

  /**
   * Cập nhật trạng thái Recipe và tự động tính toán lại readinessScore
   */
  public updateRecipeStatus(
    reportId: string,
    recipeId: string,
    status: RecipeStatus
  ): SkillGapReport | null {
    const reports = this.loadStoredReports();
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) return null;

    const report = reports[reportIndex];
    const recipe = report.upgradeRecipes.find(r => r.id === recipeId);
    if (!recipe) return report;

    recipe.status = status;
    if (status === 'completed') {
      recipe.completedAt = new Date().toISOString();
    } else {
      delete recipe.completedAt;
    }

    // Tái tính toán điểm sẵn sàng
    const totalRecipes = report.upgradeRecipes.length;
    const completedCount = report.upgradeRecipes.filter(r => r.status === 'completed').length;

    // Base score nguyên thủy tính theo matched skills
    const totalRequired = report.matchedSkills.length + report.missingSkills.length;
    const baseScore = totalRequired > 0 
      ? Math.round((report.matchedSkills.length / totalRequired) * 100) 
      : 70;

    if (totalRecipes > 0) {
      const remainingRoom = 100 - baseScore;
      const boost = Math.round((remainingRoom * completedCount) / totalRecipes);
      report.readinessScore = Math.min(100, baseScore + boost);
    }

    reports[reportIndex] = report;
    this.saveStoredReports(reports);
    return report;
  }

  /**
   * Lấy toàn bộ danh sách báo cáo của sinh viên
   */
  public getAllReportsForStudent(studentId: string): SkillGapReport[] {
    const reports = this.loadStoredReports();
    return reports.filter(r => r.studentId === studentId);
  }
}

export const skillGapService = new SkillGapService();
