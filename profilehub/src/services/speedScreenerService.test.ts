import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateCandidateAiTldr,
  getNextIndex,
  getPrevIndex,
  applySpeedScreenerAction,
  preFetchCandidates,
  getCachedAiTldr,
  clearPreFetchCache,
} from './speedScreenerService';
import type { CandidatePipelineItem } from '../types/database';

describe('Dịch Vụ Duyệt Hồ Sơ Thần Tốc (speedScreenerService)', () => {
  beforeEach(() => {
    clearPreFetchCache();
  });

  const mockCandidate1: CandidatePipelineItem = {
    id: 'pipe_1',
    recruiter_id: 'rec_1',
    student_id: 'stu_1',
    stage: 'discovered',
    student: {
      id: 'stu_1',
      full_name: 'Nguyễn Văn A',
      skills: ['React', 'TypeScript', 'Node.js'],
    },
  };

  const mockCandidate2: CandidatePipelineItem = {
    id: 'pipe_2',
    recruiter_id: 'rec_1',
    student_id: 'stu_2',
    stage: 'shortlisted',
    student: {
      id: 'stu_2',
      full_name: 'Trần Thị B',
      skills: ['Python', 'Docker', 'AWS'],
    },
  };

  it('TC-SCR-01: getNextIndex và getPrevIndex di chuyển chính xác và chặn biên an toàn', () => {
    expect(getNextIndex(0, 2)).toBe(1);
    expect(getNextIndex(1, 2)).toBe(1); // Chạm biên cuối
    expect(getPrevIndex(1, 2)).toBe(0);
    expect(getPrevIndex(0, 2)).toBe(0); // Chạm biên đầu
    expect(getNextIndex(0, 0)).toBe(0); // Rỗng
  });

  it('TC-SCR-02: generateCandidateAiTldr trích xuất 3 khối thông tin then chốt', () => {
    const tldr = generateCandidateAiTldr(mockCandidate1);
    expect(tldr.candidateId).toBe('stu_1');
    expect(tldr.technicalCore).toContain('React, TypeScript, Node.js');
    expect(tldr.screeningAttention).toContain('CI/CD');
    expect(tldr.matchScore).toBeGreaterThanOrEqual(80);
  });

  it('TC-SCR-03: applySpeedScreenerAction chuyển đúng trạng thái Pipeline theo phím tắt', () => {
    // Phím A: Advance sang phỏng vấn
    const resAdvance = applySpeedScreenerAction(mockCandidate1, 'advance');
    expect(resAdvance.targetStage).toBe('interview');
    expect(resAdvance.updatedCandidate.stage).toBe('interview');

    // Phím R: Reject chuyển về discovered
    const resReject = applySpeedScreenerAction(mockCandidate1, 'reject');
    expect(resReject.targetStage).toBe('discovered');
    expect(resReject.updatedCandidate.stage).toBe('discovered');
  });

  it('TC-SCR-04: preFetchCandidates lưu dữ liệu vào bộ đệm cache giúp truy xuất tức thì', () => {
    const list = [mockCandidate1, mockCandidate2];
    preFetchCandidates(list, 0, 2);

    const cached1 = getCachedAiTldr('pipe_1');
    expect(cached1).toBeDefined();
    expect(cached1?.technicalCore).toContain('React');

    const cached2 = getCachedAiTldr('pipe_2');
    expect(cached2).toBeDefined();
    expect(cached2?.technicalCore).toContain('Python');
  });
});
