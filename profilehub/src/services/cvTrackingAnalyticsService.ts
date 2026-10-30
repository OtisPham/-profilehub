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
  totalViews: 48,
  uniqueRecruiters: 14,
  avgDwellTimeSeconds: 46,
  readThroughRate: 84,
  heatmap: [
    {
      sectionId: 'experience',
      name: 'Kinh Nghiệm Làm Việc',
      percentage: 42,
      dwellSeconds: 19.3,
      isHotspot: true,
      intensityColor: '#ef4444' // Đỏ rực - Hotspot #1
    },
    {
      sectionId: 'projects',
      name: 'Đồ Án & Bằng Chứng Thực Chiến',
      percentage: 33,
      dwellSeconds: 15.2,
      isHotspot: true,
      intensityColor: '#f97316' // Cam - Hotspot #2
    },
    {
      sectionId: 'skills',
      name: 'Kỹ Năng & Tech Stack',
      percentage: 14,
      dwellSeconds: 6.4,
      isHotspot: false,
      intensityColor: '#8b5cf6' // Tím
    },
    {
      sectionId: 'education',
      name: 'Học Vấn & GPA',
      percentage: 7,
      dwellSeconds: 3.2,
      isHotspot: false,
      intensityColor: '#3b82f6' // Xanh lam
    },
    {
      sectionId: 'certifications',
      name: 'Chứng Chỉ & Ngoại Ngữ',
      percentage: 4,
      dwellSeconds: 1.9,
      isHotspot: false,
      intensityColor: '#10b981' // Xanh lá
    }
  ],
  recentActivities: [
    {
      id: 'act-1',
      recruiterName: 'Lê Thu Hương (Senior Tech Recruiter)',
      company: 'Shopee Vietnam',
      logoText: 'SP',
      viewedAt: '15 phút trước',
      durationSeconds: 58,
      focusedSection: 'Đồ Án: Microservices High-Throughput Platform',
      status: 'shortlisted'
    },
    {
      id: 'act-2',
      recruiterName: 'Trần Minh Quân (Head of Engineering)',
      company: 'Techcombank Digital Lab',
      logoText: 'TCB',
      viewedAt: '2 giờ trước',
      durationSeconds: 64,
      focusedSection: 'Kinh nghiệm: Thiết kế RESTful API & PostgreSQL Index',
      status: 'contacted'
    },
    {
      id: 'act-3',
      recruiterName: 'Nguyễn Phương Thảo (Talent Acquisition)',
      company: 'Viettel Solutions',
      logoText: 'VTS',
      viewedAt: 'Hôm qua, 14:30',
      durationSeconds: 39,
      focusedSection: 'Kỹ năng: React, Node.js, Docker, CI/CD',
      status: 'viewed'
    },
    {
      id: 'act-4',
      recruiterName: 'Phạm Đức Trọng (Engineering Lead)',
      company: 'FPT Software Global',
      logoText: 'FPT',
      viewedAt: '2 ngày trước',
      durationSeconds: 42,
      focusedSection: 'Đồ Án: Realtime Collaborative Canvas',
      status: 'viewed'
    }
  ],
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
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Lỗi đọc dữ liệu CV tracking:', err);
    return DEFAULT_ANALYTICS_DATA;
  }
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

  const updated: CvTrackingAnalyticsData = {
    ...current,
    totalViews: newTotalViews,
    uniqueRecruiters: params?.recruiterCompany ? current.uniqueRecruiters + 1 : current.uniqueRecruiters,
    avgDwellTimeSeconds: newAvgDwell,
    recentActivities: [newLog, ...current.recentActivities.slice(0, 8)],
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
  const rebalanced = updatedHeatmap.map(item => ({
    ...item,
    percentage: totalSeconds > 0 ? Math.round((item.dwellSeconds / totalSeconds) * 100) : item.percentage
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
