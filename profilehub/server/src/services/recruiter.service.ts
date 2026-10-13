import { supabase } from '../config/supabase.js';
import type { CandidatePipelineItem, InterviewFeedback, PipelineStage } from '../types/index.js';

export const recruiterService = {
  async searchCandidates(query?: string, skills?: string[]) {
    let q = supabase
      .from('student_profiles')
      .select('*, projects(*), certificates(*)');

    if (query) {
      q = q.or(`full_name.ilike.%${query}%,major.ilike.%${query}%,university.ilike.%${query}%`);
    }

    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },

  async getPipeline(recruiterId: string) {
    const { data, error } = await supabase
      .from('candidate_pipeline')
      .select('*, student:student_profiles(*), job:jobs(*)')
      .eq('recruiter_id', recruiterId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updatePipelineStage(itemId: string, stage: PipelineStage, notes?: string) {
    const { data, error } = await supabase
      .from('candidate_pipeline')
      .update({ stage, private_notes: notes, updated_at: new Date().toISOString() })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async submitFeedback(feedback: Partial<InterviewFeedback>) {
    const { data, error } = await supabase
      .from('interview_feedbacks')
      .insert([feedback])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
