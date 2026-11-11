import type { CandidatePipelineItem, CandidateAiTLDR, PipelineStage } from '../types/database';

export type SpeedScreenerAction = 'advance' | 'challenge' | 'reject' | 'open_details';

export interface SpeedScreenerNavResult {
  candidate: CandidatePipelineItem | null;
  newIndex: number;
}

/**
 * Tính toán nhanh chân dung ứng viên 10 giây (AI TL;DR) từ thông tin ứng viên
 */
export const generateCandidateAiTldr = (candidate: CandidatePipelineItem): CandidateAiTLDR => {
  const student = candidate.student;
  const skills = student?.skills || [];
  const topSkill = skills.slice(0, 3).join(', ') || 'Chưa cập nhật kỹ năng';

  // Nhận diện điểm kỹ thuật cốt lõi
  const technicalCore = skills.length > 0 
    ? `Thành thạo ${topSkill}` 
    : 'Năng lực lập trình cơ bản';

  // Tìm đồ án nổi bật nhất
  const project = (candidate as any).project || (student as any)?.projects?.[0];
  const keyProofProject = project?.title 
    ? `${project.title} (Live Demo: ${project.demo_url ? 'Có' : 'Chưa'} | GitHub: ${project.github_url ? 'Đã liên kết' : 'Chưa'})`
    : 'Đã hoàn thành đồ án môn học & chuyên ngành';

  // Xác định lỗ hổng cần phỏng vấn kỹ
  const missingArea = !skills.some(s => s.toLowerCase().includes('docker') || s.toLowerCase().includes('ci'))
    ? 'Chưa thấy kinh nghiệm triển khai CI/CD và Container hóa'
    : 'Cần kiểm tra kỹ năng tối ưu truy vấn Database & Hệ thống phân tán';

  return {
    candidateId: candidate.student_id,
    technicalCore,
    keyProofProject,
    screeningAttention: missingArea,
    matchScore: 88, // Mặc định hoặc dựa trên JEV calculation
  };
};

/**
 * Lấy vị trí ứng viên kế tiếp (phím J hoặc Mũi tên Xuống)
 */
export const getNextIndex = (currentIndex: number, totalCount: number): number => {
  if (totalCount <= 0) return 0;
  return currentIndex < totalCount - 1 ? currentIndex + 1 : currentIndex;
};

/**
 * Lấy vị trí ứng viên trước đó (phím K hoặc Mũi tên Lên)
 */
export const getPrevIndex = (currentIndex: number, totalCount: number): number => {
  if (totalCount <= 0) return 0;
  return currentIndex > 0 ? currentIndex - 1 : 0;
};

/**
 * Xử lý hành động từ phím tắt (A: Advance, T: Challenge, R: Reject)
 */
export const applySpeedScreenerAction = (
  candidate: CandidatePipelineItem,
  action: SpeedScreenerAction
): { updatedCandidate: CandidatePipelineItem; targetStage: PipelineStage } => {
  let targetStage: PipelineStage = candidate.stage;

  switch (action) {
    case 'advance':
      targetStage = 'interview';
      break;
    case 'challenge':
      targetStage = 'shortlisted';
      break;
    case 'reject':
      targetStage = 'discovered';
      break;
    case 'open_details':
    default:
      targetStage = candidate.stage;
      break;
  }

  const updatedCandidate: CandidatePipelineItem = {
    ...candidate,
    stage: targetStage,
    updated_at: new Date().toISOString(),
  };

  return { updatedCandidate, targetStage };
};

/**
 * Cache lưu trữ tạm trong RAM để pre-fetch đồ án và thông tin ứng viên
 */
const speedScreenerPreFetchCache = new Map<string, CandidateAiTLDR>();

/**
 * Tải trước dữ liệu của N ứng viên lân cận để chuyển tab không giật lag
 */
export const preFetchCandidates = (
  candidates: CandidatePipelineItem[],
  currentIndex: number,
  lookahead = 3
): void => {
  const start = Math.max(0, currentIndex - 1);
  const end = Math.min(candidates.length, currentIndex + lookahead);

  for (let i = start; i < end; i++) {
    const c = candidates[i];
    if (c && !speedScreenerPreFetchCache.has(c.id)) {
      speedScreenerPreFetchCache.set(c.id, generateCandidateAiTldr(c));
    }
  }
};

export const getCachedAiTldr = (candidateId: string): CandidateAiTLDR | undefined => {
  return speedScreenerPreFetchCache.get(candidateId);
};

export const clearPreFetchCache = (): void => {
  speedScreenerPreFetchCache.clear();
};
