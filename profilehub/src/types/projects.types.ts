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

/**
 * PublicVerifiedProjectRecord
 * DTO dữ liệu công khai trên Cổng tra cứu bảo chứng đồ án (/verify/:code).
 * Đã qua rào chắn Zero Data Leak (tuyệt đối không chứa GPA, SĐT, Email cá nhân).
 */
export interface PublicVerifiedProjectRecord {
  verificationCode: string;
  verificationHash: string;
  verifiedAt: string;
  project: {
    id: string;
    title: string;
    projectType: string;
    description: string;
    tags: string[];
    demoUrl?: string;
    githubUrl?: string;
    figmaUrl?: string;
    docUrl?: string;
  };
  student: {
    name: string;
    university: string;
    faculty?: string;
    avatarUrl?: string;
  };
  instructor: {
    name: string;
    title: string;
    department?: string;
  };
  isValid: boolean;
}

