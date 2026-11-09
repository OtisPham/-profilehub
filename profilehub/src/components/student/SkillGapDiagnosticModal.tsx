import React, { useState, useEffect } from 'react';
import type { JobPost, SkillGapReport, ProjectUpgradeRecipe } from '../../types/database';
import { skillGapService } from '../../services/skillGapService';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Code, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Send,
  Zap,
  Target,
  FileCheck
} from 'lucide-react';

interface SkillGapDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: (Partial<JobPost> & { id: string; title: string; company_name?: string }) | null;
  studentSkills: string[];
  studentProjects?: Array<{ id: string; title: string; tags?: string[] }>;
  onGenerateTailoredCv?: (job: any) => void;
}

export default function SkillGapDiagnosticModal({
  isOpen,
  onClose,
  job,
  studentSkills,
  studentProjects,
  onGenerateTailoredCv
}: SkillGapDiagnosticModalProps) {
  const [report, setReport] = useState<SkillGapReport | null>(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const [copiedRecipeId, setCopiedRecipeId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && job) {
      const result = skillGapService.diagnoseSkillGap(
        {
          skills: studentSkills,
          projects: studentProjects
        },
        job
      );
      setReport(result);
      if (result.upgradeRecipes.length > 0) {
        setExpandedRecipeId(result.upgradeRecipes[0].id);
      }
    }
  }, [isOpen, job, studentSkills, studentProjects]);

  if (!isOpen || !job || !report) return null;

  const handleToggleRecipeStatus = (recipeId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';
    const updated = skillGapService.updateRecipeStatus(report.id, recipeId, newStatus);
    if (updated) {
      setReport({ ...updated });
      if (newStatus === 'completed') {
        setSuccessToast(`🎉 Chúc mừng! Bạn đã áp dụng công thức vào đồ án. Điểm sẵn sàng tăng lên ${updated.readinessScore}%!`);
        setTimeout(() => setSuccessToast(null), 3500);
      }
    }
  };

  const handleCopyCode = (recipeId: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedRecipeId(recipeId);
    setTimeout(() => setCopiedRecipeId(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300';
    if (score >= 60) return 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300';
    return 'text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300';
  };

  const getScoreVerdict = (score: number) => {
    if (score >= 80) return { title: 'Rất Sẵn Sàng Ứng Tuyển', desc: 'Đồ án & CV của bạn khớp gần như trọn vẹn với JD. Tỷ lệ được mời phỏng vấn rất cao!' };
    if (score >= 60) return { title: 'Tiềm Năng Cao - Cần Bổ Sung Nhẹ', desc: 'Bạn đã có nền tảng vững. Hãy hoàn thành 1 mini-task nâng cấp đồ án bên dưới để lọt Top 10% hồ sơ.' };
    return { title: 'Khoảng Trống Cần Khắc Phục', desc: 'Vị trí này đòi hỏi một số công nghệ mới. Hãy làm theo công thức hướng dẫn 3 bước để tích hợp vào đồ án có sẵn.' };
  };

  const verdict = getScoreVerdict(report.readinessScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Toast thông báo hoàn thành recipe */}
        {successToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Chẩn Đoán Skill-Gap & Lộ Trình Nâng Cấp Đồ Án
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  AI Diagnostic
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Vị trí: <strong className="text-slate-700 dark:text-slate-300">{job.title}</strong> • Công ty: <span className="text-indigo-600 dark:text-indigo-400 font-medium">{(job as any).company_name || 'Doanh Nghiệp Tuyển Dụng'}</span>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Card Điểm Sẵn Sàng (Readiness Score Header) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-inner ${getScoreColor(report.readinessScore)}`}>
                <span className="text-2xl font-black">{report.readinessScore}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Phù Hợp</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {verdict.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                  {verdict.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="text-right text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {report.matchedSkills.length} / {report.matchedSkills.length + report.missingSkills.length} Kỹ Năng Đạt
                </p>
                <p className="text-slate-500 mt-0.5">
                  {report.upgradeRecipes.filter(r => r.status === 'completed').length} / {report.upgradeRecipes.length} Recipe Đã Áp Dụng
                </p>
              </div>
            </div>
          </div>

          {/* Grid 2 Cột: Kỹ Năng Đạt vs Kỹ Năng Thiếu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cột 1: Kỹ Năng Đã Khớp */}
            <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-950/40 bg-emerald-50/30 dark:bg-emerald-950/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="w-4 h-4" /> Kỹ Năng Đã Khớp ({report.matchedSkills.length})
              </h4>
              <div className="space-y-2">
                {report.matchedSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Chưa phát hiện kỹ năng tương thích trực tiếp.</p>
                ) : (
                  report.matchedSkills.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 shadow-xs">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {m.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium">
                        {m.source === 'project' ? `Đồ án: ${m.projectTitle || 'Thực chiến'}` : 'Hồ Sơ CV'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cột 2: Kỹ Năng Còn Thiếu */}
            <div className="p-4 rounded-xl border border-rose-100 dark:border-rose-950/40 bg-rose-50/30 dark:bg-rose-950/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5 mb-3">
                <AlertCircle className="w-4 h-4" /> Kỹ Năng Cần Bổ Sung ({report.missingSkills.length})
              </h4>
              <div className="space-y-2">
                {report.missingSkills.length === 0 ? (
                  <p className="text-xs text-emerald-600 font-medium">Tuyệt vời! Bạn không thiếu kỹ năng nào so với JD.</p>
                ) : (
                  report.missingSkills.map((ms, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {ms.name}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                          ms.criticality === 'critical'
                            ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                        }`}>
                          {ms.criticality === 'critical' ? 'Bắt Buộc' : 'Khuyến Nghị'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {ms.reason}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Danh Sách Công Thức Nâng Cấp Đồ Án (Project Upgrade Recipes) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                Công Thức Nâng Cấp Đồ Án Chuẩn Công Nghiệp (Engineering Recipes)
              </h4>
              <span className="text-xs text-slate-500">
                Làm theo hướng dẫn & tích chọn để cộng điểm
              </span>
            </div>

            {report.upgradeRecipes.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                Hồ sơ của bạn đã đáp ứng đủ các công thức nâng cấp cho vị trí này!
              </div>
            ) : (
              <div className="space-y-3">
                {report.upgradeRecipes.map((recipe: ProjectUpgradeRecipe) => {
                  const isExpanded = expandedRecipeId === recipe.id;
                  const isCompleted = recipe.status === 'completed';

                  return (
                    <div 
                      key={recipe.id}
                      className={`rounded-xl border transition-all duration-200 ${
                        isCompleted 
                          ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                      }`}
                    >
                      {/* Card Header */}
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer select-none"
                        onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                      >
                        <div className="flex items-center gap-3 flex-1 pr-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRecipeStatus(recipe.id, recipe.status);
                            }}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                              isCompleted 
                                ? 'bg-emerald-600 text-white' 
                                : 'border border-slate-300 dark:border-slate-600 hover:border-indigo-600 text-transparent'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {recipe.title}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
                                {recipe.targetSkill}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> ~{recipe.estimatedHours} giờ thực hiện
                              </span>
                              <span>•</span>
                              <span>Độ khó: <strong className="text-slate-700 dark:text-slate-300">{recipe.complexity}</strong></span>
                              {isCompleted && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-600 font-semibold">Đã hoàn thành</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      {/* Card Content Accordion */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4">
                          {/* 1. Hướng dẫn 3 bước */}
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                              Lộ Trình Triển Khai Vào Đồ Án
                            </p>
                            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                              {recipe.stepByStepGuide.map((step, sIdx) => (
                                <li key={sIdx} className="leading-relaxed">
                                  <span className="text-slate-800 dark:text-slate-200">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* 2. Snippet Code mẫu */}
                          {recipe.codeSnippet && (
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                  <Code className="w-3.5 h-3.5 text-indigo-500" /> Mã Nguồn Mẫu (Production Snippet)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(recipe.id, recipe.codeSnippet)}
                                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                >
                                  {copiedRecipeId === recipe.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã chép
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" /> Sao chép mã
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                                <code>{recipe.codeSnippet}</code>
                              </pre>
                            </div>
                          )}

                          {/* 3. Tiêu chí nghiệm thu */}
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                              Tiêu Chí Nghiệm Thu (Acceptance Criteria)
                            </p>
                            <ul className="space-y-1">
                              {recipe.acceptanceCriteria.map((crit, cIdx) => (
                                <li key={cIdx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                                  <span className="text-indigo-500 mt-0.5">•</span>
                                  <span>{crit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Nút hành động toggle hoàn thành */}
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleToggleRecipeStatus(recipe.id, recipe.status)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                                isCompleted
                                  ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <FileCheck className="w-3.5 h-3.5" /> Bỏ đánh dấu hoàn thành
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Đánh Dấu Đã Áp Dụng Vào Đồ Án (+Điểm)
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1222] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
          >
            Đóng
          </button>

          {onGenerateTailoredCv && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onGenerateTailoredCv(job);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              Nộp CV May Đo Theo JD Này
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
