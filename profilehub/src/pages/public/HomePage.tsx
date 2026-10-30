import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Github, ShieldCheck, CheckCircle2, 
  XCircle, FileText, QrCode, Laptop, Code2, Award, Zap,
  ExternalLink, Layers, ChevronRight
} from 'lucide-react';
import { CORE_PILLARS, BEFORE_AFTER_COMPARISON, TRUST_METRICS } from './homePageData';

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
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle Background Mesh Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge thông báo sản phẩm */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-8 shadow-2xs hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 transition cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span>ProfileHub v1.0 — Nền tảng tạo CV dựa trên bằng chứng & đồ án thực chiến</span>
          </div>

          {/* Tiêu đề chính (Headline) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.15]">
            Xây Dựng Thương Hiệu Nghề Nghiệp Dựa Trên{' '}
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
              Bằng Chứng Thực Chiến
            </span>
          </h1>

          {/* Mô tả phụ (Subheadline) */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Tuyệt đối không bịa số liệu ảo. Bóc tách 1-click từ GitHub Repo, chuẩn hóa câu văn STAR kỹ thuật, 
            khống chế vừa vặn 1 trang A4 và trang bị bản lĩnh phòng thủ trước Tech Lead.
          </p>

          {/* Cụm nút hành động chính (Dual CTA) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/cv-management"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform" />
              <span>Bắt Đầu Tạo CV Ngay — Miễn Phí</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/my-projects"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-[#111728] hover:bg-slate-50 dark:hover:bg-[#161f36] text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Github className="w-4 h-4 text-slate-800 dark:text-slate-200" />
              <span>Khám Phá Showcase Đồ Án Mẫu</span>
            </Link>
          </div>

          {/* Dải cam kết (Trust Metrics Bar) */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {TRUST_METRICS.map((metric) => (
              <div 
                key={metric.label}
                className="p-4 rounded-2xl bg-white/80 dark:bg-[#111728]/80 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 shadow-2xs text-left transition-colors"
              >
                <div className="text-xl sm:text-2xl font-extrabold text-indigo-700 dark:text-indigo-400">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {metric.label}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {metric.subtext}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT MOCKUP PREVIEW */}
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
              Không còn những biểu mẫu điền thông tin dài dòng. Trải nghiệm chỉnh sửa trực tiếp trên bản in A4 với sự đồng hành của AI Coach.
            </p>
          </div>

          {/* Browser Window Mockup */}
          <div className="rounded-3xl border border-slate-300/80 dark:border-slate-800 bg-white dark:bg-[#0f1523] shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden max-w-5xl mx-auto transition-colors">
            
            {/* Window Header with 2D Interactive Controls */}
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
                  <span>ATS: 98% • 2D Elevated</span>
                </div>
              </div>
            </div>

            {/* Window Body: 2 Cột Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-8 gap-6 bg-slate-50/50 dark:bg-[#090d16] transition-colors">
              
              {/* Bên Trái: Bản CV Mô Phỏng 2D Nổi Bổng Sắc Nét (8 cột) */}
              <div className="lg:col-span-8 relative">
                {/* Quầng sáng Ambient Glow phía sau */}
                <div 
                  className="absolute -inset-2 sm:-inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none transition-all duration-700 ease-out"
                  style={{ backgroundColor: activePalette.hex }}
                />

                <div 
                  key={`${demoLayout}-${activePalette.id}`}
                  className={`cv-paper-elevated cv-shimmer-effect ${
                    isDipping ? 'cv-spring-dip' : ''
                  } relative bg-white dark:bg-[#0c101c] p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 text-left font-serif text-slate-800 dark:text-slate-100 transition-all duration-300`}
                >
                  {/* Top Bar Badges */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300 font-sans">
                      <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Chuẩn ATS Harvard: 98/100</span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[10.5px] font-bold text-indigo-700 dark:text-indigo-300 font-sans">
                      <ShieldCheck size={12} className="text-indigo-600 dark:text-indigo-400" />
                      <span>Đã Kiểm Chứng Mã Nguồn GitHub</span>
                    </div>
                  </div>

                  {/* Header CV */}
                  <div className="border-b-2 pb-3 mb-4" style={{ borderColor: activePalette.hex }}>
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        NGUYỄN VĂN AN
                      </h4>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        A4 Single-Page Spec
                      </span>
                    </div>
                    <p 
                      className="text-xs font-bold font-sans mt-0.5 tracking-wide"
                      style={{ color: activePalette.hex }}
                    >
                      Kỹ Sư Phần Mềm Fullstack • Fresher / Junior
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-sans mt-1">
                      an.nguyen@email.com • 0912 345 678 • github.com/annguyen • TP. Hồ Chí Minh
                    </p>
                  </div>

                  {/* Layout Render: 1-col or 2-col */}
                  {demoLayout === '1-col' ? (
                    /* 1-Column Harvard Layout */
                    <div className="space-y-4">
                      {/* Section Đồ Án */}
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1 mb-2.5 font-sans flex items-center justify-between">
                          <span>ĐỒ ÁN & DỰ ÁN KỸ THUẬT TIÊU BIỂU</span>
                          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            🛡️ Giảng viên duyệt mã nguồn
                          </span>
                        </h5>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between font-sans">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Hệ Thống Thương Mại Điện Tử & Đặt Hàng Trực Tuyến
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">03/2026 – 08/2026</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 font-sans py-0.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              👥 Đồ án nhóm (4 thành viên)
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                              🔗 GitHub: 24 Commits chính
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              ⚡ Live Demo sẵn sàng
                            </span>
                          </div>

                          <ul className="list-disc list-outside ml-4 text-[11px] space-y-1.5 leading-relaxed text-slate-700 dark:text-slate-300 font-sans">
                            <li>
                              Thiết kế kiến trúc Database PostgreSQL và xây dựng hệ thống Index B-tree, 
                              <strong className="font-semibold" style={{ color: activePalette.hex }}> giảm 42% thời gian phản hồi API (từ 380ms xuống 68ms)</strong> đo lường bằng Apache Bench.
                            </li>
                            <li>
                              Tích hợp Redis Caching cho giỏ hàng và danh mục sản phẩm, duy trì throughput ổn định 1,200 req/s với tỷ lệ lỗi 0.01%.
                            </li>
                            <li>
                              Thiết lập bộ kiểm thử tự động với Vitest, đạt <strong className="font-semibold" style={{ color: activePalette.hex }}>91% code coverage</strong> cho toàn bộ luồng thanh toán.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 2-Column Tech Modern Layout */
                    <div className="grid grid-cols-12 gap-4 text-left font-sans">
                      {/* Sub-column Left: Sidebar (4 cols) */}
                      <div className="col-span-4 space-y-3.5 border-r border-slate-200 dark:border-slate-800 pr-3">
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
                            <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-bold">Verified Codebase</span>
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
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
