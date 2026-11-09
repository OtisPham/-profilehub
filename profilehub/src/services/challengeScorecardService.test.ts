import { describe, it, expect, beforeEach, vi } from 'vitest';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

const mockStorage = new LocalStorageMock();
vi.stubGlobal('localStorage', mockStorage);

class MockNotification {
  static permission = 'granted';
  static requestPermission = vi.fn().mockResolvedValue('granted');
  constructor(public title: string, public options?: any) {}
}

const eventTarget = new EventTarget();
vi.stubGlobal('window', {
  location: { origin: 'http://localhost:5173' },
  addEventListener: eventTarget.addEventListener.bind(eventTarget),
  removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
  dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
  Notification: MockNotification
});

import { challengeScorecardService } from './challengeScorecardService';
import { saveSharedPipeline } from '../utils/pipelineSync';
import type { CandidatePipelineItem } from '../types/database';

describe('ChallengeScorecardService - Thử Thách Kỹ Thuật & Scorecard Phỏng Vấn', () => {
  const mockCandidate: CandidatePipelineItem = {
    id: 'pipe_item_001',
    recruiter_id: 'rec_123',
    student_id: 'stu_456',
    job_id: 'job_789',
    stage: 'shortlisted',
    created_at: new Date().toISOString(),
    student: {
      id: 'stu_456',
      full_name: 'Phạm Minh Quân',
      university: 'Đại Học Bách Khoa',
      skills: ['React', 'Node.js']
    } as any,
    job: {
      id: 'job_789',
      title: 'Backend Engineer'
    } as any
  };

  beforeEach(() => {
    mockStorage.clear();
    saveSharedPipeline([mockCandidate]);
  });

  it('TC-CHAL-01: Giao thử thách kỹ thuật thành công và gắn vào candidate item', () => {
    const challenge = challengeScorecardService.issueChallenge({
      candidatePipelineId: 'pipe_item_001',
      recruiterId: 'rec_123',
      studentId: 'stu_456',
      jobId: 'job_789',
      title: 'Bổ sung RBAC API',
      description: 'Tạo branch feature/rbac trên repo đồ án',
      requirements: ['JWT middleware', 'Unit test'],
      deadlineHours: 48
    });

    expect(challenge.id).toBeDefined();
    expect(challenge.status).toBe('issued');
    expect(challenge.deadlineHours).toBe(48);
    expect(new Date(challenge.deadlineDate).getTime()).toBeGreaterThan(Date.now());
  });

  it('TC-CHAL-02: Sinh viên nộp bài giải thử thách chuyển trạng thái sang submitted', () => {
    challengeScorecardService.issueChallenge({
      candidatePipelineId: 'pipe_item_001',
      recruiterId: 'rec_123',
      studentId: 'stu_456',
      jobId: 'job_789',
      title: 'Bổ sung RBAC API',
      description: 'Tạo branch feature/rbac trên repo đồ án',
      requirements: ['JWT middleware'],
      deadlineHours: 48
    });

    const updated = challengeScorecardService.submitChallengeSolution({
      candidatePipelineId: 'pipe_item_001',
      pullRequestUrl: 'https://github.com/student/myproject/pull/5',
      demoUrl: 'https://myproject-preview.vercel.app',
      solutionNotes: 'Đã hoàn thành phân quyền 3 roles và 5 unit tests.'
    });

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('submitted');
    expect(updated?.submission?.pullRequestUrl).toBe('https://github.com/student/myproject/pull/5');
  });

  it('TC-SC-01: Chấm điểm phỏng vấn Scorecard chuẩn hóa và tính điểm overallScore chính xác', () => {
    const scorecard = challengeScorecardService.submitScorecard({
      candidatePipelineId: 'pipe_item_001',
      interviewerId: 'interviewer_techlead',
      interviewerName: 'Trần Tech Lead',
      interviewerRole: 'Tech Lead',
      scores: {
        architecture: 5,
        codeDefense: 4,
        debugging: 5,
        communication: 4,
        cultureFit: 5
      },
      recommendation: 'strong_hire',
      strengths: 'Kiến trúc microservice rất vững, phản biện tự tin.',
      improvementAreas: 'Cần đào sâu hơn về SQL transaction rollback.'
    });

    expect(scorecard.id).toBeDefined();
    // Tổng điểm: 5+4+5+4+5 = 23/25 -> 92%
    expect(scorecard.overallScore).toBe(92);
    expect(scorecard.recommendation).toBe('strong_hire');
  });

  it('TC-SC-02: Tính toán điểm đồng thuận Consensus Score từ nhiều người phỏng vấn', () => {
    const scorecards: any[] = [
      { overallScore: 90, recommendation: 'strong_hire' },
      { overallScore: 80, recommendation: 'hire' }
    ];

    const consensus = challengeScorecardService.calculateConsensus(scorecards);
    expect(consensus.averageScore).toBe(85);
    expect(consensus.recommendation).toBe('strong_hire');
    expect(consensus.totalInterviews).toBe(2);
  });

  it('TC-BLIND-01: Sinh mã ẩn danh nhất quán cho chế độ Blind Screening', () => {
    const blind1 = challengeScorecardService.getBlindCandidateInfo('stu_456');
    const blind2 = challengeScorecardService.getBlindCandidateInfo('stu_456');

    expect(blind1.anonymousName).toContain('Ứng viên #DEV-');
    expect(blind1.anonymousName).toBe(blind2.anonymousName);
  });
});
