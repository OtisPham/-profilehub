import type { CandidatePipelineItem } from '../types/database';

const SHARED_KEY = 'pipeline_shared_data';
const BROADCAST_CHANNEL_NAME = 'profilehub_pipeline_broadcast';

export interface PipelineBroadcastEvent {
  type: 
    | 'INTERVIEW_SCHEDULED' 
    | 'INTERVIEW_STATUS_UPDATED' 
    | 'PIPELINE_UPDATED' 
    | 'INBOUND_INVITE_RECEIVED'
    | 'CHALLENGE_ISSUED'
    | 'CHALLENGE_SUBMITTED'
    | 'SCORECARD_RECORDED'
    | 'INTERVIEW_SLOT_OFFERED'
    | 'INTERVIEW_SLOT_CONFIRMED'
    | 'READ_RECEIPT_PING';
  studentId?: string;
  studentName?: string;
  jobTitle?: string;
  companyName?: string;
  interviewDate?: string;
  interviewTime?: string;
  status?: string;
  message?: string;
  verificationCode?: string;
  challengeTitle?: string;
  scorecardScore?: number;
  scorecardRecommendation?: string;
  slotStartTime?: string;
  slotEndTime?: string;
  readTargetType?: string;
  readDurationSeconds?: number;
  timestamp: number;
}

/**
 * Kiểm tra xem trình duyệt hiện tại có hỗ trợ Notification API hay không
 */
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window && Boolean(window.Notification);
};

/**
 * Lấy trạng thái quyền thông báo hiện tại
 */
export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!isNotificationSupported()) return 'unsupported';
  return window.Notification.permission;
};

/**
 * Yêu cầu quyền thông báo đẩy trình duyệt một cách an toàn
 */
export const requestBrowserNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const perm = await window.Notification.requestPermission();
    return perm;
  } catch (err) {
    console.warn('[pipelineSync] Lỗi cấp quyền thông báo:', err);
    return window.Notification.permission;
  }
};

/**
 * Hiển thị Web Notification nếu được cấp quyền
 */
export const sendBrowserNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  if (!isNotificationSupported() || window.Notification.permission !== 'granted') {
    return null;
  }
  try {
    const NotificationConstructor = window.Notification;
    const notification = new NotificationConstructor(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
    return notification;
  } catch (err) {
    console.warn('[pipelineSync] Không thể hiển thị browser notification:', err);
    return null;
  }
};

let broadcastChannel: BroadcastChannel | null = null;
const getBroadcastChannel = (): BroadcastChannel | null => {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    } catch {
      broadcastChannel = null;
    }
  }
  return broadcastChannel;
};

/**
 * Phát sự kiện pipeline qua BroadcastChannel (cho các tab khác) và Window CustomEvent (cho tab hiện tại)
 */
export const broadcastPipelineEvent = (event: PipelineBroadcastEvent) => {
  const ch = getBroadcastChannel();
  if (ch) {
    try {
      ch.postMessage(event);
    } catch {
      // Bỏ qua lỗi postMessage
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('profilehub_pipeline_event', { detail: event }));
  }
};

/**
 * Đăng ký lắng nghe sự kiện đồng bộ phỏng vấn xuyên suốt ứng dụng
 */
export const subscribeToPipelineEvents = (
  callback: (event: PipelineBroadcastEvent) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<PipelineBroadcastEvent>;
    if (custom.detail) {
      callback(custom.detail);
    }
  };

  const ch = getBroadcastChannel();
  const handleBroadcastMessage = (e: MessageEvent<PipelineBroadcastEvent>) => {
    if (e.data) {
      callback(e.data);
    }
  };

  window.addEventListener('profilehub_pipeline_event', handleCustomEvent);
  if (ch) {
    ch.addEventListener('message', handleBroadcastMessage);
  }

  return () => {
    window.removeEventListener('profilehub_pipeline_event', handleCustomEvent);
    if (ch) {
      ch.removeEventListener('message', handleBroadcastMessage);
    }
  };
};

export const getSharedPipeline = (userId?: string): CandidatePipelineItem[] => {
  const filterOutMock = (list: CandidatePipelineItem[]) => {
    if (!Array.isArray(list)) return [];
    return list.filter(item => {
      const isMockId = ['p1', 'p2', 'p3', 's1', 's2', 's3', 'c1', 'c2', 'c3', 'st1', 'st2', 'st3'].includes(item.id) ||
                       ['s1', 's2', 's3', 'c1', 'c2', 'c3', 'st1', 'st2', 'st3'].includes(item.student_id);
      const isMockName = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C'].includes(item.student?.full_name || '');
      return !isMockId && !isMockName;
    });
  };

  const shared = localStorage.getItem(SHARED_KEY);
  if (shared) {
    try {
      return filterOutMock(JSON.parse(shared));
    } catch {
      // Fallback
    }
  }

  // Check specific user key
  const userKeyData = userId ? localStorage.getItem(`pipeline_${userId}`) : null;
  if (userKeyData) {
    try {
      return filterOutMock(JSON.parse(userKeyData));
    } catch {
      // Fallback
    }
  }

  // Fallback default
  const defaultData = localStorage.getItem('pipeline_default');
  if (defaultData) {
    try {
      return filterOutMock(JSON.parse(defaultData));
    } catch {
      // Fallback
    }
  }

  return [];
};

export const saveSharedPipeline = (items: CandidatePipelineItem[], userId?: string) => {
  const jsonStr = JSON.stringify(items);
  localStorage.setItem(SHARED_KEY, jsonStr);
  localStorage.setItem('pipeline_default', jsonStr);
  if (userId) {
    localStorage.setItem(`pipeline_${userId}`, jsonStr);
  }
  // Dispatch custom storage event for live tab & component sync
  window.dispatchEvent(new Event('storage'));
};

export const addToSharedPipeline = (newItem: CandidatePipelineItem, userId?: string): boolean => {
  const current = getSharedPipeline(userId);
  const exists = current.some(p => 
    (Boolean(newItem.id) && p.id === newItem.id) || 
    (Boolean(newItem.job_id) && p.student_id === newItem.student_id && p.job_id === newItem.job_id)
  );
  if (exists) return false;
  const updated = [newItem, ...current];
  saveSharedPipeline(updated, userId);
  return true;
};

/**
 * Đặt hoặc cập nhật lịch phỏng vấn cho ứng viên và phát thông báo tức thì
 */
export const scheduleInterviewForCandidate = (
  itemId: string,
  schedule: {
    interview_date: string;
    interview_time: string;
    meeting_link?: string;
    interview_location?: string;
    company_name?: string;
    job_title?: string;
  },
  userId?: string
): CandidatePipelineItem[] => {
  const items = getSharedPipeline(userId);
  let targetItem: CandidatePipelineItem | undefined;

  const updated = items.map(item => {
    if (item.id === itemId) {
      const scheduled: CandidatePipelineItem = {
        ...item,
        stage: 'interview',
        interview_date: schedule.interview_date,
        interview_time: schedule.interview_time,
        meeting_link: schedule.meeting_link,
        interview_location: schedule.interview_location,
        interview_status: 'pending_student',
        updated_at: new Date().toISOString()
      };
      targetItem = scheduled;
      return scheduled;
    }
    return item;
  });

  saveSharedPipeline(updated, userId);

  if (targetItem) {
    broadcastPipelineEvent({
      type: 'INTERVIEW_SCHEDULED',
      studentId: targetItem.student_id,
      studentName: targetItem.student?.full_name || 'Ứng viên',
      jobTitle: schedule.job_title || targetItem.job?.title || 'Vị trí tuyển dụng',
      companyName: schedule.company_name || 'Nhà tuyển dụng',
      interviewDate: schedule.interview_date,
      interviewTime: schedule.interview_time,
      status: 'pending_student',
      timestamp: Date.now()
    });
  }

  return updated;
};

export const updateInterviewStatusByStudent = (studentId: string, status: 'confirmed' | 'cancelled') => {
  const items = getSharedPipeline();
  let updated = false;
  let targetItem: CandidatePipelineItem | undefined;

  const newItems = items.map(item => {
    if (item.student_id === studentId || item.student?.id === studentId || item.id === studentId) {
      updated = true;
      targetItem = {
        ...item,
        interview_status: status,
        updated_at: new Date().toISOString()
      };
      return targetItem;
    }
    return item;
  });

  if (!updated && items.length > 0) {
    targetItem = {
      ...newItems[0],
      interview_status: status,
      updated_at: new Date().toISOString()
    };
    newItems[0] = targetItem;
  }

  saveSharedPipeline(newItems);

  if (targetItem) {
    broadcastPipelineEvent({
      type: 'INTERVIEW_STATUS_UPDATED',
      studentId: targetItem.student_id,
      studentName: targetItem.student?.full_name || 'Ứng viên',
      jobTitle: targetItem.job?.title || 'Vị trí thực tập / Fresher',
      status,
      timestamp: Date.now()
    });
  }

  return newItems;
};

export const requestInterviewRescheduleByStudent = (
  studentId: string,
  newDate: string,
  newTime: string,
  reason?: string
) => {
  const items = getSharedPipeline();
  let updated = false;
  let targetItem: CandidatePipelineItem | undefined;

  const newItems = items.map(item => {
    if (item.student_id === studentId || item.student?.id === studentId || item.id === studentId) {
      updated = true;
      targetItem = {
        ...item,
        interview_status: 'reschedule_requested' as any,
        suggested_interview_date: newDate,
        suggested_interview_time: newTime,
        student_reschedule_reason: reason,
        updated_at: new Date().toISOString()
      };
      return targetItem;
    }
    return item;
  });

  if (!updated && items.length > 0) {
    targetItem = {
      ...newItems[0],
      interview_status: 'reschedule_requested' as any,
      suggested_interview_date: newDate,
      suggested_interview_time: newTime,
      student_reschedule_reason: reason,
      updated_at: new Date().toISOString()
    };
    newItems[0] = targetItem;
  }

  saveSharedPipeline(newItems);

  if (targetItem) {
    broadcastPipelineEvent({
      type: 'INTERVIEW_STATUS_UPDATED',
      studentId: targetItem.student_id,
      studentName: targetItem.student?.full_name || 'Ứng viên',
      jobTitle: targetItem.job?.title || 'Vị trí thực tập / Fresher',
      status: 'reschedule_requested',
      interviewDate: newDate,
      interviewTime: newTime,
      timestamp: Date.now()
    });
  }

  return newItems;
};

/**
 * Tiếp nhận lời mời phỏng vấn trực tiếp từ trang xác thực công khai
 */
export const submitInboundInterviewInvite = (invite: {
  verification_code: string;
  student_id: string;
  student_name: string;
  recruiter_id?: string;
  company_name: string;
  recruiter_email: string;
  role_title: string;
  proposed_date: string;
  proposed_time: string;
  meeting_link?: string;
  message?: string;
}): boolean => {
  const newItemId = `pipe_inbound_${Date.now()}`;
  
  const newItem: CandidatePipelineItem = {
    id: newItemId,
    recruiter_id: invite.recruiter_id || 'rec_inbound_guest',
    student_id: invite.student_id,
    stage: 'interview',
    interview_date: invite.proposed_date,
    interview_time: invite.proposed_time,
    meeting_link: invite.meeting_link,
    interview_location: invite.meeting_link ? 'Online (Google Meet)' : 'Trực tiếp tại văn phòng',
    interview_status: 'pending_student',
    private_notes: `[Lời mời phỏng vấn trực tiếp từ Cổng Bảo Chứng]\nCông ty: ${invite.company_name}\nEmail: ${invite.recruiter_email}\nLời nhắn: ${invite.message || 'Không có'}\nMã đồ án: ${invite.verification_code}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    student: {
      id: invite.student_id,
      full_name: invite.student_name,
      major: 'Công nghệ thông tin'
    },
    job: {
      id: `job_inbound_${Date.now()}`,
      recruiter_id: invite.recruiter_id || 'rec_inbound_guest',
      company_name: invite.company_name,
      title: invite.role_title
    }
  };

  const added = addToSharedPipeline(newItem, invite.recruiter_id);

  broadcastPipelineEvent({
    type: 'INBOUND_INVITE_RECEIVED',
    studentId: invite.student_id,
    studentName: invite.student_name,
    jobTitle: invite.role_title,
    companyName: invite.company_name,
    interviewDate: invite.proposed_date,
    interviewTime: invite.proposed_time,
    message: invite.message,
    verificationCode: invite.verification_code,
    timestamp: Date.now()
  });

  return added;
};

/**
 * Cập nhật Stage của ứng viên trong Pipeline (VD: chuyển sang 'hired' hoặc 'offer_extended')
 */
export const updateCandidatePipelineStage = (
  candidateId: string, 
  stage: CandidatePipelineItem['stage'] | 'offer_extended',
  note?: string
): boolean => {
  const items = getSharedPipeline();
  let found = false;

  const updated = items.map(item => {
    if (item.id === candidateId || item.student_id === candidateId) {
      found = true;
      const targetStage = stage === 'offer_extended' ? 'accepted' : stage;
      return {
        ...item,
        stage: targetStage as any,
        private_notes: note ? `${item.private_notes || ''}\n[Offer]: ${note}` : item.private_notes,
        updated_at: new Date().toISOString()
      };
    }
    return item;
  });

  if (found) {
    saveSharedPipeline(updated);
    broadcastPipelineEvent({
      type: 'PIPELINE_UPDATED',
      studentId: candidateId,
      status: stage,
      timestamp: Date.now()
    });
  }

  return found;
};
