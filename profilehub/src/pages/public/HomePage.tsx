import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Github, ShieldCheck, CheckCircle2, 
  XCircle, FileText, QrCode, Laptop, Code2, Award, Zap,
  ExternalLink, Layers, ChevronRight, Briefcase, Users, MessageSquare, Flame
} from 'lucide-react';
import { CORE_PILLARS, BEFORE_AFTER_COMPARISON, TRUST_METRICS } from './homePageData';
import Interactive3DTiltCard from '../../components/3d/Interactive3DTiltCard';

const DEMO_PALETTES = [
  { id: 'indigo', name: 'Tech Indigo', hex: '#4f46e5', badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60', textClass: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'navy', name: 'Classic Navy', hex: '#1e3a8a', badgeBg: 'bg-blue-50 dark:bg-blue-950/60', textClass: 'text-blue-700 dark:text-blue-400' },
  { id: 'emerald', name: 'Emerald Pro', hex: '#059669', badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60', textClass: 'text-emerald-700 dark:text-emerald-400' },
  { id: 'rose', name: 'Ruby Focus', hex: '#e11d48', badgeBg: 'bg-rose-50 dark:bg-rose-950/60', textClass: 'text-rose-600 dark:text-rose-400' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activePalette, setActivePalette] = useState(DEMO_PALETTES[0]);
  const [demoLayout, setDemoLayout] = useState<'1-col' | '2-col'>('1-col');
  const [isDipping, setIsDipping] = useState(false);

  const handleSwitchPalette = (palette: typeof DEMO_PALETTES[0]) => {
    setIsDipping(true);
    setActivePalette(palette);
    setTimeout(() => setIsDipping(false), 260);
  };

  const handleSwitchLayout = (layout: '1-col' | '2-col') => {
    setIsDipping(true);
    setDemoLayout(layout);
    setTimeout(() => setIsDipping(false), 260);
  };

  return (
    <div className="w-full bg-slate-50/60 dark:bg-[#090d16] font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-950 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors duration-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        {/* Background Mesh Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Badge thông báo sản phẩm */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 transition cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span>ProfileHub v1.0 — Nền tảng tạo CV dựa trên bằng chứng & đồ án thực chiến</span>
          </div>

          {/* Tiêu đề chính (Headline) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-4xl mx-auto">
            Xây Dựng Thương Hiệu Nghề Nghiệp Dựa Trên{' '}
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
              Bằng Chứng Thực Chiến
            </span>
          </h1>

          {/* Mô tả phụ (Subheadline) */}
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Tuyệt đối không bịa số liệu ảo. Bóc tách 1-click từ GitHub Repo, chuẩn hóa câu văn STAR kỹ thuật, 
            khống chế vừa vặn 1 trang A4 và trang bị bản lĩnh phòng thủ trước Tech Lead.
          </p>

          {/* Cụm nút hành động chính (Triple Action CTAs) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/cv-management"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform" />
              <span>Bắt Đầu Tạo CV — Miễn Phí</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/feed"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Dòng Tin Việc Làm & Đồ Án</span>
            </Link>

            <Link
              to="/showcase"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-[#111728] hover:bg-slate-50 dark:hover:bg-[#161f36] text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Github className="w-4 h-4 text-slate-800 dark:text-slate-200" />
              <span>Showcase Đồ Án</span>
            </Link>
          </div>

          {/* Dải cam kết (Trust Metrics Bar với Subtle 3D Tilt) */}
          <div className="pt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {TRUST_METRICS.map((metric) => (
              <Interactive3DTiltCard key={metric.label} maxTilt={6} className="rounded-2xl">
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#111728]/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 shadow-2xs text-left transition-colors h-full flex flex-col justify-between">
                  <div>
                    <div className="text-xl font-black text-indigo-700 dark:text-indigo-400">
                      {metric.value}
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {metric.label}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {metric.subtext}
                  </div>
                </div>
              </Interactive3DTiltCard>
            ))}
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT MOCKUP PREVIEW (CÓ HIỆU ỨNG 3D TILT KHI HOVER) */}
      <section className="py-12 sm:py-20 border-y border-slate-200/70 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-[#090d16] dark:to-[#0c101c] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Studio Soạn Thảo Thế Hệ Mới
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Biên Tập Trực Quan, Khám Sức Khỏe CV Theo Thời Gian Thực
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Di chuột lên bản CV A4 để trải nghiệm góc nghiêng 3D thực tế và bộ thử màu sắc nét.
            </p>
          </div>

          {/* Browser Window Mockup */}
          <div className="rounded-3xl border border-slate-300/80 dark:border-slate-800 bg-white dark:bg-[#0f1523] shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden max-w-5xl mx-auto transition-colors">
            
            {/* Window Header with Interactive Controls */}
            <div className="bg-slate-100 dark:bg-[#0c101c] border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                {/* Layout Mode Toggles */}
                <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg text-[10.5px] font-bold">
                  <button
                    type="button"
                    onClick={() => handleSwitchLayout('1-col')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      demoLayout === '1-col'
                        ? 'bg-white dark:bg-[#111728] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    1 Cột (Harvard ATS)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchLayout('2-col')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      demoLayout === '2-col'
                        ? 'bg-white dark:bg-[#111728] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    2 Cột (Tech Modern)
                  </button>
                </div>
              </div>

              {/* Color Swatches & Live AI Score */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white dark:bg-[#161f36] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bảng Màu:</span>
                  {DEMO_PALETTES.map((palette) => (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => handleSwitchPalette(palette)}
                      title={palette.name}
                      className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                        activePalette.id === palette.id
                          ? 'ring-2 ring-offset-1 ring-slate-700 dark:ring-slate-300 scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: palette.hex }}
                    />
                  ))}
                </div>

                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>3D Tilt Ready • ATS: 98%</span>
                </div>
              </div>
            </div>

            {/* Window Body: 2 Cột Preview với Hiệu Ứng 3D Tilt Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-8 gap-6 bg-slate-50/50 dark:bg-[#090d16] transition-colors">
              
              {/* Bên Trái: Bản CV Mô Phỏng 3D Tilt (8 cột) */}
              <div className="lg:col-span-8 relative">
                {/* Quầng sáng Ambient Glow phía sau */}
                <div 
                  className="absolute -inset-2 sm:-inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none transition-all duration-700 ease-out"
                  style={{ backgroundColor: activePalette.hex }}
                />

                <Interactive3DTiltCard maxTilt={6} scale={1.01}>
                  <div 
                    key={`${demoLayout}-${activePalette.id}`}
                    className={`cv-paper-elevated relative bg-white dark:bg-[#0c101c] p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 text-left font-serif text-slate-800 dark:text-slate-100 shadow-xl transition-all duration-300`}
                  >
                    {/* Top Bar Badges */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300 font-sans">
                        <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Chuẩn ATS Harvard: 98/100</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[10.5px] font-bold text-indigo-700 dark:text-indigo-300 font-sans">
                        <ShieldCheck size={12} className="text-indigo-600 dark:text-indigo-400" />
                        <span>Proof-of-Work: Live Demo & GitHub</span>
                      </div>
                    </div>

                    {/* Header Profile Name */}
                    <div className="mb-4">
                      <h3 
                        className="text-xl sm:text-2xl font-black tracking-tight"
                        style={{ color: activePalette.hex }}
                      >
                        NGUYỄN MINH TRIẾT
                      </h3>
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-sans mt-0.5">
                        Fullstack Software Engineer • Next.js, Go, Distributed Systems
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-sans mt-1 flex flex-wrap gap-2">
                        <span>tp.hcm@profilehub.dev</span>
                        <span>•</span>
                        <span>github.com/trietnguyen-dev</span>
                        <span>•</span>
                        <span>linkedin.com/in/trietnguyen</span>
                      </div>
                    </div>

                    {/* Tóm tắt mục tiêu (Summary) */}
                    <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                        TÓM TẮT CHUYÊN MÔN
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-sans">
                        Kỹ sư phần mềm 1+ năm kinh nghiệm thực chiến với React 18, TypeScript, Golang. Trực tiếp thiết kế hệ thống xử lý 25,000 tasks/phút, đam mê tối ưu kiến trúc và trải nghiệm người dùng tốc độ cao.
                      </p>
                    </div>

                    {/* Layout Render Body: 1 Cột hoặc 2 Cột */}
                    {demoLayout === '1-col' ? (
                      <div className="space-y-4">
                        {/* Đồ án tiêu biểu */}
                        <div>
                          <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                            <span>ĐỒ ÁN PHẦN MỀM TIÊU BIỂU</span>
                            <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-bold">Proof-of-Work Verified</span>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                              <span>ProfileHub AI ATS Studio (React 18, TypeScript, Tailwind)</span>
                              <span className="text-[10px] text-slate-500 font-mono">03/2026 – Hiện tại</span>
                            </div>
                            <ul className="list-disc list-outside ml-3.5 text-[11px] space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                              <li>
                                Thiết kế engine xuất in A4 2D không bị bay màu bằng CSS <code className="text-[10px] px-1 bg-slate-100 dark:bg-slate-800 rounded">print-color-adjust</code>, đạt <strong style={{ color: activePalette.hex }}>100% độ sắc nét vector</strong>.
                              </li>
                              <li>
                                Tích hợp cơ chế STAR Diff Review so sánh phiên bản, nâng điểm số ATS trung bình của ứng viên từ 62 lên 94 điểm.
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Kỹ năng kỹ thuật */}
                        <div>
                          <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1">
                            KỸ NĂNG CỐT LÕI
                          </div>
                          <div className="text-[11px] text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                            <strong>Ngôn ngữ:</strong> TypeScript, Go, Python, SQL, C++ • <strong>Frontend:</strong> React 18, Next.js, Three.js, Tailwind CSS • <strong>Backend & Cloud:</strong> Docker, PostgreSQL, Supabase, Redis, AWS EC2.
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 2 Cột */
                      <div className="grid grid-cols-12 gap-4 font-sans">
                        {/* Sub-column Left: Sidebar (4 cols) */}
                        <div className="col-span-4 border-r border-slate-100 dark:border-slate-800/80 pr-3 space-y-3">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                              KỸ NĂNG CỐT LÕI
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'].map((sk) => (
                                <span key={sk} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                              HỌC VẤN & BẢNG ĐIỂM
                            </div>
                            <div className="text-[11px] font-bold text-slate-900 dark:text-white">Đại Học Bách Khoa</div>
                            <div className="text-[10px] text-slate-500">Kỹ Thuật Phần Mềm</div>
                            <div className="text-[10px] font-mono font-bold mt-0.5" style={{ color: activePalette.hex }}>GPA: 3.65 / 4.0</div>
                          </div>

                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5">
                              CHỨNG CHỈ XÁC THỰC
                            </div>
                            <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-300">
                              <div>• AWS Certified Cloud Practitioner</div>
                              <div>• IELTS Academic 7.5</div>
                            </div>
                          </div>
                        </div>

                        {/* Sub-column Right: Main Content (8 cols) */}
                        <div className="col-span-8 space-y-3 pl-1">
                          <div>
                            <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                              <span>ĐỒ ÁN PHẦN MỀM TIÊU BIỂU</span>
                              <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-bold">Proof-of-Work</span>
                            </div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              Microservices Platform & Task Dispatcher
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mb-1">01/2026 – Hiện tại</div>
                            <ul className="list-disc list-outside ml-3.5 text-[11px] space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                              <li>
                                Phát triển message queue với Kafka và Go worker, xử lý <strong style={{ color: activePalette.hex }}>25,000 tasks/phút</strong> không nghẽn cổ chai.
                              </li>
                              <li>
                                Áp dụng kiến trúc Clean Architecture, giảm 50% thời gian onboard cho thành viên mới.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vạch ngắt trang A4 */}
                    <div className="mt-6 pt-3 border-t-2 border-dashed border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between text-[10px] text-indigo-700 dark:text-indigo-400 font-sans font-bold bg-indigo-50/50 dark:bg-indigo-950/30 p-2 rounded-lg">
                      <span>--- Vạch ngắt trang A4 (Nội dung vừa vặn 100% trong 1 trang in) ---</span>
                      <span className="flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Mã QR Demo: 28px</span>
                      </span>
                    </div>
                  </div>
                </Interactive3DTiltCard>

              </div>

              {/* Bên Phải: Thẻ AI Coach Đột Phá (4 cột) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Card Chấm Điểm ATS */}
                <div className="bg-white dark:bg-[#111728] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-left transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Điểm Sức Khỏe ATS</span>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                      96 / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#161f36] rounded-full h-2 mb-3">
                    <div className="bg-emerald-500 h-2 rounded-full w-[96%]" />
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    CV của bạn đã đạt cấu trúc STAR hoàn chỉnh, có số liệu kỹ thuật thực tế và liên kết mã nguồn đối chứng.
                  </p>
                </div>

                {/* Card Thao Tác 1-Click */}
                <div className="bg-white dark:bg-[#111728] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-left space-y-2.5 transition-colors">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Thao Tác 1-Click Nội Tuyến
                  </span>

                  <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-indigo-950/40 border border-blue-200/70 dark:border-indigo-900/60 text-xs">
                    <div className="font-bold text-blue-900 dark:text-indigo-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
                      <span>✨ Chuẩn Hóa STAR</span>
                    </div>
                    <p className="text-[11px] text-blue-800 dark:text-slate-400 mt-0.5">
                      Tự động bổ sung động từ hành động kỹ thuật.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 text-xs">
                    <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>⚡ 1-Click Rút Gọn A4</span>
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-slate-400 mt-0.5">
                      Co vừa 1 trang giấy mà không làm mất từ khóa.
                    </p>
                  </div>
                </div>

                {/* Card Phòng Thủ Tech Lead */}
                <div className="bg-slate-900 dark:bg-[#111728] text-white p-5 rounded-2xl shadow-xs text-left border border-slate-800 dark:border-slate-800 transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Project Technical Defense</span>
                  </div>
                  <p className="text-[11px] text-slate-300 dark:text-slate-400 leading-normal">
                    Hệ thống đã chuẩn bị sẵn 3 câu hỏi xoáy về Redis Caching & PostgreSQL Indexing để bạn tự tin trả lời phỏng vấn.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2.5. SPOTLIGHT NGHỀ NGHIỆP & CỘNG ĐỒNG */}
      <section className="py-16 bg-white dark:bg-[#0b101d] border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800/80">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Nhịp Đập Cộng Đồng & Việc Làm Hot</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Cơ Hội Nghề Nghiệp Thực Chiến Đang Chờ Bạn
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Khám phá các vị trí Fresher/Junior có dải lương minh bạch và các đồ án tiêu biểu được cộng đồng chia sẻ.
              </p>
            </div>
            <Link
              to="/feed"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all self-start md:self-auto cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Xem Toàn Bộ Dòng Tin Cộng Đồng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Spotlight Card 1 */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 text-left hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Việc Làm Hot
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">14 - 18 Triệu</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Frontend ReactJS Fresher</h4>
              <p className="text-xs text-slate-500 mb-3">VNG Corporation • TP.HCM (Hybrid)</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                Tìm kiếm 03 bạn Fresher Frontend đam mê xây dựng giao diện hiệu năng cao 60fps cho khối ZaloPay.
              </p>
              <Link
                to="/feed"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Xem tin & Ứng tuyển 1-click</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Spotlight Card 2 */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 text-left hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  Đồ Án Nổi Bật
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Live Demo</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Web 3D Medical Diagnostic Viewer</h4>
              <p className="text-xs text-slate-500 mb-3">Lê Quỳnh Nga • React Three Fiber</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                Ứng dụng 3D kết hợp AI phân tích ảnh X-quang, mã nguồn mở trên GitHub kèm bản kiểm thử hoàn chỉnh.
              </p>
              <Link
                to="/feed"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Xem trải nghiệm đồ án</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Spotlight Card 3 */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 text-left hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Kinh Nghiệm IT
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tips Phỏng Vấn</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Bí Quyết Trả Lời Vòng Code Defense</h4>
              <p className="text-xs text-slate-500 mb-3">Phạm Thanh Hà • Head of Engineering</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                Công thức 3 bước chuẩn ghi điểm khi Tech Lead hỏi sâu về lý do lựa chọn kiến trúc và phân tích Trade-off.
              </p>
              <Link
                to="/feed"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Đọc bài thảo luận</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS BENTO GRID (4 TRỤ CỘT CỐT LÕI) */}
      <section id="features" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Tại Sao Chọn ProfileHub
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            4 Trụ Cột Đột Phá Khác Biệt Cho Dân Công Nghệ
          </h3>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Chúng tôi xây dựng giải pháp thực chiến giải quyết triệt để 3 nỗi sợ: rớt từ vòng gửi xe, quên CV đã nộp và bị vạch trần ở vòng phỏng vấn kỹ thuật.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CORE_PILLARS.map((pillar) => (
            <div 
              key={pillar.id}
              className="p-8 rounded-3xl bg-white dark:bg-[#111728] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group hover:border-indigo-300 dark:hover:border-indigo-500/50"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${pillar.badgeColor}`}>
                    {pillar.badge}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {pillar.title}
                </h4>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                  {pillar.headline}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <ul className="space-y-2">
                  {pillar.details.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 4. BEFORE / AFTER COMPARISON SECTION */}
      <section id="about" className="py-16 sm:py-24 bg-slate-100/70 dark:bg-[#0c101c] border-t border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Đối Chiếu Giá Trị
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              CV Truyền Thống vs CV Dựa Trên Bằng Chứng
            </h3>
          </div>

          <div className="bg-white dark:bg-[#111728] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-900 dark:bg-[#070b14] text-white font-bold text-xs p-4">
              <div className="md:col-span-3 text-slate-400">Tiêu Chí So Sánh</div>
              <div className="md:col-span-4 text-rose-300 flex items-center gap-1.5 mt-2 md:mt-0">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>CV Truyền Thống (Nói Suông)</span>
              </div>
              <div className="md:col-span-5 text-emerald-300 flex items-center gap-1.5 mt-2 md:mt-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>CV ProfileHub (Bằng Chứng Thực Tế)</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {BEFORE_AFTER_COMPARISON.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 gap-3 hover:bg-slate-50/60 dark:hover:bg-[#151e33] transition">
                  <div className="md:col-span-3 font-bold text-slate-900 dark:text-slate-100">
                    {row.criterion}
                  </div>
                  <div className="md:col-span-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {row.conventional}
                  </div>
                  <div className="md:col-span-5 text-slate-900 dark:text-emerald-200 font-medium bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100/70 dark:border-emerald-900/50 leading-relaxed">
                    {row.profileHub}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 dark:from-[#080d1a] dark:via-[#0c1428] dark:to-[#151b3b] text-white p-8 sm:p-16 text-center shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-transparent dark:border-indigo-500/20 relative overflow-hidden transition-all">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 inline-block mb-4">
              Khởi Đầu Sự Nghiệp Vững Chắc
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Sẵn Sàng Biến Đồ Án Của Bạn Thành Lời Mời Phỏng Vấn?
            </h3>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Bảo vệ dữ liệu vĩnh viễn trên Supabase Cloud. Bắt đầu ngay, quản lý đồ án thật và sở hữu bản CV chuẩn ATS hoàn hảo trong 2 phút.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/cv-management"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Bắt Đầu Tạo CV Đầu Tiên</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/feed"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Users className="w-4 h-4 text-indigo-300" />
                <span>Khám Phá Bảng Tin Việc Làm & Đồ Án</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
