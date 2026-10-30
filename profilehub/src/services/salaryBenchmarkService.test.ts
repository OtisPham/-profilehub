import { describe, it, expect } from 'vitest';
import { 
  calculateSalaryBenchmark, 
  extractLevelFromJdOrTitle, 
  formatCurrencyVnd 
} from './salaryBenchmarkService';

describe('Tầng Khảo Sát Dải Lương Thị Trường (Salary Benchmark Seam)', () => {
  it('TC-SAL-01: extractLevelFromJdOrTitle nhận diện chính xác cấp bậc', () => {
    expect(extractLevelFromJdOrTitle('Senior Backend Go Engineer')).toBe('senior');
    expect(extractLevelFromJdOrTitle('Thực tập sinh Frontend React')).toBe('intern');
    expect(extractLevelFromJdOrTitle('Team Lead Fullstack Architect')).toBe('lead');
    expect(extractLevelFromJdOrTitle('Junior Node.js Developer (1 năm kinh nghiệm)')).toBe('junior');
    expect(extractLevelFromJdOrTitle('Lập trình viên mới ra trường')).toBe('fresher');
  });

  it('TC-SAL-02: calculateSalaryBenchmark tính toán dải lương chính xác theo level và tech stack', () => {
    const res = calculateSalaryBenchmark(
      'Senior Backend Engineer',
      'senior',
      ['Golang', 'Kubernetes', 'Microservices'],
      2
    );

    expect(res.level).toBe('senior');
    expect(res.range.minVnd).toBeGreaterThanOrEqual(45000000);
    expect(res.range.medianVnd).toBeGreaterThan(res.range.minVnd);
    expect(res.range.maxVnd).toBeGreaterThan(res.range.medianVnd);
    expect(res.range.medianUsd).toBeGreaterThan(0);
    expect(res.keyTechMultipliers.length).toBeGreaterThan(0);
    expect(res.marketDemand).toBe('VERY_HOT');
  });

  it('TC-SAL-03: Đồ án Verified nâng cao Percentile Rank và kích hoạt phân vị P75 Proof-of-Work', () => {
    const resNoProjects = calculateSalaryBenchmark('Junior Frontend', 'junior', ['React'], 0);
    const resWithProjects = calculateSalaryBenchmark('Junior Frontend', 'junior', ['React'], 3);

    expect(resWithProjects.percentileRank).toBeGreaterThan(resNoProjects.percentileRank);
    expect(resWithProjects.recommendedOfferVnd).toBeGreaterThan(resNoProjects.recommendedOfferVnd);
    expect(resWithProjects.p75ProofOfWorkVnd).toBeGreaterThan(resWithProjects.range.medianVnd);
    expect(resWithProjects.negotiationTips.some(t => t.includes('3 đồ án'))).toBe(true);
  });

  it('TC-SAL-04: formatCurrencyVnd định dạng tiền tệ tiếng Việt chuẩn mực', () => {
    expect(formatCurrencyVnd(15000000)).toBe('15 Triệu VNĐ');
    expect(formatCurrencyVnd(35000000)).toBe('35 Triệu VNĐ');
    expect(formatCurrencyVnd(1200000000)).toBe('1.2 Tỷ VNĐ');
  });

  it('TC-SAL-05: Tích hợp dữ liệu thị trường thực tế (Real Market Spec) với Evidence Samples', () => {
    const res = calculateSalaryBenchmark('Node.js Backend Developer', 'fresher', ['Docker', 'PostgreSQL'], 2);

    expect(res.metadata.sources.length).toBeGreaterThanOrEqual(2);
    expect(res.metadata.totalJobsAnalyzed).toBeGreaterThan(1000);
    expect(res.metadata.sampleSize).toBeGreaterThan(0);
    expect(res.metadata.freshnessBadge).toContain('Dữ liệu');
    expect(res.evidenceSamples.length).toBeGreaterThan(0);
    expect(res.evidenceSamples[0].company_name).toBeDefined();
    expect(res.evidenceSamples[0].salary_min_vnd).toBeGreaterThan(0);
  });
});
