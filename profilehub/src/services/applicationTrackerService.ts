import type { 
  CandidateApplicationItem, 
  ApplicationStage, 
  ApplicationAnalyticsData 
} from '../types/application.types';
import { selfInterviewService } from './selfInterviewService';

export const APPLICATION_EVENT_NAME = 'application_pipeline_updated';

const getStorageKey = (userId?: string): string => {
  return userId ? `profilehub_applications_${userId}` : 'profilehub_applications_default';
};

const safeGetItem = (key: string): string | null => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key);
};

const safeSetItem = (key: string, value: string): void => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, value);
};

const safeDispatch = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event(APPLICATION_EVENT_NAME));
    window.dispatchEvent(new Event('storage'));
  } catch {
    // Ignore in non-browser env
  }
};

const INITIAL_MOCK_APPLICATIONS: CandidateApplicationItem[] = [
  {
    id: 'app_vng_01',
    userId: 'default',
    companyName: 'VNG Corporation',
    roleTitle: 'Frontend ReactJS Fresher',
    salaryExpectation: '12 - 15 Triệu',
    jobLocation: 'TP. Hồ Chí Minh',
    applicationSource: 'profilehub',
    linkedCvTitle: 'CV Chuyên Ngành Frontend React',
    stage: 'interview',
    appliedDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    interviewDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0] + ' 14:00',
    notes: 'HR hẹn phỏng vấn vòng 2 Kỹ thuật. Đã chuẩn bị demo đồ án ProfileHub.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app_fpt_02',
    userId: 'default',
    companyName: 'FPT Software',
    roleTitle: 'Node.js Backend Developer Intern',
    salaryExpectation: '8 - 10 Triệu',
    jobLocation: 'Hà Nội / Hybrid',
    applicationSource: 'topcv',
    linkedCvTitle: 'CV Backend Node.js & Microservices',
    stage: 'assessment',
    appliedDate: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    notes: 'Đang làm bài Take-home test xây dựng REST API bằng Express & Prisma.',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app_momo_03',
    userId: 'default',
    companyName: 'MoMo (M-Service)',
    roleTitle: 'Junior Web Fullstack Engineer',
    salaryExpectation: '14 - 18 Triệu',
    jobLocation: 'TP. Hồ Chí Minh',
    applicationSource: 'itviec',
    linkedCvTitle: 'CV Fullstack Engineer Tiêu Chuẩn',
    stage: 'applied',
    appliedDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    notes: 'Đã nộp qua ITviec, đang chờ HR phản hồi duyệt hồ sơ.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'app_viettel_04',
    userId: 'default',
    companyName: 'Viettel Digital',
    roleTitle: 'Frontend Engineer (Vue/React)',
    salaryExpectation: '15 - 20 Triệu',
    jobLocation: 'Hà Nội',
    applicationSource: 'linkedin',
    linkedCvTitle: 'CV Chuyên Ngành Frontend React',
    stage: 'offer',
    appliedDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    notes: 'Đã nhận Offer chính thức! Đang xem xét chế độ đãi ngộ.',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const applicationTrackerService = {
  getApplications(userId?: string): CandidateApplicationItem[] {
    try {
      const key = getStorageKey(userId);
      const raw = safeGetItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Khởi tạo mock data ban đầu nếu chưa có dữ liệu
      const fallbackList = INITIAL_MOCK_APPLICATIONS.map(item => ({
        ...item,
        userId: userId || 'default'
      }));
      safeSetItem(key, JSON.stringify(fallbackList));
      return fallbackList;
    } catch (e) {
      console.warn('[applicationTrackerService] Error loading applications:', e);
      return INITIAL_MOCK_APPLICATIONS;
    }
  },

  createApplication(
    data: Omit<CandidateApplicationItem, 'id' | 'createdAt' | 'updatedAt'>,
    userId?: string
  ): CandidateApplicationItem {
    const list = this.getApplications(userId);
    const now = new Date().toISOString();
    const newItem: CandidateApplicationItem = {
      ...data,
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      userId: userId || data.userId || 'default',
      createdAt: now,
      updatedAt: now
    };

    const updatedList = [newItem, ...list];
    this.saveApplications(updatedList, userId);

    // Tự động đồng bộ lịch phỏng vấn nếu có
    if (newItem.stage === 'interview' && newItem.interviewDate) {
      this.syncToSelfInterview(newItem);
    }

    return newItem;
  },

  updateStage(id: string, stage: ApplicationStage, userId?: string): boolean {
    const list = this.getApplications(userId);
    const targetIndex = list.findIndex(item => item.id === id);
    if (targetIndex === -1) return false;

    const existing = list[targetIndex];
    const updatedItem: CandidateApplicationItem = {
      ...existing,
      stage,
      updatedAt: new Date().toISOString()
    };

    list[targetIndex] = updatedItem;
    this.saveApplications(list, userId);

    // Khi chuyển sang trạng thái phỏng vấn, đồng bộ vào War Room
    if (stage === 'interview') {
      this.syncToSelfInterview(updatedItem);
    }

    return true;
  },

  updateApplication(id: string, patch: Partial<CandidateApplicationItem>, userId?: string): boolean {
    const list = this.getApplications(userId);
    const targetIndex = list.findIndex(item => item.id === id);
    if (targetIndex === -1) return false;

    const updatedItem: CandidateApplicationItem = {
      ...list[targetIndex],
      ...patch,
      updatedAt: new Date().toISOString()
    };

    list[targetIndex] = updatedItem;
    this.saveApplications(list, userId);

    if (updatedItem.stage === 'interview' && updatedItem.interviewDate) {
      this.syncToSelfInterview(updatedItem);
    }

    return true;
  },

  deleteApplication(id: string, userId?: string): boolean {
    const list = this.getApplications(userId);
    const filtered = list.filter(item => item.id !== id);
    if (filtered.length === list.length) return false;

    this.saveApplications(filtered, userId);
    return true;
  },

  getAnalytics(userId?: string): ApplicationAnalyticsData {
    const list = this.getApplications(userId);
    const total = list.length;
    if (total === 0) {
      return { total: 0, active: 0, interviews: 0, offers: 0, responseRate: 0 };
    }

    const activeStages: ApplicationStage[] = ['applied', 'screening', 'assessment', 'interview'];
    const active = list.filter(item => activeStages.includes(item.stage)).length;
    const interviews = list.filter(item => item.stage === 'interview').length;
    const offers = list.filter(item => item.stage === 'offer').length;

    // Tỷ lệ có phản hồi: Có bước tiếp sau 'applied'
    const responded = list.filter(item => item.stage !== 'applied').length;
    const responseRate = Math.round((responded / total) * 100);

    return { total, active, interviews, offers, responseRate };
  },

  saveApplications(items: CandidateApplicationItem[], userId?: string): void {
    try {
      const key = getStorageKey(userId);
      safeSetItem(key, JSON.stringify(items));
      safeDispatch();
    } catch (e) {
      console.error('[applicationTrackerService] Failed to save applications:', e);
    }
  },

  syncToSelfInterview(app: CandidateApplicationItem): void {
    try {
      const dateStr = app.interviewDate 
        ? app.interviewDate.split(' ')[0] 
        : new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const timeStr = app.interviewDate && app.interviewDate.includes(' ')
        ? app.interviewDate.split(' ')[1]
        : '09:00';

      selfInterviewService.createSession({
        company_name: app.companyName,
        role_title: app.roleTitle,
        interview_date: dateStr,
        interview_time: timeStr,
        format: 'online',
        stage: 'technical',
        linked_cv_id: app.linkedCvId,
        personal_notes: app.notes || `Đồng bộ tự động từ Kanban Ứng tuyển (${app.companyName})`
      });
    } catch (e) {
      console.warn('[applicationTrackerService] Could not auto-sync interview:', e);
    }
  }
};
