import { supabase } from '../config/supabase.js';
import type { Project } from '../types/index.js';

export const projectService = {
  async getStudentProjects(studentId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((item) => ({
      ...item,
      tags: item.tags || [],
    }));
  },

  async getProjectById(projectId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  },

  async createProject(projectData: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProject(projectId: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(projectId: string, studentId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('student_id', studentId);

    if (error) throw error;
    return { success: true };
  },
};
