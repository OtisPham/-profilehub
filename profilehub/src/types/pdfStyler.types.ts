/**
 * Type definitions for Multi-Theme PDF Styler & Professional Resume Export Studio
 * File: src/types/pdfStyler.types.ts
 */

import type { CVTemplateType } from '../components/cv/CVTemplates';

export type PrintDensity = 'compact' | 'normal' | 'relaxed';

export type FontId = 'be-vietnam-pro' | 'inter' | 'plus-jakarta' | 'lora' | 'roboto';

export interface FontOptionItem {
  id: FontId;
  name: string;
  desc: string;
  fontFamily: string;
}

export interface ColorPaletteItem {
  id: string;
  name: string;
  hex: string;
  badgeLabel?: string;
}

export interface VisualTemplateItem {
  id: CVTemplateType;
  name: string;
  subtitle: string;
  desc: string;
  badge: string;
  badgeColor: string;
  layoutType: '1_column' | '2_column_split' | 'top_banner' | 'timeline';
}

export interface PdfStylerOptions {
  templateId: CVTemplateType;
  primaryColor: string;
  fontId: FontId;
  density: PrintDensity;
  showQrCode: boolean;
  hideAvatar: boolean;
  showEvidenceBadges: boolean;
}

export interface PageBudgetMetric {
  ratioPercent: number; // Tỷ lệ % so với chiều cao chuẩn A4
  isSinglePage: boolean; // True nếu <= 100%
  isWarning: boolean; // True nếu > 100% && <= 115% (chớm tràn dòng mồ côi)
  isMultiPage: boolean; // True nếu > 115%
  statusMessage: string;
  badgeColor: 'emerald' | 'amber' | 'rose';
}
