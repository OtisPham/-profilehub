import { cvService, type ManagedCVItem } from './cvService';

export type InterviewStageType = 'hr_screen' | 'technical' | 'culture_final' | 'other';
export type InterviewStatusType = 'upcoming' | 'completed' | 'passed' | 'rejected' | 'cancelled';
export type InterviewSourceType = 'self_logged' | 'recruiter_invited';

export interface CandidateInterviewSession {
  id: string;
  student_id?: string;
  company_name: string;
  role_title: string;
  interview_date: string; // YYYY-MM-DD
  interview_time: string; // HH:mm
  format: 'online' | 'offline';
  meeting_link?: string;
  location_address?: string;
  stage: InterviewStageType;
  linked_cv_id?: string;
  linked_cv_title?: string;
  target_tech_stack?: string[];
  primary_project_name?: string;
  personal_notes?: string;
  status: InterviewStatusType;
  source: InterviewSourceType;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'profilehub_interview_sessions';

const DEFAULT_SAMPLE_SESSION: CandidateInterviewSession = {
  id: 'session_sample_fpt_01',
  company_name: 'FPT Software',
  role_title: 'Frontend ReactJS Fresher',
  interview_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Ngày mai
  interview_time: '09:30',
  format: 'online',
  meeting_link: 'https://meet.google.com/abc-fpt-tech',
  location_address: 'Tòa nhà FPT, Khu Công Nghệ Cao, TP. Thủ Đức',
  stage: 'technical',
  target_tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit'],
  primary_project_name: 'E-Commerce Platform Micro-Frontend',
  personal_notes: 'HR nhắc chuẩn bị sẵn demo đồ án trên máy và ôn kỹ React 18 Concurrent Features.',
  status: 'upcoming',
  source: 'self_logged',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

/**
 * Trích xuất tự động thông tin từ email / tin nhắn mời phỏng vấn của HR
 */
export function quickParseInterviewInvitation(rawText: string): Partial<CandidateInterviewSession> {
  if (!rawText || typeof rawText !== 'string') return {};

  const result: Partial<CandidateInterviewSession> = {};
  const clean = rawText.trim();

  // 1. Nhận diện tên công ty công nghệ phổ biến
  const companyPatterns: { name: string; regex: RegExp }[] = [
    { name: 'FPT Software', regex: /\b(fpt\s*software|fpt\s*is|fpt)\b/i },
    { name: 'VNG Corporation', regex: /\b(vng|vinagame|zalopay|zalo)\b/i },
    { name: 'Shopee Vietnam', regex: /\b(shopee|sea\s*group)\b/i },
    { name: 'MoMo Fintech', regex: /\b(momo|m-service)\b/i },
    { name: 'Viettel Telecom', regex: /\b(viettel|viettel\s*solutions)\b/i },
    { name: 'VNPT Technology', regex: /\b(vnpt)\b/i },
    { name: 'One Mount Group', regex: /\b(one\s*mount|vinid|vinshop)\b/i },
    { name: 'Techcombank', regex: /\b(techcombank|tcb)\b/i },
    { name: 'KMS Technology', regex: /\b(kms\s*technology|kms)\b/i },
    { name: 'NashTech', regex: /\b(nashtech)\b/i },
    { name: 'TMA Solutions', regex: /\b(tma\s*solutions|tma)\b/i },
    { name: 'NAB Innovation', regex: /\b(nab|national\s*australia\s*bank)\b/i },
    { name: 'Bosch Global', regex: /\b(bosch)\b/i },
    { name: 'Tiki Vietnam', regex: /\b(tiki)\b/i },
    { name: 'Grab Vietnam', regex: /\b(grab)\b/i }
  ];

  for (const item of companyPatterns) {
    if (item.regex.test(clean)) {
      result.company_name = item.name;
      break;
    }
  }

  // 2. Nhận diện vị trí tuyển dụng
  const rolePatterns: { title: string; regex: RegExp }[] = [
    { title: 'Frontend React Developer', regex: /\b(frontend|front-end|react|reactjs|vue|angular)\b/i },
    { title: 'Backend Node.js Developer', regex: /\b(backend|back-end|nodejs|node\.js|nest|nestjs|express)\b/i },
    { title: 'Fullstack Engineer', regex: /\b(fullstack|full-stack)\b/i },
    { title: 'Mobile Developer', regex: /\b(mobile|flutter|react\s*native|ios|android|kotlin|swift)\b/i },
    { title: 'Java Software Engineer', regex: /\b(java|spring|springboot|spring\s*boot)\b/i },
    { title: 'Golang Engineer', regex: /\b(golang|go\s*developer)\b/i },
    { title: 'DevOps / Cloud Engineer', regex: /\b(devops|cloud|aws|kubernetes|docker|ci\/cd)\b/i },
    { title: 'Data Engineer / Analyst', regex: /\b(data\s*engineer|data\s*analyst|bi\s*engineer)\b/i },
    { title: 'AI / Machine Learning Engineer', regex: /\b(ai\s*engineer|machine\s*learning|data\s*scientist|llm)\b/i },
    { title: 'QA / QC Automation Engineer', regex: /\b(qa|qc|tester|automation\s*tester)\b/i }
  ];

  for (const item of rolePatterns) {
    if (item.regex.test(clean)) {
      result.role_title = item.title;
      break;
    }
  }

  // 3. Nhận diện Link phòng họp Online
  const meetMatch = clean.match(/https?:\/\/(meet\.google\.com\/[a-z0-9-]+|[\w-]+\.zoom\.us\/j\/\d+|teams\.microsoft\.com\/l\/meetup-join\/[\w%?=-]+)/i);
  if (meetMatch) {
    result.meeting_link = meetMatch[0];
    result.format = 'online';
  }

  // 4. Nhận diện Vòng phỏng vấn
  if (/technical|live\s*coding|kỹ\s*thuật|chuyên\s*môn|bài\s*test/i.test(clean)) {
    result.stage = 'technical';
  } else if (/hr\s*screening|vòng\s*sơ\s*vấn|trao\s*đổi\s*sơ\s*bộ|văn\s*hóa/i.test(clean)) {
    result.stage = 'hr_screen';
  } else if (/final|phỏng\s*vấn\s*giám\s*đốc|offer|deal\s*lương/i.test(clean)) {
    result.stage = 'culture_final';
  }

  // 5. Nhận diện Giờ phỏng vấn (VD: 09:30, 14:00, 9h30, 10h)
  const timeMatch = clean.match(/(\b[0-2]?[0-9])[:h]([0-5][0-9])?\s*(am|pm)?/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] ? timeMatch[2] : '00';
    const meridiem = timeMatch[3]?.toLowerCase();

    if (meridiem === 'pm' && hour < 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;

    result.interview_time = `${hour.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }

  return result;
}

/**
 * Service quản lý lịch phỏng vấn và trạm tác chiến cá nhân
 */
export const selfInterviewService = {
  /**
   * Lấy toàn bộ danh sách lịch phỏng vấn
   */
  getAllSessions(): CandidateInterviewSession[] {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return [DEFAULT_SAMPLE_SESSION];
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Cung cấp 1 session mẫu thực chiến ban đầu để người dùng trải nghiệm ngay
        const initial = [DEFAULT_SAMPLE_SESSION];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('[selfInterviewService] Failed to load sessions:', e);
      return [DEFAULT_SAMPLE_SESSION];
    }
  },

  /**
   * Lấy 1 session theo ID
   */
  getSessionById(id: string): CandidateInterviewSession | null {
    const list = this.getAllSessions();
    return list.find(s => s.id === id) || null;
  },

  /**
   * Lưu hoặc cập nhật danh sách vào LocalStorage
   */
  saveAllSessions(sessions: CandidateInterviewSession[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      }
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('profilehub_interview_sessions_change', { detail: sessions }));
      }
    } catch (e) {
      console.error('[selfInterviewService] Failed to save sessions:', e);
    }
  },

  /**
   * Tạo một buổi phỏng vấn mục tiêu mới (War Room Session)
   */
  createSession(data: {
    company_name: string;
    role_title: string;
    interview_date?: string;
    interview_time?: string;
    format?: 'online' | 'offline';
    meeting_link?: string;
    location_address?: string;
    stage?: InterviewStageType;
    linked_cv_id?: string;
    personal_notes?: string;
  }): CandidateInterviewSession {
    const list = this.getAllSessions();
    const now = new Date().toISOString();

    let linkedCvTitle: string | undefined;
    let targetTechStack: string[] | undefined;
    let primaryProjectName: string | undefined;

    // Nếu có linked_cv_id, tự động bóc tách Tech Stack và Dự án tiêu biểu của CV đó
    if (data.linked_cv_id) {
      const allCvs = cvService.getAllCVs();
      const cv = allCvs.find((c: ManagedCVItem) => c.id === data.linked_cv_id);
      if (cv) {
        linkedCvTitle = cv.title || cv.targetRole;
        // Bóc tách dự án
        const projectSec = cv.data.sections?.find((s: any) => s.type === 'projects');
        if (projectSec && projectSec.items && projectSec.items.length > 0) {
          primaryProjectName = projectSec.items[0]?.title;
          const rawTechs = projectSec.items[0]?.technologies;
          if (Array.isArray(rawTechs)) {
            targetTechStack = rawTechs;
          } else if (typeof rawTechs === 'string') {
            targetTechStack = rawTechs.split(',').map((t: string) => t.trim()).filter(Boolean);
          }
        }
        // Bóc tách kỹ năng bổ trợ nếu chưa có
        if (!targetTechStack || targetTechStack.length === 0) {
          const skillSec = cv.data.sections?.find((s: any) => s.type === 'skills');
          if (skillSec && skillSec.items && skillSec.items.length > 0) {
            targetTechStack = skillSec.items.map((i: any) => i.name || i.title).filter(Boolean);
          }
        }
      }
    }

    const newSession: CandidateInterviewSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      company_name: data.company_name.trim(),
      role_title: data.role_title.trim(),
      interview_date: data.interview_date || new Date().toISOString().split('T')[0],
      interview_time: data.interview_time || '09:00',
      format: data.format || (data.meeting_link ? 'online' : 'offline'),
      meeting_link: data.meeting_link?.trim(),
      location_address: data.location_address?.trim(),
      stage: data.stage || 'technical',
      linked_cv_id: data.linked_cv_id,
      linked_cv_title: linkedCvTitle,
      target_tech_stack: targetTechStack || ['React', 'Node.js', 'PostgreSQL'],
      primary_project_name: primaryProjectName || 'Dự án nổi bật trong CV',
      personal_notes: data.personal_notes?.trim(),
      status: 'upcoming',
      source: 'self_logged',
      created_at: now,
      updated_at: now
    };

    const updated = [newSession, ...list];
    this.saveAllSessions(updated);
    return newSession;
  },

  /**
   * Cập nhật thông tin buổi phỏng vấn
   */
  updateSession(id: string, updates: Partial<CandidateInterviewSession>): boolean {
    const list = this.getAllSessions();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return false;

    list[idx] = {
      ...list[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveAllSessions(list);
    return true;
  },

  /**
   * Xóa buổi phỏng vấn
   */
  deleteSession(id: string): boolean {
    const list = this.getAllSessions();
    const filtered = list.filter(s => s.id !== id);
    if (filtered.length === list.length) return false;

    this.saveAllSessions(filtered);
    return true;
  },

  /**
   * Đánh dấu hoàn thành / cập nhật trạng thái
   */
  updateStatus(id: string, status: InterviewStatusType): boolean {
    return this.updateSession(id, { status });
  }
};
