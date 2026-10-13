import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteSectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sectionTitle: string;
}

export default function DeleteSectionDialog({
  isOpen,
  onClose,
  onConfirm,
  sectionTitle
}: DeleteSectionDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
        
        <div className="p-6">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Xóa mục này khỏi CV?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mục: <span className="font-bold text-slate-700 dark:text-slate-200">{sectionTitle}</span>
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
            Toàn bộ thông tin, nội dung và các mục con bên trong phần này sẽ bị xóa khỏi CV. Bạn có chắc chắn muốn tiếp tục?
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xác Nhận Xóa
          </button>
        </div>

      </div>
    </div>
  );
}
