import { describe, it, expect } from 'vitest';
import {
  starDiagnosticService,
  type StatementDiagnosis,
  type ElicitationAnswers
} from './starDiagnosticService';

describe('starDiagnosticService - Core Diagnostic & Elicitation', () => {
  it('diagnoses a vague, passive project statement without metrics', () => {
    const vagueText = 'Tham gia phát triển trang thương mại điện tử bằng React';
    const diagnosis: StatementDiagnosis = starDiagnosticService.diagnoseStatement(vagueText);

    expect(diagnosis.isStarCompliant).toBe(false);
    expect(diagnosis.score).toBeLessThan(50);
    expect(diagnosis.hasAction).toBe(false); // Flagged because of passive verb 'tham gia'
    expect(diagnosis.hasResult).toBe(false); // No technical metric
    expect(diagnosis.weaknesses).toContain('Sử dụng động từ bị động/mơ hồ ("tham gia"), chưa làm rõ vai trò kỹ thuật trực tiếp.');
    expect(diagnosis.weaknesses).toContain('Thiếu số liệu đo lường kỹ thuật hoặc kết quả kiểm chứng thực tế.');
  });

  it('diagnoses a strong STAR project statement with reproducible metrics', () => {
    const strongText =
      'Trực tiếp kiến trúc module giỏ hàng bằng React và Zustand; tối ưu hoá truy vấn PostgreSQL với Compound Index giúp giảm thời gian query từ 240ms xuống 18ms trên 50.000 bản ghi mẫu.';
    const diagnosis: StatementDiagnosis = starDiagnosticService.diagnoseStatement(strongText);

    expect(diagnosis.isStarCompliant).toBe(true);
    expect(diagnosis.score).toBeGreaterThanOrEqual(85);
    expect(diagnosis.hasAction).toBe(true);
    expect(diagnosis.hasResult).toBe(true);
    expect(diagnosis.detectedMetrics.length).toBeGreaterThan(0);
    expect(diagnosis.weaknesses.length).toBe(0);
  });

  it('generates 3 guided STAR interview questions tailored to the project', () => {
    const questions = starDiagnosticService.generateElicitationQuestions({
      projectName: 'E-commerce Shop',
      technologies: ['React', 'PostgreSQL', 'NodeJS'],
      statement: 'Làm giỏ hàng và thanh toán'
    });

    expect(questions.situationQuestion).toContain('thách thức');
    expect(questions.actionQuestion).toContain('trực tiếp');
    expect(questions.resultQuestion).toContain('đo lường');
    expect(questions.suggestedVerificationMethods.length).toBeGreaterThan(0);
    expect(questions.suggestedVerificationMethods).toContain('EXPLAIN ANALYZE (đo thời gian truy vấn DB trước/sau khi tối ưu)');
  });

  it('assembles candidate answers into a high-impact STAR bullet point with defense tips', () => {
    const answers: ElicitationAnswers = {
      projectName: 'E-commerce Shop',
      technologies: ['React', 'Zustand', 'PostgreSQL'],
      situationAnswer: 'Cần lưu trữ trạng thái giỏ hàng realtime và truy vấn lịch sử đơn hàng nhanh khi dữ liệu tăng lớn',
      actionAnswer: 'Tự tay xây dựng store Zustand đồng bộ LocalStorage và đánh Compound Index trên PostgreSQL',
      resultAnswer: 'Viết 16 unit tests kiểm thử luồng thanh toán pass 100%, query EXPLAIN giảm từ 210ms xuống 15ms trên 20k đơn hàng'
    };

    const assembled = starDiagnosticService.assembleStarBullet(answers);

    expect(assembled.starBullet).toContain('Trực tiếp kiến trúc');
    expect(assembled.starBullet).toContain('Zustand');
    expect(assembled.starBullet).toContain('PostgreSQL');
    expect(assembled.starBullet).toContain('16 unit tests');
    expect(assembled.interviewDefenseTip).toBeDefined();
    expect(assembled.interviewDefenseTip).toContain('Tech Lead');
  });

  it('diagnoses a full raw CV text and extracts project items with actionable health reports', () => {
    const rawCvText = `
DỰ ÁN NỔI BẬT:
Project 1: Website Bán Hàng Công Nghệ
- Tham gia phát triển frontend bằng ReactJS và TailwindCSS
- Hỗ trợ kết nối API đăng nhập bằng JWT

Project 2: Hệ Thống Đặt Lịch Khám Bệnh
- Trực tiếp xây dựng REST API bằng ExpressJS và PostgreSQL
- Tối ưu query tìm kiếm bác sĩ theo chuyên khoa đạt phản hồi 35ms trên 10.000 bản ghi
    `;

    const report = starDiagnosticService.diagnoseRawCvText(rawCvText);

    expect(report.totalProjects).toBe(2);
    expect(report.averageScore).toBeGreaterThan(0);
    expect(report.projects[0].diagnosis.isStarCompliant).toBe(false);
    expect(report.projects[1].diagnosis.isStarCompliant).toBe(true);
  });
});
