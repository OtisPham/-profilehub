import { describe, it, expect } from 'vitest';
import { exportRecommendationToMarkdown } from './markdownExporter';
import type { AIProjectRecommendation } from '../services/aiRecommendationService';

describe('Markdown Exporter Seam', () => {
  it('TC-MD-01: Định dạng markdown chính xác các trường blind spot, email HR và checklist', () => {
    const sampleRec: AIProjectRecommendation = {
      id: 'rec-test-101',
      title: 'Xây Dựng System Caching High Throughput',
      target_blind_spot: 'SQL Indexing & Redis Caching',
      rationale: 'Dựa trên đánh giá từ HR Lead (hr.tech@vng.com.vn): Cần nâng cao kỹ năng truy vấn SQL.',
      recruiter_source: 'HR Lead (hr.tech@vng.com.vn) • VNG Corporation',
      recommended_tech_stack: ['Node.js', 'Redis', 'PostgreSQL'],
      difficulty: 'Nâng cao',
      estimated_duration: '7 - 10 ngày',
      feature_backlog: [
        'Thiết kế B-Tree Index cho bảng lớn',
        'Tích hợp Redis Read-Through Cache'
      ],
      definition_of_done: [
        'Response time < 30ms dưới tải 500 RPS'
      ],
      created_at: '2026-09-23T14:00:00.000Z'
    };

    const mdResult = exportRecommendationToMarkdown(sampleRec);

    expect(mdResult).toContain('SQL Indexing & Redis Caching');
    expect(mdResult).toContain('hr.tech@vng.com.vn');
    expect(mdResult).toContain('[ ] **Thiết kế B-Tree Index cho bảng lớn**');
  });
});

