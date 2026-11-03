import React from 'react';
import { Sun, Moon, Clock, Sunrise, Sunset, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleSwitchProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showSolarBadge?: boolean;
}

export default function ThemeToggleSwitch({
  className = '',
  size = 'md',
  showLabel = false,
  showSolarBadge = true,
}: ThemeToggleSwitchProps) {
  const { theme, isDark, preference, solarInfo, toggleTheme, resetToSolar } = useTheme();
  const isSolar = preference === 'solar';

  // Kích thước chuẩn chỉnh tương ứng với từng size
  const sizeConfig = {
    sm: {
      track: 'w-12 h-6 p-0.5',
      knob: 'w-5 h-5',
      translateDark: 'translate-x-6',
      iconSize: 'w-3 h-3',
      labelClass: 'text-[11px]',
      badgeText: 'text-[10px]',
    },
    md: {
      track: 'w-14 h-7 p-0.5',
      knob: 'w-6 h-6',
      translateDark: 'translate-x-7',
      iconSize: 'w-3.5 h-3.5',
      labelClass: 'text-xs',
      badgeText: 'text-[10px]',
    },
    lg: {
      track: 'w-16 h-8 p-1',
      knob: 'w-6 h-6',
      translateDark: 'translate-x-8',
      iconSize: 'w-4 h-4',
      labelClass: 'text-sm',
      badgeText: 'text-xs',
    },
  }[size];

  // Tooltip chi tiết theo ngữ cảnh mặt trời và thời gian
  const tooltipText = isSolar
    ? solarInfo.isDaylight
      ? `☀️ Chế độ Thời Gian: Ban ngày (${solarInfo.currentTime}) → Màn hình Sáng.\n• Bình minh: ${solarInfo.sunriseTime} (Bật Sáng)\n• Mặt trời lặn: ${solarInfo.sunsetTime} (Tự động chuyển Tối)\n• ${solarInfo.nextTransitionLabel}\n(Nhấn công tắc để gạt thủ công)`
      : `🌙 Chế độ Thời Gian: Sau khi mặt trời lặn (${solarInfo.currentTime}) → Màn hình Tối.\n• Mặt trời lặn: ${solarInfo.sunsetTime} (Bật Tối)\n• Bình minh: ${solarInfo.sunriseTime} (Tự động chuyển Sáng)\n• ${solarInfo.nextTransitionLabel}\n(Nhấn công tắc để gạt thủ công)`
    : `⚙️ Chế độ Thủ Công: Đang bật ${isDark ? 'Tối' : 'Sáng'}.\nNhấn nút "Tự động" bên cạnh để trở về chế độ chuyển màu theo chu kỳ Mặt Trời.`;

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Nhãn hiển thị trạng thái nếu được bật (ví dụ trong Mobile Menu) */}
      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-semibold transition-colors ${sizeConfig.labelClass} ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {isDark ? 'Chế độ Tối' : 'Chế độ Sáng'}
            <span className="ml-1 text-[10px] font-normal text-slate-600 dark:text-slate-400">
              {isSolar ? '(Theo giờ mặt trời)' : '(Thủ công)'}
            </span>
          </span>
          {!isSolar && (
            <button
              type="button"
              onClick={resetToSolar}
              className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline text-left cursor-pointer"
            >
              Đặt lại tự động theo giờ
            </button>
          )}
        </div>
      )}

      {/* Công tắc gạt (Sliding Switch Track) */}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Chuyển đổi chế độ sáng tối"
        title={tooltipText}
        onClick={toggleTheme}
        className={`relative inline-flex items-center rounded-full border transition-all duration-300 ease-in-out cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
          sizeConfig.track
        } ${
          isDark
            ? 'bg-gradient-to-r from-[#0b101d] via-[#141c33] to-[#1e1b4b] border-indigo-500/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_12px_rgba(99,102,241,0.3)]'
            : 'bg-gradient-to-r from-amber-100 via-yellow-100 to-sky-100 border-amber-300/80 shadow-[inset_0_2px_4px_rgba(217,119,6,0.15),0_0_10px_rgba(251,191,36,0.2)]'
        }`}
      >
        {/* Biểu tượng nền cố định 2 bên trong lòng rãnh trượt */}
        <span
          className={`absolute left-1.5 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
            isDark ? 'opacity-25 text-amber-500/60' : 'opacity-80 text-amber-600'
          }`}
          aria-hidden="true"
        >
          <Sun className={sizeConfig.iconSize} />
        </span>

        <span
          className={`absolute right-1.5 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
            isDark ? 'opacity-95 text-indigo-300' : 'opacity-35 text-slate-400'
          }`}
          aria-hidden="true"
        >
          <Moon className={sizeConfig.iconSize} />
        </span>

        {/* Viên bi / Cần gạt trượt (Sliding Knob) */}
        <span
          className={`rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
            sizeConfig.knob
          } ${
            isDark
              ? `${sizeConfig.translateDark} bg-[#0d1322] border border-indigo-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.8),0_0_8px_rgba(129,140,248,0.35)]`
              : 'translate-x-0 bg-white border border-amber-200 shadow-[0_2px_6px_rgba(245,158,11,0.25)]'
          }`}
        >
          {isDark ? (
            <Moon
              className={`${sizeConfig.iconSize} text-indigo-300 fill-indigo-400/30 transform -rotate-12 transition-transform duration-300`}
            />
          ) : (
            <Sun
              className={`${sizeConfig.iconSize} text-amber-500 fill-amber-400/20 transform rotate-0 transition-transform duration-300`}
            />
          )}
        </span>
      </button>

      {/* Huy hiệu hiển thị chu kỳ mặt trời / thời gian thực (Solar Badge) */}
      {showSolarBadge && size !== 'sm' && (
        isSolar ? (
          <div
            title={tooltipText}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs transition-all hover:border-indigo-400/50 cursor-help"
          >
            {/* Chấm tròn hiệu ứng sáng nhấp nháy báo hiệu đang đồng bộ thời gian thực */}
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                solarInfo.isDaylight ? 'bg-amber-400' : 'bg-indigo-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                solarInfo.isDaylight ? 'bg-amber-500' : 'bg-indigo-500'
              }`} />
            </span>

            {/* Icon theo giai đoạn thời gian */}
            {solarInfo.isDaylight ? (
              <Sunrise className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            ) : (
              <Sunset className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
            )}

            <span className={`${sizeConfig.badgeText} font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap`}>
              {solarInfo.currentTime}
            </span>

            <span className="hidden lg:inline text-[9px] font-medium px-1 py-0.2 rounded bg-amber-500/10 dark:bg-indigo-500/15 text-amber-700 dark:text-indigo-300">
              {solarInfo.isDaylight ? 'Sáng' : 'Tối'}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={resetToSolar}
            title="Đang bật chế độ thủ công. Nhấn vào đây để bật lại chế độ Tự Động đổi màu theo thời gian Mặt Trời (Sáng 06:00 - Tối 18:00)"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 dark:bg-indigo-500/15 dark:hover:bg-indigo-500/25 border border-amber-300 dark:border-indigo-500/40 text-[10px] font-semibold text-amber-800 dark:text-indigo-200 transition-all cursor-pointer shadow-2xs group"
          >
            <Clock className="w-3 h-3 text-amber-600 dark:text-indigo-400 group-hover:rotate-45 transition-transform" />
            <span>Bật Tự Động</span>
          </button>
        )
      )}
    </div>
  );
}
