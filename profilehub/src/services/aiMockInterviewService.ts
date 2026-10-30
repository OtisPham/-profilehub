export type InterviewStageNumber = 1 | 2 | 3 | 4;

export interface InterviewQuestion {
  id: string;
  stage: InterviewStageNumber;
  stageTitle: string;
  question: string;
  contextHint: string;
  sampleSeniorAnswer: string;
  evaluationCriteria: string[];
}

export interface RadarScoreRecord {
  technicalDepth: number;     // 0 - 100: Độ sâu kỹ thuật & kiến trúc
  projectGrounding: number;   // 0 - 100: Tính xác thực & thực chiến đồ án
  crisisSolving: number;      // 0 - 100: Tư duy xử lý sự cố & khủng hoảng
  starStructure: number;      // 0 - 100: Cấu trúc diễn đạt chuẩn STAR
  growthMindset: number;      // 0 - 100: Tố chất học hỏi & văn hóa
}

export interface InterviewAnswerFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  followUpProbing?: string; // Câu hỏi vặn nếu trả lời còn mơ hồ
  radarContribution: Partial<RadarScoreRecord>;
}

export interface InterviewFinalReport {
  overallScore: number;
  rating: 'STRONG_HIRE' | 'HIRE' | 'LEANING_HIRE' | 'NEEDS_IMPROVEMENT' | 'NO_HIRE';
  ratingLabel: string;
  radarScores: RadarScoreRecord;
  executiveSummary: string;
  keyRecommendations: string[];
}

/**
 * Sinh danh sách 4 câu hỏi thực chiến 4 chặng dựa trên đồ án thực tế và JD
 */
export function generateInterviewSession(
  candidateName: string,
  roleTitle: string = 'Kỹ Sư Phần Mềm',
  projectName: string = 'E-Commerce Platform',
  techStack: string[] = ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  jdMissingSkill: string = 'Kubernetes & CI/CD',
  companyName?: string
): InterviewQuestion[] {
  const mainTech = techStack[0] || 'React';
  const dbTech = techStack.find(t => ['postgresql', 'mysql', 'mongodb', 'redis'].includes(t.toLowerCase())) || 'PostgreSQL';
  const companyPrefix = companyName ? `tại ${companyName}` : '';
  const companyCulture = companyName ? `văn hóa làm việc của ${companyName}` : 'quý công ty';

  return [
    {
      id: 'stage_1',
      stage: 1,
      stageTitle: 'CHẶNG 1: KHỞI ĐỘNG & ĐỊNH VỊ (Elevator Pitch)',
      question: `Chào ${candidateName || 'bạn'}, chào mừng bạn đến với buổi phỏng vấn ${companyPrefix} cho vị trí ${roleTitle}. Hãy giới thiệu ngắn gọn trong 60-90 giây về bản thân, điểm mạnh kỹ thuật nổi bật nhất và lý do phong cách làm việc của bạn phù hợp với ${companyCulture}?`,
      contextHint: 'Cấu trúc khuyến nghị: Quá khứ (Nền tảng) ➔ Hiện tại (Thế mạnh cốt lõi) ➔ Tương lai (Đóng góp cho công ty). Tránh đọc lại nguyên văn CV.',
      sampleSeniorAnswer: `Chào anh/chị, em là kỹ sư tập trung vào ${mainTech} và kiến trúc hệ thống. Điểm mạnh lớn nhất của em là tư duy tối ưu hóa hiệu năng và đã có kinh nghiệm thực chiến bóc tách đồ án ${projectName} phục vụ hàng ngàn người dùng. Em nhận thấy phong cách phát triển sản phẩm thực chiến của ${companyName || 'quý công ty'} rất khớp với tôn chỉ làm việc dựa trên kết quả định lượng của em.`,
      evaluationCriteria: [
        'Cấu trúc mạch lạc, tự tin',
        'Nêu bật được giá trị khác biệt',
        'Thời lượng súc tích (60-90s)'
      ]
    },
    {
      id: 'stage_2',
      stage: 2,
      stageTitle: 'CHẶNG 2: ĐÀO SÂU ĐỒ ÁN & KIẾN TRÚC (Deep-Dive & STAR)',
      question: `Trong đồ án "${projectName}", bạn đã đưa ra quyết định kỹ thuật nào khó khăn nhất khi chọn ${mainTech} và ${dbTech}? Bạn đã dùng công cụ gì để đo lường số liệu tối ưu (Profiling, APM) và bottleneck cụ thể nằm ở đâu?`,
      contextHint: 'Nêu rõ bài toán, đánh đổi (trade-offs), chỉ số P99/RPS đo được bằng công cụ cụ thể (như JMeter, Lighthouse, Explain Analyze).',
      sampleSeniorAnswer: `Trong dự án ${projectName}, nút thắt lớn nhất nằm ở thời gian phản hồi API khi lượng truy vấn đọc tăng cao. Em đã dùng EXPLAIN ANALYZE trên ${dbTech} để phát hiện Sequential Scan trên bảng đơn hàng, sau đó đánh Compound Index kết hợp tầng Cache Redis, giúp giảm P99 từ 1,200ms xuống còn 85ms với 99.9% uptime.`,
      evaluationCriteria: [
        'Hiểu bản chất công nghệ, phân tích trade-offs',
        'Có công cụ đo lường số liệu thực tế (Anti-hallucination)',
        'Diễn đạt theo mô hình STAR (Situation - Task - Action - Result)'
      ]
    },
    {
      id: 'stage_3',
      stage: 3,
      stageTitle: 'CHẶNG 3: GIẢ LẬP KHỦNG HOẢNG & SỰ CỐ (Live Incident Simulation)',
      question: `Vào lúc 12h trưa ngày Flash Sale, hệ thống ghi nhận CPU chạm ngưỡng 99%, Database connection pool bị cạn kiệt và API bắt đầu trả về lỗi 504 Gateway Timeout. Bạn có 15 phút để xử lý. Hãy nêu 3 bước đầu tiên bạn sẽ thực hiện để cô lập lỗi và phương án rollback an toàn?`,
      contextHint: 'Quy trình chuẩn SRE/Dev: 1. Giảm tải (Rate limiting / Bật maintenance banner) 2. Kiểm tra log & cô lập query treo 3. Scale-out hoặc Rollback phiên bản ổn định.',
      sampleSeniorAnswer: `Bước 1: Em lập tức kích hoạt Circuit Breaker và giới hạn Rate Limiting để bảo vệ database không bị sập hoàn toàn. Bước 2: Truy cập dashboard APM/CloudWatch để kiểm tra Slow Queries hoặc Long-running transactions đang chiếm giữ lock và kill connections. Bước 3: Nếu lỗi do release mới, em kích hoạt Blue-Green Rollback về artifact ổn định trước đó trong vòng 2 phút.`,
      evaluationCriteria: [
        'Tư duy bình tĩnh dưới áp lực cao',
        'Thứ tự ưu tiên: Bảo vệ hệ thống trước ➔ Điều tra nguyên nhân sau',
        'Có kế hoạch rollback rõ ràng'
      ]
    },
    {
      id: 'stage_4',
      stage: 4,
      stageTitle: 'CHẶNG 4: BÀO CHỮA LỖ HỔNG KỸ NĂNG (Skill Gap Defense)',
      question: `Bản mô tả công việc ${companyName ? `tại ${companyName} ` : ''}yêu cầu thành thạo "${jdMissingSkill}", nhưng trong hồ sơ của bạn chưa có đồ án nào áp dụng thực tế kỹ năng này. Nếu được nhận vào dự án, bạn sẽ lên lộ trình tự học và chứng minh năng lực này trong 2 tuần đầu tiên như thế nào?`,
      contextHint: 'Thái độ trung thực + Kỹ năng chuyển giao tương đương (Transferable skills) + Lộ trình hành động cụ thể có mốc thời gian (Actionable roadmap).',
      sampleSeniorAnswer: `Em rất thẳng thắn rằng em chưa trực tiếp deploy ${jdMissingSkill} trên production lớn. Tuy nhiên, em đã nắm vững nền tảng containerization với Docker và kiến trúc mạng microservices. Trong tuần đầu tiên, em sẽ dựng một cụm K8s mini trên Minikube để migrate đồ án ${projectName}, viết manifest YAML và thiết lập Helm chart; sang tuần thứ 2 em cam kết sẽ tự tin nhận các ticket triển khai CI/CD cơ bản từ team.`,
      evaluationCriteria: [
        'Trung thực, không nói dối hay chém gió',
        'Khả năng liên hệ kiến thức tương đương',
        'Lộ trình hành động cụ thể, tư duy cầu tiến (Growth Mindset)'
      ]
    }
  ];
}

/**
 * Đánh giá câu trả lời của ứng viên theo barem chấm điểm chuyên sâu
 */
export function evaluateAnswer(
  question: InterviewQuestion,
  answer: string
): InterviewAnswerFeedback {
  const text = (answer || '').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount < 10) {
    return {
      score: 40,
      strengths: ['Đã đưa ra phản hồi'],
      improvements: ['Câu trả lời quá ngắn, chưa thể hiện được năng lực thực tế.'],
      followUpProbing: 'Bạn có thể chia sẻ chi tiết hơn với ví dụ cụ thể trong một dự án bạn đã từng làm không?',
      radarContribution: { technicalDepth: 35, starStructure: 35 }
    };
  }

  const strengths: string[] = [];
  const improvements: string[] = [];
  let score = 70;
  let followUpProbing: string | undefined = undefined;

  // Kiểm tra số liệu định lượng (% hoặc ms hoặc RPS hoặc con số)
  const hasNumbers = /\d+%|\d+\s*(ms|s|req|rps|users|người)/i.test(text);
  if (hasNumbers) {
    score += 15;
    strengths.push('Có số liệu định lượng đo lường thực tế (Anti-hallucination)');
  } else {
    improvements.push('Nên bổ sung chỉ số đo lường cụ thể (ví dụ: latency giảm bao nhiêu ms, chịu tải bao nhiêu RPS)');
  }

  // Kiểm tra từ khóa kỹ thuật chuyên môn
  const techKeywords = ['api', 'index', 'cache', 'redis', 'database', 'profiler', 'rollback', 'query', 'scale', 'docker', 'circuit breaker'];
  const matchedKeywords = techKeywords.filter(k => text.toLowerCase().includes(k));
  if (matchedKeywords.length >= 2) {
    score += 10;
    strengths.push(`Sử dụng chính xác thuật ngữ kỹ thuật chuyên sâu (${matchedKeywords.slice(0, 3).join(', ')})`);
  }

  // Đánh giá theo từng chặng
  if (question.stage === 2 && !text.toLowerCase().includes('đo') && !text.toLowerCase().includes('công cụ')) {
    followUpProbing = 'Cụ thể bạn dùng công cụ gì (Lighthouse, Datadog hay EXPLAIN) để phát hiện ra điểm nghẽn này?';
  } else if (question.stage === 3 && !text.toLowerCase().includes('rollback')) {
    improvements.push('Cần bổ sung phương án Rollback để đảm bảo an toàn tuyệt đối cho người dùng.');
  }

  const finalScore = Math.min(95, Math.max(45, score));

  return {
    score: finalScore,
    strengths: strengths.length > 0 ? strengths : ['Ý tưởng trả lời đúng trọng tâm câu hỏi.'],
    improvements: improvements.length > 0 ? improvements : ['Rất tốt! Giữ vững phong độ tự tin này khi vào phỏng vấn thật.'],
    followUpProbing,
    radarContribution: {
      technicalDepth: finalScore,
      projectGrounding: hasNumbers ? finalScore + 5 : finalScore - 10,
      crisisSolving: question.stage === 3 ? finalScore : 80,
      starStructure: hasNumbers ? 85 : 70,
      growthMindset: question.stage === 4 ? finalScore : 85
    }
  };
}

/**
 * Tổng hợp toàn bộ kết quả 4 chặng để xuất Báo Cáo Phỏng Vấn Toàn Diện
 */
export function compileInterviewReport(
  feedbacks: { question: InterviewQuestion; answer: string; feedback: InterviewAnswerFeedback }[]
): InterviewFinalReport {
  if (feedbacks.length === 0) {
    return {
      overallScore: 75,
      rating: 'HIRE',
      ratingLabel: 'Hire (Sẵn sàng tuyển dụng)',
      radarScores: {
        technicalDepth: 75,
        projectGrounding: 80,
        crisisSolving: 70,
        starStructure: 75,
        growthMindset: 80
      },
      executiveSummary: 'Ứng viên nắm vững kiến thức cơ bản và có kinh nghiệm thực tế tốt.',
      keyRecommendations: ['Tập dượt thêm các kịch bản xử lý sự cố hạ tầng lớn.']
    };
  }

  const avgScore = Math.round(
    feedbacks.reduce((acc, f) => acc + f.feedback.score, 0) / feedbacks.length
  );

  let rating: InterviewFinalReport['rating'] = 'HIRE';
  let ratingLabel = 'Hire (Đạt yêu cầu tuyển dụng)';

  if (avgScore >= 88) {
    rating = 'STRONG_HIRE';
    ratingLabel = 'Strong Hire (Ứng viên xuất sắc - Tư duy Senior)';
  } else if (avgScore >= 78) {
    rating = 'HIRE';
    ratingLabel = 'Hire (Năng lực vững vàng, Onboard nhanh)';
  } else if (avgScore >= 68) {
    rating = 'LEANING_HIRE';
    ratingLabel = 'Leaning Hire (Đạt chuẩn cơ bản, cần rèn luyện thêm)';
  } else {
    rating = 'NEEDS_IMPROVEMENT';
    ratingLabel = 'Needs Improvement (Cần luyện tập thêm về kiến trúc & số liệu)';
  }

  const radarScores: RadarScoreRecord = {
    technicalDepth: Math.round(feedbacks.reduce((acc, f) => acc + (f.feedback.radarContribution.technicalDepth || 75), 0) / feedbacks.length),
    projectGrounding: Math.round(feedbacks.reduce((acc, f) => acc + (f.feedback.radarContribution.projectGrounding || 75), 0) / feedbacks.length),
    crisisSolving: Math.round(feedbacks.reduce((acc, f) => acc + (f.feedback.radarContribution.crisisSolving || 75), 0) / feedbacks.length),
    starStructure: Math.round(feedbacks.reduce((acc, f) => acc + (f.feedback.radarContribution.starStructure || 75), 0) / feedbacks.length),
    growthMindset: Math.round(feedbacks.reduce((acc, f) => acc + (f.feedback.radarContribution.growthMindset || 80), 0) / feedbacks.length)
  };

  const keyRecommendations: string[] = [
    'Luôn chủ động nêu số liệu đo lường cụ thể (ms, RPS, %) ngay từ câu trả lời đầu tiên.',
    'Khi gặp sự cố hệ thống, ưu tiên cô lập lỗi và bảo vệ người dùng trước khi tìm nguyên nhân gốc.',
    'Tự tin bảo vệ kỹ năng còn thiếu bằng thái độ trung thực và kế hoạch tự học trong 2 tuần.'
  ];

  return {
    overallScore: avgScore,
    rating,
    ratingLabel,
    radarScores,
    executiveSummary: `Ứng viên đạt kết quả ${avgScore}/100 với mức xếp loại [${ratingLabel}]. Năng lực nổi trội ở việc bảo vệ đồ án thực tế và kỹ năng diễn đạt cấu trúc STAR.`,
    keyRecommendations
  };
}
