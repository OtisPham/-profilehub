/**
 * calendar.types.ts
 * Khai báo kiểu dữ liệu TypeScript (Strict Mode) - Phục vụ đồ án ProfileHub
 * Nhiệm vụ: Thiết kế CSDL & Schema Types cho Lịch & Sự kiện (Calendar)
 */

export interface IcalendarItem {
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

export interface IcalendarResponse {
  success: boolean;
  message: string;
  data: IcalendarItem[];
  total: number;
}
