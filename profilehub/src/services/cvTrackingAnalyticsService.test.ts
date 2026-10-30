import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getTrackingAnalytics, 
  recordCvView, 
  recordSectionDwellTime 
} from './cvTrackingAnalyticsService';

// Mock localStorage cho Node/Vitest
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

const mockStorage = new LocalStorageMock();
vi.stubGlobal('localStorage', mockStorage);

describe('Tầng Đo Lường CV Tracking & Heatmap Seam', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('TC-TRACK-01: Khởi tạo dữ liệu tracking mặc định hợp lệ', () => {
    const data = getTrackingAnalytics();
    expect(data.totalViews).toBeGreaterThan(0);
    expect(data.avgDwellTimeSeconds).toBeGreaterThan(0);
    expect(data.heatmap.length).toBeGreaterThanOrEqual(4);
    expect(data.recentActivities.length).toBeGreaterThan(0);

    const expHotspot = data.heatmap.find(h => h.sectionId === 'experience');
    expect(expHotspot?.isHotspot).toBe(true);
    expect(expHotspot?.percentage).toBeGreaterThan(30);
  });

  it('TC-TRACK-02: recordCvView tăng lượt xem và cập nhật nhật ký nhà tuyển dụng', () => {
    const initial = getTrackingAnalytics();
    const updated = recordCvView({
      recruiterCompany: 'Tech Corp Vietnam',
      recruiterName: 'Nguyen HR',
      durationSeconds: 50,
      focusedSection: 'Dự án thực tế'
    });

    expect(updated.totalViews).toBe(initial.totalViews + 1);
    expect(updated.recentActivities[0].company).toBe('Tech Corp Vietnam');
    expect(updated.recentActivities[0].durationSeconds).toBe(50);
  });

  it('TC-TRACK-03: recordSectionDwellTime cập nhật thời gian dừng và tính lại tỷ lệ phần trăm heatmap', () => {
    const initial = getTrackingAnalytics();
    const updated = recordSectionDwellTime('projects', 30);

    const projectHeatmap = updated.heatmap.find(h => h.sectionId === 'projects');
    expect(projectHeatmap?.dwellSeconds).toBeGreaterThan(initial.heatmap.find(h => h.sectionId === 'projects')!.dwellSeconds);
    
    // Tổng % các phần phải xấp xỉ 100%
    const sumPct = updated.heatmap.reduce((acc, h) => acc + h.percentage, 0);
    expect(sumPct).toBeGreaterThanOrEqual(98);
    expect(sumPct).toBeLessThanOrEqual(102);
  });
});
