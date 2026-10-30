import React, { useState } from 'react';
import {
  Github,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';
import type { ProjectItem } from '../../types/cvSection';

interface GitHubQuickImportBarProps {
  onImportProject: (project: ProjectItem) => void;
  targetRole?: string;
}

export default function GitHubQuickImportBar({
  onImportProject,
  targetRole
}: GitHubQuickImportBarProps) {
  const [repoInput, setRepoInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [jdInput, setJdInput] = useState('');
  const [showJdBox, setShowJdBox] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    repoName: string;
    techCount: number;
    techList: string[];
    commitCount: number;
    role: string;
  } | null>(null);

  // Parse owner and repo from various URL formats
  const parseGitHubUrl = (input: string): { owner: string; repo: string } | null => {
    let clean = input.trim();
    clean = clean.replace(/^https?:\/\//i, '');
    clean = clean.replace(/^github\.com\//i, '');
    clean = clean.replace(/\/$/, '');
    clean = clean.replace(/\.git$/i, '');

    const parts = clean.split('/');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return { owner: parts[0], repo: parts[1] };
    }
    return null;
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    const clean = repoInput.trim().replace(/^https?:\/\//i, '').replace(/^github\.com\//i, '').replace(/\/$/, '').replace(/\.git$/i, '');
    const rawParts = clean.split('/').filter(Boolean);
    if (rawParts.length === 1 && rawParts[0]) {
      setErrorMessage(
        `Bạn vừa nhập link Profile cá nhân ("github.com/${rawParts[0]}"). Thanh này dùng để bóc tách mã nguồn của 1 Dự án/Repo cụ thể (dạng: github.com/${rawParts[0]}/ten-du-an). Nếu muốn hiển thị link GitHub cá nhân trên CV, bạn có thể nhập trực tiếp vào ô GitHub ở phần Thông tin liên hệ trên đầu CV.`
      );
      return;
    }

    const parsed = parseGitHubUrl(repoInput);
    if (!parsed) {
      setErrorMessage('Định dạng link GitHub không hợp lệ. Vui lòng nhập dạng: github.com/username/project hoặc username/project');
      return;
    }

    const { owner, repo } = parsed;
    const authorUsername = authorInput.trim() || owner;

    setLoading(true);
    setStatusMessage('Đang kết nối GitHub API...');

    try {
      // 1. Fetch Repository General Metadata
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoRes.ok) {
        if (repoRes.status === 404) {
          throw new Error(`Không tìm thấy repo "${owner}/${repo}" trên GitHub. Điều này thường do: 1) Repo đang để chế độ Riêng tư (Private), bạn cần đổi sang Public; hoặc 2) Sai chính tả tên tài khoản / dự án.`);
        }
        if (repoRes.status === 403) {
          throw new Error('Đã đạt giới hạn lượt gọi GitHub không xác thực (Rate Limit). Vui lòng đợi ít phút hoặc thử lại.');
        }
        throw new Error(`Lỗi GitHub API: HTTP ${repoRes.status}`);
      }
      const repoData = await repoRes.json();

      // 2. Fetch Dependencies from package.json (Raw Content without Auth)
      setStatusMessage('Đang quét file manifest và bóc tách thư viện...');
      let detectedTechs: string[] = [];
      let detectedRole = 'Fullstack Developer';
      let backendScore = 0;
      let frontendScore = 0;

      if (repoData.language) {
        detectedTechs.push(repoData.language);
      }

      try {
        const pkgRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`);
        if (pkgRes.ok) {
          const pkg = await pkgRes.json();
          const allDeps = {
            ...(pkg.dependencies || {}),
            ...(pkg.devDependencies || {})
          };

          const depNames = Object.keys(allDeps);

          // Check Frontend Libs
          if (depNames.some(d => d.includes('react'))) { detectedTechs.push('React'); frontendScore += 2; }
          if (depNames.some(d => d.includes('vue'))) { detectedTechs.push('Vue.js'); frontendScore += 2; }
          if (depNames.some(d => d.includes('next'))) { detectedTechs.push('Next.js'); frontendScore += 2; backendScore += 1; }
          if (depNames.some(d => d.includes('tailwind'))) { detectedTechs.push('Tailwind CSS'); frontendScore += 1; }
          if (depNames.some(d => d.includes('query') || d.includes('swr'))) { detectedTechs.push('React Query'); frontendScore += 1; }
          if (depNames.some(d => d.includes('redux') || d.includes('zustand'))) { detectedTechs.push('Redux / State Mgmt'); frontendScore += 1; }

          // Check Backend Libs
          if (depNames.some(d => d.includes('express'))) { detectedTechs.push('Express.js'); backendScore += 2; }
          if (depNames.some(d => d.includes('nest'))) { detectedTechs.push('NestJS'); backendScore += 2; }
          if (depNames.some(d => d.includes('prisma'))) { detectedTechs.push('Prisma ORM'); backendScore += 2; }
          if (depNames.some(d => d.includes('mongoose') || d.includes('mongodb'))) { detectedTechs.push('MongoDB'); backendScore += 2; }
          if (depNames.some(d => d.includes('jsonwebtoken') || d.includes('jwt') || d.includes('passport'))) { detectedTechs.push('JWT Auth'); backendScore += 1; }
          if (depNames.some(d => d.includes('pg') || d.includes('mysql') || d.includes('typeorm'))) { detectedTechs.push('SQL Database'); backendScore += 2; }

          // Check Core
          if (depNames.some(d => d.includes('typescript')) && !detectedTechs.includes('TypeScript')) {
            detectedTechs.push('TypeScript');
          }
          if (depNames.some(d => d.includes('zod'))) {
            detectedTechs.push('Zod Validation');
          }
          if (depNames.some(d => d.includes('docker'))) {
            detectedTechs.push('Docker');
          }
        }
      } catch {
        // package.json not found or not a node repo, continue with language
      }

      // Infer role
      if (frontendScore > backendScore + 1) {
        detectedRole = 'Frontend Developer';
      } else if (backendScore > frontendScore + 1) {
        detectedRole = 'Backend Developer';
      } else {
        detectedRole = 'Fullstack Developer';
      }

      // Deduplicate techs
      detectedTechs = Array.from(new Set(detectedTechs));
      if (detectedTechs.length === 0) {
        detectedTechs = ['JavaScript', 'HTML/CSS'];
      }

      // 3. Fetch Author Commits
      setStatusMessage('Đang phân tích commit cá nhân & so khớp JD...');
      let commitMessages: string[] = [];
      let commitCount = 0;

      try {
        const commitsRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?author=${encodeURIComponent(authorUsername)}&per_page=15`
        );
        if (commitsRes.ok) {
          const commitsData = await commitsRes.json();
          if (Array.isArray(commitsData)) {
            commitCount = commitsData.length;
            commitMessages = commitsData
              .map(c => c?.commit?.message?.split('\n')[0]?.trim())
              .filter(m => m && !m.startsWith('Merge') && m.length > 5);
          }
        }
      } catch {
        // Commits API error, proceed with fallback
      }

      // 4. Generate High-Fidelity Bullets (STAR formula)
      const topTechs = detectedTechs.slice(0, 4).join(', ');
      const cleanRepoName = repoData.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

      // Check JD keywords
      const jdText = jdInput.toLowerCase();
      const jdKeywordsMatched: string[] = [];
      detectedTechs.forEach(t => {
        if (jdText.includes(t.toLowerCase())) {
          jdKeywordsMatched.push(t);
        }
      });

      const bullets: string[] = [];

      // Bullet 1: Core Action & Architecture
      if (commitMessages.length > 0) {
        const sampleAction = commitMessages[0].replace(/^(feat|fix|refactor|chore)(\(.*\))?:\s*/i, '');
        bullets.push(
          `Trực tiếp kiến trúc và phát triển ${sampleAction} sử dụng ${topTechs}, tối ưu hóa hiệu năng render và cấu trúc dữ liệu.`
        );
      } else {
        bullets.push(
          `Phát triển kiến trúc ứng dụng ${cleanRepoName} với nền tảng ${topTechs}, đảm bảo tính mô-đun hóa và khả năng mở rộng cao.`
        );
      }

      // Bullet 2: Module integration & Security / Best Practice
      if (detectedRole === 'Backend Developer' || detectedTechs.some(t => t.includes('Auth') || t.includes('ORM') || t.includes('Database'))) {
        bullets.push(
          `Thiết kế RESTful APIs và chuẩn hóa luồng xác thực an toàn, quản lý truy vấn cơ sở dữ liệu và xử lý ngoại lệ đồng nhất.`
        );
      } else {
        bullets.push(
          `Xây dựng giao diện Responsive trực quan, quản lý luồng trạng thái ứng dụng đồng bộ và tối ưu hóa trải nghiệm người dùng cuối.`
        );
      }

      // Bullet 3: Impact & Evidence
      const evidenceText = commitCount > 0 ? `minh chứng qua ${commitCount}+ commits cá nhân trên GitHub` : 'mã nguồn mở được quản lý version control';
      if (jdKeywordsMatched.length > 0) {
        bullets.push(
          `Đáp ứng trọng tâm yêu cầu tuyển dụng với các công nghệ ${jdKeywordsMatched.join(', ')}, ${evidenceText}.`
        );
      } else {
        bullets.push(
          `Tối ưu hóa quy trình kiểm thử và chất lượng code, ${evidenceText} kèm bản demo thực tế hoạt động ổn định.`
        );
      }

      // Format Year
      const updateYear = repoData.updated_at ? new Date(repoData.updated_at).getFullYear().toString() : '2026';
      const createYear = repoData.created_at ? new Date(repoData.created_at).getFullYear().toString() : updateYear;

      // 5. Construct Final Project Item
      const newProject: ProjectItem = {
        id: `proj_gh_${Date.now()}`,
        projectName: cleanRepoName,
        role: targetRole || detectedRole,
        startDate: createYear,
        endDate: updateYear === createYear ? 'Hiện tại' : updateYear,
        technologies: detectedTechs,
        description: bullets.map(b => `• ${b}`).join('\n'),
        bullets: bullets,
        githubUrl: repoData.html_url || `https://github.com/${owner}/${repo}`,
        projectUrl: repoData.homepage || undefined,
        scopeType: commitCount > 0 && commitCount < 10 ? 'team' : 'solo',
        teamSize: 3,
        systemContext: repoData.description || undefined
      };

      // Import into CV
      onImportProject(newProject);

      setSuccessInfo({
        repoName: cleanRepoName,
        techCount: detectedTechs.length,
        techList: detectedTechs,
        commitCount,
        role: newProject.role
      });

      setStatusMessage(null);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Có lỗi xảy ra khi kết nối GitHub. Vui lòng kiểm tra lại link repo.');
      setStatusMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[210mm] mb-4 bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] text-white rounded-2xl shadow-md border border-blue-600/30 p-4 print:hidden transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-white">
            <Github className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">⚡ 1-Click GitHub & JD Import</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30">
                Miễn phí • Tự động bóc tách
              </span>
            </div>
            <p className="text-[11px] text-blue-100">
              Nhập link repo GitHub để hệ thống bóc tách công nghệ & commit điền thẳng vào CV trong 3 giây.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 transition"
          title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Form Body */}
      {isExpanded && (
        <form onSubmit={handleImport} className="mt-3.5 space-y-2.5">
          {/* Main Inputs Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-blue-100 mb-1">
                Link GitHub Repo <span className="text-amber-300">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="ví dụ: github.com/username/project hoặc username/project"
                  required
                  className="w-full bg-white/15 border border-white/25 focus:border-white focus:bg-white/25 rounded-xl px-3 py-2 text-xs text-white placeholder-blue-200 outline-none backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blue-100 mb-1">
                Username GitHub của bạn (Tùy chọn)
              </label>
              <input
                type="text"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                placeholder="để lọc commit cá nhân..."
                className="w-full bg-white/15 border border-white/25 focus:border-white focus:bg-white/25 rounded-xl px-3 py-2 text-xs text-white placeholder-blue-200 outline-none backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Toggle JD Input */}
          <div>
            <button
              type="button"
              onClick={() => setShowJdBox(!showJdBox)}
              className="text-[11px] font-semibold text-blue-100 hover:text-white flex items-center gap-1 transition"
            >
              <span>{showJdBox ? '▼ Ẩn phần dán JD' : '▶ Dán nội dung JD tuyển dụng (Để AI may đo mô tả theo từ khóa)'}</span>
            </button>

            {showJdBox && (
              <div className="mt-1.5">
                <textarea
                  value={jdInput}
                  onChange={(e) => setJdInput(e.target.value)}
                  rows={3}
                  placeholder="Dán nội dung yêu cầu công việc (JD) vào đây: ví dụ yêu cầu React, TypeScript, REST API..."
                  className="w-full bg-white/15 border border-white/25 focus:border-white focus:bg-white/25 rounded-xl p-2.5 text-xs text-white placeholder-blue-200 outline-none resize-none backdrop-blur-sm"
                />
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/15">
            <div className="flex items-center gap-2 text-[11px] text-blue-100">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Tự bóc tách <code className="text-white bg-white/20 px-1 py-0.5 rounded font-mono">package.json</code> + Commits + STAR Bullets</span>
            </div>

            <button
              type="submit"
              disabled={loading || !repoInput.trim()}
              className="px-4 py-2 bg-white hover:bg-blue-50 text-[#1e3a8a] disabled:opacity-50 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                  <span>{statusMessage || 'Đang xử lý...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Phân tích & Tự Điền Vào CV Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successInfo && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">Đã thêm dự án: {successInfo.repoName}</span>
                  <span className="text-emerald-300 ml-2">({successInfo.role})</span>
                  <div className="text-[11px] text-emerald-400 mt-0.5">
                    Đã nhận diện: {successInfo.techList.join(', ')} {successInfo.commitCount > 0 ? `• ${successInfo.commitCount} commits` : ''}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-900/60 px-2 py-1 rounded-lg">
                ✓ Đã chèn vào bảng vẽ CV bên dưới
              </span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
