/**
 * PdfExportStylerModal
 * Trạm Xuất Bản CV Chuyên Nghiệp: Xem trước tờ in A4 tỷ lệ 1:1,
 * tùy biến 6 mẫu CV thẻ ảnh trực quan, chọn màu sắc & phông chữ chuẩn IT,
 * bật/tắt 4 công tắc in ấn thông minh và kiểm soát ngân sách trang in A4.
 * File: src/components/cv/PdfExportStylerModal.tsx
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { CVTemplateType, CVDataProps } from './CVTemplates';
import { RenderCVTemplate } from './CVTemplates';
import {
  VISUAL_TEMPLATES,
  STYLER_COLOR_PALETTES,
  STYLER_FONT_OPTIONS,
  getStoredStylerPreferences,
  saveStylerPreferences,
  calculatePageBudget,
  getDensityStyles,
  STANDARD_A4_HEIGHT_PX
} from '../../services/pdfStylerService';
import type {
  PdfStylerOptions,
  PrintDensity,
  FontId
} from '../../types/pdfStyler.types';
import {
  Printer,
  X,
  Sparkles,
  Check,
  QrCode,
  EyeOff,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Type,
  Palette,
  LayoutTemplate,
  Layers
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export interface PdfExportStylerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVDataProps;
  currentTemplate?: CVTemplateType;
  currentColor?: string;
  currentFontId?: FontId;
  userId?: string;
  onApplyPreferencesToBuilder?: (options: PdfStylerOptions) => void;
  onTriggerPrint?: (options: PdfStylerOptions) => void;
}

export default function PdfExportStylerModal({
  isOpen,
  onClose,
  cvData,
  currentTemplate = 'classic',
  currentColor = '#1e3a8a',
  currentFontId = 'inter',
  userId,
  onApplyPreferencesToBuilder,
  onTriggerPrint
}: PdfExportStylerModalProps) {
  // Styler Preferences State
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplateType>(currentTemplate);
  const [selectedColor, setSelectedColor] = useState<string>(currentColor);
  const [selectedFontId, setSelectedFontId] = useState<FontId>(currentFontId);
  const [density, setDensity] = useState<PrintDensity>('normal');
  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  const [hideAvatar, setHideAvatar] = useState<boolean>(false);
  const [showEvidenceBadges, setShowEvidenceBadges] = useState<boolean>(true);

  // Zoom scale for preview sheet (0.6x - 1.1x)
  const [previewZoom, setPreviewZoom] = useState<number>(0.85);

  // Success toast for saving preferences
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Content measurement ref for Page Budget calculation
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(1000);

  // Initialize preferences on open
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredStylerPreferences({
        templateId: currentTemplate,
        primaryColor: currentColor,
        fontId: currentFontId
      });
      setSelectedTemplate(stored.templateId);
      setSelectedColor(stored.primaryColor);
      setSelectedFontId(stored.fontId);
      setDensity(stored.density);
      setShowQrCode(stored.showQrCode);
      setHideAvatar(stored.hideAvatar);
      setShowEvidenceBadges(stored.showEvidenceBadges);
    }
  }, [isOpen, currentTemplate, currentColor, currentFontId]);

  // Recalculate content height whenever template/density/styles change
  useEffect(() => {
    if (isOpen && sheetContentRef.current) {
      const timer = setTimeout(() => {
        if (sheetContentRef.current) {
          setContentHeight(sheetContentRef.current.scrollHeight);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedTemplate, selectedColor, selectedFontId, density, showQrCode, hideAvatar, showEvidenceBadges]);

  // Page Budget Metric
  const pageBudget = useMemo(() => {
    return calculatePageBudget(contentHeight, STANDARD_A4_HEIGHT_PX);
  }, [contentHeight]);

  // Font family string
  const activeFontFamily = useMemo(() => {
    const found = STYLER_FONT_OPTIONS.find((f) => f.id === selectedFontId);
    return found ? found.fontFamily : "'Inter', sans-serif";
  }, [selectedFontId]);

  // Density styles
  const densityStyles = useMemo(() => {
    return getDensityStyles(density);
  }, [density]);

  // Current full options object
  const currentOptions: PdfStylerOptions = useMemo(() => {
    return {
      templateId: selectedTemplate,
      primaryColor: selectedColor,
      fontId: selectedFontId,
      density,
      showQrCode,
      hideAvatar,
      showEvidenceBadges
    };
  }, [selectedTemplate, selectedColor, selectedFontId, density, showQrCode, hideAvatar, showEvidenceBadges]);

  // Clone cvData with avatar visibility modified if needed
  const previewCvData: CVDataProps = useMemo(() => {
    const cloned = { ...cvData, primaryColor: selectedColor };
    if (hideAvatar && cloned.profile) {
      cloned.profile = {
        ...cloned.profile,
        // Khi hideAvatar bật, xóa tên chữ cái hoặc đánh dấu rỗng
        full_name: cloned.profile.full_name
      };
    }
    return cloned;
  }, [cvData, selectedColor, hideAvatar]);

  // Handle Save as Default Preferences
  const handleSaveDefault = () => {
    saveStylerPreferences(currentOptions);
    if (onApplyPreferencesToBuilder) {
      onApplyPreferencesToBuilder(currentOptions);
    }
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  // Handle Print Action
  const handlePrint = () => {
    if (onApplyPreferencesToBuilder) {
      onApplyPreferencesToBuilder(currentOptions);
    }
    if (onTriggerPrint) {
      onTriggerPrint(currentOptions);
    } else {
      // Direct clean print fallback
      window.print();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-[#0b0f19] text-white w-full max-w-[1400px] h-[95vh] rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden transition-all">
        {/* MODAL HEADER */}
        <div className="px-6 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900 via-[#0b0f19] to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Printer size={20} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Trạm Xuất Bản CV In Ấn Chuyên Nghiệp (A4 Print Studio)
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-400/20">
                  ✨ Live 1:1 Preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tự do thay đổi phong cách, màu sắc, phông chữ và kiểm soát ngân sách 1 trang A4 hoàn hảo trước khi in
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Save as default button */}
            <button
              onClick={handleSaveDefault}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Lưu cấu hình phong cách này làm mặc định cho các lần sau"
            >
              <Save size={14} className="text-blue-400" />
              <span>{isSavedToast ? 'Đã lưu mặc định!' : 'Lưu Làm Mặc Định'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng trạm in ấn"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MODAL MAIN BODY: SPLIT-PANE LAYOUT */}
        <div className="flex-1 flex overflow-hidden">
          {/* CỘT TRÁI: STYLE & PRINT CONTROLS (390px) */}
          <div className="w-[390px] border-r border-slate-800 bg-[#0f1422] p-5 overflow-y-auto space-y-6 shrink-0 custom-scrollbar">
            {/* 1. VISUAL TEMPLATE PICKER (6 MẪU CARD TRỰC QUAN) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <LayoutTemplate size={16} className="text-blue-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    1. Mẫu Thiết Kế CV (6 Phong Cách)
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {VISUAL_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplate === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                          }`}
                        >
                          {tmpl.badge}
                        </span>
                        {isSelected && <Check size={14} className="text-blue-400" />}
                      </div>
                      <div className="text-xs font-bold text-white truncate">{tmpl.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tmpl.subtitle}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. BẢNG MÀU CHỦ ĐẠO (ACCENT COLORS) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    2. Bảng Màu Chủ Đạo
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {STYLER_COLOR_PALETTES.map((palette) => {
                  const isSelected = selectedColor.toLowerCase() === palette.hex.toLowerCase();
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setSelectedColor(palette.hex)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-950/30 ring-1 ring-indigo-400/40'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center text-white"
                        style={{ backgroundColor: palette.hex }}
                      >
                        {isSelected && <Check size={13} className="text-white drop-shadow" />}
                      </div>
                      <span className="text-[10.5px] font-semibold text-slate-300 text-center truncate w-full">
                        {palette.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. BỘ PHÔNG CHỮ TIẾNG VIỆT (TYPOGRAPHY) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Type size={16} className="text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    3. Phông Chữ Chuẩn In
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {STYLER_FONT_OPTIONS.map((f) => {
                  const isSelected = selectedFontId === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFontId(f.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/30 ring-1 ring-emerald-400/40'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-200 truncate" style={{ fontFamily: f.fontFamily }}>
                        {f.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{f.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. CÔNG TẮC IN ẤN CHUYÊN NGHIỆP (SMART PRINT SWITCHES) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders size={16} className="text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    4. Công Tắc In Ấn & Mật Độ
                  </h3>
                </div>
              </div>

              {/* Mật độ dòng: Compact / Normal / Relaxed */}
              <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Mật độ co giãn dòng (Page Density):</span>
                  <span className="text-[10px] text-amber-300 font-bold uppercase">{density}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDensity('compact')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      density === 'compact'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Cỡ chữ 9.5pt, khoảng cách hẹp, gom trọn 1 trang A4"
                  >
                    Gọn Gàng
                  </button>
                  <button
                    type="button"
                    onClick={() => setDensity('normal')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      density === 'normal'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Cỡ chữ 10.5pt, khoảng cách tiêu chuẩn"
                  >
                    Chuẩn Mực
                  </button>
                  <button
                    type="button"
                    onClick={() => setDensity('relaxed')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      density === 'relaxed'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Cỡ chữ 11pt, thoáng đãng cho hồ sơ ít mục"
                  >
                    Thoáng Đãng
                  </button>
                </div>
              </div>

              {/* Các toggles chuyên sâu */}
              <div className="space-y-2">
                {/* Toggle 1: In mã QR */}
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 cursor-pointer hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <QrCode size={15} className="text-indigo-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">In Mã QR Bằng Chứng Số</div>
                      <div className="text-[10px] text-slate-400">Dẫn trực tiếp tới Showcase đồ án</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showQrCode}
                    onChange={(e) => setShowQrCode(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
                  />
                </label>

                {/* Toggle 2: Ẩn ảnh thẻ (Blind Hiring) */}
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 cursor-pointer hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <EyeOff size={15} className="text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Ẩn Ảnh Thẻ Đại Diện</div>
                      <div className="text-[10px] text-slate-400">Chuẩn Blind Hiring quốc tế (Mỹ / EU)</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hideAvatar}
                    onChange={(e) => setHideAvatar(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
                  />
                </label>

                {/* Toggle 3: Huy hiệu bảo chứng */}
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 cursor-pointer hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={15} className="text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Huy Hiệu Demo Ready 🚀</div>
                      <div className="text-[10px] text-slate-400">Bảo chứng mã nguồn & sản phẩm thực tế</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showEvidenceBadges}
                    onChange={(e) => setShowEvidenceBadges(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: LIVE A4 PRINT SHEET PREVIEW */}
          <div className="flex-1 bg-[#070a13] p-4 sm:p-6 flex flex-col items-center justify-between overflow-hidden relative">
            {/* Top Toolbar: Page Budget Pill & Zoom Controls */}
            <div className="w-full max-w-[850px] mb-3 flex items-center justify-between gap-3 bg-slate-900/80 border border-slate-800/90 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-sm z-10">
              {/* Page Budget Status Indicator */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    pageBudget.isSinglePage
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                      : pageBudget.isWarning
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/80 animate-pulse'
                      : 'bg-rose-950/60 text-rose-300 border-rose-800/80'
                  }`}
                >
                  {pageBudget.isSinglePage ? (
                    <CheckCircle2 size={13} className="text-emerald-400" />
                  ) : (
                    <AlertTriangle size={13} className="text-amber-400" />
                  )}
                  <span>{pageBudget.statusMessage}</span>
                </span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Zoom: {Math.round(previewZoom * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((prev) => Math.max(0.6, prev - 0.05))}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Thu nhỏ xem tổng thể"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewZoom((prev) => Math.min(1.15, prev + 0.05))}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Phóng to đọc nội dung"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>

            {/* A4 Paper Scrollable Container */}
            <div className="flex-1 w-full overflow-y-auto flex items-start justify-center p-2 custom-scrollbar">
              <div
                style={{
                  transform: `scale(${previewZoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
              >
                {/* TỜ GIẤY IN A4 MÔ PHỎNG (210mm x 297mm) */}
                <div
                  id="cv-modal-print-sheet"
                  ref={sheetContentRef}
                  className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl rounded-sm transition-all relative overflow-hidden"
                  style={{
                    fontFamily: activeFontFamily,
                    padding: densityStyles.pagePadding,
                    lineHeight: densityStyles.lineHeight,
                    zoom: densityStyles.fontSizeScale
                  }}
                >
                  {/* Smart QR Code in ở góc trên CV nếu bật */}
                  {showQrCode && (
                    <div className="absolute top-4 right-4 z-20 flex flex-col items-center p-1.5 bg-white/95 rounded-lg border border-slate-200 shadow-xs">
                      <QRCodeSVG
                        value={`${window.location.origin}/showcase/${userId || 'demo'}`}
                        size={48}
                        level="M"
                      />
                      <span className="text-[8px] font-bold text-slate-600 mt-0.5 tracking-tighter">
                        Xác Thực Năng Lực
                      </span>
                    </div>
                  )}

                  {/* Render Mẫu Template Được Chọn */}
                  <div className={hideAvatar ? 'cv-hide-avatar-mode' : ''}>
                    <RenderCVTemplate template={selectedTemplate} data={previewCvData} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="w-full max-w-[850px] mt-3 flex items-center justify-between gap-4 pt-3 border-t border-slate-800/80 z-10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                ← Tiếp Tục Chỉnh Sửa CV
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Printer size={16} className="text-amber-300" />
                <span>🖨️ In / Tải PDF Chuẩn Kích Thước A4 Ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
