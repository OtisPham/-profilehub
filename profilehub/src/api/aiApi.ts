import { apiClient } from './axiosClient';

export const aiApi = {
  optimizeCV(payload: {
    jdText: string;
    userSkills: string[];
    projects: any[];
    certificates: any[];
  }) {
    return apiClient.post('/ai/cv-optimize', payload);
  },

  getInterviewQuestions(payload: { project?: any; job?: any }) {
    return apiClient.post('/ai/interview-questions', payload);
  },

  evaluateInterviewAnswer(payload: { question: any; answerText: string }) {
    return apiClient.post('/ai/interview-evaluate', payload);
  },
};
