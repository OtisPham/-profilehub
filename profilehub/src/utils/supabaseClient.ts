import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawUrl !== 'https://your-project.supabase.co' &&
  rawKey &&
  rawKey !== 'your-anon-key'
);

// Dùng URL hợp lệ dự phòng để createClient không throw lỗi lúc khởi động ứng dụng
const supabaseUrl = isSupabaseConfigured
  ? (rawUrl as string)
  : 'https://demo-profilehub.supabase.co';

const supabaseAnonKey = isSupabaseConfigured
  ? (rawKey as string)
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock_signature';

if (!isSupabaseConfigured) {
  console.info(
    '[ProfileHub] Đang chạy ở chế độ Local Mock Mode. Để kết nối Supabase thật, hãy cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong file .env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: isSupabaseConfigured,
  },
});
