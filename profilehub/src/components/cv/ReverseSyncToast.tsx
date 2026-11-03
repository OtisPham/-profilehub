import React, { useState, useEffect } from 'react';
import { FolderGit2, CheckCircle2, X, ArrowUpRight, Loader2, Sparkles } from 'lucide-react';
import type { ReverseSyncToastProps } from '../../types/reverseSync.types';

export const ReverseSyncToast: React.FC<ReverseSyncToastProps> = ({
  isOpen,
  projectsToSync,
  onSync,
  onDismiss,
  isSyncing = false,
  syncedCount = 0
}) => {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (syncedCount > 0) {
      setIsSuccess(true);
      const timer = setTimeout(() => {
        setIsSuccess(false);
        onDismiss();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [syncedCount, onDismiss]);

  if (!isOpen || projectsToSync.length === 0) {
    return null;
  }

  const projectCount = projectsToSync.length;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-900/10 p-4 transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <FolderGit2 className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0 text-left">
          {isSuccess ? (
            <>
              <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Đã Lưu Vào Kho Dự Án!
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Đã đồng bộ {syncedCount} dự án vào Hồ sơ cá nhân. Bạn có thể tái sử dụng ngay trên các bản CV khác.
              </p>
            </>
          ) : (
            <>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                Lưu Dự Án Mới Vào Kho?
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                Phát hiện <strong>{projectCount} dự án mới</strong> trên bản CV này chưa có trong Kho Hồ sơ gốc.
              </p>

              {/* Danh sách tên dự án tóm tắt */}
              <div className="mt-2 space-y-1">
                {projectsToSync.slice(0, 2).map((p) => (
                  <div
                    key={p.id}
                    className="text-[10.5px] font-medium text-slate-700 dark:text-slate-300 truncate bg-slate-50 dark:bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60"
                  >
                    • {p.projectName || 'Dự án mới'}
                  </div>
                ))}
                {projectCount > 2 && (
                  <span className="text-[10px] text-slate-400 italic">
                    và {projectCount - 2} dự án khác...
                  </span>
                )}
              </div>

              {/* Nhóm nút bấm tác vụ theo chuẩn ruleui.md (Padding 2Y:Y, Title Case) */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onSync}
                  disabled={isSyncing}
                  className="inline-flex items-center text-xs font-semibold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Đang Lưu...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                      Lưu Vào Kho Dự Án
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onDismiss}
                  className="text-xs font-medium px-2.5 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Để Sau
                </button>
              </div>
            </>
          )}
        </div>

        {/* Nút đóng góc phải */}
        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md transition-colors"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReverseSyncToast;
