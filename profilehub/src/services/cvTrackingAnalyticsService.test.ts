import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getTrackingAnalytics, 
  recordCvView, 
  recordSectionDwellTime,
  resetTrackingAnalytics 
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

  it('TC-TRACK-01: Khởi tạo dữ liệu tracking mặc định ở trạng thái sạch ban đầu (0)', () => {
    const data = getTrackingAnalytics();
    expect(data.totalViews).toBe(0);
    expect(data.uniqueRecruiters).toBe(0);
    expect(data.avgDwellTimeSeconds).toBe(0);
    expect(data.readThroughRate).toBe(0);
    expect(data.heatmap.length).toBeGreaterThanOrEqual(4);
    expect(data.recentActivities.length).toBe(0);

    const expHotspot = data.heatmap.find(h => h.sectionId === 'experience');
    expect(expHotspot?.isHotspot).toBe(false);
    expect(expHotspot?.percentage).toBe(0);
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
    expect(updated.uniqueRecruiters).toBe(1);
    expect(updated.recentActivities[0].company).toBe('Tech Corp Vietnam');
    expect(updated.recentActivities[0].durationSeconds).toBe(50);
    expect(updated.readThroughRate).toBeGreaterThan(0);
  });

  it('TC-TRACK-03: recordSectionDwellTime cập nhật thời gian dừng và tính lại tỷ lệ phần trăm heatmap', () => {
    const initial = getTrackingAnalytics();
    const updated = recordSectionDwellTime('projects', 30);

    const projectHeatmap = updated.heatmap.find(h => h.sectionId === 'projects');
    expect(projectHeatmap?.dwellSeconds).toBeGreaterThan(0);
    
    // Tổng % các phần phải xấp xỉ 100% khi đã có dữ liệu dừng
    const sumPct = updated.heatmap.reduce((acc, h) => acc + h.percentage, 0);
    expect(sumPct).toBeGreaterThanOrEqual(98);
    expect(sumPct).toBeLessThanOrEqual(102);
    expect(projectHeatmap?.isHotspot).toBe(true);
  });

  it('TC-TRACK-04: resetTrackingAnalytics xóa sạch dữ liệu và trả về 0', () => {
    recordCvView({ recruiterCompany: 'Tech Corp Vietnam' });
    const cleared = resetTrackingAnalytics();
    expect(cleared.totalViews).toBe(0);
    expect(cleared.uniqueRecruiters).toBe(0);
    expect(cleared.avgDwellTimeSeconds).toBe(0);
    expect(cleared.readThroughRate).toBe(0);
    expect(cleared.recentActivities.length).toBe(0);
  });
});
