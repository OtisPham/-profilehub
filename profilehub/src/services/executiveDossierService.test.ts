import { describe, it, expect } from 'vitest';
import { executiveDossierService } from './executiveDossierService';
import type { CandidatePipelineItem } from '../types/database';

describe('executiveDossierService - Hồ Sơ Đánh Giá Phỏng Vấn Chuyên Sâu', () => {
  const mockCandidate: CandidatePipelineItem = {
    id: 'pipe_item_999',
    recruiter_id: 'rec_1',
    student_id: 'stu_999',
    job_id: 'job_1',
    stage: 'interview',
    created_at: '2026-11-09T08:00:00Z',
    private_notes: 'Ứng viên có thái độ cầu thị, mong muốn gắn bó lâu dài.',
    student: {
      id: 'stu_999',
      full_name: 'Trần Văn Hoàng',
      major: 'Kỹ sư Phần mềm',
      university: 'Đại Học Quốc Gia',
      gpa: '3.6/4.0',
      email: 'hoang.tran@example.com',
      phone: '0909 111 222',
      projects: [
        {
          id: 'proj_1',
          title: 'Hệ Thống Quản Lý Kho Thông Minh',
          github_url: 'https://github.com/hoangtran/smart-warehouse',
          demo_url: 'https://smart-warehouse.dev',
          is_verified: true,
          score: '9.5/10',
          instructor: 'TS. Nguyễn Văn Hùng'
        }
      ]
    } as any,
    job: {
      id: 'job_1',
      title: 'Frontend React Developer'
    } as any,
    scorecards: [
      {
        id: 'sc_1',
        candidatePipelineId: 'pipe_item_999',
        interviewerId: 'rec_1',
        interviewerName: 'Tech Lead Nam',
        interviewerRole: 'Tech Lead',
        scores: {
          architecture: 5,
          codeDefense: 4,
          debugging: 5,
          communication: 4,
          cultureFit: 5
        },
        overallScore: 92,
        recommendation: 'strong_hire',
        strengths: 'Tư duy kiến trúc hệ thống rất vững.',
        improvementAreas: 'Cần nâng cao thêm kiến thức về CI/CD.',
        submittedAt: '2026-11-09T10:00:00Z'
      }
    ],
    take_home_challenge: {
      id: 'ch_1',
      candidatePipelineId: 'pipe_item_999',
      recruiterId: 'rec_1',
      studentId: 'stu_999',
      jobId: 'job_1',
      title: 'Xây Dựng Middleware Phân Quyền RBAC',
      description: 'Cài đặt phân quyền Admin/Member',
      requirements: ['Tạo PR', 'Viết Unit Test'],
      deadlineHours: 48,
      deadlineDate: '2026-11-11T08:00:00Z',
      status: 'submitted',
      submission: {
        pullRequestUrl: 'https://github.com/hoangtran/smart-warehouse/pull/14',
        demoUrl: 'https://demo.dev',
        solutionNotes: 'Đã hoàn thành với JWT & Refresh Token',
        submittedAt: '2026-11-09T11:00:00Z'
      },
      evaluation: {
        score: 95,
        feedback: 'Code rất sạch và có test đầy đủ.',
        evaluatedBy: 'Tech Lead Nam',
        evaluatedAt: '2026-11-09T12:00:00Z'
      },
      createdAt: '2026-11-09T08:30:00Z'
    }
  };

  it('TC-DOSSIER-01: Tổng hợp chính xác toàn bộ dữ liệu ứng viên ở chế độ tiêu chuẩn', () => {
    const dossier = executiveDossierService.buildExecutiveDossier(mockCandidate, false, 'Công Ty Công Nghệ Alpha');

    expect(dossier.candidateName).toBe('Trần Văn Hoàng');
    expect(dossier.university).toBe('Đại Học Quốc Gia');
    expect(dossier.companyName).toBe('Công Ty Công Nghệ Alpha');
    expect(dossier.executiveRecommendation).toBe('STRONG_HIRE');
    expect(dossier.scorecardSummary.consensusScore).toBe(92);
    expect(dossier.scorecardSummary.averageCriteria.architecture).toBe(5);
    expect(dossier.challengeSummary?.status).toBe('submitted');
    expect(dossier.challengeSummary?.pullRequestUrl).toContain('pull/14');
    expect(dossier.verifiedProjects.length).toBe(1);
    expect(dossier.verifiedProjects[0].isVerified).toBe(true);
    expect(dossier.keyStrengths.length).toBeGreaterThan(0);
  });

  it('TC-DOSSIER-02: Che thông tin danh tính và trường học khi kích hoạt Blind Screening Mode', () => {
    const dossier = executiveDossierService.buildExecutiveDossier(mockCandidate, true, 'Công Ty Công Nghệ Alpha');

    expect(dossier.candidateName).toMatch(/^Ứng viên #DEV-[A-Z0-9]+$/);
    expect(dossier.university).toContain('Đã ẩn danh');
    expect(dossier.isBlindMode).toBe(true);
    // Điểm số và dữ liệu năng lực vẫn giữ nguyên 100%
    expect(dossier.scorecardSummary.consensusScore).toBe(92);
    expect(dossier.executiveRecommendation).toBe('STRONG_HIRE');
  });

  it('TC-DOSSIER-03: Sinh bản tóm tắt Email/Slack Markdown đầy đủ các phần cốt lõi', () => {
    const dossier = executiveDossierService.buildExecutiveDossier(mockCandidate, false, 'Công Ty Alpha');
    const summary = executiveDossierService.generateExecutiveEmailSummary(dossier);

    expect(summary).toContain('[BÁO CÁO PHỎNG VẤN ĐIỀU HÀNH]');
    expect(summary).toContain('Khuyến nghị tuyển dụng: [STRONG_HIRE]');
    expect(summary).toContain('Điểm đồng thuận phỏng vấn: 92/100');
    expect(summary).toContain('pull/14');
    expect(summary).toContain('ĐIỂM MẠNH NỔI BẬT:');
  });
});
