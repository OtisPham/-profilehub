import { supabase } from './supabase';
import type { Project, JobPost } from '../types/database';

export type InterviewStage =
  | 'stage_1_pitch'
  | 'stage_2_project_deepdive'
  | 'stage_3_incident_crisis'
  | 'stage_4_gap_defense';

export interface StageQuestion {
  id: string;
  stage: InterviewStage;
  stageNumber: 1 | 2 | 3 | 4;
  stageTitle: string;
  stageBadge: string;
  category: string;
  question: string;
  contextPrompt: string;
  keyPoints: string[];
  sampleAnswer: string;
  followUpProbe: {
    triggerKeywords: string[];
    probeQuestion: string;
    expectedClarification: string;
  };
}

export interface StageEvaluation {
  score: number; // 0 - 100
  grade: 'Xuất Sắc' | 'Tốt' | 'Khá' | 'Cần Cải Thiện';
  starBreakdown: {
    situationTask: number;
    actionTaken: number;
    resultMetrics: number;
  };
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
  needsFollowUp: boolean;
  followUpQuestion?: string;
}

export type CandidateLevel = 'Intern' | 'Fresher' | 'Junior' | 'Mid-Level' | 'Senior';

export type CalibrationDirection = 'UP_LEVEL' | 'LEVEL_CONFIRMED' | 'DOWN_LEVEL' | 'ROLE_PIVOT';

export interface LevelCalibrationResult {
  initialLevel: CandidateLevel;
  recommendedLevel: CandidateLevel;
  calibrationDirection: CalibrationDirection;
  directionLabel: string;
  directionColor: string;
  previousSalaryRange: { min: string; max: string; currency: string };
  suggestedSalaryRange: { min: string; max: string; currency: string };
  calibrationReasoning: string;
  keyStrengthsDemonstrated: string[];
  growthAreas: string[];
  recruiterOfferStrategy: string;
  recommendedActionPlan: string;
  suggestedRoles: string[];
}

export interface ComprehensiveInterviewReport {
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Improvement' | 'No Hire';
  verdictColor: string;
  radarScores: {
    coreTechnical: number;
    projectGrounding: number;
    crisisIncident: number;
    starCommunication: number;
    growthMindset: number;
  };
  levelCalibration: LevelCalibrationResult;
  stageResults: Array<{
    stage: InterviewStage;
    stageTitle: string;
    question: string;
    userAnswer: string;
    score: number;
    grade: string;
    strengths: string[];
    improvements: string[];
    benchmarkAnswer: string;
  }>;
  summaryConclusion: string;
  nextActionSteps: string[];
}

// Backward-compatibility aliases
export type TailoredQuestion = StageQuestion;
export type AIEvaluationResult = StageEvaluation;

/**
 * Fetch verified projects of a student
 */
export async function fetchVerifiedProjects(studentId: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('student_id', studentId);

    if (error || !data || data.length === 0) {
      // Fallback sample verified projects if DB is empty or fresh installation
      return [
        {
          id: 'p-verified-1',
          student_id: studentId,
          title: 'E-Commerce Platform SPA (Giao dịch thực tế)',
          description: 'Xây dựng web thương mại điện tử bằng React và TypeScript, tích hợp thanh toán VNPay và tối ưu hóa truy vấn giảm 35% thời gian phản hồi API, phục vụ 500+ sinh viên.',
          is_verified: true,
          verification_status: 'verified',
          tags: ['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'Zustand'],
          project_type: 'Đồ Án Chuyên Ngành',
          score: '9.5'
        },
        {
          id: 'p-verified-2',
          student_id: studentId,
          title: 'Hệ thống Quản lý Nhiệm vụ Real-time & CI/CD',
          description: 'Ứng dụng quản lý công việc thời gian thực tích hợp WebSocket, Docker, PostgreSQL và tự động hóa CI/CD pipeline.',
          is_verified: true,
          verification_status: 'verified',
          tags: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Socket.io'],
          project_type: 'Đồ Án Tốt Nghiệp',
          score: '9.0'
        }
      ];
    }

    return data
      .filter(p => p.is_verified || p.verification_status === 'verified')
      .map(p => ({ ...p, tags: p.tags || [] }));
  } catch (err) {
    console.error('Error fetching verified projects:', err);
    return [];
  }
}

/**
 * Fetch available job posts from recruiters
 */
export async function fetchRecruiterJobs(): Promise<JobPost[]> {
  try {
    const { data, error } = await supabase
      .from('recruiter_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [
        {
          id: 'j-sample-1',
          recruiter_id: 'rec-1',
          title: 'Frontend ReactJS / Next.js Engineer',
          department: 'Phát Triển Sản Phẩm Web',
          location: 'Hồ Chí Minh / Hybrid',
          required_skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'REST API', 'Docker'],
          description: 'Xây dựng giao diện web quy mô lớn, tối ưu hóa Web Vitals, SSR/ISR và tích hợp RESTful APIs.',
          status: 'active'
        },
        {
          id: 'j-sample-2',
          recruiter_id: 'rec-2',
          title: 'Backend Node.js & Distributed Systems',
          department: 'Kỹ Thuật Hạ Tầng',
          location: 'Hà Nội / Remote',
          required_skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Microservices'],
          description: 'Thiết kế API microservices chịu tải cao, tối ưu truy vấn Database và xây dựng hàng đợi xử lý tác vụ ngầm.',
          status: 'active'
        }
      ];
    }

    return data;
  } catch (err) {
    console.error('Error fetching recruiter jobs:', err);
    return [];
  }
}

/**
 * 🚀 AI 4-STAGE INTERVIEW SESSION GENERATOR (Framework v2.0)
 */
export function generate4StageInterviewSession(
  project?: Project,
  job?: JobPost,
  candidateSkills?: string[]
): StageQuestion[] {
  const pTitle = project?.title || 'E-Commerce Platform SPA';
  const pTags = project?.tags && project.tags.length > 0 ? project.tags.join(', ') : 'React, TypeScript, REST API';
  const jTitle = job?.title || 'Frontend ReactJS / Next.js Engineer';
  const jSkills = job?.required_skills || ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Docker'];

  // Find missing skills in candidate CV compared to JD
  const cSkillsLower = (candidateSkills || project?.tags || ['React', 'TypeScript', 'REST API']).map(s => s.toLowerCase());
  const missingSkills = jSkills.filter(js => !cSkillsLower.some(cs => cs.includes(js.toLowerCase()) || js.toLowerCase().includes(cs)));
  const targetGapSkill = missingSkills.length > 0 ? missingSkills[0] : (jSkills[jSkills.length - 1] || 'Docker & CI/CD');

  return [
    // 🟢 CHẶNG 1: KHỞI ĐỘNG & ĐỊNH VỊ NĂNG LỰC
    {
      id: `q-stage-1-${Date.now()}`,
      stage: 'stage_1_pitch',
      stageNumber: 1,
      stageTitle: 'Chặng 1: Khởi Động & Định Vị Năng Lực',
      stageBadge: '🎯 Elevator Pitch & Role Fit',
      category: 'Định Vị Bản Thân',
      question: `Chào bạn! Hãy giới thiệu ngắn gọn trong 60–90 giây về bản thân: Nền tảng kỹ thuật trọng tâm nhất của bạn là gì, và tại sao kinh nghiệm từ đồ án "${pTitle}" giúp bạn tự tin đảm nhận vị trí "${jTitle}" tại công ty chúng tôi?`,
      contextPrompt: 'Tập trung vào 3 phần: Quá khứ (Kỹ năng cốt lõi) ➔ Hiện tại (Thế mạnh thực chiến qua đồ án) ➔ Tương lai (Giá trị mang lại cho vị trí JD).',
      keyPoints: [
        'Tóm tắt chuyên môn cốt lõi (Core Stack)',
        'Liên kết đồ án verified với bài toán của JD',
        'Nêu rõ giá trị và định hướng đóng góp',
        'Trình bày tự tin, không đọc lại nguyên văn CV'
      ],
      sampleAnswer: `Tôi là kỹ sư phần mềm tập trung vào hệ sinh thái React và TypeScript. Trong đồ án "${pTitle}", tôi đã trực tiếp thiết kế kiến trúc component và tối ưu hóa luồng dữ liệu phục vụ hơn 500 người dùng. Nhận thấy công ty đang tìm kiếm vị trí "${jTitle}" với yêu cầu cao về hiệu năng và mã nguồn sạch, tôi tin rằng năng lực xử lý bất đồng bộ và tư duy kiến trúc module của mình sẽ giúp đẩy nhanh tiến độ sprint ngay trong tháng đầu tiên.`,
      followUpProbe: {
        triggerKeywords: ['nhiều công nghệ', 'biết hết', 'em làm được', 'học hỏi'],
        probeQuestion: `Bạn vừa nhắc đến việc có thể thích ứng nhanh, vậy đâu là 1 công nghệ hoặc công cụ duy nhất mà bạn tự tin hiểu sâu nhất về mặt nguyên lý hoạt động?`,
        expectedClarification: 'Cần chỉ ra 1 công nghệ trọng tâm và chứng minh hiểu sâu cơ chế bên dưới.'
      }
    },

    // 🔵 CHẶNG 2: ĐÀO SÂU ĐỒ ÁN & QUYẾT ĐỊNH KIẾN TRÚC
    {
      id: `q-stage-2-${Date.now()}`,
      stage: 'stage_2_project_deepdive',
      stageNumber: 2,
      stageTitle: 'Chặng 2: Đào Sâu Đồ Án & Quyết Định Kiến Trúc',
      stageBadge: '📐 Architecture Trade-offs & Metrics',
      category: 'Đào Sâu Kỹ Thuật Đồ Án',
      question: `Trong đồ án "${pTitle}" (sử dụng ${pTags}), hãy phân tích 1 quyết định kiến trúc quan trọng nhất mà bạn đã đưa ra (ví dụ: cách tổ chức State Management, phân tách Component/Service hoặc chiến lược kết nối API). Bạn đã phải chấp nhận đánh đổi (Trade-off) điều gì khi chọn giải pháp đó?`,
      contextPrompt: 'Không có giải pháp hoàn hảo, chỉ có giải pháp phù hợp với ngữ cảnh. Hãy làm rõ lý do chọn và nhược điểm chấp nhận.',
      keyPoints: [
        'Lý do lựa chọn giải pháp kỹ thuật cụ thể',
        'Phân tích Trade-off (Hiệu năng vs Độ phức tạp, Thời gian vs Khả năng mở rộng)',
        'Cách tổ chức thư mục & phân tách tầng trách nhiệm (Separation of Concerns)',
        'Chỉ số đo lường hoặc bài học rút ra'
      ],
      sampleAnswer: `Trong dự án "${pTitle}", tôi quyết định phân tách rõ ràng 3 tầng: Presentational Components, Custom Hooks cho Business Logic và API Service Layer độc lập. Về State, tôi chọn Zustand thay vì Redux Toolkit. Trade-off là tôi chấp nhận ít middleware có sẵn hơn để đổi lấy boilerplate code gọn nhẹ, giảm 40% dung lượng bundle và giúp các thành viên mới làm quen codebase trong 1 ngày mà không bị ngợp.`,
      followUpProbe: {
        triggerKeywords: ['caching', 'tối ưu', 'zustand', 'redux', 'context'],
        probeQuestion: `Khi dữ liệu người dùng thay đổi liên tục trên nhiều màn hình cùng lúc, bạn xử lý bài toán Cache Invalidation (đồng bộ dữ liệu cũ - mới) như thế nào để tránh hiển thị sai lệch?`,
        expectedClarification: 'Giải thích cơ chế invalidation (Revalidate on focus, Mutation trigger, hoặc WebSocket event).'
      }
    },

    // 🟠 CHẶNG 3: GIẢ LẬP SỰ CỐ & KHỦNG HOẢNG HỆ THỐNG
    {
      id: `q-stage-3-${Date.now()}`,
      stage: 'stage_3_incident_crisis',
      stageNumber: 3,
      stageTitle: 'Chặng 3: Giả Lập Sự Cố & Khủng Hoảng Hệ Thống',
      stageBadge: '🚨 Live Incident & Crash Recovery',
      category: 'Xử Lý Khủng Hoảng Kỹ Thuật',
      question: `Tình huống giả định: Vào lúc 12h trưa ngày chạy chiến dịch cao điểm, hệ thống ứng dụng "${jTitle}" gặp sự cố nghiêm trọng: Người dùng phản hồi liên tục bị xoay vòng (Spinner loading) và nhận lỗi HTTP 504 Gateway Timeout, Server CPU nhảy vọt lên 99%. Bạn có 15 phút để xử lý. Hãy nêu 3 bước đầu tiên bạn sẽ thực hiện để cô lập lỗi, giảm thiểu thiệt hại và phương án rollback an toàn?`,
      contextPrompt: 'Đánh giá tư duy bình tĩnh, quy trình phân tích log, cô lập nguyên nhân gốc rễ và bảo vệ dữ liệu khách hàng.',
      keyPoints: [
        'Bước 1: Giảm tải tức thì (Bật chế độ bảo trì nhẹ, Rate Limit hoặc kích hoạt Fallback Cache)',
        'Bước 2: Kiểm tra Telemetry/Logs (APM, Server error logs, Slow Query Logs, Network Waterfall)',
        'Bước 3: Cô lập nguyên nhân (Deadlock DB, Memory leak loop hay Third-party API hang)',
        'Quy trình Rollback bản build trước và gửi thông báo minh bạch cho đội ngũ'
      ],
      sampleAnswer: `Tôi sẽ hành động theo 3 bước: 
1. Cầm máu tức thì: Kích hoạt CDN Static Caching hoặc Fallback Response cho các API không trọng yếu để giảm áp lực tải về server, tránh sập hoàn toàn.
2. Cô lập điểm nghẽn: Kiểm tra Dashboard APM và Database Slow Queries để xác định xem lỗi đến từ Memory Leak ở code mới deploy hay cạn Connection Pool ở Database.
3. Nếu lỗi phát sinh do bản release mới: Thực hiện Instant Rollback về commit ổn định trước đó qua CI/CD trong 3 phút, sau đó tái hiện lỗi trên môi trường Staging để fix dứt điểm mà không làm gián đoạn Production.`,
      followUpProbe: {
        triggerKeywords: ['restart server', 'khởi động lại', 'tắt đi bật lại', 'xóa database'],
        probeQuestion: `Nếu restart server xong mà sau 2 phút CPU lại tiếp tục tăng vọt lên 99%, bạn sẽ dùng công cụ gì để chụp Heap Snapshot hoặc Profiling CPU ngay lúc crash?`,
        expectedClarification: 'Nêu công cụ cụ thể: Node.js inspect heapdump, Chrome DevTools Profiler, hoặc DB explain analyze.'
      }
    },

    // 🟣 CHẶNG 4: BÀO CHỮA LỖ HỔNG KỸ NĂNG SO VỚI JD
    {
      id: `q-stage-4-${Date.now()}`,
      stage: 'stage_4_gap_defense',
      stageNumber: 4,
      stageTitle: 'Chặng 4: Bào Chữa Lỗ Hổng Kỹ Năng So Với JD',
      stageBadge: '🛡️ Skill Gap Defense & Growth Mindset',
      category: 'Bảo Vệ Lỗ Hổng Kỹ Năng',
      question: `Trong JD vị trí "${jTitle}", công ty chúng tôi yêu cầu ứng viên cần có kỹ năng thực tế về: [${targetGapSkill}]. Tuy nhiên trong hồ sơ đồ án hiện tại của bạn chưa thể hiện rõ điều này. Nếu trúng tuyển, bạn sẽ chứng minh khả năng tự học và hoàn thành nhiệm vụ liên quan đến ${targetGapSkill} trong 2 tuần đầu tiên như thế nào?`,
      contextPrompt: 'Không giấu giếm hay nói dối. Hãy thể hiện Transferable Skills (kỹ năng tương đương), thái độ cầu tiến và kế hoạch hành động cụ thể.',
      keyPoints: [
        'Thành thật thừa nhận mức độ trải nghiệm hiện tại',
        'Nêu các kỹ năng nền tảng tương đương đã có (Transferable skills)',
        'Kế hoạch hành động 14 ngày (Đọc docs, làm mini-PoC, xin review từ Senior)',
        'Cam kết đóng góp và tinh thần tự chủ'
      ],
      sampleAnswer: `Tôi rất thẳng thắn rằng mình chưa có dự án Production lớn với ${targetGapSkill}. Tuy nhiên, tôi đã nắm rất vững kiến thức nền tảng tương đương về luồng kiến trúc và tư duy lập trình hệ thống. Kế hoạch 14 ngày của tôi là: 
- Tuần 1: Nghiên cứu kỹ Coding Convention và Architecture RFC hiện tại của công ty, xây dựng 1 Mini PoC áp dụng ${targetGapSkill} giải quyết 1 bài toán nhỏ.
- Tuần 2: Nhận 1 task phụ trong sprint, chủ động nhờ Senior/Mentor review và tối ưu mã nguồn theo đúng chuẩn doanh nghiệp. Tôi cam kết tự học nghiêm túc ngoài giờ để bắt kịp 100% yêu cầu dự án.`,
      followUpProbe: {
        triggerKeywords: ['em chưa biết', 'em chưa học', 'khó quá', 'không biết'],
        probeQuestion: `Nếu trong ngày đầu tiên bạn được giao 1 bug khẩn cấp liên quan đến ${targetGapSkill} mà tài liệu nội bộ chưa có, bạn sẽ tìm kiếm và xác minh độ tin cậy của giải pháp từ đâu?`,
        expectedClarification: 'Nêu phương pháp: Đọc Official Docs, GitHub Issues, Source code, hỏi đồng đội sau khi đã thử nghiệm.'
      }
    }
  ];
}

// Backward-compatibility wrapper
export function generateTailoredQuestions(project?: Project, job?: JobPost): StageQuestion[] {
  return generate4StageInterviewSession(project, job);
}

/**
 * Instant AI evaluation of student's answer using STAR methodology & Keyword checks
 */
export function evaluateStudentAnswer(
  question: StageQuestion,
  answerText: string,
  isFollowUp = false
): StageEvaluation {
  const text = answerText.trim().toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 12) {
    return {
      score: 35,
      grade: 'Cần Cải Thiện',
      starBreakdown: {
        situationTask: 30,
        actionTaken: 30,
        resultMetrics: 20
      },
      strengths: ['Đã ghi nhận câu trả lời bước đầu'],
      improvements: [
        'Câu trả lời quá ngắn (< 15 từ). Cần phân tích cụ thể bối cảnh, giải pháp kỹ thuật và kết quả đo lường.',
        'Thiếu các luận điểm kỹ thuật và ví dụ thực tế.'
      ],
      sampleAnswer: question.sampleAnswer,
      needsFollowUp: false,
    };
  }

  // Check matching keypoints
  let matchedPointsCount = 0;
  const strengths: string[] = [];
  const improvements: string[] = [];

  question.keyPoints.forEach(kp => {
    const keywords = kp.toLowerCase().split(/[ ,/()]+/).filter(k => k.length > 3);
    const match = keywords.some(kw => text.includes(kw));
    if (match) {
      matchedPointsCount++;
      strengths.push(`Trình bày tốt ý trọng tâm: "${kp}"`);
    } else {
      improvements.push(`Cần bổ sung làm rõ hơn về: "${kp}"`);
    }
  });

  // Check STAR signals
  const hasSituation = /trong dự án|khi làm|đồ án|bối cảnh|yêu cầu|tình huống|vào lúc/i.test(text);
  const hasAction = /tôi đã|chúng tôi|áp dụng|thiết kế|xử lý|tối ưu|triển khai|bằng cách|thực hiện/i.test(text);
  const hasResult = /kết quả|giảm|tăng|đạt|giúp|tiết kiệm|chỉ số|%|ms|s|người dùng|thành công/i.test(text);

  const sitScore = hasSituation ? 85 : 55;
  const actScore = hasAction ? 90 : 60;
  const resScore = hasResult ? 90 : 50;

  const keypointRatio = matchedPointsCount / Math.max(1, question.keyPoints.length);
  const rawScore = (keypointRatio * 45) + (sitScore * 0.15) + (actScore * 0.25) + (resScore * 0.15);
  const score = Math.min(98, Math.max(40, Math.round(rawScore)));

  let grade: StageEvaluation['grade'];
  if (score >= 85) grade = 'Xuất Sắc';
  else if (score >= 75) grade = 'Tốt';
  else if (score >= 60) grade = 'Khá';
  else grade = 'Cần Cải Thiện';

  if (strengths.length === 0) {
    strengths.push('Tác phong tự tin, cấu trúc diễn đạt mạch lạc');
  }

  // Check if AI needs to trigger follow-up probe
  let needsFollowUp = false;
  let followUpQuestion: string | undefined = undefined;

  if (!isFollowUp && question.followUpProbe) {
    const triggers = question.followUpProbe.triggerKeywords;
    const hasTrigger = triggers.some(t => text.includes(t));
    if (hasTrigger || wordCount < 35 || !hasResult) {
      needsFollowUp = true;
      followUpQuestion = question.followUpProbe.probeQuestion;
    }
  }

  return {
    score,
    grade,
    starBreakdown: {
      situationTask: sitScore,
      actionTaken: actScore,
      resultMetrics: resScore
    },
    strengths,
    improvements,
    sampleAnswer: question.sampleAnswer,
    needsFollowUp,
    followUpQuestion,
  };
}

const LEVEL_SALARY_MAP: Record<CandidateLevel, { min: string; max: string; currency: string }> = {
  Intern: { min: '4.000.000', max: '6.500.000', currency: 'VNĐ' },
  Fresher: { min: '8.000.000', max: '12.000.000', currency: 'VNĐ' },
  Junior: { min: '13.000.000', max: '19.000.000', currency: 'VNĐ' },
  'Mid-Level': { min: '20.000.000', max: '30.000.000', currency: 'VNĐ' },
  Senior: { min: '32.000.000', max: '48.000.000', currency: 'VNĐ' }
};

/**
 * 🎯 POST-INTERVIEW LEVELING & ADAPTIVE CALIBRATION ENGINE
 * Evaluates candidate's actual interview performance vs initial CV claimed level
 */
export function calculateLevelCalibration(
  initialLevel: CandidateLevel = 'Fresher',
  questions: StageQuestion[],
  evaluations: Record<string, StageEvaluation>,
  targetJob?: JobPost
): LevelCalibrationResult {
  const evalList = Object.values(evaluations);
  const overallScore = evalList.length > 0
    ? Math.round(evalList.reduce((sum, e) => sum + e.score, 0) / evalList.length)
    : 75;

  const stage1Score = evaluations[questions[0]?.id]?.score ?? 75;
  const stage2Score = evaluations[questions[1]?.id]?.score ?? 80; // Architecture & Trade-offs
  const stage3Score = evaluations[questions[2]?.id]?.score ?? 70; // Crisis & Live Incident
  const stage4Score = evaluations[questions[3]?.id]?.score ?? 75; // Gap defense

  let recommendedLevel: CandidateLevel = initialLevel;
  let calibrationDirection: CalibrationDirection = 'LEVEL_CONFIRMED';
  let directionLabel = 'Xác Nhận Đúng Cấp Bậc';
  let directionColor = '#2563eb';
  let calibrationReasoning = '';
  let recruiterOfferStrategy = '';
  let recommendedActionPlan = '';

  const keyStrengthsDemonstrated: string[] = [];
  const growthAreas: string[] = [];

  evalList.forEach(e => {
    e.strengths.slice(0, 2).forEach(s => {
      if (!keyStrengthsDemonstrated.includes(s)) keyStrengthsDemonstrated.push(s);
    });
    e.improvements.slice(0, 2).forEach(imp => {
      if (!growthAreas.includes(imp)) growthAreas.push(imp);
    });
  });

  // 1. UP-LEVEL LOGIC (Out-perform)
  if (
    (initialLevel === 'Intern' && overallScore >= 75) ||
    (initialLevel === 'Fresher' && overallScore >= 85 && stage2Score >= 80 && stage3Score >= 78) ||
    (initialLevel === 'Junior' && overallScore >= 88 && stage2Score >= 85 && stage3Score >= 85) ||
    (initialLevel === 'Mid-Level' && overallScore >= 92 && stage3Score >= 90)
  ) {
    calibrationDirection = 'UP_LEVEL';
    directionLabel = '🚀 Đôn Cấp Bậc Năng Lực (Up-Level Promotion)';
    directionColor = '#059669';

    if (initialLevel === 'Intern') {
      recommendedLevel = overallScore >= 88 ? 'Junior' : 'Fresher';
    } else if (initialLevel === 'Fresher') {
      recommendedLevel = overallScore >= 92 ? 'Mid-Level' : 'Junior';
    } else if (initialLevel === 'Junior') {
      recommendedLevel = 'Mid-Level';
    } else if (initialLevel === 'Mid-Level') {
      recommendedLevel = 'Senior';
    }

    calibrationReasoning = `Ứng viên đăng ký cấp bậc "${initialLevel}" nhưng thể hiện vượt trội ở Chặng 2 (${stage2Score}đ - Quyết định kiến trúc) và Chặng 3 (${stage3Score}đ - Xử lý sự cố sập hệ thống). Tư duy giải quyết vấn đề ngang tầm ${recommendedLevel}.`;
    recruiterOfferStrategy = `💡 Khuyến nghị Recruiter: Gửi Offer ở cấp bậc "${recommendedLevel}" kèm mức lương trần để thu hút ứng viên Fast-Track, tránh mất nhân tài tiềm năng vào tay đối thủ.`;
    recommendedActionPlan = `Giao ngay các task thiết kế module độc lập, phân công mentor hướng dẫn quy trình CI/CD production trong 2 tuần đầu.`;
  }
  // 2. DOWN-LEVEL LOGIC (Skill Gap / Safe Hiring)
  else if (
    (initialLevel === 'Senior' && overallScore < 72) ||
    (initialLevel === 'Mid-Level' && overallScore < 68) ||
    (initialLevel === 'Junior' && overallScore < 62) ||
    (initialLevel === 'Fresher' && overallScore < 48)
  ) {
    calibrationDirection = 'DOWN_LEVEL';
    directionLabel = '🛡️ Điều Chỉnh Cấp Bậc An Toàn & Kèm Cặp (Safe Down-Level)';
    directionColor = '#ea580c';

    if (initialLevel === 'Senior') recommendedLevel = 'Mid-Level';
    else if (initialLevel === 'Mid-Level') recommendedLevel = 'Junior';
    else if (initialLevel === 'Junior') recommendedLevel = 'Fresher';
    else if (initialLevel === 'Fresher') recommendedLevel = 'Intern';

    calibrationReasoning = `Ứng viên khai báo cấp bậc "${initialLevel}", tuy nhiên điểm phỏng vấn đạt ${overallScore}đ, còn lúng túng khi đối mặt với sự cố tải cao và thiếu các số liệu đo lường cụ thể.`;
    recruiterOfferStrategy = `💡 Khuyến nghị Recruiter: Không nên Reject hoàn toàn. Hãy đề xuất phương án tuyển dụng an toàn ở cấp bậc "${recommendedLevel}" có Senior kèm cặp 3 tháng thử việc để giảm rủi ro chi phí.`;
    recommendedActionPlan = `Yêu cầu hoàn thành 2 đồ án bổ trợ về xử lý sự cố database/caching trước khi xem xét nâng cấp bậc sau 6 tháng.`;
  }
  // 3. LEVEL CONFIRMED (Good Fit)
  else {
    calibrationDirection = 'LEVEL_CONFIRMED';
    directionLabel = '✅ Xác Nhận Đúng Cấp Bậc Mục Tiêu';
    directionColor = '#2563eb';
    recommendedLevel = initialLevel;

    calibrationReasoning = `Năng lực phỏng vấn (${overallScore}đ) phản ánh chính xác và đồng nhất với cấp bậc "${initialLevel}" đăng ký trong CV.`;
    recruiterOfferStrategy = `💡 Khuyến nghị Recruiter: Tiến hành Offer đúng dải lương tiêu chuẩn cho vị trí "${initialLevel}" theo thang lương công ty.`;
    recommendedActionPlan = `Theo sát lộ trình onboarding tiêu chuẩn của dự án trong 30 ngày đầu tiên.`;
  }

  const prevSalary = LEVEL_SALARY_MAP[initialLevel];
  const nextSalary = LEVEL_SALARY_MAP[recommendedLevel];

  const suggestedRoles = [
    `${targetJob?.title || 'Software Engineer'} (${recommendedLevel})`,
    recommendedLevel === 'Junior' || recommendedLevel === 'Mid-Level' ? 'Fullstack Web Engineer' : 'Frontend Engineer',
    'Technical Project Contributor'
  ];

  return {
    initialLevel,
    recommendedLevel,
    calibrationDirection,
    directionLabel,
    directionColor,
    previousSalaryRange: prevSalary,
    suggestedSalaryRange: nextSalary,
    calibrationReasoning,
    keyStrengthsDemonstrated: keyStrengthsDemonstrated.slice(0, 3),
    growthAreas: growthAreas.slice(0, 3),
    recruiterOfferStrategy,
    recommendedActionPlan,
    suggestedRoles
  };
}

/**
 * 📊 GENERATE COMPREHENSIVE 5-AXIS RADAR REPORT (Framework v2.0)
 */
export function generateFinalInterviewReport(
  questions: StageQuestion[],
  answers: Record<string, string>,
  evaluations: Record<string, StageEvaluation>,
  initialCandidateLevel: CandidateLevel = 'Fresher',
  targetJob?: JobPost
): ComprehensiveInterviewReport {
  const evalList = Object.values(evaluations);
  const avgScore = evalList.length > 0 
    ? Math.round(evalList.reduce((sum, e) => sum + e.score, 0) / evalList.length)
    : 75;

  // Compute 5 Radar Axes
  const stage1Score = evaluations[questions[0]?.id]?.score ?? 75;
  const stage2Score = evaluations[questions[1]?.id]?.score ?? 80;
  const stage3Score = evaluations[questions[2]?.id]?.score ?? 70;
  const stage4Score = evaluations[questions[3]?.id]?.score ?? 75;

  const coreTechnical = Math.round((stage2Score * 0.6) + (stage1Score * 0.4));
  const projectGrounding = stage2Score;
  const crisisIncident = stage3Score;
  const starCommunication = Math.round(
    evalList.reduce((sum, e) => sum + (e.starBreakdown.situationTask + e.starBreakdown.actionTaken + e.starBreakdown.resultMetrics) / 3, 0) / Math.max(1, evalList.length)
  );
  const growthMindset = stage4Score;

  let verdict: ComprehensiveInterviewReport['verdict'] = 'Leaning Hire';
  let verdictColor = '#eab308';
  let summaryConclusion = '';

  if (avgScore >= 88) {
    verdict = 'Strong Hire';
    verdictColor = '#059669';
    summaryConclusion = 'Ứng viên thể hiện phong độ xuất sắc, tư duy kiến trúc sắc sảo, số liệu đồ án trung thực và khả năng giải quyết sự cố bình tĩnh. Đủ tiêu chuẩn tuyển dụng ngay.';
  } else if (avgScore >= 78) {
    verdict = 'Hire';
    verdictColor = '#2563eb';
    summaryConclusion = 'Năng lực tốt, nắm chắc mã nguồn đồ án và có tư duy phản xạ ổn định trước các câu hỏi tình huống. Có thể onboard nhanh vào dự án.';
  } else if (avgScore >= 68) {
    verdict = 'Leaning Hire';
    verdictColor = '#d97706';
    summaryConclusion = 'Đạt yêu cầu cơ bản về kỹ năng, tuy nhiên cần củng cố thêm chiều sâu xử lý sự cố khủng hoảng và định lượng rõ hơn kết quả đạt được.';
  } else if (avgScore >= 50) {
    verdict = 'Needs Improvement';
    verdictColor = '#ea580c';
    summaryConclusion = 'Câu trả lời còn mang tính lý thuyết, chưa làm nổi bật được vai trò thực tế trong đồ án và lúng túng khi gặp sự cố hệ thống. Cần luyện tập thêm.';
  } else {
    verdict = 'No Hire';
    verdictColor = '#e11d48';
    summaryConclusion = 'Chưa đáp ứng được yêu cầu tối thiểu của vị trí. Cần ôn tập lại kiến thức nền tảng và trực tiếp tham gia hoàn thiện đồ án thực tế.';
  }

  const stageResults = questions.map(q => {
    const ev = evaluations[q.id] || { score: 70, grade: 'Khá', strengths: [], improvements: [], sampleAnswer: q.sampleAnswer };
    return {
      stage: q.stage,
      stageTitle: q.stageTitle,
      question: q.question,
      userAnswer: answers[q.id] || '(Chưa có câu trả lời)',
      score: ev.score,
      grade: ev.grade,
      strengths: ev.strengths,
      improvements: ev.improvements,
      benchmarkAnswer: q.sampleAnswer,
    };
  });

  const nextActionSteps = [
    'Rà soát lại toàn bộ câu trả lời mẫu chuẩn Senior (Benchmark Answers) của các chặng bị điểm thấp.',
    'Bổ sung số liệu đo lường cụ thể (Lighthouse score, response time ms, throughput) vào phần mô tả đồ án trong CV.',
    'Thực hành trả lời theo đúng cấu trúc STAR: Bối cảnh (S) ➔ Nhiệm vụ (T) ➔ Hành động chi tiết (A) ➔ Kết quả định lượng (R).',
  ];

  // Calculate Level Calibration
  const levelCalibration = calculateLevelCalibration(
    initialCandidateLevel,
    questions,
    evaluations,
    targetJob
  );

  return {
    overallScore: avgScore,
    verdict,
    verdictColor,
    radarScores: {
      coreTechnical,
      projectGrounding,
      crisisIncident,
      starCommunication,
      growthMindset,
    },
    levelCalibration,
    stageResults,
    summaryConclusion,
    nextActionSteps,
  };
}

