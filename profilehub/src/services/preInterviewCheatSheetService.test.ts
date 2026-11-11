import { describe, it, expect, beforeEach } from 'vitest';
import {
  generatePreInterviewCheatSheet,
  saveOfflineCheatSheet,
  getOfflineCheatSheet,
} from './preInterviewCheatSheetService';
import type { CandidatePipelineItem } from '../types/database';

describe('Dịch Vụ Thẻ Tác Chiến Bỏ Túi 60 Giây (preInterviewCheatSheetService)', () => {
  const mockCandidate: CandidatePipelineItem = {
    id: 'pipe_201',
    recruiter_id: 'rec_99',
    student_id: 'stu_201',
    stage: 'interview',
    job: {
      id: 'job_2',
      recruiter_id: 'rec_99',
      title: 'Frontend React Developer',
      company_name: 'VNG Corporation',
      location: 'TP. Hồ Chí Minh',
      salary_min: 12000000,
      salary_max: 18000000,
      required_skills: ['React'],
      created_at: new Date().toISOString(),
    },
    student: {
      id: 'stu_201',
      full_name: 'Nguyễn Minh Tuấn',
      skills: ['React', 'TypeScript', 'TailwindCSS'],
    },
  };

  it('TC-CHT-01: generatePreInterviewCheatSheet sinh đủ 4 khối thông tin đinh', () => {
    const sheet = generatePreInterviewCheatSheet(mockCandidate);

    expect(sheet.candidateId).toBe('stu_201');
    expect(sheet.candidateName).toBe('Nguyễn Minh Tuấn');
    expect(sheet.elevatorPitch).toContain('Nguyễn Minh Tuấn');
    expect(sheet.elevatorPitch).toContain('Frontend React Developer');
    expect(sheet.elevatorPitch).toContain('VNG Corporation');

    expect(sheet.killerMetrics).toHaveLength(3);
    expect(sheet.killerMetrics[0].value).toContain('98/100');

    expect(sheet.starStory.actionTaken).toBeDefined();
    expect(sheet.starStory.quantifiedResult).toBeDefined();

    expect(sheet.questionsToAsk).toHaveLength(3);
  });

  it('TC-CHT-02: saveOfflineCheatSheet và getOfflineCheatSheet hoạt động an toàn với LocalStorage', () => {
    const sheet = generatePreInterviewCheatSheet(mockCandidate);
    
    // Lưu vào storage
    saveOfflineCheatSheet(sheet);

    // Lấy ra
    const retrieved = getOfflineCheatSheet('stu_201');
    expect(retrieved).toBeDefined();
    expect(retrieved?.candidateName).toBe('Nguyễn Minh Tuấn');
    expect(retrieved?.jobTitle).toBe('Frontend React Developer');
  });
});
