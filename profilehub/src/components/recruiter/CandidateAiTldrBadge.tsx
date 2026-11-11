import React from 'react';
import type { CandidateAiTLDR } from '../../types/database';
import { Sparkles, Code, CheckCircle, AlertTriangle } from 'lucide-react';

interface CandidateAiTldrBadgeProps {
  tldr: CandidateAiTLDR;
  compact?: boolean;
}

export const CandidateAiTldrBadge: React.FC<CandidateAiTldrBadgeProps> = ({ tldr, compact = false }) => {
  if (compact) {
    return (
      <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-md p-2 space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
          <Code className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{tldr.technicalCore}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{tldr.screeningAttention}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900/40 border border-indigo-100 dark:border-indigo-900/40 rounded-lg p-3 text-xs space-y-2">
      <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100/60 dark:border-indigo-900/40">
        <div className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-semibold uppercase tracking-wider text-[10px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tóm Tắt Nhanh 10 Giây (AI TL;DR)</span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-bold text-[10px]">
          Khớp {tldr.matchScore}%
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Điểm kỹ thuật cốt lõi: </span>
            <span className="text-slate-600 dark:text-slate-400">{tldr.technicalCore}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Đồ án bảo chứng: </span>
            <span className="text-slate-600 dark:text-slate-400">{tldr.keyProofProject}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Lỗ hổng cần phỏng vấn: </span>
            <span className="text-slate-600 dark:text-slate-400">{tldr.screeningAttention}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
