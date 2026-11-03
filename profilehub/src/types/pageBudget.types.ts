/**
 * Page-Budget Guard & Real-Time A4 Density Types
 * Định nghĩa hợp đồng dữ liệu cho thanh công cụ đo lường và tối ưu dung lượng trang A4
 */

import type { CVSection, PersonalInfoData } from './cvSection';

export type SpacingDensity = 'compact' | 'standard' | 'relaxed';

export type PageBudgetStatus = 'optimal' | 'warning' | 'overflow';

export interface PageBudgetMetrics {
  totalRenderHeightPx: number;
  usableSinglePageHeightPx: number;
  pageCount: number;
  firstPageFillPercent: number; // 0 - 100+ %
  status: PageBudgetStatus;
  statusText: string;
}

export interface PageBudgetGuardBarProps {
  sections: CVSection[];
  personalInfo: PersonalInfoData;
  spacingDensity: SpacingDensity;
  onDensityChange: (density: SpacingDensity) => void;
  onApplyAutoCondense: (condensedSections: CVSection[], charactersSaved: number) => void;
}
