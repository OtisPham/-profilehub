/**
 * cv-heatmap.types.ts
 * Khai báo kiểu dữ liệu TypeScript (Strict Mode) - Phục vụ đồ án ProfileHub
 * Nhiệm vụ: Khai báo Schema Types & Interfaces cho Bản đồ nhiệt CV Heatmap & Lịch sử điểm ATS
 */

export interface IcvheatmapItem {
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

export interface IcvheatmapResponse {
  success: boolean;
  message: string;
  data: IcvheatmapItem[];
  total: number;
}
