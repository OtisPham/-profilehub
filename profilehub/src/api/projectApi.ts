import { apiClient } from './axiosClient';
import type { Project } from '../types/database';

export const projectApi = {
  getProjects(studentId?: string): Promise<Project[]> {
    return apiClient.get<Project[]>('/projects', { studentId });
  },

  getProjectById(id: string): Promise<Project> {
    return apiClient.get<Project>(`/projects/${id}`);
  },

  createProject(data: Partial<Project>): Promise<Project> {
    return apiClient.post<Project>('/projects', data);
  },

  updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return apiClient.put<Project>(`/projects/${id}`, data);
  },

  deleteProject(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/projects/${id}`);
  },
};
