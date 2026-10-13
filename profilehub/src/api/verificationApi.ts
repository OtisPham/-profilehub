import { apiClient } from './axiosClient';

export const verificationApi = {
  getInbox(teacherId?: string) {
    return apiClient.get('/verifications/inbox', { teacherId });
  },

  approve(projectId: string, data: { teacherId?: string; teacherName: string; score: number; feedback: string }) {
    return apiClient.post(`/verifications/${projectId}/approve`, data);
  },

  reject(projectId: string, data: { teacherId?: string; feedback: string }) {
    return apiClient.post(`/verifications/${projectId}/reject`, data);
  },

  getPublicRecord(code: string) {
    return apiClient.get(`/verifications/public/${code}`);
  },
};
