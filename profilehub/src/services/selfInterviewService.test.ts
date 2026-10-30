import { describe, it, expect, beforeEach, vi } from 'vitest';

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

const eventTarget = new EventTarget();
vi.stubGlobal('window', {
  addEventListener: eventTarget.addEventListener.bind(eventTarget),
  removeEventListener: eventTarget.removeEventListener.bind(eventTarget),
  dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
});

// Import after globals are stubbed
import { 
  selfInterviewService, 
  quickParseInterviewInvitation 
} from './selfInterviewService';

describe('selfInterviewService - Quản lý Trạm Tác Chiến Phỏng Vấn (Interview War Room)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('TC-INT-01: Lấy danh sách session ban đầu trả về session mẫu FPT Software', () => {
    const sessions = selfInterviewService.getAllSessions();
    expect(sessions.length).toBeGreaterThanOrEqual(1);
    expect(sessions[0].company_name).toBe('FPT Software');
    expect(sessions[0].status).toBe('upcoming');
  });

  it('TC-INT-02: Tạo mới một buổi phỏng vấn mục tiêu với 3 trường tối giản', () => {
    const created = selfInterviewService.createSession({
      company_name: 'VNG Corporation',
      role_title: 'Backend Golang Engineer',
      interview_date: '2026-11-05',
      interview_time: '14:00',
      meeting_link: 'https://meet.google.com/vng-tech-interview'
    });

    expect(created.id).toBeDefined();
    expect(created.company_name).toBe('VNG Corporation');
    expect(created.role_title).toBe('Backend Golang Engineer');
    expect(created.format).toBe('online');
    expect(created.source).toBe('self_logged');

    const all = selfInterviewService.getAllSessions();
    expect(all[0].id).toBe(created.id);
  });

  it('TC-INT-03: Cập nhật trạng thái buổi phỏng vấn sang passed hoặc completed', () => {
    const created = selfInterviewService.createSession({
      company_name: 'Shopee Vietnam',
      role_title: 'Frontend React Developer'
    });

    const ok = selfInterviewService.updateStatus(created.id, 'passed');
    expect(ok).toBe(true);

    const found = selfInterviewService.getSessionById(created.id);
    expect(found?.status).toBe('passed');
  });

  it('TC-INT-04: Xóa một buổi phỏng vấn thành công', () => {
    const created = selfInterviewService.createSession({
      company_name: 'MoMo Fintech',
      role_title: 'Mobile Engineer'
    });

    const ok = selfInterviewService.deleteSession(created.id);
    expect(ok).toBe(true);

    const found = selfInterviewService.getSessionById(created.id);
    expect(found).toBeNull();
  });

  describe('quickParseInterviewInvitation - Smart Magic Parser', () => {
    it('TC-INT-PARSE-01: Tự động trích xuất Tên công ty, Vị trí và Link Google Meet từ thư mời', () => {
      const emailText = `
        Chào bạn Nam,
        Bộ phận Tuyển dụng FPT Software trân trọng kính mời bạn tham gia vòng Phỏng vấn Kỹ thuật (Technical Interview)
        cho vị trí Frontend React Developer.
        Thời gian: 09:30 AM ngày 30/10/2026.
        Link phòng họp: https://meet.google.com/xyz-abcd-efg
      `;

      const parsed = quickParseInterviewInvitation(emailText);
      expect(parsed.company_name).toBe('FPT Software');
      expect(parsed.role_title).toBe('Frontend React Developer');
      expect(parsed.meeting_link).toBe('https://meet.google.com/xyz-abcd-efg');
      expect(parsed.stage).toBe('technical');
      expect(parsed.format).toBe('online');
      expect(parsed.interview_time).toBe('09:30');
    });

    it('TC-INT-PARSE-02: Nhận diện công ty VNG và vòng HR screening', () => {
      const msg = 'Chào em, HR bên VNG Corporation muốn hẹn em một buổi HR screening trao đổi sơ bộ lúc 14:00 chiều nay nhé!';
      const parsed = quickParseInterviewInvitation(msg);

      expect(parsed.company_name).toBe('VNG Corporation');
      expect(parsed.stage).toBe('hr_screen');
      expect(parsed.interview_time).toBe('14:00');
    });
  });
});
