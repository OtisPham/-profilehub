import { supabase } from '../config/supabase.js';
import type { Certificate } from '../types/index.js';

export const certificateService = {
  async getUserCertificates(userId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCertificate(certData: Partial<Certificate>) {
    const { data, error } = await supabase
      .from('certificates')
      .insert([certData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCertificate(certId: string, updates: Partial<Certificate>) {
    const { data, error } = await supabase
      .from('certificates')
      .update(updates)
      .eq('id', certId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCertificate(certId: string, userId: string) {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', certId)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  },
};
