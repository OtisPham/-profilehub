import { describe, it, expect, beforeEach, vi } from 'vitest';
import { starDefenseService } from './starDefenseService';
import type { ProjectItem } from '../types/cvSection';

// Mock localStorage environment for Vitest Node.js runner
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('starDefenseService', () => {
  let mockStorage: LocalStorageMock;

  beforeEach(() => {
    mockStorage = new LocalStorageMock();
    vi.stubGlobal('localStorage', mockStorage);
    vi.stubGlobal('window', { localStorage: mockStorage });
  });

  describe('generateBulletDefense', () => {
    it('trích xuất chính xác số liệu % và công cụ đo đạc thực tế', () => {
      const bullet = 'Tối ưu hóa render component giảm 35% thời gian phản hồi bằng React memo';
      const result = starDefenseService.generateBulletDefense(bullet, {
        projectName: 'E-commerce App',
        technologies: ['React', 'TypeScript']
      });

      expect(result.bulletText).toBe(bullet);
      expect(result.metricBasis).toBeDefined();
      expect(result.metricBasis?.metricText).toBe('35%');
      expect(result.metricBasis?.measurementTool).toContain('DevTools');
      expect(result.metricBasis?.beforeMetric).toContain('Baseline ban đầu');
      expect(result.metricBasis?.afterMetric).toContain('35%');
      expect(result.trapQuestions.length).toBeGreaterThanOrEqual(2);
    });

    it('nhận diện chính xác công nghệ và câu hỏi bẫy kỹ thuật chuyên sâu (Redis)', () => {
      const bullet = 'Thiết lập hệ thống Redis cache giúp giảm tải cho cơ sở dữ liệu';
      const result = starDefenseService.generateBulletDefense(bullet);

      expect(result.detectedTechs).toContain('redis');
      const hasTtlOrInvalidationQuestion = result.trapQuestions.some(
        q => q.question.toLowerCase().includes('ttl') || q.question.toLowerCase().includes('cache')
      );
      expect(hasTtlOrInvalidationQuestion).toBe(true);
      expect(result.trapQuestions[0].modelAnswer).toBeDefined();
      expect(result.trapQuestions[0].pitfallToAvoid).toBeDefined();
    });

    it('quét và phát hiện các buzzword nhạy cảm đao to búa lớn (Microservices)', () => {
      const bullet = 'Thiết kế kiến trúc Microservices với 99.99% uptime cho hệ thống đặt vé';
      const result = starDefenseService.generateBulletDefense(bullet);

      expect(result.redFlags.length).toBeGreaterThanOrEqual(2);
      const terms = result.redFlags.map(r => r.term);
      expect(terms).toContain('Microservices');
      expect(terms).toContain('99.99% Uptime');
      expect(result.redFlags[0].suggestedReplacement).toBeDefined();
    });

    it('xử lý an toàn câu mô tả thuần tính năng không có số liệu định lượng', () => {
      const bullet = 'Xây dựng giao diện responsive cho trang hồ sơ sinh viên';
      const result = starDefenseService.generateBulletDefense(bullet);

      expect(result.metricBasis).toBeDefined();
      expect(result.metricBasis?.metricText).toContain('Số liệu định tính');
      expect(result.trapQuestions.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Candidate Defense Notes (LocalStorage)', () => {
    it('lưu và khôi phục ghi chú cá nhân của ứng viên an toàn', () => {
      const bulletId = 'defense_proj_test_01';
      const note = 'Mình đo trực tiếp trên máy Macbook Air M1 mạng wifi nhà 50Mbps';

      starDefenseService.saveCandidateDefenseNote(bulletId, note, 'student_001');
      const allNotes = starDefenseService.getCandidateDefenseNotes('student_001');

      expect(allNotes[bulletId]).toBe(note);

      // Verify that another user does not see this note (data isolation)
      const user2Notes = starDefenseService.getCandidateDefenseNotes('student_002');
      expect(user2Notes[bulletId]).toBeUndefined();
    });
  });

  describe('generateProjectDefenseOverview', () => {
    it('tổng hợp toàn bộ gạch đầu dòng của đồ án và tính điểm sẵn sàng', () => {
      const mockProject: ProjectItem = {
        id: 'proj_ecommerce',
        projectName: 'Hệ Thống Bán Hàng E-Commerce',
        role: 'Fullstack Developer',
        startDate: '2025-01',
        endDate: '2025-06',
        description: 'Mô tả dự án thương mại điện tử',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
        bullets: [
          'Tối ưu hóa thời gian tải trang giảm 40% bằng lazy loading',
          'Thiết lập Redis cache cho giỏ hàng giảm 60% truy vấn database',
          'Áp dụng kiến trúc Microservices phức tạp'
        ]
      };

      const overview = starDefenseService.generateProjectDefenseOverview(mockProject);

      expect(overview.projectId).toBe('proj_ecommerce');
      expect(overview.defenseItems.length).toBe(3);
      expect(overview.totalTrapQuestions).toBeGreaterThanOrEqual(6);
      expect(overview.highRiskCount).toBeGreaterThanOrEqual(1); // Due to 'Microservices'
      expect(overview.overallReadinessScore).toBeLessThan(95); // Penalized due to high risk
    });
  });

  describe('exportDefenseCheatSheetMarkdown', () => {
    it('xuất ra định dạng Markdown chuẩn với đầy đủ các đề mục', () => {
      const item = starDefenseService.generateBulletDefense(
        'Tối ưu hóa query database giảm 45% bằng B-Tree Index trên PostgreSQL',
        { technologies: ['PostgreSQL'] }
      );

      const md = starDefenseService.exportDefenseCheatSheetMarkdown([item], 'Phao Cứu Sinh Test');

      expect(md).toContain('# 🛡️ Phao Cứu Sinh Test');
      expect(md).toContain('Cơ Sở Số Liệu & Công Cụ Đo Đạc:');
      expect(md).toContain('Top Câu Hỏi Bẫy & Kịch Bản Trả Lời 30s:');
      expect(md).toContain('PostgreSQL');
    });
  });
});
