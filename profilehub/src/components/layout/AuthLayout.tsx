import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  heading?: string;
  subheading?: string;
  pageType?: 'login' | 'register';
}

export default function AuthLayout({
  children,
  heading = 'Khởi đầu sự nghiệp từ những sản phẩm thật của bạn.',
  subheading = 'Tập hợp các đồ án thực tế, tự động may đo CV phù hợp theo từng công việc và tự tin bước vào mọi buổi phỏng vấn.',
  pageType = 'login',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600/20 selection:text-blue-600">
      
      {/* =========================================================================
          CỘT TRÁI: ĐƠN GIẢN, TINH TẾ, THOÁNG MẮT (CONSUMER & DEVELOPER FRIENDLY)
          ========================================================================= */}
      <div className="relative w-full lg:w-[46%] xl:w-[48%] bg-[#0c1222] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/60">
        
        {/* Ánh sáng mờ nhẹ nhàng phía sau (Ambient Glow dịu mắt) */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Logo & Nút về Trang Chủ */}
        <div className="relative z-10 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 -m-1"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                ProfileHub
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Career Platform</p>
            </div>
          </Link>

          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5 border border-white/5"
          >
            <ArrowLeft size={13} />
            <span>Trang Chủ</span>
          </Link>
        </div>

        {/* Nội dung chính: Đơn giản, truyền cảm hứng, không cầu kỳ bảng biểu */}
        <div className="relative z-10 my-10 lg:my-auto max-w-lg">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-medium mb-5">
            <Sparkles size={13} className="text-blue-400" />
            <span>Nền tảng hồ sơ & CV thế hệ mới</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight mb-4">
            {heading}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
            {subheading}
          </p>

          {/* 3 Gạch đầu dòng tinh giản, dễ hiểu */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-snug">
                <strong className="text-white font-medium">May đo CV theo từng vị trí:</strong> Tự động điều chỉnh hồ sơ khớp với từ khóa và yêu cầu của JD.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={13} className="text-blue-400" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-snug">
                <strong className="text-white font-medium">Lưu trữ đồ án thực tế:</strong> Quản lý mã nguồn, link demo và sản phẩm của bạn ở một nơi an toàn.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={13} className="text-indigo-400" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-snug">
                <strong className="text-white font-medium">Tự tin phỏng vấn:</strong> AI hỗ trợ gợi ý câu hỏi bẫy đồ án và cách trả lời chuẩn STAR.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Cột Trái: Nhẹ nhàng, kín đáo */}
        <div className="relative z-10 pt-6 border-t border-slate-800/60 text-xs text-slate-500 flex items-center justify-between">
          <span>© 2026 ProfileHub. Đồng hành cùng bạn.</span>
          <span>Bảo mật • Đáng tin cậy</span>
        </div>

      </div>

      {/* =========================================================================
          CỘT PHẢI: FORM CHÍNH (GIAO DIỆN HIỆN ĐẠI, THOÁNG ĐÃNG)
          ========================================================================= */}
      <div className="w-full lg:w-[54%] xl:w-[52%] flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 bg-white dark:bg-[#070b14]">
        <div className="w-full max-w-[430px]">
          {children}
        </div>
      </div>

    </div>
  );
}
