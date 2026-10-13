import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

if (!ENV.SUPABASE_URL || !ENV.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️ Supabase credentials missing in Server environment variables. Please check .env file.');
}

export const supabase = createClient(
  ENV.SUPABASE_URL || 'https://placeholder.supabase.co',
  ENV.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);
