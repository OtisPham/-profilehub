import { apiClient } from './axiosClient';

export const discoveryApi = {
  chat(sessionId: string, message: string) {
    return apiClient.post('/discovery/chat', { sessionId, message });
  },
};
