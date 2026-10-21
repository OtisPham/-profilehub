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
  Loader2
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

  const handleTriggerAiAction = async (actionType: 'REWRITE_FOR_JD' | 'ADD_KEYWORDS' | 'SHORTEN') => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh]"
        style={{ fontFamily: "'Inter', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              ✏️
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Chỉnh Sửa & Tác Vụ AI Ngữ Cảnh
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tối ưu {fieldLabel} trực tiếp bám sát vị trí: <strong className="text-blue-600 dark:text-blue-400">{targetRole}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition"
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Sửa tay trực tiếp</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold lowercase bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
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
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition resize-y font-normal leading-relaxed"
              placeholder="Nhập nội dung chỉnh sửa tại đây..."
            />
          </div>

          {/* Contextual AI Actions Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
                <span>Gợi ý nhanh từ AI (Surgical Actions):</span>
              </span>
              <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
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
                    : 'bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 border-slate-200 dark:border-slate-700 hover:border-purple-300 text-slate-700 dark:text-slate-200'
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
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-700 dark:text-slate-200'
                } disabled:opacity-50 shadow-2xs`}
              >
                {aiLoading && activeAction === 'ADD_KEYWORDS' ? (
                  <Loader2 size={13} className="animate-spin text-blue-600" />
                ) : (
                  <Target size={13} className="text-blue-600" />
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
                    : 'bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-slate-200 dark:border-slate-700 hover:border-amber-300 text-slate-700 dark:text-slate-200'
                } disabled:opacity-50 shadow-2xs`}
              >
                {aiLoading && activeAction === 'SHORTEN' ? (
                  <Loader2 size={13} className="animate-spin text-amber-600" />
                ) : (
                  <Scissors size={13} className="text-amber-600" />
                )}
                <span>Rút gọn vừa trang</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* AI Suggestion Card (if proposed) */}
          {aiSuggestion && (
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50/80 to-blue-50/80 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800/60 shadow-xs space-y-2.5 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900 dark:text-purple-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-600 dark:text-purple-400" />
                  Đề xuất từ AI ({activeAction === 'REWRITE_FOR_JD' ? 'Viết lại theo JD' : activeAction === 'ADD_KEYWORDS' ? 'Lồng ghép từ khóa' : 'Rút gọn súc tích'}):
                </span>
                <button
                  type="button"
                  onClick={handleCopySuggestionToEditor}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-purple-700 dark:text-slate-300 hover:underline"
                  title="Chép lên ô soạn thảo để sửa tay thêm"
                >
                  <Copy size={12} />
                  <span>Chép lên ô sửa</span>
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-purple-100 dark:border-purple-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                {aiSuggestion}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleApplyAiSuggestion}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                >
                  <Check size={13} />
                  <span>Áp dụng gợi ý này (Trừ 1 credit)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer transition"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSaveManual}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
          >
            <Save size={13} />
            <span>Lưu sửa tay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
