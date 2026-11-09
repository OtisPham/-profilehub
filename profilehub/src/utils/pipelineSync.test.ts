import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

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
  Notification: {
    permission: 'default',
    requestPermission: vi.fn().mockResolvedValue('granted')
  }
});

// Import after globals are stubbed
import {
  isNotificationSupported,
  getNotificationPermission,
  requestBrowserNotificationPermission,
  sendBrowserNotification,
  getSharedPipeline,
  saveSharedPipeline,
  addToSharedPipeline,
  scheduleInterviewForCandidate,
  updateInterviewStatusByStudent,
  requestInterviewRescheduleByStudent,
  submitInboundInterviewInvite,
  subscribeToPipelineEvents,
  type PipelineBroadcastEvent
} from './pipelineSync';
import type { CandidatePipelineItem } from '../types/database';

describe('pipelineSync and Web Notification utilities', () => {
  beforeEach(() => {
    mockStorage.clear();
    vi.restoreAllMocks();
    (window as any).Notification = {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted')
    };
  });

  afterEach(() => {
    mockStorage.clear();
  });

  describe('Browser Notification Helpers', () => {
    it('isNotificationSupported returns true when Notification is present in window', () => {
      expect(isNotificationSupported()).toBe(true);
    });

    it('getNotificationPermission returns current permission', () => {
      const perm = getNotificationPermission();
      expect(['default', 'granted', 'denied', 'unsupported']).toContain(perm);
    });

    it('requestBrowserNotificationPermission asks permission and returns result', async () => {
      const mockRequest = vi.fn().mockResolvedValue('granted' as NotificationPermission);
      (window as any).Notification = {
        permission: 'default',
        requestPermission: mockRequest
      };

      const res = await requestBrowserNotificationPermission();
      expect(res).toBe('granted');
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    it('sendBrowserNotification returns null if permission is not granted', () => {
      (window as any).Notification = {
        permission: 'denied',
        requestPermission: vi.fn()
      };

      const notif = sendBrowserNotification('Test Title');
      expect(notif).toBeNull();
    });

    it('sendBrowserNotification creates new Notification when permission is granted', () => {
      const MockNotification = vi.fn();
      (MockNotification as any).permission = 'granted';
      (window as any).Notification = MockNotification;

      const notif = sendBrowserNotification('ProfileHub - Lịch hẹn mới', {
        body: 'Bạn có một lời mời phỏng vấn'
      });

      expect(MockNotification).toHaveBeenCalledWith('ProfileHub - Lịch hẹn mới', expect.objectContaining({
        body: 'Bạn có một lời mời phỏng vấn'
      }));
      expect(notif).not.toBeNull();
    });
  });

  describe('Pipeline Storage and Filtering', () => {
    const mockItem: CandidatePipelineItem = {
      id: 'pipeline_real_101',
      recruiter_id: 'rec_alpaca',
      student_id: 'student_real_202',
      job_id: 'job_real_303',
      stage: 'discovered',
      student: {
        id: 'student_real_202',
        full_name: 'Phạm Minh Nhật',
        major: 'Software Engineering',
        skills: ['React', 'TypeScript']
      },
      job: {
        id: 'job_real_303',
        recruiter_id: 'rec_alpaca',
        title: 'Frontend Engineer',
        company_name: 'Tech Corp'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    it('filters out mock candidates and retrieves real pipeline items', () => {
      const mockLegacy = [
        { id: 'p1', student_id: 's1', student: { full_name: 'Nguyễn Văn A' } },
        mockItem
      ];
      mockStorage.setItem('pipeline_shared_data', JSON.stringify(mockLegacy));

      const pipeline = getSharedPipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].id).toBe('pipeline_real_101');
      expect(pipeline[0].student?.full_name).toBe('Phạm Minh Nhật');
    });

    it('saves pipeline items to storage and dispatches storage event', () => {
      const spyDispatch = vi.spyOn(window, 'dispatchEvent');
      saveSharedPipeline([mockItem], 'user_123');

      expect(mockStorage.getItem('pipeline_shared_data')).toContain('pipeline_real_101');
      expect(mockStorage.getItem('pipeline_user_123')).toContain('pipeline_real_101');
      expect(spyDispatch).toHaveBeenCalled();
    });

    it('addToSharedPipeline adds non-duplicate item and prevents duplicates', () => {
      const addedFirst = addToSharedPipeline(mockItem);
      expect(addedFirst).toBe(true);

      // Attempting to add duplicate item
      const addedSecond = addToSharedPipeline(mockItem);
      expect(addedSecond).toBe(false);

      const list = getSharedPipeline();
      expect(list.length).toBe(1);
    });
  });

  describe('Interview Scheduling and Status Broadcast', () => {
    const pipelineItem: CandidatePipelineItem = {
      id: 'item_interview_1',
      recruiter_id: 'rec_alpaca',
      student_id: 'student_456',
      job_id: 'job_789',
      stage: 'discovered',
      student: {
        id: 'student_456',
        full_name: 'Lê Bảo An',
        skills: ['React', 'Tailwind']
      },
      job: {
        id: 'job_789',
        recruiter_id: 'rec_alpaca',
        title: 'React Fresher',
        company_name: 'FPT Software'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    it('scheduleInterviewForCandidate updates stage to interview and broadcasts event', () => {
      saveSharedPipeline([pipelineItem]);

      const events: PipelineBroadcastEvent[] = [];
      const unsubscribe = subscribeToPipelineEvents((e) => events.push(e));

      const updated = scheduleInterviewForCandidate('item_interview_1', {
        interview_date: '2026-11-20',
        interview_time: '14:30',
        meeting_link: 'https://meet.google.com/xyz',
        company_name: 'FPT Software',
        job_title: 'React Fresher'
      });

      expect(updated[0].stage).toBe('interview');
      expect(updated[0].interview_date).toBe('2026-11-20');
      expect(updated[0].interview_time).toBe('14:30');
      expect(updated[0].interview_status).toBe('pending_student');

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('INTERVIEW_SCHEDULED');
      expect(events[0].studentId).toBe('student_456');
      expect(events[0].companyName).toBe('FPT Software');

      unsubscribe();
    });

    it('updateInterviewStatusByStudent updates status to confirmed and broadcasts event', () => {
      saveSharedPipeline([{
        ...pipelineItem,
        stage: 'interview',
        interview_date: '2026-11-20',
        interview_status: 'pending_student'
      }]);

      const events: PipelineBroadcastEvent[] = [];
      const unsubscribe = subscribeToPipelineEvents((e) => events.push(e));

      const updated = updateInterviewStatusByStudent('student_456', 'confirmed');
      expect(updated[0].interview_status).toBe('confirmed');

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('INTERVIEW_STATUS_UPDATED');
      expect(events[0].status).toBe('confirmed');

      unsubscribe();
    });

    it('requestInterviewRescheduleByStudent updates suggested date and broadcasts event', () => {
      saveSharedPipeline([{
        ...pipelineItem,
        stage: 'interview',
        interview_date: '2026-11-20',
        interview_status: 'pending_student'
      }]);

      const events: PipelineBroadcastEvent[] = [];
      const unsubscribe = subscribeToPipelineEvents((e) => events.push(e));

      const updated = requestInterviewRescheduleByStudent(
        'student_456',
        '2026-11-22',
        '09:00',
        'Bận thi môn Giải thuật'
      );

      expect(updated[0].interview_status).toBe('reschedule_requested');
      expect(updated[0].suggested_interview_date).toBe('2026-11-22');
      expect(updated[0].suggested_interview_time).toBe('09:00');
      expect(updated[0].student_reschedule_reason).toBe('Bận thi môn Giải thuật');

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('INTERVIEW_STATUS_UPDATED');
      expect(events[0].status).toBe('reschedule_requested');
      expect(events[0].interviewDate).toBe('2026-11-22');

      unsubscribe();
    });

    it('submitInboundInterviewInvite creates pipeline item and broadcasts INBOUND_INVITE_RECEIVED event', () => {
      const events: PipelineBroadcastEvent[] = [];
      const unsubscribe = subscribeToPipelineEvents((e) => events.push(e));

      const success = submitInboundInterviewInvite({
        verification_code: 'PH-VER-2026-001',
        student_id: 'student_inbound_99',
        student_name: 'Đặng Tuấn Anh',
        company_name: 'VNG Corporation',
        recruiter_email: 'hr@vng.com.vn',
        role_title: 'React Fresher',
        proposed_date: '2026-11-25',
        proposed_time: '10:00 AM',
        meeting_link: 'https://meet.google.com/xyz',
        message: 'Đồ án của bạn rất ấn tượng'
      });

      expect(success).toBe(true);
      const pipeline = getSharedPipeline();
      expect(pipeline.length).toBe(1);
      expect(pipeline[0].student_id).toBe('student_inbound_99');
      expect(pipeline[0].stage).toBe('interview');
      expect(pipeline[0].interview_status).toBe('pending_student');
      expect(pipeline[0].job?.company_name).toBe('VNG Corporation');

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('INBOUND_INVITE_RECEIVED');
      expect(events[0].companyName).toBe('VNG Corporation');
      expect(events[0].verificationCode).toBe('PH-VER-2026-001');

      unsubscribe();
    });
  });
});
