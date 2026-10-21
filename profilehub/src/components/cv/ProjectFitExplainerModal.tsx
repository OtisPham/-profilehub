import { useState, useMemo } from 'react';
import { X, Search, Check, Sparkles, Filter, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import type { ProjectItem } from '../../types/cvSection';
import { projectFitService, type ProjectFitItem } from '../../services/projectFitService';

interface ProjectFitExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: any[];
  onApplySelectedProjects: (selectedProjects: ProjectItem[]) => void;
}

const SAMPLE_JDS = [
  {
    label: 'Frontend React / Next.js',
    text: 'Tuyển dụng Frontend Developer kinh nghiệm với React, Next.js, TypeScript, Tailwind CSS, REST API, tối ưu hiệu năng web.'
  },
  {
    label: 'Backend Golang / Microservices',
    text: 'Cần tuyển Backend Engineer thành thạo Golang, Kafka, Docker, Kubernetes, gRPC, PostgreSQL, Microservices.'
  },
  {
    label: 'Fullstack Node.js / React',
    text: 'Tìm kiếm Fullstack Web Developer thành thạo Node.js, Express, React, TypeScript, PostgreSQL, Docker, Git CI/CD.'
  }
];

export default function ProjectFitExplainerModal({
  isOpen,
  onClose,
  projects,
  onApplySelectedProjects
}: ProjectFitExplainerModalProps) {
  if (!isOpen) return null;

  const [jdText, setJdText] = useState(SAMPLE_JDS[0].text);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(projects.map(p => p.id)));

  const rankedResults = useMemo(() => {
    return projectFitService.evaluateProjectFit(projects, jdText);
  }, [projects, jdText]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApply = () => {
    const selected = rankedResults
      .filter(r => selectedIds.has(r.projectId))
      .map(r => {
        const p = r.project;
        const item: ProjectItem = {
          id: p.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          projectName: p.projectName || p.title || 'Dự án không tên',
          role: p.role || 'Developer',
          startDate: p.startDate || '2025',
          endDate: p.endDate || '2026',
          description: p.description || '',
          technologies: p.technologies || p.tags || [],
          projectUrl: p.projectUrl || p.demo_url || undefined,
          githubUrl: p.githubUrl || p.github_url || undefined,
          syncToMasterProfile: true,
          scopeType: p.scopeType || 'team',
          teamSize: p.teamSize || 4,
          systemContext: p.systemContext || undefined
        };
        return item;
      });

    onApplySelectedProjects(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Project Fit Explainer (Tuyển chọn & Xếp hạng Dự án theo JD)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI phân tích đối chiếu từ khóa và xếp hạng đồ án trong kho theo độ phù hợp với bản mô tả công việc (JD).
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

        {/* JD Input Area with Sample Presets */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Dán nội dung Job Description (JD) của nhà tuyển dụng:</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Mẫu thử nhanh:</span>
              {SAMPLE_JDS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setJdText(sample.text)}
                  className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-300 transition"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={2}
            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Dán yêu cầu tuyển dụng (yêu cầu kỹ năng, công nghệ, kinh nghiệm)..."
          />
        </div>

        {/* Ranked Projects List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>KẾT QUẢ ĐỐI CHIẾU XẾP HẠNG ({rankedResults.length} DỰ ÁN)</span>
            <span>Đã chọn: <strong className="text-indigo-600 dark:text-indigo-400">{selectedIds.size}/{rankedResults.length}</strong></span>
          </div>

          {rankedResults.map((result, idx) => {
            const isSelected = selectedIds.has(result.projectId);
            const scoreColor =
              result.matchScore >= 75
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300'
                : result.matchScore >= 50
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300'
                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300';

            return (
              <div
                key={result.projectId}
                onClick={() => toggleSelect(result.projectId)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by parent div
                    className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {result.projectName}
                        </h4>
                        <span className="text-xs text-slate-500">({result.role})</span>
                      </div>

                      <div className={`px-2 py-0.5 rounded-full text-xs font-bold border ${scoreColor}`}>
                        {result.matchScore}% Tương thích
                      </div>
                    </div>

                    {/* Transparent AI explanation */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                      💡 {result.recommendationReason}
                    </p>

                    {/* Matched & Missing Keywords Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {result.matchedKeywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Trùng khớp:</span>
                          {result.matchedKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium text-[10px]"
                            >
                              ✓ {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {result.missingKeywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 ml-auto">
                          <span className="text-[10px] font-semibold text-slate-400">Chưa có:</span>
                          {result.missingKeywords.slice(0, 3).map((kw, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 font-medium text-[10px]"
                            >
                              - {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Đóng
          </button>
          <button
            onClick={handleApply}
            disabled={selectedIds.size === 0}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" /> Đưa {selectedIds.size} dự án đã chọn vào CV
          </button>
        </div>

      </div>
    </div>
  );
}
