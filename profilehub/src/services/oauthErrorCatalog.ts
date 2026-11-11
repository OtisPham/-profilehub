export interface OAuthErrorEntry {
  code: string;
  title: string;
  description: string;
  solutionHint: string;
}

export const OAUTH_ERROR_CATALOG: Record<string, OAuthErrorEntry> = {
  access_denied: {
    code: 'access_denied',
    title: 'Google OAuth Đang Ở Chế Độ Thử Nghiệm (Testing Mode)',
    description: 'Ứng dụng ProfileHub trên Google Cloud Console chưa được bấm nút "Publish App", hoặc bạn đã từ chối cấp quyền truy cập tài khoản.',
    solutionHint: 'Vào Google Cloud Console > OAuth Consent Screen > thêm email của bạn vào danh sách "Test users", hoặc bấm nút "Publish App" sang chế độ Production.',
  },
  redirect_uri_mismatch: {
    code: 'redirect_uri_mismatch',
    title: 'Chưa Cấu Hình Redirect URI Trên Google Cloud',
    description: 'Google từ chối chuyển hướng vì URI callback của Supabase chưa được thêm vào danh sách trắng Authorized Redirect URIs.',
    solutionHint: 'Thêm chính xác URI sau vào Google Cloud Console (OAuth Client ID > Authorized redirect URIs): https://kdfjiqnfjjtyxctcolyi.supabase.co/auth/v1/callback',
  },
  unsupported_provider: {
    code: 'unsupported_provider',
    title: 'Google Provider Chưa Được Bật Trên Supabase',
    description: 'Dự án Supabase chưa kích hoạt hoặc thiếu Client ID / Secret của nhà cung cấp Google.',
    solutionHint: 'Đăng nhập vào Supabase Dashboard > Authentication > Providers > Google, bật toggle Enabled và điền Client ID & Secret từ Google Cloud.',
  },
  user_cancelled: {
    code: 'user_cancelled',
    title: 'Đăng Nhập Bị Hủy',
    description: 'Bạn đã đóng cửa sổ xác thực của Google hoặc hủy yêu cầu liên kết tài khoản.',
    solutionHint: 'Vui lòng bấm lại nút đăng nhập bằng Google hoặc chuyển sang hình thức đăng nhập bằng Email.',
  },
  session_missing: {
    code: 'session_missing',
    title: 'Không Thể Thiết Lập Phiên Làm Việc',
    description: 'Không tìm thấy access token hoặc mã code hợp lệ trên đường dẫn chuyển hướng callback.',
    solutionHint: 'Kiểm tra xem trình duyệt có bật tiện ích chặn cookie bên thứ ba hoặc AdBlock không, rồi thử đăng nhập lại.',
  },
};

export const getDiagnosticForError = (errorCode?: string, errorDescription?: string): OAuthErrorEntry => {
  const code = (errorCode || '').toLowerCase();
  const desc = (errorDescription || '').toLowerCase();

  if (code.includes('access_denied') || desc.includes('access_denied') || desc.includes('testing')) {
    return OAUTH_ERROR_CATALOG.access_denied;
  }
  if (code.includes('redirect_uri_mismatch') || desc.includes('redirect_uri_mismatch')) {
    return OAUTH_ERROR_CATALOG.redirect_uri_mismatch;
  }
  if (code.includes('unsupported_provider') || desc.includes('not enabled')) {
    return OAUTH_ERROR_CATALOG.unsupported_provider;
  }
  if (desc.includes('cancelled') || desc.includes('cancel')) {
    return OAUTH_ERROR_CATALOG.user_cancelled;
  }

  return {
    code: errorCode || 'unknown_oauth_error',
    title: 'Lỗi Xác Thực OAuth',
    description: errorDescription || 'Đã xảy ra sự cố trong quá trình trao đổi khóa xác thực với Google.',
    solutionHint: 'Vui lòng thử lại sau vài giây hoặc sử dụng tính năng "Trải nghiệm ngay bản Demo" để tiếp tục làm việc.',
  };
};
