import { supabase } from '../config/supabase.js';

export const authService = {
  async register(email: string, password: string, fullName: string, role: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User registration failed');

    // Create user record in 'users' table
    await supabase.from('users').upsert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
    });

    if (role === 'student') {
      await supabase.from('student_profiles').upsert({
        id: authData.user.id,
        full_name: fullName,
      });
    }

    return authData;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async getProfile(userId: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    let profile = null;
    if (user.role === 'student') {
      const { data: studentProf } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      profile = studentProf;
    }

    return { user, profile };
  },
};
