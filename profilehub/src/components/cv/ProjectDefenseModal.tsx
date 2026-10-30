import { useState, useMemo, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  HelpCircle,
  Scale,
  Bug,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Lightbulb,
  Code2
} from 'lucide-react';
import type { ProjectItem } from '../../types/cvSection';
import { projectDefenseService, type ProjectDefensePlan } from '../../services/projectDefenseService';

interface ProjectDefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
  projects?: ProjectItem[];
  targetRole?: string;
}

export default function ProjectDefenseModal({
  isOpen,
  onClose,
  project,
  projects,
  targetRole
}: ProjectDefenseModalProps) {
  const [activeTab, setActiveTab] = useState<'trap' | 'tradeoff' | 'debug' | 'limitations'>('trap');
  const [isCopied, setIsCopied] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(project?.id || (projects && projects[0]?.id) || '');

  // Synchronize when project prop changes
  useEffect(() => {
    if (project?.id) {
      setSelectedProjectId(project.id);
    } else if (projects && projects.length > 0) {
      setSelectedProjectId(prev => prev || projects[0].id);
    }
  }, [project, projects]);

  const activeProject = useMemo(() => {
    if (projects && projects.length > 0) {
      return projects.find(p => p.id === selectedProjectId) || projects[0];
    }
    return project;
  }, [projects, selectedProjectId, project]);

  const defensePlan: ProjectDefensePlan | null = useMemo(() => {
    if (!activeProject) return null;
    return projectDefenseService.generateDefenseBriefing(activeProject, targetRole);
  }, [activeProject, targetRole]);

  if (!isOpen) return null;

  if (!activeProject || !defensePlan) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Chưa phát hiện đồ án để diễn tập</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bạn cần có ít nhất 1 đồ án trong kho Hồ Sơ hoặc trên CV để hệ thống phân tích câu hỏi bẫy kỹ thuật của Tech Lead.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const handleCopyAll = async () => {
    const textLines = [
      `# BẢN LĨNH PHÒNG THỦ ĐỒ ÁN: ${defensePlan.projectName}`,
      `Vị trí ứng tuyển mục tiêu: ${defensePlan.targetRole || 'Developer'}`,
      `Công nghệ: ${(project.technologies || []).join(', ')}`,
      '',
      '## 1. TOP CÂU HỎI XOÁY CỦA TECH LEAD & CHIẾN LƯỢC TRẢ LỜI:',
      ...defensePlan.trapQuestions.map((q, i) => 
        `Câu ${i + 1}: ${q.question}\n- Bẫy ngầm: ${q.trapContext}\n- Góc trả lời khuyến nghị: ${q.recommendedAngle}\n`
      ),
      '## 2. BẢN GIẢI TRÌNH TRADE-OFF CÔNG NGHỆ:',
      ...defensePlan.tradeOffs.map(t =>
        `- Tại sao dùng ${t.technology} (thay vì ${t.comparedTo})? -> ${t.defenseReason}`
      ),
      '',
      '## 3. KỊCH BẢN GỠ LỖI THỰC CHIẾN (DEBUGGING STORY):',
      `- Tình huống: ${defensePlan.debuggingStoryScaffold.situation}`,
      `- Nguyên nhân: ${defensePlan.debuggingStoryScaffold.rootCause}`,
      `- Giải pháp: ${defensePlan.debuggingStoryScaffold.resolution}`,
      `- Bài học: ${defensePlan.debuggingStoryScaffold.takeaway}`,
      '',
      '## 4. ĐIỂM HẠN CHẾ NÊN CHỦ ĐỘNG THỪA NHẬN (SENIOR MINDSET):',
      ...defensePlan.knownLimitations.map(l => `- ${l}`)
    ];

    try {
      await navigator.clipboard.writeText(textLines.join('\n'));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Không thể copy:', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const content = [
      `# Phao Phỏng Vấn Phòng Thủ Đồ Án: ${defensePlan.projectName}`,
      `*Mục tiêu: Đè bẹp câu hỏi vặn của Senior Dev & Tech Lead*\n`,
      `### 1. Top Câu Hỏi Bẫy & Chiến Lược Trả Lời:`,
      ...defensePlan.trapQuestions.map((q, i) => 
        `**Câu ${i + 1}:** ${q.question}\n* *Bẫy ngầm:* ${q.trapContext}\n* *Góc trả lời chuẩn:* ${q.recommendedAngle}\n`
      ),
      `### 2. Trade-offs Công Nghệ:`,
      ...defensePlan.tradeOffs.map(t =>
        `* **${t.technology} vs ${t.comparedTo}:** ${t.defenseReason}`
      ),
      `\n### 3. Kịch Bản Gỡ Lỗi (Debugging Story):`,
      `* **Tình huống:** ${defensePlan.debuggingStoryScaffold.situation}`,
      `* **Nguyên nhân:** ${defensePlan.debuggingStoryScaffold.rootCause}`,
      `* **Giải pháp:** ${defensePlan.debuggingStoryScaffold.resolution}`,
      `* **Bài học rút ra:** ${defensePlan.debuggingStoryScaffold.takeaway}`,
      `\n### 4. Điểm Hạn Chế Cần Thừa Nhận:`,
      ...defensePlan.knownLimitations.map(l => `* ${l}`)
    ].join('\n');

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Project-Defense-${project.projectName.replace(/\s+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Bản Lĩnh Phòng Thủ Đồ Án (Project Defense Briefing)
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full border border-blue-300 dark:border-blue-700">
                  Vũ khí Vòng Phỏng Vấn
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Huấn luyện kỹ thuật: Câu hỏi xoáy của Tech Lead, giải trình Trade-off và kịch bản gỡ lỗi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Target Bar */}
        <div className="px-6 py-3 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Code2 className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="font-bold text-slate-900 dark:text-white truncate">
              {defensePlan.projectName}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              {defensePlan.targetRole}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {projects && projects.length > 1 && (
              <div className="flex items-center gap-1.5 mr-2">
                <span className="text-slate-500 font-semibold text-[11px]">Đổi đồ án:</span>
                <select
                  value={activeProject.id}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-2xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.projectName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {(activeProject.technologies || []).slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px] text-slate-700 dark:text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-2 bg-white dark:bg-slate-900 text-xs font-bold">
          <button
            onClick={() => setActiveTab('trap')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'trap'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Top Câu Hỏi Xoáy ({defensePlan.trapQuestions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tradeoff')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'tradeoff'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Giải trình Trade-offs</span>
          </button>

          <button
            onClick={() => setActiveTab('debug')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'debug'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>Kịch bản Gỡ Lỗi Nhớ Đời</span>
          </button>

          <button
            onClick={() => setActiveTab('limitations')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'limitations'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Điểm Hạn Chế Nên Thừa Nhận</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* TAB 1: TRAP QUESTIONS */}
          {activeTab === 'trap' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  <strong>Bí kíp đối đầu:</strong> Tech Lead không hỏi để dồn bạn vào chân tường, họ muốn xem bạn có thực sự hiểu bản chất những gì mình viết trên CV hay chỉ học vẹt.
                </span>
              </div>

              {defensePlan.trapQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  <div className="ml-8 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-red-50/70 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 text-red-800 dark:text-red-300">
                      <strong>⚠️ Bẫy ngầm của Tech Lead:</strong> {q.trapContext}
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                      <strong>✅ Góc trả lời chuẩn mực:</strong> {q.recommendedAngle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: TRADE-OFFS */}
          {activeTab === 'tradeoff' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                <span>
                  <strong>Tư duy Senior:</strong> Không có công nghệ nào là hoàn hảo, chỉ có công nghệ phù hợp với bài toán. Khả năng giải thích "Tại sao chọn A mà không chọn B" là thước đo lớn nhất giữa Fresher và Middle Dev.
                </span>
              </div>

              {defensePlan.tradeOffs.map((trade, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-blue-600 dark:text-blue-400">Công nghệ đã chọn: {trade.technology}</span>
                    <span className="text-slate-400">So sánh với: {trade.comparedTo}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                    <strong>Lý do kỹ thuật bảo vệ:</strong> {trade.defenseReason}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DEBUGGING STORY */}
          {activeTab === 'debug' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <Bug className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>
                  <strong>Kể chuyện gỡ lỗi:</strong> Khi được hỏi "Kể về một lần em gặp bug khó nhất?", hãy áp dụng cấu trúc 4 pha này để biến sự cố thành minh chứng của năng lực tư duy.
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    1. Tình huống phát sinh (Situation)
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    {defensePlan.debuggingStoryScaffold.situation}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    2. Nguyên nhân gốc rễ (Root Cause)
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    {defensePlan.debuggingStoryScaffold.rootCause}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    3. Giải pháp khắc phục (Resolution)
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    {defensePlan.debuggingStoryScaffold.resolution}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                    4. Bài học chuyên môn (Takeaway)
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200">
                    {defensePlan.debuggingStoryScaffold.takeaway}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIMITATIONS */}
          {activeTab === 'limitations' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  <strong>Khiêm tốn nhưng chuyên nghiệp:</strong> Không có hệ thống nào là hoàn hảo. Việc chủ động nói ra điểm hạn chế trước khi người phỏng vấn chỉ ra sẽ chứng minh bạn có độ tự nhận thức (self-awareness) cực cao.
                </span>
              </div>

              <div className="space-y-2.5">
                {defensePlan.knownLimitations.map((lim, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="font-bold text-amber-600 shrink-0">•</span>
                    <span>{lim}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <button
            onClick={handleDownloadMarkdown}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Tải phao phỏng vấn dạng Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Tải Phao (.md)</span>
          </button>

          <button
            onClick={handleCopyAll}
            className="px-4 py-2 bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#172554] hover:to-[#1d4ed8] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Đã sao chép phao phỏng vấn!' : '1-Click Sao chép phao'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
