import { apiClient } from './axiosClient';
import type { CandidatePipelineItem, InterviewFeedback, PipelineStage } from '../types/database';

export const recruiterApi = {
  searchCandidates(query?: string, skills?: string[]) {
    return apiClient.get('/recruiter/candidates', { query, skills: skills?.join(',') });
  },

  getPipeline(recruiterId?: string): Promise<CandidatePipelineItem[]> {
    return apiClient.get<CandidatePipelineItem[]>('/recruiter/pipeline', { recruiterId });
  },

  updatePipelineStage(itemId: string, stage: PipelineStage, notes?: string): Promise<CandidatePipelineItem> {
    return apiClient.put<CandidatePipelineItem>(`/recruiter/pipeline/${itemId}`, { stage, notes });
  },

  submitFeedback(feedback: Partial<InterviewFeedback>): Promise<InterviewFeedback> {
    return apiClient.post<InterviewFeedback>('/recruiter/feedback', feedback);
  },
};
