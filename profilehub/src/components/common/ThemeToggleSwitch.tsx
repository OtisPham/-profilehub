import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleSwitchProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ThemeToggleSwitch({
  className = '',
  size = 'md',
  showLabel = false,
}: ThemeToggleSwitchProps) {
  const { theme, isDark, toggleTheme } = useTheme();

  // Kích thước chuẩn chỉnh tương ứng với từng size
  const sizeConfig = {
    sm: {
      track: 'w-12 h-6 p-0.5',
      knob: 'w-5 h-5',
      translateDark: 'translate-x-6',
      iconSize: 'w-3 h-3',
      labelClass: 'text-[11px]',
    },
    md: {
      track: 'w-14 h-7 p-0.5',
      knob: 'w-6 h-6',
      translateDark: 'translate-x-7',
      iconSize: 'w-3.5 h-3.5',
      labelClass: 'text-xs',
    },
    lg: {
      track: 'w-16 h-8 p-1',
      knob: 'w-6 h-6',
      translateDark: 'translate-x-8',
      iconSize: 'w-4 h-4',
      labelClass: 'text-sm',
    },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {showLabel && (
        <span className={`font-semibold transition-colors ${sizeConfig.labelClass} ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {isDark ? 'Chế độ Tối' : 'Chế độ Sáng'}
        </span>
      )}

      {/* Công tắc gạt (Sliding Switch Track) */}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Chuyển đổi chế độ sáng tối"
        title={
          isDark
            ? 'Đang bật chế độ Tối (Nhấn để gạt sang chế độ Sáng)'
            : 'Đang bật chế độ Sáng (Nhấn để gạt sang chế độ Tối)'
        }
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
    </div>
  );
}
