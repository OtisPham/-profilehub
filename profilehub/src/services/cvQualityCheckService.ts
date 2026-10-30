import { CVSection, PersonalInfoData } from '../types/cvSection';

export interface QualityIssue {
  id: string;
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
  sectionId?: string;
  fixSuggestion?: string;
}

export interface QualityCheckResult {
  score: number; // 0 - 100
  passed: boolean; // true if no errors
  errorsCount: number;
  warningsCount: number;
  issues: QualityIssue[];
  metrics: {
    totalSections: number;
    totalBullets: number;
    skillsCount: number;
    projectsCount: number;
  };
}

export interface CVQualityCheckInput {
  personalInfo?: Partial<PersonalInfoData>;
  sections: CVSection[];
  targetRole?: string;
  title?: string;
}

/**
 * Feature 9: Basic Quality Check Rule Engine (Deterministic, zero AI token cost)
 * Evaluates CV structure, mandatory fields, overlong bullets, empty sections and page budget.
 */
export function evaluateCVQuality(
  cv: CVQualityCheckInput,
  pageBudgetRatio: number = 0 // from pageBudgetService (0 - 100+)
): QualityCheckResult {
  const issues: QualityIssue[] = [];
  let totalBullets = 0;
  let skillsCount = 0;
  let projectsCount = 0;

  // 1. Check Personal Information
  const pInfo = cv.personalInfo || {};
  if (!pInfo.fullName || pInfo.fullName.trim().length === 0) {
    issues.push({
      id: 'missing-name',
      rule: 'MISSING_NAME',
      severity: 'error',
      message: 'Họ và tên chưa được điền.',
      field: 'personalInfo.fullName',
      fixSuggestion: 'Vui lòng bổ sung họ tên đầy đủ ở phần Thông tin cá nhân.'
    });
  }

  if (!pInfo.email || !pInfo.email.includes('@')) {
    issues.push({
      id: 'missing-email',
      rule: 'MISSING_EMAIL',
      severity: 'error',
      message: 'Email liên hệ bị thiếu hoặc không đúng định dạng.',
      field: 'personalInfo.email',
      fixSuggestion: 'Bổ sung địa chỉ email chuyên nghiệp để Nhà tuyển dụng có thể liên hệ.'
    });
  }

  if (!pInfo.phone || pInfo.phone.trim().length < 9) {
    issues.push({
      id: 'missing-phone',
      rule: 'MISSING_PHONE',
      severity: 'warning',
      message: 'Số điện thoại liên hệ chưa được nhập.',
      field: 'personalInfo.phone',
      fixSuggestion: 'Nhập số điện thoại di động (có thể kích hoạt ẩn khi công khai).'
    });
  }

  const role = cv.targetRole || pInfo.jobTitle;
  if (!role || role.trim().length === 0) {
    issues.push({
      id: 'missing-target-role',
      rule: 'MISSING_TARGET_ROLE',
      severity: 'warning',
      message: 'Chưa có chức danh ứng tuyển mục tiêu.',
      field: 'targetRole',
      fixSuggestion: 'Đặt tên vị trí cụ thể (vd: Frontend Developer, Data Analyst) để tăng tính định hướng.'
    });
  }

  // 2. Check Sections
  const sections: CVSection[] = cv.sections || [];
  let hasEducation = false;
  let hasSkills = false;
  let hasProjectsOrExperience = false;

  sections.forEach((sec) => {
    const items = sec.items || [];
    const secType = sec.type ? sec.type.toLowerCase() : '';
    const secTitle = (sec.title || '').toLowerCase();

    // Check Empty Section
    if (items.length === 0 && (!sec.content || sec.content.trim().length === 0)) {
      issues.push({
        id: `empty-sec-${sec.id}`,
        rule: 'EMPTY_SECTION',
        severity: 'warning',
        message: `Mục "${sec.title || 'Không tên'}" hiện chưa có nội dung nào.`,
        sectionId: sec.id,
        fixSuggestion: 'Thêm nội dung hoặc ẩn mục này khỏi CV để tránh khoảng trắng lãng phí.'
      });
      return;
    }

    if (secType.includes('education') || secTitle.includes('học vấn') || secTitle.includes('education')) {
      hasEducation = true;
    }

    if (secType.includes('skill') || secTitle.includes('kỹ năng') || secTitle.includes('skills')) {
      hasSkills = true;
      items.forEach(it => {
        if (it.skills && Array.isArray(it.skills)) {
          skillsCount += it.skills.length;
        } else if (it.subtitle) {
          skillsCount += it.subtitle.split(',').length;
        }
      });
    }

    if (secType.includes('project') || secTitle.includes('dự án') || secTitle.includes('projects')) {
      hasProjectsOrExperience = true;
      projectsCount += items.length;
    }

    if (secType.includes('work_experience') || secType.includes('experience') || secTitle.includes('kinh nghiệm') || secTitle.includes('experience')) {
      hasProjectsOrExperience = true;
    }

    // Check Bullets in each Item
    items.forEach((item, itemIdx) => {
      const bullets: string[] = item.bullets || [];
      totalBullets += bullets.length;

      bullets.forEach((bullet, bIdx) => {
        const text = (bullet || '').trim();
        if (text.length > 200) {
          issues.push({
            id: `overlong-bullet-${sec.id}-${itemIdx}-${bIdx}`,
            rule: 'OVERLONG_BULLET',
            severity: 'warning',
            message: `Gạch đầu dòng tại mục "${sec.title}" quá dài (${text.length} ký tự).`,
            sectionId: sec.id,
            fixSuggestion: 'Rút ngắn dưới 180 ký tự hoặc tách thành 2 câu theo công thức Hành động + Kết quả.'
          });
        }
      });
    });
  });

  // 3. Mandatory Sections Check
  if (!hasEducation) {
    issues.push({
      id: 'missing-education',
      rule: 'MISSING_EDUCATION',
      severity: 'error',
      message: 'CV chưa có mục Học vấn (Education).',
      fixSuggestion: 'Bổ sung thông tin Trường đại học, chuyên ngành và năm tốt nghiệp.'
    });
  }

  if (!hasSkills || skillsCount === 0) {
    issues.push({
      id: 'missing-skills',
      rule: 'MISSING_SKILLS',
      severity: 'error',
      message: 'CV chưa liệt kê danh sách Kỹ năng chuyên môn (Skills).',
      fixSuggestion: 'Thêm các kỹ năng cốt lõi (Languages, Frameworks, Tools) liên quan đến vị trí.'
    });
  }

  if (!hasProjectsOrExperience) {
    issues.push({
      id: 'missing-experience-or-projects',
      rule: 'MISSING_PROJECTS_EXPERIENCE',
      severity: 'error',
      message: 'CV chưa có mục Dự án hoặc Kinh nghiệm làm việc thực tế.',
      fixSuggestion: 'Thêm ít nhất 1 đồ án thực hành hoặc kinh nghiệm thực tập để chứng minh năng lực.'
    });
  }

  // 4. Page Overflow Budget Check (> 100% means spills into 2nd page)
  if (pageBudgetRatio > 105) {
    issues.push({
      id: 'page-overflow',
      rule: 'PAGE_OVERFLOW',
      severity: 'error',
      message: `Nội dung CV vượt quá 1 trang A4 (${Math.round(pageBudgetRatio)}% dung lượng trang).`,
      fixSuggestion: 'Dùng tính năng Thu gọn dòng (Compact Spacing) hoặc xóa bớt nội dung không trọng tâm.'
    });
  }

  // Calculate Score: Start at 100, -15 per error, -5 per warning
  const errorsCount = issues.filter(i => i.severity === 'error').length;
  const warningsCount = issues.filter(i => i.severity === 'warning').length;

  const rawScore = 100 - (errorsCount * 15) - (warningsCount * 5);
  const score = Math.max(0, Math.min(100, rawScore));
  const passed = errorsCount === 0;

  return {
    score,
    passed,
    errorsCount,
    warningsCount,
    issues,
    metrics: {
      totalSections: sections.length,
      totalBullets,
      skillsCount,
      projectsCount
    }
  };
}
