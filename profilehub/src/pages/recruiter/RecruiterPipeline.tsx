import React, { useState } from 'react';
import {
  Kanban,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Building,
  Send,
} from 'lucide-react';

export type PipelineStage = 'Discovered' | 'Shortlisted' | 'Interviewing' | 'Offered' | 'Hired';

interface CandidateCard {
  id: string;
  name: string;
  major: string;
  role: string;
  university: string;
  gpa: string;
  verifiedCount: number;
  stage: PipelineStage;
  technicalScore?: number;
  softSkillsScore?: number;
  feedbackGiven?: boolean;
  blindSpots?: string[];
  feedbackComment?: string;
  appliedDate: string;
}

export const RecruiterPipeline: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateCard[]>([
    {
      id: 'c1',
      name: 'Phạm Thái Bảo',
      university: 'ĐH Sư Phạm Kỹ Thuật TP.HCM (HCMUTE)',
      major: 'Kỹ thuật Phần mềm',
      role: 'Backend / Distributed Systems Fresher',
      gpa: '3.85',
      verifiedCount: 3,
      stage: 'Discovered',
      appliedDate: '2026-09-28',
    },
    {
      id: 'c2',
      name: 'Trần Thị Bích',
      university: 'ĐH Bách Khoa TP.HCM (HCMUT)',
      major: 'Hệ thống Nhúng & IoT',
      role: 'Embedded & IoT Engineer',
      gpa: '3.70',
      verifiedCount: 2,
      stage: 'Shortlisted',
      appliedDate: '2026-09-25',
    },
    {
      id: 'c3',
      name: 'Lê Hoàng Cường',
      university: 'ĐH Công Nghệ Thông Tin (UIT)',
      major: 'Khoa học Máy tính',
      role: 'Frontend & React Developer',
      gpa: '3.65',
      verifiedCount: 3,
      stage: 'Interviewing',
      appliedDate: '2026-09-20',
    },
    {
      id: 'c4',
      name: 'Võ Minh Đức',
      university: 'ĐH Quốc Tế (IU - VNU)',
      major: 'Công nghệ Thông tin',
      role: 'Fullstack Engineer',
      gpa: '3.90',
      verifiedCount: 4,
      stage: 'Offered',
      appliedDate: '2026-09-15',
    },
    {
      id: 'c5',
      name: 'Đặng Ngọc Ánh',
      university: 'ĐH Khoa Học Tự Nhiên (HCMUS)',
      major: 'Kỹ thuật Phần mềm',
      role: 'Cloud & DevOps Fresher',
      gpa: '3.80',
      verifiedCount: 3,
      stage: 'Hired',
      technicalScore: 9,
      softSkillsScore: 9,
      feedbackGiven: true,
      blindSpots: ['Redis Caching', 'Kubernetes Helm'],
      feedbackComment: 'Ứng viên có kiến trúc tư duy xuất sắc và đồ án verified chất lượng cao.',
      appliedDate: '2026-09-10',
    },
  ]);

  const [feedbackCandidate, setFeedbackCandidate] = useState<CandidateCard | null>(null);
  const [techScore, setTechScore] = useState(9);
  const [softScore, setSoftScore] = useState(9);
  const [comment, setComment] = useState('');
  const [blindSpotsInput, setBlindSpotsInput] = useState('Redis Caching & Invalidation, Kafka Message Ordering');

  const stages: { key: PipelineStage; label: string; color: string }[] = [
    { key: 'Discovered', label: '1. Khám Phá', color: 'border-blue-200 text-blue-700 bg-blue-50' },
    { key: 'Shortlisted', label: '2. Đã Lưu Hồ Sơ', color: 'border-indigo-200 text-indigo-700 bg-indigo-50' },
    { key: 'Interviewing', label: '3. Phỏng Vấn', color: 'border-amber-200 text-amber-800 bg-amber-50' },
    { key: 'Offered', label: '4. Gửi Offer', color: 'border-purple-200 text-purple-700 bg-purple-50' },
    { key: 'Hired', label: '5. Đã Tuyển Dụng', color: 'border-emerald-200 text-emerald-800 bg-emerald-50' },
  ];

  const handleStageMove = (candidateId: string, direction: 'next' | 'prev') => {
    const stageKeys = stages.map((s) => s.key);
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        const currentIdx = stageKeys.indexOf(c.stage);
        const newIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
        if (newIdx >= 0 && newIdx < stageKeys.length) {
          return { ...c, stage: stageKeys[newIdx] };
        }
        return c;
      })
    );
  };

  const handleOpenFeedback = (candidate: CandidateCard) => {
    setFeedbackCandidate(candidate);
    setComment(
      candidate.feedbackComment ||
        'Ứng viên nắm rất vững tư duy hệ thống và các đồ án verified làm thực chất. Khuyến nghị bổ sung thêm kiến thức về Redis Distributed Locks và CI/CD multi-stage build.'
    );
    setBlindSpotsInput(
      candidate.blindSpots?.join(', ') || 'Redis Caching & Invalidation, High-Concurrency Concurrency Locks'
    );
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackCandidate) return;

    const parsedBlindSpots = blindSpotsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === feedbackCandidate.id
          ? {
              ...c,
              technicalScore: techScore,
              softSkillsScore: softScore,
              feedbackGiven: true,
              feedbackComment: comment,
              blindSpots: parsedBlindSpots,
            }
          : c
      )
    );

    alert(
      `Đã ghi nhận phản hồi và đồng bộ ${parsedBlindSpots.length} điểm mù kiến thức vào hồ sơ phát triển của sinh viên ${feedbackCandidate.name}!`
    );
    setFeedbackCandidate(null);
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Kanban className="w-7 h-7 text-blue-600" />
            <span>Quy Trình Tuyển Dụng 5 Giai Đoạn (5-Stage Kanban Pipeline)</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Quản lý phễu ứng viên theo bằng chứng đồ án verified và gửi phản hồi phỏng vấn kết nối dữ liệu thật.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-right shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Doanh nghiệp tuyển dụng:</span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Alpaca Solutions Vietnam</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stg, stgIdx) => {
          const stageCandidates = candidates.filter((c) => c.stage === stg.key);
          return (
            <div
              key={stg.key}
              className="bg-slate-100/70 border border-slate-200 rounded-3xl p-4 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${stg.color}`}>
                  {stg.label}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 font-mono text-xs font-bold shadow-2xs">
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1">
                {stageCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-2xs transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Name and Role */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="text-sm font-bold text-slate-900">{candidate.name}</h4>
                        <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          GPA {candidate.gpa}
                        </span>
                      </div>

                      <p className="text-xs text-blue-700 font-semibold line-clamp-1">{candidate.role}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{candidate.university}</span>
                      </p>

                      {/* Verified Badge Count */}
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{candidate.verifiedCount} Đồ án</span>
                        </span>

                        {candidate.feedbackGiven && (
                          <span className="text-[10px] text-emerald-700 font-bold">Đã có feedback</span>
                        )}
                      </div>
                    </div>

                    {/* Stage Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                      <button
                        onClick={() => handleStageMove(candidate.id, 'prev')}
                        disabled={stgIdx === 0}
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Chuyển về giai đoạn trước"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenFeedback(candidate)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Feedback</span>
                      </button>

                      <button
                        onClick={() => handleStageMove(candidate.id, 'next')}
                        disabled={stgIdx === stages.length - 1}
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Chuyển sang giai đoạn kế tiếp"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recruiter Feedback Loop Modal */}
      {feedbackCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-900">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <span>Vòng Lặp Phản Hồi Phỏng Vấn (Recruiter Feedback Loop)</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Gửi nhận xét và các thẻ điểm mù kiến thức để giúp sinh viên định hướng cải thiện năng lực thực tế.
            </p>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div>
                  <span className="text-slate-500">Ứng viên:</span>{' '}
                  <strong className="text-slate-900">{feedbackCandidate.name}</strong> ({feedbackCandidate.role})
                </div>
                <div>
                  <span className="text-slate-500">Trường:</span>{' '}
                  <span className="text-slate-700">{feedbackCandidate.university}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Điểm Kỹ Thuật (0 - 10):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={techScore}
                    onChange={(e) => setTechScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2 text-sm font-bold font-mono text-blue-700 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Điểm Kỹ Năng Mềm (0 - 10):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={softScore}
                    onChange={(e) => setSoftScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2 text-sm font-bold font-mono text-emerald-700 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Thẻ Điểm Mù Kiến Thức (Knowledge Blind Spots - Ngăn cách bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  placeholder="Redis Caching, Kafka Message Ordering, Docker CI/CD"
                  value={blindSpotsInput}
                  onChange={(e) => setBlindSpotsInput(e.target.value)}
                  className="w-full bg-slate-50 border border-rose-300 rounded-2xl px-4 py-2.5 text-xs text-rose-700 focus:outline-none focus:border-rose-600 font-semibold"
                />
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                  * Hệ thống sẽ tự động chuyển các điểm mù này vào Widget AI Project Recommender của sinh viên.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nhận xét & Khuyến nghị chi tiết từ Nhà Tuyển Dụng:
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ghi nhận xét đánh giá điểm mạnh và lời khuyên bổ sung dự án..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-xs text-slate-800 focus:outline-none focus:border-blue-600 leading-relaxed font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFeedbackCandidate(null)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Phản Hồi Cho Sinh Viên</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterPipeline;
