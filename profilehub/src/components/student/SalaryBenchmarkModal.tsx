import React, { useState } from 'react';
import { 
  X, DollarSign, TrendingUp, Sparkles, ShieldCheck, 
  HelpCircle, ArrowRight, CheckCircle2, Award, Zap, Layers,
  Building2, Calendar, ExternalLink, Database
} from 'lucide-react';
import { 
  calculateSalaryBenchmark, 
  formatCurrencyVnd, 
  type SeniorityLevel, 
  type SalaryBenchmarkResult 
} from '../../services/salaryBenchmarkService';

interface SalaryBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: string;
  initialLevel?: SeniorityLevel;
  techStack?: string[];
  verifiedProjectsCount?: number;
}

const LEVELS: { id: SeniorityLevel; label: string }[] = [
  { id: 'intern', label: 'Intern' },
  { id: 'fresher', label: 'Fresher' },
  { id: 'junior', label: 'Junior' },
  { id: 'mid', label: 'Mid-Level' },
  { id: 'senior', label: 'Senior' },
  { id: 'lead', label: 'Lead / Architect' }
];

export default function SalaryBenchmarkModal({
  isOpen,
  onClose,
  initialRole = 'Kỹ Sư Phần Mềm',
  initialLevel = 'junior',
  techStack = ['React', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL'],
  verifiedProjectsCount = 2
}: SalaryBenchmarkModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<SeniorityLevel>(initialLevel);
  const [roleTitle, setRoleTitle] = useState(initialRole);

  if (!isOpen) return null;

  const benchmark: SalaryBenchmarkResult = calculateSalaryBenchmark(
    roleTitle,
    selectedLevel,
    techStack,
    verifiedProjectsCount
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">
                  AI Salary Benchmark & Real Market Evidence
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 uppercase">
                  Dữ Liệu Thực Tế 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Định giá năng lực & khảo sát dải lương thị trường dựa trên Proof-of-Work thực tế.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Switcher & Dynamic Data Freshness Badge */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {LEVELS.map(lvl => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedLevel === lvl.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
              benchmark.marketDemand === 'VERY_HOT'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              🔥 Nhu cầu: {benchmark.marketDemandLabel || (benchmark.marketDemand === 'VERY_HOT' ? 'Rất cao (Khan hiếm)' : 'Cao & Ổn định')}
            </span>
          </div>
        </div>

        {/* Dynamic Freshness Banner */}
        <div className="px-6 py-2 bg-indigo-50/60 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <Database size={13} className="text-indigo-600" />
            <span className="font-semibold">{benchmark.metadata.freshnessBadge}</span>
          </div>
          <span className="text-[11px] text-indigo-600/80 font-medium hidden sm:inline">
            Nguồn: {benchmark.metadata.sources.join(', ')}
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Salary Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-indigo-500/10 border border-emerald-200 text-center relative overflow-hidden">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Mức Đề Xuất Đàm Phán Dành Cho Bạn ({benchmark.levelLabel})
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              {formatCurrencyVnd(benchmark.recommendedOfferVnd)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Tương đương ~${benchmark.recommendedOfferUsd.toLocaleString()} USD/tháng (Net/Gross tùy chính sách đãi ngộ)
            </div>

            {/* Proof of Work P75 Highlight */}
            {verifiedProjectsCount >= 2 && (
              <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Kích hoạt phân vị P75 Proof-of-Work: Top 25% ứng viên xuất sắc nhất</span>
              </div>
            )}

            {/* Visual Salary Bar */}
            <div className="mt-5 px-2">
              <div className="flex justify-between text-xs text-slate-600 font-bold mb-1.5">
                <span>P25 (Thấp): {formatCurrencyVnd(benchmark.range.minVnd)}</span>
                <span>P50 (Trung vị): {formatCurrencyVnd(benchmark.range.medianVnd)}</span>
                <span>P75 (Proof-of-Work): {formatCurrencyVnd(benchmark.p75ProofOfWorkVnd)}</span>
                <span>P90 (Cao nhất): {formatCurrencyVnd(benchmark.range.maxVnd)}</span>
              </div>
              <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600 rounded-full"
                  style={{ width: '100%' }}
                />
                {/* Marker for candidate position */}
                <div 
                  className="absolute top-0 bottom-0 w-2.5 bg-slate-950 rounded-full shadow-md"
                  style={{ left: `${Math.min(95, Math.max(5, benchmark.percentileRank))}%` }}
                  title={`Vị thế năng lực: Phân vị P${benchmark.percentileRank}`}
                />
              </div>
              <div className="text-right text-[11px] font-bold text-indigo-700 mt-1.5">
                ⭐ Vị thế của bạn: Phân vị P{benchmark.percentileRank} ({verifiedProjectsCount > 0 ? `Được bảo chứng bởi ${verifiedProjectsCount} đồ án Verified` : 'Chưa có đồ án Verified'})
              </div>
            </div>
          </div>

          {/* Evidence Verification Samples (Bằng Chứng Tuyển Dụng Thực Tế) */}
          {benchmark.evidenceSamples && benchmark.evidenceSamples.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Bằng Chứng Đối Chiếu Tuyển Dụng Thực Tế (Evidence Verification)
                </h4>
                <span className="text-[11px] font-semibold text-slate-400">
                  {benchmark.metadata.sampleSize} tin khảo sát
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benchmark.evidenceSamples.map((job, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900">{job.company_name}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {job.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-1">
                        {job.job_title}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="font-black text-indigo-700">{job.salary_raw}</span>
                      <span className="text-[10.5px] text-slate-400 flex items-center gap-1">
                        <Calendar size={11} />
                        {job.verified_date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Premium Multipliers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Công Nghệ Cộng Điểm Đàm Phán (Tech Stack Premium)
            </h4>
            {benchmark.keyTechMultipliers.length === 0 ? (
              <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-xs">
                Chưa có công nghệ khan hiếm nào được phát hiện trong hồ sơ.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {benchmark.keyTechMultipliers.map(item => (
                  <div 
                    key={item.tech}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-800">{item.tech}</span>
                    <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      +{item.premiumPercent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Negotiation Strategy & Pitch */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              Chiến Lược Đàm Phán Lương Thực Chiến Với HR
            </h4>
            <div className="space-y-2.5">
              {benchmark.negotiationTips.map((tip, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 leading-relaxed font-medium"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span>Chu kỳ cập nhật: 01 hàng tháng • Dữ liệu đối chiếu từ {benchmark.metadata.sources.join(', ')}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer self-end sm:self-auto"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
