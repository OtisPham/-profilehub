/**
 * task-027-bo-giam.types.ts
 * Khai báo kiểu dữ liệu TypeScript (Strict Mode) - Phục vụ đồ án ProfileHub
 * Nhiệm vụ: Khai báo Schema Types & Interfaces cho [TASK-027] Bộ Giám Sát Kết Nối Tự Động Reconnect & Đo Độ Trễ SSE Network
 */

export interface Itask027bogiamItem {
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

export interface Itask027bogiamResponse {
  success: boolean;
  message: string;
  data: Itask027bogiamItem[];
  total: number;
}
