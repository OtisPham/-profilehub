/**
 * Cold-Start Project Onboarding & Industry Starter Templates Types
 * Định nghĩa hợp đồng dữ liệu cho Trợ lý khởi tạo dự án bước đầu giải quyết nỗi sợ trang giấy trắng
 */

import type { ProjectItem } from './cvSection';

export type StarterDomainId = 'all' | 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'ai_data';

export interface IndustryStarterTemplate {
  id: string;
  domain: Exclude<StarterDomainId, 'all'>;
  domainTitle: string;
  projectName: string;
  role: string;
  technologies: string[];
  systemContext: string;
  scopeType: 'solo' | 'team';
  teamSize?: number;
  description: string;
  bullets: string[];
  demoUrl?: string;
  githubUrl?: string;
  starsOrMetrics?: string;
}

export interface ColdStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyStarterProject: (project: ProjectItem) => void;
  targetRole?: string;
}
