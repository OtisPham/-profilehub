/**
 * profile.types.ts
 * Khai báo kiểu dữ liệu TypeScript (Strict Mode) - Phục vụ đồ án ProfileHub
 * Nhiệm vụ: Thiết kế CSDL & Schema Types cho Quản lý Hồ sơ (Profile)
 */

export interface IprofileItem {
  id: string;
  title: string;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  metrics: {
    views?: number;
    score?: number;
    confidenceRate?: number;
  };
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IprofileResponse {
  success: boolean;
  message: string;
  data: IprofileItem[];
  total: number;
}
