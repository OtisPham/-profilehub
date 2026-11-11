import { describe, it, expect } from 'vitest';
import {
  compileEmailTemplate,
  extractCandidateMergeContext,
  buildMergedEmail,
  generateMailtoLink,
} from './batchEmailService';
import { BATCH_EMAIL_TEMPLATES } from './batchEmailTemplates';
import type { CandidatePipelineItem } from '../types/database';

describe('Dịch Vụ Trộn Mẫu Email Hàng Loạt (batchEmailService)', () => {
  const mockCandidate: CandidatePipelineItem = {
    id: 'pipe_100',
    recruiter_id: 'rec_1',
    student_id: 'stu_100',
    stage: 'discovered',
    job_id: 'job_1',
    job: {
      id: 'job_1',
      recruiter_id: 'rec_1',
      title: 'Fullstack React & Node.js Developer',
      company_name: 'Tập đoàn Công nghệ FPT',
      location: 'Hồ Chí Minh',
      created_at: new Date().toISOString(),
    },
    student: {
      id: 'stu_100',
      full_name: 'Lê Hoàng Nam',
      skills: ['React', 'Node.js', 'PostgreSQL'],
    },
    take_home_challenge: {
      id: 'ch_1',
      candidatePipelineId: 'pipe_100',
      recruiterId: 'rec_1',
      studentId: 'stu_100',
      jobId: 'job_1',
      title: 'Tối ưu hiệu năng Database',
      description: 'Đánh index và giảm p95 latency',
      requirements: ['EXPLAIN ANALYZE'],
      deadlineHours: 48,
      deadlineDate: '2026-11-25 18:00',
      status: 'issued',
      createdAt: new Date().toISOString(),
    },
  };

  it('TC-BEM-01: compileEmailTemplate thay thế chính xác các thẻ biến động {tag}', () => {
    const raw = 'Chào {candidate_name}, chúc mừng bạn ứng tuyển {job_title} tại {company_name}!';
    const compiled = compileEmailTemplate(raw, {
      candidate_name: 'Hoàng Nam',
      job_title: 'Frontend Developer',
      company_name: 'Shopee',
    });
    expect(compiled).toBe('Chào Hoàng Nam, chúc mừng bạn ứng tuyển Frontend Developer tại Shopee!');
  });

  it('TC-BEM-02: compileEmailTemplate giữ nguyên thẻ nếu không có trong context', () => {
    const raw = 'Chào {candidate_name}, mã kích hoạt của bạn là {secret_code}.';
    const compiled = compileEmailTemplate(raw, {
      candidate_name: 'Hoàng Nam',
      job_title: '',
      company_name: '',
    });
    expect(compiled).toBe('Chào Hoàng Nam, mã kích hoạt của bạn là {secret_code}.');
  });

  it('TC-BEM-03: extractCandidateMergeContext trích xuất đầy đủ thông số thực chiến từ pipeline item', () => {
    const ctx = extractCandidateMergeContext(mockCandidate);
    expect(ctx.candidate_name).toBe('Lê Hoàng Nam');
    expect(ctx.job_title).toBe('Fullstack React & Node.js Developer');
    expect(ctx.company_name).toBe('Tập đoàn Công nghệ FPT');
    expect(ctx.challenge_deadline).toBe('2026-11-25 18:00');
  });

  it('TC-BEM-04: buildMergedEmail cá nhân hóa hoàn chỉnh các mẫu trong BATCH_EMAIL_TEMPLATES', () => {
    const template = BATCH_EMAIL_TEMPLATES[0]; // Mời phỏng vấn
    const result = buildMergedEmail(template, mockCandidate);

    expect(result.subject).toContain('Tập đoàn Công nghệ FPT');
    expect(result.subject).toContain('Lê Hoàng Nam');
    expect(result.body).toContain('Lê Hoàng Nam');
    expect(result.body).toContain('Fullstack React & Node.js Developer');
  });

  it('TC-BEM-05: generateMailtoLink tạo liên kết mailto hợp lệ có encode tham số', () => {
    const link = generateMailtoLink('hr@company.com', 'Tiêu đề phỏng vấn', 'Nội dung thư');
    expect(link).toContain('mailto:hr@company.com?');
    expect(link).toContain('subject=Ti%C3%AAu+%C4%91%E1%BB%81+ph%E1%BB%8Fng+v%E1%BA%A5n');
  });
});
