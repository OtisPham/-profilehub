import React, { useState, useEffect } from 'react';
import { 
  X, Mic, Send, Sparkles, CheckCircle2, AlertTriangle, 
  ArrowRight, RotateCcw, Award, BrainCircuit, MessageSquareText, Building2
} from 'lucide-react';
import { 
  generateInterviewSession, 
  evaluateAnswer, 
  compileInterviewReport,
  type InterviewQuestion,
  type InterviewAnswerFeedback,
  type InterviewFinalReport
} from '../../services/aiMockInterviewService';

interface AiMockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  roleTitle?: string;
  projectName?: string;
  techStack?: string[];
  missingSkill?: string;
  companyName?: string;
}

export default function AiMockInterviewModal({
  isOpen,
  onClose,
  candidateName = 'Ứng Viên',
  roleTitle = 'Kỹ Sư Phần Mềm',
  projectName = 'E-Commerce Platform',
  techStack = ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  missingSkill = 'Kubernetes & CI/CD',
  companyName
}: AiMockInterviewModalProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(() => 
    generateInterviewSession(candidateName, roleTitle, projectName, techStack, missingSkill, companyName)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState<InterviewAnswerFeedback | null>(null);
  const [history, setHistory] = useState<{ question: InterviewQuestion; answer: string; feedback: InterviewAnswerFeedback }[]>([]);
  const [finalReport, setFinalReport] = useState<InterviewFinalReport | null>(null);

  // Tự động làm mới bộ đề thi thử theo đúng công ty và tech stack khi modal mở ra
  useEffect(() => {
    if (isOpen) {
      setQuestions(generateInterviewSession(candidateName, roleTitle, projectName, techStack, missingSkill, companyName));
      setCurrentIndex(0);
      setCandidateAnswer('');
      setCurrentFeedback(null);
      setHistory([]);
      setFinalReport(null);
    }
  }, [isOpen, candidateName, roleTitle, projectName, missingSkill, companyName]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateAnswer.trim() || !currentQ) return;

    const feedback = evaluateAnswer(currentQ, candidateAnswer);
    setCurrentFeedback(feedback);
  };

  const handleNextStage = () => {
    if (!currentFeedback || !currentQ) return;

    const updatedHistory = [...history, { question: currentQ, answer: candidateAnswer, feedback: currentFeedback }];
    setHistory(updatedHistory);
    setCandidateAnswer('');
    setCurrentFeedback(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all 4 stages
      const report = compileInterviewReport(updatedHistory);
      setFinalReport(report);
    }
  };

  const handleFillSample = () => {
    if (currentQ) {
      setCandidateAnswer(currentQ.sampleSeniorAnswer);
    }
  };

  const handleResetSession = () => {
    setQuestions(generateInterviewSession(candidateName, roleTitle, projectName, techStack, missingSkill, companyName));
    setCurrentIndex(0);
    setCandidateAnswer('');
    setCurrentFeedback(null);
    setHistory([]);
    setFinalReport(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#0f1523] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  AI Mock Interviewer Thực Chiến
                </h3>
                {companyName ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 uppercase flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Target: {companyName}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-500/30 text-violet-200 border border-violet-400/40 uppercase">
                    Tech Lead Simulation
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {companyName 
                  ? `Mô phỏng phỏng vấn 4 chặng sát sườn vị trí ${roleTitle} tại ${companyName}`
                  : 'Mô phỏng buổi phỏng vấn 45 phút chuẩn Enterprise: Bóc tách kiến trúc, số liệu STAR và xử lý sự cố.'}
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

        {/* Progress Bar (Chặng 1 -> 4) */}
        {!finalReport && (
          <div className="px-6 py-2.5 bg-slate-50 dark:bg-[#0c101c] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                {currentIndex + 1}
              </span>
              <span>{currentQ?.stageTitle}</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">
              Tiến độ: {currentIndex + 1} / 4 Chặng
            </span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!finalReport ? (
            <>
              {/* Question Box */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
                <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Tech Lead AI Chất Vấn:
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  "{currentQ?.question}"
                </p>
                <div className="mt-3 pt-2.5 border-t border-indigo-200/60 dark:border-indigo-800/40 text-xs text-indigo-800 dark:text-indigo-300 flex items-start gap-1.5">
                  <span className="font-bold shrink-0">💡 Gợi ý:</span>
                  <span>{currentQ?.contextHint}</span>
                </div>
              </div>

              {/* Response Area */}
              <form onSubmit={handleEvaluate} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MessageSquareText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Câu trả lời của bạn:
                  </label>
                  <button
                    type="button"
                    onClick={handleFillSample}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Nạp câu trả lời mẫu Senior
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={candidateAnswer}
                  onChange={e => setCandidateAnswer(e.target.value)}
                  placeholder="Nhập câu trả lời thực tế của bạn (nêu rõ công cụ, số liệu đo lường, quyết định kỹ thuật và kết quả đạt được)..."
                  className="w-full p-3.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111728] text-slate-900 dark:text-slate-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />

                {!currentFeedback && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!candidateAnswer.trim()}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Câu Trả Lời Cho AI Tech Lead</span>
                    </button>
                  </div>
                )}
              </form>

              {/* Feedback Section */}
              {currentFeedback && (
                <div className="p-4 rounded-xl border bg-slate-50 dark:bg-[#111728] border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Điểm Đánh Giá Chặng:</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                        currentFeedback.score >= 80 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      }`}>
                        {currentFeedback.score}/100
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextStage}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
                    >
                      <span>{currentIndex + 1 < questions.length ? 'Chuyển Sang Chặng Tiếp Theo' : 'Xem Báo Cáo Tổng Hợp'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200">
                      <div className="font-bold flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Điểm Mạnh:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-800 dark:text-emerald-300">
                        {currentFeedback.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200">
                      <div className="font-bold flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Cần Cải Thiện:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800 dark:text-amber-300">
                        {currentFeedback.improvements.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Follow-up Probing if available */}
                  {currentFeedback.followUpProbing && (
                    <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/50 text-xs text-violet-950 dark:text-violet-200">
                      <span className="font-bold">⚠️ Câu hỏi vặn từ Tech Lead: </span>
                      <span>"{currentFeedback.followUpProbing}"</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* FINAL REPORT VIEW */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score Header Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-700 text-white text-center shadow-lg">
                <span className="text-xs uppercase font-extrabold tracking-widest text-violet-200">
                  KẾT QUẢ PHỎNG VẤN THỰC CHIẾN TỔNG HỢP {companyName ? `• ${companyName}` : ''}
                </span>
                <div className="text-4xl sm:text-5xl font-black mt-2">
                  {finalReport.overallScore}/100
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>{finalReport.ratingLabel}</span>
                </div>
                <p className="text-xs text-violet-100 max-w-lg mx-auto mt-3 leading-relaxed">
                  {finalReport.executiveSummary}
                </p>
              </div>

              {/* 5-Axis Radar Matrix */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Đánh Giá Ma Trận Năng Lực 5 Trục (Radar 5 Pillars)
                </h4>

                <div className="space-y-2.5 bg-slate-50 dark:bg-[#111728] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {[
                    { label: 'Core Technical Depth (Độ sâu kỹ thuật & Kiến trúc)', score: finalReport.radarScores.technicalDepth, color: '#4f46e5' },
                    { label: 'Project Grounding (Tính xác thực & Bằng chứng đồ án)', score: finalReport.radarScores.projectGrounding, color: '#10b981' },
                    { label: 'Crisis & Incident Solving (Tư duy xử lý khủng hoảng)', score: finalReport.radarScores.crisisSolving, color: '#f59e0b' },
                    { label: 'STAR Communication (Cấu trúc diễn đạt mạch lạc)', score: finalReport.radarScores.starStructure, color: '#3b82f6' },
                    { label: 'Growth Mindset & Culture (Tố chất học hỏi & Văn hóa)', score: finalReport.radarScores.growthMindset, color: '#8b5cf6' }
                  ].map((axis, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{axis.label}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{axis.score}/100</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${axis.score}%`, backgroundColor: axis.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Recommendations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Khuyến Nghị Cải Thiện Trước Khi Phỏng Vấn Thật
                </h4>
                <div className="space-y-2">
                  {finalReport.keyRecommendations.map((rec, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-[#111728] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">#{i + 1}</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Luyện Tập Lại Lần Khác</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Hoàn Tất & Sẵn Sàng Phỏng Vấn
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!finalReport && (
          <div className="px-6 py-3 bg-slate-100 dark:bg-[#0c101c] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Enterprise Adaptive Interview Engine v2.0 • STAR & Incident Scenario Spec</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-bold transition cursor-pointer"
            >
              Thoát
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
