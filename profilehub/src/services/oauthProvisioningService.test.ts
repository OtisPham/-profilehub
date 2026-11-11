import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  parseOAuthErrorFromUrl,
  extractUserDisplayName,
  extractUserAvatarUrl,
  provisionOAuthUserProfile,
} from './oauthProvisioningService';
import type { User } from '@supabase/supabase-js';

// Mock Supabase
vi.mock('./supabase', () => {
  const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockSelect = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();
  const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });

  return {
    supabase: {
      from: vi.fn((table: string) => ({
        select: mockSelect,
        eq: mockEq,
        maybeSingle: mockMaybeSingle,
        upsert: mockUpsert,
      })),
    },
  };
});

describe('Dịch Vụ Cấp Phát Hồ Sơ OAuth (oauthProvisioningService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Phân tích lỗi từ URL (parseOAuthErrorFromUrl)', () => {
    it('TC-OAUTH-01: Nhận diện chính xác access_denied và testing mode từ query string', () => {
      const search = '?error=access_denied&error_description=User+is+not+in+test+user+list';
      const diag = parseOAuthErrorFromUrl(search, '');

      expect(diag.isError).toBe(true);
      expect(diag.errorCode).toBe('access_denied');
      expect(diag.solutionHint).toContain('Google Cloud Console');
      expect(diag.canFallbackToDemo).toBe(true);
    });

    it('TC-OAUTH-02: Nhận diện chính xác redirect_uri_mismatch từ hash fragment', () => {
      const hash = '#error=redirect_uri_mismatch&error_description=The+redirect+URI+does+not+match';
      const diag = parseOAuthErrorFromUrl('', hash);

      expect(diag.isError).toBe(true);
      expect(diag.errorCode).toBe('redirect_uri_mismatch');
      expect(diag.solutionHint).toContain('https://kdfjiqnfjjtyxctcolyi.supabase.co/auth/v1/callback');
    });

    it('TC-OAUTH-03: Trả về isError: false khi URL không có tham số lỗi', () => {
      const search = '?code=valid-auth-code';
      const hash = '#access_token=valid-jwt-token&refresh_token=valid-refresh';
      const diag = parseOAuthErrorFromUrl(search, hash);

      expect(diag.isError).toBe(false);
      expect(diag.errorCode).toBeUndefined();
    });
  });

  describe('2. Trích xuất thông tin Google metadata', () => {
    it('TC-OAUTH-04: Ưu tiên lấy full_name, sau đó name, rồi fallback tiền tố email', () => {
      expect(extractUserDisplayName({ full_name: 'Phạm Thái Bảo' }, 'test@gmail.com')).toBe('Phạm Thái Bảo');
      expect(extractUserDisplayName({ name: 'Nguyễn Văn A' }, 'test@gmail.com')).toBe('Nguyễn Văn A');
      expect(extractUserDisplayName({}, 'dev.albert@hoasen.edu.vn')).toBe('dev.albert');
      expect(extractUserDisplayName(undefined, '')).toBe('Thành Viên Mới');
    });

    it('TC-OAUTH-05: Ưu tiên avatar_url, sau đó picture', () => {
      expect(extractUserAvatarUrl({ avatar_url: 'https://lh3.googleusercontent.com/avatar1.jpg' })).toBe('https://lh3.googleusercontent.com/avatar1.jpg');
      expect(extractUserAvatarUrl({ picture: 'https://lh3.googleusercontent.com/pic2.jpg' })).toBe('https://lh3.googleusercontent.com/pic2.jpg');
      expect(extractUserAvatarUrl({})).toBeUndefined();
    });
  });

  describe('3. Cấp phát hồ sơ người dùng (provisionOAuthUserProfile)', () => {
    const mockUser: User = {
      id: 'usr_oauth_google_123',
      app_metadata: { provider: 'google' },
      user_metadata: {
        full_name: 'Trần Minh Quân',
        avatar_url: 'https://lh3.googleusercontent.com/a/photo.jpg',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'minhquan@gmail.com',
    } as unknown as User;

    it('TC-OAUTH-06: Tự động khởi tạo public.users và public.student_profiles cho vai trò student', async () => {
      const result = await provisionOAuthUserProfile(mockUser, 'student');

      expect(result.success).toBe(true);
      expect(result.role).toBe('student');
      expect(result.destinationUrl).toBe('/dashboard');
    });

    it('TC-OAUTH-07: Điều hướng sang /recruiter/dashboard nếu vai trò được chọn là recruiter', async () => {
      const result = await provisionOAuthUserProfile(mockUser, 'recruiter');

      expect(result.success).toBe(true);
      expect(result.role).toBe('recruiter');
      expect(result.destinationUrl).toBe('/recruiter/dashboard');
    });

    it('TC-OAUTH-08: Đảm bảo tính lũy thừa (Idempotency) khi user đã tồn tại, không đè mất role gốc', async () => {
      const result = await provisionOAuthUserProfile(mockUser);
      expect(result.success).toBe(true);
      expect(result.isNewUser).toBe(true);
    });
  });
});
