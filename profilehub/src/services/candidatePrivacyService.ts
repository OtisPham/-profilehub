import { supabase } from './supabase';
import { CandidatePrivacySettings, DEFAULT_PRIVACY_SETTINGS } from '../types/privacy.types';

const PRIVACY_STORAGE_PREFIX = 'profilehub_privacy_';
export const CANDIDATE_PRIVACY_EVENT = 'candidate_privacy_updated';

export const candidatePrivacyService = {
  /**
   * Lấy cấu hình quyền riêng tư của ứng viên
   */
  async getPrivacySettings(userId: string): Promise<CandidatePrivacySettings> {
    if (!userId) {
      return { ...DEFAULT_PRIVACY_SETTINGS };
    }

    // 1. Kiểm tra bộ nhớ cục bộ
    try {
      const cached = localStorage.getItem(`${PRIVACY_STORAGE_PREFIX}${userId}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Bỏ qua lỗi đọc cache
    }

    // 2. Truy vấn từ Supabase Cloud
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('is_open_to_work, blocked_companies')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const settings: CandidatePrivacySettings = {
          is_open_to_work: data.is_open_to_work ?? true,
          blocked_companies: Array.isArray(data.blocked_companies) ? data.blocked_companies : [],
        };
        localStorage.setItem(`${PRIVACY_STORAGE_PREFIX}${userId}`, JSON.stringify(settings));
        return settings;
      }
    } catch {
      // Fallback khi offline hoặc test
    }

    return { ...DEFAULT_PRIVACY_SETTINGS };
  },

  /**
   * Lưu cấu hình quyền riêng tư của ứng viên
   */
  async savePrivacySettings(
    userId: string,
    partialSettings: Partial<CandidatePrivacySettings>
  ): Promise<CandidatePrivacySettings> {
    if (!userId) {
      throw new Error('User ID is required to save privacy settings');
    }

    const current = await this.getPrivacySettings(userId);
    const updated: CandidatePrivacySettings = {
      ...current,
      ...partialSettings,
      updated_at: new Date().toISOString(),
    };

    // Lưu vào bộ nhớ cục bộ
    try {
      localStorage.setItem(`${PRIVACY_STORAGE_PREFIX}${userId}`, JSON.stringify(updated));
    } catch {
      // Bỏ qua
    }

    // Phát sự kiện để cập nhật UI toàn hệ thống
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CANDIDATE_PRIVACY_EVENT, { detail: { userId, settings: updated } }));
    }

    // Đồng bộ lên Supabase Cloud
    try {
      await supabase
        .from('student_profiles')
        .update({
          is_open_to_work: updated.is_open_to_work,
          blocked_companies: updated.blocked_companies,
        })
        .eq('id', userId);
    } catch {
      // Bỏ qua lỗi Supabase khi offline
    }

    return updated;
  },

  /**
   * Bật / tắt chế độ Sẵn sàng nhận việc (Open to Work)
   */
  async toggleOpenToWork(userId: string, isOpen: boolean): Promise<CandidatePrivacySettings> {
    return this.savePrivacySettings(userId, { is_open_to_work: isOpen });
  },

  /**
   * Thêm một công ty vào danh sách chặn
   */
  async addBlockedCompany(userId: string, companyName: string): Promise<CandidatePrivacySettings> {
    const trimmed = companyName.trim();
    if (!trimmed) {
      return this.getPrivacySettings(userId);
    }

    const current = await this.getPrivacySettings(userId);
    const exists = current.blocked_companies.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      return current;
    }

    const updatedCompanies = [...current.blocked_companies, trimmed];
    return this.savePrivacySettings(userId, { blocked_companies: updatedCompanies });
  },

  /**
   * Xóa một công ty khỏi danh sách chặn
   */
  async removeBlockedCompany(userId: string, companyName: string): Promise<CandidatePrivacySettings> {
    const current = await this.getPrivacySettings(userId);
    const updatedCompanies = current.blocked_companies.filter(
      (c) => c.toLowerCase() !== companyName.trim().toLowerCase()
    );

    return this.savePrivacySettings(userId, { blocked_companies: updatedCompanies });
  },

  /**
   * Kiểm tra xem ứng viên có được phép hiển thị với một công ty cụ thể hay không
   */
  isCandidateVisibleToCompany(
    candidate: { is_open_to_work?: boolean; blocked_companies?: string[] },
    companyName?: string
  ): boolean {
    // 1. Nếu ứng viên chủ động tắt "Open to Work", ẩn khỏi toàn bộ Talent Pool
    if (candidate.is_open_to_work === false) {
      return false;
    }

    // 2. Nếu không xác định tên công ty của Recruiter, mặc định hiển thị
    if (!companyName || !companyName.trim()) {
      return true;
    }

    // 3. Kiểm tra danh sách chặn
    const blockedList = candidate.blocked_companies || [];
    const normalizedTarget = companyName.trim().toLowerCase();

    const isBlocked = blockedList.some((blocked) => {
      const normalizedBlocked = blocked.trim().toLowerCase();
      return (
        normalizedBlocked === normalizedTarget ||
        normalizedTarget.includes(normalizedBlocked) ||
        normalizedBlocked.includes(normalizedTarget)
      );
    });

    return !isBlocked;
  },
};
