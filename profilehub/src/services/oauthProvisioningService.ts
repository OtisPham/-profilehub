import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import type { OAuthRawMetadata, OAuthDiagnosticInfo, ProvisioningResult, UserRole } from '../types/database';
import { getDiagnosticForError } from './oauthErrorCatalog';

/**
 * Phân tích URL Callback xem có chứa tham số lỗi do Google / Supabase trả về không
 */
export const parseOAuthErrorFromUrl = (searchParams: string, hashParams: string): OAuthDiagnosticInfo => {
  const search = new URLSearchParams(searchParams || '');
  
  // Hash params có dạng #access_token=...&error=...
  const rawHash = (hashParams || '').replace(/^#/, '');
  const hash = new URLSearchParams(rawHash);

  const errorCode = search.get('error') || hash.get('error') || search.get('error_code') || hash.get('error_code');
  const errorDescription = search.get('error_description') || hash.get('error_description') || search.get('message') || hash.get('message');

  if (!errorCode && !errorDescription) {
    return {
      isError: false,
      canFallbackToDemo: true,
    };
  }

  const diagnostic = getDiagnosticForError(errorCode || undefined, errorDescription || undefined);

  return {
    isError: true,
    errorCode: diagnostic.code,
    errorDescription: diagnostic.description,
    solutionHint: diagnostic.solutionHint,
    canFallbackToDemo: true,
  };
};

/**
 * Trích xuất tên hiển thị tốt nhất từ metadata OAuth
 */
export const extractUserDisplayName = (metadata?: OAuthRawMetadata, email?: string): string => {
  if (metadata?.full_name?.trim()) return metadata.full_name.trim();
  if (metadata?.name?.trim()) return metadata.name.trim();
  if (email?.trim()) {
    return email.split('@')[0];
  }
  return 'Thành Viên Mới';
};

/**
 * Trích xuất URL ảnh đại diện từ metadata OAuth
 */
export const extractUserAvatarUrl = (metadata?: OAuthRawMetadata): string | undefined => {
  return metadata?.avatar_url || metadata?.picture || undefined;
};

/**
 * Tự động kiểm tra và khởi tạo bản ghi trong users và student_profiles cho tài khoản OAuth
 */
export const provisionOAuthUserProfile = async (
  user: User,
  preferredRole?: UserRole
): Promise<ProvisioningResult> => {
  try {
    const rawRole = preferredRole || (user.user_metadata?.role as UserRole) || 'student';
    const role: UserRole = rawRole === 'recruiter' ? 'recruiter' : 'student';
    const destinationUrl = role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard';

    const metadata: OAuthRawMetadata = user.user_metadata || {};
    const fullName = extractUserDisplayName(metadata, user.email);
    const avatarUrl = extractUserAvatarUrl(metadata);

    // 1. Kiểm tra xem người dùng đã tồn tại trong public.users chưa
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, role, full_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    const isNewUser = !existingUser;

    // 2. Upsert an toàn vào bảng public.users (Idempotent)
    const userPayload: any = {
      id: user.id,
      email: user.email || '',
      full_name: fullName,
      role: existingUser?.role || role,
      created_at: existingUser ? undefined : new Date().toISOString(),
    };
    if (avatarUrl) {
      userPayload.avatar_url = avatarUrl;
    }

    const { error: userUpsertError } = await supabase.from('users').upsert(userPayload);
    if (userUpsertError) {
      console.warn('[oauthProvisioningService] Cảnh báo lưu public.users:', userUpsertError.message);
    }

    // 3. Nếu là vai trò sinh viên, đảm bảo có bản ghi trong public.student_profiles
    if (role === 'student') {
      const studentPayload: any = {
        id: user.id,
        full_name: fullName,
        is_open_to_work: true,
      };
      if (avatarUrl) {
        studentPayload.avatar_url = avatarUrl;
      }
      const { error: profileUpsertError } = await supabase.from('student_profiles').upsert(studentPayload);
      if (profileUpsertError) {
        console.warn('[oauthProvisioningService] Cảnh báo lưu public.student_profiles:', profileUpsertError.message);
      }
    }

    // 4. Lưu lại vai trò đã chọn vào LocalStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('profilehub_demo_role', role);
    }

    return {
      success: true,
      isNewUser,
      role,
      destinationUrl,
    };
  } catch (err: any) {
    console.error('[oauthProvisioningService] Exception khi provision user:', err);
    return {
      success: false,
      isNewUser: false,
      role: preferredRole || 'student',
      destinationUrl: preferredRole === 'recruiter' ? '/recruiter/dashboard' : '/dashboard',
      error: err?.message || 'Lỗi khởi tạo hồ sơ người dùng OAuth.',
    };
  }
};
