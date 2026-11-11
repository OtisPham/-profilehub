import React, { useState, useEffect } from 'react';
import type { CandidatePipelineItem, PreInterviewCheatSheet } from '../../types/database';
import {
  generatePreInterviewCheatSheet,
  saveOfflineCheatSheet,
  getOfflineCheatSheet,
} from '../../services/preInterviewCheatSheetService';
import { copyToClipboardSafe } from '../../services/batchEmailService';
import {
  X,
  Zap,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Smartphone,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface PreInterviewCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidatePipelineItem;
}

export const PreInterviewCheatSheetModal: React.FC<PreInterviewCheatSheetModalProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  const [sheet, setSheet] = useState<PreInterviewCheatSheet | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pitch' | 'metrics' | 'star' | 'questions'>('all');

  useEffect(() => {
    if (isOpen) {
      // Ưu tiên đọc từ cache hoặc sinh mới và lưu cache
      const cached = getOfflineCheatSheet(candidate.student_id);
      if (cached) {
        setSheet(cached);
      } else {
        const fresh = generatePreInterviewCheatSheet(candidate);
        setSheet(fresh);
        saveOfflineCheatSheet(fresh);
      }
    }
  }, [isOpen, candidate]);

  if (!isOpen || !sheet) return null;

  const handleCopy = async (text: string, sectionKey: string) => {
    const ok = await copyToClipboardSafe(text);
    if (ok) {
      setCopiedSection(sectionKey);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Zap className="w-5 h-5 fill-white" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Thẻ Tác Chiến 60s Bỏ Túi
                </h3>
                <span className="px-1.5 py-0.2 rounded bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-bold text-[9px] uppercase tracking-wider flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5" /> Trước Giờ G
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                {sheet.companyName} • {sheet.jobTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tabs for Mobile */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'pitch', label: '1. Pitch 30s' },
            { id: 'metrics', label: '2. Số Liệu Đinh' },
            { id: 'star', label: '3. Bug Khó STAR' },
            { id: 'questions', label: '4. Hỏi Ngược NTD' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Flashcard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Section 1: Elevator Pitch */}
          {(activeTab === 'all' || activeTab === 'pitch') && (
            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>1. Giới thiệu bản thân (Elevator Pitch 30s)</span>
                </span>
                <button
                  onClick={() => handleCopy(sheet.elevatorPitch, 'pitch')}
                  className="p-1 rounded-lg text-amber-700 hover:bg-amber-200/60 transition-colors"
                  title="Sao chép lời thoại"
                >
                  {copiedSection === 'pitch' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans italic bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                "{sheet.elevatorPitch}"
              </p>
            </div>
          )}

          {/* Section 2: 3 Killer Metrics */}
          {(activeTab === 'all' || activeTab === 'metrics') && (
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Ba số liệu kỹ thuật đinh (Killer Proofs)</span>
              </span>
              <div className="grid grid-cols-1 gap-2">
                {sheet.killerMetrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/30 text-xs"
                  >
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {m.label}
                    </span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                      {m.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: STAR Story */}
          {(activeTab === 'all' || activeTab === 'star') && (
            <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/50 rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>3. Câu chuyện giải quyết bug khó (STAR)</span>
              </span>
              <div className="space-y-2 text-xs">
                <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <span className="font-bold text-blue-700 dark:text-blue-400 block mb-0.5">Vấn đề gặp phải (S/T):</span>
                  <p className="text-slate-600 dark:text-slate-300">{sheet.starStory.situationTask}</p>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <span className="font-bold text-blue-700 dark:text-blue-400 block mb-0.5">Cách giải quyết (Action):</span>
                  <p className="text-slate-600 dark:text-slate-300">{sheet.starStory.actionTaken}</p>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">Kết quả đo được (Result):</span>
                  <p className="text-slate-600 dark:text-slate-300 font-semibold">{sheet.starStory.quantifiedResult}</p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Questions to Ask */}
          {(activeTab === 'all' || activeTab === 'questions') && (
            <div className="bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/50 rounded-2xl p-4 space-y-2.5">
              <span className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>4. Câu hỏi hỏi ngược lại Tech Lead ở cuối buổi</span>
              </span>
              <div className="space-y-1.5">
                {sheet.questionsToAsk.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-purple-100 dark:border-purple-900/30 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span>Hoạt động 100% ngoại tuyến (Offline Storage)</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-all text-xs"
          >
            Sẵn Sàng Phỏng Vấn
          </button>
        </div>
      </div>
    </div>
  );
};
