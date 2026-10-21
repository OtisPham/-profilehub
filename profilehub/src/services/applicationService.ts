export type StudentApplicationStatus = 
  | 'saved' 
  | 'preparing' 
  | 'applied' 
  | 'hr_interview' 
  | 'tech_interview' 
  | 'final_interview' 
  | 'offer' 
  | 'rejected' 
  | 'withdrawn';

export interface StatusHistoryEntry {
  fromStatus: StudentApplicationStatus;
  toStatus: StudentApplicationStatus;
  changedAt: string;
  note?: string;
  source: 'kanban' | 'detail' | 'auto_apply';
}

export interface InterviewSchedule {
  id: string;
  roundType: 'hr' | 'technical' | 'final' | 'other';
  interviewDate: string; // YYYY-MM-DD
  interviewTime?: string; // HH:mm
  format: 'online' | 'offline';
  meetingLink?: string;
  location?: string;
  interviewer?: string;
  notes?: {
    questions?: string[];
    myAnswers?: string;
    feedback?: string;
    selfReview?: string;
    nextSteps?: string;
  };
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

export interface StudentApplication {
  id: string;
  studentId: string;
  companyName: string;
  position: string;
  jobDescription?: string;
  jobUrl?: string;
  source?: string; // LinkedIn, TopCV, ProfileHub, etc.
  appliedDate?: string;
  status: StudentApplicationStatus;
  isArchived?: boolean;
  priority?: 'high' | 'medium' | 'low';
  cvId?: string;
  cvTitle?: string;
  cvSnapshot?: any; // Snapshot data of the CV at application time
  salaryRange?: string;
  notes?: string;
  statusHistory: StatusHistoryEntry[];
  interviews: InterviewSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationAnalyticsSummary {
  total: number;
  saved: number;
  preparing: number;
  applied: number;
  interviewing: number;
  offers: number;
  rejected: number;
  withdrawn: number;
  interviewRate: number; // percentage (interviewing + offers + rejected after interview) / applied
  offerRate: number; // percentage offers / applied
}

const SHARED_KEY = 'profilehub_student_applications_shared';

class ApplicationService {
  private getStorageKey(studentId?: string): string {
    return studentId ? `profilehub_student_applications_${studentId}` : SHARED_KEY;
  }

  public getApplications(studentId?: string, includeArchived = false): StudentApplication[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const key = this.getStorageKey(studentId);
      let raw = localStorage.getItem(key);
      if (!raw && studentId) {
        raw = localStorage.getItem(SHARED_KEY);
      }
      if (!raw) return [];
      const list: StudentApplication[] = JSON.parse(raw);
      if (!Array.isArray(list)) return [];
      return includeArchived ? list : list.filter(item => !item.isArchived);
    } catch {
      return [];
    }
  }

  public saveApplications(list: StudentApplication[], studentId?: string): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const key = this.getStorageKey(studentId);
      const jsonStr = JSON.stringify(list);
      localStorage.setItem(key, jsonStr);
      localStorage.setItem(SHARED_KEY, jsonStr);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.error('[ApplicationService] Lỗi lưu hồ sơ ứng tuyển:', e);
    }
  }

  public getApplicationById(id: string, studentId?: string): StudentApplication | null {
    const list = this.getApplications(studentId, true);
    return list.find(app => app.id === id) || null;
  }

  public createApplication(
    data: Omit<StudentApplication, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'interviews'>,
    initialNote?: string,
    source: 'kanban' | 'detail' | 'auto_apply' = 'detail'
  ): StudentApplication {
    const now = new Date().toISOString();
    const newId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const initialHistory: StatusHistoryEntry[] = [{
      fromStatus: data.status,
      toStatus: data.status,
      changedAt: now,
      note: initialNote || 'Tạo mới hồ sơ ứng tuyển',
      source
    }];

    const newApp: StudentApplication = {
      ...data,
      id: newId,
      statusHistory: initialHistory,
      interviews: [],
      createdAt: now,
      updatedAt: now,
    };

    const currentList = this.getApplications(data.studentId, true);
    const updatedList = [newApp, ...currentList];
    this.saveApplications(updatedList, data.studentId);
    return newApp;
  }

  public updateApplication(
    id: string, 
    updates: Partial<Omit<StudentApplication, 'id' | 'createdAt'>>,
    studentId?: string
  ): StudentApplication | null {
    const list = this.getApplications(studentId, true);
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const now = new Date().toISOString();

    const updatedApp: StudentApplication = {
      ...existing,
      ...updates,
      updatedAt: now
    };

    list[index] = updatedApp;
    this.saveApplications(list, studentId || existing.studentId);
    return updatedApp;
  }

  public updateStatus(
    id: string,
    newStatus: StudentApplicationStatus,
    note?: string,
    source: 'kanban' | 'detail' | 'auto_apply' = 'kanban',
    studentId?: string
  ): StudentApplication | null {
    const list = this.getApplications(studentId, true);
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return null;

    const existing = list[index];
    if (existing.status === newStatus) return existing;

    const now = new Date().toISOString();
    const historyEntry: StatusHistoryEntry = {
      fromStatus: existing.status,
      toStatus: newStatus,
      changedAt: now,
      note: note || `Chuyển trạng thái sang ${newStatus}`,
      source
    };

    const updatedApp: StudentApplication = {
      ...existing,
      status: newStatus,
      appliedDate: (newStatus === 'applied' && !existing.appliedDate) ? now.split('T')[0] : existing.appliedDate,
      statusHistory: [historyEntry, ...(existing.statusHistory || [])],
      updatedAt: now
    };

    list[index] = updatedApp;
    this.saveApplications(list, studentId || existing.studentId);
    return updatedApp;
  }

  public toggleArchive(id: string, studentId?: string): StudentApplication | null {
    const list = this.getApplications(studentId, true);
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return null;

    const existing = list[index];
    const updatedApp: StudentApplication = {
      ...existing,
      isArchived: !existing.isArchived,
      updatedAt: new Date().toISOString()
    };

    list[index] = updatedApp;
    this.saveApplications(list, studentId || existing.studentId);
    return updatedApp;
  }

  public deleteApplication(id: string, studentId?: string): boolean {
    const list = this.getApplications(studentId, true);
    const filtered = list.filter(a => a.id !== id);
    if (filtered.length === list.length) return false;
    this.saveApplications(filtered, studentId);
    return true;
  }

  public addInterview(
    applicationId: string,
    interviewData: Omit<InterviewSchedule, 'id'>,
    studentId?: string
  ): StudentApplication | null {
    const list = this.getApplications(studentId, true);
    const index = list.findIndex(a => a.id === applicationId);
    if (index === -1) return null;

    const existing = list[index];
    const newInterviewId = `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newInterview: InterviewSchedule = {
      ...interviewData,
      id: newInterviewId
    };

    const updatedInterviews = [newInterview, ...(existing.interviews || [])];
    
    // Tự động thăng cấp trạng thái nếu đang ở Applied
    let newStatus = existing.status;
    let history = existing.statusHistory || [];
    if (existing.status === 'applied' || existing.status === 'preparing') {
      newStatus = interviewData.roundType === 'technical' ? 'tech_interview' : 'hr_interview';
      history = [{
        fromStatus: existing.status,
        toStatus: newStatus,
        changedAt: new Date().toISOString(),
        note: `Tự động chuyển trạng thái khi lên lịch phỏng vấn (${interviewData.roundType})`,
        source: 'detail'
      }, ...history];
    }

    const updatedApp: StudentApplication = {
      ...existing,
      status: newStatus,
      statusHistory: history,
      interviews: updatedInterviews,
      updatedAt: new Date().toISOString()
    };

    list[index] = updatedApp;
    this.saveApplications(list, studentId || existing.studentId);
    return updatedApp;
  }

  public updateInterviewNotes(
    applicationId: string,
    interviewId: string,
    notes: InterviewSchedule['notes'],
    studentId?: string
  ): StudentApplication | null {
    const list = this.getApplications(studentId, true);
    const index = list.findIndex(a => a.id === applicationId);
    if (index === -1) return null;

    const existing = list[index];
    const interviews = (existing.interviews || []).map(item => {
      if (item.id === interviewId) {
        return {
          ...item,
          notes: {
            ...item.notes,
            ...notes
          }
        };
      }
      return item;
    });

    const updatedApp: StudentApplication = {
      ...existing,
      interviews,
      updatedAt: new Date().toISOString()
    };

    list[index] = updatedApp;
    this.saveApplications(list, studentId || existing.studentId);
    return updatedApp;
  }

  public computeAnalytics(studentId?: string): ApplicationAnalyticsSummary {
    const apps = this.getApplications(studentId, false);
    const total = apps.length;

    let saved = 0;
    let preparing = 0;
    let applied = 0;
    let interviewing = 0;
    let offers = 0;
    let rejected = 0;
    let withdrawn = 0;

    apps.forEach(app => {
      switch (app.status) {
        case 'saved':
          saved++;
          break;
        case 'preparing':
          preparing++;
          break;
        case 'applied':
          applied++;
          break;
        case 'hr_interview':
        case 'tech_interview':
        case 'final_interview':
          interviewing++;
          break;
        case 'offer':
          offers++;
          break;
        case 'rejected':
          rejected++;
          break;
        case 'withdrawn':
          withdrawn++;
          break;
      }
    });

    const totalAppliedOrBeyond = applied + interviewing + offers + rejected;
    const totalReachedInterview = interviewing + offers;

    const interviewRate = totalAppliedOrBeyond > 0 
      ? Math.round((totalReachedInterview / totalAppliedOrBeyond) * 100)
      : 0;

    const offerRate = totalAppliedOrBeyond > 0
      ? Math.round((offers / totalAppliedOrBeyond) * 100)
      : 0;

    return {
      total,
      saved,
      preparing,
      applied,
      interviewing,
      offers,
      rejected,
      withdrawn,
      interviewRate,
      offerRate
    };
  }
}

export const applicationService = new ApplicationService();
