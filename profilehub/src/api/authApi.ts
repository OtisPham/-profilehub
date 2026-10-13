import { apiClient } from './axiosClient';

export const authApi = {
  register(data: { email: string; password: string; fullName: string; role: string }) {
    return apiClient.post('/auth/register', data);
  },

  login(data: { email: string; password: string }) {
    return apiClient.post('/auth/login', data);
  },

  getMe() {
    return apiClient.get('/auth/me');
  },
};
