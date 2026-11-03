export interface SectionHeatmapItem {
  sectionId: string;
  name: string;
  percentage: number; // Tỷ lệ % thời gian HR dừng lại ở phần này
  dwellSeconds: number;
  isHotspot: boolean; // Điểm nóng được HR tập trung thẩm định nhiều nhất
  intensityColor: string; // Mã màu heatmap (đỏ/cam = hotspot, tím/xanh = standard)
}

export interface RecruiterActivityLog {
  id: string;
  recruiterName: string;
  company: string;
  logoText: string;
  viewedAt: string;
  durationSeconds: number;
  focusedSection: string;
  status: 'contacted' | 'shortlisted' | 'viewed';
}

export interface CvTrackingAnalyticsData {
  totalViews: number;
  uniqueRecruiters: number;
  avgDwellTimeSeconds: number;
  readThroughRate: number; // % đọc đến cuối CV
  heatmap: SectionHeatmapItem[];
  recentActivities: RecruiterActivityLog[];
  lastUpdated: string;
}

const STORAGE_KEY = 'profilehub_cv_view_analytics_data';
export const TRACKING_EVENT_NAME = 'profilehub_tracking_updated';

const DEFAULT_ANALYTICS_DATA: CvTrackingAnalyticsData = {
  totalViews: 0,
  uniqueRecruiters: 0,
  avgDwellTimeSeconds: 0,
  readThroughRate: 0,
  heatmap: [
    {
      sectionId: 'experience',
      name: 'Kinh Nghiệm Làm Việc',
      percentage: 0,
      dwellSeconds: 0,
      isHotspot: false,
      intensityColor: '#ef4444' // Đỏ rực
    },
    {
      sectionId: 'projects',
      name: 'Đồ Án & Bằng Chứng Thực Chiến',
      percentage: 0,
      dwellSeconds: 0,
      isHotspot: false,
      intensityColor: '#f97316' // Cam
    },
    {
      sectionId: 'skills',
      name: 'Kỹ Năng & Tech Stack',
      percentage: 0,
      dwellSeconds: 0,
      isHotspot: false,
      intensityColor: '#8b5cf6' // Tím
    },
    {
      sectionId: 'education',
      name: 'Học Vấn & GPA',
      percentage: 0,
      dwellSeconds: 0,
      isHotspot: false,
      intensityColor: '#3b82f6' // Xanh lam
    },
    {
      sectionId: 'certifications',
      name: 'Chứng Chỉ & Ngoại Ngữ',
      percentage: 0,
      dwellSeconds: 0,
      isHotspot: false,
      intensityColor: '#10b981' // Xanh lá
    }
  ],
  recentActivities: [],
  lastUpdated: new Date().toISOString()
};

/**
 * Lấy dữ liệu thống kê đo lường lượt xem và heatmap của CV
 */
export function getTrackingAnalytics(): CvTrackingAnalyticsData {
  if (typeof localStorage === 'undefined') return DEFAULT_ANALYTICS_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ANALYTICS_DATA));
      return DEFAULT_ANALYTICS_DATA;
    }
    const parsed = JSON.parse(raw);
    
    // Tự động dọn sạch nếu dữ liệu cũ còn mang các số liệu tĩnh giả lập (48 lượt xem, 14 công ty, 46 giây, 84% đọc hết)
    if (
      parsed.totalViews === 48 &&
      parsed.avgDwellTimeSeconds === 46 &&
      parsed.uniqueRecruiters === 14 &&
      parsed.readThroughRate === 84
    ) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ANALYTICS_DATA));
      return DEFAULT_ANALYTICS_DATA;
    }

    return parsed;
  } catch (err) {
    console.warn('Lỗi đọc dữ liệu CV tracking:', err);
    return DEFAULT_ANALYTICS_DATA;
  }
}

/**
 * Đặt lại toàn bộ dữ liệu đo lường tracking về trạng thái sạch ban đầu (0)
 */
export function resetTrackingAnalytics(): CvTrackingAnalyticsData {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ANALYTICS_DATA));
  }
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(TRACKING_EVENT_NAME, { detail: DEFAULT_ANALYTICS_DATA }));
  }
  return DEFAULT_ANALYTICS_DATA;
}

/**
 * Ghi nhận một lượt xem CV mới từ Nhà tuyển dụng thực tế
 */
export function recordCvView(params?: {
  recruiterCompany?: string;
  recruiterName?: string;
  durationSeconds?: number;
  focusedSection?: string;
}): CvTrackingAnalyticsData {
  const current = getTrackingAnalytics();
  const dur = params?.durationSeconds || Math.floor(Math.random() * 35) + 30; // 30 - 65s

  const newTotalViews = current.totalViews + 1;
  const newAvgDwell = Math.round(
    (current.avgDwellTimeSeconds * current.totalViews + dur) / newTotalViews
  );

  const company = params?.recruiterCompany || 'Doanh Nghiệp Công Nghệ Đối Tác';
  const name = params?.recruiterName || 'Talent Acquisition Team';
  const focused = params?.focusedSection || 'Đồ Án Thực Chiến & Tech Stack';

  const newLog: RecruiterActivityLog = {
    id: `act_${Date.now()}`,
    recruiterName: name,
    company: company,
    logoText: company.slice(0, 2).toUpperCase(),
    viewedAt: 'Vừa xong',
    durationSeconds: dur,
    focusedSection: focused,
    status: 'viewed'
  };

  const updatedActivities = [newLog, ...current.recentActivities.slice(0, 7)];
  const uniqueCompanies = new Set(updatedActivities.map(a => a.company));
  const newUniqueRecruiters = uniqueCompanies.size;

  // Tính tỷ lệ đọc hết trang: dựa trên các lượt đọc thực tế có thời lượng >= 35s
  const completedReads = updatedActivities.filter(a => a.durationSeconds >= 35).length;
  const newReadThroughRate = Math.min(100, Math.round((completedReads / updatedActivities.length) * 100));

  const updated: CvTrackingAnalyticsData = {
    ...current,
    totalViews: newTotalViews,
    uniqueRecruiters: newUniqueRecruiters,
    avgDwellTimeSeconds: newAvgDwell,
    readThroughRate: newReadThroughRate,
    recentActivities: updatedActivities,
    lastUpdated: new Date().toISOString()
  };

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(TRACKING_EVENT_NAME, { detail: updated }));
  }

  return updated;
}

/**
 * Ghi nhận thời gian dừng lại tại từng section cụ thể (Dwell Time Tracking)
 */
export function recordSectionDwellTime(sectionId: string, durationSeconds: number): CvTrackingAnalyticsData {
  const current = getTrackingAnalytics();
  const updatedHeatmap = current.heatmap.map(item => {
    if (item.sectionId === sectionId) {
      return {
        ...item,
        dwellSeconds: Math.round((item.dwellSeconds + durationSeconds) * 10) / 10
      };
    }
    return item;
  });

  // Tính lại tổng và tỷ lệ %
  const totalSeconds = updatedHeatmap.reduce((acc, i) => acc + i.dwellSeconds, 0);
  const maxDwell = Math.max(...updatedHeatmap.map(i => i.dwellSeconds), 0);
  const rebalanced = updatedHeatmap.map(item => ({
    ...item,
    percentage: totalSeconds > 0 ? Math.round((item.dwellSeconds / totalSeconds) * 100) : 0,
    isHotspot: totalSeconds > 0 && item.dwellSeconds === maxDwell && item.dwellSeconds >= 5
  }));

  const updated: CvTrackingAnalyticsData = {
    ...current,
    heatmap: rebalanced,
    lastUpdated: new Date().toISOString()
  };

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(TRACKING_EVENT_NAME, { detail: updated }));
  }

  return updated;
}
