import React, { useState } from 'react';
import type { CandidatePipelineItem } from '../../types/database';
import { executiveDossierService } from '../../services/executiveDossierService';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Award, 
  ShieldCheck, 
  Terminal, 
  GitPullRequest, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Calendar, 
  DollarSign,
  UserCheck,
  TrendingUp,
  FileText
} from 'lucide-react';

interface ExecutiveEvaluationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidatePipelineItem | null;
  isBlind?: boolean;
  companyName?: string;
}

export default function ExecutiveEvaluationReportModal({
  isOpen,
  onClose,
  candidate,
  isBlind = false,
  companyName = 'Doanh nghiệp tuyển dụng ProfileHub'
}: ExecutiveEvaluationReportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !candidate) return null;

  const dossier = executiveDossierService.buildExecutiveDossier(candidate, isBlind, companyName);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = async () => {
    try {
      const summaryText = executiveDossierService.generateExecutiveEmailSummary(dossier);
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  const recBadgeColor = {
    STRONG_HIRE: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', label: 'TUYỂN DỤNG ĐẶC BIỆT (STRONG HIRE)' },
    HIRE: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', label: 'ĐỒNG Ý TUYỂN DỤNG (HIRE)' },
    CONSIDER: { bg: '#fffbeb', text: '#92400e', border: '#fde68a', label: 'CÂN NHẮC THỬ THÁCH THÊM (CONSIDER)' },
    DECLINE: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', label: 'CHƯA PHÙ HỢP (DECLINE)' }
  }[dossier.executiveRecommendation];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/75 p-2 sm:p-4 overflow-y-auto"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .executive-dossier-sheet, .executive-dossier-sheet * {
            visibility: visible !important;
          }
          .executive-dossier-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        
        {/* Top Action Bar (no-print) */}
        <div className="no-print px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileText size={18} />
            </span>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-indigo-300">
                {dossier.isBlindMode ? '🕶️ Blind Screening Mode' : '🏛️ Executive Dossier'}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Báo Cáo Đánh Giá Ứng Viên Phỏng Vấn (Trình Ban Giám Đốc)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              title="Sao chép bản tóm tắt gửi Slack/Email"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Đã sao chép!' : 'Copy Email'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
              title="Mở hộp thoại in ấn / Lưu file PDF"
            >
              <Printer size={14} />
              <span>In / Tải PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              title="Đóng modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          
          {/* Printable A4 Sheet Paper */}
          <div 
            className="executive-dossier-sheet w-full max-w-3xl bg-white rounded-xl shadow-lg border border-slate-300 p-6 sm:p-10 text-slate-800 font-sans space-y-6"
            style={{ minHeight: '1000px' }}
          >
            {/* Header Document */}
            <div className="flex items-start justify-between pb-5 border-b-2 border-slate-900 gap-4">
              <div>
                <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  CONFIDENTIAL • PROFILEHUB TALENT ACQUISITION
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                  {dossier.isBlindMode ? 'HỒ SƠ ĐÁNH GIÁ ẨN DANH' : 'BÁO CÁO THẨM ĐỊNH PHỎNG VẤN'}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Doanh nghiệp: <span className="font-bold text-slate-900">{dossier.companyName}</span> • Vị trí: <span className="font-bold text-indigo-700">{dossier.jobTitle}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-slate-500 block">
                  Ngày lập: {dossier.appliedDate}
                </span>
                <span className="inline-block mt-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-300">
                  ID: {dossier.candidateId.substring(0, 12)}
                </span>
              </div>
            </div>

            {/* Candidate Identity & Executive Decision Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="sm:col-span-2 space-y-1">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  Thông Tin Ứng Viên
                </div>
                <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{dossier.candidateName}</span>
                  {dossier.isBlindMode && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      BLIND SCREENING
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600">
                  🎓 <span className="font-medium">{dossier.university}</span> • Chuyên ngành: <span className="font-semibold text-slate-800">{dossier.candidateRole}</span> (GPA: {dossier.gpa})
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  ✉️ {dossier.email} • 📞 {dossier.phone}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-lg border text-center" style={{ backgroundColor: recBadgeColor.bg, borderColor: recBadgeColor.border, color: recBadgeColor.text }}>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                  Đề Xuất Hội Đồng
                </div>
                <div className="text-2xl font-black mt-0.5">
                  {dossier.scorecardSummary.consensusScore}/100
                </div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded mt-1 text-center" style={{ backgroundColor: `${recBadgeColor.text}15` }}>
                  {recBadgeColor.label}
                </div>
              </div>
            </div>

            {/* Section 1: 5 Golden Criteria Ratings (Scorecard) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={14} className="text-indigo-600" />
                  1. Bảng Điểm 5 Tiêu Chuẩn Vàng Phỏng Vấn ({dossier.scorecardSummary.totalInterviews} Giám khảo)
                </h3>
                <span className="text-xs font-semibold text-indigo-600">
                  Đồng thuận: {dossier.scorecardSummary.consensusScore}đ
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Kiến Trúc & Clean Code:</span>
                    <span className="font-bold text-indigo-700">{dossier.scorecardSummary.averageCriteria.architecture} / 5.0 ★</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(dossier.scorecardSummary.averageCriteria.architecture / 5) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Bảo Vệ Đồ Án (Code Defense):</span>
                    <span className="font-bold text-indigo-700">{dossier.scorecardSummary.averageCriteria.codeDefense} / 5.0 ★</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(dossier.scorecardSummary.averageCriteria.codeDefense / 5) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Tư Duy Gỡ Lỗi (Debugging):</span>
                    <span className="font-bold text-indigo-700">{dossier.scorecardSummary.averageCriteria.debugging} / 5.0 ★</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(dossier.scorecardSummary.averageCriteria.debugging / 5) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Giao Tiếp Kỹ Thuật:</span>
                    <span className="font-bold text-indigo-700">{dossier.scorecardSummary.averageCriteria.communication} / 5.0 ★</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(dossier.scorecardSummary.averageCriteria.communication / 5) * 100}%` }} />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Độ Phù Hợp Văn Hóa (Culture Fit):</span>
                    <span className="font-bold text-indigo-700">{dossier.scorecardSummary.averageCriteria.cultureFit} / 5.0 ★</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(dossier.scorecardSummary.averageCriteria.cultureFit / 5) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Review notes by interviewers */}
              {dossier.scorecardSummary.interviews.length > 0 && (
                <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                  {dossier.scorecardSummary.interviews.map((iv, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold text-slate-800">
                        <span>👤 {iv.interviewerName} ({iv.interviewerRole})</span>
                        <span className="font-mono text-indigo-700">{iv.overallScore}đ • {iv.recommendation.toUpperCase()}</span>
                      </div>
                      {iv.strengths && <p className="text-slate-600"><strong>Điểm mạnh:</strong> {iv.strengths}</p>}
                      {iv.improvementAreas && <p className="text-slate-500 italic"><strong>Lưu ý:</strong> {iv.improvementAreas}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Take-Home Challenge Result */}
            {dossier.challengeSummary && (
              <div className="space-y-2.5">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal size={14} className="text-indigo-600" />
                    2. Thử Thách Kỹ Thuật Gắn Đồ Án (Take-Home Challenge)
                  </h3>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{dossier.challengeSummary.title} (Hạn nộp: {dossier.challengeSummary.deadlineHours}h)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dossier.challengeSummary.status === 'submitted' || dossier.challengeSummary.status === 'evaluated'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {dossier.challengeSummary.status === 'submitted' ? '✅ Đã nộp PR' : dossier.challengeSummary.status === 'evaluated' ? `⭐ Đã chấm (${dossier.challengeSummary.evaluationScore}đ)` : '⏱️ Đang làm'}
                    </span>
                  </div>

                  {dossier.challengeSummary.pullRequestUrl && (
                    <div className="flex items-center gap-1.5 text-indigo-700 font-mono">
                      <GitPullRequest size={13} />
                      <a href={dossier.challengeSummary.pullRequestUrl} target="_blank" rel="noreferrer" className="underline font-bold">
                        {dossier.challengeSummary.pullRequestUrl}
                      </a>
                    </div>
                  )}

                  {dossier.challengeSummary.solutionNotes && (
                    <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200">
                      <strong>Ghi chú giải pháp của ứng viên:</strong> "{dossier.challengeSummary.solutionNotes}"
                    </p>
                  )}

                  {dossier.challengeSummary.evaluationFeedback && (
                    <p className="text-slate-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                      <strong>Đánh giá của Tech Lead:</strong> {dossier.challengeSummary.evaluationFeedback}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Section 3: Verified Projects */}
            {dossier.verifiedProjects.length > 0 && (
              <div className="space-y-2.5">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-indigo-600" />
                    3. Đồ Án Nổi Bật Được Giảng Viên Bảo Chứng (Verified Projects)
                  </h3>
                </div>

                <div className="space-y-2">
                  {dossier.verifiedProjects.map(proj => (
                    <div key={proj.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                        <span>{proj.title}</span>
                        {proj.isVerified && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            🛡️ Giảng viên bảo chứng ({proj.score})
                          </span>
                        )}
                      </div>
                      {proj.description && <p className="text-slate-600 mb-1 line-clamp-2">{proj.description}</p>}
                      <div className="flex gap-4 font-mono text-[11px] text-slate-500">
                        {proj.githubUrl && <span>GitHub: {proj.githubUrl}</span>}
                        {proj.instructor && <span>• Giảng viên: {proj.instructor}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Strategic Evaluation & Salary Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/60 space-y-2">
                <h4 className="font-bold text-emerald-900 uppercase text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-700" />
                  Điểm Mạnh Chiến Lược (Key Strengths)
                </h4>
                <ul className="space-y-1 text-slate-700">
                  {dossier.keyStrengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/60 space-y-2">
                <h4 className="font-bold text-amber-900 uppercase text-[11px] flex items-center gap-1.5">
                  <AlertCircle size={13} className="text-amber-700" />
                  Rủi Ro & Điểm Cần Đào Tạo (Risks / Gap)
                </h4>
                <ul className="space-y-1 text-slate-700">
                  {dossier.keyRisks.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Salary & Private Notes */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-700 block">💰 Đề Xuất Dải Lương Khởi Điểm:</span>
                <span className="text-slate-500 text-[11px]">Dựa trên xếp hạng Scorecard và mặt bằng thị trường IT</span>
              </div>
              <div className="text-sm font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shrink-0 text-center">
                {dossier.recommendedSalaryRange}
              </div>
            </div>

            {dossier.privateNotes && (
              <div className="p-3 rounded-lg bg-amber-50/40 border border-amber-200 text-xs text-amber-900">
                <strong>📝 Ghi chú thẩm định nội bộ:</strong> {dossier.privateNotes}
              </div>
            )}

            {/* Signatures Footer */}
            <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-2 text-center text-xs">
              <div>
                <p className="font-bold text-slate-800">NGƯỜI LẬP BÁO CÁO / TECH LEAD</p>
                <p className="text-[11px] text-slate-400 mt-1">(Ký và ghi rõ họ tên)</p>
                <div className="h-16" />
                <p className="font-medium text-slate-700 font-serif italic">Đã xác nhận trên hệ thống</p>
              </div>

              <div>
                <p className="font-bold text-slate-800">BAN GIÁM ĐỐC / HIRING MANAGER</p>
                <p className="text-[11px] text-slate-400 mt-1">(Phê duyệt tuyển dụng & Ngân sách)</p>
                <div className="h-16" />
                <p className="font-medium text-slate-400">.....................................................</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer (no-print) */}
        <div className="no-print px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Hồ sơ xuất ra khổ A4 chuẩn in ấn. Bấm <strong>In / Tải PDF</strong> và chọn <em>Save as PDF</em> trên trình duyệt.
          </p>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
