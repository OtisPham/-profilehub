import React, { useState } from 'react';
import type { CandidatePipelineItem, TakeHomeChallenge } from '../../types/database';
import { challengeScorecardService } from '../../services/challengeScorecardService';
import { CHALLENGE_TEMPLATE_BANK, type ChallengeTemplate } from '../../services/challengeTemplates';
import { 
  X, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Send, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface IssueChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidatePipelineItem | null;
  recruiterId?: string;
  onChallengeIssued?: (challenge: TakeHomeChallenge) => void;
}

export default function IssueChallengeModal({
  isOpen,
  onClose,
  candidate,
  recruiterId,
  onChallengeIssued
}: IssueChallengeModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl_backend_rbac');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [customRequirements, setCustomRequirements] = useState<string>('');
  const [deadlineHours, setDeadlineHours] = useState<number>(48);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo nội dung từ template
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tpl = CHALLENGE_TEMPLATE_BANK.find(t => t.id === templateId);
    if (tpl) {
      setCustomTitle(tpl.title);
      setCustomDescription(tpl.description);
      setCustomRequirements(tpl.requirements.join('\n'));
      setDeadlineHours(tpl.recommendedHours);
    }
  };

  // Pre-fill on open if not populated
  React.useEffect(() => {
    if (isOpen && !customTitle) {
      handleSelectTemplate('tpl_backend_rbac');
    }
  }, [isOpen]);

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customDescription.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung thử thách.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const requirementsArray = customRequirements
        .split('\n')
        .map(r => r.trim().replace(/^[-•*]\s*/, ''))
        .filter(Boolean);

      const challenge = challengeScorecardService.issueChallenge({
        candidatePipelineId: candidate.id,
        recruiterId: recruiterId || candidate.recruiter_id || 'current_recruiter',
        studentId: candidate.student_id,
        jobId: candidate.job_id || candidate.job?.id || 'job_general',
        title: customTitle.trim(),
        description: customDescription.trim(),
        requirements: requirementsArray.length > 0 ? requirementsArray : ['Tạo branch và gửi link GitHub Pull Request'],
        deadlineHours
      });

      if (onChallengeIssued) {
        onChallengeIssued(challenge);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi giao thử thách.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-indigo-50/50 dark:from-amber-950/20 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Giao Thử Thách Kỹ Thuật (Take-Home Challenge)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ứng viên: <strong className="text-slate-700 dark:text-slate-300">{candidate.student?.full_name || 'Ứng viên'}</strong> • Vị trí: <span className="text-amber-700 dark:text-amber-400 font-medium">{candidate.job?.title || 'Công nghệ thông tin'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Chọn Mẫu Đề Bài Có Sẵn (Template Bank) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Chọn Mẫu Đề Bài Thực Chiến (Template Bank)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CHALLENGE_TEMPLATE_BANK.map((tpl: ChallengeTemplate) => (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`p-3 text-left rounded-xl border text-xs font-semibold transition ${
                    selectedTemplateId === tpl.id
                      ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold line-clamp-1">{tpl.title}</p>
                  <span className="text-[10px] text-slate-400 uppercase font-bold mt-1 inline-block">
                    {tpl.category} • ~{tpl.recommendedHours}h
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tiêu đề thử thách */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tiêu Đề Thử Thách *
            </label>
            <input
              type="text"
              required
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="VD: Bổ sung tính năng phân quyền RBAC trên repo đồ án"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          {/* Mô tả chi tiết */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mô Tả & Hướng Dẫn Kỹ Thuật *
            </label>
            <textarea
              required
              rows={3}
              value={customDescription}
              onChange={e => setCustomDescription(e.target.value)}
              placeholder="Mô tả bối cảnh và yêu cầu ứng viên tạo branch trên repo đồ án..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* Yêu cầu nghiệm thu (Mỗi dòng 1 yêu cầu) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tiêu Chí Nghiệm Thu (Mỗi dòng là một tiêu chí)
            </label>
            <textarea
              rows={3}
              value={customRequirements}
              onChange={e => setCustomRequirements(e.target.value)}
              placeholder="- Viết ít nhất 3 unit tests&#10;- Không lộ secret key trong code&#10;- Gửi link Pull Request có diff rõ ràng"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden leading-relaxed font-mono"
            />
          </div>

          {/* Thời hạn nộp bài (Deadline) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Thời Gian Làm Bài (Hạn Chót)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { hours: 48, label: '48 Giờ (2 Ngày)' },
                { hours: 72, label: '72 Giờ (3 Ngày)' },
                { hours: 120, label: '120 Giờ (5 Ngày)' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.hours}
                  onClick={() => setDeadlineHours(opt.hours)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    deadlineHours === opt.hours
                      ? 'border-amber-600 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Giao Thử Thách Đến Ứng Viên'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
