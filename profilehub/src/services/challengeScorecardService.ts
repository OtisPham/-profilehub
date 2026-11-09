import type {
  TakeHomeChallenge,
  ChallengeSubmission,
  ChallengeEvaluation,
  InterviewScorecard,
  ScorecardCriteriaScores,
  ScorecardRecommendation,
  CandidatePipelineItem
} from '../types/database';
import {
  getSharedPipeline,
  saveSharedPipeline,
  broadcastPipelineEvent,
  sendBrowserNotification
} from '../utils/pipelineSync';

export class ChallengeScorecardService {
  /**
   * Nhà tuyển dụng giao thử thách kỹ thuật cho ứng viên
   */
  public issueChallenge(params: {
    candidatePipelineId: string;
    recruiterId: string;
    studentId: string;
    jobId: string;
    title: string;
    description: string;
    requirements: string[];
    deadlineHours?: number;
  }): TakeHomeChallenge {
    const pipeline = getSharedPipeline();
    const candidate = pipeline.find(c => c.id === params.candidatePipelineId);
    if (!candidate) {
      throw new Error(`Không tìm thấy ứng viên trong pipeline với ID: ${params.candidatePipelineId}`);
    }

    const hours = params.deadlineHours || 48;
    const deadlineDate = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    const challenge: TakeHomeChallenge = {
      id: `chal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      candidatePipelineId: params.candidatePipelineId,
      recruiterId: params.recruiterId,
      studentId: params.studentId,
      jobId: params.jobId,
      title: params.title,
      description: params.description,
      requirements: params.requirements,
      deadlineHours: hours,
      deadlineDate,
      status: 'issued',
      createdAt: new Date().toISOString()
    };

    candidate.take_home_challenge = challenge;
    saveSharedPipeline(pipeline);

    // Bắn sự kiện đồng bộ thời gian thực
    broadcastPipelineEvent({
      type: 'CHALLENGE_ISSUED',
      studentId: params.studentId,
      studentName: candidate.student?.full_name,
      jobTitle: candidate.job?.title,
      challengeTitle: params.title,
      timestamp: Date.now()
    });

    sendBrowserNotification('ProfileHub - Thử thách kỹ thuật mới!', {
      body: `Bạn vừa nhận được thử thách "${params.title}" với hạn nộp ${hours} giờ.`,
      icon: '/favicon.ico'
    });

    return challenge;
  }

  /**
   * Sinh viên nộp bài giải thử thách kèm link GitHub Pull Request
   */
  public submitChallengeSolution(params: {
    candidatePipelineId: string;
    pullRequestUrl: string;
    demoUrl?: string;
    solutionNotes: string;
  }): TakeHomeChallenge | null {
    const pipeline = getSharedPipeline();
    const candidate = pipeline.find(c => c.id === params.candidatePipelineId);
    if (!candidate || !candidate.take_home_challenge) {
      return null;
    }

    const submission: ChallengeSubmission = {
      pullRequestUrl: params.pullRequestUrl.trim(),
      demoUrl: params.demoUrl?.trim(),
      solutionNotes: params.solutionNotes.trim(),
      submittedAt: new Date().toISOString()
    };

    candidate.take_home_challenge.submission = submission;
    candidate.take_home_challenge.status = 'submitted';
    saveSharedPipeline(pipeline);

    // Phát sự kiện thông báo cho Nhà tuyển dụng
    broadcastPipelineEvent({
      type: 'CHALLENGE_SUBMITTED',
      studentId: candidate.student_id,
      studentName: candidate.student?.full_name,
      jobTitle: candidate.job?.title,
      challengeTitle: candidate.take_home_challenge.title,
      timestamp: Date.now()
    });

    sendBrowserNotification('ProfileHub - Ứng viên đã nộp bài giải!', {
      body: `Ứng viên ${candidate.student?.full_name || 'Ứng viên'} đã nộp lời giải cho thử thách kỹ thuật.`,
      icon: '/favicon.ico'
    });

    return candidate.take_home_challenge;
  }

  /**
   * Nhà tuyển dụng chấm điểm và phản hồi bài giải thử thách
   */
  public evaluateChallenge(params: {
    candidatePipelineId: string;
    score: number;
    feedback: string;
    evaluatedBy: string;
  }): TakeHomeChallenge | null {
    const pipeline = getSharedPipeline();
    const candidate = pipeline.find(c => c.id === params.candidatePipelineId);
    if (!candidate || !candidate.take_home_challenge) {
      return null;
    }

    const evaluation: ChallengeEvaluation = {
      score: Math.max(0, Math.min(100, params.score)),
      feedback: params.feedback.trim(),
      evaluatedBy: params.evaluatedBy.trim(),
      evaluatedAt: new Date().toISOString()
    };

    candidate.take_home_challenge.evaluation = evaluation;
    candidate.take_home_challenge.status = 'evaluated';
    saveSharedPipeline(pipeline);

    return candidate.take_home_challenge;
  }

  /**
   * Người phỏng vấn gửi phiếu chấm điểm phỏng vấn (Interview Scorecard)
   */
  public submitScorecard(params: {
    candidatePipelineId: string;
    interviewerId: string;
    interviewerName: string;
    interviewerRole: string;
    scores: ScorecardCriteriaScores;
    recommendation: ScorecardRecommendation;
    strengths: string;
    improvementAreas: string;
  }): InterviewScorecard {
    const pipeline = getSharedPipeline();
    const candidate = pipeline.find(c => c.id === params.candidatePipelineId);
    if (!candidate) {
      throw new Error(`Không tìm thấy ứng viên với ID: ${params.candidatePipelineId}`);
    }

    // Tính điểm tổng kết theo thang 100
    const totalPoints = 
      params.scores.architecture +
      params.scores.codeDefense +
      params.scores.debugging +
      params.scores.communication +
      params.scores.cultureFit;
    const overallScore = Math.round((totalPoints / 25) * 100);

    const scorecard: InterviewScorecard = {
      id: `sc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      candidatePipelineId: params.candidatePipelineId,
      interviewerId: params.interviewerId,
      interviewerName: params.interviewerName,
      interviewerRole: params.interviewerRole,
      scores: params.scores,
      overallScore,
      recommendation: params.recommendation,
      strengths: params.strengths.trim(),
      improvementAreas: params.improvementAreas.trim(),
      submittedAt: new Date().toISOString()
    };

    if (!candidate.scorecards) {
      candidate.scorecards = [];
    }
    candidate.scorecards.push(scorecard);
    saveSharedPipeline(pipeline);

    // Bắn sự kiện đồng bộ
    broadcastPipelineEvent({
      type: 'SCORECARD_RECORDED',
      studentId: candidate.student_id,
      studentName: candidate.student?.full_name,
      jobTitle: candidate.job?.title,
      scorecardScore: overallScore,
      scorecardRecommendation: params.recommendation,
      timestamp: Date.now()
    });

    return scorecard;
  }

  /**
   * Tính toán điểm đồng thuận trung bình từ tất cả các Scorecards của ứng viên
   */
  public calculateConsensus(scorecards?: InterviewScorecard[]): {
    averageScore: number;
    recommendation: ScorecardRecommendation;
    totalInterviews: number;
  } {
    if (!scorecards || scorecards.length === 0) {
      return {
        averageScore: 0,
        recommendation: 'neutral',
        totalInterviews: 0
      };
    }

    const totalScore = scorecards.reduce((sum, sc) => sum + sc.overallScore, 0);
    const averageScore = Math.round(totalScore / scorecards.length);

    // Quyết định đồng thuận dựa trên điểm trung bình
    let recommendation: ScorecardRecommendation = 'neutral';
    if (averageScore >= 85) {
      recommendation = 'strong_hire';
    } else if (averageScore >= 70) {
      recommendation = 'hire';
    } else if (averageScore < 50) {
      recommendation = 'no_hire';
    }

    return {
      averageScore,
      recommendation,
      totalInterviews: scorecards.length
    };
  }

  /**
   * Sinh mã định danh ẩn danh bất biến cho ứng viên (Blind Screening Mode)
   */
  public getBlindCandidateInfo(studentId: string): {
    anonymousName: string;
    anonymousRole: string;
  } {
    let hash = 0;
    for (let i = 0; i < studentId.length; i++) {
      hash = (hash << 5) - hash + studentId.charCodeAt(i);
      hash |= 0;
    }
    const cleanHash = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
    return {
      anonymousName: `Ứng viên #DEV-${cleanHash}`,
      anonymousRole: 'Kỹ sư phần mềm tiềm năng'
    };
  }
}

export const challengeScorecardService = new ChallengeScorecardService();
