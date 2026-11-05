export interface CandidatePrivacySettings {
  is_open_to_work: boolean;
  blocked_companies: string[];
  hide_contact_info_until_interview?: boolean;
  updated_at?: string;
}

export const DEFAULT_PRIVACY_SETTINGS: CandidatePrivacySettings = {
  is_open_to_work: true,
  blocked_companies: [],
  hide_contact_info_until_interview: false,
};
