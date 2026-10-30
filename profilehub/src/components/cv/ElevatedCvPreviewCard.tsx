import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, QrCode, Github, ExternalLink, Code2 } from 'lucide-react';

export interface ElevatedCvPreviewCardProps {
  templateName: string;
  primaryColor: string;
  candidateName?: string;
  roleTitle?: string;
  columns?: '1-col' | '2-col';
  atsScore?: number;
  verifiedProjectsCount?: number;
  compact?: boolean;
  className?: string;
  showGlow?: boolean;
}

export const ElevatedCvPreviewCard: React.FC<ElevatedCvPreviewCardProps> = ({
  templateName,
  primaryColor,
  candidateName = 'NGUYỄN VĂN AN',
  roleTitle = 'Kỹ Sư Phần Mềm Fullstack • Fresher / Junior',
  columns = '1-col',
  atsScore = 98,
  verifiedProjectsCount = 2,
  compact = false,
  className = '',
  showGlow = true
}) => {
  // Hiệu ứng nhún nhẹ (subtle scale dip) khi đổi màu hoặc đổi mẫu
  const [isDipping, setIsDipping] = useState(false);

  useEffect(() => {
    setIsDipping(true);
    const timer = setTimeout(() => setIsDipping(false), 260);
    return () => clearTimeout(timer);
  }, [templateName, primaryColor, columns]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 1. Nền quầng sáng Ambient Glow phía sau */}
      {showGlow && (
        <div 
          className="absolute w-64 sm:w-80 h-80 sm:h-96 rounded-full blur-3xl opacity-20 dark:opacity-25 pointer-events-none transition-all duration-700 ease-out"
          style={{ backgroundColor: primaryColor }}
        />
      )}

      {/* 2. TỜ GIẤY CV A4 NỔI BỔNG 2D SIÊU NÉT (Tỷ lệ chuẩn 1 : 1.414) */}
      <div 
        className={`cv-paper-elevated cv-shimmer-effect relative w-full ${
          compact ? 'max-w-[310px]' : 'max-w-[340px] sm:max-w-[380px]'
        } aspect-[1/1.414] bg-white dark:bg-[#0c101c] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
          isDipping ? 'cv-spring-dip' : ''
        }`}
      >
        {/* Góc trên: Huy hiệu ATS & Proof-of-Work Verified */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[9.5px] sm:text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
            <span>Chuẩn ATS: {atsScore}%</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[9.5px] sm:text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck size={11} className="text-indigo-600 dark:text-indigo-400" />
            <span>{verifiedProjectsCount} Đồ Án Verified</span>
          </div>
        </div>

        {/* Thân CV: Mô phỏng bố cục A4 sắc nét */}
        <div className="space-y-3 my-auto">
          {/* Header CV */}
          <div className="border-b border-slate-800/80 dark:border-slate-700 pb-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans uppercase">
                {candidateName}
              </h4>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
            </div>
            <div 
              className="text-[10.5px] sm:text-[11.5px] font-bold mt-0.5 tracking-wide line-clamp-1"
              style={{ color: primaryColor }}
            >
              {roleTitle}
            </div>
            <p className="text-[9px] sm:text-[9.5px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              TP. Hồ Chí Minh • an.nguyen@email.com • github.com/annguyen
            </p>
          </div>

          {/* Cấu trúc Bố cục 1 Cột hoặc 2 Cột */}
          {columns === '2-col' ? (
            <div className="grid grid-cols-12 gap-2 text-left">
              {/* Cột trái (4/12) */}
              <div className="col-span-4 space-y-2 border-r border-slate-100 dark:border-slate-800 pr-1.5">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    KỸ NĂNG
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['React', 'Node.js', 'PostgreSQL', 'Docker'].map((sk) => (
                      <span 
                        key={sk}
                        className="text-[8px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    HỌC VẤN
                  </div>
                  <div className="text-[8.5px] font-bold text-slate-800 dark:text-slate-200">ĐH Quốc Gia TP.HCM</div>
                  <div className="text-[7.5px] text-slate-500">GPA: 3.65 / 4.0</div>
                </div>
              </div>

              {/* Cột phải (8/12) */}
              <div className="col-span-8 space-y-2">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>ĐỒ ÁN TIÊU BIỂU</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[8px] font-bold">🛡️ Verified</span>
                </div>

                <div className="p-2 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#131b2e] space-y-1">
                  <div className="text-[9.5px] font-bold text-slate-900 dark:text-white line-clamp-1">
                    E-Commerce High Throughput
                  </div>
                  <p className="text-[8px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    Xây dựng hệ thống đặt hàng Microservices, giảm 42% latency phản hồi API (từ 380ms xuống 68ms).
                  </p>
                  <div className="flex gap-1 pt-0.5">
                    <span className="text-[7.5px] px-1 py-0.2 rounded bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800">
                      Kafka
                    </span>
                    <span className="text-[7.5px] px-1 py-0.2 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                      Redis
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 1 Cột (Harvard Standard) */
            <div className="space-y-2 text-left">
              <div>
                <div className="text-[9.5px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-0.5 mb-1.5 flex items-center justify-between">
                  <span>ĐỒ ÁN KỸ THUẬT TIÊU BIỂU (PROOF-OF-WORK)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[8.5px] font-bold">🛡️ Giảng viên duyệt</span>
                </div>

                {/* Card Đồ Án */}
                <div className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#131b2e] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[10.5px] font-bold text-slate-900 dark:text-white">
                      Hệ Thống Đặt Hàng & Microservices
                    </span>
                    <span className="text-[8.5px] font-mono text-slate-500">03/2026 – 08/2026</span>
                  </div>

                  <p className="text-[8.5px] sm:text-[9px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    • Tái cấu trúc cơ sở dữ liệu PostgreSQL và B-tree Index, 
                    <strong className="text-indigo-900 dark:text-indigo-300 font-semibold"> giảm 42% thời gian phản hồi API</strong> (từ 380ms xuống 68ms).
                  </p>

                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 font-medium">
                      React
                    </span>
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 font-medium">
                      Golang
                    </span>
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 font-medium">
                      Docker
                    </span>
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 font-bold ml-auto flex items-center gap-0.5">
                      <Code2 size={9} />
                      <span>24 commits</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Dòng vạch chuẩn A4 */}
              <div className="pt-1.5 flex items-center justify-between text-[8px] sm:text-[8.5px] text-slate-400 font-mono">
                <span>✓ Page Budget: 94% (Vừa vặn 1 trang A4)</span>
                <span className="flex items-center gap-1">
                  <QrCode size={10} className="text-slate-400" />
                  <span>Smart QR</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chân CV: Tên mẫu & Kích cỡ chuẩn A4 */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] sm:text-[9.5px] text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <span 
              className="w-2 h-2 rounded-full inline-block shadow-2xs" 
              style={{ backgroundColor: primaryColor }}
            />
            <span className="text-slate-700 dark:text-slate-300 font-bold">{templateName}</span>
          </div>
          <span>Bản in A4 • 210 × 297 mm</span>
        </div>
      </div>
    </div>
  );
};

export default ElevatedCvPreviewCard;
