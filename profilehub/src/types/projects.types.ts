/**
 * projects.types.ts
 * Khai báo kiểu dữ liệu TypeScript (Strict Mode) - Phục vụ đồ án ProfileHub
 * Nhiệm vụ: Khai báo Schema Types & Interfaces cho Dự án Thực tế (Projects)
 */

export interface IprojectsItem {
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

export interface IprojectsResponse {
  success: boolean;
  message: string;
  data: IprojectsItem[];
  total: number;
}
