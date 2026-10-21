import { useState } from 'react';
import { X, Check, RotateCcw, ShieldCheck, Sparkles, AlertCircle, Edit3 } from 'lucide-react';
import type { ProjectItem } from '../../types/cvSection';
import { starBulletService, type StarBulletDiff } from '../../services/starBulletService';

interface StarDiffReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
  onApplyFinalBullets: (projectId: string, newBullets: string[]) => void;
}

export default function StarDiffReviewModal({
  isOpen,
  onClose,
  project,
  onApplyFinalBullets
}: StarDiffReviewModalProps) {
  if (!isOpen || !project) return null;

  const [diffResult] = useState(() => starBulletService.adaptProjectBulletsWithStar(project));
  const [diffs, setDiffs] = useState<StarBulletDiff[]>(diffResult.diffs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleSetStatus = (id: string, status: 'accepted' | 'rejected') => {
    setDiffs(prev => starBulletService.resolveDiffItem(prev, id, status));
  };

  const handleStartEdit = (diff: StarBulletDiff) => {
    setEditingId(diff.id);
    setEditText(diff.adaptedText);
  };

  const handleSaveEdit = (id: string) => {
    setDiffs(prev => starBulletService.resolveDiffItem(prev, id, 'modified', editText));
    setEditingId(null);
  };

  const handleAcceptAll = () => {
    setDiffs(prev => prev.map(d => ({ ...d, status: 'accepted' })));
  };

  const handleApply = () => {
    const finalBullets = starBulletService.compileFinalBullets(project, diffs);
    onApplyFinalBullets(project.id, finalBullets);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  STAR Diff Review & Anti-Hallucination Guard
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Anti-Hallucination
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                So sánh câu mô tả gốc và câu văn chuẩn hóa STAR có số liệu định lượng cho dự án <strong className="text-slate-700 dark:text-slate-200">{project.projectName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-6 py-2.5 bg-blue-50/70 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-xs text-blue-800 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-blue-600" />
            <span>Mỗi câu văn được cấu trúc lại theo format: [Hành động cốt lõi] + [Công nghệ thực tế] + [Chỉ số đo lường kết quả].</span>
          </div>
          <button
            onClick={handleAcceptAll}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition text-[11px] shrink-0"
          >
            ✓ Chấp nhận tất cả
          </button>
        </div>

        {/* Diff Comparison List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {diffs.map((diff, idx) => (
            <div
              key={diff.id}
              className={`p-4 rounded-xl border transition-all ${
                diff.status === 'accepted'
                  ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : diff.status === 'rejected'
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-60'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Mục #{idx + 1} • {diff.starStage}
                </span>
                <div className="flex items-center gap-1.5">
                  {diff.status === 'accepted' && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đã chấp nhận
                    </span>
                  )}
                  {diff.status === 'rejected' && (
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Đã giữ nguyên gốc
                    </span>
                  )}
                  <button
                    onClick={() => handleSetStatus(diff.id, 'accepted')}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      diff.status === 'accepted'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    Áp dụng
                  </button>
                  <button
                    onClick={() => handleSetStatus(diff.id, 'rejected')}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      diff.status === 'rejected'
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Bỏ qua
                  </button>
                  <button
                    onClick={() => handleStartEdit(diff)}
                    className="p-1 text-slate-500 hover:text-blue-600 rounded transition"
                    title="Chỉnh sửa nội dung"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Original */}
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-400 mb-1">CÂU GỐC CỦA BẠN</div>
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {diff.originalText}
                  </div>
                </div>

                {/* Adapted */}
                <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                  <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center justify-between">
                    <span>ĐỀ XUẤT CHUẨN STAR (CÓ SỐ LIỆU ĐO LƯỜNG)</span>
                    {diff.metricImpact && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">🎯 {diff.metricImpact}</span>
                    )}
                  </div>
                  {editingId === diff.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-blue-400 rounded-md text-xs text-slate-800 dark:text-slate-100"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-0.5 text-xs text-slate-500 hover:text-slate-700"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleSaveEdit(diff.id)}
                          className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-semibold"
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                      {diff.adaptedText}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Đóng
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Cập nhật vào CV
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
