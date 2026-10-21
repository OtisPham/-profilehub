import { describe, it, expect } from 'vitest';
import {
  evaluateCvSection,
  CV_STEP_GUIDANCES,
  detectIndustryDomain,
  getStepGuidance,
  INDUSTRY_DOMAINS,
  optimizeCvContentWithAi
} from './aiCvCoachService';

describe('Tầng 4 (Content Evaluation & Coach Optimizer Seam)', () => {
  it('TC-COACH-01: Đánh giá Summary sáo rỗng phải trả về needs_improvement', () => {
    const badSummary = 'Em là sinh viên chăm chỉ, ham học hỏi muốn tìm việc.';
    const evalBadSummary = evaluateCvSection('summary', badSummary);
    expect(evalBadSummary.status).toBe('needs_improvement');
  });

  it('TC-COACH-02: Đánh giá Summary chuẩn IT có số liệu phải đạt pass và điểm >= 75', () => {
    const goodSummary = CV_STEP_GUIDANCES.summary.sampleGood;
    const evalGoodSummary = evaluateCvSection('summary', goodSummary);
    expect(evalGoodSummary.status).toBe('pass');
    expect(evalGoodSummary.score).toBeGreaterThanOrEqual(75);
  });

  it('TC-COACH-03: Nhận diện tự động đa ngành nghề (Marketing & Finance)', () => {
    const detectedMarketing = detectIndustryDomain('Chuyên viên Digital Marketing / Content Creator');
    expect(detectedMarketing.id).toBe('marketing');

    const detectedFinance = detectIndustryDomain('Kế toán viên tổng hợp / Kiểm toán');
    expect(detectedFinance.id).toBe('finance_accounting');
  });

  it('TC-COACH-04: Đánh giá Summary & Đồ án chuẩn STAR cho ngành Marketing', () => {
    const mktGuidance = getStepGuidance('summary', 'marketing');
    const evalMktSummary = evaluateCvSection('summary', mktGuidance.sampleGood, {
      domainId: 'marketing'
    });
    expect(evalMktSummary.status).toBe('pass');

    const mktProject = INDUSTRY_DOMAINS.marketing.sampleProject;
    const evalMktProject = evaluateCvSection('project', mktProject, {
      domainId: 'marketing'
    });
    expect(evalMktProject.status).toBe('pass');
  });

  it('TC-COACH-05: AI STAR Bullet Optimizer sinh chỉ số định lượng theo đúng ngành (ROAS, CPA)', () => {
    const optimizedMkt = optimizeCvContentWithAi('project', 'Làm marketing facebook ads', 'Digital Marketing');
    expect(optimizedMkt.improvedText).toMatch(/ROAS|CPA/);
  });

  it('TC-COACH-06: Đánh giá thông tin liên hệ (Contact Evaluation)', () => {
    const goodContact = CV_STEP_GUIDANCES.contact.sampleGood;
    const evalGoodContact = evaluateCvSection('contact', goodContact);
    expect(evalGoodContact.status).toBe('pass');
  });
});

