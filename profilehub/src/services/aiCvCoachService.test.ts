import {
  evaluateCvSection,
  CV_STEP_GUIDANCES,
  detectIndustryDomain,
  getStepGuidance,
  INDUSTRY_DOMAINS,
  optimizeCvContentWithAi
} from './aiCvCoachService';

export function runCvCoachTests(): boolean {
  console.log('[TDD TEST] Running aiCvCoachService evaluation & Multi-Industry tests...');

  // 1. Test Summary Evaluation (Bad input)
  const badSummary = 'Em là sinh viên chăm chỉ, ham học hỏi muốn tìm việc.';
  const evalBadSummary = evaluateCvSection('summary', badSummary);
  if (evalBadSummary.status !== 'needs_improvement') {
    throw new Error('TDD Failed: Cliché summary should fail.');
  }

  // 2. Test Summary Evaluation (Good input IT)
  const goodSummary = CV_STEP_GUIDANCES.summary.sampleGood;
  const evalGoodSummary = evaluateCvSection('summary', goodSummary);
  if (evalGoodSummary.status !== 'pass' || evalGoodSummary.score < 75) {
    throw new Error(`TDD Failed: Good summary should pass. Got score: ${evalGoodSummary.score}`);
  }

  // 3. Test Multi-Industry Auto-detection (Marketing)
  const detectedMarketing = detectIndustryDomain('Chuyên viên Digital Marketing / Content Creator');
  if (detectedMarketing.id !== 'marketing') {
    throw new Error(`TDD Failed: Expected marketing domain, got ${detectedMarketing.id}`);
  }

  // 4. Test Multi-Industry Auto-detection (Finance)
  const detectedFinance = detectIndustryDomain('Kế toán viên tổng hợp / Kiểm toán');
  if (detectedFinance.id !== 'finance_accounting') {
    throw new Error(`TDD Failed: Expected finance_accounting domain, got ${detectedFinance.id}`);
  }

  // 5. Test Marketing Summary Evaluation
  const mktGuidance = getStepGuidance('summary', 'marketing');
  const evalMktSummary = evaluateCvSection('summary', mktGuidance.sampleGood, {
    domainId: 'marketing'
  });
  if (evalMktSummary.status !== 'pass') {
    throw new Error(`TDD Failed: Marketing sample summary should pass.`);
  }

  // 6. Test Marketing Project STAR Evaluation
  const mktProject = INDUSTRY_DOMAINS.marketing.sampleProject;
  const evalMktProject = evaluateCvSection('project', mktProject, {
    domainId: 'marketing'
  });
  if (evalMktProject.status !== 'pass') {
    throw new Error(`TDD Failed: Marketing project with ROAS & CPA metrics should pass.`);
  }

  // 7. Test AI STAR Bullet Optimizer for Marketing
  const optimizedMkt = optimizeCvContentWithAi('project', 'Làm marketing facebook ads', 'Digital Marketing');
  if (!optimizedMkt.improvedText.includes('ROAS') && !optimizedMkt.improvedText.includes('CPA')) {
    throw new Error('TDD Failed: AI optimizer should generate domain-specific metrics for Marketing.');
  }

  // 8. Test Contact Evaluation
  const goodContact = CV_STEP_GUIDANCES.contact.sampleGood;
  const evalGoodContact = evaluateCvSection('contact', goodContact);
  if (evalGoodContact.status !== 'pass') {
    throw new Error('TDD Failed: Good contact should pass.');
  }

  console.log('[TDD TEST] All aiCvCoachService multi-industry tests PASSED cleanly! 🟢');
  return true;
}

runCvCoachTests();
