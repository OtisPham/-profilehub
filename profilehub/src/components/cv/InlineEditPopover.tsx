import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  Scissors,
  Check,
  X,
  Copy,
  Save,
  AlertCircle,
  Loader2,
  Briefcase,
  TrendingUp,
  Globe
} from 'lucide-react';
import { cvService } from '../../services/cvService';

export interface InlineEditPopoverProps {
  isOpen: boolean;
  initialText: string;
  fieldLabel?: string;
  targetRole?: string;
  jdContext?: string;
  keywords?: string[];
  remainingCredits: number;
  onSaveManual: (newText: string) => void;
  onApplyAi: (newText: string) => void;
  onClose: () => void;
}

export default function InlineEditPopover({
  isOpen,
  initialText,
  fieldLabel = 'nội dung',
  targetRole = 'Chuyên viên kỹ thuật',
  jdContext = '',
  keywords = [],
  remainingCredits,
  onSaveManual,
  onApplyAi,
  onClose
}: InlineEditPopoverProps) {
  const [manualText, setManualText] = useState(initialText);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setManualText(initialText);
      setAiSuggestion(null);
      setActiveAction(null);
      setErrorMessage(null);
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }, 50);
    }
  }, [isOpen, initialText]);

  // Handle keyboard shortcuts (Ctrl+Enter to save, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSaveManual();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, manualText]);

  if (!isOpen) return null;

  const handleSaveManual = () => {
    if (manualText.trim() !== initialText.trim()) {
      onSaveManual(manualText.trim());
    }
    onClose();
  };

  const handleApplyAiSuggestion = () => {
    if (aiSuggestion && aiSuggestion.trim()) {
      onApplyAi(aiSuggestion.trim());
      onClose();
    }
  };

  const handleCopySuggestionToEditor = () => {
    if (aiSuggestion) {
      setManualText(aiSuggestion);
    }
  };

  const handleTriggerAiAction = async (
    actionType:
      | 'REWRITE_FOR_JD'
      | 'ADD_KEYWORDS'
      | 'SHORTEN'
      | 'REWRITE_PROFESSIONAL'
      | 'FOCUS_RESULTS'
      | 'TRANSLATE_EN'
  ) => {
    if (remainingCredits <= 0) {
      setErrorMessage('Bạn đã sử dụng hết 20 lượt AI hôm nay. Vui lòng chỉnh sửa thủ công.');
      return;
    }

    setAiLoading(true);
    setActiveAction(actionType);
    setErrorMessage(null);

    try {
      const result = await cvService.executeContextualAiAction({
        actionType,
        currentText: manualText || initialText,
        targetRole,
        jdContext,
        keywords
      });

      if (result && result.suggestedText) {
        setAiSuggestion(result.suggestedText);
      } else {
        setErrorMessage('Không nhận được gợi ý phù hợp từ AI. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setErrorMessage('Lỗi kết nối AI. Vui lòng thử lại hoặc chỉnh sửa thủ công.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]"
        style={{ fontFamily: "'Inter', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-blue-50/80 via-sky-50/40 to-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              ✏️
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Chỉnh Sửa & Tác Vụ AI Ngữ Cảnh
              </h3>
              <p className="text-[11px] text-slate-500">
                Tối ưu {fieldLabel} trực tiếp bám sát vị trí: <strong className="text-[#1e3a8a]">{targetRole}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Đóng (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Sửa tay trực tiếp */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>Sửa tay trực tiếp</span>
                <span className="text-[10px] text-emerald-700 font-semibold lowercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  miễn phí
                </span>
              </label>
              <span className="text-[10px] text-slate-400">Ctrl + Enter để lưu nhanh</span>
            </div>
            <textarea
              ref={textareaRef}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              rows={3}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-100 outline-none transition resize-y font-normal leading-relaxed"
              placeholder="Nhập nội dung chỉnh sửa tại đây..."
            />
          </div>

          {/* Contextual AI Actions Buttons */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-600" />
                <span>Gợi ý nhanh từ AI (Surgical Actions):</span>
              </span>
              <span className="text-[11px] font-semibold text-[#1e40af] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                ⚡ Còn: {remainingCredits}/20 lượt
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTriggerAiAction('REWRITE_FOR_JD')}
                disabled={aiLoading}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  activeAction === 'REWRITE_FOR_JD' && aiLoading
                    ? 'bg-purple-50 border-purple-300 text-purple-700'
                    : 'bg-white hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-700'
                } disabled:opacity-50 shadow-2xs`}
              >
                {aiLoading && activeAction === 'REWRITE_FOR_JD' ? (
                  <Loader2 size={13} className="animate-spin text-purple-600" />
                ) : (
                  <Zap size={13} className="text-purple-600" />
                )}
                <span>Viết lại theo JD</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerAiAction('ADD_KEYWORDS')}
                disabled={aiLoading}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  activeAction === 'ADD_KEYWORDS' && aiLoading
                    ? 'bg-blue-50 border-blue-300 text-[#1e40af]'
                    : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700'
                } disabled:opacity-50 shadow-2xs`}
              >
                {aiLoading && activeAction === 'ADD_KEYWORDS' ? (
                  <Loader2 size={13} className="animate-spin text-[#1e3a8a]" />
                ) : (
                  <Target size={13} className="text-[#1e3a8a]" />
                )}
                <span>Thêm từ khóa JD</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerAiAction('SHORTEN')}
                disabled={aiLoading}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  activeAction === 'SHORTEN' && aiLoading
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-700'
                } disabled:opacity-50 shadow-2xs`}
              >
                {aiLoading && activeAction === 'SHORTEN' ? (
                  <Loader2 size={13} className="animate-spin text-amber-600" />
                ) : (
                  <Scissors size={13} className="text-amber-600" />
                )}
                <span>Rút gọn vừa trang</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerAiAction('REWRITE_PROFESSIONAL')}
                disabled={aiLoading}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  activeAction === 'REWRITE_PROFESSIONAL' && aiLoading
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700'
                } disabled:opacity-50 shadow-2xs`}
              >
                {aiLoading && activeAction === 'REWRITE_PROFESSIONAL' ? (
                  <Loader2 size={13} className="animate-spin text-emerald-600" />
                ) : (
                  <Briefcase size={13} className="text-emerald-600" />
                )}
                <span>Văn phong chuẩn</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerAiAction('FOCUS_RESULTS')}
                disabled={aiLoading}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  activeAction === 'FOCUS_RESULTS' && aiLoading
                    ? 'bg-blue-50 border-blue-300 text-[#1e40af]'
                    : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700'
                } disabled:opacity-50 shadow-2xs`}
              >
                {aiLoading && activeAction === 'FOCUS_RESULTS' ? (
                  <Loader2 size={13} className="animate-spin text-[#1e3a8a]" />
                ) : (
                  <TrendingUp size={13} className="text-[#1e3a8a]" />
                )}
                <span>Thêm số liệu STAR</span>
              </button>

              <button
                type="button"
                onClick={() => handleTriggerAiAction('TRANSLATE_EN')}
                disabled={aiLoading}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  activeAction === 'TRANSLATE_EN' && aiLoading
                    ? 'bg-teal-50 border-teal-300 text-teal-700'
                    : 'bg-white hover:bg-teal-50 border-slate-200 hover:border-teal-300 text-slate-700'
                } disabled:opacity-50 shadow-2xs`}
              >
                {aiLoading && activeAction === 'TRANSLATE_EN' ? (
                  <Loader2 size={13} className="animate-spin text-teal-600" />
                ) : (
                  <Globe size={13} className="text-teal-600" />
                )}
                <span>Dịch tiếng Anh</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* AI Suggestion Card (if proposed) */}
          {aiSuggestion && (
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-200 shadow-xs space-y-2.5 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#1e3a8a]">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#1e3a8a]" />
                  Đề xuất từ AI ({
                    activeAction === 'REWRITE_FOR_JD' ? 'Viết lại theo JD' :
                    activeAction === 'ADD_KEYWORDS' ? 'Lồng ghép từ khóa' :
                    activeAction === 'SHORTEN' ? 'Rút gọn súc tích' :
                    activeAction === 'REWRITE_PROFESSIONAL' ? 'Văn phong chuyên nghiệp' :
                    activeAction === 'FOCUS_RESULTS' ? 'Nhấn mạnh kết quả (STAR)' :
                    activeAction === 'TRANSLATE_EN' ? 'Dịch sang tiếng Anh' : 'Gợi ý từ AI'
                  }):
                </span>
                <button
                  type="button"
                  onClick={handleCopySuggestionToEditor}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-[#1e3a8a] hover:underline"
                  title="Chép lên ô soạn thảo để sửa tay thêm"
                >
                  <Copy size={12} />
                  <span>Chép lên ô sửa</span>
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-white/95 border border-blue-100 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {aiSuggestion}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleApplyAiSuggestion}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#1e40af] hover:to-[#1d4ed8] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                >
                  <Check size={13} />
                  <span>Áp dụng gợi ý này (Trừ 1 credit)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSaveManual}
            className="px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-bold shadow-md shadow-blue-900/10 flex items-center gap-1.5 cursor-pointer transition active:scale-95"
          >
            <Save size={13} />
            <span>Lưu sửa tay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
