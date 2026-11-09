import type { OfferLetter, CreateOfferParams, OfferStatus } from '../types/database';
import { updateCandidatePipelineStage } from '../utils/pipelineSync';

const OFFERS_STORAGE_KEY = 'profilehub_offer_letters_store';

// Helper sinh token bảo mật không trùng lặp
export function generateSecureOfferToken(): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let token = 'off_sec_';
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export const offerLetterService = {
  // Lấy toàn bộ danh sách offer từ LocalStorage
  getAllOffers(): OfferLetter[] {
    try {
      const data = localStorage.getItem(OFFERS_STORAGE_KEY);
      if (!data) return [];
      const parsed: OfferLetter[] = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Lỗi khi đọc danh sách Offers:', err);
      return [];
    }
  },

  // Lưu danh sách offer vào LocalStorage và dispatch event đồng bộ
  saveAllOffers(offers: OfferLetter[]): void {
    try {
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers));
      window.dispatchEvent(new CustomEvent('profilehub_offer_updated', { detail: { count: offers.length } }));
    } catch (err) {
      console.error('Lỗi khi lưu danh sách Offers:', err);
    }
  },

  // Tạo mới một Thư mời nhận việc
  createOffer(params: CreateOfferParams): OfferLetter {
    const all = this.getAllOffers();
    const now = new Date().toISOString();
    const token = generateSecureOfferToken();
    const id = `off_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newOffer: OfferLetter = {
      id,
      token,
      candidate_id: params.candidateId,
      candidate_name: params.candidateName,
      candidate_email: params.candidateEmail,
      recruiter_id: params.recruiterId,
      company_name: params.companyName,
      company_logo: params.companyLogo,
      is_company_verified: params.isCompanyVerified ?? true,
      job_title: params.jobTitle,
      department: params.department,
      level: params.level,
      workplace_type: params.workplaceType,
      location: params.location,
      salary_official: params.salaryOfficial,
      salary_probation: params.salaryProbation || Math.round(params.salaryOfficial * 0.85),
      probation_period_months: params.probationPeriodMonths || 2,
      sign_on_bonus: params.signOnBonus || 0,
      currency: params.currency || 'VND',
      start_date: params.startDate,
      deadline_date: params.deadlineDate,
      benefits: params.benefits || [],
      custom_message: params.customMessage,
      status: 'pending',
      created_at: now,
      updated_at: now
    };

    // Loại bỏ offer cũ của candidate nếu có (để giữ bản mới nhất)
    const filtered = all.filter(o => o.candidate_id !== params.candidateId);
    filtered.unshift(newOffer);
    this.saveAllOffers(filtered);

    return newOffer;
  },

  // Tra cứu Offer theo Token bảo mật công khai (Public Lookup)
  getOfferByToken(token: string): OfferLetter | null {
    if (!token) return null;
    const all = this.getAllOffers();
    const offer = all.find(o => o.token === token);
    if (!offer) return null;

    // Kiểm tra tự động xem đã hết hạn deadline chưa
    if (offer.status === 'pending') {
      const deadline = new Date(offer.deadline_date);
      // Đặt hạn chót là cuối ngày đó
      deadline.setHours(23, 59, 59, 999);
      if (new Date() > deadline) {
        offer.status = 'expired';
        offer.updated_at = new Date().toISOString();
        this.saveAllOffers(all);
      }
    }

    return offer;
  },

  // Lấy Offer gần nhất theo candidateId
  getOfferByCandidateId(candidateId: string): OfferLetter | null {
    if (!candidateId) return null;
    const all = this.getAllOffers();
    return all.find(o => o.candidate_id === candidateId) || null;
  },

  // Ứng viên chấp nhận lời mời (1-Click Digital Sign-off)
  acceptOffer(token: string, digitalSignature: string): { success: boolean; offer?: OfferLetter; error?: string } {
    if (!digitalSignature || digitalSignature.trim().length < 2) {
      return { success: false, error: 'Vui lòng nhập đầy đủ họ và tên để ký số điện tử.' };
    }

    const all = this.getAllOffers();
    const index = all.findIndex(o => o.token === token);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy thư mời hoặc liên kết không hợp lệ.' };
    }

    const offer = all[index];
    if (offer.status === 'expired') {
      return { success: false, error: 'Thư mời này đã quá thời hạn phản hồi.' };
    }

    const now = new Date().toISOString();
    offer.status = 'accepted';
    offer.digital_signature = digitalSignature.trim();
    offer.signed_at = now;
    offer.updated_at = now;

    all[index] = offer;
    this.saveAllOffers(all);

    // Kéo thẻ ứng viên sang cột 'hired' trên Pipeline
    try {
      updateCandidatePipelineStage(offer.candidate_id, 'hired', `Ứng viên đã ký nhận việc điện tử (${offer.digital_signature})`);
    } catch (e) {
      console.warn('Lỗi đồng bộ pipeline stage:', e);
    }

    return { success: true, offer };
  },

  // Ứng viên gửi phản hồi thương lượng / đề xuất điều chỉnh ngày làm việc
  negotiateOffer(token: string, notes: string): { success: boolean; offer?: OfferLetter; error?: string } {
    if (!notes || notes.trim().length === 0) {
      return { success: false, error: 'Vui lòng nhập nội dung đề xuất điều chỉnh.' };
    }

    const all = this.getAllOffers();
    const index = all.findIndex(o => o.token === token);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy thư mời.' };
    }

    const offer = all[index];
    const now = new Date().toISOString();
    offer.status = 'negotiating';
    offer.negotiation_notes = notes.trim();
    offer.updated_at = now;

    all[index] = offer;
    this.saveAllOffers(all);

    return { success: true, offer };
  },

  // Ứng viên từ chối thư mời
  declineOffer(token: string, reason?: string): { success: boolean; offer?: OfferLetter; error?: string } {
    const all = this.getAllOffers();
    const index = all.findIndex(o => o.token === token);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy thư mời.' };
    }

    const offer = all[index];
    const now = new Date().toISOString();
    offer.status = 'declined';
    if (reason) offer.negotiation_notes = `Lý do từ chối: ${reason}`;
    offer.updated_at = now;

    all[index] = offer;
    this.saveAllOffers(all);

    return { success: true, offer };
  }
};
