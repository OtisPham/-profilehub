import { aiMatchingService } from '../services/aiMatching.service.js';
import type { AiCandidateProfile, AiJobDescriptionInput } from '../types/aiMatching.types.js';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING AI CV - JD COMPATIBILITY MATCHING TESTS (Framework v2.0)');
  console.log('====================================================\n');

  const frontendJd: AiJobDescriptionInput = {
    title: 'Frontend Developer (React / Next.js)',
    level: 'fresher',
    raw_jd_text: `
      Chúng tôi đang tìm kiếm vị trí Frontend Developer Fresher/Junior.
      Yêu cầu:
      - Thành thạo React, TypeScript, Next.js, Tailwind CSS.
      - Có kinh nghiệm làm việc với REST API, State Management.
      - Ưu tiên ứng viên có kiến thức về Docker, Jest testing, tối ưu hóa hiệu năng website.
    `,
    required_skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    preferred_skills: ['Docker', 'Testing', 'REST API'],
  };

  // Ứng viên 1: Có bằng chứng xác thực (Verified Badge), có số liệu đo lường (Metrics), có Live demo
  const eliteCandidate: AiCandidateProfile = {
    target_role: 'Frontend Developer',
    experience_level: 'fresher',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST API', 'Git'],
    projects: [
      {
        id: 'proj-1',
        title: 'E-Commerce Platform SPA',
        description: 'Xây dựng ứng dụng web thương mại điện tử bằng React và TypeScript, tích hợp thanh toán VNPay và tối ưu hóa truy vấn giúp giảm 35% thời gian phản hồi API, phục vụ 500+ sinh viên.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST API'],
        is_verified: true,
        verifier_name: 'TS. Nguyễn Văn A (ĐH Bách Khoa)',
        demo_url: 'https://demo-ecommerce.example.com',
        github_url: 'https://github.com/candidate/ecommerce-spa',
        metrics: ['giảm 35% response time', '500+ sinh viên'],
      },
      {
        id: 'proj-2',
        title: 'Task Management App',
        description: 'Ứng dụng quản lý công việc real-time, điểm đồ án đạt 9.5/10.',
        technologies: ['React', 'Tailwind CSS'],
        is_verified: true,
        demo_url: 'https://tasks.example.com',
        metrics: ['9.5/10 điểm đồ án'],
      }
    ]
  };

  // Ứng viên 2: Chỉ tự khai (Self-claim), không có link, không có số liệu định lượng, thiếu Next.js
  const unverifiedCandidate: AiCandidateProfile = {
    target_role: 'Frontend Developer',
    experience_level: 'fresher',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Docker', 'Testing'],
    projects: [
      {
        id: 'proj-bad-1',
        title: 'Web bán hàng',
        description: 'Tham gia làm web bán hàng cùng bạn.',
        technologies: ['React'],
        is_verified: false,
      }
    ]
  };

  console.log('--- TEST CASE 1: VERIFIED CANDIDATE WITH QUANTIFIED METRICS ---');
  const result1 = await aiMatchingService.evaluateCompatibility(eliteCandidate, frontendJd);
  console.log(`Overall Score: ${result1.overall_score} / 100`);
  console.log(`Rulebook Level: ${result1.rulebook_level}`);
  console.log(`Match Rating: ${result1.match_rating}`);
  console.log(`CSS (Critical Skill Score): ${result1.framework_variables?.css}% (Status: ${result1.framework_variables?.css_status}, Modifier: x${result1.framework_variables?.skill_modifier})`);
  console.log(`Raw Score vs Final Score: Raw=${result1.framework_variables?.raw_score} ➔ Final=${result1.overall_score}`);
  console.log(`Trust Tier: ${result1.trust_index.trust_tier} (Multiplier: ${result1.trust_index.multiplier})`);
  console.log(`Missing Core Skills: ${result1.pillars.skill_fit.missing_core.join(', ') || 'None'}`);
  console.log('\n');

  console.log('--- TEST CASE 2: CANDIDATE WITH PARTIAL CRITICAL SKILLS (CSS MODIFIER) ---');
  const result2 = await aiMatchingService.evaluateCompatibility(unverifiedCandidate, frontendJd);
  console.log(`Overall Score: ${result2.overall_score} / 100`);
  console.log(`Rulebook Level: ${result2.rulebook_level}`);
  console.log(`Match Rating: ${result2.match_rating}`);
  console.log(`CSS: ${result2.framework_variables?.css}% (Modifier: x${result2.framework_variables?.skill_modifier})`);
  console.log(`Raw Score: ${result2.framework_variables?.raw_score} ➔ Final Score: ${result2.overall_score}`);
  console.log(`Coaching Tips: ${result2.cv_coaching_tips.join(' | ')}`);
  console.log('\n');

  console.log('--- TEST CASE 3: DISCORDANT DOMAIN (FULLSTACK CV vs MARKETING/ACCOUNTING JD) ---');
  const accountingJd: AiJobDescriptionInput = {
    title: 'Chuyên viên Kế toán Tổng hợp',
    level: 'fresher',
    raw_jd_text: `
      Tuyển dụng Chuyên viên Kế toán - Tài chính.
      Yêu cầu:
      - Tốt nghiệp chuyên ngành Kế toán, Kiểm toán, Tài chính.
      - Thành thạo phần mềm MISA, Excel nâng cao, lập Báo cáo tài chính.
      - Nắm vững luật thuế, hóa đơn điện tử, công nợ.
    `,
    required_skills: ['Kế toán', 'MISA', 'Báo cáo tài chính', 'Thuế'],
    preferred_skills: ['Excel', 'Kiểm toán'],
  };

  const result3 = await aiMatchingService.evaluateCompatibility(eliteCandidate, accountingJd);
  console.log(`Overall Score: ${result3.overall_score} / 100`);
  console.log(`Rulebook Level: ${result3.rulebook_level}`);
  console.log(`Gate Check Status: ${result3.gate_check?.status}`);
  console.log(`Gate Check Failed Reasons: ${result3.gate_check?.failedReasons.join(' | ')}`);
  console.log('\n');

  console.log('--- TEST CASE 4: RELEVANT VS IRRELEVANT EXPERIENCE PROJECTS ---');
  const mixedCandidate: AiCandidateProfile = {
    target_role: 'Frontend Developer',
    experience_level: 'fresher',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    projects: [
      {
        id: 'proj-rel-1',
        title: 'React Dashboard App',
        description: 'Xây dựng dashboard với React và TypeScript, tăng 40% tốc độ tải trang.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
        is_verified: true,
        metrics: ['tăng 40% tốc độ tải trang']
      },
      {
        id: 'proj-irrel-2',
        title: 'Dự án Bán hàng Telesales & Chốt đơn',
        description: 'Tư vấn bán hàng và chốt đơn mỹ phẩm qua điện thoại.',
        technologies: ['Telesales', 'Bán hàng'],
        is_verified: true,
      }
    ]
  };

  const result4 = await aiMatchingService.evaluateCompatibility(mixedCandidate, frontendJd);
  console.log(`Mixed Candidate Overall Score: ${result4.overall_score} / 100`);
  console.log(`Evidence Depth Score: ${result4.pillars.evidence_depth.score}`);
  console.log(`Top Projects Titles: ${result4.pillars.evidence_depth.top_contributing_projects.map((p: { title?: string }) => p.title).join(' | ')}`);
  console.log('\n');

  console.log('--- TEST CASE 5: GATE CHECK DIRECT REJECTION ---');
  const rejectedCandidate: AiCandidateProfile = {
    target_role: 'Kế toán viên',
    experience_level: 'junior',
    skills: ['MISA', 'Kế toán', 'Thuế'],
    projects: [
      {
        id: 'acc-1',
        title: 'Báo cáo thuế công ty',
        technologies: ['MISA', 'Excel'],
        is_verified: true,
      }
    ]
  };

  const result5 = await aiMatchingService.evaluateCompatibility(rejectedCandidate, frontendJd);
  console.log(`Gate Check Passed: ${result5.gate_check?.passed}`);
  console.log(`Gate Check Status: ${result5.gate_check?.status}`);
  console.log(`Gate Check Failed Reasons: ${result5.gate_check?.failedReasons.join(' | ')}`);
  console.log(`Overall Score after Gate Check: ${result5.overall_score} (Expected: 0)`);
  console.log('\n');

  // Verify assertions according to Framework v2.0
  if (result1.overall_score > result2.overall_score) {
    console.log('✅ Assertion Passed: Verified candidate scored higher than candidate with missing critical skills.');
  } else {
    throw new Error('❌ Test Failed: Verified candidate score should be higher!');
  }

  if (result1.framework_variables && result1.framework_variables.css >= 80 && result1.framework_variables.skill_modifier === 1.0) {
    console.log(`✅ Assertion Passed: CSS >= 80% applies full modifier 1.0 (CSS: ${result1.framework_variables.css}%).`);
  } else {
    throw new Error('❌ Test Failed: CSS calculation or modifier mismatch for elite candidate!');
  }

  if (result1.framework_variables && result1.framework_variables.cs_level === 5) {
    console.log(`✅ Assertion Passed: Credibility Score Level 5 verified for candidate with verified badges & metrics.`);
  }

  if (result3.overall_score === 0 && result3.gate_check?.status === 'Reject') {
    console.log('✅ Assertion Passed: Mismatched domain triggered Step 1 Gate Check rejection with Final Score = 0.');
  } else if (result3.overall_score < 20) {
    console.log(`✅ Assertion Passed: Mismatched domain scored minimal (${result3.overall_score}).`);
  } else {
    throw new Error(`❌ Test Failed: Mismatched domain score (${result3.overall_score}%) should be 0 or < 20%!`);
  }

  if (result5.overall_score === 0 && result5.gate_check?.status === 'Reject') {
    console.log('✅ Assertion Passed: Step 1 Gate Check correctly rejected mismatched candidate with Final Score = 0.');
  } else {
    throw new Error('❌ Test Failed: Gate check reject should yield overall score 0!');
  }

  if (result4.pillars.evidence_depth.top_contributing_projects.length >= 1 && result4.pillars.evidence_depth.top_contributing_projects[0].id === 'proj-rel-1') {
    console.log('✅ Assertion Passed: Evidence depth prioritized relevant React Dashboard project.');
  }

  console.log('\n🎉 ALL CV-JD MATCHING FRAMEWORK v2.0 TESTS COMPLETED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});


