import { supabase } from '../config/supabase.js';
import type { JobPost } from '../types/index.js';

export const jobService = {
  async getAllJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Return default active jobs if table is empty or unpopulated
      return [
        {
          id: 'j1',
          recruiter_id: 'rec1',
          title: 'Thực tập sinh ReactJS / Fullstack Developer',
          department: 'Công nghệ thông tin',
          location: 'TP. Hồ Chí Minh',
          required_skills: ['ReactJS', 'TypeScript', 'Node.js', 'Git', 'Tailwind'],
          description: 'Tuyển dụng thực tập sinh tham gia dự án phần mềm doanh nghiệp. Yêu cầu có các đồ án thực tế đã Verified trên ProfileHub.',
          status: 'active',
          created_at: new Date().toISOString(),
        },
        {
          id: 'j2',
          recruiter_id: 'rec2',
          title: 'Thực tập sinh UI/UX Product Designer',
          department: 'Thiết kế sản phẩm',
          location: 'TP. Hồ Chí Minh (Hybrid)',
          required_skills: ['Figma', 'UI/UX', 'User Research', 'Prototyping'],
          description: 'Xây dựng thiết kế giao diện quy chuẩn Design System cho các ứng dụng di động & website học tập trực tuyến.',
          status: 'active',
          created_at: new Date().toISOString(),
        },
      ];
    }
    return data;
  },

  async createJob(jobData: Partial<JobPost>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateJob(jobId: string, updates: Partial<JobPost>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteJob(jobId: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
    return { success: true };
  },
};
