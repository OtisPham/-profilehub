import { apiClient } from './axiosClient';
import type { JobPost } from '../types/database';

export const jobApi = {
  getJobs(): Promise<JobPost[]> {
    return apiClient.get<JobPost[]>('/jobs');
  },

  createJob(data: Partial<JobPost>): Promise<JobPost> {
    return apiClient.post<JobPost>('/jobs', data);
  },

  updateJob(id: string, data: Partial<JobPost>): Promise<JobPost> {
    return apiClient.put<JobPost>(`/jobs/${id}`, data);
  },

  deleteJob(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/jobs/${id}`);
  },
};
