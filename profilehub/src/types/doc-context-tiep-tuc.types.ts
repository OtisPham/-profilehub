/**
 * doc-context-tiep-tuc.types.ts
 * Khai báo kiểu dữ liệu TypeScript (Strict Mode) - Phục vụ đồ án ProfileHub
 * Nhiệm vụ: Thiết kế CSDL & Schema Types cho đọc context tiếp tục phân rã chức năng hoàn thiện tiếp tính năng còn thiếu /po
 */

export interface IdoccontexttieptucItem {
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

export interface IdoccontexttieptucResponse {
  success: boolean;
  message: string;
  data: IdoccontexttieptucItem[];
  total: number;
}
