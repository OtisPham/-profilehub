import React, { useState } from 'react';
import type { 
  CandidatePipelineItem, 
  InterviewScorecard, 
  ScorecardCriteriaScores, 
  ScorecardRecommendation 
} from '../../types/database';
import { challengeScorecardService } from '../../services/challengeScorecardService';
import { 
  X, 
  Award, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Layers, 
  UserCheck,
  TrendingUp,
  MessageSquare,
  Printer
} from 'lucide-react';

interface InterviewScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidatePipelineItem | null;
  interviewerName?: string;
  interviewerRole?: string;
  onScorecardSaved?: (scorecard: InterviewScorecard) => void;
  onOpenReport?: (candidate: CandidatePipelineItem) => void;
}

export default function InterviewScorecardModal({
  isOpen,
  onClose,
  candidate,
  interviewerName = 'Tech Lead Tuyển Dụng',
  interviewerRole = 'Tech Lead',
  onScorecardSaved,
  onOpenReport
}: InterviewScorecardModalProps) {
  const [scores, setScores] = useState<ScorecardCriteriaScores>({
    architecture: 4,
    codeDefense: 4,
    debugging: 4,
    communication: 4,
    cultureFit: 4
  });
  const [recommendation, setRecommendation] = useState<ScorecardRecommendation>('hire');
  const [strengths, setStrengths] = useState('');
  const [improvementAreas, setImprovementAreas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !candidate) return null;

  // Tính điểm tổng kết
  const totalPoints = scores.architecture + scores.codeDefense + scores.debugging + scores.communication + scores.cultureFit;
  const overallPercentage = Math.round((totalPoints / 25) * 100);

  const criteriaList = [
    { key: 'architecture' as const, label: 'Tư Duy Kiến Trúc & Thiết Kế Hệ Thống', desc: 'Độ sâu về Clean Architecture, phân tầng và chọn công nghệ' },
    { key: 'codeDefense' as const, label: 'Khả Năng Phản Biện & Giải Thích Mã Nguồn', desc: 'Hiểu rõ từng dòng code trong đồ án, lý do đưa ra quyết định' },
    { key: 'debugging' as const, label: 'Kỹ Năng Gỡ Lỗi & Xử Lý Sự Cố Trực Tiếp', desc: 'Tư duy bóc tách lỗi, giả lập sự cố tải cao hoặc mất mạng' },
    { key: 'communication' as const, label: 'Giao Tiếp Kỹ Thuật & Trình Bày', desc: 'Truyền đạt mạch lạc, lắng nghe phản hồi và đối thoại rõ ràng' },
    { key: 'cultureFit' as const, label: 'Độ Phù Hợp Văn Hóa & Thái Độ Cầu Thị', desc: 'Tinh thần ham học hỏi, trách nhiệm và tôn trọng đồng đội' }
  ];

  const handleScoreChange = (key: keyof ScorecardCriteriaScores, val: number) => {
    setScores(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!strengths.trim()) {
      setError('Vui lòng ghi nhận ít nhất một điểm sáng kỹ thuật của ứng viên.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const sc = challengeScorecardService.submitScorecard({
        candidatePipelineId: candidate.id,
        interviewerId: 'interviewer_current',
        interviewerName,
        interviewerRole,
        scores,
        recommendation,
        strengths: strengths.trim(),
        improvementAreas: improvementAreas.trim() || 'Tiếp tục rèn luyện theo lộ trình chuẩn công nghiệp.'
      });

      if (onScorecardSaved) {
        onScorecardSaved(sc);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi lưu phiếu đánh giá.');
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
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Bảng Chấm Điểm Phỏng Vấn (Scorecard)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
                  {overallPercentage}/100
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ứng viên: <strong className="text-slate-700 dark:text-slate-300">{candidate.student?.full_name || 'Ứng viên'}</strong> • Người chấm: <span className="text-purple-600 dark:text-purple-400 font-medium">{interviewerName} ({interviewerRole})</span>
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

          {/* 5 Tiêu chuẩn vàng chấm điểm */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Chấm Điểm 5 Trụ Cột Năng Lực (Thang Điểm 1 - 5 Sao)
            </label>
            <div className="space-y-2.5">
              {criteriaList.map(crit => {
                const currentVal = scores[crit.key];
                return (
                  <div key={crit.key} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{crit.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{crit.desc}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => handleScoreChange(crit.key, star)}
                          className={`p-1 rounded-md transition ${
                            star <= currentVal
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${star <= currentVal ? 'fill-amber-400' : ''}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1.5 w-4 text-center">
                        {currentVal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quyết định tuyển dụng */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Khuyến Nghị Tuyển Dụng (Hiring Recommendation)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'strong_hire' as const, label: 'Tuyển Ngay', sub: 'Strong Hire', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                { key: 'hire' as const, label: 'Đồng Ý', sub: 'Hire', color: 'border-blue-500 bg-blue-50 text-blue-800' },
                { key: 'neutral' as const, label: 'Phân Vân', sub: 'Neutral', color: 'border-amber-500 bg-amber-50 text-amber-800' },
                { key: 'no_hire' as const, label: 'Từ Chối', sub: 'No Hire', color: 'border-rose-500 bg-rose-50 text-rose-800' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setRecommendation(opt.key)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    recommendation === opt.key
                      ? `${opt.color} font-black shadow-xs ring-2 ring-purple-500/20`
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">{opt.label}</p>
                  <p className="text-[10px] opacity-75">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Ghi chú điểm sáng */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Điểm Sáng Kỹ Thuật (Strengths) *
            </label>
            <textarea
              required
              rows={2}
              value={strengths}
              onChange={e => setStrengths(e.target.value)}
              placeholder="VD: Ứng viên nắm rất vững kiến trúc phân tầng, giải thích rõ ràng cơ chế Cache-aside..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* Ghi chú điểm cần cải thiện */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Điểm Cần Cải Thiện & Hướng Dẫn Nâng Cao (Areas for Improvement)
            </label>
            <textarea
              rows={2}
              value={improvementAreas}
              onChange={e => setImprovementAreas(e.target.value)}
              placeholder="VD: Cần tìm hiểu thêm về transaction rollback và indexing trong SQL..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
              >
                Hủy
              </button>
              {onOpenReport && candidate && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReport(candidate);
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-xs font-bold transition flex items-center gap-1.5"
                  title="Xem và in báo cáo đánh giá hoàn chỉnh A4"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Xem Báo Cáo PDF</span>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu Phiếu Đánh Giá Scorecard'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
