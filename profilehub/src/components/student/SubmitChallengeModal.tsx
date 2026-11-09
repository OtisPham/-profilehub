import React, { useState } from 'react';
import type { CandidatePipelineItem, TakeHomeChallenge } from '../../types/database';
import { challengeScorecardService } from '../../services/challengeScorecardService';
import { 
  X, 
  Terminal, 
  Clock, 
  GitPullRequest, 
  ExternalLink, 
  CheckCircle2, 
  Send,
  AlertCircle,
  FileCode,
  Sparkles
} from 'lucide-react';

interface SubmitChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidatePipelineItem | null;
  onSubmitted?: (challenge: TakeHomeChallenge) => void;
}

export default function SubmitChallengeModal({
  isOpen,
  onClose,
  candidate,
  onSubmitted
}: SubmitChallengeModalProps) {
  const challenge = candidate?.take_home_challenge;
  const [pullRequestUrl, setPullRequestUrl] = useState(challenge?.submission?.pullRequestUrl || '');
  const [demoUrl, setDemoUrl] = useState(challenge?.submission?.demoUrl || '');
  const [solutionNotes, setSolutionNotes] = useState(challenge?.submission?.solutionNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !candidate || !challenge) return null;

  // Tính toán thời gian còn lại
  const deadlineTime = new Date(challenge.deadlineDate).getTime();
  const now = Date.now();
  const diffMs = deadlineTime - now;
  const remainingHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const isExpired = diffMs <= 0;
  const isSubmitted = challenge.status === 'submitted' || challenge.status === 'evaluated';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pullRequestUrl.trim()) {
      setError('Vui lòng nhập đường dẫn GitHub Pull Request.');
      return;
    }
    if (!solutionNotes.trim()) {
      setError('Vui lòng mô tả tóm tắt giải pháp kiến trúc đã triển khai.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const updated = challengeScorecardService.submitChallengeSolution({
        candidatePipelineId: candidate.id,
        pullRequestUrl: pullRequestUrl.trim(),
        demoUrl: demoUrl.trim() || undefined,
        solutionNotes: solutionNotes.trim()
      });

      if (updated && onSubmitted) {
        onSubmitted(updated);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi nộp bài giải.');
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
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Nộp Bài Giải Thử Thách Kỹ Thuật
                {isSubmitted && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    Đã Nộp
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Đề tài: <strong className="text-slate-700 dark:text-slate-300">{challenge.title}</strong>
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Banner Thông Tin Đề Bài & Thời Gian */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Yêu Cầu Từ Nhà Tuyển Dụng
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                isExpired ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{isExpired ? 'Đã hết hạn' : `Còn lại: ~${remainingHours} giờ`}</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {challenge.description}
            </p>

            {challenge.requirements && challenge.requirements.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Tiêu chí nghiệm thu:</p>
                <ul className="space-y-1">
                  {challenge.requirements.map((r, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Nhập link Pull Request */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Liên Kết GitHub Pull Request *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={pullRequestUrl}
                onChange={e => setPullRequestUrl(e.target.value)}
                placeholder="https://github.com/your-username/your-repo/pull/1"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
              />
              <GitPullRequest className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Nhập link Demo (Nếu có) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Liên Kết Trực Tiếp (Live Demo / Vercel Preview - Tùy chọn)
            </label>
            <div className="relative">
              <input
                type="url"
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
                placeholder="https://your-preview-branch.vercel.app"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
              />
              <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Ghi chú giải pháp */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mô Tả Giải Pháp Kiến Trúc & Cách Chạy Thử *
            </label>
            <textarea
              required
              rows={4}
              value={solutionNotes}
              onChange={e => setSolutionNotes(e.target.value)}
              placeholder="Giải thích ngắn gọn cách bạn thiết kế tính năng, cách chạy unit test và các quyết định kỹ thuật đã đưa ra..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang nộp...' : isSubmitted ? 'Cập Nhật Lại Bài Giải' : 'Nộp Bài Giải & Báo Cáo NTD'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
