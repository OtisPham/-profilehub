import { describe, it, expect } from 'vitest';
import { CORE_PILLARS, BEFORE_AFTER_COMPARISON, TRUST_METRICS } from './homePageData';

describe('HomePage Data Contracts & Value Propositions', () => {
  it('TC-HOME-01: Định nghĩa đủ 4 trụ cột cốt lõi dựa trên bằng chứng kiểm chứng được', () => {
    expect(CORE_PILLARS).toHaveLength(4);
    
    const titles = CORE_PILLARS.map(p => p.title);
    expect(titles.some(t => t.includes('GitHub'))).toBe(true);
    expect(titles.some(t => t.includes('Zero Fake Metrics') || t.includes('Anti-Hallucination'))).toBe(true);
    expect(titles.some(t => t.includes('A4') || t.includes('Page-Budget'))).toBe(true);
    expect(titles.some(t => t.includes('Phòng Thủ') || t.includes('Defense'))).toBe(true);
  });

  it('TC-HOME-02: Bảng so sánh đối kháng làm nổi bật sự khác biệt giữa CV thường và CV ProfileHub', () => {
    expect(BEFORE_AFTER_COMPARISON.length).toBeGreaterThanOrEqual(4);
    
    // Mỗi tiêu chí phải có cả 2 vế: conventional vs profilehub
    BEFORE_AFTER_COMPARISON.forEach(row => {
      expect(row.criterion).toBeTruthy();
      expect(row.conventional).toBeTruthy();
      expect(row.profileHub).toBeTruthy();
    });
  });

  it('TC-HOME-03: Cam kết chất lượng chuẩn ATS và khổ in A4', () => {
    expect(TRUST_METRICS.length).toBeGreaterThanOrEqual(3);
    const metricTexts = TRUST_METRICS.map(m => m.label);
    expect(metricTexts.some(m => m.includes('Anti-Hallucination'))).toBe(true);
    expect(metricTexts.some(m => m.includes('A4'))).toBe(true);
  });
});
