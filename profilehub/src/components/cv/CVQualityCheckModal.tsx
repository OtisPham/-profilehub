import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  FileCheck2,
  Sparkles,
  Layers,
  Code2,
  FolderGit2
} from 'lucide-react';
import { QualityCheckResult } from '../../services/cvQualityCheckService';

interface CVQualityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: QualityCheckResult;
}

export default function CVQualityCheckModal({
  isOpen,
  onClose,
  result
}: CVQualityCheckModalProps) {
  if (!isOpen) return null;

  const { score, passed, errorsCount, warningsCount, issues, metrics } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              passed
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
            }`}>
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Kiểm Tra Chất Lượng CV (ATS Quality Check)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rule Engine kiểm tra cấu trúc, trường bắt buộc và định dạng A4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score & Metrics Bar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xs text-slate-500 font-semibold">Điểm Chất Lượng</div>
            <div className={`text-2xl font-black mt-0.5 ${
              score >= 90 ? 'text-emerald-600' : score >= 70 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {score}/100
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xs text-slate-500 font-semibold">Lỗi Bắt Buộc</div>
            <div className="text-2xl font-black text-rose-600 mt-0.5">
              {errorsCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xs text-slate-500 font-semibold">Cảnh Báo</div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">
              {warningsCount}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xs text-slate-500 font-semibold">Kỹ Năng / Đồ Án</div>
            <div className="text-lg font-black text-blue-600 mt-1">
              {metrics.skillsCount} / {metrics.projectsCount}
            </div>
          </div>
        </div>

        {/* Content / Issues List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Bản CV hoàn hảo, đạt chuẩn 100%!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Không phát hiện lỗi thiếu thông tin liên hệ, mục rỗng hay câu từ tràn trang A4. Bạn có thể tự tin xuất file PDF.
              </p>
            </div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  issue.severity === 'error'
                    ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                    : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {issue.severity === 'error' ? (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      issue.severity === 'error'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                    }`}>
                      {issue.severity === 'error' ? 'Lỗi bắt buộc' : 'Cảnh báo'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {issue.message}
                    </span>
                  </div>
                  {issue.fixSuggestion && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{issue.fixSuggestion}</span>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            {passed ? '✅ Đủ điều kiện xuất PDF chuẩn ATS' : '⚠️ Nên sửa các lỗi màu đỏ trước khi gửi ứng tuyển'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
