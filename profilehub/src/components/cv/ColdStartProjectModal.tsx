import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Layers, 
  Github, 
  Check, 
  ArrowRight, 
  Globe, 
  Terminal, 
  Cpu, 
  Smartphone, 
  Database,
  ExternalLink
} from 'lucide-react';
import type { ColdStartModalProps, StarterDomainId, IndustryStarterTemplate } from '../../types/coldStart.types';
import type { ProjectItem } from '../../types/cvSection';
import { STARTER_DOMAINS, INDUSTRY_STARTER_TEMPLATES } from '../../constants/industryStarterTemplates';

export const ColdStartProjectModal: React.FC<ColdStartModalProps> = ({
  isOpen,
  onClose,
  onApplyStarterProject,
  targetRole
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'github'>('templates');
  const [selectedDomain, setSelectedDomain] = useState<StarterDomainId>('all');
  const [appliedId, setAppliedId] = useState<string | null>(null);

  // GitHub Quick Scanner Form
  const [githubUrl, setGithubUrl] = useState('');
  const [githubRepoName, setGithubRepoName] = useState('');
  const [githubTechStack, setGithubTechStack] = useState('React, TypeScript, Tailwind CSS');
  const [githubRole, setGithubRole] = useState('Fullstack Developer');
  const [githubDescription, setGithubDescription] = useState('Phát triển ứng dụng web và hoàn thiện các module cốt lõi.');

  // Lọc template theo domain
  const filteredTemplates = useMemo(() => {
    if (selectedDomain === 'all') {
      return INDUSTRY_STARTER_TEMPLATES;
    }
    return INDUSTRY_STARTER_TEMPLATES.filter(t => t.domain === selectedDomain);
  }, [selectedDomain]);

  if (!isOpen) return null;

  const handleApplyTemplate = (tmpl: IndustryStarterTemplate) => {
    const newProject: ProjectItem = {
      id: `proj_starter_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectName: tmpl.projectName,
      role: tmpl.role,
      startDate: '2025-01',
      endDate: '2025-06',
      description: tmpl.description,
      bullets: [...tmpl.bullets],
      technologies: [...tmpl.technologies],
      scopeType: tmpl.scopeType,
      teamSize: tmpl.teamSize,
      systemContext: tmpl.systemContext,
      projectUrl: tmpl.demoUrl,
      githubUrl: tmpl.githubUrl,
      syncToMasterProfile: true
    };

    setAppliedId(tmpl.id);
    setTimeout(() => {
      onApplyStarterProject(newProject);
      setAppliedId(null);
      onClose();
    }, 400);
  };

  const handleApplyFromGithub = () => {
    const rawName = githubRepoName.trim() || githubUrl.split('/').pop() || 'Dự Án Từ GitHub';
    const cleanName = rawName.replace(/[-_]/g, ' ').replace(/\.git$/i, '');
    const capitalizedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    const newProject: ProjectItem = {
      id: `proj_gh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectName: capitalizedName,
      role: githubRole.trim() || 'Software Engineer',
      startDate: '2025-01',
      endDate: '2025-06',
      description: githubDescription.trim(),
      bullets: [
        `Khởi tạo cấu trúc dự án và xây dựng mã nguồn mô-đun chính trên GitHub.`,
        `Tối ưu hóa hiệu năng và tuân thủ các tiêu chuẩn kỹ thuật Clean Architecture.`,
        `Thiết lập quy trình CI/CD và triển khai ứng dụng kiểm thử thành công.`
      ],
      technologies: githubTechStack.split(',').map(t => t.trim()).filter(Boolean),
      scopeType: 'solo',
      teamSize: 1,
      systemContext: `Mã nguồn mở lưu trữ tại ${githubUrl || 'GitHub'}`,
      githubUrl: githubUrl.trim() || undefined,
      syncToMasterProfile: true
    };

    onApplyStarterProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coldstart-title"
      >
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 id="coldstart-title" className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Trợ Lý Khởi Tạo Dự Án Bước Đầu (Cold-Start Starter)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xóa bỏ nỗi sợ trang giấy trắng với khung đồ án chuẩn mực theo chuyên ngành hoặc kết nối GitHub
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            Khung Dự Án Theo Ngành (Industry Starter Templates)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Github className="w-4 h-4" />
            Quét Nhanh Từ GitHub (GitHub Quick Scanner)
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'templates' ? (
            <>
              {/* Domain Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {STARTER_DOMAINS.map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDomain(d.id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      selectedDomain === d.id
                        ? 'bg-indigo-600 border-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                    }`}
                  >
                    {d.title}
                  </button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map(tmpl => (
                  <div
                    key={tmpl.id}
                    className="p-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 hover:border-indigo-300 dark:hover:border-indigo-600/60 rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left group"
                  >
                    <div>
                      {/* Domain Badge & Scope */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {tmpl.domainTitle}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {tmpl.scopeType === 'team' ? `👥 Nhóm ${tmpl.teamSize} TV` : '👤 Cá nhân'}
                        </span>
                      </div>

                      {/* Project Name */}
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {tmpl.projectName}
                      </h4>

                      {/* System Context */}
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                        <strong>Hệ thống:</strong> {tmpl.systemContext}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {tmpl.technologies.map(t => (
                          <span
                            key={t}
                            className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200/80 dark:border-slate-700/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Bullets Preview (STAR) */}
                      <div className="mt-3 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2.5 text-[11px] text-slate-600 dark:text-slate-300">
                        {tmpl.bullets.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-indigo-500 shrink-0 font-bold">•</span>
                            <span className="line-clamp-2">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Chuẩn STAR 100%
                      </span>

                      <button
                        type="button"
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="inline-flex items-center text-xs font-semibold px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
                      >
                        {appliedId === tmpl.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Đã Thêm!
                          </>
                        ) : (
                          <>
                            Áp Dụng Vào CV
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* GitHub Quick Scanner Form */
            <div className="max-w-xl mx-auto py-4 space-y-4 text-left">
              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Kết Nối Mã Nguồn Thực Tế:
                </p>
                Dán đường dẫn Repository GitHub của bạn (cá nhân hoặc đồ án môn học). Hệ thống sẽ tự động cấu trúc thành một mục dự án chuẩn mực có liên kết kiểm chứng trực tiếp.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Repository URL:
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    const parts = e.target.value.split('/');
                    if (parts.length > 1) {
                      setGithubRepoName(parts[parts.length - 1] || '');
                    }
                  }}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tên Đồ Án / Sản Phẩm:
                  </label>
                  <input
                    type="text"
                    value={githubRepoName}
                    onChange={(e) => setGithubRepoName(e.target.value)}
                    placeholder="E-Commerce App"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Vai Trò Kỹ Thuật Của Bạn:
                  </label>
                  <input
                    type="text"
                    value={githubRole}
                    onChange={(e) => setGithubRole(e.target.value)}
                    placeholder="Fullstack Developer"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Công Nghệ Sử Dụng (Phân tách bởi dấu phẩy):
                </label>
                <input
                  type="text"
                  value={githubTechStack}
                  onChange={(e) => setGithubTechStack(e.target.value)}
                  placeholder="React 18, TypeScript, Tailwind CSS, Vite"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mô Tả Tổng Quan Hệ Thống:
                </label>
                <textarea
                  value={githubDescription}
                  onChange={(e) => setGithubDescription(e.target.value)}
                  rows={2}
                  placeholder="Mô tả chức năng sản phẩm giải quyết bài toán gì..."
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyFromGithub}
                  className="inline-flex items-center text-xs font-semibold px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4 mr-1.5" />
                  Tạo Đồ Án Chuẩn Vào CV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColdStartProjectModal;
