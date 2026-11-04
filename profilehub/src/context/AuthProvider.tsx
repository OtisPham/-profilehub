import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { UserRole } from '../types/database';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  refreshUserRole: () => Promise<void>;
}

export const createDemoUser = (role: UserRole): User => ({
  id: role === 'recruiter' ? 'demo_recruiter_alpaca' : 'demo_student_22114919',
  email: role === 'recruiter' ? 'recruiter@alpaca.vn' : 'student.bao@hoasen.edu.vn',
  app_metadata: { provider: 'demo' },
  user_metadata: {
    full_name: role === 'recruiter' ? 'Alpaca Talent Acquisition' : 'Phạm Thái Bảo',
    role: role,
  },
  aud: 'authenticated',
  created_at: new Date().toISOString()
} as unknown as User);

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userRole: 'student',
  loading: true,
  refreshUserRole: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('profilehub_demo_mode') === 'true') {
      const demoRole = (localStorage.getItem('profilehub_demo_role') as UserRole) || 'student';
      return createDemoUser(demoRole);
    }
    return null;
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('profilehub_demo_role') : null;
    return (saved === 'recruiter' || saved === 'student') ? (saved as UserRole) : 'student';
  });
  const [loading, setLoading] = useState(true);

  const fetchUserRole = useCallback(async (userId: string, metadataRole?: string) => {
    // Ưu tiên vai trò demo nếu người dùng chủ động chọn thử nghiệm trên giao diện
    const demoRole = typeof window !== 'undefined' ? localStorage.getItem('profilehub_demo_role') : null;
    if (demoRole === 'recruiter' || demoRole === 'student') {
      setUserRole(demoRole as UserRole);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data?.role) {
        setUserRole(data.role as UserRole);
      } else if (metadataRole) {
        setUserRole(metadataRole as UserRole);
      } else {
        setUserRole('student');
      }
    } catch {
      setUserRole((metadataRole as UserRole) || 'student');
    }
  }, []);

  const refreshUserRole = useCallback(async () => {
    if (user?.id) {
      await fetchUserRole(user.id, user.user_metadata?.role);
    }
  }, [user, fetchUserRole]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      if (!currentUser && typeof window !== 'undefined' && localStorage.getItem('profilehub_demo_mode') === 'true') {
        const demoRole = (localStorage.getItem('profilehub_demo_role') as UserRole) || 'student';
        setUser(createDemoUser(demoRole));
        setUserRole(demoRole);
        setLoading(false);
        return;
      }
      setUser(currentUser);
      if (currentUser) {
        fetchUserRole(currentUser.id, currentUser.user_metadata?.role).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      if (!currentUser && typeof window !== 'undefined' && localStorage.getItem('profilehub_demo_mode') === 'true') {
        const demoRole = (localStorage.getItem('profilehub_demo_role') as UserRole) || 'student';
        setUser(createDemoUser(demoRole));
        setUserRole(demoRole);
        setLoading(false);
        return;
      }
      setUser(currentUser);
      if (currentUser) {
        fetchUserRole(currentUser.id, currentUser.user_metadata?.role).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole]);

  // Lắng nghe thay đổi vai trò demo tức thì
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window === 'undefined') return;
      const demoRole = localStorage.getItem('profilehub_demo_role') as UserRole;
      if (demoRole === 'recruiter' || demoRole === 'student') {
        setUserRole(demoRole);
        if (localStorage.getItem('profilehub_demo_mode') === 'true' && !session?.user) {
          setUser(createDemoUser(demoRole));
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, user, userRole, loading, refreshUserRole }}>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '20vh', fontFamily: 'Inter, sans-serif' }}>
          <h2>⏳ Đang kết nối hệ thống PROFILEHUB...</h2>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
