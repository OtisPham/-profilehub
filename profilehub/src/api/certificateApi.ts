import { apiClient } from './axiosClient';
import type { Certificate } from '../types/database';

export const certificateApi = {
  getCertificates(userId?: string): Promise<Certificate[]> {
    return apiClient.get<Certificate[]>('/certificates', { userId });
  },

  createCertificate(data: Partial<Certificate>): Promise<Certificate> {
    return apiClient.post<Certificate>('/certificates', data);
  },

  updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate> {
    return apiClient.put<Certificate>(`/certificates/${id}`, data);
  },

  deleteCertificate(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/certificates/${id}`);
  },
};
