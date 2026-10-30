import React from 'react';
import {
  X,
  ArrowUp,
  ArrowDown,
  Scissors,
  Eye,
  EyeOff,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  Columns
} from 'lucide-react';
import type { CVSection, CVSectionType } from '../../types/cvSection';
import type { CVTemplateType } from './CVTemplates';

interface ReorderSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: CVSection[];
  template: CVTemplateType;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  onTogglePageBreak: (sectionId: string) => void;
  onToggleHideSection: (sectionId: string) => void;
}

const LEFT_COLUMN_TYPES: CVSectionType[] = ['skills', 'certifications', 'languages', 'awards', 'references'];

export default function ReorderSectionsModal({
  isOpen,
  onClose,
  sections,
  template,
  onMoveSection,
  onTogglePageBreak,
  onToggleHideSection
}: ReorderSectionsModalProps) {
  if (!isOpen) return null;

  const isTwoColumn = ['classic', 'tech', 'pro_split', 'compact_ats'].includes(template);

  const leftSections = sections.filter(s => LEFT_COLUMN_TYPES.includes(s.type));
  const rightSections = sections.filter(s => !LEFT_COLUMN_TYPES.includes(s.type));

  const renderSectionItem = (sec: CVSection, idx: number, totalCount: number, colName?: string) => {
    const isPageBreakActive = Boolean(sec.settings?.pageBreakBefore);
    const isVisible = sec.is_visible !== false;

    return (
      <div
        key={sec.id}
        className={`p-3.5 rounded-2xl border transition-all ${
          !isVisible
            ? 'bg-slate-50 border-slate-200 opacity-60'
            : isPageBreakActive
            ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200 shadow-xs'
            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: Position & Section Title */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-7 h-7 rounded-xl bg-blue-100 text-[#1e40af] font-black text-xs flex items-center justify-center shrink-0">
              #{idx + 1}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {sec.title}
                </span>
                {!isVisible && (
                  <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">
                    Đã ẩn
                  </span>
                )}
                {isPageBreakActive && (
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Scissors size={10} />
                    Ngắt trang (Bắt đầu trang mới)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {colName ? `${colName} • ` : ''}
                {sec.items ? `${sec.items.length} mục dữ liệu` : 'Đoạn văn tự do'}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Move Up */}
            <button
              type="button"
              onClick={() => onMoveSection(sec.id, 'up')}
              disabled={idx === 0}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-[#1e3a8a] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              title="Đẩy lên trước"
            >
              <ArrowUp size={14} />
            </button>

            {/* Move Down */}
            <button
              type="button"
              onClick={() => onMoveSection(sec.id, 'down')}
              disabled={idx === totalCount - 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-[#1e3a8a] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              title="Đẩy ra sau"
            >
              <ArrowDown size={14} />
            </button>

            {/* Toggle Page Break */}
            <button
              type="button"
              onClick={() => onTogglePageBreak(sec.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                isPageBreakActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                  : 'border border-slate-200 hover:bg-amber-50 text-slate-600 hover:text-amber-800'
              }`}
              title={isPageBreakActive ? "Hủy ngắt trang" : "Ngắt trang A4 (Bắt đầu từ trang mới)"}
            >
              <Scissors size={12} />
              <span className="hidden sm:inline">
                {isPageBreakActive ? 'Hủy ngắt trang' : 'Ngắt trang'}
              </span>
            </button>

            {/* Toggle Hide/Show */}
            <button
              type="button"
              onClick={() => onToggleHideSection(sec.id)}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                isVisible
                  ? 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  : 'border-amber-300 bg-amber-100 text-amber-800'
              }`}
              title={isVisible ? "Ẩn mục này trên CV" : "Hiện lại mục này"}
            >
              {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-blue-950/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-50/80 via-sky-50/40 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1e3a8a] text-white flex items-center justify-center shadow-md shadow-blue-900/20">
              <ArrowUpDown size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Sắp Xếp Thứ Tự Mục & Dấu Ngắt Trang A4
              </h3>
              <p className="text-xs text-slate-500">
                Chủ động chọn mục nào hiển thị trước, mục nào ra sau và ngắt trang sang trang mới theo ý muốn.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Explanatory Guide Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-[#1e3a8a] flex items-center gap-1.5 text-xs sm:text-sm">
              <CheckCircle2 size={16} className="text-[#1e3a8a]" />
              <span>Hướng Dẫn Tùy Chỉnh Thứ Tự & Ngắt Trang:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>
                <strong>Nút ▲ Lên / ▼ Xuống:</strong> Đổi trực tiếp thứ tự trước/sau của các mục trên trang giấy CV.
              </li>
              <li>
                <strong>Nút ✂️ Ngắt trang:</strong> Đẩy toàn bộ mục được chọn sang đầu trang A4 kế tiếp, tránh trường hợp một mục dài bị cắt ngang lưng chừng giữa 2 trang.
              </li>
              <li>
                {isTwoColumn ? (
                  <span>Giao diện đang chọn là mẫu <strong>2 cột</strong>: Bạn có thể sắp xếp độc lập thứ tự các mục trong <em>Cột Chính</em> và <em>Cột Phụ</em>.</span>
                ) : (
                  <span>Giao diện đang chọn là mẫu <strong>1 cột</strong>: Các mục sẽ xuất hiện từ trên xuống dưới theo đúng số thứ tự #1, #2, #3...</span>
                )}
              </li>
            </ul>
          </div>

          {/* Section Lists */}
          {isTwoColumn ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Right Column (Main content in standard 2-col templates) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Columns size={14} className="text-[#1e3a8a]" />
                    Cột Chính ({rightSections.length} mục)
                  </span>
                  <span className="text-[11px] text-slate-400">Mục tiêu, Dự án, Kinh nghiệm...</span>
                </div>
                <div className="space-y-2">
                  {rightSections.map((sec, idx) =>
                    renderSectionItem(sec, idx, rightSections.length, 'Cột Chính')
                  )}
                </div>
              </div>

              {/* Left Column (Sidebar in standard 2-col templates) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={14} className="text-[#1e3a8a]" />
                    Cột Phụ ({leftSections.length} mục)
                  </span>
                  <span className="text-[11px] text-slate-400">Kỹ năng, Chứng chỉ, Ngoại ngữ...</span>
                </div>
                <div className="space-y-2">
                  {leftSections.map((sec, idx) =>
                    renderSectionItem(sec, idx, leftSections.length, 'Cột Phụ')
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-[#1e3a8a]" />
                  Danh Sách Mục CV ({sections.length} mục)
                </span>
                <span className="text-[11px] text-slate-400">Xuất hiện tuần tự từ trên xuống dưới</span>
              </div>
              {sections.map((sec, idx) =>
                renderSectionItem(sec, idx, sections.length)
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Mọi thay đổi thứ tự và ngắt trang đều được cập nhật ngay lập tức trên bản xem trước A4.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-900/20 transition active:scale-95"
          >
            Hoàn Tất
          </button>
        </div>
      </div>
    </div>
  );
}
