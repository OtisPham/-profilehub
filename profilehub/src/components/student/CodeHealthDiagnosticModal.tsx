import React, { useState, useEffect } from 'react';
import type { CodeHealthReport } from '../../types/database';
import { codeHealthService } from '../../services/codeHealthService';
import {
  X,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  GitBranch,
  Terminal,
  FileCode,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CodeHealthDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    title: string;
    github_url?: string;
    tags?: string[];
    description?: string;
  } | null;
}

export default function CodeHealthDiagnosticModal({
  isOpen,
  onClose,
  project
}: CodeHealthDiagnosticModalProps) {
  const [report, setReport] = useState<CodeHealthReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      setLoading(true);
      // Giả lập quét bảo chứng mượt mà
      const timer = setTimeout(async () => {
        const res = await codeHealthService.analyzeCodeHealth(project);
        setReport(res);
        setLoading(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const handleCopyBadge = () => {
    if (!report) return;
    const badgeMarkdown = codeHealthService.getMarkdownBadge(report);
    navigator.clipboard.writeText(badgeMarkdown);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  const getTierBadgeStyle = (tier: string) => {
    if (tier.includes('A+')) return 'bg-emerald-500 text-white shadow-emerald-500/20';
    if (tier.includes('B')) return 'bg-blue-600 text-white shadow-blue-500/20';
    return 'bg-amber-500 text-white shadow-amber-500/20';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Kiểm Định Sức Khỏe Mã Nguồn & Kiến Trúc
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  Clean Architecture
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Đồ án: <strong className="text-slate-700 dark:text-slate-300">{project.title}</strong>
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
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Đang phân tích cấu trúc kho mã nguồn GitHub...
              </p>
              <p className="text-xs text-slate-400">
                Quét phát hiện rò rỉ bảo mật, kiểm tra bộ test và tài liệu hướng dẫn
              </p>
            </div>
          ) : report ? (
            <>
              {/* Card Điểm Số & Xếp Hạng Phân Bậc */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shadow-xs">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {report.overallScore}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">/100</span>
                  </div>
                  <div>
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg shadow-sm ${getTierBadgeStyle(report.tier)}`}>
                      {report.tier}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5" />
                      {report.githubUrl !== 'https://github.com' ? (
                        <a 
                          href={report.githubUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          {report.githubUrl} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-rose-500 font-medium">Chưa liên kết kho mã nguồn GitHub</span>
                      )}
                    </p>
                  </div>
                </div>

                {report.badgesEarned.length > 0 && (
                  <div className="hidden sm:flex flex-col items-end gap-1 text-right">
                    <span className="text-[11px] font-semibold text-slate-400">Huy hiệu đạt được</span>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {report.badgesEarned.map((b, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Checklist 5 Tiêu Chuẩn Vàng Kiến Trúc */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" /> 5 Tiêu Chuẩn Vàng Về Độ Sạch Của Mã Nguồn
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 1. README */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileCode className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Tài Liệu README.md</p>
                        <p className="text-[10px] text-slate-400">Hướng dẫn cài đặt & kiến trúc</p>
                      </div>
                    </div>
                    {report.checks.hasReadme ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>

                  {/* 2. Security No Leaked Env */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Bảo Mật Khóa Bí Mật</p>
                        <p className="text-[10px] text-slate-400">Không lộ file .env & token API</p>
                      </div>
                    </div>
                    {report.checks.noLeakedEnv ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>

                  {/* 3. Unit Tests */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Terminal className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Kiểm Thử Tự Động</p>
                        <p className="text-[10px] text-slate-400">Bộ test Vitest / Jest coverage</p>
                      </div>
                    </div>
                    {report.checks.hasTests ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>

                  {/* 4. Gitignore */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <GitBranch className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Tập Tin .gitignore</p>
                        <p className="text-[10px] text-slate-400">Loại bỏ node_modules & build</p>
                      </div>
                    </div>
                    {report.checks.hasGitignore ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Khuyến nghị nâng cấp */}
              {report.recommendations.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                  <p className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600" /> Đề Xuất Cải Tiến Để Nâng Hạng Đồ Án
                  </p>
                  <ul className="space-y-1.5">
                    {report.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Markdown Badge Export Box */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Huy Hiệu Markdown (Nhúng Vào GitHub README.md)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyBadge}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {copiedBadge ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã sao chép!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Sao chép mã Markdown
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 select-all">
                  <code>{codeHealthService.getMarkdownBadge(report)}</code>
                </pre>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1222] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
          >
            Đóng
          </button>

          {report && (
            <button
              type="button"
              onClick={handleCopyBadge}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedBadge ? 'Đã Sao Chép Huy Hiệu!' : 'Sao Chép Huy Hiệu GitHub'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
