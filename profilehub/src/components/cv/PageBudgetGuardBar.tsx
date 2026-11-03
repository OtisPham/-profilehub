import React, { useMemo, useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Maximize2, 
  Minimize2, 
  Info,
  Check
} from 'lucide-react';
import { pageBudgetService } from '../../services/pageBudgetService';
import type { 
  PageBudgetGuardBarProps, 
  SpacingDensity 
} from '../../types/pageBudget.types';

export const PageBudgetGuardBar: React.FC<PageBudgetGuardBarProps> = ({
  sections,
  personalInfo,
  spacingDensity,
  onDensityChange,
  onApplyAutoCondense
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [condenseNotice, setCondenseNotice] = useState<string | null>(null);

  // Tính toán dung lượng trang A4 theo thời gian thực
  const metrics = useMemo(() => {
    return pageBudgetService.calculatePageBudget(sections, personalInfo, spacingDensity);
  }, [sections, personalInfo, spacingDensity]);

  const handleAutoCondense = () => {
    const result = pageBudgetService.autoCondenseCvContent(sections);
    if (result.charactersSaved > 0) {
      onApplyAutoCondense(result.sections, result.charactersSaved);
      setCondenseNotice(`Đã Tối Ưu ${result.charactersSaved} Ký Tự Rườm Rà!`);
      setTimeout(() => setCondenseNotice(null), 3500);
    } else {
      setCondenseNotice('Nội Dung Đã Rất Tinh Gọn, Không Cần Cắt Bớt!');
      setTimeout(() => setCondenseNotice(null), 3000);
    }
  };

  const getStatusBadge = () => {
    switch (metrics.status) {
      case 'optimal':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          barColor: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />,
          label: 'Chuẩn 1 Trang A4'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          barColor: 'bg-amber-500',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5 shrink-0" />,
          label: 'Gần Đầy Trang 1'
        };
      case 'overflow':
      default:
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          barColor: 'bg-rose-500',
          icon: <AlertTriangle className="w-4 h-4 text-rose-600 mr-1.5 shrink-0" />,
          label: `Tràn Sang Trang ${metrics.pageCount}`
        };
    }
  };

  const badge = getStatusBadge();
  const fillWidth = Math.min(100, metrics.firstPageFillPercent);

  const densityOptions: { id: SpacingDensity; label: string; icon: React.ReactNode }[] = [
    { id: 'compact', label: 'Thu Gọn', icon: <Minimize2 className="w-3.5 h-3.5 mr-1" /> },
    { id: 'standard', label: 'Tiêu Chuẩn', icon: <FileText className="w-3.5 h-3.5 mr-1" /> },
    { id: 'relaxed', label: 'Thoáng', icon: <Maximize2 className="w-3.5 h-3.5 mr-1" /> }
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-xs p-3.5 mb-4 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Khối Trạng thái & Thước đo A4 */}
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Dung Lượng Trang A4
              </span>
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full"
                title="Tìm hiểu về chuẩn trang A4"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
              {badge.icon}
              <span>{badge.label} ({metrics.firstPageFillPercent}%)</span>
            </div>
          </div>

          {/* Thanh Tiến trình Dung lượng */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 relative">
            <div
              className={`h-full ${badge.barColor} transition-all duration-300 rounded-full`}
              style={{ width: `${fillWidth}%` }}
            />
            {/* Vạch mốc 100% */}
            <div 
              className="absolute top-0 bottom-0 right-0 w-0.5 bg-rose-400/80 z-10" 
              title="Ngưỡng tối đa 1 trang A4" 
            />
          </div>
        </div>

        {/* Khối Điều khiển Mật độ & Tối ưu thông minh */}
        <div className="flex flex-wrap items-center gap-2 pt-1 lg:pt-0">
          {/* Bộ chọn Mật độ (Density Pills) */}
          <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {densityOptions.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onDensityChange(opt.id)}
                className={`inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                  spacingDensity === opt.id
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>

          {/* Nút 1-Click AI Auto-Condense khi gần đầy hoặc tràn trang */}
          {(metrics.status === 'warning' || metrics.status === 'overflow') && (
            <button
              type="button"
              onClick={handleAutoCondense}
              className="inline-flex items-center text-xs font-semibold px-4 py-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg shadow-xs hover:shadow-md transition-all active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
              AI Thu Gọn Tự Động
            </button>
          )}
        </div>
      </div>

      {/* Thông báo Tối ưu nhanh */}
      {condenseNotice && (
        <div className="mt-2.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center animate-in fade-in slide-in-from-top-1">
          <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
          <span>{condenseNotice}</span>
        </div>
      )}

      {/* Popover Giải thích Tiêu chuẩn Trang A4 */}
      {showInfo && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800 mb-1">
            Tại Sao Nên Giữ CV Chuẩn 1 Trang A4?
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Nhà tuyển dụng chỉ dành trung bình 6–8 giây lướt qua một bản CV.</li>
            <li>CV bị tràn vài dòng sang trang 2 khiến bố cục rời rạc và thiếu chuyên nghiệp khi in ấn.</li>
            <li>Hệ thống ATS quét văn bản liền mạch đạt điểm tương thích từ khóa cao hơn khi nội dung súc tích.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PageBudgetGuardBar;
