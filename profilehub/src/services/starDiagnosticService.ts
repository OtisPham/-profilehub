/**
 * STAR CV Diagnostic & Guided Project Elicitation Service
 * Chẩn đoán câu chữ mô tả dự án theo chuẩn STAR, phát hiện điểm yếu & từ ngữ mơ hồ,
 * và cung cấp bộ câu hỏi khơi gợi số liệu kỹ thuật tái hiện được (100% Anti-Hallucination).
 */

export interface StatementDiagnosis {
  statement: string;
  isStarCompliant: boolean;
  score: number; // 0 - 100
  hasSituation: boolean;
  hasAction: boolean;
  hasResult: boolean;
  detectedMetrics: string[];
  detectedPassiveVerbs: string[];
  weaknesses: string[];
  actionableTips: string[];
}

export interface ElicitationQuestions {
  projectName: string;
  technologies: string[];
  situationQuestion: string;
  actionQuestion: string;
  resultQuestion: string;
  suggestedVerificationMethods: string[];
}

export interface ElicitationAnswers {
  projectName: string;
  technologies: string[];
  situationAnswer: string;
  actionAnswer: string;
  resultAnswer: string;
}

export interface AssembledStarResult {
  starBullet: string;
  situationPart: string;
  actionPart: string;
  resultPart: string;
  interviewDefenseTip: string;
}

export interface ProjectDiagnosticItem {
  id: string;
  projectName: string;
  technologies: string[];
  originalLines: string[];
  diagnosis: StatementDiagnosis;
}

export interface CvDiagnosticReport {
  totalProjects: number;
  averageScore: number;
  projects: ProjectDiagnosticItem[];
  globalRecommendations: string[];
}

// Banned passive/vague role verbs that weaken CV impact
const PASSIVE_VAGUE_VERBS = [
  'tham gia',
  'hỗ trợ',
  'được giao',
  'phụ trách',
  'tìm hiểu sơ qua',
  'nghiên cứu sơ qua',
  'biết dùng'
];

// Active engineering verbs that recruiters look for
const ACTIVE_ENGINEERING_VERBS = [
  'kiến trúc',
  'trực tiếp kiến trúc',
  'phát triển',
  'trực tiếp xây dựng',
  'xây dựng',
  'tối ưu',
  'tối ưu hoá',
  'tối ưu hóa',
  'tái cấu trúc',
  'thiết kế',
  'kiểm thử',
  'đóng gói',
  'triển khai',
  'tích hợp'
];

// Regex detecting technical metrics & reproducible benchmarks
const TECHNICAL_METRICS_REGEX =
  /(\d+(\.\d+)?\s*(%|ms|s|giây|req\/s|tps|kb|mb|score|điểm|test|tests|coverage|bản ghi|records|tables|endpoints|commits?))/gi;

export const starDiagnosticService = {
  /**
   * Chẩn đoán chi tiết một câu mô tả dự án theo chuẩn STAR
   */
  diagnoseStatement(statement: string): StatementDiagnosis {
    const trimmed = (statement || '').trim();
    if (!trimmed) {
      return {
        statement: '',
        isStarCompliant: false,
        score: 0,
        hasSituation: false,
        hasAction: false,
        hasResult: false,
        detectedMetrics: [],
        detectedPassiveVerbs: [],
        weaknesses: ['Dòng mô tả trống hoặc chưa có nội dung.'],
        actionableTips: ['Hãy nhập mô tả công việc hoặc bài toán bạn đã giải quyết trong đồ án.']
      };
    }

    const lower = trimmed.toLowerCase();

    // 1. Check for passive verbs
    const detectedPassiveVerbs = PASSIVE_VAGUE_VERBS.filter(verb => lower.includes(verb));

    // 2. Check for active engineering verbs
    const hasActiveVerb = ACTIVE_ENGINEERING_VERBS.some(verb => lower.includes(verb));

    // Action is valid if it has active verbs AND no passive verbs
    const hasAction = hasActiveVerb && detectedPassiveVerbs.length === 0;

    // 3. Check for reproducible technical metrics
    const metricMatches = trimmed.match(TECHNICAL_METRICS_REGEX);
    const detectedMetrics = metricMatches ? Array.from(new Set(metricMatches)) : [];
    const hasResult = detectedMetrics.length > 0;

    // 4. Check for situation/task context (keywords indicating problem, challenge, or system domain)
    const contextKeywords = [
      'module', 'hệ thống', 'tính năng', 'cơ chế', 'bài toán', 'thách thức', 'nhằm', 'đáp ứng',
      'yêu cầu', 'khi', 'giúp', 'cho phép', 'để', 'quy mô', 'trên'
    ];
    const hasSituation = contextKeywords.some(kw => lower.includes(kw)) && trimmed.length > 25;

    // Calculate STAR Score (0 - 100)
    let score = 20; // Base score for non-empty text
    if (hasSituation) score += 25;
    if (hasAction) score += 30;
    if (hasResult) score += 25;
    if (detectedPassiveVerbs.length > 0) score -= 20;
    score = Math.max(10, Math.min(100, score));

    // Compile weaknesses & actionable tips
    const weaknesses: string[] = [];
    const actionableTips: string[] = [];

    if (detectedPassiveVerbs.length > 0) {
      weaknesses.push('Sử dụng động từ bị động/mơ hồ ("tham gia"), chưa làm rõ vai trò kỹ thuật trực tiếp.');
      actionableTips.push('Thay thế bằng các động từ kỹ thuật chủ động như: "Trực tiếp kiến trúc", "Xây dựng", "Tối ưu hóa", "Thiết kế".');
    }

    if (!hasResult) {
      weaknesses.push('Thiếu số liệu đo lường kỹ thuật hoặc kết quả kiểm chứng thực tế.');
      actionableTips.push('Bổ sung số liệu kỹ thuật tái hiện được (ví dụ: query latency đo bằng EXPLAIN ANALYZE, Lighthouse score, số unit test coverage, số lượng bản ghi test).');
    }

    if (!hasSituation) {
      weaknesses.push('Chưa nêu rõ bối cảnh bài toán hoặc độ phức tạp kỹ thuật của đồ án.');
      actionableTips.push('Bổ sung bối cảnh nghiệp vụ hoặc thách thức (ví dụ: lưu trữ realtime, dữ liệu lớn, bảo mật xác thực).');
    }

    const isStarCompliant = score >= 80 && hasAction && hasResult;

    return {
      statement: trimmed,
      isStarCompliant,
      score,
      hasSituation,
      hasAction,
      hasResult,
      detectedMetrics,
      detectedPassiveVerbs,
      weaknesses,
      actionableTips
    };
  },

  /**
   * Tạo 3 câu hỏi gợi mở khơi sâu trải nghiệm thực tế theo công thức STAR
   */
  generateElicitationQuestions(input: {
    projectName: string;
    technologies: string[];
    statement?: string;
  }): ElicitationQuestions {
    const techStr = (input.technologies && input.technologies.length > 0)
      ? input.technologies.slice(0, 3).join(', ')
      : 'công nghệ của dự án';

    const suggestedVerificationMethods = [
      'EXPLAIN ANALYZE (đo thời gian truy vấn DB trước/sau khi tối ưu)',
      'k6 / Apache Bench (đo throughput req/s và latency p95 dưới tải)',
      'Lighthouse / Bundle Analyzer (đo điểm hiệu năng web và dung lượng file bundle)',
      'Vitest / Jest Unit Tests (đo tỉ lệ code coverage và số test cases pass 100%)',
      'Mock Dataset Size (đo khả năng chịu tải trên 10k - 50k bản ghi mẫu giả lập)'
    ];

    return {
      projectName: input.projectName,
      technologies: input.technologies,
      situationQuestion: `Ở dự án "${input.projectName}", thách thức kỹ thuật hoặc bài toán phức tạp nhất bạn phải đối mặt là gì? (Ví dụ: dữ liệu tăng lớn, cần realtime, tối ưu query, hoặc xử lý bất đồng bộ?)`,
      actionQuestion: `Bạn trực tiếp chịu trách nhiệm phần nào bằng ${techStr}? Bạn đã chọn giải pháp kiến trúc hay giải thuật nào để giải quyết vấn đề trên?`,
      resultQuestion: `Làm sao để chứng minh code của bạn hoạt động tốt? Bạn đã đo lường bằng công cụ nào (EXPLAIN, k6, Lighthouse, Unit Tests) hoặc có bao nhiêu người thử nghiệm thực tế?`,
      suggestedVerificationMethods
    };
  },

  /**
   * Tổng hợp câu trả lời thành Bullet Point chuẩn STAR sắc bén kèm gợi ý bảo vệ phỏng vấn
   */
  assembleStarBullet(answers: ElicitationAnswers): AssembledStarResult {
    const techStr = (answers.technologies && answers.technologies.length > 0)
      ? answers.technologies.join(', ')
      : 'React, TypeScript';

    const sit = (answers.situationAnswer || '').trim();
    const act = (answers.actionAnswer || '').trim();
    const res = (answers.resultAnswer || '').trim();

    // Clean up passive keywords from action if any
    let cleanedAct = act;
    PASSIVE_VAGUE_VERBS.forEach(v => {
      const reg = new RegExp(`^(${v}|tôi ${v})\\s*`, 'i');
      cleanedAct = cleanedAct.replace(reg, '');
    });

    const starBullet = `Trực tiếp kiến trúc và phát triển giải pháp cho ${answers.projectName} bằng ${techStr}; ${cleanedAct}; ${res}.`;

    const interviewDefenseTip =
      `Gợi ý phỏng vấn với Tech Lead: Khi người phỏng vấn hỏi về kết quả "${res}", hãy tự tin giải thích công cụ bạn đã dùng để đo lường (như EXPLAIN ANALYZE trên DB local hoặc k6 test script trong repo) và giải thích tại sao bạn chọn kiến trúc ${techStr}.`;

    return {
      starBullet,
      situationPart: sit,
      actionPart: cleanedAct,
      resultPart: res,
      interviewDefenseTip
    };
  },

  /**
   * Bóc tách và chẩn đoán toàn bộ văn bản CV thô
   */
  diagnoseRawCvText(rawCvText: string): CvDiagnosticReport {
    if (!rawCvText || !rawCvText.trim()) {
      return {
        totalProjects: 0,
        averageScore: 0,
        projects: [],
        globalRecommendations: ['Vui lòng dán hoặc tải lên nội dung CV để bắt đầu phân tích.']
      };
    }

    const lines = rawCvText.split('\n').map(l => l.trim()).filter(Boolean);
    const projects: ProjectDiagnosticItem[] = [];

    let currentProjectName = '';
    let currentLines: string[] = [];
    let projCounter = 1;

    for (const line of lines) {
      const isProjectHeader = /(project|dự án|đồ án)\s*\d*[:\-]/i.test(line);
      if (isProjectHeader) {
        if (currentProjectName && currentLines.length > 0) {
          const combined = currentLines.join('. ');
          const diag = this.diagnoseStatement(combined);
          projects.push({
            id: `proj_diag_${projCounter++}`,
            projectName: currentProjectName,
            technologies: ['React', 'NodeJS'],
            originalLines: [...currentLines],
            diagnosis: diag
          });
          currentLines = [];
        }
        currentProjectName = line.replace(/^[•\-\*#\s]*(project|dự án|đồ án)\s*\d*[:\-]?\s*/i, '').trim() || `Dự án ${projCounter}`;
      } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        currentLines.push(line.replace(/^[•\-\*]\s*/, '').trim());
      } else if (currentProjectName) {
        currentLines.push(line);
      }
    }

    if (currentProjectName && currentLines.length > 0) {
      const combined = currentLines.join('. ');
      const diag = this.diagnoseStatement(combined);
      projects.push({
        id: `proj_diag_${projCounter++}`,
        projectName: currentProjectName,
        technologies: ['ExpressJS', 'PostgreSQL'],
        originalLines: [...currentLines],
        diagnosis: diag
      });
    }

    // Fallback if no project headers were detected: treat the entire text as 1 project
    if (projects.length === 0 && lines.length > 0) {
      const combined = lines.join('. ');
      const diag = this.diagnoseStatement(combined);
      projects.push({
        id: `proj_diag_1`,
        projectName: 'Đồ án Khởi đầu',
        technologies: ['TypeScript'],
        originalLines: lines,
        diagnosis: diag
      });
    }

    const totalScore = projects.reduce((acc, p) => acc + p.diagnosis.score, 0);
    const averageScore = projects.length > 0 ? Math.round(totalScore / projects.length) : 0;

    const globalRecommendations: string[] = [];
    if (averageScore < 70) {
      globalRecommendations.push('Các dự án còn thiếu số liệu kỹ thuật thực tế và bối cảnh bài toán.');
      globalRecommendations.push('Nên kích hoạt chế độ "Khai thác sâu bằng STAR" để bổ sung số đo đo lường được.');
    } else {
      globalRecommendations.push('Các dự án có cấu trúc tốt, sẵn sàng để đồng bộ trực tiếp vào CV Canvas.');
    }

    return {
      totalProjects: projects.length,
      averageScore,
      projects,
      globalRecommendations
    };
  }
};
