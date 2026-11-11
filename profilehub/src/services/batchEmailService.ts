import type { CandidatePipelineItem, BatchEmailTemplate } from '../types/database';

export interface BatchMergeContext {
  candidate_name: string;
  job_title: string;
  company_name: string;
  top_project_name?: string;
  interview_slot_time?: string;
  challenge_deadline?: string;
  [key: string]: string | undefined;
}

/**
 * Trộn các biến động dạng {tag} trong chuỗi văn bản mẫu
 */
export const compileEmailTemplate = (templateText: string, context: BatchMergeContext): string => {
  return templateText.replace(/\{(\w+)\}/g, (match, key) => {
    const val = context[key];
    return val !== undefined && val !== null ? val : match;
  });
};

/**
 * Trích xuất context thực tế từ thông tin của CandidatePipelineItem
 */
export const extractCandidateMergeContext = (
  candidate: CandidatePipelineItem,
  defaultCompanyName = 'Doanh nghiệp Đối tác'
): BatchMergeContext => {
  const student = candidate.student;
  const job = candidate.job;
  const project = (candidate as any).project || (student as any)?.projects?.[0];

  const candidate_name = student?.full_name || 'Ứng viên';
  const job_title = job?.title || (candidate as any).job_title || 'Kỹ sư phần mềm';
  const company_name = job?.company_name || (candidate as any).company_name || defaultCompanyName;
  const top_project_name = project?.title || 'Đồ án Chuyên ngành Thực chiến';
  const interview_slot_time = candidate.interview_date 
    ? `${candidate.interview_date} lúc ${candidate.interview_time || '09:00'}`
    : 'Linh hoạt theo lựa chọn của bạn';
  const challenge_deadline = candidate.take_home_challenge?.deadlineDate || '48 giờ kể từ khi nhận đề';

  return {
    candidate_name,
    job_title,
    company_name,
    top_project_name,
    interview_slot_time,
    challenge_deadline,
  };
};

/**
 * Tạo bản thảo Email đã được cá nhân hóa hoàn chỉnh
 */
export const buildMergedEmail = (
  template: BatchEmailTemplate,
  candidate: CandidatePipelineItem,
  companyName?: string
): { subject: string; body: string; recipientEmail: string; candidateName: string } => {
  const context = extractCandidateMergeContext(candidate, companyName);
  const subject = compileEmailTemplate(template.subject, context);
  const body = compileEmailTemplate(template.body, context);
  const recipientEmail = (candidate.student as any)?.email || 'candidate@example.com';

  return {
    subject,
    body,
    recipientEmail,
    candidateName: context.candidate_name,
  };
};

/**
 * Tạo link mailto: mở trình gửi mail mặc định của hệ điều hành
 */
export const generateMailtoLink = (recipientEmail: string, subject: string, body: string): string => {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${recipientEmail}?${params.toString()}`;
};

/**
 * Sao chép an toàn chuỗi nội dung vào Clipboard (hỗ trợ cả môi trường có và không có navigator.clipboard)
 */
export const copyToClipboardSafe = async (text: string): Promise<boolean> => {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  }

  return false;
};
