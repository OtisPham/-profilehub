import type { CandidatePipelineItem, PreInterviewCheatSheet } from '../types/database';

const CHEAT_SHEET_STORAGE_PREFIX = 'profilehub_cheatsheet_';
const inMemoryCheatSheetStore = new Map<string, string>();

/**
 * Trích xuất Thẻ Tác Chiến Bỏ Túi 60 Giây từ thông tin ứng viên
 */
export const generatePreInterviewCheatSheet = (
  candidate: CandidatePipelineItem,
  customNotes?: string
): PreInterviewCheatSheet => {
  const student = candidate.student;
  const candidateName = student?.full_name || 'Ứng viên';
  const jobTitle = candidate.job?.title || 'Kỹ sư phần mềm';
  const companyName = candidate.job?.company_name || (candidate as any).company_name || 'Doanh nghiệp Công nghệ';

  // 1. Elevator Pitch 3 câu (30s)
  const skills = student?.skills || [];
  const topSkillsStr = skills.slice(0, 3).join(', ') || 'React, Node.js & TypeScript';
  const elevatorPitch = `Xin chào anh/chị, em là ${candidateName}, chuyên sâu về ${topSkillsStr}. Em tập trung xây dựng các sản phẩm thực chiến có mã nguồn mở minh bạch và chỉ số hiệu năng đo lường được. Em rất hào hứng được trao đổi về vị trí ${jobTitle} tại ${companyName}.`;

  // 2. Ba số liệu kỹ thuật đinh (Killer Metrics)
  const killerMetrics: PreInterviewCheatSheet['killerMetrics'] = [
    { label: 'Tối ưu tải trang (Lighthouse)', value: '98/100 (FCP 0.8s)', source: 'lighthouse' },
    { label: 'Tải đồng thời kiểm thử k6', value: '180 RPS (p95 120ms)', source: 'rps' },
    { label: 'Độ bao phủ kiểm thử tự động', value: '88% Test Coverage (Vitest)', source: 'coverage' },
  ];

  // 3. Câu chuyện STAR vượt khó (Xử lý bug khó / Quyết định kỹ thuật)
  const starStory = {
    situationTask: `Khi phát triển đồ án thực tế, hệ thống gặp tình trạng nghẽn bộ nhớ (memory leak) và độ trễ truy vấn tăng cao khi có nhiều request đồng thời.`,
    actionTaken: `Em đã phân tích heap snapshot qua Chrome DevTools, tái cấu trúc việc hủy cleanup event listener và đánh composite index cho các trường truy vấn thường xuyên.`,
    quantifiedResult: `Đưa thời gian phản hồi truy vấn giảm 65% và hệ thống duy trì ổn định không bị tràn RAM.`,
  };

  // 4. Ba câu hỏi sắc sảo dành cho Nhà tuyển dụng
  const questionsToAsk = [
    `Đội ngũ kỹ thuật tại ${companyName} hiện đang tổ chức quy trình Code Review và CI/CD như thế nào?`,
    `Thách thức lớn nhất về mặt kiến trúc hệ thống hoặc hiệu năng mà team đang tập trung giải quyết trong quý này là gì?`,
    `Kỳ vọng cụ thể của anh/chị đối với một bạn Fresher/Junior trong 3 tháng thử việc đầu tiên là gì?`,
  ];

  return {
    candidateId: candidate.student_id,
    candidateName,
    jobTitle,
    companyName,
    elevatorPitch,
    killerMetrics,
    starStory,
    questionsToAsk,
    cachedAt: new Date().toISOString(),
  };
};

/**
 * Lưu Thẻ Tác Chiến vào LocalStorage (hoặc bộ đệm RAM) để hoạt động ngoại tuyến
 */
export const saveOfflineCheatSheet = (sheet: PreInterviewCheatSheet): void => {
  const key = `${CHEAT_SHEET_STORAGE_PREFIX}${sheet.candidateId}`;
  const serialized = JSON.stringify(sheet);
  inMemoryCheatSheetStore.set(key, serialized);

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, serialized);
    } catch (err) {
      console.warn('Không thể lưu cheat sheet vào LocalStorage:', err);
    }
  }
};

/**
 * Lấy bản lưu Thẻ Tác Chiến từ LocalStorage (hoặc bộ đệm RAM)
 */
export const getOfflineCheatSheet = (candidateId: string): PreInterviewCheatSheet | null => {
  const key = `${CHEAT_SHEET_STORAGE_PREFIX}${candidateId}`;
  let raw: string | null = null;

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      raw = localStorage.getItem(key);
    } catch {
      // Fallback
    }
  }

  if (!raw) {
    raw = inMemoryCheatSheetStore.get(key) || null;
  }

  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearCheatSheetCache = (): void => {
  inMemoryCheatSheetStore.clear();
};
