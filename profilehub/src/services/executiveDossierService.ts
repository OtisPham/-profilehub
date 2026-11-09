import type { 
  CandidatePipelineItem, 
  ExecutiveEvaluationDossier, 
  DossierScorecardSummary, 
  DossierChallengeSummary, 
  DossierProjectHighlight 
} from '../types/database';
import { challengeScorecardService } from './challengeScorecardService';

export const executiveDossierService = {
  /**
   * Tổng hợp toàn diện dữ liệu ứng viên thành hồ sơ điều hành (Executive Dossier)
   */
  buildExecutiveDossier(
    candidate: CandidatePipelineItem,
    isBlind: boolean = false,
    companyName: string = 'Doanh nghiệp tuyển dụng ProfileHub'
  ): ExecutiveEvaluationDossier {
    const student = (candidate.student as any) || {};
    const blindInfo = challengeScorecardService.getBlindCandidateInfo(candidate.student_id || candidate.id);

    const candidateName = isBlind ? blindInfo.anonymousName : (student.full_name || 'Ứng viên tiềm năng');
    const candidateRole = isBlind ? blindInfo.anonymousRole : (student.major || 'Kỹ sư phần mềm');
    const university = isBlind ? 'Trường Đại học (Đã ẩn danh theo chính sách Blind Screening)' : (student.university || 'Đại học');
    const email = isBlind ? 'candidate-confidential@profilehub.edu.vn' : (student.email || 'candidate@profilehub.edu.vn');
    const phone = isBlind ? '090* *** ***' : (student.phone || '0901 234 567');

    // 1. Tổng hợp Scorecards
    const scorecards = candidate.scorecards || [];
    let avgArch = 0;
    let avgCodeDef = 0;
    let avgDebug = 0;
    let avgComm = 0;
    let avgCulture = 0;

    if (scorecards.length > 0) {
      avgArch = Math.round((scorecards.reduce((sum, s) => sum + s.scores.architecture, 0) / scorecards.length) * 10) / 10;
      avgCodeDef = Math.round((scorecards.reduce((sum, s) => sum + s.scores.codeDefense, 0) / scorecards.length) * 10) / 10;
      avgDebug = Math.round((scorecards.reduce((sum, s) => sum + s.scores.debugging, 0) / scorecards.length) * 10) / 10;
      avgComm = Math.round((scorecards.reduce((sum, s) => sum + s.scores.communication, 0) / scorecards.length) * 10) / 10;
      avgCulture = Math.round((scorecards.reduce((sum, s) => sum + s.scores.cultureFit, 0) / scorecards.length) * 10) / 10;
    }

    const consensus = challengeScorecardService.calculateConsensus(scorecards);

    const scorecardSummary: DossierScorecardSummary = {
      consensusScore: consensus.averageScore,
      recommendation: consensus.recommendation,
      totalInterviews: consensus.totalInterviews,
      averageCriteria: {
        architecture: avgArch || 4.0,
        codeDefense: avgCodeDef || 4.0,
        debugging: avgDebug || 4.0,
        communication: avgComm || 4.0,
        cultureFit: avgCulture || 4.0
      },
      interviews: scorecards.map(sc => ({
        interviewerName: sc.interviewerName,
        interviewerRole: sc.interviewerRole,
        overallScore: sc.overallScore,
        recommendation: sc.recommendation,
        strengths: sc.strengths,
        improvementAreas: sc.improvementAreas,
        submittedAt: sc.submittedAt
      }))
    };

    // 2. Tổng hợp Thử Thách Kỹ Thuật (Take-Home Challenge)
    let challengeSummary: DossierChallengeSummary | undefined = undefined;
    if (candidate.take_home_challenge) {
      const ch = candidate.take_home_challenge;
      challengeSummary = {
        title: ch.title,
        deadlineHours: ch.deadlineHours,
        status: ch.status,
        pullRequestUrl: ch.submission?.pullRequestUrl,
        demoUrl: ch.submission?.demoUrl,
        solutionNotes: ch.submission?.solutionNotes,
        evaluationScore: ch.evaluation?.score,
        evaluationFeedback: ch.evaluation?.feedback,
        submittedAt: ch.submission?.submittedAt
      };
    }

    // 3. Tổng hợp Đồ Án Bảo Chứng (Verified Projects)
    const rawProjects = student.projects || [];
    const verifiedProjects: DossierProjectHighlight[] = rawProjects.map((p: any) => ({
      id: p.id || String(Math.random()),
      title: p.title || 'Đồ án công nghệ',
      description: p.description,
      githubUrl: p.github_url,
      demoUrl: p.demo_url,
      isVerified: Boolean(p.is_verified || p.verification_status === 'verified'),
      score: p.score || '9.0/10',
      instructor: p.instructor || 'Giảng viên chuyên môn'
    }));

    // 4. Xác định Khuyến Nghị Điều Hành (Executive Recommendation)
    let executiveRecommendation: 'STRONG_HIRE' | 'HIRE' | 'CONSIDER' | 'DECLINE' = 'CONSIDER';
    const finalScore = scorecardSummary.consensusScore || (challengeSummary?.evaluationScore || 75);

    if (finalScore >= 85) {
      executiveRecommendation = 'STRONG_HIRE';
    } else if (finalScore >= 70) {
      executiveRecommendation = 'HIRE';
    } else if (finalScore < 50) {
      executiveRecommendation = 'DECLINE';
    } else {
      executiveRecommendation = 'CONSIDER';
    }

    // 5. Tổng hợp Điểm Mạnh & Rủi Ro Cần Lưu Ý
    const keyStrengths: string[] = [];
    const keyRisks: string[] = [];

    if (scorecardSummary.averageCriteria.codeDefense >= 4.0) {
      keyStrengths.push('Bảo vệ đồ án và phản biện kiến trúc mã nguồn xuất sắc.');
    }
    if (scorecardSummary.averageCriteria.debugging >= 4.0) {
      keyStrengths.push('Khả năng gỡ lỗi và phản xạ tình huống kỹ thuật nhanh nhạy.');
    }
    if (verifiedProjects.some(p => p.isVerified)) {
      keyStrengths.push(`Có ${verifiedProjects.filter(p => p.isVerified).length} đồ án thực tế được Giảng viên bảo chứng chất lượng.`);
    }
    if (challengeSummary?.status === 'submitted' || challengeSummary?.status === 'evaluated') {
      keyStrengths.push('Hoàn thành bài giải thử thách kỹ thuật đúng hạn với link GitHub PR minh bạch.');
    }
    if (keyStrengths.length === 0) {
      keyStrengths.push('Kỹ năng lập trình nền tảng đáp ứng yêu cầu vị trí tuyển dụng.');
    }

    // Rủi ro / Điểm cần đào tạo thêm
    if (scorecardSummary.averageCriteria.architecture < 3.5) {
      keyRisks.push('Cần bổ sung kiến thức về thiết kế hệ thống lớn và mẫu thiết kế Design Patterns.');
    }
    if (scorecardSummary.averageCriteria.communication < 3.5) {
      keyRisks.push('Kỹ năng thuyết trình giải pháp kỹ thuật cần được mentor rèn luyện thêm.');
    }
    if (!challengeSummary || challengeSummary.status === 'issued') {
      keyRisks.push('Chưa hoàn tất thử thách kỹ thuật Take-Home; khuyến nghị kiểm tra thêm khi thử việc.');
    }
    if (keyRisks.length === 0) {
      keyRisks.push('Chưa ghi nhận rủi ro chuyên môn đáng kể.');
    }

    // Gợi ý dải lương thị trường
    let recommendedSalaryRange = '8.000.000 - 12.000.000 VND';
    if (executiveRecommendation === 'STRONG_HIRE') {
      recommendedSalaryRange = '12.000.000 - 16.000.000 VND';
    } else if (executiveRecommendation === 'HIRE') {
      recommendedSalaryRange = '10.000.000 - 13.000.000 VND';
    }

    return {
      candidateId: candidate.id,
      candidateName,
      candidateRole,
      university,
      gpa: student.gpa || '3.5/4.0',
      email,
      phone,
      appliedDate: new Date(candidate.created_at || Date.now()).toLocaleDateString('vi-VN'),
      isBlindMode: isBlind,
      jobTitle: candidate.job?.title || 'Kỹ sư phần mềm Fresher / Junior',
      companyName,
      scorecardSummary,
      challengeSummary,
      verifiedProjects,
      privateNotes: candidate.private_notes,
      executiveRecommendation,
      keyStrengths,
      keyRisks,
      recommendedSalaryRange,
      generatedAt: new Date().toISOString()
    };
  },

  /**
   * Tạo văn bản Markdown/Text tóm tắt hồ sơ để copy nhanh gửi qua Email hoặc Slack
   */
  generateExecutiveEmailSummary(dossier: ExecutiveEvaluationDossier): string {
    return `📌 [BÁO CÁO PHỎNG VẤN ĐIỀU HÀNH] - ${dossier.candidateName}
-----------------------------------------------------------
Vị trí ứng tuyển: ${dossier.jobTitle}
Doanh nghiệp: ${dossier.companyName}
Khuyến nghị tuyển dụng: [${dossier.executiveRecommendation}]
Điểm đồng thuận phỏng vấn: ${dossier.scorecardSummary.consensusScore}/100 (${dossier.scorecardSummary.totalInterviews} lượt đánh giá)

⭐️ ĐÁNH GIÁ 5 TIÊU CHÍ VÀNG:
- Kiến trúc phần mềm: ${dossier.scorecardSummary.averageCriteria.architecture}/5.0
- Bảo vệ mã nguồn: ${dossier.scorecardSummary.averageCriteria.codeDefense}/5.0
- Gỡ lỗi & Giải thuật: ${dossier.scorecardSummary.averageCriteria.debugging}/5.0
- Kỹ năng giao tiếp: ${dossier.scorecardSummary.averageCriteria.communication}/5.0
- Văn hóa & Thái độ: ${dossier.scorecardSummary.averageCriteria.cultureFit}/5.0

🎯 THỬ THÁCH GẮN ĐỒ ÁN (TAKE-HOME):
${dossier.challengeSummary ? `- Bài toán: ${dossier.challengeSummary.title}
- Trạng thái: ${dossier.challengeSummary.status === 'submitted' || dossier.challengeSummary.status === 'evaluated' ? 'Đã nộp PR' : 'Đang thực hiện'}
- Link GitHub PR: ${dossier.challengeSummary.pullRequestUrl || 'Chưa cung cấp'}` : '- Chưa giao thử thách kỹ thuật.'}

💡 ĐIỂM MẠNH NỔI BẬT:
${dossier.keyStrengths.map(s => `- ${s}`).join('\n')}

⚠️ ĐIỂM CẦN LƯU Ý & ĐÀO TẠO:
${dossier.keyRisks.map(r => `- ${r}`).join('\n')}

💰 ĐỀ XUẤT LƯƠNG KHỞI ĐIỂM: ${dossier.recommendedSalaryRange}
-----------------------------------------------------------
Hồ sơ được trích xuất tự động từ ProfileHub Talent Acquisition System.`;
  }
};
