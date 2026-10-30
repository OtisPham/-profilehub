import { describe, it, expect } from 'vitest';
import { 
  generateInterviewSession, 
  evaluateAnswer, 
  compileInterviewReport 
} from './aiMockInterviewService';

describe('Tầng Phỏng Vấn AI Thực Chiến 4 Chặng (AI Mock Interview Seam)', () => {
  it('TC-INT-01: generateInterviewSession sinh đủ 4 chặng phỏng vấn với ngữ cảnh thực tế', () => {
    const session = generateInterviewSession('Nam', 'Fullstack Engineer', 'Microservices Platform', ['NestJS', 'PostgreSQL'], 'Docker');
    expect(session.length).toBe(4);
    expect(session[0].stage).toBe(1);
    expect(session[1].stage).toBe(2);
    expect(session[2].stage).toBe(3);
    expect(session[3].stage).toBe(4);

    expect(session[1].question).toContain('Microservices Platform');
    expect(session[2].question).toContain('Flash Sale');
    expect(session[3].question).toContain('Docker');
  });

  it('TC-INT-02: evaluateAnswer phát hiện số liệu định lượng và cộng điểm STAR', () => {
    const session = generateInterviewSession('Nam');
    const q2 = session[1];

    const answerWeak = 'Em tối ưu database bằng cách dùng cache.';
    const feedbackWeak = evaluateAnswer(q2, answerWeak);
    expect(feedbackWeak.score).toBeLessThan(75);
    expect(feedbackWeak.followUpProbing).toBeDefined();

    const answerStrong = 'Em đã dùng EXPLAIN ANALYZE trên PostgreSQL để tối ưu query, kết hợp Redis cache giảm latency từ 1200ms xuống còn 85ms với 5000 rps.';
    const feedbackStrong = evaluateAnswer(q2, answerStrong);
    expect(feedbackStrong.score).toBeGreaterThanOrEqual(85);
    expect(feedbackStrong.strengths.some(s => s.includes('định lượng'))).toBe(true);
  });

  it('TC-INT-03: compileInterviewReport tính toán Radar 5 trục và xếp hạng ứng viên', () => {
    const session = generateInterviewSession('Nam');
    const answer = 'Em phân tích log, dùng circuit breaker và rollback trong 2 phút khi CPU 99% đạt 99.9% uptime.';
    const mockFeedbacks = session.map(q => ({
      question: q,
      answer,
      feedback: evaluateAnswer(q, answer)
    }));

    const report = compileInterviewReport(mockFeedbacks);
    expect(report.overallScore).toBeGreaterThanOrEqual(75);
    expect(report.radarScores.technicalDepth).toBeGreaterThan(0);
    expect(report.radarScores.crisisSolving).toBeGreaterThan(0);
    expect(report.radarScores.starStructure).toBeGreaterThan(0);
    expect(report.keyRecommendations.length).toBeGreaterThanOrEqual(3);
  });
});
