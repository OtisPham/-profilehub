import type { CVSection, PersonalInfoData } from '../types/cvSection';
import type { CVTemplateType } from '../components/cv/CVTemplates';

export interface AtsParsedToken {
  type: 'name' | 'contact' | 'header' | 'title' | 'date' | 'keyword' | 'metric';
  text: string;
}

export interface AtsWarningItem {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion?: string;
}

export interface AtsParserAuditResult {
  parseabilityScore: number; // 0 - 100
  rating: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'RISKY';
  rawPlainText: string;
  extractedKeywords: string[];
  recognizedSections: string[];
  unrecognizedSections: string[];
  warnings: AtsWarningItem[];
  hasTwoColumnRisk: boolean;
  recommendedTemplate?: CVTemplateType;
}

/**
 * Các tiêu đề chuẩn mực mà hệ thống ATS toàn cầu (Workday, Greenhouse, Taleo, Lever) nhận diện
 */
const STANDARD_ATS_HEADERS: Record<string, string[]> = {
  summary: ['SUMMARY', 'PROFESSIONAL SUMMARY', 'MỤC TIÊU NGHỀ NGHIỆP', 'TÓM TẮT NĂNG LỰC', 'GIỚI THIỆU'],
  experience: ['EXPERIENCE', 'WORK EXPERIENCE', 'KINH NGHIỆM LÀM VIỆC', 'KINH NGHIỆM', 'EMPLOYMENT HISTORY'],
  projects: ['PROJECTS', 'KEY PROJECTS', 'DỰ ÁN & ĐỒ ÁN NỔI BẬT', 'ĐỒ ÁN THỰC CHIẾN', 'DỰ ÁN NỔI BẬT', 'PROJECTS & WORK'],
  education: ['EDUCATION', 'HỌC VẤN', 'HỌC VẤN & BẰNG CẤP', 'ACADEMIC BACKGROUND'],
  skills: ['SKILLS', 'TECHNICAL SKILLS', 'KỸ NĂNG CHUYÊN MÔN', 'KỸ NĂNG', 'CORE COMPETENCIES'],
  certifications: ['CERTIFICATIONS', 'CHỨNG CHỈ', 'CHỨNG CHỈ & BẰNG CẤP', 'LICENSES & CERTIFICATIONS'],
  awards: ['AWARDS', 'HONORS', 'GIẢI THƯỞNG', 'THÀNH TÍCH'],
  languages: ['LANGUAGES', 'NGOẠI NGỮ', 'NGÔN NGỮ'],
};

/**
 * Trích xuất và bóc tách chuỗi Plain-Text mà các hệ thống ATS sẽ nhìn thấy từ hồ sơ CV
 */
export function generateAtsPlainText(
  sections: CVSection[],
  personalInfo: PersonalInfoData
): string {
  const lines: string[] = [];

  // 1. Contact Information Header
  const name = personalInfo.fullName.trim() || 'HỌ VÀ TÊN ỨNG VIÊN';
  lines.push(name.toUpperCase());
  if (personalInfo.jobTitle) {
    lines.push(personalInfo.jobTitle.toUpperCase());
  }

  const contactParts: string[] = [];
  if (personalInfo.phone) contactParts.push(`SĐT: ${personalInfo.phone}`);
  if (personalInfo.email) contactParts.push(`Email: ${personalInfo.email}`);
  if (personalInfo.location) contactParts.push(`Địa điểm: ${personalInfo.location}`);
  if (personalInfo.github) contactParts.push(`GitHub: ${personalInfo.github}`);
  if (personalInfo.linkedin) contactParts.push(`LinkedIn: ${personalInfo.linkedin}`);
  if (personalInfo.website) contactParts.push(`Portfolio: ${personalInfo.website}`);

  if (contactParts.length > 0) {
    lines.push(contactParts.join(' | '));
  }
  lines.push('================================================================================');
  lines.push('');

  // 2. Body Sections in logical order
  const visibleSections = sections.filter(s => s.is_visible !== false);

  visibleSections.forEach(sec => {
    lines.push(sec.title.toUpperCase());
    lines.push('--------------------------------------------------------------------------------');

    if (sec.type === 'objective' && typeof sec.content === 'string') {
      lines.push(sec.content.trim());
      lines.push('');
    } else if (sec.items && Array.isArray(sec.items)) {
      sec.items.forEach((item: any) => {
        if (sec.type === 'work_experience' || (sec.type as string) === 'experience') {
          const comp = item.company || '';
          const pos = item.position || '';
          const period = item.period || '';
          const loc = item.location ? ` (${item.location})` : '';
          lines.push(`• ${pos}${comp ? ' - ' + comp : ''}${loc} [${period}]`);
          if (item.description) {
            lines.push(`  ${item.description.replace(/\n/g, '\n  ')}`);
          }
        } else if (sec.type === 'projects') {
          const title = item.title || '';
          const role = item.role ? ` | Vai trò: ${item.role}` : '';
          const period = item.period ? ` [${item.period}]` : '';
          lines.push(`• ${title}${role}${period}`);
          if (item.technologies && item.technologies.length > 0) {
            lines.push(`  Công nghệ sử dụng: ${item.technologies.join(', ')}`);
          }
          if (item.description) {
            lines.push(`  ${item.description.replace(/\n/g, '\n  ')}`);
          }
          if (item.demoUrl || item.githubUrl) {
            const links: string[] = [];
            if (item.demoUrl) links.push(`Demo: ${item.demoUrl}`);
            if (item.githubUrl) links.push(`Repo: ${item.githubUrl}`);
            lines.push(`  Liên kết: ${links.join(' | ')}`);
          }
        } else if (sec.type === 'education') {
          const school = item.school || '';
          const degree = item.degree || '';
          const period = item.period ? ` [${item.period}]` : '';
          const gpa = item.gpa ? ` | GPA: ${item.gpa}` : '';
          lines.push(`• ${school}${degree ? ' - ' + degree : ''}${period}${gpa}`);
          if (item.description) {
            lines.push(`  ${item.description}`);
          }
        } else if (sec.type === 'skills') {
          const cat = item.category || 'Kỹ năng';
          const skillList = Array.isArray(item.skills) ? item.skills.join(', ') : item.skills || '';
          lines.push(`• ${cat}: ${skillList}`);
        } else if (sec.type === 'certifications') {
          const nameCert = item.name || '';
          const issuer = item.issuer ? ` - ${item.issuer}` : '';
          const date = item.date ? ` (${item.date})` : '';
          lines.push(`• ${nameCert}${issuer}${date}`);
        } else if (sec.type === 'awards') {
          const title = item.title || '';
          const date = item.date ? ` [${item.date}]` : '';
          lines.push(`• ${title}${date}`);
          if (item.description) {
            lines.push(`  ${item.description}`);
          }
        } else {
          // Custom / others
          const title = item.title || item.name || '';
          lines.push(`• ${title}`);
          if (item.description) {
            lines.push(`  ${item.description}`);
          }
        }
      });
      lines.push('');
    }
  });

  return lines.join('\n');
}

/**
 * Phân tích độ tương thích và kiểm toán khả năng đọc hiểu của máy quét ATS (Taleo, Greenhouse, Workday)
 */
export function auditAtsParseability(
  sections: CVSection[],
  personalInfo: PersonalInfoData,
  currentTemplate: CVTemplateType
): AtsParserAuditResult {
  const warnings: AtsWarningItem[] = [];
  let score = 100;

  // 1. Kiểm tra 2-Column Parsing Risk
  const isMultiColumnTemplate = currentTemplate !== 'minimal' && currentTemplate !== 'executive';
  const hasTwoColumnRisk = isMultiColumnTemplate;

  if (hasTwoColumnRisk) {
    score -= 15;
    warnings.push({
      id: 'warn_two_column_risk',
      type: 'warning',
      title: 'Rủi ro phân giải 2 cột trên máy quét ATS cũ',
      description: `Mẫu "${currentTemplate}" sử dụng bố cục 2 cột. Các hệ thống ATS đời cũ có thể đọc dòng ngang qua cả 2 cột, làm trộn lẫn kinh nghiệm làm việc và danh sách kỹ năng bên sidebar.`,
      suggestion: 'Khuyến nghị: Chuyển sang mẫu "Minimalist Harvard" (1 cột chuẩn ATS) nếu ứng tuyển vào các tập đoàn lớn dùng Workday, Oracle Taleo.'
    });
  }

  // 2. Kiểm tra thông tin liên hệ bóc tách được
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /(0|\+84)[3|5|7|8|9][0-9]{8}/;

  if (!personalInfo.fullName || personalInfo.fullName.trim().length < 2) {
    score -= 20;
    warnings.push({
      id: 'warn_missing_name',
      type: 'danger',
      title: 'Thiếu hoặc tên ứng viên quá ngắn',
      description: 'Máy quét ATS không thể xác định được danh tính ứng viên ở dòng đầu tiên.'
    });
  }

  if (!personalInfo.email || !emailRegex.test(personalInfo.email.trim())) {
    score -= 15;
    warnings.push({
      id: 'warn_invalid_email',
      type: 'danger',
      title: 'Email không hợp lệ hoặc bị thiếu',
      description: 'Hệ thống tự động ATS dùng email làm ID chính để gửi thư mời phỏng vấn.'
    });
  }

  if (!personalInfo.phone || !phoneRegex.test(personalInfo.phone.replace(/[\s.-]/g, ''))) {
    score -= 10;
    warnings.push({
      id: 'warn_invalid_phone',
      type: 'warning',
      title: 'Định dạng số điện thoại chưa chuẩn',
      description: 'Khuyến nghị dùng định dạng số điện thoại tiêu chuẩn (VD: 0912 345 678).'
    });
  }

  // 3. Kiểm tra tiêu đề Section chuẩn
  const recognizedSections: string[] = [];
  const unrecognizedSections: string[] = [];

  const visibleSections = sections.filter(s => s.is_visible !== false);

  visibleSections.forEach(sec => {
    const rawTitle = sec.title.trim().toUpperCase();
    let isRecognized = false;

    for (const [_category, standardList] of Object.entries(STANDARD_ATS_HEADERS)) {
      if (standardList.some(h => rawTitle.includes(h) || h.includes(rawTitle))) {
        isRecognized = true;
        break;
      }
    }

    if (isRecognized) {
      recognizedSections.push(sec.title);
    } else {
      unrecognizedSections.push(sec.title);
    }
  });

  if (unrecognizedSections.length > 0) {
    score -= unrecognizedSections.length * 5;
    warnings.push({
      id: 'warn_unrecognized_headers',
      type: 'warning',
      title: `Có ${unrecognizedSections.length} mục có tiêu đề chưa chuẩn ATS`,
      description: `Các mục [${unrecognizedSections.join(', ')}] có thể bị máy quét bỏ qua hoặc xếp nhầm vào mục "Khác".`,
      suggestion: 'Đổi tên thành các tiêu đề chuẩn: KINH NGHIỆM LÀM VIỆC, DỰ ÁN NỔI BẬT, HỌC VẤN, KỸ NĂNG CHUYÊN MÔN.'
    });
  }

  // 4. Trích xuất các Keyword công nghệ/chuyên môn tìm thấy
  const rawPlainText = generateAtsPlainText(sections, personalInfo);
  const keywordsSet = new Set<string>();
  const commonTech = [
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Docker',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'AWS', 'GCP', 'Kubernetes', 'Git',
    'CI/CD', 'RESTful API', 'GraphQL', 'Tailwind CSS', 'Next.js', 'NestJS', 'Linux',
    'Agile', 'Scrum', 'STAR', 'Microservices', 'Unit Test'
  ];

  commonTech.forEach(tech => {
    const reg = new RegExp(`\\b${tech}\\b`, 'i');
    if (reg.test(rawPlainText)) {
      keywordsSet.add(tech);
    }
  });

  const extractedKeywords = Array.from(keywordsSet);

  if (extractedKeywords.length < 3) {
    score -= 10;
    warnings.push({
      id: 'warn_low_keywords',
      type: 'info',
      title: 'Mật độ từ khóa chuyên môn (Keywords) còn thấp',
      description: `Chỉ bóc tách được ${extractedKeywords.length} từ khóa kỹ thuật. Hãy bổ sung thêm tech stack cụ thể vào mục Dự án và Kỹ năng.`,
    });
  }

  // Đảm bảo score không tràn khỏi dải 0 - 100
  const parseabilityScore = Math.max(20, Math.min(100, score));

  let rating: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'RISKY' = 'EXCELLENT';
  if (parseabilityScore < 60) rating = 'RISKY';
  else if (parseabilityScore < 75) rating = 'WARNING';
  else if (parseabilityScore < 90) rating = 'GOOD';

  return {
    parseabilityScore,
    rating,
    rawPlainText,
    extractedKeywords,
    recognizedSections,
    unrecognizedSections,
    warnings,
    hasTwoColumnRisk,
    recommendedTemplate: hasTwoColumnRisk ? 'minimal' : undefined
  };
}
