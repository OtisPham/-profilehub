/**
 * dng-component.types.ts
 * Khai báo kiểu dữ liệu TypeScript (Strict Mode) - Phục vụ đồ án ProfileHub
 * Nhiệm vụ: Thiết kế CSDL & Schema Types cho X�y d?ng Component th?ng k� ch? s? CV ATS Score Card
 */

export interface IdngcomponentItem {
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

export interface IdngcomponentResponse {
  success: boolean;
  message: string;
  data: IdngcomponentItem[];
  total: number;
}
